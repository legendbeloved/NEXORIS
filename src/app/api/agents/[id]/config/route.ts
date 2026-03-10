import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../../lib/auth";
import { supabaseAdmin } from "../../../../../lib/supabase";
import { agent1ConfigSchema, agent2ConfigSchema, agent3ConfigSchema } from "../../../../../lib/validations";

export async function PATCH(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) {
            return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin session required" } }, { status: 401 });
        }

        const agentIdStr = context.params.id;
        const agentId = parseInt(agentIdStr, 10);
        if (isNaN(agentId) || ![1, 2, 3].includes(agentId)) {
            return NextResponse.json({ success: false, error: { code: "BAD_REQUEST", message: "Agent ID must be 1, 2, or 3" } }, { status: 400 });
        }

        const body = await req.json();
        let validatedData;

        try {
            if (agentId === 1) validatedData = agent1ConfigSchema.parse(body);
            else if (agentId === 2) validatedData = agent2ConfigSchema.parse(body);
            else if (agentId === 3) validatedData = agent3ConfigSchema.parse(body);
        } catch (validationError: any) {
            return NextResponse.json({
                success: false,
                error: { code: "BAD_REQUEST", message: "Validation failed", details: validationError.errors }
            }, { status: 400 });
        }

        const { data: currentConfig, error: fetchError } = await supabaseAdmin
            .from("agent_configs")
            .select("config")
            .eq("owner_id", user.id)
            .eq("agent_number", agentId)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch existing config" } }, { status: 500 });
        }

        const mergedConfig = {
            ...(currentConfig?.config || {}),
            ...validatedData
        };

        const { data: updated, error: updateError } = await supabaseAdmin
            .from("agent_configs")
            .upsert({
                owner_id: user.id,
                agent_number: agentId,
                config: mergedConfig
            }, { onConflict: "owner_id,agent_number" })
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to update config" } }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: updated.config,
            message: "Config updated successfully"
        }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
    }
}
