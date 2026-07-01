"use client";

import { motion } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed left-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple"
      style={{ scaleX: progress, width: "100%" }}
      aria-hidden
    />
  );
}
