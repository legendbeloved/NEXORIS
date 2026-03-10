import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../../lib/auth";
import { supabaseAdmin } from "../../../../../lib/supabase";

export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) {
            return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin session required" } }, { status: 401 });
        }

        const agentIdStr = context.params.id;
        const agentId = parseInt(agentIdStr, 10);
        if (isNaN(agentId) || ![1, 2, 3].includes(agentId)) {
            return NextResponse.json({ success: false, error: { code: "BAD_REQUEST", message: "Agent ID must be 1, 2, or 3" } }, { status: 400 });
        }

        const { searchParams } = new URL(req.url);
        const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
        const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10), 1), 100);
        const statusFilter = searchParams.get("status");

        const offset = (page - 1) * limit;

        let query = supabaseAdmin
            .from("agent_logs")
            .select("*", { count: "exact" })
            .eq("owner_id", user.id)
            .eq("agent", agentId)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (statusFilter) {
            query = query.eq("status", statusFilter);
        }

        const { data, count, error } = await query;

        if (error) {
            return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch logs" } }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data,
            message: "Logs retrieved successfully",
            meta: {
                page,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            }
        }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
    }
}
