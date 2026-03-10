import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../../lib/auth";
import { supabaseAdmin } from "../../../../../lib/supabase";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        const { data: project, error } = await supabaseAdmin
            .from("projects")
            .select(`*, prospects(*), payments(*)`)
            .eq("id", params.id)
            .eq("owner_id", user.id)
            .single();

        if (error || !project) return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Project not found" } }, { status: 404 });

        return NextResponse.json({ success: true, data: project, message: "Project details retrieved" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        const body = await req.json();
        const { status, deadline, delivery_notes } = body;
        const updates: any = {};
        if (status) updates.status = status;
        if (deadline) updates.deadline = deadline;
        if (delivery_notes !== undefined) updates.delivery_notes = delivery_notes;

        const { data: project, error } = await supabaseAdmin
            .from("projects")
            .update(updates)
            .eq("id", params.id)
            .eq("owner_id", user.id)
            .select()
            .single();

        if (error || !project) return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Project not found or update failed" } }, { status: 404 });

        if (status === "DELIVERED") {
            await supabaseAdmin.from("prospects").update({ status: "DELIVERED" }).eq("id", project.prospect_id);

            await supabaseAdmin.from("notifications").insert({
                owner_id: user.id,
                prospect_id: project.prospect_id,
                project_id: project.id,
                type: "PROJECT_DELIVERED",
                title: "Project Delivered",
                message: "You have marked the project as delivered.",
                priority: "NORMAL"
            });
            const { data: prospect } = await supabaseAdmin.from("prospects").select("email").eq("id", project.prospect_id).single();
            const resendApiKey = process.env.RESEND_API_KEY;
            if (resendApiKey && prospect?.email) {
                fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
                    body: JSON.stringify({
                        from: process.env.RESEND_FROM_EMAIL,
                        to: prospect.email,
                        subject: `Your project ${project.title} has been delivered`,
                        html: `<p>Please check your portal to view the deliverables.</p>`
                    })
                }).catch(console.error);
            }
        }

        return NextResponse.json({ success: true, data: project, message: "Project updated" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
