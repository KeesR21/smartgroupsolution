"use client";

import { IconPicker } from "@/components/admin/IconPicker";
import type { FieldDef } from "@/types/admin";
import { cn } from "@/lib/utils";
import { Field, Toggle, inputClass, inputErrorClass } from "./Primitives";
import { TagsInput } from "./TagsInput";
import { ImageUploader } from "./ImageUploader";

interface FormFieldProps {
  field: FieldDef;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
  error?: string;
}

export function FormField({ field, value, onChange, error }: FormFieldProps) {
  const span = field.span === 2 ? "sm:col-span-2" : "";
  const id = `field-${field.key}`;

  const strValue = typeof value === "string" ? value : value == null ? "" : String(value);
  const counter =
    field.max && (field.type === "text" || field.type === "textarea")
      ? { value: strValue.length, max: field.max }
      : undefined;

  const control = () => {
    switch (field.type) {
      case "icon":
        return (
          <IconPicker value={strValue || "Box"} onChange={(icon) => onChange(field.key, icon)} />
        );
      case "image":
        return (
          <ImageUploader
            value={strValue}
            onChange={(url) => onChange(field.key, url)}
            rounded={field.key === "image" && field.label.toLowerCase().includes("photo")}
          />
        );
      case "tags":
        return (
          <TagsInput
            value={Array.isArray(value) ? (value as string[]) : []}
            onChange={(tags) => onChange(field.key, tags)}
          />
        );
      case "toggle":
        return (
          <Toggle
            id={id}
            checked={Boolean(value)}
            onChange={(v) => onChange(field.key, v)}
            label={field.label}
          />
        );
      case "textarea":
        return (
          <textarea
            id={id}
            rows={field.rows ?? 3}
            value={strValue}
            placeholder={field.placeholder}
            maxLength={field.max}
            onChange={(e) => onChange(field.key, e.target.value)}
            className={cn(inputClass, "resize-y", error && inputErrorClass)}
          />
        );
      case "number":
        return (
          <input
            id={id}
            type="number"
            value={strValue}
            placeholder={field.placeholder}
            onChange={(e) => onChange(field.key, e.target.value)}
            className={cn(inputClass, error && inputErrorClass)}
          />
        );
      default:
        return (
          <input
            id={id}
            type={field.type === "email" ? "email" : field.type === "tel" ? "tel" : "text"}
            value={strValue}
            placeholder={field.placeholder}
            maxLength={field.max}
            onChange={(e) => onChange(field.key, e.target.value)}
            className={cn(inputClass, error && inputErrorClass)}
          />
        );
    }
  };

  return (
    <Field
      label={field.label}
      htmlFor={id}
      required={field.required}
      help={field.help}
      error={error}
      counter={counter}
      className={span}
    >
      {control()}
    </Field>
  );
}
