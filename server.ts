import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config(); // also load .env if it exists

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("nexoris.db");
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "");

async function generateAIContent(modelName: string, prompt: string, isJson: boolean = false) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: isJson ? { responseMimeType: "application/json" } : undefined
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (e) {
    console.error(`AI Error (${modelName}):`, e);
    return "";
  }
}

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS prospects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    location TEXT,
    website TEXT,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'discovered', -- discovered, contacted, opened, replied, interested, agreed, paid, delivered
    gap_analysis TEXT,
    pain_points TEXT, -- JSON array
    agent_id INTEGER,
    token TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migrations: Add columns if they don't exist
try { db.prepare("ALTER TABLE prospects ADD COLUMN token TEXT UNIQUE").run(); } catch (e) { }
try { db.prepare("ALTER TABLE prospects ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP").run(); } catch (e) { }

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prospect_id INTEGER,
    sender TEXT, -- agent, client
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
    status TEXT, -- pending, paid
    closed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(prospect_id) REFERENCES prospects(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    type TEXT, -- info, success, warning, error
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
    status TEXT DEFAULT 'pending', -- pending, in_progress, review, delivered
    files TEXT, -- JSON array of file objects
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

try { db.prepare("ALTER TABLE prospects ADD COLUMN lead_score INTEGER").run(); } catch (e) { }
try { db.prepare("ALTER TABLE prospects ADD COLUMN signals TEXT").run(); } catch (e) { }

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3008;

  console.log(`Initializing NEXORIS on port ${PORT}...`);

  app.use(express.json());

  // Setup Vite
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      hmr: process.env.VITE_HMR_PORT ? { port: parseInt(process.env.VITE_HMR_PORT) } : undefined
    },
    appType: "spa",
  });

  app.use(vite.middlewares);

  // API Routes
  // Config: store/retrieve agent configuration (JSON under settings.key='agent_config')
  app.get("/api/config", (req, res) => {
    const row = db.prepare("SELECT value FROM settings WHERE key = 'agent_config'").get() as any;
    let value = {};
    try { value = row?.value ? JSON.parse(row.value) : {}; } catch (e) { value = {}; }
    res.json(value);
  });

  app.patch("/api/config", (req, res) => {
    const payload = req.body || {};
    const serialized = JSON.stringify(payload);
    db.prepare("INSERT INTO settings (key, value) VALUES ('agent_config', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(serialized);
    res.json({ status: "ok" });
  });
  app.get("/api/prospects", (req, res) => {
    const { page = 1, limit = 10, search = "", status = "", category = "" } = req.query;
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
    const prospects = rows.map(r => {
      let painPoints: string[] = [];
      let signals: any = {};
      try { painPoints = JSON.parse(r.pain_points || "[]"); } catch {}
      try { signals = JSON.parse(r.signals || "{}"); } catch {}
      return { 
        ...r, 
        painPoints, 
        signals 
      };
    });
    const total = db.prepare("SELECT COUNT(*) as count FROM prospects").get() as any;

    res.json({ prospects, total: total.count });
  });

  app.get("/api/notifications", (req, res) => {
    const notifications = db.prepare("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50").all();
    res.json(notifications);
  });

  app.get("/api/stats", (req, res) => {
    const totalProspects = db.prepare("SELECT COUNT(*) as count FROM prospects").get() as any;
    const emailsSent = db.prepare("SELECT COUNT(*) as count FROM outreach").get() as any;
    const dealsClosed = db.prepare("SELECT COUNT(*) as count FROM deals WHERE status = 'paid'").get() as any;
    const revenue = db.prepare("SELECT SUM(amount) as total FROM deals WHERE status = 'paid'").get() as any;

    // Funnel data
    const stages = ['discovered', 'contacted', 'opened', 'replied', 'interested', 'agreed', 'paid', 'delivered'];
    const funnel = stages.map(stage => {
      const count = db.prepare("SELECT COUNT(*) as count FROM prospects WHERE status = ?").get(stage) as any;
      return { stage, count: count.count };
    });

    res.json({
      totalProspects: totalProspects.count,
      emailsSent: emailsSent.count,
      dealsClosed: dealsClosed.count,
      revenue: revenue.total || 0,
      funnel
    });
  });

  app.get("/api/analytics/revenue", (req, res) => {
    // Mock weekly revenue for the last 7 weeks
    const data = [
      { week: 'W1', revenue: 1200, deals: 2 },
      { week: 'W2', revenue: 2100, deals: 3 },
      { week: 'W3', revenue: 800, deals: 1 },
      { week: 'W4', revenue: 3400, deals: 5 },
      { week: 'W5', revenue: 2900, deals: 4 },
      { week: 'W6', revenue: 4500, deals: 6 },
      { week: 'W7', revenue: 5200, deals: 7 },
    ];
    res.json(data);
  });

  // Client Portal Routes
  app.get("/api/client/auth/:token", (req, res) => {
    const { token } = req.params;
    const prospect = db.prepare("SELECT * FROM prospects WHERE token = ?").get(token) as any;

    if (!prospect) return res.status(404).json({ error: "Invalid token" });

    const messages = db.prepare("SELECT * FROM messages WHERE prospect_id = ? ORDER BY created_at ASC").all(prospect.id) as any[];
    const outreach = db.prepare("SELECT mockup_preview FROM outreach WHERE prospect_id = ? ORDER BY sent_at DESC LIMIT 1").get(prospect.id) as any;
    
    res.json({ prospect: { ...prospect, mockup_preview: outreach?.mockup_preview || "" }, messages });
  });

  app.post("/api/client/message", async (req, res) => {
    const { token, content } = req.body;
    const prospect = db.prepare("SELECT id, name FROM prospects WHERE token = ?").get(token) as any;

    if (!prospect) return res.status(404).json({ error: "Invalid token" });

    // Insert client message
    db.prepare("INSERT INTO messages (prospect_id, sender, content) VALUES (?, ?, ?)")
      .run(prospect.id, 'client', content);

    // Simulate Agent 3 thinking and replying
    setTimeout(async () => {
      try {
        const prompt = `You are Agent 3 from NEXORIS. A client named "${prospect.name}" just sent this message: "${content}". Respond professionally, address their concerns, and guide them towards the next step (booking a call or paying). Keep it concise and friendly.`;
        const replyText = await generateAIContent("gemini-1.5-flash", prompt);
        const reply = replyText || "I've received your message and will look into this for you.";

        db.prepare("INSERT INTO messages (prospect_id, sender, content) VALUES (?, ?, ?)")
          .run(prospect.id, 'agent', reply);

        db.prepare("INSERT INTO notifications (message, type, agent_id) VALUES (?, ?, ?)")
          .run(`New message from ${prospect.name} in client portal.`, "info", 3);
      } catch (e) {
        console.error(e);
      }
    }, 2000);

    res.json({ status: "success" });
  });

  app.post("/api/client/pay", (req, res) => {
    const { token, serviceType } = req.body;
    const prospect = db.prepare("SELECT * FROM prospects WHERE token = ?").get(token) as any;

    if (!prospect) return res.status(404).json({ error: "Invalid token" });

    const amount = 1200; // Simulated amount
    const service = serviceType || "Digital Transformation";
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 14); // 2 weeks deadline

    db.prepare("UPDATE prospects SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(prospect.id);
    db.prepare("INSERT INTO deals (prospect_id, amount, status) VALUES (?, ?, ?)").run(prospect.id, amount, 'paid');
    db.prepare("INSERT INTO projects (prospect_id, service_type, status, deadline) VALUES (?, ?, 'in_progress', ?)").run(prospect.id, service, deadline.toISOString());

    db.prepare("INSERT INTO notifications (message, type, agent_id) VALUES (?, ?, ?)")
      .run(`Payment received! Project "${service}" for ${prospect.name} is now underway.`, "success", 3);

    res.json({ status: "success", checkoutUrl: "https://checkout.stripe.com/pay/mock_session" });
  });

  // Agent 1: Discovery
  app.post("/api/agents/discovery", async (req, res) => {
    const cfgRow = db.prepare("SELECT value FROM settings WHERE key = 'agent_config'").get() as any;
    const cfg = (() => { try { return cfgRow?.value ? JSON.parse(cfgRow.value) : {}; } catch { return {}; } })();
    const { category, location } = req.body;
    const targetCategory = category || (cfg?.global?.categories?.[0] || "E-commerce");
    const targetLocation = location || (cfg?.global?.targetRegion || "San Francisco, CA");
    const depth = cfg?.agent1?.searchDepth ?? 4;
    const revenueWeight = cfg?.agent1?.scoringWeightRevenue ?? 85;
    const criteria = Array.isArray(cfg?.agent1?.gapCriteria) ? cfg.agent1.gapCriteria.join(", ") : "Slow mobile site, No online booking, Poor SEO";
    const compIntel = !!cfg?.agent1?.competitorAnalysis;

    console.log(`Agent 1 starting deep scan for "${targetCategory}" in "${targetLocation}" (Depth: ${depth})`);

    // Simulate finding businesses based on category and location
    const businessesPrompt = `Generate 5 real-looking business names and websites for the category "${targetCategory}" in "${targetLocation}". 
Return a JSON array of objects with keys "name" and "website". 
Use local-sounding names. If the category is general, be specific (e.g. if category is 'Food', generate specific restaurants).`;
    
    const businessesJson = await generateAIContent("gemini-1.5-flash", businessesPrompt, true);
    let mockBusinesses = [];
    try {
      mockBusinesses = JSON.parse(businessesJson || "[]");
    } catch (e) {
      mockBusinesses = [
        { name: `${targetCategory} Expert`, website: "example-business.com" }
      ];
    }

    const fetchText = async (url: string) => {
      try {
        const proto = url.startsWith("http") ? url : `https://${url}`;
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 4000);
        const r = await fetch(proto, { signal: controller.signal });
        clearTimeout(t);
        const html = await r.text();
        const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
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
      score = Math.round((score * (revenueWeight / 100)) + (score * (1 - revenueWeight / 100)));
      return score;
    };

    for (const biz of mockBusinesses) {
      try {
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const siteText = await fetchText(biz.website);
        const prompt = `You are NEXORIS Discovery Agent (depth ${depth}). Business: "${biz.name}" Category: "${targetCategory}" Location: "${targetLocation}".
Website summary: """${siteText || "N/A"}"""
Gap criteria to consider: ${criteria}.
${compIntel ? "Also perform a brief competitor intelligence check for this business in its area." : ""}
Return JSON with keys:
- "gaps": concise paragraph summarizing top 3 digital gaps
- "painPoints": array of 2-4 pains grounded in industry context and site signals
- "signals": object flags { hasBooking, hasBlog, hasContact, mobileIssues, seoIssues }
- "email": likely professional email
- "phone": valid-looking phone
${compIntel ? '- "competitors": array of 2-3 local competitors and their strengths' : ""}`;

        const responseText = await generateAIContent("gemini-1.5-flash", prompt, true);
        const data = JSON.parse(responseText || "{}");
        const gapAnalysis = data.gaps || "No analysis available.";
        // If competitor analysis is present, append it to the gap analysis or a new field
        const finalGapAnalysis = compIntel && data.competitors 
          ? `${gapAnalysis}\n\nCompetitor Intel: ${data.competitors.map((c: any) => `${c.name} (${c.strengths})`).join(", ")}`
          : gapAnalysis;

        const painPoints = JSON.stringify(Array.isArray(data.painPoints) ? data.painPoints : ["Slow mobile performance", "No automated booking"]);
        const email = data.email || `contact@${biz.website}`;
        const phone = data.phone || "(555) 000-0000";
        const signals = JSON.stringify(data.signals || {});
        const leadScore = scoreFromSignals(data.signals || {});

        db.prepare(`
          INSERT INTO prospects (name, category, location, website, email, phone, gap_analysis, pain_points, token, lead_score, signals)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(biz.name, targetCategory, targetLocation, biz.website, email, phone, finalGapAnalysis, painPoints, token, leadScore, signals);

        db.prepare("INSERT INTO notifications (message, type, agent_id) VALUES (?, ?, ?)")
          .run(`Agent 1 analyzed ${biz.name}: score ${leadScore}`, "success", 1);
      } catch (e) {
        console.error(e);
      }
    }

    res.json({ status: "success", message: "Discovery complete" });
  });

  // Agent 2: Outreach
  app.post("/api/agents/outreach", async (req, res) => {
    const cfgRow = db.prepare("SELECT value FROM settings WHERE key = 'agent_config'").get() as any;
    const cfg = (() => { try { return cfgRow?.value ? JSON.parse(cfgRow.value) : {}; } catch { return {}; } })();
    const sendLimit = Math.min(1000, Math.max(1, cfg?.agent2?.dailySendLimit || 5));
    const identity = cfg?.agent2?.senderIdentity || "Executive Concierge (Sarah)";
    const tone = cfg?.agent2?.brandTone || "Professional";
    const profile = cfg?.agent2?.personalityProfile || "Empathetic";
    const smartSched = !!cfg?.agent2?.smartScheduling;
    const ab = !!cfg?.agent2?.abTesting;
    const prospects = db.prepare("SELECT * FROM prospects WHERE status = 'discovered' LIMIT ?").all(sendLimit) as any[];

    for (const p of prospects) {
      try {
        const pains = (() => { try { return JSON.parse(p.pain_points || "[]"); } catch { return []; } })();
        const signals = (() => { try { return JSON.parse(p.signals || "{}"); } catch { return {}; } })();
        const score = Number(p.lead_score || 50);
        const variants = ab ? ["A", "B"] : ["A"];
        
        // Smart Scheduling: Simulate delay based on "business hours" if enabled
        if (smartSched) {
          console.log(`Smart Scheduling enabled for ${p.name}. Optimizing delivery time...`);
        }

        for (const v of variants) {
          const style = v === "A" ? "Consultative, helpful, friendly" : "Direct, ROI-focused, concise";
          const prompt = `You are ${identity}. Tone: ${tone}. Personality Profile: ${profile}. Style: ${style}.
Prospect: "${p.name}" Website: "${p.website}"
Gaps: ${p.gap_analysis}
Top pains: ${Array.isArray(pains) ? pains.join("; ") : ""}
Signals: ${JSON.stringify(signals)}
Lead score: ${score}
Write JSON with keys "subject" and "body" and "mockup_description".
- The "mockup_description" should describe a custom digital solution we've prepared for them (e.g., "A modern mobile-first booking interface" or "A performance-optimized homepage redesign").
- Personalize based on the ${profile} profile (e.g., if Data-Driven, focus on numbers; if Empathetic, focus on understanding their challenges).
- Personalize with one specific detail from gaps or signals
- CTA: ${score >= 70 ? "Invite to quick call with calendar link placeholder" : "Offer free consultation"}
- Keep body under 120 words, no fluff
- Signature includes ${identity}`;

          const responseText = await generateAIContent("gemini-1.5-flash", prompt, true);
          const j = (() => { try { return JSON.parse(responseText || "{}"); } catch { return {}; } })();
          const subject = (j.subject || "").toString().trim();
          const body = (j.body || "").toString().trim();
          const mockup = (j.mockup_description || "").toString().trim();
          if (!subject || !body) continue;
          db.prepare("INSERT INTO outreach (prospect_id, variant, subject, body, mockup_preview, sent_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)")
            .run(p.id, v, subject, body, mockup);
        }
        db.prepare("UPDATE prospects SET status = 'contacted' WHERE id = ?").run(p.id);
        db.prepare("INSERT INTO notifications (message, type) VALUES (?, ?)")
          .run(`Agent 2 prepared outreach${ab ? " (A/B)" : ""} for ${p.name}.`, "info");
      } catch (e) {
        console.error(e);
      }
    }

    res.json({ status: "success", message: "Outreach complete" });
  });

  app.get("/api/outreach/preview", async (req, res) => {
    const { prospectId } = req.query as any;
    const cfgRow = db.prepare("SELECT value FROM settings WHERE key = 'agent_config'").get() as any;
    const cfg = (() => { try { return cfgRow?.value ? JSON.parse(cfgRow.value) : {}; } catch { return {}; } })();
    const identity = cfg?.agent2?.senderIdentity || "Executive Concierge (Sarah)";
    const tone = cfg?.agent2?.brandTone || "Professional";
    const ab = !!cfg?.agent2?.abTesting;
    const p = db.prepare("SELECT * FROM prospects WHERE id = ?").get(Number(prospectId)) as any;
    if (!p) return res.status(404).json({ error: "Prospect not found" });
    try {
      const pains = (() => { try { return JSON.parse(p.pain_points || "[]"); } catch { return []; } })();
      const signals = (() => { try { return JSON.parse(p.signals || "{}"); } catch { return {}; } })();
      const score = Number(p.lead_score || 50);
      const variants = ab ? ["A", "B"] : ["A"];
      const outputs: any[] = [];
      for (const v of variants) {
        const style = v === "A" ? "Consultative, helpful, friendly" : "Direct, ROI-focused, concise";
        const prompt = `You are ${identity}. Tone: ${tone}. Style: ${style}.
Prospect: "${p.name}" Website: "${p.website}"
Gaps: ${p.gap_analysis}
Top pains: ${Array.isArray(pains) ? pains.join("; ") : ""}
Signals: ${JSON.stringify(signals)}
Lead score: ${score}
Write JSON with keys "subject" and "body". Keep body under 120 words.`;
        const responseText = await generateAIContent("gemini-1.5-flash", prompt, true);
        const j = (() => { try { return JSON.parse(responseText || "{}"); } catch { return {}; } })();
        outputs.push({ variant: v, subject: j.subject || "", body: j.body || "" });
      }
      return res.json({ previews: outputs });
    } catch (e) {
      return res.status(500).json({ error: "Preview generation failed" });
    }
  });

  app.patch("/api/outreach/events", (req, res) => {
    const { outreachId, event } = req.body || {};
    if (!outreachId || !event) return res.status(400).json({ error: "Missing outreachId or event" });
    if (event === "opened") {
      db.prepare("UPDATE outreach SET opened_at = CURRENT_TIMESTAMP WHERE id = ?").run(outreachId);
    } else if (event === "clicked") {
      db.prepare("UPDATE outreach SET clicked_at = CURRENT_TIMESTAMP WHERE id = ?").run(outreachId);
    } else {
      return res.status(400).json({ error: "Invalid event" });
    }
    res.json({ status: "ok" });
  });

  // Agent 3: Negotiation
  app.post("/api/agents/negotiate", async (req, res) => {
    const { prospectId, clientMessage, serviceType } = req.body;
    const prospect = db.prepare("SELECT * FROM prospects WHERE id = ?").get(prospectId) as any;

    if (!prospect) return res.status(404).json({ error: "Prospect not found" });

    try {
      const cfgRow = db.prepare("SELECT value FROM settings WHERE key = 'agent_config'").get() as any;
      const cfg = (() => { try { return cfgRow?.value ? JSON.parse(cfgRow.value) : {}; } catch { return {}; } })();
      const rules = Array.isArray(cfg?.agent3?.rules) ? cfg.agent3.rules : [];
      const chosenRule = rules.find((r: any) => r.service === serviceType) || rules[0] || { min: 500, max: 5000 };
      const min = (chosenRule?.min ?? 500);
      const max = (chosenRule?.max ?? 5000);
      const escalation = (cfg?.agent3?.escalationDiscountPercent ?? 25);

      const leadScore = Number(prospect.lead_score || 50);
      const parseMsg = (msg: string) => {
        const pctMatch = msg.match(/(\d{1,2})\s*%/);
        const dollarMatch = msg.match(/\$?\s*([0-9]{2,6})\b/);
        const wantsSLA = /SLA|service level|guarantee/i.test(msg);
        const pct = pctMatch ? Number(pctMatch[1]) : 0;
        const budget = dollarMatch ? Number(dollarMatch[1]) : null;
        return { discountRequestedPercent: pct, budget, wantsCustomSLA: wantsSLA };
      };
      const { discountRequestedPercent, budget, wantsCustomSLA } = parseMsg(clientMessage || "");

      const computePrice = () => {
        let price = Math.round(min + (leadScore / 100) * (max - min));
        if (budget && budget >= min && budget <= max) price = budget;
        const roundTo = 50;
        price = Math.round(price / roundTo) * roundTo;
        price = Math.max(min, Math.min(max, price));
        return price;
      };
      const proposedPrice = computePrice();

      let escalated = false;
      if (discountRequestedPercent > escalation || wantsCustomSLA) {
        escalated = true;
        db.prepare("INSERT INTO notifications (message, type, agent_id) VALUES (?, ?, ?)").run(
          `Agent 3 escalation: discount ${discountRequestedPercent}% ${wantsCustomSLA ? 'with custom SLA' : ''} from ${prospect.name}.`,
          "warning",
          3
        );
      }

      const basePrompt = `You are Agent 3, a professional negotiator for Nexoris.
Client: "${prospect.name}" said: "${clientMessage}".
Gaps: ${prospect.gap_analysis}.
Guardrails: $${min} - $${max}. Max discount: ${escalation}%.
Proposed price: $${proposedPrice}.
${escalated ? 'A human escalation is required. Craft a response that acknowledges constraints and arranges a quick call with the account owner.' : 'Craft a persuasive reply proposing the price and offering next steps (book call via the calendar button or proceed to checkout).'}
If they want to talk, mention they can use the "Book a Strategy Call" button in this portal which syncs with our Cal.com schedule.
Keep reply concise, professional, friendly.`;

      const agentReplyText = await generateAIContent("gemini-1.5-flash", basePrompt);
      const agentReply = agentReplyText || "Thanks for the message — let’s arrange a quick call to align on scope.";

      db.prepare("UPDATE prospects SET status = 'negotiating' WHERE id = ?").run(prospectId);

      db.prepare("INSERT INTO messages (prospect_id, sender, content) VALUES (?, ?, ?)").run(prospectId, 'agent', agentReply);

      if (!escalated) {
        db.prepare("INSERT INTO deals (prospect_id, amount, status) VALUES (?, ?, ?)").run(prospectId, proposedPrice, 'pending');
        db.prepare("INSERT INTO notifications (message, type, agent_id) VALUES (?, ?, ?)").run(
          `Agent 3 proposed $${proposedPrice} to ${prospect.name}.`,
          "info",
          3
        );
      }

      res.json({ status: "success", reply: agentReply, proposedPrice, escalated, serviceType: serviceType || chosenRule?.service || 'General' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Negotiation failed" });
    }
  });

  app.post("/api/deals/:id/accept", (req, res) => {
    const { id } = req.params;
    const deal = db.prepare("SELECT * FROM deals WHERE id = ?").get(id) as any;
    if (!deal) return res.status(404).json({ error: "Deal not found" });
    db.prepare("UPDATE deals SET status = 'paid', closed_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
    db.prepare("UPDATE prospects SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(deal.prospect_id);
    db.prepare("INSERT INTO notifications (message, type, agent_id) VALUES (?, ?, ?)").run(
      `Deal ${id} marked as paid.`,
      "success",
      3
    );
    res.json({ status: "success" });
  });

  app.get("/api/outreach", (req, res) => {
    const outreach = db.prepare(`
      SELECT outreach.*, prospects.name as prospect_name 
      FROM outreach 
      JOIN prospects ON outreach.prospect_id = prospects.id 
      ORDER BY sent_at DESC 
      LIMIT 100
    `).all() as any[];
    res.json(outreach);
  });

  app.get("/api/deals", (req, res) => {
    const deals = db.prepare(`
      SELECT deals.*, prospects.name as client_name 
      FROM deals 
      JOIN prospects ON deals.prospect_id = prospects.id 
      ORDER BY closed_at DESC 
      LIMIT 50
    `).all() as any[];
    res.json(deals);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 NEXORIS Mission Control Active`);
    console.log(`📡 Dashboard: http://localhost:${PORT}\n`);
  });
}

startServer();
