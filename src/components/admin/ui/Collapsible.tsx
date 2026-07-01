"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Collapsible({
  title,
  description,
  defaultOpen = false,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-strong overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left"
        aria-expanded={open}
      >
        <span>
          <span className="block text-base font-semibold">{title}</span>
          {description && (
            <span className="mt-0.5 block text-sm text-[var(--text-muted)]">{description}</span>
          )}
        </span>
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 text-[var(--text-muted)] transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="border-t border-white/10 p-6">{children}</div>}
    </div>
  );
}
