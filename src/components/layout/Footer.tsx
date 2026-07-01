"use client";

import { Facebook, Github, Instagram, Linkedin, MessageCircle, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BrandWordmark } from "@/components/brand/BrandLogo";
import { NAV_ITEMS } from "@/lib/navigation";
import { smoothScrollTo } from "@/lib/utils";
import type { SiteContentRecord } from "@/types/cms";

export function Footer({ content }: { content: SiteContentRecord }) {
  const year = new Date().getFullYear();

  const socials = [
    { href: content.socialLinkedin, icon: Linkedin, label: "LinkedIn" },
    { href: content.socialTwitter, icon: Twitter, label: "Twitter" },
    { href: content.socialGithub, icon: Github, label: "GitHub" },
    { href: content.socialFacebook, icon: Facebook, label: "Facebook" },
    { href: content.socialInstagram, icon: Instagram, label: "Instagram" },
  ].filter((s) => s.href);

  return (
    <footer className="site-footer px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-start md:text-left">
            <BrandLogo size={56} />
            <div>
              <BrandWordmark className="text-xl" />
              <p className="mt-2 text-sm text-[var(--text-muted)]">{content.footerTagline}</p>
              {socials.length > 0 && (
                <div className="mt-4 flex justify-center gap-3 md:justify-start">
                  {socials.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[var(--text-muted)] transition-colors hover:bg-neon-blue/15 hover:text-neon-cyan"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => smoothScrollTo(item.href)}
                    className="link-hover-theme text-sm text-[var(--text-muted)] transition-colors hover:text-neon-cyan"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          className="mt-8 border-t pt-8 text-center text-sm text-[var(--text-muted)]"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <p>&copy; {year} Smart Group Solution. All rights reserved.</p>
        </div>
      </div>

      <motion.a
        href="#contact"
        onClick={(e) => {
          e.preventDefault();
          smoothScrollTo("#contact");
        }}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-neon-purple to-neon-blue text-white shadow-lg shadow-neon-purple/30 neon-glow-hover"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open contact chat"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.a>
    </footer>
  );
}
