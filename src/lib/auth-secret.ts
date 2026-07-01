import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { randomBytes } from "crypto";
import path from "path";
import { logServer } from "@/lib/logger";

const SECRET_FILE =
  process.env.NEXTAUTH_SECRET_FILE || path.join(process.cwd(), "data", "auth-secret");

let cached: string | null = null;

/**
 * Resolve the NextAuth signing secret without requiring any manual
 * configuration:
 *   1. Use `NEXTAUTH_SECRET` if provided (recommended for production).
 *   2. Otherwise read a persisted secret from the data directory.
 *   3. Otherwise generate one and persist it (best effort).
 *
 * This keeps the app database-free and avoids the NextAuth
 * "server configuration" error when no env var is set, as long as the
 * data directory is writable (the same requirement as the content store).
 */
export function getAuthSecret(): string {
  if (cached) return cached;

  const fromEnv = process.env.NEXTAUTH_SECRET;
  if (fromEnv && fromEnv.trim()) {
    cached = fromEnv.trim();
    return cached;
  }

  try {
    if (existsSync(SECRET_FILE)) {
      const stored = readFileSync(SECRET_FILE, "utf8").trim();
      if (stored) {
        cached = stored;
        return cached;
      }
    }
  } catch (err) {
    logServer("warn", "[auth-secret] Could not read secret file", String(err));
  }

  const generated = randomBytes(48).toString("base64url");
  try {
    mkdirSync(path.dirname(SECRET_FILE), { recursive: true });
    writeFileSync(SECRET_FILE, generated, "utf8");
    logServer(
      "info",
      "[auth-secret] Generated and persisted a new NEXTAUTH secret",
      SECRET_FILE
    );
  } catch (err) {
    logServer(
      "warn",
      "[auth-secret] Filesystem not writable; using an in-memory secret (set NEXTAUTH_SECRET to persist sessions across restarts)",
      String(err)
    );
  }

  cached = generated;
  return cached;
}
