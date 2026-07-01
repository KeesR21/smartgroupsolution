"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { Breadcrumbs, type Crumb } from "@/components/admin/ui/Breadcrumbs";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface AdminShellProps {
  children: ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
}

export function AdminShell({
  children,
  title,
  description,
  breadcrumbs,
  actions,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-universe-deep text-[var(--text-primary)]">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-white/[0.06] lg:block">
        <div className="sticky top-0 h-screen">
          <AdminSidebar />
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[120] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", duration: 0.22 }}
              className="absolute inset-y-0 left-0 w-72 border-r border-white/[0.06] shadow-2xl"
            >
              <AdminSidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-universe-deep/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="mt-0.5 rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/10 hover:text-white lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
                <h1 className="truncate text-xl font-semibold lg:text-2xl">{title}</h1>
                {description && (
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {actions}
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
