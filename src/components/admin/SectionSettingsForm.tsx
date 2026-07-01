"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, RotateCcw, Save } from "lucide-react";
import Link from "next/link";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { GlassPanel } from "@/components/admin/GlassPanel";
import { AdminButton } from "@/components/admin/ui/Button";
import { FormField } from "@/components/admin/ui/FormField";
import type { FieldDef } from "@/types/admin";
import type { SiteContentRecord } from "@/types/cms";

export interface SettingsGroup {
  title: string;
  description?: string;
  fields: FieldDef[];
}

type Values = Record<string, unknown>;

export function SectionSettingsForm({
  groups,
  initialContent,
  previewHref = "/",
  inline = false,
}: {
  groups: SettingsGroup[];
  initialContent: SiteContentRecord;
  previewHref?: string;
  inline?: boolean;
}) {
  const { notify } = useNotifications();
  const initial = useMemo(() => {
    const v: Values = {};
    for (const group of groups) {
      for (const field of group.fields) {
        v[field.key] = (initialContent as unknown as Values)[field.key] ?? "";
      }
    }
    return v;
  }, [groups, initialContent]);

  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => setValues(initial), [initial]);

  const dirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initial),
    [values, initial]
  );

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const setValue = (key: string, value: unknown) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const save = async () => {
    const nextErrors: Record<string, string> = {};
    let firstError: string | null = null;
    for (const group of groups) {
      for (const field of group.fields) {
        if (!field.required) continue;
        const v = values[field.key];
        if (v == null || (typeof v === "string" && v.trim() === "")) {
          nextErrors[field.key] = `${field.label} is required.`;
          if (!firstError) firstError = field.key;
        }
      }
    }
    setErrors(nextErrors);
    if (firstError) {
      document.getElementById(`field-${firstError}`)?.focus();
      notify({ type: "warning", title: "Check the form", message: "Some fields need attention." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }
      notify({ type: "success", title: "Changes saved", message: "Your updates are live." });
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

  const fields = (
    <>
      {groups.map((group) => (
        <GlassPanel key={group.title} title={group.title} description={group.description}>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.fields.map((field) => (
              <FormField
                key={field.key}
                field={field}
                value={values[field.key]}
                onChange={setValue}
                error={errors[field.key]}
              />
            ))}
          </div>
        </GlassPanel>
      ))}
    </>
  );

  if (inline) {
    return (
      <div className="space-y-4">
        {fields}
        <div className="flex items-center justify-end gap-2">
          <AdminButton
            variant="ghost"
            icon={RotateCcw}
            type="button"
            disabled={!dirty}
            onClick={() => setValues(initial)}
          >
            Reset
          </AdminButton>
          <AdminButton icon={Save} loading={saving} onClick={save} type="button" disabled={!dirty}>
            Save Heading
          </AdminButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {fields}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-universe-deep/85 px-6 py-4 backdrop-blur-xl lg:pl-72">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <p className="text-sm text-[var(--text-muted)]">
            {dirty ? "You have unsaved changes." : "All changes saved."}
          </p>
          <div className="flex gap-2">
            <Link href={previewHref} target="_blank">
              <AdminButton variant="secondary" icon={ExternalLink} type="button">
                Preview
              </AdminButton>
            </Link>
            <AdminButton
              variant="ghost"
              icon={RotateCcw}
              type="button"
              disabled={!dirty}
              onClick={() => setValues(initial)}
            >
              Reset
            </AdminButton>
            <AdminButton icon={Save} loading={saving} onClick={save} type="button" disabled={!dirty}>
              Save Changes
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}
