"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { VIEW_IN } from "@/lib/motion";

interface SectionWrapperProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export function SectionWrapper({ id, children, className = "" }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={VIEW_IN}
      className={`section-padding ${className}`}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </motion.section>
  );
}
