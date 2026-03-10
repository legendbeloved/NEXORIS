import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../../../lib/auth";
import { supabaseAdmin } from "../../../../../../lib/supabase";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        const { data, error } = await supabaseAdmin
            .from("notifications")
            .update({ is_read: true })
            .eq("id", params.id)
            .eq("owner_id", user.id)
            .select()
            .single();

        if (error || !data) return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Notification not found" } }, { status: 404 });

        return NextResponse.json({ success: true, message: "Marked as read" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
