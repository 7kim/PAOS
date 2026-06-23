"use client";
import { useEffect, useState } from "react";
import { applyTheme, getAppliedTheme } from "@/lib/themes";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("paos-settings");
    let theme = "dark";
    if (stored) {
      try {
        const s = JSON.parse(stored);
        if (s.theme === "light" || s.theme === "dark") theme = s.theme;
        if (s.theme === "system") {
          theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
        }
      } catch { /* ignore */ }
    }
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    applyTheme(getAppliedTheme());

    // Listen for settings changes from other tabs
    const handler = () => {
      const fresh = localStorage.getItem("paos-settings");
      if (fresh) {
        try {
          const s = JSON.parse(fresh);
          let t = s.theme || "dark";
          if (t === "system") {
            t = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
          }
          document.documentElement.setAttribute("data-theme", t);
          document.documentElement.classList.toggle("dark", t === "dark");
          applyTheme(getAppliedTheme()); // re-apply theme with new dark/light mode
        } catch {}
      }
    };
    window.addEventListener("storage", handler);
    // Also poll every 2s in the same tab (settings page changes don't fire 'storage' event in the same tab)
    const poll = setInterval(handler, 2000);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(poll);
    };
  }, []);

  // Prevent flash of wrong theme
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <>{children}</>;
}
