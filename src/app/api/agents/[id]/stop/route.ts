import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../../lib/auth";
import { supabaseAdmin } from "../../../../../lib/supabase";

export async function POST(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) {
            return NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "Admin session required" } },
                { status: 401 }
            );
        }

        const agentIdStr = context.params.id;
        const agentId = parseInt(agentIdStr, 10);
        if (isNaN(agentId) || ![1, 2, 3].includes(agentId)) {
            return NextResponse.json(
                { success: false, error: { code: "BAD_REQUEST", message: "Agent ID must be 1, 2, or 3" } },
                { status: 400 }
            );
        }

        await supabaseAdmin
            .from("agent_configs")
            .update({ is_active: false })
            .eq("owner_id", user.id)
            .eq("agent_number", agentId);

        const workerUrl = process.env.AGENT_WORKER_URL;
        const workerSecret = process.env.AGENT_WORKER_SECRET;
        try {
            await fetch(`${workerUrl}/api/agents/${agentId}/stop`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-AGENT-SECRET": workerSecret || "",
                },
                body: JSON.stringify({ owner_id: user.id }),
            });
        } catch (e) {
            console.error("Worker stop failed", e);
        }

        await supabaseAdmin
            .from("agent_logs")
            .insert({
                owner_id: user.id,
                agent: agentId,
                action: "AGENT_STOPPED",
                status: "SUCCESS",
            });

        return NextResponse.json({
            success: true,
            data: {
                agent_id: agentId,
                status: "IDLE"
            },
            message: "Agent stopped successfully"
        }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred" } },
            { status: 500 }
        );
    }
}
