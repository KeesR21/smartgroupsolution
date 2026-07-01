"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PAGE_EXIT } from "@/lib/motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 22 + 8;
      });
    }, 70);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 220);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-universe-deep"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={PAGE_EXIT}
          role="status"
          aria-label="Loading Smart Group Solution"
        >
          <BrandLogo size={148} animated forceDark className="mb-8" />

          <p className="gradient-text max-w-md px-4 text-center font-display text-sm font-semibold tracking-wide sm:text-base">
            Modernize. Protect. Scale.
          </p>

          <div className="mt-8 h-1 w-56 overflow-hidden rounded-full bg-white/10 sm:w-64">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple"
              style={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            />
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            {Math.min(Math.floor(progress), 100)}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
