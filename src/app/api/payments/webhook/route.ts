import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const sig = req.headers.get("stripe-signature");
        const secret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!sig || !secret) {
            return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Missing sig" } }, { status: 401 });
        }

        let event: any;
        try {
            event = JSON.parse(payload);
        } catch (err) {
            return NextResponse.json({ success: false, error: { code: "BAD_REQUEST", message: "Invalid JSON" } }, { status: 400 });
        }

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const { prospect_id, project_id, owner_id } = session.metadata || {};

            const { data: currentPayment } = await supabaseAdmin.from("payments").select("status").eq("stripe_session_id", session.id).single();
            if (currentPayment && currentPayment.status !== "PAID") {
                await supabaseAdmin.from("payments").update({
                    status: "PAID",
                    paid_at: new Date().toISOString(),
                    stripe_receipt_url: session.receipt_url || null
                }).eq("stripe_session_id", session.id);

                if (prospect_id) {
                    await supabaseAdmin.from("prospects").update({ status: "PAID" }).eq("id", prospect_id);
                }

                if (project_id) {
                    await supabaseAdmin.from("projects").update({ status: "IN_PROGRESS" }).eq("id", project_id);
                }

                if (prospect_id && owner_id) {
                    const { data: prospect } = await supabaseAdmin.from("prospects").select("email").eq("id", prospect_id).single();
                    if (prospect?.email) {
                        fetch("https://api.resend.com/emails", {
                            method: "POST",
                            headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
                            body: JSON.stringify({
                                from: process.env.RESEND_FROM_EMAIL!,
                                to: prospect.email,
                                subject: "Payment Receipt",
                                html: `<p>Thank you for your payment.</p>`
                            })
                        }).catch(console.error);
                    }

                    await supabaseAdmin.from("notifications").insert({
                        owner_id: owner_id,
                        prospect_id: prospect_id,
                        project_id: project_id || null,
                        type: "PAYMENT_RECEIVED",
                        title: "Payment Received",
                        message: `Payment completed for session ${session.id}`,
                        priority: "URGENT"
                    });
                }
            }
        } else if (event.type === "payment_intent.payment_failed") {
            const pi = event.data.object;
            const { data: currentPayment } = await supabaseAdmin.from("payments").select("id, status, owner_id, prospect_id").eq("stripe_payment_intent", pi.id).single();

            if (currentPayment && currentPayment.status !== "FAILED") {
                await supabaseAdmin.from("payments").update({ status: "FAILED" }).eq("id", currentPayment.id);

                await supabaseAdmin.from("notifications").insert({
                    owner_id: currentPayment.owner_id,
                    prospect_id: currentPayment.prospect_id,
                    type: "PAYMENT_FAILED",
                    title: "Payment Failed",
                    message: `A payment attempt failed.`,
                    priority: "HIGH",
                    requires_action: true
                });
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ received: true }, { status: 200 });
    }
}
