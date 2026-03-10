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
        const is_read = searchParams.get("is_read");
        const priority = searchParams.get("priority");
        const type = searchParams.get("type");
        const requires_action = searchParams.get("requires_action");

        const offset = (page - 1) * limit;

        let query = supabaseAdmin
            .from("notifications")
            .select("*", { count: "exact" })
            .eq("owner_id", user.id);

        if (is_read !== null) query = query.eq("is_read", is_read === "true");
        if (priority) query = query.eq("priority", priority);
        if (type) query = query.eq("type", type);
        if (requires_action !== null) query = query.eq("requires_action", requires_action === "true");

        const { data: notifications, count, error } = await query
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed" } }, { status: 500 });

        const { count: unread_count } = await supabaseAdmin.from("notifications").select("*", { count: "exact", head: true }).eq("owner_id", user.id).eq("is_read", false);

        return NextResponse.json({
            success: true,
            data: { notifications, unread_count: unread_count || 0, total: count || 0, page, totalPages: Math.ceil((count || 0) / limit) },
            message: "Notifications retrieved"
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
