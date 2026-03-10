import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../lib/auth";
import { supabaseAdmin } from "../../../lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
        const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10), 1), 100);
        const status = searchParams.get("status");
        const month = searchParams.get("month");

        const offset = (page - 1) * limit;

        let query = supabaseAdmin
            .from("payments")
            .select("*, prospects(business_name)", { count: "exact" })
            .eq("owner_id", user.id);

        if (status) query = query.eq("status", status);
        if (month) {
            const start = new Date(`${month}-01T00:00:00Z`);
            const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
            query = query.gte("created_at", start.toISOString()).lt("created_at", end.toISOString());
        }

        const { data: payments, count, error } = await query
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed" } }, { status: 500 });

        const mapped = payments.map((p: any) => ({
            ...p,
            business_name: p.prospects?.business_name || null
        }));

        const { data: allPaid } = await supabaseAdmin.from("payments").select("amount, created_at").eq("owner_id", user.id).eq("status", "PAID");

        let total_revenue = 0;
        let this_month = 0;
        const now = new Date();

        if (allPaid) {
            allPaid.forEach(p => {
                const amt = parseFloat(p.amount) || 0;
                total_revenue += amt;
                const paidAt = new Date(p.created_at);
                if (paidAt.getFullYear() === now.getFullYear() && paidAt.getMonth() === now.getMonth()) {
                    this_month += amt;
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: { payments: mapped, total_revenue, this_month, total: count || 0, page, totalPages: Math.ceil((count || 0) / limit) },
            message: "Payments retrieved"
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
