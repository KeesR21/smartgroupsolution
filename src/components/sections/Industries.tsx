"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { getLucideIcon } from "@/lib/icons";
import type { IndustryRecord, SiteContentRecord } from "@/types/cms";

interface IndustriesProps {
  industries: IndustryRecord[];
  content: SiteContentRecord;
}

export function Industries({ industries, content }: IndustriesProps) {
  return (
    <SectionWrapper id="industries" className="relative bg-[var(--bg-primary)]">
      <SectionHeader
        label={content.industriesLabel}
        title={content.industriesTitle}
        subtitle={content.industriesSubtitle}
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry, i) => {
          const Icon = getLucideIcon(industry.icon);
          return (
            <motion.article
              key={industry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass group rounded-2xl p-6 lg:col-span-1"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="inline-flex rounded-xl bg-neon-purple/15 p-3 text-neon-purple">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold">{industry.name}</h3>
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                {industry.description}
              </p>
            </motion.article>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
