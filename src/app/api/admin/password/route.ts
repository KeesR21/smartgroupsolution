import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit";
import { setAdminPassword, verifyAdminPassword } from "@/lib/admin-credentials";
import { logApiError } from "@/lib/logger";
import { passwordStrength } from "@/lib/validation";

export async function POST(request: Request) {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const currentPassword = String(body.currentPassword ?? "");
    const newPassword = String(body.newPassword ?? "");
    const confirmPassword = String(body.confirmPassword ?? "");

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new passwords are required.", field: "currentPassword" },
        { status: 400 }
      );
    }

    if (!(await verifyAdminPassword(currentPassword))) {
      return NextResponse.json(
        { error: "Your current password is incorrect.", field: "currentPassword" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters.", field: "newPassword" },
        { status: 400 }
      );
    }

    if (!passwordStrength(newPassword).valid) {
      return NextResponse.json(
        {
          error:
            "New password is too weak. Use a mix of upper/lowercase letters, numbers and symbols.",
          field: "newPassword",
        },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation do not match.", field: "confirmPassword" },
        { status: 400 }
      );
    }

    if (await verifyAdminPassword(newPassword)) {
      return NextResponse.json(
        { error: "New password must be different from the current one.", field: "newPassword" },
        { status: 400 }
      );
    }

    await setAdminPassword(newPassword);
    await writeAuditLog({
      userId: session!.user.id,
      action: "auth.password_change",
      entity: "User",
      level: "warn",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    logApiError("POST /api/admin/password", err);
    return NextResponse.json({ error: "Failed to change password." }, { status: 500 });
  }
}
