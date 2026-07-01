"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Save, X } from "lucide-react";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { AdminButton } from "@/components/admin/ui/Button";
import { FormField } from "@/components/admin/ui/FormField";
import type { CollectionConfig, FieldDef } from "@/types/admin";
import { cn } from "@/lib/utils";

type Values = Record<string, unknown>;

function emptyFor(field: FieldDef): unknown {
  switch (field.type) {
    case "tags":
      return [];
    case "toggle":
      return false;
    case "number":
      return 0;
    default:
      return "";
  }
}

function seedValues(config: CollectionConfig, item: Values | null): Values {
  const values: Values = {};
  for (const field of config.fields) {
    const existing = item?.[field.key];
    values[field.key] = existing ?? emptyFor(field);
  }
  return values;
}

export function CollectionForm({
  config,
  item,
  onClose,
  onSaved,
}: {
  config: CollectionConfig;
  item: (Values & { id: string; published: boolean }) | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { notify } = useNotifications();
  const editing = Boolean(item);
  const [values, setValues] = useState<Values>(() => seedValues(config, item));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const firstErrorRef = useRef<string | null>(null);

  useEffect(() => {
    setValues(seedValues(config, item));
    setErrors({});
  }, [config, item]);

  const setValue = (key: string, value: unknown) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    firstErrorRef.current = null;
    for (const field of config.fields) {
      if (!field.required) continue;
      const v = values[field.key];
      const empty = v == null || (typeof v === "string" && v.trim() === "");
      if (empty) {
        next[field.key] = `${field.label} is required.`;
        if (!firstErrorRef.current) firstErrorRef.current = field.key;
      }
    }
    setErrors(next);
    if (firstErrorRef.current) {
      document.getElementById(`field-${firstErrorRef.current}`)?.focus();
    }
    return Object.keys(next).length === 0;
  };

  const submit = async (published: boolean) => {
    if (!validate()) {
      notify({ type: "warning", title: "Check the form", message: "Some required fields are missing." });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...values, published };
      const url = editing
        ? `/api/collections/${config.key}/${item!.id}`
        : `/api/collections/${config.key}`;
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.field) setErrors({ [data.field]: data.error });
        throw new Error(data.error || "Failed to save");
      }
      notify({
        type: "success",
        title: editing ? `${config.singular} updated` : `${config.singular} created`,
        message: published ? "Published live." : "Saved as draft.",
      });
      onSaved();
    } catch (e) {
      notify({
        type: "error",
        title: "Save failed",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  };

  const grid = useMemo(() => config.fields, [config]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[250] flex items-start justify-center overflow-y-auto p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.2 }}
          className="glass-strong relative z-10 my-auto w-full max-w-2xl rounded-2xl"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 className="text-lg font-semibold">
              {editing ? `Edit ${config.singular}` : `New ${config.singular}`}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {grid.map((field) => (
                <FormField
                  key={field.key}
                  field={field}
                  value={values[field.key]}
                  onChange={setValue}
                  error={errors[field.key]}
                />
              ))}
            </div>
          </div>

          <div
            className={cn(
              "flex flex-col gap-3 border-t border-white/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            )}
          >
            <p className="text-xs text-[var(--text-muted)]">
              {editing && item
                ? item.published
                  ? "Currently published on the site."
                  : "Currently a draft (hidden from the site)."
                : "Choose to publish now or save as a draft."}
            </p>
            <div className="flex gap-2">
              <AdminButton variant="secondary" onClick={onClose} type="button">
                Cancel
              </AdminButton>
              <AdminButton
                variant="ghost"
                icon={EyeOff}
                onClick={() => submit(false)}
                loading={saving}
                type="button"
              >
                Save Draft
              </AdminButton>
              <AdminButton
                variant="primary"
                icon={editing ? Save : Eye}
                onClick={() => submit(true)}
                loading={saving}
                type="button"
              >
                {editing ? "Save & Publish" : "Publish"}
              </AdminButton>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
