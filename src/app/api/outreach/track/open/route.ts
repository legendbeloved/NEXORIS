import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const emailId = searchParams.get("emailId");
    const prospectId = searchParams.get("prospectId");

    if (emailId && prospectId) {
        const { data: email } = await supabaseAdmin
            .from("outreach_emails")
            .select("id, status, open_count, owner_id")
            .eq("id", emailId)
            .single();

        if (email) {
            const isFirstOpen = !["OPENED", "CLICKED", "REPLIED"].includes(email.status);

            const updates: any = { open_count: email.open_count + 1 };
            if (isFirstOpen) {
                updates.status = "OPENED";
                updates.opened_at = new Date().toISOString();
            }

            await supabaseAdmin.from("outreach_emails").update(updates).eq("id", emailId);

            if (isFirstOpen) {
                await supabaseAdmin.from("prospects").update({ status: "OPENED" }).eq("id", prospectId).eq("status", "CONTACTED");

                await supabaseAdmin.from("notifications").insert({
                    owner_id: email.owner_id,
                    prospect_id: prospectId,
                    type: "EMAIL_OPENED",
                    title: "Email Opened",
                    message: "A prospect just opened your outreach email.",
                    priority: "NORMAL"
                });
            }
        }
    }

    const pixel = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        'base64'
    );

    return new NextResponse(pixel, {
        status: 200,
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'no-store'
        }
    });
}
