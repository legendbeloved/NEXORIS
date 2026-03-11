import express from "express";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

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

  const genAI = createGenAI();
  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const agentWorkerSecret = (process.env.AGENT_WORKER_SECRET || "").trim();

  const callAgentWorker = async (agentNumber: number, path: string, payload: any) => {
    const specificUrl = process.env[`AGENT_${agentNumber}_URL`];
    const fallbackUrl = process.env.AGENT_WORKER_URL;
    const baseUrl = (specificUrl || fallbackUrl || "").trim();

    if (!baseUrl || !agentWorkerSecret) return null;
    try {
      const url = `${baseUrl.replace(/\/$/, "")}${path}`;
      const r = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-agent-secret": agentWorkerSecret,
        },
        body: JSON.stringify(payload || {}),
      });
      const text = await r.text();
      const json = safeJsonParse<any>(text, null);
      if (!r.ok) return { ok: false, status: r.status, data: json || text };
      return { ok: true, status: r.status, data: json || text };
    } catch (e) {
      return { ok: false, status: 0, data: null };
    }
  };

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/config", async (_req, res) => {
    const { data } = await supabase.from("settings").select("value").eq("key", "agent_config").single();
    res.json(data?.value || {});
  });

  app.patch("/api/config", async (req, res) => {
    const payload = req.body || {};
    await supabase.from("settings").upsert({ key: "agent_config", value: payload });

    // Sync to agent_configs table for Python worker compatibility
    try {
      const globalCfg = payload.global || {};
      const cities = globalCfg.targetRegion ? [globalCfg.targetRegion] : [];
      const cats = globalCfg.categories || [];

      for (const i of [1, 2, 3]) {
        const agentKey = `agent${i}`;
        const agentCfg = payload[agentKey] || {};
        await supabase.from("agent_configs").upsert({
          agent_number: i,
          target_cities: cities,
          categories: cats,
          min_score: agentCfg.minScore || 50,
          is_active: true,
          updated_at: "now()"
        }, { onConflict: "agent_number" });
      }
    } catch (e) {
      console.error("Failed to sync agent_configs:", e);
    }

    res.json({ status: "ok" });
  });

  app.get("/api/profile", async (_req, res) => {
    const { data } = await supabase.from("settings").select("value").eq("key", "profile").single();
    const fallback = {
      firstName: "Habibullah",
      lastName: "Isaliu",
      email: "habibullah@nexoris.ai",
      roleTitle: "Platform Owner",
      avatarUrl: "https://picsum.photos/seed/owner/200/200",
      memberSince: "March 2026",
    };
    res.json(data?.value || fallback);
  });

  app.patch("/api/profile", async (req, res) => {
    const payload = req.body || {};
    await supabase.from("settings").upsert({ key: "profile", value: payload });
    res.json({ status: "ok" });
  });

  app.get("/api/settings/billing", async (_req, res) => {
    const { data } = await supabase.from("settings").select("value").eq("key", "billing_settings").single();
    const fallback = {
      plan: "Pro",
      currency: "USD",
      invoiceEmail: "billing@nexoris.ai",
      autoRenew: true,
      taxId: "",
    };
    res.json(data?.value || fallback);
  });

  app.patch("/api/settings/billing", async (req, res) => {
    const payload = req.body || {};
    await supabase.from("settings").upsert({ key: "billing_settings", value: payload });
    res.json({ status: "ok" });
  });

  app.get("/api/settings/notifications", async (_req, res) => {
    const { data } = await supabase.from("settings").select("value").eq("key", "notification_settings").single();
    const fallback = {
      inApp: true,
      email: true,
      weeklySummary: true,
      agentAlerts: true,
      dealAlerts: true,
      marketing: false,
    };
    res.json(data?.value || fallback);
  });

  app.patch("/api/settings/notifications", async (req, res) => {
    const payload = req.body || {};
    await supabase.from("settings").upsert({ key: "notification_settings", value: payload });
    res.json({ status: "ok" });
  });

  app.get("/api/team", async (_req, res) => {
    const { count } = await supabase.from("team_members").select("*", { count: "exact", head: true });
    if (!count) {
      const seed = [
        { name: "Habibullah Isaliu", email: "habibullah@nexoris.ai", role: "Owner", status: "Active", avatar: "https://picsum.photos/seed/owner/100/100" },
        { name: "Sarah Chen", email: "sarah@nexoris.ai", role: "Admin", status: "Active", avatar: "https://picsum.photos/seed/sarah/100/100" },
        { name: "Mike Ross", email: "mike@nexoris.ai", role: "Member", status: "Pending", avatar: null },
      ];
      await supabase.from("team_members").insert(seed);
    }
    const { data } = await supabase.from("team_members").select("*").order("id", { ascending: true });
    res.json(data || []);
  });

  app.post("/api/team", async (req, res) => {
    const { name, email, role, status, avatar } = req.body || {};
    const n = String(name || "").trim();
    const e = String(email || "").trim().toLowerCase();
    const r = String(role || "Member").trim();
    const s = String(status || "Pending").trim();
    if (!n || !e) return res.status(400).json({ error: "name and email required" });

    try {
      const { data, error } = await supabase.from("team_members").insert({
        name: n,
        email: e,
        role: r,
        status: s,
        avatar: avatar ? String(avatar) : null,
      }).select().single();
      if (error) throw error;
      res.json(data);
    } catch {
      res.status(409).json({ error: "member already exists" });
    }
  });

  app.patch("/api/team/:id", async (req, res) => {
    const id = req.params.id;
    const { data: existing } = await supabase.from("team_members").select("*").eq("id", id).single();
    if (!existing) return res.status(404).json({ error: "not found" });

    const patch = req.body || {};
    const next = {
      name: typeof patch.name === "string" ? patch.name.trim() : existing.name,
      email: typeof patch.email === "string" ? patch.email.trim().toLowerCase() : existing.email,
      role: typeof patch.role === "string" ? patch.role.trim() : existing.role,
      status: typeof patch.status === "string" ? patch.status.trim() : existing.status,
      avatar: typeof patch.avatar === "string" ? patch.avatar.trim() : existing.avatar,
    };

    try {
      const { data, error } = await supabase.from("team_members").update(next).eq("id", id).select().single();
      if (error) throw error;
      res.json(data);
    } catch {
      res.status(409).json({ error: "email already exists" });
    }
  });

  app.delete("/api/team/:id", async (req, res) => {
    const { id } = req.params;
    await supabase.from("team_members").delete().eq("id", id);
    res.json({ status: "ok" });
  });

  app.get("/api/prospects", async (req, res) => {
    const { page = 1, limit = 10, search = "", status = "", category = "" } = req.query as any;
    const p = Math.max(1, Number(page));
    const l = Math.max(1, Number(limit));
    const from = (p - 1) * l;
    const to = from + l - 1;

    let query = supabase.from("prospects").select("*", { count: "exact" });

    if (search) query = query.ilike("name", `%${search}%`);
    if (status) query = query.eq("status", status);
    if (category) query = query.eq("category", category);

    const { data, count, error } = await query.order("updated_at", { ascending: false }).range(from, to);

    if (error) return res.status(500).json({ error: error.message });

    const prospects = (data || []).map((r) => ({
      ...r,
      painPoints: Array.isArray(r.pain_points) ? r.pain_points : safeJsonParse<string[]>(r.pain_points, []),
      signals: typeof r.signals === "object" ? r.signals : safeJsonParse<any>(r.signals, {}),
    }));

    res.json({ prospects, total: count || 0 });
  });

  app.get("/api/prospects/:id", async (req, res) => {
    const { id } = req.params;
    const { data: row, error } = await supabase.from("prospects").select("*").eq("id", id).single();
    if (error || !row) return res.status(404).json({ error: "Prospect not found" });

    const { data: outreach } = await supabase.from("outreach_emails").select("*").eq("prospect_id", id).order("sent_at", { ascending: false });
    const { data: messages } = await supabase.from("conversations").select("*").eq("prospect_id", id).order("created_at", { ascending: true });

    res.json({
      ...row,
      painPoints: Array.isArray(row.pain_points) ? row.pain_points : safeJsonParse<string[]>(row.pain_points, []),
      signals: typeof row.signals === "object" ? row.signals : safeJsonParse<any>(row.signals, {}),
      outreach: outreach || [],
      messages: messages || []
    });
  });

  app.get("/api/stats", async (_req, res) => {
    const { count: totalProspects } = await supabase.from("prospects").select("*", { count: "exact", head: true });
    const { count: emailsSent } = await supabase.from("outreach_emails").select("*", { count: "exact", head: true });
    const { count: dealsClosed } = await supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "PAID");
    const { data: revenueData } = await supabase.from("payments").select("amount").eq("status", "PAID");

    const totalRevenue = (revenueData || []).reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    const stages = ["discovered", "contacted", "opened", "replied", "interested", "agreed", "paid", "delivered"];
    const funnel = await Promise.all(stages.map(async (stage) => {
      const { count } = await supabase.from("prospects").select("*", { count: "exact", head: true }).eq("status", stage);
      return { stage, count: count || 0 };
    }));

    res.json({
      totalProspects: totalProspects || 0,
      emailsSent: emailsSent || 0,
      dealsClosed: dealsClosed || 0,
      revenue: totalRevenue,
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

  app.get("/api/notifications", async (req, res) => {
    const { page = 1, limit = 20 } = req.query as any;
    const p = Math.max(1, Number(page));
    const l = Math.min(100, Math.max(1, Number(limit)));
    const from = (p - 1) * l;
    const to = from + l - 1;

    const { count: total } = await supabase.from("notifications").select("*", { count: "exact", head: true });
    const { count: unreadCount } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("read", false);
    const { data: rows } = await supabase.from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    res.json({
      success: true,
      data: {
        notifications: (rows || []).map(normalizeNotification),
        total: total || 0,
        unread_count: unreadCount || 0,
        page: p,
        limit: l,
      },
    });
  });

  app.get("/api/notifications/unread-count", async (_req, res) => {
    const { count } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("read", false);
    res.json({ count: count || 0 });
  });

  app.post("/api/notifications/read-all", async (_req, res) => {
    await supabase.from("notifications").update({ read: true }).eq("read", false);
    res.json({ success: true });
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    const { id } = req.params;
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    res.json({ success: true });
  });

  app.post("/api/internal/agent/notify", async (req, res) => {
    const secret = String(req.headers["x-agent-secret"] || "");
    if (!agentWorkerSecret || secret !== agentWorkerSecret) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = req.body || {};
    const agentNumber = Number(payload.agent_number || payload.agent || payload.agentId || 0);
    const action = String(payload.action || "").trim();
    const status = String(payload.status || "").trim();
    const messageFromDetails = payload?.details?.message ? String(payload.details.message) : "";
    const message =
      messageFromDetails ||
      [agentNumber ? `Agent ${agentNumber}` : "Agent", action, status].filter(Boolean).join(" - ");

    const type =
      status.toUpperCase() === "SUCCESS"
        ? "success"
        : status.toUpperCase() === "ERROR"
          ? "error"
          : "info";

    await supabase.from("notifications").insert({
      message,
      type,
      agent_id: Number.isFinite(agentNumber) ? agentNumber : null,
    });

    res.json({ ok: true });
  });

  app.get("/api/client/auth/:token", async (req, res) => {
    const { token } = req.params;
    const { data: prospect, error } = await supabase.from("prospects").select("*").eq("token", token).single();
    if (error || !prospect) return res.status(404).json({ error: "Invalid token" });

    const { data: messages } = await supabase.from("conversations").select("*").eq("prospect_id", prospect.id).order("created_at", { ascending: true });
    const { data: outreach } = await supabase.from("outreach_emails").select("mockup_preview").eq("prospect_id", prospect.id).order("sent_at", { ascending: false }).limit(1).single();

    res.json({ prospect: { ...prospect, mockup_preview: outreach?.mockup_preview || "" }, messages: messages || [] });
  });

  app.post("/api/client/message", async (req, res) => {
    const { token, content } = req.body || {};
    const { data: prospect, error } = await supabase.from("prospects").select("id, name, email").eq("token", token).single();
    if (error || !prospect) return res.status(404).json({ error: "Invalid token" });

    await supabase.from("conversations").insert({
      prospect_id: prospect.id,
      sender: "client",
      message: content,
    });

    setTimeout(async () => {
      try {
        const prompt = `You are Agent 3 from NEXORIS. A client named "${prospect.name}" just sent this message: "${content}". Respond professionally, address their concerns, and guide them towards the next step (booking a call or paying). If they seem ready to talk, offer them this booking link: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking. Keep it concise and friendly.`;
        const replyText = await generateAIContent(genAI, modelName, prompt);
        const reply = replyText || "I've received your message. Would you like to schedule a quick 15-minute call to discuss this further?";

        await supabase.from("conversations").insert({
          prospect_id: prospect.id,
          sender: "agent",
          message: reply,
        });

        await supabase.from("notifications").insert({
          message: `New message from ${prospect.name} in client portal.`,
          type: "info",
          agent_id: 3,
        });
      } catch { }
    }, 2000);

    res.json({ status: "success" });
  });

  app.post("/api/client/pay", async (req, res) => {
    const { token, serviceType } = req.body || {};
    const { data: prospect, error } = await supabase.from("prospects").select("*").eq("token", token).single();
    if (error || !prospect) return res.status(404).json({ error: "Invalid token" });

    const amount = 1200;
    const service = serviceType || "Digital Transformation";
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 14);

    await supabase.from("prospects").update({ status: "paid", updated_at: "now()" }).eq("id", prospect.id);
    await supabase.from("payments").insert({ prospect_id: prospect.id, amount, status: "paid", paid_at: "now()" });
    await supabase.from("projects").insert({
      prospect_id: prospect.id,
      service_type: service,
      status: "in_progress",
      deadline: deadline.toISOString(),
    });
    await supabase.from("notifications").insert({
      message: `Payment received! Project "${service}" for ${prospect.name} is now underway.`,
      type: "success",
      agent_id: 3,
    });

    res.json({ status: "success", checkoutUrl: "https://checkout.stripe.com/pay/mock_session" });
  });

  const runDiscovery = async (body: any) => {
    const workerRes = await callAgentWorker(1, "/start", { owner_id: "demo" });
    if (workerRes?.ok) return { status: "success", mode: "worker", worker: workerRes };
    if (workerRes && !workerRes.ok) {
      try {
        await supabase.from("notifications").insert({
          message: `Worker Agent 1 unavailable (status ${workerRes.status}). Falling back to local execution.`,
          type: "warning",
          agent_id: 1,
        });
      } catch { }
    }

    const { data: cfgRow } = await supabase.from("settings").select("value").eq("key", "agent_config").single();
    const cfg = cfgRow?.value || {};
    const { category, location } = body || {};
    const targetCategory = category || cfg?.global?.categories?.[0] || "E-commerce";
    const targetLocation = location || cfg?.global?.targetRegion || "San Francisco, CA";
    const depth = cfg?.agent1?.searchDepth ?? 4;
    const revenueWeight = cfg?.agent1?.scoringWeightRevenue ?? 85;
    const criteria = Array.isArray(cfg?.agent1?.gapCriteria)
      ? cfg.agent1.gapCriteria.join(", ")
      : "Slow mobile site, No online booking, Poor SEO";

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
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const siteText = await fetchText(biz.website);

        const analysisPrompt = `You are Agent 1. Analyze the digital presence gaps of a business.\nBusiness: ${biz.name}\nWebsite: ${biz.website}\nLocation: ${targetLocation}\nCategory: ${targetCategory}\nGap criteria: ${criteria}\nWebsite text snippet:\n${siteText}\nReturn JSON with keys:\n- gapAnalysis: string (short)\n- painPoints: string[]\n- email: string\n- phone: string\n- signals: object { hasBooking:boolean, mobileIssues:boolean, seoIssues:boolean, hasContact:boolean, hasBlog:boolean }\n- quickWin: string\nKeep it realistic.\n`;

        const analysisJson = await generateAIContent(genAI, modelName, analysisPrompt, true);
        const data = safeJsonParse<any>(analysisJson, {});

        const gapAnalysis = (data.gapAnalysis || "No clear gaps found.").toString();
        const quickWin = (data.quickWin || "").toString();
        const finalGapAnalysis = quickWin ? `${gapAnalysis}\nQuick Win: ${quickWin}` : gapAnalysis;
        const painPoints = Array.isArray(data.painPoints) ? data.painPoints : ["Slow mobile performance"];
        const email = data.email || `contact@${String(biz.website).replace(/^https?:\/\//, "").replace(/\/.*/, "")}`;
        const phone = data.phone || "(555) 000-0000";
        const signals = data.signals || {};
        const leadScore = scoreFromSignals(signals);

        await supabase.from("prospects").insert({
          name: biz.name,
          category: targetCategory,
          city: targetLocation,
          website: biz.website,
          email,
          phone,
          gap_analysis: finalGapAnalysis,
          pain_points: painPoints,
          token,
          lead_score: leadScore,
          ai_score: leadScore,
          google_place_id: biz.place_id || null,
          signals,
        });

        await supabase.from("notifications").insert({
          message: `Agent 1 analyzed ${biz.name}: score ${leadScore}`,
          type: "success",
          agent_id: 1,
        });
      } catch { }
    }

    return { status: "success", mode: "local", message: "Discovery complete", depth };
  };

  app.post("/api/agents/discovery", async (req, res) => {
    const result = await runDiscovery(req.body);
    res.json(result);
  });

  const runOutreach = async () => {
    const workerRes = await callAgentWorker(2, "/start", { owner_id: "demo" });
    if (workerRes?.ok) return { status: "success", mode: "worker", worker: workerRes };
    if (workerRes && !workerRes.ok) {
      try {
        await supabase.from("notifications").insert({
          message: `Worker Agent 2 unavailable (status ${workerRes.status}). Falling back to local execution.`,
          type: "warning",
          agent_id: 2,
        });
      } catch { }
    }

    const { data: cfgRow } = await supabase.from("settings").select("value").eq("key", "agent_config").single();
    const cfg = cfgRow?.value || {};
    const sendLimit = Math.min(1000, Math.max(1, cfg?.agent2?.dailySendLimit || 5));
    const identity = cfg?.agent2?.senderIdentity || "Executive Concierge (Sarah)";
    const tone = cfg?.agent2?.brandTone || "Professional";
    const profile = cfg?.agent2?.personalityProfile || "Empathetic";
    const smartSched = !!cfg?.agent2?.smartScheduling;
    const ab = !!cfg?.agent2?.abTesting;

    const { data: prospects } = await supabase.from("prospects").select("*").eq("status", "discovered").limit(sendLimit);

    if (prospects) {
      for (const p of prospects) {
        try {
          const pains = Array.isArray(p.pain_points) ? p.pain_points : safeJsonParse<any[]>(p.pain_points, []);
          const signals = typeof p.signals === "object" ? p.signals : safeJsonParse<any>(p.signals, {});
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
              (j.subject || "").toString().trim() || `Quick idea to improve ${p.name}'s ${p.category || "website"}`.trim();
            const body =
              (j.body || "").toString().trim() ||
              `Hi ${p.name},\n\nNoticed a couple quick wins on ${p.website} that could improve conversions. If you're open to it, I can share a short audit + a lightweight mockup concept.\n\nBest,\n${identity}`.trim();
            const mockup =
              (j.mockup_description || "").toString().trim() || "A performance-optimized landing + booking flow concept.";

            await supabase.from("outreach_emails").insert({
              prospect_id: p.id,
              variant: v,
              subject,
              body,
              mockup_preview: mockup,
              sent_at: "now()",
            });
          }

          if (p.email && process.env.RESEND_API_KEY) {
            await sendEmail(
              p.email,
              `Quick idea for ${p.name}`,
              `<p>Hi ${p.name},</p><p>Noticed some digital gaps on your site ${p.website}. I've prepared a custom mockup for you.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/client/${p.token}">View your personalized portal here</a></p>`,
            );
          }

          await supabase.from("prospects").update({ status: "contacted" }).eq("id", p.id);

          await supabase.from("notifications").insert({
            message: `Agent 2 prepared outreach${ab ? " (A/B)" : ""} for ${p.name}${p.email && process.env.RESEND_API_KEY ? " and sent via Resend" : ""}.`,
            type: "info",
            agent_id: 2,
          });
        } catch { }
      }
    }

    return { status: "success", mode: "local", message: "Outreach complete", processed: prospects?.length || 0 };
  };

  app.post("/api/agents/outreach", async (_req, res) => {
    const result = await runOutreach();
    res.json(result);
  });

  const runNegotiation = async () => {
    const workerRes = await callAgentWorker(3, "/start", { owner_id: "demo" });
    if (workerRes?.ok) return { status: "success", mode: "worker", worker: workerRes };
    if (workerRes && !workerRes.ok) {
      try {
        await supabase.from("notifications").insert({
          message: `Worker Agent 3 unavailable (status ${workerRes.status}). Falling back to local execution.`,
          type: "warning",
          agent_id: 3,
        });
      } catch { }
    }

    const { data: cfgRow } = await supabase.from("settings").select("value").eq("key", "agent_config").single();
    const cfg = cfgRow?.value || {};
    const rules = Array.isArray(cfg?.agent3?.rules) ? cfg.agent3.rules : [];
    const fallbackRule = { service: "SEO Audit", min: 500, max: 1500 };
    const rule = rules[0] || fallbackRule;
    const service = String(rule.service || fallbackRule.service);
    const min = Math.max(1, Number(rule.min || fallbackRule.min));
    const max = Math.max(min, Number(rule.max || fallbackRule.max));

    const { data: candidates } = await supabase.from("prospects")
      .select("*")
      .in("status", ["contacted", "opened", "replied", "interested", "agreed"])
      .order("updated_at", { ascending: false })
      .limit(10);

    let processed = 0;
    let progressed = 0;

    if (candidates) {
      for (const p of candidates) {
        try {
          const status = String(p.status || "");
          if (status === "contacted" || status === "opened") {
            await supabase.from("prospects").update({ status: "replied", updated_at: "now()" }).eq("id", p.id);
            await supabase.from("conversations").insert({
              prospect_id: p.id,
              sender: "client",
              message: "Hi — thanks. This looks interesting. Can you share pricing and timeline?",
            });
            await supabase.from("notifications").insert({
              message: `New reply received from ${p.name}. Agent 3 is negotiating.`,
              type: "info",
              agent_id: 3,
            });
            progressed++;
          } else if (status === "replied" || status === "interested") {
            const amount = Math.round(min + Math.random() * (max - min));
            await supabase.from("prospects").update({ status: "agreed", updated_at: "now()" }).eq("id", p.id);
            await supabase.from("payments").insert({ prospect_id: p.id, amount, status: "pending" });
            await supabase.from("projects").insert({
              prospect_id: p.id,
              service_type: service,
              status: "pending",
              deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            });
            await supabase.from("notifications").insert({
              message: `Deal agreed with ${p.name}: $${amount.toLocaleString("en-US")} for ${service}.`,
              type: "success",
              agent_id: 3,
            });
            progressed++;
          }
          processed++;
        } catch { }
      }
    }

    return { status: "success", mode: "local", message: "Negotiation complete", processed, progressed };
  };

  app.post("/api/agents/negotiation", async (_req, res) => {
    const result = await runNegotiation();
    res.json(result);
  });

  const autopilot = {
    running: false,
    intervalMs: 30000,
    startedAt: null as number | null,
    lastTickAt: null as number | null,
    inFlight: false,
    lastResult: null as any,
    timer: null as any,
    lastDiscoveryAt: null as number | null,
    lastOutreachAt: null as number | null,
    lastNegotiationAt: null as number | null,
  };

  const countProspectsByStatus = async (status: string) => {
    const { count } = await supabase.from("prospects").select("*", { count: "exact", head: true }).eq("status", status);
    return count || 0;
  };

  const scheduleAutopilot = () => {
    if (autopilot.timer) {
      try {
        clearTimeout(autopilot.timer);
      } catch { }
    }
    if (!autopilot.running) return;
    autopilot.timer = setTimeout(() => tickAutopilot(), autopilot.intervalMs);
  };

  const tickAutopilot = async () => {
    if (!autopilot.running) return;
    if (autopilot.inFlight) return scheduleAutopilot();

    autopilot.inFlight = true;
    autopilot.lastTickAt = Date.now();

    try {
      const { data: cfgRow } = await supabase.from("settings").select("value").eq("key", "agent_config").single();
      const cfg = cfgRow?.value || {};
      const category = cfg?.global?.categories?.[0] || "E-commerce";
      const location = cfg?.global?.targetRegion || "San Francisco, CA";

      const discovered = await countProspectsByStatus("discovered");
      const contacted = await countProspectsByStatus("contacted");
      const replied = await countProspectsByStatus("replied");
      const interested = await countProspectsByStatus("interested");

      const shouldDiscover = discovered < 5 || !autopilot.lastDiscoveryAt || Date.now() - autopilot.lastDiscoveryAt > 10 * 60 * 1000;
      const shouldOutreach = discovered > 0 || !autopilot.lastOutreachAt || Date.now() - autopilot.lastOutreachAt > 3 * 60 * 1000;
      const shouldNegotiate = contacted + replied + interested > 0 || !autopilot.lastNegotiationAt || Date.now() - autopilot.lastNegotiationAt > 3 * 60 * 1000;

      const result: any = { tick_at: new Date().toISOString(), ran: [] as string[] };

      if (shouldDiscover) {
        result.discovery = await runDiscovery({ category, location });
        autopilot.lastDiscoveryAt = Date.now();
        result.ran.push("discovery");
      }

      const discoveredAfter = await countProspectsByStatus("discovered");
      if (shouldOutreach && discoveredAfter > 0) {
        result.outreach = await runOutreach();
        autopilot.lastOutreachAt = Date.now();
        result.ran.push("outreach");
      }

      const contactedAfter = await countProspectsByStatus("contacted");
      const repliedAfter = await countProspectsByStatus("replied");
      const interestedAfter = await countProspectsByStatus("interested");
      if (shouldNegotiate && contactedAfter + repliedAfter + interestedAfter > 0) {
        result.negotiation = await runNegotiation();
        autopilot.lastNegotiationAt = Date.now();
        result.ran.push("negotiation");
      }

      autopilot.lastResult = result;
      try {
        await supabase.from("notifications").insert({
          message: `Autopilot tick completed: ${result.ran.length ? result.ran.join(" → ") : "idle"}`,
          type: "info",
          agent_id: 0,
        });
      } catch { }
    } finally {
      autopilot.inFlight = false;
      scheduleAutopilot();
    }
  };

  app.get("/api/agents/autopilot/status", (_req, res) => {
    res.json({
      running: autopilot.running,
      intervalMs: autopilot.intervalMs,
      startedAt: autopilot.startedAt,
      lastTickAt: autopilot.lastTickAt,
      inFlight: autopilot.inFlight,
      lastResult: autopilot.lastResult,
    });
  });

  app.post("/api/agents/autopilot/start", async (req, res) => {
    const nextInterval = Number(req.body?.intervalMs);
    if (Number.isFinite(nextInterval) && nextInterval >= 5000) autopilot.intervalMs = Math.floor(nextInterval);
    if (!autopilot.running) {
      autopilot.running = true;
      autopilot.startedAt = Date.now();
      autopilot.lastTickAt = null;
      autopilot.lastResult = null;
      autopilot.inFlight = false;
      autopilot.lastDiscoveryAt = null;
      autopilot.lastOutreachAt = null;
      autopilot.lastNegotiationAt = null;
      try {
        await supabase.from("notifications").insert({
          message: "Autopilot started. Agents are running continuously.",
          type: "success",
          agent_id: 0,
        });
      } catch { }
      setTimeout(() => tickAutopilot(), 100);
    }
    res.json({ running: autopilot.running, intervalMs: autopilot.intervalMs });
  });

  app.post("/api/agents/autopilot/stop", async (_req, res) => {
    autopilot.running = false;
    autopilot.inFlight = false;
    if (autopilot.timer) {
      try {
        clearTimeout(autopilot.timer);
      } catch { }
      autopilot.timer = null;
    }
    try {
      await supabase.from("notifications").insert({
        message: "Autopilot stopped.",
        type: "warning",
        agent_id: 0,
      });
    } catch { }
    res.json({ running: autopilot.running });
  });

  app.post("/api/agents/mission", async (req, res) => {
    try {
      const { category, location } = req.body || {};

      const discovery = await runDiscovery({ category, location });
      const outreach = await runOutreach();
      const negotiation = await runNegotiation();

      res.json({ status: "success", discovery, outreach, negotiation });
    } catch (e) {
      console.error("Mission failed:", e);
      res.status(500).json({ status: "error", message: "Mission failed" });
    }
  });

  app.get("/api/outreach", async (_req, res) => {
    const { data: outreach } = await supabase.from("outreach_emails")
      .select(`
        *,
        prospects:prospect_id (name)
      `)
      .order("sent_at", { ascending: false })
      .limit(100);

    const normalized = (outreach || []).map(o => ({
      ...o,
      prospect_name: (o.prospects as any)?.name
    }));

    res.json(normalized);
  });

  app.get("/api/deals", async (_req, res) => {
    const { data: deals } = await supabase.from("payments")
      .select(`
        *,
        prospects:prospect_id (name)
      `)
      .order("paid_at", { ascending: false })
      .limit(50);

    const normalized = (deals || []).map(d => ({
      ...d,
      client_name: (d.prospects as any)?.name
    }));
    res.json(normalized);
  });

  app.get("/api/projects", async (_req, res) => {
    const { data: projects } = await supabase.from("projects")
      .select(`
        *,
        prospects:prospect_id (name, email)
      `)
      .order("created_at", { ascending: false });

    const normalized = (projects || []).map(p => ({
      ...p,
      client_name: (p.prospects as any)?.name,
      client_email: (p.prospects as any)?.email
    }));

    res.json(normalized);
  });

  app.get("/api/projects/:id", async (req, res) => {
    const { id } = req.params;
    const { data: project, error } = await supabase.from("projects")
      .select(`
        *,
        prospects:prospect_id (name, email)
      `)
      .eq("id", id)
      .single();

    if (error || !project) return res.status(404).json({ error: "Project not found" });

    const { data: messages } = await supabase.from("conversations").select("*").eq("prospect_id", project.prospect_id).order("created_at", { ascending: true });

    res.json({
      ...project,
      client_name: (project.prospects as any)?.name,
      client_email: (project.prospects as any)?.email,
      messages: messages || []
    });
  });

  return app;
}
