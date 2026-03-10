import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../lib/auth";
import { supabaseAdmin } from "../../../../lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        const { data: prospects } = await supabaseAdmin.from("prospects").select("status").eq("owner_id", user.id);

        let discovered = 0, contacted = 0, opened = 0, replied = 0, negotiating = 0, agreed = 0, paid = 0, delivered = 0;

        (prospects || []).forEach(p => {
            discovered++;
            const s = p.status;
            if (["CONTACTED", "OPENED", "CLICKED", "REPLIED", "INTERESTED", "NEGOTIATING", "AGREED", "PAID", "IN_PROGRESS", "DELIVERED"].includes(s)) contacted++;
            if (["OPENED", "CLICKED", "REPLIED", "INTERESTED", "NEGOTIATING", "AGREED", "PAID", "IN_PROGRESS", "DELIVERED"].includes(s)) opened++;
            if (["REPLIED", "INTERESTED", "NEGOTIATING", "AGREED", "PAID", "IN_PROGRESS", "DELIVERED"].includes(s)) replied++;
            if (["NEGOTIATING", "AGREED", "PAID", "IN_PROGRESS", "DELIVERED"].includes(s)) negotiating++;
            if (["AGREED", "PAID", "IN_PROGRESS", "DELIVERED"].includes(s)) agreed++;
            if (["PAID", "IN_PROGRESS", "DELIVERED"].includes(s)) paid++;
            if (["DELIVERED"].includes(s)) delivered++;
        });

        const drop_off = (from: number, to: number) => from ? ((from - to) / from) * 100 : 0;

        return NextResponse.json({
            success: true,
            data: {
                funnel: { discovered, contacted, opened, replied, negotiating, agreed, paid, delivered },
                drop_offs: {
                    discovered_to_contacted: drop_off(discovered, contacted),
                    contacted_to_opened: drop_off(contacted, opened),
                    opened_to_replied: drop_off(opened, replied),
                    replied_to_negotiating: drop_off(replied, negotiating),
                    negotiating_to_agreed: drop_off(negotiating, agreed),
                    agreed_to_paid: drop_off(agreed, paid),
                    paid_to_delivered: drop_off(paid, delivered),
                }
            },
            message: "Conversion analytics retrieved"
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
