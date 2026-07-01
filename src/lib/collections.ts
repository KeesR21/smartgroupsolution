import type { CollectionConfig } from "@/types/admin";
import type { CollectionKey } from "@/types/cms";

export const COLLECTIONS: Record<CollectionKey, CollectionConfig> = {
  pillars: {
    key: "pillars",
    label: "Pillars",
    singular: "Pillar",
    icon: "Layers",
    route: "/admin/pillars",
    primaryField: "title",
    subtitleField: "description",
    reorderable: true,
    fields: [
      { key: "title", label: "Title", type: "text", required: true, max: 80 },
      { key: "icon", label: "Icon", type: "icon" },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
        rows: 3,
        max: 400,
        span: 2,
      },
    ],
  },
  services: {
    key: "services",
    label: "Services",
    singular: "Service",
    icon: "Briefcase",
    route: "/admin/services",
    primaryField: "title",
    subtitleField: "description",
    reorderable: true,
    fields: [
      { key: "title", label: "Title", type: "text", required: true, max: 100 },
      { key: "icon", label: "Icon", type: "icon" },
      {
        key: "description",
        label: "Summary",
        type: "textarea",
        required: true,
        rows: 3,
        max: 400,
        span: 2,
      },
      {
        key: "deliverable",
        label: "What we deliver",
        type: "textarea",
        rows: 3,
        max: 600,
        span: 2,
      },
      {
        key: "businessResult",
        label: "Business result",
        type: "textarea",
        rows: 2,
        max: 400,
        span: 2,
      },
      {
        key: "features",
        label: "Feature list",
        type: "tags",
        help: "Press Enter or comma to add each feature.",
        span: 2,
      },
      { key: "ctaLabel", label: "CTA label", type: "text", max: 40 },
      { key: "ctaHref", label: "CTA link", type: "text", placeholder: "#contact or https://" },
    ],
  },
  industries: {
    key: "industries",
    label: "Industries",
    singular: "Industry",
    icon: "Building2",
    route: "/admin/industries",
    primaryField: "name",
    subtitleField: "description",
    reorderable: true,
    fields: [
      { key: "name", label: "Name", type: "text", required: true, max: 80 },
      { key: "icon", label: "Icon", type: "icon" },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
        rows: 3,
        max: 400,
        span: 2,
      },
      {
        key: "projects",
        label: "Featured projects",
        type: "tags",
        help: "Press Enter or comma to add each project.",
        span: 2,
      },
    ],
  },
  team: {
    key: "team",
    label: "Team",
    singular: "Team member",
    icon: "Users",
    route: "/admin/team",
    primaryField: "name",
    subtitleField: "role",
    imageField: "image",
    reorderable: true,
    fields: [
      { key: "name", label: "Name", type: "text", required: true, max: 80 },
      { key: "role", label: "Position", type: "text", required: true, max: 80 },
      { key: "image", label: "Photo", type: "image", required: true, span: 2 },
      { key: "bio", label: "Biography", type: "textarea", rows: 3, max: 600, span: 2 },
      { key: "email", label: "Email", type: "email", max: 254 },
      { key: "phone", label: "Phone", type: "tel", max: 40 },
      { key: "linkedin", label: "LinkedIn", type: "url", max: 500 },
      { key: "twitter", label: "Twitter / X", type: "url", max: 500 },
      { key: "github", label: "GitHub", type: "url", max: 500 },
    ],
  },
  marketStats: {
    key: "marketStats",
    label: "Statistics",
    singular: "Statistic",
    icon: "BarChart3",
    route: "/admin/impact",
    primaryField: "value",
    subtitleField: "label",
    reorderable: true,
    fields: [
      { key: "value", label: "Value", type: "text", required: true, max: 20, placeholder: "62%" },
      { key: "label", label: "Label", type: "textarea", required: true, rows: 2, max: 200, span: 2 },
      { key: "source", label: "Source", type: "text", max: 120, span: 2 },
    ],
  },
  riskItems: {
    key: "riskItems",
    label: "Cost of inaction",
    singular: "Risk",
    icon: "AlertTriangle",
    route: "/admin/impact",
    primaryField: "title",
    subtitleField: "description",
    reorderable: true,
    fields: [
      { key: "title", label: "Title", type: "text", required: true, max: 80 },
      { key: "description", label: "Description", type: "textarea", required: true, rows: 3, max: 400, span: 2 },
    ],
  },
  successStories: {
    key: "successStories",
    label: "Success stories",
    singular: "Story",
    icon: "Trophy",
    route: "/admin/impact",
    primaryField: "title",
    subtitleField: "client",
    imageField: "image",
    reorderable: true,
    fields: [
      { key: "title", label: "Title", type: "text", required: true, max: 120 },
      { key: "client", label: "Client / sector", type: "text", max: 80 },
      { key: "metric", label: "Headline metric", type: "text", max: 40, placeholder: "60% faster" },
      { key: "description", label: "Description", type: "textarea", required: true, rows: 3, max: 500, span: 2 },
      { key: "image", label: "Image", type: "image", span: 2 },
    ],
  },
};

export function getCollectionConfig(key: string): CollectionConfig | null {
  return (COLLECTIONS as Record<string, CollectionConfig>)[key] ?? null;
}

function coerceString(value: unknown, max?: number): string {
  if (value == null) return "";
  const str = String(value).trim();
  return max ? str.slice(0, max) : str;
}

function coerceTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean).slice(0, 30);
  }
  if (typeof value === "string") {
    return value
      .split(/[,\n]/)
      .map((v) => v.trim())
      .filter(Boolean)
      .slice(0, 30);
  }
  return [];
}

export interface SanitizeResult {
  ok: boolean;
  data: Record<string, unknown>;
  error?: string;
  field?: string;
}

/**
 * Validate + sanitize an incoming payload for a collection against its schema.
 * Only known fields are kept. `partial` skips required checks (used for PATCH).
 */
export function sanitizeCollectionPayload(
  config: CollectionConfig,
  body: Record<string, unknown>,
  partial = false
): SanitizeResult {
  const data: Record<string, unknown> = {};

  for (const field of config.fields) {
    const present = Object.prototype.hasOwnProperty.call(body, field.key);
    if (!present && partial) continue;

    const raw = body[field.key];

    switch (field.type) {
      case "number": {
        const n = typeof raw === "number" ? raw : parseInt(String(raw ?? ""), 10);
        data[field.key] = Number.isFinite(n) ? n : 0;
        break;
      }
      case "toggle":
        data[field.key] = Boolean(raw);
        break;
      case "tags":
        data[field.key] = coerceTags(raw);
        break;
      case "email":
      case "url":
      case "tel": {
        const str = coerceString(raw, field.max);
        // These optional link/contact fields are stored as null when empty.
        data[field.key] = str || null;
        break;
      }
      default:
        data[field.key] = coerceString(raw, field.max);
    }

    if (field.required) {
      const v = data[field.key];
      const empty = v == null || (typeof v === "string" && v.trim() === "");
      if (empty) {
        return {
          ok: false,
          data,
          error: `${field.label} is required.`,
          field: field.key,
        };
      }
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "published")) {
    data.published = Boolean((body as { published?: unknown }).published);
  }

  return { ok: true, data };
}
