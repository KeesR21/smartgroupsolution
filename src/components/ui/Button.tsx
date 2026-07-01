"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost";
  icon?: LucideIcon;
  href?: string;
}

export function Button({
  children,
  variant = "primary",
  icon: Icon,
  className,
  href,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan";

  const variants = {
    primary:
      "bg-gradient-to-r from-neon-blue to-neon-purple text-white neon-glow-hover hover:brightness-110",
    secondary:
      "btn-secondary-theme glass border border-white/20 text-white hover:border-neon-cyan/50 hover:bg-white/5 neon-glow-hover",
    ghost: "btn-ghost-theme text-[var(--text-muted)] hover:text-[var(--text-primary)]",
  };

  const content = (
    <>
      {Icon && <Icon className="h-4 w-4" aria-hidden />}
      {children}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={cn(base, variants[variant], className)}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {content}
    </motion.button>
  );
}
