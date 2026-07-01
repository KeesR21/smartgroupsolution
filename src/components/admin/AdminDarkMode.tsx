"use client";

import { useEffect, useLayoutEffect } from "react";

function applyAdminDark() {
  const root = document.documentElement;
  root.classList.remove("light");
  root.classList.add("dark");
  root.style.colorScheme = "dark";
}

/** Keeps the admin panel in dark mode regardless of the public site theme. */
export function AdminDarkMode() {
  useLayoutEffect(() => {
    applyAdminDark();
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains("light")) {
        applyAdminDark();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      document.documentElement.style.colorScheme = "";
      const stored = localStorage.getItem("theme");
      const theme = stored === "light" ? "light" : "dark";
      document.documentElement.classList.toggle("light", theme === "light");
      document.documentElement.classList.toggle("dark", theme === "dark");
    };
  }, []);

  return null;
}
