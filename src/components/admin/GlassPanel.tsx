import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function GlassPanel({ children, className, title, description }: GlassPanelProps) {
  return (
    <div className={cn("glass-strong rounded-2xl p-6", className)}>
      {(title || description) && (
        <div className="mb-5 border-b border-white/10 pb-4">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {description && (
            <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
