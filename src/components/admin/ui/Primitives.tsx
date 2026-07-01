"use client";

import { Search } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)]/60 focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/30";

export const inputErrorClass = "border-red-500/60 focus:border-red-400/70 focus:ring-red-400/30";

export function RequiredMark() {
  return (
    <span className="text-red-400" aria-hidden>
      {" "}
      *
    </span>
  );
}

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  help?: string;
  error?: string;
  counter?: { value: number; max: number };
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  required,
  help,
  error,
  counter,
  className,
  children,
}: FieldProps) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="block text-sm font-medium">
          {label}
          {required && <RequiredMark />}
        </label>
        {counter && (
          <span
            className={cn(
              "text-xs tabular-nums",
              counter.value > counter.max
                ? "text-red-400"
                : "text-[var(--text-muted)]/70"
            )}
          >
            {counter.value}/{counter.max}
          </span>
        )}
      </div>
      {children}
      {help && !error && <p className="mt-1 text-xs text-[var(--text-muted)]">{help}</p>}
      {error && (
        <p className="mt-1 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  id?: string;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200",
        checked ? "bg-neon-cyan/80" : "bg-white/15"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(inputClass, "pl-10")}
      />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-white/[0.06]",
        className
      )}
    />
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="glass flex items-center gap-3 rounded-xl p-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center"
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neon-blue/10 text-neon-cyan">
          {icon}
        </div>
      )}
      <p className="text-base font-semibold">{title}</p>
      {message && (
        <p className="mt-1 max-w-sm text-sm text-[var(--text-muted)]">{message}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
