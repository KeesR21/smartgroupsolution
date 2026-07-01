import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit";
import { getCollectionConfig } from "@/lib/collections";
import { reorderCollection } from "@/lib/content-store";
import { logApiError } from "@/lib/logger";

type Params = { params: Promise<{ key: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  const { key } = await params;
  const config = getCollectionConfig(key);
  if (!config) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  try {
    const { orderedIds } = (await request.json()) as { orderedIds: string[] };
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "orderedIds must be an array" }, { status: 400 });
    }

    const items = await reorderCollection(config.key, orderedIds);
    await writeAuditLog({
      userId: session!.user.id,
      action: `${config.key}.reorder`,
      entity: config.singular,
      details: `${orderedIds.length} items`,
    });
    return NextResponse.json(items);
  } catch (err) {
    logApiError(`PUT /api/collections/${key}/reorder`, err);
    return NextResponse.json({ error: "Failed to reorder" }, { status: 500 });
  }
}
