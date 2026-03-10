import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../../lib/auth";
import { supabaseAdmin } from "../../../../../lib/supabase";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await verifyAdminSession(req);
        if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin req" } }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file || file.size > 50 * 1024 * 1024) {
            return NextResponse.json({ success: false, error: { code: "BAD_REQUEST", message: "File missing or > 50MB" } }, { status: 400 });
        }

        const { data: project } = await supabaseAdmin.from("projects").select("id, delivery_files").eq("id", params.id).eq("owner_id", user.id).single();
        if (!project) return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Project not found" } }, { status: 404 });

        const fileExt = file.name.split('.').pop();
        const fileName = `${params.id}-${Date.now()}.${fileExt}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: storageError } = await supabaseAdmin.storage
            .from("deliverables")
            .upload(fileName, buffer, { contentType: file.type });

        if (storageError) {
            return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Upload failed" } }, { status: 500 });
        }

        const { data: publicUrlData } = supabaseAdmin.storage.from("deliverables").getPublicUrl(fileName);

        const newFile = {
            name: file.name,
            url: publicUrlData.publicUrl,
            size: file.size,
            type: file.type,
            uploaded_at: new Date().toISOString()
        };

        const updatedFiles = [...(project.delivery_files || []), newFile];

        const { data: updatedProject, error: updateError } = await supabaseAdmin
            .from("projects")
            .update({ delivery_files: updatedFiles })
            .eq("id", params.id)
            .select("delivery_files")
            .single();

        if (updateError) {
            return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Database update failed" } }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: updatedProject.delivery_files, message: "File uploaded" }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Error" } }, { status: 500 });
    }
}
