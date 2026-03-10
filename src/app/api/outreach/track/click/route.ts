import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const emailId = searchParams.get("emailId");
    const prospectId = searchParams.get("prospectId");
    const destination = searchParams.get("destination");

    if (!destination) {
        return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL || '/');
    }

    if (emailId && prospectId) {
        const { data: email } = await supabaseAdmin
            .from("outreach_emails")
            .select("id, status, click_count, owner_id")
            .eq("id", emailId)
            .single();

        if (email) {
            const isFirstClick = !["CLICKED", "REPLIED"].includes(email.status);
            const updates: any = { click_count: email.click_count + 1 };
            if (isFirstClick) {
                updates.status = "CLICKED";
                updates.clicked_at = new Date().toISOString();
            }

            await supabaseAdmin.from("outreach_emails").update(updates).eq("id", emailId);
            await supabaseAdmin.from("prospects").update({ status: "CLICKED" }).eq("id", prospectId).in('status', ['CONTACTED', 'OPENED']);
        }
    }

    return NextResponse.redirect(decodeURIComponent(destination));
}
