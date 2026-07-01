"use client";

import { Loader2, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:brightness-110",
  secondary: "border border-white/10 text-[var(--text-primary)] hover:bg-white/5",
  ghost: "text-[var(--text-muted)] hover:bg-white/5 hover:text-white",
  danger: "bg-red-500/90 text-white hover:brightness-110",
};

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  icon?: LucideIcon;
}

export function AdminButton({
  variant = "primary",
  loading = false,
  icon: Icon,
  children,
  className,
  disabled,
  ...props
}: AdminButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        Icon && <Icon className="h-4 w-4" />
      )}
      {children}
    </button>
  );
}
