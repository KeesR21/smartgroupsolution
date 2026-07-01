"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import type { SiteContentRecord } from "@/types/cms";

const HIGHLIGHT_ICONS = [TrendingUp, ShieldCheck, Activity, Zap];

export function About({ content }: { content: SiteContentRecord }) {
  const highlights = [
    { title: content.aboutHighlight1Title, description: content.aboutHighlight1Desc },
    { title: content.aboutHighlight2Title, description: content.aboutHighlight2Desc },
    { title: content.aboutHighlight3Title, description: content.aboutHighlight3Desc },
    { title: content.aboutHighlight4Title, description: content.aboutHighlight4Desc },
  ];

  return (
    <SectionWrapper id="about" className="relative bg-[var(--bg-primary)]">
      <SectionHeader
        label={content.aboutLabel}
        title={content.aboutTitle}
        subtitle={content.aboutSubtitle}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-12 glass-strong rounded-3xl p-8 sm:p-12"
      >
        <p className="text-center text-lg leading-relaxed text-[var(--text-muted)]">
          {content.aboutBody}
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item, i) => {
          const Icon = HIGHLIGHT_ICONS[i];
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass group rounded-2xl p-6 transition-shadow hover:shadow-lg hover:shadow-neon-cyan/10"
            >
              <div className="mb-4 inline-flex rounded-xl bg-neon-blue/15 p-3 text-neon-cyan transition-colors group-hover:bg-neon-cyan/20">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                {item.description}
              </p>
            </motion.article>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
