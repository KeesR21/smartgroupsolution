export type UniverseTheme = "light" | "dark";

export interface UniversePalette {
  canvasFill: string | null;
  lineStart: [number, number, number];
  lineMid: [number, number, number];
  lineEnd: [number, number, number];
  node: [number, number, number];
  nodeGlow: [number, number, number];
  farAlpha: number;
  nearAlpha: number;
  nodeAlpha: number;
  nodeGlowAlpha: number;
}

export const UNIVERSE_PALETTES: Record<UniverseTheme, UniversePalette> = {
  dark: {
    canvasFill: null,
    lineStart: [34, 211, 238],
    lineMid: [59, 130, 246],
    lineEnd: [168, 85, 247],
    node: [59, 130, 246],
    nodeGlow: [34, 211, 238],
    farAlpha: 0.18,
    nearAlpha: 0.52,
    nodeAlpha: 0.45,
    nodeGlowAlpha: 0.12,
  },
  light: {
    canvasFill: "#f8fafc",
    lineStart: [37, 99, 235],
    lineMid: [59, 130, 246],
    lineEnd: [96, 165, 250],
    node: [37, 99, 235],
    nodeGlow: [59, 130, 246],
    farAlpha: 0.2,
    nearAlpha: 0.48,
    nodeAlpha: 0.55,
    nodeGlowAlpha: 0.18,
  },
};

export function rgba([r, g, b]: [number, number, number], alpha: number) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getUniverseThemeFromDocument(): UniverseTheme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}
