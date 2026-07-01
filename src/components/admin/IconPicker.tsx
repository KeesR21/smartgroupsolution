"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { LUCIDE_ICON_NAMES, getLucideIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [query, setQuery] = useState("");
  const SelectedIcon = getLucideIcon(value);

  const filtered = useMemo(
    () =>
      LUCIDE_ICON_NAMES.filter((name) =>
        name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon-blue/15 text-neon-cyan">
          <SelectedIcon className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium text-white">{value}</span>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="search"
          placeholder="Search icons..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-neon-cyan/40"
        />
      </div>
      <div className="grid max-h-48 grid-cols-6 gap-2 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-2 sm:grid-cols-8">
        {filtered.map((name) => {
          const Icon = getLucideIcon(name);
          const selected = name === value;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              title={name}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                selected
                  ? "bg-neon-cyan/20 text-neon-cyan ring-1 ring-neon-cyan/50"
                  : "text-[var(--text-muted)] hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
