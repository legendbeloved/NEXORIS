import { supabaseAdmin } from "./supabase";
import { sendOwnerEmail } from "./email-templates/notifications";

type Priority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export function getNotificationConfig(type: string) {
  const map: Record<
    string,
    { priority: Priority; emailEnabled: boolean; requiresAction: boolean }
  > = {
    AGENT_STARTED: { priority: "LOW", emailEnabled: false, requiresAction: false },
    AGENT_STOPPED: { priority: "LOW", emailEnabled: false, requiresAction: false },
    AGENT_ERROR: { priority: "URGENT", emailEnabled: true, requiresAction: true },
    PROSPECT_FOUND: { priority: "LOW", emailEnabled: false, requiresAction: false },
    EMAIL_SENT: { priority: "LOW", emailEnabled: false, requiresAction: false },
    EMAIL_OPENED: { priority: "NORMAL", emailEnabled: false, requiresAction: false },
    EMAIL_CLICKED: { priority: "NORMAL", emailEnabled: false, requiresAction: false },
    REPLY_RECEIVED: { priority: "HIGH", emailEnabled: true, requiresAction: false },
    MEETING_BOOKED: { priority: "NORMAL", emailEnabled: true, requiresAction: false },
    DEAL_AGREED: { priority: "HIGH", emailEnabled: true, requiresAction: false },
    PAYMENT_LINK_SENT: { priority: "NORMAL", emailEnabled: false, requiresAction: false },
    PAYMENT_RECEIVED: { priority: "URGENT", emailEnabled: true, requiresAction: false },
    PAYMENT_FAILED: { priority: "HIGH", emailEnabled: true, requiresAction: true },
    PROJECT_DELIVERED: { priority: "HIGH", emailEnabled: false, requiresAction: false },
    AGENT_NEEDS_APPROVAL: { priority: "URGENT", emailEnabled: true, requiresAction: true },
  };
  return map[type] || { priority: "LOW", emailEnabled: false, requiresAction: false };
}

export function buildActionUrl(type: string, ids: { prospect_id?: string | number | null; project_id?: string | number | null; agent_id?: number | null }) {
  if (type === "PROSPECT_FOUND" || type === "EMAIL_SENT" || type === "EMAIL_OPENED" || type === "EMAIL_CLICKED" || type === "REPLY_RECEIVED") {
    return `/dashboard/prospects/${ids.prospect_id}`;
  }
  if (type === "PAYMENT_RECEIVED" || type === "PROJECT_DELIVERED") {
    return `/dashboard/projects/${ids.project_id}`;
  }
  if (type === "AGENT_ERROR") {
    return `/dashboard/agents/${ids.agent_id ?? ""}`;
  }
  if (type === "PAYMENT_LINK_SENT" || type === "PAYMENT_FAILED") {
    return `/dashboard/payments`;
  }
  if (type === "AGENT_STARTED" || type === "AGENT_STOPPED") {
    return `/dashboard/agents`;
  }
  return `/dashboard`;
}

export function buildNotificationTitle(type: string, data: any) {
  if (type === "PAYMENT_RECEIVED") {
    const amt = Number(data?.amount || 0).toLocaleString("en-US");
    return `$${amt} received from ${data?.business_name}`;
  }
  if (type === "REPLY_RECEIVED") {
    return `${data?.business_name} replied — Agent 3 is on it`;
  }
  if (type === "AGENT_ERROR") {
    return `Agent ${data?.agent} encountered an error`;
  }
  if (type === "EMAIL_SENT") {
    return `Outreach email sent to ${data?.business_name}`;
  }
  if (type === "PROSPECT_FOUND") {
    return `New prospect discovered`;
  }
  if (type === "MEETING_BOOKED") {
    return `Meeting booked with ${data?.business_name}`;
  }
  if (type === "DEAL_AGREED") {
    return `Deal agreed with ${data?.business_name}`;
  }
  if (type === "PROJECT_DELIVERED") {
    return `Project delivered to ${data?.business_name}`;
  }
  if (type === "PAYMENT_FAILED") {
    return `Payment failed for ${data?.business_name}`;
  }
  if (type === "EMAIL_OPENED") {
    return `${data?.business_name} opened your email`;
  }
  if (type === "EMAIL_CLICKED") {
    return `${data?.business_name} clicked your link`;
  }
  if (type === "AGENT_NEEDS_APPROVAL") {
    return `Agent 3 needs your decision`;
  }
  if (type === "AGENT_STARTED") return `Agent ${data?.agent} is now running`;
  if (type === "AGENT_STOPPED") return `Agent ${data?.agent} stopped`;
  return `Agent Update`;
}

export async function createNotification(params: {
  owner_id: string;
  type: string;
  prospect_id?: string | number | null;
  project_id?: string | number | null;
  metadata?: any;
  override?: Partial<{ title: string; message: string; action_url: string; priority: Priority; requires_action: boolean }>;
}) {
  const { owner_id, type, prospect_id, project_id, metadata, override } = params;
  const cfg = getNotificationConfig(type);
  let title = "";
  let message = "";
  let action_url = "";

  if (type === "AGENT_STARTED") {
    title = `Agent ${metadata?.agent} is now running`;
    message = `Agent ${metadata?.agent} (${metadata?.name || ""}) was started and is actively processing.`;
    action_url = buildActionUrl(type, { agent_id: metadata?.agent });
  } else if (type === "AGENT_STOPPED") {
    title = `Agent ${metadata?.agent} stopped`;
    message = `Agent ${metadata?.agent} was stopped manually.`;
    action_url = buildActionUrl(type, { agent_id: metadata?.agent });
  } else if (type === "AGENT_ERROR") {
    title = buildNotificationTitle(type, metadata);
    message = `Agent ${metadata?.agent} failed while processing ${metadata?.action}. Error: ${metadata?.error}.`;
    action_url = buildActionUrl(type, { agent_id: metadata?.agent });
  } else if (type === "PROSPECT_FOUND") {
    title = buildNotificationTitle(type, metadata);
    message = `Agent 1 found ${metadata?.business_name} in ${metadata?.city}. Score: ${metadata?.ai_score}/100. Pain points: ${metadata?.pain_points}.`;
    action_url = buildActionUrl(type, { prospect_id });
  } else if (type === "EMAIL_SENT") {
    title = buildNotificationTitle(type, metadata);
    message = `Agent 2 sent a ${metadata?.variation} email to ${metadata?.email} at ${metadata?.time}. Subject: ${metadata?.subject}`;
    action_url = buildActionUrl(type, { prospect_id });
  } else if (type === "EMAIL_OPENED") {
    title = buildNotificationTitle(type, metadata);
    message = `${metadata?.business_name} just opened your outreach email for the ${metadata?.open_count} time.`;
    action_url = buildActionUrl(type, { prospect_id });
  } else if (type === "EMAIL_CLICKED") {
    title = buildNotificationTitle(type, metadata);
    message = `${metadata?.business_name} clicked a link in your email.`;
    action_url = buildActionUrl(type, { prospect_id });
  } else if (type === "REPLY_RECEIVED") {
    title = buildNotificationTitle(type, metadata);
    message = `${metadata?.business_name} replied to your outreach. Agent 3 has taken over the conversation.`;
    action_url = buildActionUrl(type, { prospect_id });
  } else if (type === "MEETING_BOOKED") {
    title = buildNotificationTitle(type, metadata);
    message = `${metadata?.business_name} booked a consultation for ${metadata?.date_time}.`;
    action_url = buildActionUrl(type, { prospect_id });
  } else if (type === "DEAL_AGREED") {
    title = buildNotificationTitle(type, metadata);
    message = `${metadata?.business_name} agreed to ${metadata?.service} for $${metadata?.amount}. Payment link has been sent.`;
    action_url = buildActionUrl(type, { prospect_id });
  } else if (type === "PAYMENT_LINK_SENT") {
    title = buildNotificationTitle(type, metadata);
    message = `A payment link for $${metadata?.amount} was sent to ${metadata?.business_name}.`;
    action_url = buildActionUrl(type, {});
  } else if (type === "PAYMENT_RECEIVED") {
    title = buildNotificationTitle(type, metadata);
    message = `Payment of $${metadata?.amount} confirmed. Project in progress.`;
    action_url = buildActionUrl(type, { project_id });
  } else if (type === "PAYMENT_FAILED") {
    title = buildNotificationTitle(type, metadata);
    message = `The payment of $${metadata?.amount} from ${metadata?.business_name} failed.`;
    action_url = buildActionUrl(type, {});
  } else if (type === "PROJECT_DELIVERED") {
    title = buildNotificationTitle(type, metadata);
    message = `The ${metadata?.service} project for ${metadata?.business_name} has been marked as delivered.`;
    action_url = buildActionUrl(type, { project_id });
  } else if (type === "AGENT_NEEDS_APPROVAL") {
    title = buildNotificationTitle(type, metadata);
    message = `Agent 3 needs your input for ${metadata?.business_name}: ${metadata?.escalation_reason}.`;
    action_url = buildActionUrl(type, { prospect_id });
  }

  const priority = override?.priority || cfg.priority;
  const requires_action = override?.requires_action ?? cfg.requiresAction;
  const insert = await supabaseAdmin
    .from("notifications")
    .insert({
      owner_id,
      prospect_id: prospect_id || null,
      project_id: project_id || null,
      type,
      title: override?.title || title,
      message: override?.message || message,
      action_url: override?.action_url || action_url,
      priority,
      is_read: false,
      requires_action,
    })
    .select()
    .single();

  if (cfg.emailEnabled && process.env.OWNER_EMAIL) {
    await sendOwnerEmail(process.env.OWNER_EMAIL, type as any, {
      business_name: metadata?.business_name,
      amount: metadata?.amount,
      service: metadata?.service,
      agent: metadata?.agent,
      action: metadata?.action,
      error: metadata?.error,
      date_time: metadata?.date_time,
      prospect_id,
      project_id,
    });
  }

  return insert.data;
}
