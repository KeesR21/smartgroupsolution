"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { getLucideIcon } from "@/lib/icons";
import type { PillarRecord, SiteContentRecord } from "@/types/cms";

interface PillarsProps {
  pillars: PillarRecord[];
  content: SiteContentRecord;
}

export function Pillars({ pillars, content }: PillarsProps) {
  return (
    <SectionWrapper id="pillars" className="relative bg-[var(--bg-primary)]">
      <SectionHeader
        label={content.pillarsLabel}
        title={content.pillarsTitle}
        subtitle={content.pillarsSubtitle}
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {pillars.map((pillar, i) => {
          const Icon = getLucideIcon(pillar.icon);
          return (
            <motion.article
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="glass group flex flex-col rounded-2xl p-6"
            >
              <div className="mb-4 inline-flex rounded-xl bg-neon-blue/15 p-3 text-neon-cyan transition-colors group-hover:bg-neon-cyan/20">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="text-base font-semibold">{pillar.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                {pillar.description}
              </p>
            </motion.article>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
