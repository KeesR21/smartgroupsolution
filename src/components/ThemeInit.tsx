"use client";

import { useLayoutEffect } from "react";

/** Applies saved theme before paint on public pages (reduces flash). */
export function ThemeInit() {
  useLayoutEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;

    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";

    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  return null;
}
