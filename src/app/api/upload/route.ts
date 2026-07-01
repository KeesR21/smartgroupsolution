import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { writeAuditLog } from "@/lib/audit";
import { requireAdminSession } from "@/lib/api-auth";
import { logApiError } from "@/lib/logger";
import { isAllowedImageFile } from "@/lib/validation";

export async function POST(request: Request) {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!isAllowedImageFile(file)) {
      return NextResponse.json({ error: "File must be an image (JPG, PNG, WebP, GIF)" }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Max file size is 2MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "team");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/team/${filename}`;

    await writeAuditLog({
      userId: session!.user.id,
      action: "upload.image",
      entity: "Upload",
      details: filename,
    });

    return NextResponse.json({ url });
  } catch (err) {
    logApiError("POST /api/upload", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
