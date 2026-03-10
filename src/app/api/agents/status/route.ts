import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../lib/auth";
import { supabaseAdmin } from "../../../../lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) {
            return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin session required" } }, { status: 401 });
        }

        const { data: configs, error } = await supabaseAdmin
            .from("agent_configs")
            .select("agent_number, is_active, last_run_at, runs_count")
            .eq("owner_id", user.id)
            .order("agent_number", { ascending: true });

        if (error || !configs) {
            return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch agent status" } }, { status: 500 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString();

        const { count: prospectsCount } = await supabaseAdmin
            .from("prospects")
            .select("*", { count: "exact", head: true })
            .eq("owner_id", user.id)
            .gte("created_at", todayStr);

        const { count: emailsCount } = await supabaseAdmin
            .from("outreach_emails")
            .select("*", { count: "exact", head: true })
            .eq("owner_id", user.id)
            .gte("sent_at", todayStr);

        const data = configs.map((c: any) => ({
            id: c.agent_number,
            is_active: c.is_active,
            last_run_at: c.last_run_at,
            runs_count: c.runs_count,
            prospects_found_today: c.agent_number === 1 ? (prospectsCount || 0) : 0,
            emails_sent_today: c.agent_number === 2 ? (emailsCount || 0) : 0,
        }));

        return NextResponse.json({
            success: true,
            data,
            message: "Agent statuses retrieved successfully"
        }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
    }
}
