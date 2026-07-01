"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({
  label,
  title,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="accent-label text-sm font-semibold uppercase tracking-widest text-neon-cyan"
      >
        {label}
      </motion.span>
      <h2 className="section-title mt-3">{title}</h2>
      {subtitle ? (
        <p className="section-subtitle mx-auto">{subtitle}</p>
      ) : null}
    </div>
  );
}
