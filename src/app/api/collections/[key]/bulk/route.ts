import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit";
import { getCollectionConfig } from "@/lib/collections";
import { deleteManyItems, setPublishedMany } from "@/lib/content-store";
import { logApiError } from "@/lib/logger";

type Params = { params: Promise<{ key: string }> };

type BulkBody = {
  action: "delete" | "publish" | "unpublish";
  ids: string[];
};

export async function POST(request: Request, { params }: Params) {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  const { key } = await params;
  const config = getCollectionConfig(key);
  if (!config) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  try {
    const { action, ids } = (await request.json()) as BulkBody;
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No items selected" }, { status: 400 });
    }

    let count = 0;
    if (action === "delete") {
      count = await deleteManyItems(config.key, ids);
    } else if (action === "publish" || action === "unpublish") {
      count = await setPublishedMany(config.key, ids, action === "publish");
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    await writeAuditLog({
      userId: session!.user.id,
      action: `${config.key}.bulk_${action}`,
      entity: config.singular,
      details: `${count} items`,
      level: action === "delete" ? "warn" : "info",
    });
    return NextResponse.json({ success: true, count });
  } catch (err) {
    logApiError(`POST /api/collections/${key}/bulk`, err);
    return NextResponse.json({ error: "Bulk action failed" }, { status: 500 });
  }
}
