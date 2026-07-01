import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit";
import { deleteMessage, updateMessage } from "@/lib/content-store";
import { logApiError } from "@/lib/logger";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const message = await updateMessage(id, {
      ...(body.read !== undefined && { read: Boolean(body.read) }),
    });
    if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await writeAuditLog({
      userId: session!.user.id,
      action: body.read ? "message.read" : "message.unread",
      entity: "Message",
      entityId: message.id,
      details: message.subject,
    });
    return NextResponse.json(message);
  } catch (err) {
    logApiError("PATCH /api/messages/[id]", err);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const removed = await deleteMessage(id);
    if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await writeAuditLog({
      userId: session!.user.id,
      action: "message.delete",
      entity: "Message",
      entityId: id,
      level: "warn",
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    logApiError("DELETE /api/messages/[id]", err);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
