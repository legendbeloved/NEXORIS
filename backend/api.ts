import express from "express";
import Database from "better-sqlite3";
import { GoogleGenAI } from "@google/genai";

function getDbPath() {
  if (process.env.SQLITE_PATH) return process.env.SQLITE_PATH;
  if (process.env.VERCEL) return "/tmp/nexoris.db";
  return "nexoris.db";
}

function initDb() {
  const db = new Database(getDbPath());

  db.exec(`
  CREATE TABLE IF NOT EXISTS prospects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    location TEXT,
    website TEXT,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'discovered',
    gap_analysis TEXT,
    pain_points TEXT,
    agent_id INTEGER,
    token TEXT UNIQUE,
    lead_score INTEGER,
    signals TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prospect_id INTEGER,
    sender TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(prospect_id) REFERENCES prospects(id)
  );

  CREATE TABLE IF NOT EXISTS outreach (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prospect_id INTEGER,
    variant TEXT,
    subject TEXT,
    body TEXT,
    mockup_preview TEXT,
    sent_at DATETIME,
    opened_at DATETIME,
    clicked_at DATETIME,
    FOREIGN KEY(prospect_id) REFERENCES prospects(id)
  );

  CREATE TABLE IF NOT EXISTS deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prospect_id INTEGER,
    amount REAL,
    status TEXT,
    closed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(prospect_id) REFERENCES prospects(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    type TEXT,
    agent_id INTEGER,
    read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prospect_id INTEGER,
    service_type TEXT,
    status TEXT DEFAULT 'pending',
    files TEXT,
    deadline DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(prospect_id) REFERENCES prospects(id)
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_name TEXT NOT NULL,
    value REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `);

  try {
    db.prepare("ALTER TABLE prospects ADD COLUMN lead_score INTEGER").run();
  } catch { }
  try {
    db.prepare("ALTER TABLE prospects ADD COLUMN signals TEXT").run();
  } catch { }

  return db;
}

function createGenAI() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "";
  return new GoogleGenAI({ apiKey: key });
}

async function generateAIContent(genAI: GoogleGenAI, modelName: string, prompt: string, isJson = false) {
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_AI_API_KEY) {
    return isJson ? "[]" : "";
  }

  try {
    const response = await genAI.models.generateContent({
      model: modelName,
      contents: prompt,
      config: isJson ? { responseMimeType: "application/json" } : undefined,
    });
    const text = response?.text?.toString?.() || "";
    return text;
  } catch {
    return isJson ? "{}" : "";
  }
}

function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  try {
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

async function searchPlaces(query: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json() as any;
    if (data.status === 'OK') {
      return data.results.map((r: any) => ({
        name: r.name,
        website: r.website || `https://www.google.com/search?q=${encodeURIComponent(r.name)}`,
        address: r.formatted_address,
        placeId: r.place_id
      }));
    }
    return null;
  } catch {
    return null;
  }
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  if (!apiKey) return null;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ from, to, subject, html })
    });
    return await res.json();
  } catch {
    return null;
  }
}

async function createBooking(prospectId: number, email: string) {
  const apiKey = process.env.CAL_COM_API_KEY;
  if (!apiKey) return { success: false, message: "Cal.com API key not configured" };

  try {
    // This is a simplified mock of the Cal.com API booking flow
    // In a real implementation, you would use their /bookings endpoint
    return { success: true, bookingUrl: `https://cal.com/nexoris/consultation?email=${encodeURIComponent(email)}` };
  } catch {
    return { success: false };
  }
}

function normalizeNotification(row: any) {
  const id = String(row.id);
  const createdAt = row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString();
  const type = (row.type || "info").toString();
  const title =
    type === "success"
      ? "Success"
      : type === "warning"
        ? "Warning"
        : type === "error"
          ? "Error"
          : "Info";
  const priority = type === "error" ? "URGENT" : type === "warning" ? "HIGH" : "NORMAL";
  return {
    id,
    type,
    title,
    message: row.message,
    priority,
    action_url: null,
    is_read: !!row.read,
    requires_action: false,
    created_at: createdAt,
  };
}

export function createApiApp() {
  const app = express();
  app.use(express.json());

  const db = initDb();
  const genAI = createGenAI();
  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/config", (_req, res) => {
    const row = db.prepare("SELECT value FROM settings WHERE key = 'agent_config'").get() as any;
    const value = safeJsonParse(row?.value, {});
    res.json(value);
  });

  app.patch("/api/config", (req, res) => {
    const payload = req.body || {};
    const serialized = JSON.stringify(payload);
    db.prepare(
      "INSERT INTO settings (key, value) VALUES ('agent_config', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
    ).run(serialized);
    res.json({ status: "ok" });
  });

  app.get("/api/prospects", (req, res) => {
    const { page = 1, limit = 10, search = "", status = "", category = "" } = req.query as any;
    const offset = (Number(page) - 1) * Number(limit);

    let query = "SELECT * FROM prospects WHERE name LIKE ?";
    const params: any[] = [`%${search}%`];

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    query += " ORDER BY updated_at DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), offset);

    const rows = db.prepare(query).all(...params) as any[];
    const prospects = rows.map((r) => {
      const painPoints = safeJsonParse<string[]>(r.pain_points, []);
      const signals = safeJsonParse<any>(r.signals, {});
      return {
        ...r,
        painPoints,
        signals,
      };
    });
    const total = db.prepare("SELECT COUNT(*) as count FROM prospects").get() as any;
    res.json({ prospects, total: total.count });
  });

  app.get("/api/prospects/:id", (req, res) => {
    const id = Number(req.params.id);
    const row = db.prepare("SELECT * FROM prospects WHERE id = ?").get(id) as any;
    if (!row) return res.status(404).json({ error: "Prospect not found" });

    const painPoints = safeJsonParse<string[]>(row.pain_points, []);
    const signals = safeJsonParse<any>(row.signals, {});
    const outreach = db.prepare("SELECT * FROM outreach WHERE prospect_id = ? ORDER BY sent_at DESC").all(id);
    const messages = db.prepare("SELECT * FROM messages WHERE prospect_id = ? ORDER BY created_at ASC").all(id);

    res.json({
      ...row,
      painPoints,
      signals,
      outreach,
      messages
    });
  });

  app.get("/api/stats", (_req, res) => {
    const totalProspects = db.prepare("SELECT COUNT(*) as count FROM prospects").get() as any;
    const emailsSent = db.prepare("SELECT COUNT(*) as count FROM outreach").get() as any;
    const dealsClosed = db.prepare("SELECT COUNT(*) as count FROM deals WHERE status = 'paid'").get() as any;
    const revenue = db.prepare("SELECT SUM(amount) as total FROM deals WHERE status = 'paid'").get() as any;

    const stages = ["discovered", "contacted", "opened", "replied", "interested", "agreed", "paid", "delivered"];
    const funnel = stages.map((stage) => {
      const count = db.prepare("SELECT COUNT(*) as count FROM prospects WHERE status = ?").get(stage) as any;
      return { stage, count: count.count };
    });

    res.json({
      totalProspects: totalProspects.count,
      emailsSent: emailsSent.count,
      dealsClosed: dealsClosed.count,
      revenue: revenue.total || 0,
      funnel,
    });
  });

  app.get("/api/analytics/revenue", (_req, res) => {
    const data = [
      { week: "W1", revenue: 1200, deals: 2 },
      { week: "W2", revenue: 2100, deals: 3 },
      { week: "W3", revenue: 800, deals: 1 },
      { week: "W4", revenue: 3400, deals: 5 },
      { week: "W5", revenue: 2900, deals: 4 },
      { week: "W6", revenue: 4500, deals: 6 },
      { week: "W7", revenue: 5200, deals: 7 },
    ];
    res.json(data);
  });

  app.get("/api/notifications", (req, res) => {
    const { page = 1, limit = 20 } = req.query as any;
    const p = Math.max(1, Number(page));
    const l = Math.min(100, Math.max(1, Number(limit)));
    const offset = (p - 1) * l;

    const totalRow = db.prepare("SELECT COUNT(*) as count FROM notifications").get() as any;
    const unreadRow = db.prepare("SELECT COUNT(*) as count FROM notifications WHERE read = 0").get() as any;
    const rows = db
      .prepare("SELECT * FROM notifications ORDER BY created_at DESC LIMIT ? OFFSET ?")
      .all(l, offset) as any[];

    res.json({
      success: true,
      data: {
        notifications: rows.map(normalizeNotification),
        total: totalRow.count,
        unread_count: unreadRow.count,
        page: p,
        limit: l,
      },
    });
  });

  app.get("/api/notifications/unread-count", (_req, res) => {
    const unreadRow = db.prepare("SELECT COUNT(*) as count FROM notifications WHERE read = 0").get() as any;
    res.json({ count: unreadRow.count });
  });

  app.post("/api/notifications/read-all", (_req, res) => {
    db.prepare("UPDATE notifications SET read = 1 WHERE read = 0").run();
    res.json({ success: true });
  });

  app.patch("/api/notifications/:id/read", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ success: false });
    db.prepare("UPDATE notifications SET read = 1 WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.get("/api/client/auth/:token", (req, res) => {
    const { token } = req.params;
    const prospect = db.prepare("SELECT * FROM prospects WHERE token = ?").get(token) as any;
    if (!prospect) return res.status(404).json({ error: "Invalid token" });

    const messages = db
      .prepare("SELECT * FROM messages WHERE prospect_id = ? ORDER BY created_at ASC")
      .all(prospect.id) as any[];
    const outreach = db
      .prepare("SELECT mockup_preview FROM outreach WHERE prospect_id = ? ORDER BY sent_at DESC LIMIT 1")
      .get(prospect.id) as any;

    res.json({ prospect: { ...prospect, mockup_preview: outreach?.mockup_preview || "" }, messages });
  });

  app.post("/api/client/message", async (req, res) => {
    const { token, content } = req.body || {};
    const prospect = db.prepare("SELECT id, name FROM prospects WHERE token = ?").get(token) as any;
    if (!prospect) return res.status(404).json({ error: "Invalid token" });

    db.prepare("INSERT INTO messages (prospect_id, sender, content) VALUES (?, ?, ?)").run(
      prospect.id,
      "client",
      content,
    );

    setTimeout(async () => {
      try {
        const prompt = `You are Agent 3 from NEXORIS. A client named "${prospect.name}" just sent this message: "${content}". Respond professionally, address their concerns, and guide them towards the next step (booking a call or paying). If they seem ready to talk, offer them this booking link: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking. Keep it concise and friendly.`;
        const replyText = await generateAIContent(genAI, modelName, prompt);
        const reply = replyText || "I've received your message. Would you like to schedule a quick 15-minute call to discuss this further?";

        if (reply.toLowerCase().includes("booking") || reply.toLowerCase().includes("schedule")) {
          const booking = await createBooking(prospect.id, prospect.email || "");
          if (booking.success) {
            // Optionally append or specialized handling
          }
        }

        db.prepare("INSERT INTO messages (prospect_id, sender, content) VALUES (?, ?, ?)").run(
          prospect.id,
          "agent",
          reply,
        );

        db.prepare("INSERT INTO notifications (message, type, agent_id) VALUES (?, ?, ?)").run(
          `New message from ${prospect.name} in client portal.`,
          "info",
          3,
        );
      } catch { }
    }, 2000);

    res.json({ status: "success" });
  });

  app.post("/api/client/pay", (req, res) => {
    const { token, serviceType } = req.body || {};
    const prospect = db.prepare("SELECT * FROM prospects WHERE token = ?").get(token) as any;
    if (!prospect) return res.status(404).json({ error: "Invalid token" });

    const amount = 1200;
    const service = serviceType || "Digital Transformation";
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 14);

    db.prepare("UPDATE prospects SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(prospect.id);
    db.prepare("INSERT INTO deals (prospect_id, amount, status) VALUES (?, ?, ?)").run(prospect.id, amount, "paid");
    db.prepare("INSERT INTO projects (prospect_id, service_type, status, deadline) VALUES (?, ?, 'in_progress', ?)").run(
      prospect.id,
      service,
      deadline.toISOString(),
    );
    db.prepare("INSERT INTO notifications (message, type, agent_id) VALUES (?, ?, ?)").run(
      `Payment received! Project "${service}" for ${prospect.name} is now underway.`,
      "success",
      3,
    );

    res.json({ status: "success", checkoutUrl: "https://checkout.stripe.com/pay/mock_session" });
  });

  app.post("/api/agents/discovery", async (req, res) => {
    const cfgRow = db.prepare("SELECT value FROM settings WHERE key = 'agent_config'").get() as any;
    const cfg = safeJsonParse<any>(cfgRow?.value, {});
    const { category, location } = req.body || {};
    const targetCategory = category || cfg?.global?.categories?.[0] || "E-commerce";
    const targetLocation = location || cfg?.global?.targetRegion || "San Francisco, CA";
    const depth = cfg?.agent1?.searchDepth ?? 4;
    const revenueWeight = cfg?.agent1?.scoringWeightRevenue ?? 85;
    const criteria = Array.isArray(cfg?.agent1?.gapCriteria) ? cfg.agent1.gapCriteria.join(", ") : "Slow mobile site, No online booking, Poor SEO";

    const businessesPrompt = `Generate 5 real-looking business names and websites for the category "${targetCategory}" in "${targetLocation}". 
Return a JSON array of objects with keys "name" and "website". 
Use local-sounding names. If the category is general, be specific.`;

    let mockBusinesses: any[] = [];
    const realPlaces = await searchPlaces(`${targetCategory} in ${targetLocation}`);

    if (realPlaces && realPlaces.length > 0) {
      mockBusinesses = realPlaces.slice(0, 5);
    } else {
      const businessesJson = await generateAIContent(genAI, modelName, businessesPrompt, true);
      mockBusinesses = safeJsonParse<any[]>(businessesJson, []);
    }
    if (!Array.isArray(mockBusinesses) || mockBusinesses.length === 0) {
      mockBusinesses = [{ name: `${targetCategory} Expert`, website: "example-business.com" }];
    }

    const fetchText = async (url: string) => {
      try {
        const proto = url.startsWith("http") ? url : `https://${url}`;
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 4000);
        const r = await fetch(proto, { signal: controller.signal });
        clearTimeout(t);
        const html = await r.text();
        const text = html
          .replace(/<script[\s\S]*?<\/script>/gi, " ")
          .replace(/<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        return text.slice(0, 2000);
      } catch {
        return "";
      }
    };

    const scoreFromSignals = (signals: any) => {
      let score = 50;
      if (signals?.hasBooking) score += 10;
      if (signals?.hasBlog) score += 5;
      if (signals?.hasContact) score += 10;
      if (signals?.mobileIssues) score -= 10;
      if (signals?.seoIssues) score -= 10;
      score = Math.max(0, Math.min(100, Math.round(score)));
      score = Math.round(score * (revenueWeight / 100) + score * (1 - revenueWeight / 100));
      return score;
    };

    for (const biz of mockBusinesses) {
      try {
        const token =
          Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const siteText = await fetchText(biz.website);

        const analysisPrompt = `You are Agent 1. Analyze the digital presence gaps of a business.\nBusiness: ${biz.name}\nWebsite: ${biz.website}\nLocation: ${targetLocation}\nCategory: ${targetCategory}\nGap criteria: ${criteria}\nWebsite text snippet:\n${siteText}\nReturn JSON with keys:\n- gapAnalysis: string (short)\n- painPoints: string[]\n- email: string\n- phone: string\n- signals: object { hasBooking:boolean, mobileIssues:boolean, seoIssues:boolean, hasContact:boolean, hasBlog:boolean }\n- quickWin: string\nKeep it realistic.\n`;

        const analysisJson = await generateAIContent(genAI, modelName, analysisPrompt, true);
        const data = safeJsonParse<any>(analysisJson, {});

        const gapAnalysis = (data.gapAnalysis || "No clear gaps found.").toString();
        const quickWin = (data.quickWin || "").toString();
        const finalGapAnalysis = quickWin ? `${gapAnalysis}\nQuick Win: ${quickWin}` : gapAnalysis;
        const painPoints = JSON.stringify(Array.isArray(data.painPoints) ? data.painPoints : ["Slow mobile performance"]);
        const email = data.email || `contact@${String(biz.website).replace(/^https?:\/\//, "").replace(/\/.*/, "")}`;
        const phone = data.phone || "(555) 000-0000";
        const signals = JSON.stringify(data.signals || {});
        const leadScore = scoreFromSignals(data.signals || {});

        db.prepare(
          `
          INSERT INTO prospects (name, category, location, website, email, phone, gap_analysis, pain_points, token, lead_score, signals)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        ).run(biz.name, targetCategory, targetLocation, biz.website, email, phone, finalGapAnalysis, painPoints, token, leadScore, signals);

        db.prepare("INSERT INTO notifications (message, type, agent_id) VALUES (?, ?, ?)").run(
          `Agent 1 analyzed ${biz.name}: score ${leadScore}`,
          "success",
          1,
        );
      } catch { }
    }

    res.json({ status: "success", message: "Discovery complete", depth });
  });

  app.post("/api/agents/outreach", async (_req, res) => {
    const cfgRow = db.prepare("SELECT value FROM settings WHERE key = 'agent_config'").get() as any;
    const cfg = safeJsonParse<any>(cfgRow?.value, {});
    const sendLimit = Math.min(1000, Math.max(1, cfg?.agent2?.dailySendLimit || 5));
    const identity = cfg?.agent2?.senderIdentity || "Executive Concierge (Sarah)";
    const tone = cfg?.agent2?.brandTone || "Professional";
    const profile = cfg?.agent2?.personalityProfile || "Empathetic";
    const smartSched = !!cfg?.agent2?.smartScheduling;
    const ab = !!cfg?.agent2?.abTesting;
    const prospects = db.prepare("SELECT * FROM prospects WHERE status = 'discovered' LIMIT ?").all(sendLimit) as any[];

    for (const p of prospects) {
      try {
        const pains = safeJsonParse<any[]>(p.pain_points, []);
        const signals = safeJsonParse<any>(p.signals, {});
        const score = Number(p.lead_score || 50);
        const variants = ab ? ["A", "B"] : ["A"];

        if (smartSched) { }

        for (const v of variants) {
          const style = v === "A" ? "Consultative, helpful, friendly" : "Direct, ROI-focused, concise";
          const prompt = `You are ${identity}. Tone: ${tone}. Personality Profile: ${profile}. Style: ${style}.
Prospect: "${p.name}" Website: "${p.website}"
Gaps: ${p.gap_analysis}
Top pains: ${Array.isArray(pains) ? pains.join("; ") : ""}
Signals: ${JSON.stringify(signals)}
Lead score: ${score}
Write JSON with keys "subject" and "body" and "mockup_description".
- The "mockup_description" should describe a custom digital solution we've prepared for them.
- Personalize with one specific detail from gaps or signals
- CTA: ${score >= 70 ? "Invite to quick call with calendar link placeholder" : "Offer free consultation"}
- Keep body under 120 words
- Signature includes ${identity}`;

          const responseText = await generateAIContent(genAI, modelName, prompt, true);
          const j = safeJsonParse<any>(responseText, {});
          const subject =
            (j.subject || "").toString().trim() ||
            `Quick idea to improve ${p.name}'s ${p.category || "website"}`.trim();
          const body =
            (j.body || "").toString().trim() ||
            `Hi ${p.name},\n\nNoticed a couple quick wins on ${p.website} that could improve conversions. If you're open to it, I can share a short audit + a lightweight mockup concept.\n\nBest,\n${identity}`.trim();
          const mockup = (j.mockup_description || "").toString().trim() || "A performance-optimized landing + booking flow concept.";
          db.prepare("INSERT INTO outreach (prospect_id, variant, subject, body, mockup_preview, sent_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)").run(
            p.id,
            v,
            subject,
            body,
            mockup,
          );
        }

        // Try to send real email if prospect has one
        if (p.email && process.env.RESEND_API_KEY) {
          await sendEmail(
            p.email,
            `Quick idea for ${p.name}`,
            `<p>Hi ${p.name},</p><p>Noticed some digital gaps on your site ${p.website}. I've prepared a custom mockup for you.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client/${p.token}">View your personalized portal here</a></p>`
          );
        }

        db.prepare("UPDATE prospects SET status = 'contacted' WHERE id = ?").run(p.id);
        db.prepare("INSERT INTO notifications (message, type, agent_id) VALUES (?, ?, ?)").run(
          `Agent 2 prepared outreach${ab ? " (A/B)" : ""} for ${p.name}${p.email && process.env.RESEND_API_KEY ? " and sent via Resend" : ""}.`,
          "info",
          2,
        );
      } catch { }
    }

    res.json({ status: "success", message: "Outreach complete", processed: prospects.length });
  });

  app.post("/api/agents/mission", async (req, res) => {
    try {
      const { category, location } = req.body || {};
      const host = req.headers.host;
      const proto = (req.headers["x-forwarded-proto"] as string) || "http";
      if (!host) return res.status(400).json({ status: "error", message: "Missing host header" });
      const baseUrl = `${proto}://${host}`;

      const discoveryRes = await fetch(`${baseUrl}/api/agents/discovery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, location }),
      });
      const discovery = discoveryRes.ok ? await discoveryRes.json() : { status: "error" };

      const outreachRes = await fetch(`${baseUrl}/api/agents/outreach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const outreach = outreachRes.ok ? await outreachRes.json() : { status: "error" };

      res.json({ status: "success", discovery, outreach });
    } catch (e) {
      res.status(500).json({ status: "error", message: "Mission failed" });
    }
  });

  app.get("/api/outreach", (_req, res) => {
    const outreach = db
      .prepare(
        `
      SELECT outreach.*, prospects.name as prospect_name 
      FROM outreach 
      JOIN prospects ON outreach.prospect_id = prospects.id 
      ORDER BY sent_at DESC 
      LIMIT 100
    `,
      )
      .all() as any[];
    res.json(outreach);
  });

  app.get("/api/deals", (_req, res) => {
    const deals = db
      .prepare(
        `
      SELECT deals.*, prospects.name as client_name 
      FROM deals 
      JOIN prospects ON deals.prospect_id = prospects.id 
      ORDER BY closed_at DESC 
      LIMIT 50
    `,
      )
      .all() as any[];
    res.json(deals);
  });

  app.get("/api/projects", (_req, res) => {
    const projects = db.prepare(`
      SELECT projects.*, prospects.name as client_name 
      FROM projects 
      JOIN prospects ON projects.prospect_id = prospects.id
      ORDER BY created_at DESC
    `).all();
    res.json(projects);
  });

  app.get("/api/projects/:id", (req, res) => {
    const id = Number(req.params.id);
    const project = db.prepare(`
      SELECT projects.*, prospects.name as client_name, prospects.email as client_email
      FROM projects 
      JOIN prospects ON projects.prospect_id = prospects.id
      WHERE projects.id = ?
    `).get(id) as any;

    if (!project) return res.status(404).json({ error: "Project not found" });

    const messages = db.prepare("SELECT * FROM messages WHERE prospect_id = ? ORDER BY created_at ASC").all(project.prospect_id);

    res.json({ ...project, messages });
  });

  return app;
}
