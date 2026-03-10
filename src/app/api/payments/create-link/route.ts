import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../lib/auth";
import { supabaseAdmin } from "../../../../lib/supabase";
import { createPaymentLinkSchema } from "../../../../lib/validations";

export async function POST(req: NextRequest) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        const body = await req.json();
        const validated = createPaymentLinkSchema.parse(body);

        const { data: prospect } = await supabaseAdmin.from("prospects").select("id, email").eq("id", validated.prospect_id).eq("owner_id", user.id).single();
        if (!prospect) return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Prospect not found" } }, { status: 404 });

        const mockSessionId = "cs_test_" + Date.now();
        const mockPaymentLink = `https://checkout.stripe.com/pay/${mockSessionId}`;

        await supabaseAdmin.from("payments").insert({
            prospect_id: validated.prospect_id,
            project_id: validated.project_id || null,
            owner_id: user.id,
            amount: validated.amount,
            currency: validated.currency,
            stripe_session_id: mockSessionId,
            status: "LINK_SENT",
            payment_link: mockPaymentLink,
            link_sent_at: new Date().toISOString(),
            notes: validated.notes
        });

        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey && prospect.email) {
            fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: { "Authorization": `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    from: process.env.RESEND_FROM_EMAIL,
                    to: prospect.email,
                    subject: "Your Payment Link for NEXORIS Project",
                    html: `<p>Please complete your payment here: <a href="${mockPaymentLink}">${mockPaymentLink}</a></p>`
                })
            }).catch(console.error);
        }

        await supabaseAdmin.from("notifications").insert({
            owner_id: user.id,
            prospect_id: validated.prospect_id,
            project_id: validated.project_id || null,
            type: "PAYMENT_LINK_SENT",
            title: "Payment Link Sent",
            message: `A payment link for ${validated.amount} ${validated.currency} was sent.`,
            priority: "NORMAL"
        });

        return NextResponse.json({
            success: true,
            data: { payment_link: mockPaymentLink, expires_at: new Date(Date.now() + 86400000).toISOString() },
            message: "Payment link created and sent"
        }, { status: 200 });

    } catch (err: any) {
        if (err.name === "ZodError") {
            return NextResponse.json({ success: false, error: { code: "BAD_REQUEST", message: "Validation failed", details: err.errors } }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
