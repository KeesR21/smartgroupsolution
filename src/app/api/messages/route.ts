import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit";
import { createMessage, listMessages } from "@/lib/content-store";
import { logApiError } from "@/lib/logger";
import { validateContactPayload } from "@/lib/validation";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const messages = await listMessages();
    return NextResponse.json(messages);
  } catch (err) {
    logApiError("GET /api/messages", err);
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = validateContactPayload(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const record = await createMessage(validated.data);
    await writeAuditLog({
      action: "message.create",
      entity: "Message",
      entityId: record.id,
      details: `Contact from ${validated.data.email}`,
    });

    return NextResponse.json({ success: true, id: record.id }, { status: 201 });
  } catch (err) {
    logApiError("POST /api/messages", err);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}
