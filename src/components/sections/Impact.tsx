"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Lightbulb } from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import type {
  MarketStatRecord,
  RiskItemRecord,
  SiteContentRecord,
  SuccessStoryRecord,
} from "@/types/cms";

interface ImpactProps {
  content: SiteContentRecord;
  marketStats: MarketStatRecord[];
  riskItems: RiskItemRecord[];
  successStories?: SuccessStoryRecord[];
}

export function Impact({ content, marketStats, riskItems, successStories = [] }: ImpactProps) {
  return (
    <SectionWrapper
      id="impact"
      className="relative bg-gradient-to-b from-[var(--bg-primary)] via-universe-navy/20 to-[var(--bg-primary)]"
    >
      <SectionHeader
        label={content.impactLabel}
        title={content.impactTitle}
        subtitle={content.impactSubtitle}
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {marketStats.map((stat, i) => (
          <motion.article
            key={stat.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-6 text-center"
          >
            <p className="text-3xl font-bold text-neon-cyan sm:text-4xl">{stat.value}</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
              {stat.label}
            </p>
            {stat.source ? (
              <p className="mt-2 text-xs text-[var(--text-muted)]/80">Source: {stat.source}</p>
            ) : null}
          </motion.article>
        ))}
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl p-8"
        >
          <div className="mb-4 inline-flex rounded-xl bg-neon-cyan/15 p-3 text-neon-cyan">
            <Lightbulb className="h-6 w-6" aria-hidden />
          </div>
          <h3 className="text-xl font-semibold">{content.opportunityTitle}</h3>
          <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
            {content.opportunityBody}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl border border-amber-500/20 p-8"
        >
          <div className="mb-4 inline-flex rounded-xl bg-amber-500/15 p-3 text-amber-400">
            <AlertTriangle className="h-6 w-6" aria-hidden />
          </div>
          <h3 className="text-xl font-semibold">The risk</h3>
          <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
            {content.opportunityRisk}
          </p>
        </motion.div>
      </div>

      <motion.blockquote
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 border-l-4 border-neon-cyan pl-6 text-lg font-medium italic text-[var(--text-primary)]"
      >
        {content.leadershipMessage}
      </motion.blockquote>

      <div className="mt-20">
        <SectionHeader
          label={content.risksLabel}
          title={content.risksTitle}
          subtitle={content.risksSubtitle}
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {riskItems.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <h4 className="font-semibold">{item.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                {item.description}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>

      {successStories.length > 0 && (
        <div className="mt-20">
          <SectionHeader
            label={content.storiesLabel}
            title={content.storiesTitle}
            subtitle={content.storiesSubtitle}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {successStories.map((story, i) => (
              <motion.article
                key={story.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass overflow-hidden rounded-2xl"
              >
                {story.image ? (
                  <div className="relative h-40 w-full">
                    <Image src={story.image} alt={story.title} fill className="object-cover" unoptimized />
                  </div>
                ) : null}
                <div className="p-6">
                  {story.metric ? (
                    <p className="text-2xl font-bold text-neon-cyan">{story.metric}</p>
                  ) : null}
                  <h4 className="mt-2 font-semibold">{story.title}</h4>
                  {story.client ? (
                    <p className="mt-1 text-xs uppercase tracking-wide text-[var(--text-muted)]/80">
                      {story.client}
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                    {story.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
