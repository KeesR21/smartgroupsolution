import { existsSync } from "fs";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import bcrypt from "bcryptjs";
import { logServer } from "@/lib/logger";

export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@smartgroupsolution.com")
  .toLowerCase()
  .trim();
export const ADMIN_NAME = process.env.ADMIN_NAME || "Administrator";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123!";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";

const AUTH_FILE =
  process.env.ADMIN_AUTH_FILE || path.join(process.cwd(), "data", "admin.json");

const BCRYPT_ROUNDS = 12;

interface AuthFile {
  passwordHash: string;
  updatedAt: string;
}

let cache: AuthFile | null = null;

async function readAuthFile(): Promise<AuthFile | null> {
  if (cache) return cache;
  if (!existsSync(AUTH_FILE)) return null;
  try {
    const raw = await readFile(AUTH_FILE, "utf8");
    const parsed = JSON.parse(raw) as AuthFile;
    if (parsed && typeof parsed.passwordHash === "string" && parsed.passwordHash) {
      cache = parsed;
      return parsed;
    }
    return null;
  } catch (err) {
    logServer("error", "[admin-credentials] Failed to read auth file", String(err));
    return null;
  }
}

async function writeAuthFile(data: AuthFile): Promise<void> {
  await mkdir(path.dirname(AUTH_FILE), { recursive: true });
  const tmp = `${AUTH_FILE}.${randomUUID()}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await rename(tmp, AUTH_FILE);
  cache = data;
}

/** True when the admin password has been changed from the dashboard. */
export async function hasStoredPassword(): Promise<boolean> {
  return (await readAuthFile()) !== null;
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Verify a submitted password. Precedence:
 *   1. Stored hash (set via the admin dashboard)
 *   2. ADMIN_PASSWORD_HASH env (bcrypt)
 *   3. ADMIN_PASSWORD env (plain text)
 */
export async function verifyAdminPassword(submitted: string): Promise<boolean> {
  if (!submitted) return false;

  const stored = await readAuthFile();
  if (stored) {
    try {
      return await bcrypt.compare(submitted, stored.passwordHash);
    } catch {
      return false;
    }
  }

  if (ADMIN_PASSWORD_HASH) {
    try {
      return await bcrypt.compare(submitted, ADMIN_PASSWORD_HASH);
    } catch {
      return false;
    }
  }

  return constantTimeEquals(submitted, ADMIN_PASSWORD);
}

/** Persist a new admin password (hashed) to the auth file. */
export async function setAdminPassword(newPlain: string): Promise<void> {
  const passwordHash = await bcrypt.hash(newPlain, BCRYPT_ROUNDS);
  await writeAuthFile({ passwordHash, updatedAt: new Date().toISOString() });
}
