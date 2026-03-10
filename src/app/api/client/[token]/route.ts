import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
    try {
        const token = params.token;

        const { data: prospect, error } = await supabaseAdmin
            .from("prospects")
            .select("id, business_name, category, city, pain_points, ai_analysis, mockup_url, status, projects(status, service_type), payments(status)")
            .eq("client_token", token)
            .is("deleted_at", null)
            .neq("status", "BLACKLISTED")
            .single();

        if (error || !prospect) {
            return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Invalid or expired token" } }, { status: 404 });
        }

        const resData = {
            business_name: prospect.business_name,
            category: prospect.category,
            city: prospect.city,
            pain_points: prospect.pain_points,
            ai_analysis: prospect.ai_analysis,
            mockup_url: prospect.mockup_url,
            status: prospect.status,
            services_proposed: prospect.projects?.map((p: any) => p.service_type) || [],
            project_status: prospect.projects?.length ? prospect.projects[0].status : null,
            payment_status: prospect.payments?.length ? prospect.payments[0].status : null
        };

        return NextResponse.json({
            success: true,
            data: resData,
            message: "Portal data retrieved"
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
