import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit";
import { getCollectionConfig, sanitizeCollectionPayload } from "@/lib/collections";
import { createItem, listCollection } from "@/lib/content-store";
import { logApiError } from "@/lib/logger";

type Params = { params: Promise<{ key: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { key } = await params;
  const config = getCollectionConfig(key);
  if (!config) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  try {
    const items = await listCollection(config.key);
    return NextResponse.json(items);
  } catch (err) {
    logApiError(`GET /api/collections/${key}`, err);
    return NextResponse.json({ error: "Failed to load items" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Params) {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  const { key } = await params;
  const config = getCollectionConfig(key);
  if (!config) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  try {
    const body = await request.json();
    const parsed = sanitizeCollectionPayload(config, body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error, field: parsed.field }, { status: 400 });
    }

    const item = await createItem(config.key, parsed.data);
    await writeAuditLog({
      userId: session!.user.id,
      action: `${config.key}.create`,
      entity: config.singular,
      entityId: item.id,
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    logApiError(`POST /api/collections/${key}`, err);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
