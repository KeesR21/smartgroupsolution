"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  const isLight = mounted && theme === "light";

  if (!mounted) {
    return (
      <div
        className="h-9 w-9 rounded-full border border-[var(--glass-border)]"
        aria-hidden
      />
    );
  }

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-colors",
        isLight
          ? "border-slate-300 bg-white/90 text-blue-700 hover:border-blue-500 hover:bg-blue-50"
          : "border-white/10 bg-white/[0.04] text-[var(--text-primary)] hover:border-neon-cyan/30 hover:bg-white/[0.08]"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-neon-cyan" />
      ) : (
        <Moon className="h-4 w-4 text-blue-700" />
      )}
    </motion.button>
  );
}
