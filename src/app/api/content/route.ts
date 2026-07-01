import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit";
import { getSiteData, updateContent } from "@/lib/content-store";
import { logApiError } from "@/lib/logger";

export async function GET() {
  try {
    const data = await getSiteData();
    return NextResponse.json(data.content);
  } catch (err) {
    logApiError("GET /api/content", err);
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const { id, ...patch } = body;
    void id;

    const content = await updateContent(patch);
    await writeAuditLog({
      userId: session!.user.id,
      action: "content.update",
      entity: "SiteContent",
      entityId: "main",
    });
    return NextResponse.json(content);
  } catch (err) {
    logApiError("PATCH /api/content", err);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
