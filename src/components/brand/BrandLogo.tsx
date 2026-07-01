"use client";

import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  /** Outer diameter in pixels */
  size?: number;
  /** Show animated ring accents (loading screen) */
  animated?: boolean;
  /** Keep dark-style logo (loading screen, admin) */
  forceDark?: boolean;
  className?: string;
}

/**
 * Smart Group Solution mark — dual rings + label (matches loading screen).
 */
export function BrandLogo({
  size = 112,
  animated = false,
  forceDark = false,
  className,
}: BrandLogoProps) {
  const { theme, mounted } = useTheme();
  const isLight = mounted && !forceDark && theme === "light";

  const inner = Math.round(size * 0.88);
  const ringInset = Math.round(size * 0.06);
  const fillInset = ringInset + Math.max(2, Math.round(size * 0.02));
  const compact = size < 60;
  const svgSize = Math.round(inner * (compact ? 0.62 : 0.78));
  const gradId = `brandGrad-${size}-${isLight ? "light" : "dark"}`;

  const textFill = isLight ? "#0F172A" : "#F8FAFC";
  const gradStops = isLight
    ? ["#1D4ED8", "#2563EB", "#4F46E5"]
    : ["#22D3EE", "#3B82F6", "#A855F7"];

  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className={cn(
          "absolute inset-0 rounded-full border-2",
          isLight ? "border-blue-500/45" : "border-neon-cyan/35",
          animated && "animate-brand-ring-slow"
        )}
      />
      <div
        className={cn(
          "absolute rounded-full",
          isLight
            ? "bg-white shadow-[0_2px_12px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/90"
            : "bg-universe-deep/95"
        )}
        style={{ inset: fillInset }}
      />
      <div
        className={cn(
          "absolute rounded-full border-2",
          isLight
            ? "border-t-blue-600 border-r-transparent border-b-indigo-600 border-l-transparent"
            : "border-t-neon-blue border-r-transparent border-b-neon-purple border-l-transparent",
          animated && "animate-brand-ring-reverse"
        )}
        style={{ inset: ringInset }}
      />
      <svg
        viewBox={compact ? "0 0 48 48" : "0 0 100 36"}
        className="relative z-10"
        style={{ width: svgSize, height: svgSize }}
        role="img"
        aria-label="Smart Group Solution"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradStops[0]} />
            <stop offset="50%" stopColor={gradStops[1]} />
            <stop offset="100%" stopColor={gradStops[2]} />
          </linearGradient>
        </defs>
        {compact ? (
          <text
            x="24"
            y="30"
            textAnchor="middle"
            fontSize="20"
            fontWeight="700"
            fontFamily="var(--font-display), system-ui, sans-serif"
            fill={textFill}
          >
            S<tspan fill={`url(#${gradId})`}>G</tspan>
          </text>
        ) : (
          <text
            x="50"
            y="26"
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            fontFamily="var(--font-display), system-ui, sans-serif"
            fill={textFill}
            letterSpacing="-0.5"
          >
            Smart<tspan fill={`url(#${gradId})`}> G</tspan>
          </text>
        )}
      </svg>
    </div>
  );
}

/** Wordmark for navbar / footer */
export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display inline-flex items-baseline font-semibold tracking-tight", className)}>
      <span className="text-[var(--text-primary)]">Smart&nbsp;</span>
      <span className="gradient-text">Group</span>
      <span className="text-[var(--text-muted)]">&nbsp;Solution</span>
    </span>
  );
}
