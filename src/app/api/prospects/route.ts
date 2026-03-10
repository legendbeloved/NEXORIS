import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../lib/auth";
import { supabaseAdmin } from "../../../lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) {
            return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin session required" } }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
        const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10), 1), 100);
        const status = searchParams.get("status");
        const city = searchParams.get("city");
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const sort_by = searchParams.get("sort_by") || "created_at";
        const sort_order = searchParams.get("sort_order") || "desc";
        const date_from = searchParams.get("date_from");

        const offset = (page - 1) * limit;

        let query = supabaseAdmin
            .from("prospects")
            .select(`*, outreach_emails(status, sent_at)`, { count: "exact" })
            .eq("owner_id", user.id)
            .is("deleted_at", null);

        if (status) query = query.eq("status", status);
        if (city) query = query.eq("city", city);
        if (category) query = query.eq("category", category);
        if (search) query = query.ilike("business_name", `%${search}%`);
        if (date_from) query = query.gte("created_at", date_from);

        query = query.order(sort_by, { ascending: sort_order === "asc" });
        query = query.range(offset, offset + limit - 1);

        const { data: prospects, count, error } = await query;

        if (error) {
            return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch prospects" } }, { status: 500 });
        }

        const mappedProspects = prospects.map((p: any) => {
            const sortedEmails = (p.outreach_emails || []).sort((a: any, b: any) => new Date(b.sent_at || 0).getTime() - new Date(a.sent_at || 0).getTime());
            const latest_email = sortedEmails.length > 0 ? sortedEmails[0] : null;
            delete p.outreach_emails;
            return { ...p, latest_email };
        });

        return NextResponse.json({
            success: true,
            data: {
                prospects: mappedProspects,
                total: count || 0,
                page,
                totalPages: Math.ceil((count || 0) / limit),
            },
            message: "Prospects retrieved successfully"
        }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
    }
}
