"use client";

import { getLucideIcon } from "@/lib/icons";

interface ServiceCardPreviewProps {
  title: string;
  description: string;
  icon: string;
}

export function ServiceCardPreview({ title, description, icon }: ServiceCardPreviewProps) {
  const Icon = getLucideIcon(icon);

  return (
    <div className="glass neon-glow-hover rounded-2xl p-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neon-cyan">
        Live Preview
      </p>
      <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 p-3 text-neon-cyan">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="text-base font-semibold">
        {title || "Service Title"}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
        {description || "Service description will appear here."}
      </p>
    </div>
  );
}
