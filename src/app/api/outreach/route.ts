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
        const variation = searchParams.get("variation");
        const date_from = searchParams.get("date_from");

        const offset = (page - 1) * limit;

        let query = supabaseAdmin
            .from("outreach_emails")
            .select("*, prospects(business_name)", { count: "exact" })
            .eq("owner_id", user.id);

        if (status) query = query.eq("status", status);
        if (variation) query = query.eq("variation", variation);
        if (date_from) query = query.gte("created_at", date_from);

        const { data: emails, count, error } = await query
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed" } }, { status: 500 });

        // Flatten prospects relation if necessary
        const mapped = emails.map((e: any) => ({
            ...e,
            business_name: e.prospects?.business_name || null
        }));

        return NextResponse.json({
            success: true,
            data: { emails: mapped, total: count || 0, page, totalPages: Math.ceil((count || 0) / limit) },
            message: "Outreach emails retrieved"
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
