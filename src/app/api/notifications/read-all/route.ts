import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../lib/auth";
import { supabaseAdmin } from "../../../../lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        const { data, error } = await supabaseAdmin
            .from("notifications")
            .update({ is_read: true })
            .eq("owner_id", user.id)
            .eq("is_read", false)
            .select("id");

        if (error) return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Update failed" } }, { status: 500 });

        return NextResponse.json({ success: true, data: { updated_count: data?.length || 0 }, message: "All marked as read" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
