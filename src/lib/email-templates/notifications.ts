type EventType =
  | "AGENT_ERROR"
  | "REPLY_RECEIVED"
  | "MEETING_BOOKED"
  | "DEAL_AGREED"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_FAILED"
  | "AGENT_NEEDS_APPROVAL";

function base(subject: string, heading: string, body: string, ctaUrl: string) {
  const html = `<!doctype html><html><body style="margin:0;background:#0b0c1a;color:#e5e7eb;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr><td style="background:#5B4CF5;color:#fff;padding:20px 18px;font-weight:800;letter-spacing:.06em;text-transform:uppercase">NEXORIS</td></tr>
    <tr><td style="background:#0f1228;padding:20px;border-left:4px solid #5B4CF5">
      <div style="font-size:18px;font-weight:800;margin-bottom:6px">${heading}</div>
      <div style="font-size:14px;line-height:1.6;color:#c7cbd1">${body}</div>
      <div style="margin-top:16px"><a href="${ctaUrl}" style="display:inline-block;background:#5B4CF5;color:white;text-decoration:none;padding:12px 14px;border-radius:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;font-size:12px">View in Dashboard →</a></div>
    </td></tr>
    <tr><td style="padding:12px;color:#9ca3af;font-size:12px">Sent by NEXORIS</td></tr>
  </table></body></html>`;
  const text = `${heading}\n\n${body}\n\n${ctaUrl}\n\nNEXORIS`;
  return { subject, html, text };
}

export function generateNotificationEmail(event: EventType, data: any) {
  const dash = `${process.env.NEXT_PUBLIC_APP_URL || ""}/dashboard`;
  if (event === "AGENT_ERROR") {
    const s = `NEXORIS Agent ${data.agent} Error`;
    const h = `Agent ${data.agent} encountered an error`;
    const b = `Agent ${data.agent} failed while processing ${data.action}. Error: ${data.error}.`;
    return base(s, h, b, `${dash}/agents/${data.agent}`);
  }
  if (event === "REPLY_RECEIVED") {
    const s = `${data.business_name} replied to your email`;
    const h = `${data.business_name} replied`;
    const b = `${data.business_name} replied to your outreach. Agent 3 has taken over the conversation.`;
    return base(s, h, b, `${dash}/prospects/${data.prospect_id}`);
  }
  if (event === "MEETING_BOOKED") {
    const s = `Meeting booked: ${data.business_name}`;
    const h = `Meeting booked with ${data.business_name}`;
    const b = `${data.business_name} booked a consultation for ${data.date_time}.`;
    return base(s, h, b, `${dash}/prospects/${data.prospect_id}`);
  }
  if (event === "DEAL_AGREED") {
    const s = `Deal agreed: $${data.amount} from ${data.business_name}`;
    const h = `Deal agreed with ${data.business_name}`;
    const b = `${data.business_name} agreed to ${data.service} for $${data.amount}. Payment link has been sent.`;
    return base(s, h, b, `${dash}/prospects/${data.prospect_id}`);
  }
  if (event === "PAYMENT_RECEIVED") {
    const s = `Payment received: $${data.amount} from ${data.business_name}`;
    const h = `$${data.amount} received from ${data.business_name}`;
    const b = `Payment of $${data.amount} confirmed. Project is now in progress.`;
    return base(s, h, b, `${dash}/projects/${data.project_id}`);
  }
  if (event === "PAYMENT_FAILED") {
    const s = `Payment failed: ${data.business_name}`;
    const h = `Payment failed for ${data.business_name}`;
    const b = `The payment of $${data.amount} from ${data.business_name} failed. Consider sending a new link.`;
    return base(s, h, b, `${dash}/payments`);
  }
  if (event === "AGENT_NEEDS_APPROVAL") {
    const s = `Action needed: ${data.business_name}`;
    const h = `Agent 3 needs your decision`;
    const b = `Agent 3 needs your input for ${data.business_name}: ${data.escalation_reason}.`;
    return base(s, h, b, `${dash}/prospects/${data.prospect_id}`);
  }
  return null;
}

export async function sendOwnerEmail(ownerEmail: string, event: EventType, data: any) {
  const payload = generateNotificationEmail(event, data);
  if (!payload) return { success: false };
  const key = process.env.RESEND_API_KEY || "";
  if (!key) return { success: false };
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "NEXORIS Alerts <alerts@noreply.nexoris>",
      to: [ownerEmail],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: "no-reply@noreply.nexoris",
    }),
  });
  if (!r.ok) return { success: false };
  const j = await r.json();
  return { success: true, resend_id: j.id };
}
