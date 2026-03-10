import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";
import { createNotification } from "../../../../../lib/notifications";

export async function POST(req: NextRequest) {
    try {
        const secret = req.headers.get("x-agent-secret");
        if (secret !== process.env.AGENT_WORKER_SECRET) {
            return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Invalid agent secret" } }, { status: 401 });
        }

        const { action, prospect_id, agent_number, status, details, notification, owner_id } = await req.json();

        await supabaseAdmin.from("agent_logs").insert({
            owner_id: owner_id,
            agent: agent_number,
            action: action,
            status: status || "SUCCESS",
            prospect_id: prospect_id || null,
            details: details || {}
        });

        if (prospect_id && status === "UPDATE_PROSPECT" && details?.new_status) {
            await supabaseAdmin.from("prospects").update({ status: details.new_status }).eq("id", prospect_id);
        }

        if (notification) {
            if (notification.type && !notification.title) {
                await createNotification({
                    owner_id,
                    type: notification.type,
                    prospect_id: prospect_id || null,
                    project_id: notification.project_id || null,
                    metadata: notification.metadata || {},
                    override: {
                        priority: notification.priority,
                        requires_action: notification.requires_action
                    }
                });
            } else {
                await supabaseAdmin.from("notifications").insert({
                    owner_id: owner_id,
                    prospect_id: prospect_id || null,
                    type: notification.type || "AGENT_INFO",
                    title: notification.title || "Agent Update",
                    message: notification.message || "Agent activity logged.",
                    priority: notification.priority || "NORMAL",
                    requires_action: notification.requires_action || false
                });
            }
        }

        return NextResponse.json({ success: true, message: "Agent action logged" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
