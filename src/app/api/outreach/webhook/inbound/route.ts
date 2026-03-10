import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const signature = req.headers.get("svix-signature");
        const secret = process.env.RESEND_INBOUND_WEBHOOK_SECRET;

        if (!signature || !secret) {
            return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Missing sig/secret" } }, { status: 401 });
        }

        const bodyObj = JSON.parse(payload);
        const headers = bodyObj.data?.headers || [];
        const nexorisHeader = headers.find((h: any) => h.name === "X-NEXORIS-EMAIL-ID");
        const emailId = nexorisHeader ? nexorisHeader.value : null;

        if (!emailId) {
            return NextResponse.json({ success: true, message: "Ignored, not a tracked email reply" }, { status: 200 });
        }

        const replyBody = bodyObj.data?.text || bodyObj.data?.html || "Reply received without body";
        const fromEmail = bodyObj.data?.from;

        const { data: email } = await supabaseAdmin.from("outreach_emails").select("id, prospect_id, owner_id, status").eq("id", emailId).single();

        if (email) {
            await supabaseAdmin.from("outreach_emails").update({ status: "REPLIED", replied_at: new Date().toISOString() }).eq("id", emailId);
            await supabaseAdmin.from("prospects").update({ status: "REPLIED" }).eq("id", email.prospect_id);
            await supabaseAdmin.from("conversations").insert({
                prospect_id: email.prospect_id,
                sender: "CLIENT",
                channel: "EMAIL",
                message: replyBody
            });

            await supabaseAdmin.from("notifications").insert({
                owner_id: email.owner_id,
                prospect_id: email.prospect_id,
                type: "REPLY_RECEIVED",
                title: "New Email Reply Received",
                message: `Reply from ${fromEmail}`,
                priority: "HIGH",
                requires_action: false
            });

            const workerUrl = process.env.AGENT_WORKER_URL;
            const workerSecret = process.env.AGENT_WORKER_SECRET;
            fetch(`${workerUrl}/api/internal/agent/notify`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-AGENT-SECRET": workerSecret || "" },
                body: JSON.stringify({ action: "NEW_REPLY", prospect_id: email.prospect_id, agent_number: 3 })
            }).catch(console.error);
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: true, message: "Handled error gracefully" }, { status: 200 });
    }
}
