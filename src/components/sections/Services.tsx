"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { getLucideIcon } from "@/lib/icons";
import type { ServiceRecord, SiteContentRecord } from "@/types/cms";

interface ServicesProps {
  services: ServiceRecord[];
  content: SiteContentRecord;
}

export function Services({ services, content }: ServicesProps) {
  return (
    <SectionWrapper
      id="services"
      className="relative bg-gradient-to-b from-[var(--bg-primary)] via-universe-navy/30 to-[var(--bg-primary)]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-neon-purple/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-neon-cyan/5 blur-3xl" />
      </div>

      <div className="relative">
        <SectionHeader
          label={content.servicesLabel}
          title={content.servicesTitle}
          subtitle={content.servicesSubtitle}
        />

        <div className="relative mt-14 grid gap-6 lg:grid-cols-2">
          {services.map((service, i) => {
            const Icon = getLucideIcon(service.icon);
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="glass group rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex shrink-0 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 p-3 text-neon-cyan">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                      {service.description}
                    </p>
                  </div>
                </div>

                {service.deliverable ? (
                  <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neon-cyan">
                      What we deliver
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                      {service.deliverable}
                    </p>
                  </div>
                ) : null}

                {service.businessResult ? (
                  <div className="mt-3 rounded-xl border border-neon-purple/20 bg-neon-purple/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neon-purple">
                      Business result
                    </p>
                    <p className="mt-2 text-sm font-medium leading-relaxed">
                      {service.businessResult}
                    </p>
                  </div>
                ) : null}
              </motion.article>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
