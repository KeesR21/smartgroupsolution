"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import {
  getUniverseThemeFromDocument,
  rgba,
  UNIVERSE_PALETTES,
  type UniversePalette,
  type UniverseTheme,
} from "@/lib/universe-theme";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface UniverseBackgroundProps {
  opacity?: number;
  particleCount?: number;
  className?: string;
  /** Admin panel: always dark universe */
  forceDark?: boolean;
}

const CONNECTION_DISTANCE = 175;
const CONNECTION_DISTANCE_FAR = 240;
const MOUSE_INFLUENCE = 200;

export function UniverseBackground({
  opacity = 1,
  particleCount,
  className = "",
  forceDark = false,
}: UniverseBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef(0);
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number>(0);
  const paletteRef = useRef<UniversePalette>(UNIVERSE_PALETTES.dark);
  const { theme, mounted } = useTheme();

  const resolvedTheme: UniverseTheme = forceDark
    ? "dark"
    : mounted
      ? theme
      : getUniverseThemeFromDocument();

  paletteRef.current = UNIVERSE_PALETTES[resolvedTheme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const getParticleCount = (w: number) => {
      if (particleCount) return particleCount;
      if (w < 640) return 100;
      if (w < 1024) return 140;
      return 170;
    };

    const initNodes = (w: number, h: number) => {
      const count = getParticleCount(w);
      nodesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.6 + 0.6,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes(rect.width, rect.height);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    const syncPalette = () => {
      if (forceDark) {
        paletteRef.current = UNIVERSE_PALETTES.dark;
        return;
      }
      paletteRef.current = UNIVERSE_PALETTES[getUniverseThemeFromDocument()];
    };

    const drawConnections = (
      nodes: Node[],
      mouse: { x: number; y: number },
      maxDist: number,
      baseAlpha: number,
      lineWidth: number,
      palette: UniversePalette
    ) => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * baseAlpha;
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            const mouseDist = Math.hypot(mouse.x - midX, mouse.y - midY);
            const glow =
              mouseDist < MOUSE_INFLUENCE
                ? 1 + (1 - mouseDist / MOUSE_INFLUENCE) * 0.9
                : 1;

            const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            gradient.addColorStop(0, rgba(palette.lineStart, alpha * glow));
            gradient.addColorStop(0.5, rgba(palette.lineMid, alpha * glow * 0.95));
            gradient.addColorStop(1, rgba(palette.lineEnd, alpha * glow * 0.85));

            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = glow > 1.2 ? lineWidth + 0.4 : lineWidth;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = forceDark
      ? null
      : new MutationObserver(syncPalette);
    if (observer) {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    const draw = () => {
      syncPalette();
      const palette = paletteRef.current;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const parallaxY = scrollRef.current * 0.08;

      if (palette.canvasFill) {
        ctx.fillStyle = palette.canvasFill;
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      if (!prefersReducedMotion) {
        for (const node of nodes) {
          node.x += node.vx;
          node.y += node.vy + parallaxY * 0.0002;

          if (node.x < 0 || node.x > w) node.vx *= -1;
          if (node.y < 0 || node.y > h) node.vy *= -1;

          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_INFLUENCE && dist > 0) {
            const force = (MOUSE_INFLUENCE - dist) / MOUSE_INFLUENCE;
            node.x -= (dx / dist) * force * 0.55;
            node.y -= (dy / dist) * force * 0.55;
          }
        }
      }

      drawConnections(nodes, mouse, CONNECTION_DISTANCE_FAR, palette.farAlpha, 0.4, palette);
      drawConnections(nodes, mouse, CONNECTION_DISTANCE, palette.nearAlpha, 0.65, palette);

      for (const node of nodes) {
        const mouseDist = Math.hypot(mouse.x - node.x, mouse.y - node.y);
        const glow =
          mouseDist < MOUSE_INFLUENCE
            ? 1 + (1 - mouseDist / MOUSE_INFLUENCE)
            : 0.55;

        ctx.beginPath();
        ctx.fillStyle = rgba(palette.node, palette.nodeAlpha * glow);
        ctx.arc(node.x, node.y, node.radius * (glow > 1 ? 1.35 : 1), 0, Math.PI * 2);
        ctx.fill();

        if (glow > 1.15) {
          ctx.beginPath();
          ctx.fillStyle = rgba(palette.nodeGlow, palette.nodeGlowAlpha * glow);
          ctx.arc(node.x, node.y, node.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [particleCount, forceDark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500 ${className}`}
      style={{ opacity }}
    />
  );
}
