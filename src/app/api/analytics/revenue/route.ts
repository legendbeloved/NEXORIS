import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../lib/auth";
import { supabaseAdmin } from "../../../../lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period") || "30d";

        let days = 30;
        if (period === "7d") days = 7;
        else if (period === "90d") days = 90;
        else if (period === "1y") days = 365;

        const start = new Date();
        start.setDate(start.getDate() - days);

        const { data: payments } = await supabaseAdmin
            .from("payments")
            .select("amount, paid_at")
            .eq("owner_id", user.id)
            .eq("status", "PAID")
            .gte("paid_at", start.toISOString());

        const labels = [];
        const revenue = [];
        const deals = [];

        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const label = d.toISOString().split("T")[0];
            labels.push(label);

            const dayPayments = (payments || []).filter(p => p.paid_at && p.paid_at.startsWith(label));
            revenue.push(dayPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0));
            deals.push(dayPayments.length);
        }

        return NextResponse.json({
            success: true,
            data: { labels, revenue, deals },
            message: "Revenue chart data retrieved"
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
