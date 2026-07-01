export type LogLevel = "info" | "warn" | "error";

export function logServer(level: LogLevel, message: string, detail?: string) {
  const payload = detail ? `${message} — ${detail}` : message;
  const ts = new Date().toISOString();
  const line = `[${ts}] [${level.toUpperCase()}] ${payload}`;

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.info(line);
  }
}

export function logApiError(route: string, error: unknown) {
  const msg = error instanceof Error ? error.message : String(error);
  logServer("error", `API ${route}`, msg);
}
