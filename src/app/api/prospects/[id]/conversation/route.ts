import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../../../lib/auth";
import { supabaseAdmin } from "../../../../../../lib/supabase";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        // Verify ownership first
        const { data: prospect, error: pError } = await supabaseAdmin
            .from("prospects")
            .select("id")
            .eq("id", context.params.id)
            .eq("owner_id", user.id)
            .single();

        if (pError || !prospect) {
            return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Prospect not found" } }, { status: 404 });
        }

        const { data: conversations, error } = await supabaseAdmin
            .from("conversations")
            .select("*")
            .eq("prospect_id", context.params.id)
            .order("created_at", { ascending: true }); // oldest first

        if (error) {
            return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch conversations" } }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: conversations, message: "Conversations retrieved" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
