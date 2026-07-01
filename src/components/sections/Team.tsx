"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import type { SiteContentRecord, TeamMemberRecord } from "@/types/cms";

interface TeamProps {
  team: TeamMemberRecord[];
  content: SiteContentRecord;
}

export function Team({ team, content }: TeamProps) {
  return (
    <SectionWrapper id="team" className="bg-[var(--bg-primary)]">
      <div className="text-center">
        <span className="accent-label text-sm font-semibold uppercase tracking-widest text-neon-cyan">
          {content.teamLabel}
        </span>
        <h2 className="section-title mt-3">{content.teamTitle}</h2>
        <p className="section-subtitle mx-auto">{content.teamSubtitle}</p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member, i) => (
          <motion.article
            key={member.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -8 }}
            className="group glass overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized={member.image.startsWith("/uploads")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-90" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-neon-cyan">{member.role}</p>
              <div className="mt-4 flex gap-3">
                {member.linkedin && (
                  <a href={member.linkedin} className="social-link rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-white/10 hover:text-neon-cyan" aria-label={`${member.name} on LinkedIn`}>
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {member.twitter && (
                  <a href={member.twitter} className="social-link rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-white/10 hover:text-neon-cyan" aria-label={`${member.name} on Twitter`}>
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {member.github && (
                  <a href={member.github} className="social-link rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-white/10 hover:text-neon-cyan" aria-label={`${member.name} on GitHub`}>
                    <Github className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
}
