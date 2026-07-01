const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitizeString(value: unknown, maxLen = 5000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email) && email.length <= 254;
}

export function passwordStrength(password: string): {
  score: number;
  label: string;
  valid: boolean;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"];
  const label = labels[Math.min(score, labels.length - 1)];
  return { score, label, valid: score >= 3 && password.length >= 8 };
}

export function validateContactPayload(body: {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
}): { ok: true; data: { name: string; email: string; subject: string; message: string } } | { ok: false; error: string } {
  const name = sanitizeString(body.name, 120);
  const email = sanitizeString(body.email, 254).toLowerCase();
  const subject = sanitizeString(body.subject, 200);
  const message = sanitizeString(body.message, 5000);

  if (!name || name.length < 2) return { ok: false, error: "Name is required." };
  if (!isValidEmail(email)) return { ok: false, error: "Valid email is required." };
  if (!subject || subject.length < 3) return { ok: false, error: "Subject is required." };
  if (!message || message.length < 10) return { ok: false, error: "Message must be at least 10 characters." };

  return { ok: true, data: { name, email, subject, message } };
}

const IMAGE_EXT_RE = /\.(jpe?g|png|gif|webp|bmp|svg|avif|heic|heif)$/i;

export function isAllowedImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return IMAGE_EXT_RE.test(file.name);
}

export function validateTeamPayload(body: {
  name?: unknown;
  role?: unknown;
  image?: unknown;
  linkedin?: unknown;
  twitter?: unknown;
  github?: unknown;
}):
  | {
      ok: true;
      data: {
        name: string;
        role: string;
        image: string;
        linkedin: string | null;
        twitter: string | null;
        github: string | null;
      };
    }
  | { ok: false; error: string; field?: "name" | "role" | "image" } {
  const name = sanitizeString(body.name, 120);
  const role = sanitizeString(body.role, 120);
  const image = sanitizeString(body.image, 2000);
  const linkedin = sanitizeString(body.linkedin, 500) || null;
  const twitter = sanitizeString(body.twitter, 500) || null;
  const github = sanitizeString(body.github, 500) || null;

  if (!name) return { ok: false, error: "Name is required.", field: "name" };
  if (!role) return { ok: false, error: "Role is required.", field: "role" };
  if (!image) return { ok: false, error: "Photo is required — upload an image or paste an image URL.", field: "image" };

  return { ok: true, data: { name, role, image, linkedin, twitter, github } };
}
