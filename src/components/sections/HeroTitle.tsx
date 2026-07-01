import { cn } from "@/lib/utils";

/** Splits titles like "Modernize. Protect. Scale." into word segments */
export function parseHeroTitleSegments(title: string): string[] | null {
  const trimmed = title.trim();
  if (!trimmed.includes(".")) return null;

  const parts = trimmed
    .split(/\.\s*/)
    .map((p) => p.replace(/\.+$/, "").trim())
    .filter(Boolean);

  if (parts.length < 2) return null;

  return parts.map((word) => `${word}.`);
}

interface HeroTitleProps {
  title: string;
  isLight: boolean;
}

export function HeroTitle({ title, isLight }: HeroTitleProps) {
  const segments = parseHeroTitleSegments(title);

  if (!segments) {
    const splitAt = title.toLowerCase().indexOf("digital");
    const line1 = splitAt > 0 ? title.slice(0, splitAt).trim() : title;
    const line2 = splitAt > 0 ? title.slice(splitAt).trim() : null;

    return (
      <>
        <span className={cn("block", isLight ? "text-slate-900" : "text-white")}>
          {line1}
        </span>
        {line2 ? (
          <span
            className={cn(
              "gradient-text mt-1 block",
              isLight
                ? "drop-shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                : "drop-shadow-[0_0_30px_rgba(34,211,238,0.35)]"
            )}
          >
            {line2}
          </span>
        ) : null}
      </>
    );
  }

  return (
    <span
      className={cn(
        "hero-title-triplet font-display inline-block whitespace-nowrap gradient-text",
        isLight
          ? "drop-shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          : "drop-shadow-[0_0_30px_rgba(34,211,238,0.35)]"
      )}
      aria-label={segments.join(" ")}
    >
      {segments.join(" ")}
    </span>
  );
}
