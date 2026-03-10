import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../lib/auth";
import { supabaseAdmin } from "../../../../lib/supabase";

export const revalidate = 0;

export async function GET(req: NextRequest) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        const { count, error } = await supabaseAdmin
            .from("notifications")
            .select("id", { count: "exact", head: true })
            .eq("owner_id", user.id)
            .eq("is_read", false);

        if (error) return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed" } }, { status: 500 });

        const res = NextResponse.json({ count: count || 0 }, { status: 200 });
        res.headers.set('Cache-Control', 'no-store, max-age=0');
        return res;

    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
