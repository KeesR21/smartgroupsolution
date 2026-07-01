import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit";
import { getCollectionConfig, sanitizeCollectionPayload } from "@/lib/collections";
import { deleteItem, updateItem } from "@/lib/content-store";
import { logApiError } from "@/lib/logger";

type Params = { params: Promise<{ key: string; id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  const { key, id } = await params;
  const config = getCollectionConfig(key);
  if (!config) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  try {
    const body = await request.json();
    const parsed = sanitizeCollectionPayload(config, body, true);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error, field: parsed.field }, { status: 400 });
    }

    const item = await updateItem(config.key, id, parsed.data);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await writeAuditLog({
      userId: session!.user.id,
      action: `${config.key}.update`,
      entity: config.singular,
      entityId: id,
    });
    return NextResponse.json(item);
  } catch (err) {
    logApiError(`PATCH /api/collections/${key}/${id}`, err);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  const { key, id } = await params;
  const config = getCollectionConfig(key);
  if (!config) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  try {
    const removed = await deleteItem(config.key, id);
    if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await writeAuditLog({
      userId: session!.user.id,
      action: `${config.key}.delete`,
      entity: config.singular,
      entityId: id,
      level: "warn",
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    logApiError(`DELETE /api/collections/${key}/${id}`, err);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
