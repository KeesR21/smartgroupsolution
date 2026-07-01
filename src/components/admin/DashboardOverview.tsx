"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Home,
  Inbox,
  Info,
  Layers,
  Mail,
  TrendingUp,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { GlassPanel } from "./GlassPanel";

interface Stats {
  servicesCount: number;
  pillarsCount: number;
  industriesCount: number;
  teamCount: number;
  storiesCount: number;
  messagesCount: number;
  unreadCount: number;
}

const accents: Record<string, string> = {
  cyan: "from-neon-cyan/20 to-neon-cyan/5 text-neon-cyan",
  blue: "from-neon-blue/20 to-neon-blue/5 text-neon-blue",
  purple: "from-neon-purple/20 to-neon-purple/5 text-neon-purple",
};

function StatCard({
  label,
  value,
  icon: Icon,
  accent = "cyan",
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  accent?: string;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} className="glass rounded-2xl p-5">
      <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br p-3 ${accents[accent]}`}>
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{label}</p>
    </motion.div>
  );
}

const SECTIONS: { href: string; label: string; desc: string; icon: LucideIcon }[] = [
  { href: "/admin/home", label: "Home", desc: "Hero, CTAs, statistics", icon: Home },
  { href: "/admin/about", label: "About", desc: "Story, mission & vision", icon: Info },
  { href: "/admin/pillars", label: "Pillars", desc: "Core capabilities", icon: Layers },
  { href: "/admin/services", label: "Services", desc: "Service catalog", icon: Briefcase },
  { href: "/admin/impact", label: "Impact", desc: "Stats & success stories", icon: TrendingUp },
  { href: "/admin/industries", label: "Industries", desc: "Sectors served", icon: Building2 },
  { href: "/admin/team", label: "Team", desc: "Members & profiles", icon: Users },
  { href: "/admin/contact", label: "Contact", desc: "Details, map & social", icon: Mail },
];

export function DashboardOverview({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Services" value={stats.servicesCount} icon={Briefcase} accent="cyan" />
        <StatCard label="Team Members" value={stats.teamCount} icon={Users} accent="blue" />
        <StatCard label="Success Stories" value={stats.storiesCount} icon={Trophy} accent="purple" />
        <StatCard label="Unread Messages" value={stats.unreadCount} icon={Inbox} accent="cyan" />
      </div>

      <GlassPanel title="Manage content" description="Jump straight into any section of the website.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="glass group flex flex-col gap-3 rounded-xl p-4 transition-colors hover:border-neon-cyan/20 hover:bg-white/5"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-neon-blue/15 text-neon-cyan">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-medium text-[var(--text-primary)]">{s.label}</span>
                  <span className="block text-xs text-[var(--text-muted)]">{s.desc}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </GlassPanel>

      <div className="grid gap-4 sm:grid-cols-3">
        <GlassPanel>
          <p className="text-sm text-[var(--text-muted)]">Pillars</p>
          <p className="mt-1 text-2xl font-bold">{stats.pillarsCount}</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-sm text-[var(--text-muted)]">Industries</p>
          <p className="mt-1 text-2xl font-bold">{stats.industriesCount}</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-sm text-[var(--text-muted)]">Total messages</p>
          <p className="mt-1 text-2xl font-bold">{stats.messagesCount}</p>
        </GlassPanel>
      </div>
    </div>
  );
}
