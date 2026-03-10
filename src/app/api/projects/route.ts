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
        const service_type = searchParams.get("service_type");

        const offset = (page - 1) * limit;

        let query = supabaseAdmin
            .from("projects")
            .select("*, prospects(business_name), payments(amount)", { count: "exact" })
            .eq("owner_id", user.id);

        if (status) query = query.eq("status", status);
        if (service_type) query = query.eq("service_type", service_type);

        const { data: projects, count, error } = await query
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed" } }, { status: 500 });

        const mapped = projects.map((p: any) => ({
            ...p,
            business_name: p.prospects?.business_name || null,
            payment_amount: p.payments?.length ? p.payments[0].amount : null
        }));

        return NextResponse.json({
            success: true,
            data: { projects: mapped, total: count || 0, page, totalPages: Math.ceil((count || 0) / limit) },
            message: "Projects retrieved"
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
