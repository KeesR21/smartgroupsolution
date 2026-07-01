"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Building2,
  ExternalLink,
  Home,
  Info,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import type { LucideIcon } from "lucide-react";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/home", label: "Home", icon: Home },
      { href: "/admin/about", label: "About", icon: Info },
      { href: "/admin/pillars", label: "Pillars", icon: Layers },
      { href: "/admin/services", label: "Services", icon: Briefcase },
      { href: "/admin/impact", label: "Impact", icon: TrendingUp },
      { href: "/admin/industries", label: "Industries", icon: Building2 },
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/contact", label: "Contact", icon: Mail },
    ],
  },
  {
    title: "Inbox",
    items: [{ href: "/admin/messages", label: "Messages", icon: Inbox }],
  },
  {
    title: "System",
    items: [{ href: "/admin/settings", label: "Settings", icon: Settings2 }],
  },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { notify } = useNotifications();

  return (
    <div className="flex h-full flex-col bg-universe-deep/95 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3">
          <BrandLogo size={46} forceDark />
          <span>
            <span className="block text-sm font-semibold leading-tight">
              Smart <span className="text-neon-cyan">Group</span> Solution
            </span>
            <span className="text-xs font-normal text-[var(--text-muted)]">Admin Panel</span>
          </span>
        </Link>
        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-3" aria-label="Admin navigation">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]/70">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((link) => {
                const active = link.exact
                  ? pathname === link.href
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                      active
                        ? "bg-neon-blue/15 text-neon-cyan"
                        : "text-[var(--text-muted)] hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/[0.06] p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          View Website
        </Link>
        <button
          type="button"
          onClick={async () => {
            notify({ type: "info", title: "Signed out", message: "You have been logged out.", durationMs: 3000 });
            await signOut({ callbackUrl: "/admin/login" });
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
