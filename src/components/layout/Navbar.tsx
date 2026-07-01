"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/navigation";
import { useTheme } from "@/hooks/useTheme";
import { cn, smoothScrollTo } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BrandWordmark } from "@/components/brand/BrandLogo";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, mounted } = useTheme();
  const isLight = mounted && theme === "light";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    const sections = NAV_ITEMS.map((n) => n.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleNav = (href: string) => {
    smoothScrollTo(href);
    setActive(href);
    setMobileOpen(false);
  };

  const isContact = (href: string) => href === "#contact";

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-[background,box-shadow,border-color] duration-300 ease-out",
        scrolled
          ? cn(
              "border-b backdrop-blur-2xl",
              isLight
                ? "border-slate-200/90 bg-white/85 shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
                : "border-white/[0.06] bg-[var(--bg-primary)]/75 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
            )
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        className="mx-auto flex min-h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:gap-6 sm:px-8 lg:min-h-[4.75rem] lg:px-10"
        aria-label="Main navigation"
      >
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNav("#home");
          }}
          className="group relative flex shrink-0 items-center gap-3 sm:gap-3.5"
        >
          <BrandLogo size={60} className="sm:hidden" />
          <BrandLogo size={76} className="hidden sm:inline-flex" />
          <BrandWordmark className="text-base sm:text-lg lg:text-xl" />
        </a>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.href;
            const contact = isContact(item.href);

            if (contact) {
              return (
                <li key={item.href} className="ml-3">
                  <button
                    type="button"
                    onClick={() => handleNav(item.href)}
                    className="relative overflow-hidden rounded-full bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-2 text-[13px] font-medium tracking-wide text-white transition-all hover:brightness-110 hover:shadow-[0_0_24px_rgba(59,130,246,0.45)]"
                  >
                    {item.label}
                  </button>
                </li>
              );
            }

            return (
              <li key={item.href} className="relative">
                <button
                  type="button"
                  onClick={() => handleNav(item.href)}
                  className={cn(
                    "nav-link relative px-4 py-2 text-[13px] font-medium tracking-wide",
                    isActive && "nav-link-active"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className={cn(
                        "nav-underline-active absolute -bottom-0.5 left-3 right-3 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent",
                        isLight && "via-blue-500"
                      )}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-colors lg:hidden",
              isLight
                ? "border-slate-300 bg-white/90 text-slate-800 hover:border-blue-400 hover:text-blue-900"
                : scrolled
                  ? "border-white/10 bg-white/5 text-white hover:text-white"
                  : "border-white/15 bg-white/[0.04] text-white/90 hover:text-white"
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "fixed inset-0 z-40 backdrop-blur-sm lg:hidden",
                isLight ? "bg-slate-900/25" : "bg-black/60"
              )}
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className={cn(
                "fixed right-0 top-0 z-50 flex h-full w-[min(100%,320px)] flex-col border-l p-8 backdrop-blur-2xl lg:hidden",
                isLight
                  ? "border-slate-200 bg-white/98"
                  : "border-white/10 bg-[var(--bg-primary)]/95"
              )}
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
                    isLight
                      ? "border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-800"
                      : "border-white/10 text-white/80 hover:text-white"
                  )}
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item, i) => {
                  const isActive = active === item.href;
                  const contact = isContact(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <button
                        type="button"
                        onClick={() => handleNav(item.href)}
                        className={cn(
                          "w-full py-3.5 text-left text-[15px] font-medium tracking-wide transition-colors",
                          contact
                            ? "mt-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-3 text-center text-white"
                            : isActive
                              ? "nav-link-active font-semibold"
                              : "nav-link text-[var(--text-muted)]"
                        )}
                      >
                        {item.label}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
