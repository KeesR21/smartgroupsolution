import type { CollectionKey } from "@/types/cms";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "icon"
  | "image"
  | "url"
  | "toggle"
  | "tags"
  | "email"
  | "tel";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  /** Character limit (text/textarea). */
  max?: number;
  /** Rows for textarea fields. */
  rows?: number;
  /** Grid span in the form layout. */
  span?: 1 | 2;
}

export interface CollectionConfig {
  key: CollectionKey;
  label: string;
  singular: string;
  icon: string;
  /** Route segment, e.g. /admin/pillars. */
  route: string;
  primaryField: string;
  subtitleField?: string;
  imageField?: string;
  reorderable: boolean;
  fields: FieldDef[];
}
