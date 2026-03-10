import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../lib/auth";
import { supabaseAdmin } from "../../../../lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        const now = new Date();
        const todayStr = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        const weekAgoStr = weekAgo.toISOString();
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        const monthAgoStr = monthAgo.toISOString();

        const { data: pTotal } = await supabaseAdmin.from("prospects").select("id", { count: "exact" }).eq("owner_id", user.id);
        const { data: pToday } = await supabaseAdmin.from("prospects").select("id", { count: "exact" }).eq("owner_id", user.id).gte("created_at", todayStr);
        const { data: pWeek } = await supabaseAdmin.from("prospects").select("id", { count: "exact" }).eq("owner_id", user.id).gte("created_at", weekAgoStr);

        const { data: emails } = await supabaseAdmin.from("outreach_emails").select("status, created_at").eq("owner_id", user.id);
        let total_sent = 0, today_sent = 0, opens = 0, clicks = 0, replies = 0;

        (emails || []).forEach(e => {
            if (["SENT", "DELIVERED", "OPENED", "CLICKED", "REPLIED"].includes(e.status)) {
                total_sent++;
                if (new Date(e.created_at) >= new Date(todayStr)) today_sent++;
            }
            if (["OPENED", "CLICKED", "REPLIED"].includes(e.status)) opens++;
            if (["CLICKED", "REPLIED"].includes(e.status)) clicks++;
            if (e.status === "REPLIED") replies++;
        });

        const { data: px } = await supabaseAdmin.from("projects").select("id, status, created_at").eq("owner_id", user.id);
        let deals_closed = 0, deals_this_week = 0;
        (px || []).forEach(p => {
            deals_closed++;
            if (new Date(p.created_at) >= new Date(weekAgoStr)) deals_this_week++;
        });

        const { data: py } = await supabaseAdmin.from("payments").select("amount, status, created_at").eq("owner_id", user.id).eq("status", "PAID");
        let rev_total = 0, rev_week = 0, rev_month = 0;
        (py || []).forEach(p => {
            const amt = parseFloat(p.amount);
            rev_total += amt;
            const d = new Date(p.created_at);
            if (d >= new Date(weekAgoStr)) rev_week += amt;
            if (d >= new Date(monthAgoStr)) rev_month += amt;
        });

        const open_rate = total_sent ? (opens / total_sent) * 100 : 0;
        const click_rate = total_sent ? (clicks / total_sent) * 100 : 0;
        const reply_rate = total_sent ? (replies / total_sent) * 100 : 0;
        const conversion_rate = (pTotal?.length || 0) ? (deals_closed / (pTotal?.length || 1)) * 100 : 0;
        const avg_deal_value = deals_closed ? rev_total / deals_closed : 0;

        return NextResponse.json({
            success: true,
            data: {
                total_prospects: pTotal?.length || 0,
                prospects_today: pToday?.length || 0,
                prospects_this_week: pWeek?.length || 0,
                emails_sent: total_sent,
                emails_sent_today: today_sent,
                open_rate, click_rate, reply_rate,
                deals_closed, deals_this_week,
                revenue_total: rev_total,
                revenue_this_week: rev_week,
                revenue_this_month: rev_month,
                conversion_rate, avg_deal_value,
                avg_days_to_close: 14
            },
            message: "Analytics overview retrieved"
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
