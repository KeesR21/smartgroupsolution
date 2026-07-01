import { logServer } from "@/lib/logger";

export type AuditLevel = "info" | "warn" | "error";

/**
 * Lightweight audit logging. With no database in use, entries are written to
 * the server log. Swap `logServer` for a file/webhook sink if you need
 * durable audit history.
 */
export async function writeAuditLog(params: {
  userId?: string | null;
  action: string;
  entity?: string;
  entityId?: string;
  details?: string;
  level?: AuditLevel;
}) {
  const parts = [
    params.action,
    params.entity ? `entity=${params.entity}` : null,
    params.entityId ? `id=${params.entityId}` : null,
    params.userId ? `user=${params.userId}` : null,
  ]
    .filter(Boolean)
    .join(" ");
  logServer(params.level ?? "info", `[audit] ${parts}`, params.details);
}
