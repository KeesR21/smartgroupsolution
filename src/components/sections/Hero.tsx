"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Headphones, Search } from "lucide-react";
import { useRef } from "react";
import { UniverseBackground } from "@/components/background/UniverseBackground";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { cn, smoothScrollTo } from "@/lib/utils";
import { HeroTitle } from "@/components/sections/HeroTitle";
import type { SiteContentRecord } from "@/types/cms";

interface HeroProps {
  content: SiteContentRecord;
}

export function Hero({ content }: HeroProps) {
  const { theme, mounted } = useTheme();
  const isLight = mounted && theme === "light";
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const stats = [
    {
      value: content.stat1Value,
      prefix: content.stat1Prefix,
      suffix: content.stat1Suffix,
      label: content.stat1Label,
    },
    {
      value: content.stat2Value,
      prefix: content.stat2Prefix,
      suffix: content.stat2Suffix,
      label: content.stat2Label,
    },
    {
      value: content.stat3Value,
      prefix: content.stat3Prefix,
      suffix: content.stat3Suffix,
      label: content.stat3Label,
    },
  ];

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden pt-28"
    >
      <motion.div className="absolute inset-0" style={{ opacity: bgOpacity }}>
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-b transition-colors duration-500",
            isLight
              ? "from-white via-slate-50 to-slate-100"
              : "from-universe-deep via-universe-navy/90 to-universe-deep"
          )}
        />
        <UniverseBackground opacity={1} particleCount={180} />
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            isLight
              ? "bg-[radial-gradient(ellipse_at_70%_50%,rgba(59,130,246,0.12),transparent_55%)]"
              : "bg-[radial-gradient(ellipse_at_70%_50%,rgba(34,211,238,0.08),transparent_50%)]"
          )}
          aria-hidden
        />
        {!isLight && (
          <div
            className="pointer-events-none absolute right-0 top-1/4 hidden h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-neon-cyan/5 blur-3xl lg:block"
            aria-hidden
          />
        )}
      </motion.div>

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl flex-col items-center justify-center px-4 pb-24 pt-8 text-center sm:px-6 lg:px-8"
      >
        <h1 className="max-w-full overflow-visible font-display text-4xl font-bold leading-[1.15] text-nowrap sm:text-5xl lg:text-6xl xl:text-7xl">
          <HeroTitle title={content.heroTitle} isLight={isLight} />
        </h1>

        {content.heroSubtitle.trim() ? (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "mt-4 text-lg font-medium sm:text-xl",
              isLight ? "text-blue-800" : "text-neon-purple/90"
            )}
          >
            {content.heroSubtitle}
          </motion.p>
        ) : null}

        {content.heroTagline ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-2 text-sm text-[var(--text-muted)]"
          >
            {content.heroTagline}
          </motion.p>
        ) : null}

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg"
        >
          {content.heroDescription}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button variant="primary" icon={Headphones} onClick={() => smoothScrollTo("#contact")}>
            Request Assessment
          </Button>
          <Button variant="secondary" icon={Search} onClick={() => smoothScrollTo("#services")}>
            View Solutions
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                className={cn(
                  "block text-4xl font-bold sm:text-5xl",
                  isLight ? "text-blue-600" : "text-neon-cyan"
                )}
              />
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div
        className={cn(
          "pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t to-transparent",
          isLight ? "from-slate-100" : "from-universe-deep"
        )}
        aria-hidden
      />
    </section>
  );
}
