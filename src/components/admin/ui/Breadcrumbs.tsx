"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-1">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-[var(--text-muted)]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {item.href && !last ? (
                <Link href={item.href} className="transition-colors hover:text-neon-cyan">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "text-[var(--text-primary)]" : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="h-3 w-3 opacity-60" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
