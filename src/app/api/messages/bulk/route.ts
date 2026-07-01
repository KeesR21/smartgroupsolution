import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit";
import { deleteManyMessages, setMessagesRead } from "@/lib/content-store";
import { logApiError } from "@/lib/logger";

type BulkBody = {
  action: "delete" | "read" | "unread";
  ids: string[];
};

export async function POST(request: Request) {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  try {
    const { action, ids } = (await request.json()) as BulkBody;
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No messages selected" }, { status: 400 });
    }

    let count = 0;
    if (action === "delete") {
      count = await deleteManyMessages(ids);
    } else if (action === "read" || action === "unread") {
      count = await setMessagesRead(ids, action === "read");
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    await writeAuditLog({
      userId: session!.user.id,
      action: `message.bulk_${action}`,
      entity: "Message",
      details: `${count} items`,
      level: action === "delete" ? "warn" : "info",
    });
    return NextResponse.json({ success: true, count });
  } catch (err) {
    logApiError("POST /api/messages/bulk", err);
    return NextResponse.json({ error: "Bulk action failed" }, { status: 500 });
  }
}
