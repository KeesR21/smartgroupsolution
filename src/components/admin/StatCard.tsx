"use client";

import { motion } from "framer-motion";
import { getLucideIcon } from "@/lib/icons";

interface StatCardProps {
  label: string;
  value: number;
  iconName: string;
  accent?: "cyan" | "blue" | "purple";
}

const accents = {
  cyan: "from-neon-cyan/20 to-neon-cyan/5 text-neon-cyan",
  blue: "from-neon-blue/20 to-neon-blue/5 text-neon-blue",
  purple: "from-neon-purple/20 to-neon-purple/5 text-neon-purple",
};

export function StatCard({ label, value, iconName, accent = "cyan" }: StatCardProps) {
  const Icon = getLucideIcon(iconName);

  return (
    <motion.div whileHover={{ y: -2 }} className="glass rounded-2xl p-5">
      <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br p-3 ${accents[accent]}`}>
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{label}</p>
    </motion.div>
  );
}
