import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../../lib/auth";
import { supabaseAdmin } from "../../../../../lib/supabase";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        const { data: prospect, error } = await supabaseAdmin
            .from("prospects")
            .select(`
        *,
        outreach_emails(*),
        conversations(*),
        projects(*),
        payments(*)
      `)
            .eq("id", context.params.id)
            .eq("owner_id", user.id)
            .is("deleted_at", null)
            .single();

        if (error || !prospect) {
            return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Prospect not found" } }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: prospect, message: "Prospect details retrieved" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        const body = await req.json();
        const { status, notes } = body;
        const validStatuses = ["DISCOVERED", "ANALYZING", "QUEUED", "CONTACTED", "OPENED", "CLICKED", "REPLIED", "INTERESTED", "NEGOTIATING", "AGREED", "PAID", "IN_PROGRESS", "DELIVERED", "DECLINED", "UNRESPONSIVE", "BLACKLISTED"];

        if (status && !validStatuses.includes(status)) {
            return NextResponse.json({ success: false, error: { code: "BAD_REQUEST", message: "Invalid status enum" } }, { status: 400 });
        }

        const updates: any = {};
        if (status) updates.status = status;
        if (notes !== undefined) updates.notes = notes;

        const { data: prospect, error } = await supabaseAdmin
            .from("prospects")
            .update(updates)
            .eq("id", context.params.id)
            .eq("owner_id", user.id)
            .is("deleted_at", null)
            .select()
            .single();

        if (error || !prospect) {
            return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Prospect not found or update failed" } }, { status: 404 });
        }

        if (status) {
            await supabaseAdmin.from("agent_logs").insert({
                owner_id: user.id,
                agent: 1, // default agent info for logging manual overrides
                action: "MANUAL_STATUS_OVERRIDE",
                status: "SUCCESS",
                prospect_id: context.params.id,
                details: { new_status: status }
            });
        }

        return NextResponse.json({ success: true, data: prospect, message: "Prospect updated" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        const { error } = await supabaseAdmin
            .from("prospects")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", context.params.id)
            .eq("owner_id", user.id);

        if (error) {
            return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Deletion failed" } }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Prospect archived" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
