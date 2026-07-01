"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { inputClass } from "./Primitives";

export function TagsInput({
  value,
  onChange,
  placeholder = "Type and press Enter...",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const commit = (raw: string) => {
    const parts = raw
      .split(/[,\n]/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...value];
    for (const p of parts) if (!next.includes(p)) next.push(p);
    onChange(next);
    setDraft("");
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div>
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {value.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="inline-flex items-center gap-1 rounded-lg bg-neon-blue/15 px-2.5 py-1 text-xs font-medium text-neon-cyan"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="rounded transition-colors hover:text-white"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => commit(draft)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}
