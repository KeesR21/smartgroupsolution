"use client";

import { motion } from "framer-motion";
import { Eye, Target } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import type { SiteContentRecord } from "@/types/cms";

export function Mission({ content }: { content: SiteContentRecord }) {
  return (
    <SectionWrapper id="mission" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]"
        aria-hidden
      />

      <div className="relative text-center">
        <span className="accent-label text-sm font-semibold uppercase tracking-widest text-neon-purple">
          {content.missionLabel}
        </span>
        <h2 className="section-title mt-3">{content.missionTitle}</h2>
      </div>

      <div className="relative mt-14 grid gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10"
        >
          <div className="mb-6 inline-flex rounded-2xl bg-neon-cyan/15 p-4 text-neon-cyan">
            <Target className="h-8 w-8" aria-hidden />
          </div>
          <h3 className="text-2xl font-bold">Our Mission</h3>
          <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
            {content.missionText}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10"
        >
          <div className="mb-6 inline-flex rounded-2xl bg-neon-purple/15 p-4 text-neon-purple">
            <Eye className="h-8 w-8" aria-hidden />
          </div>
          <h3 className="text-2xl font-bold">Our Vision</h3>
          <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
            {content.visionText}
          </p>
        </motion.div>
      </div>

      <motion.blockquote
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mt-12 border-l-4 border-neon-cyan pl-6 text-xl font-medium italic text-[var(--text-muted)] sm:text-2xl"
      >
        &ldquo;{content.quote}&rdquo;
        <footer className="accent-label mt-4 text-sm font-semibold not-italic text-neon-cyan">
          {content.quoteAuthor}
        </footer>
      </motion.blockquote>
    </SectionWrapper>
  );
}
