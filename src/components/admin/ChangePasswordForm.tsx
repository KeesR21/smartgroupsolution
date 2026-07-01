"use client";

import { useMemo, useState } from "react";
import { Check, Eye, EyeOff, KeyRound, X } from "lucide-react";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { AdminButton } from "@/components/admin/ui/Button";
import { Field, inputClass, inputErrorClass } from "@/components/admin/ui/Primitives";
import { passwordStrength } from "@/lib/validation";
import { cn } from "@/lib/utils";

type FieldKey = "currentPassword" | "newPassword" | "confirmPassword";

const STRENGTH_COLORS = [
  "bg-red-500",
  "bg-red-500",
  "bg-amber-500",
  "bg-yellow-400",
  "bg-emerald-500",
  "bg-emerald-400",
];

function PasswordInput({
  id,
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClass, "pr-11", error && inputErrorClass)}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors hover:text-white"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

const RULES: { label: string; test: (p: string) => boolean }[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Upper & lowercase letters", test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { label: "At least one number", test: (p) => /\d/.test(p) },
  { label: "At least one symbol", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function ChangePasswordForm() {
  const { notify } = useNotifications();
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [saving, setSaving] = useState(false);

  const strength = useMemo(() => passwordStrength(values.newPassword), [values.newPassword]);

  const setField = (key: FieldKey, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const validate = (): FieldKey | null => {
    const next: Partial<Record<FieldKey, string>> = {};
    let first: FieldKey | null = null;
    const fail = (key: FieldKey, msg: string) => {
      next[key] = msg;
      if (!first) first = key;
    };

    if (!values.currentPassword) fail("currentPassword", "Enter your current password.");
    if (!values.newPassword) fail("newPassword", "Enter a new password.");
    else if (values.newPassword.length < 8)
      fail("newPassword", "Must be at least 8 characters.");
    else if (!strength.valid) fail("newPassword", "Password is too weak.");
    else if (values.newPassword === values.currentPassword)
      fail("newPassword", "New password must be different.");
    if (values.newPassword !== values.confirmPassword)
      fail("confirmPassword", "Passwords do not match.");

    setErrors(next);
    return first;
  };

  const submit = async () => {
    const firstError = validate();
    if (firstError) {
      document.getElementById(firstError)?.focus();
      notify({ type: "warning", title: "Check the form", message: "Some fields need attention." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.field) {
          setErrors({ [data.field as FieldKey]: data.error });
          document.getElementById(data.field)?.focus();
        }
        throw new Error(data.error || "Failed to change password");
      }
      notify({
        type: "success",
        title: "Password changed",
        message: "Use your new password next time you sign in.",
      });
      setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setErrors({});
    } catch (e) {
      notify({
        type: "error",
        title: "Could not change password",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="space-y-5"
      noValidate
    >
      <Field label="Current password" htmlFor="currentPassword" required error={errors.currentPassword}>
        <PasswordInput
          id="currentPassword"
          value={values.currentPassword}
          onChange={(v) => setField("currentPassword", v)}
          error={errors.currentPassword}
          autoComplete="current-password"
        />
      </Field>

      <Field label="New password" htmlFor="newPassword" required error={errors.newPassword}>
        <PasswordInput
          id="newPassword"
          value={values.newPassword}
          onChange={(v) => setField("newPassword", v)}
          error={errors.newPassword}
          autoComplete="new-password"
        />
        {values.newPassword && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-1.5 flex-1 gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-full flex-1 rounded-full transition-colors",
                      i < strength.score ? STRENGTH_COLORS[strength.score] : "bg-white/10"
                    )}
                  />
                ))}
              </div>
              <span className="w-20 text-right text-xs text-[var(--text-muted)]">
                {strength.label}
              </span>
            </div>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {RULES.map((rule) => {
                const ok = rule.test(values.newPassword);
                return (
                  <li
                    key={rule.label}
                    className={cn(
                      "flex items-center gap-1.5 text-xs",
                      ok ? "text-emerald-400" : "text-[var(--text-muted)]"
                    )}
                  >
                    {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Field>

      <Field
        label="Confirm new password"
        htmlFor="confirmPassword"
        required
        error={errors.confirmPassword}
      >
        <PasswordInput
          id="confirmPassword"
          value={values.confirmPassword}
          onChange={(v) => setField("confirmPassword", v)}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
      </Field>

      <div className="flex justify-end">
        <AdminButton type="submit" icon={KeyRound} loading={saving}>
          Update Password
        </AdminButton>
      </div>
    </form>
  );
}
