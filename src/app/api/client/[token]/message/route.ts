import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../../lib/supabase";
import { clientMessageSchema } from "../../../../../../lib/validations";

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
    try {
        const token = params.token;
        const body = await req.json();
        const validated = clientMessageSchema.parse(body);

        const { data: prospect } = await supabaseAdmin
            .from("prospects")
            .select("id, status, owner_id")
            .eq("client_token", token)
            .is("deleted_at", null)
            .neq("status", "BLACKLISTED")
            .single();

        if (!prospect) return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Invalid token" } }, { status: 404 });

        const { data: conv } = await supabaseAdmin.from("conversations").insert({
            prospect_id: prospect.id,
            sender: "CLIENT",
            channel: "PORTAL",
            message: validated.message
        }).select("id").single();

        if (prospect.status !== "REPLIED" && prospect.status !== "INTERESTED" && prospect.status !== "NEGOTIATING" && prospect.status !== "AGREED") {
            await supabaseAdmin.from("prospects").update({ status: "REPLIED" }).eq("id", prospect.id);
        }

        await supabaseAdmin.from("notifications").insert({
            owner_id: prospect.owner_id,
            prospect_id: prospect.id,
            type: "REPLY_RECEIVED",
            title: "New Portal Message Received",
            message: `A client sent a new message via the portal.`,
            priority: "HIGH"
        });

        const workerUrl = process.env.AGENT_WORKER_URL;
        const workerSecret = process.env.AGENT_WORKER_SECRET;
        fetch(`${workerUrl}/api/internal/agent/notify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-AGENT-SECRET": workerSecret || "" },
            body: JSON.stringify({ action: "NEW_PORTAL_MESSAGE", prospect_id: prospect.id, conversation_id: conv?.id, agent_number: 3 })
        }).catch(console.error);

        return NextResponse.json({
            success: true,
            data: { message_id: conv?.id },
            message: "Message sent"
        }, { status: 200 });

    } catch (err: any) {
        if (err.name === "ZodError") {
            return NextResponse.json({ success: false, error: { code: "BAD_REQUEST", message: "Validation failed" } }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
