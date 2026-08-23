"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemeKey = "oceanic" | "emerald" | "amethyst";

export interface ThemeMeta {
  key: ThemeKey;
  name: string;
  tagline: string;
  swatch: string[]; // preview swatches
}

export const THEMES: ThemeMeta[] = [
  {
    key: "oceanic",
    name: "Deep Oceanic",
    tagline: "Cyan / abyssal blue",
    swatch: ["#00d4ff", "#3880ff", "#0a1a2e"],
  },
  {
    key: "emerald",
    name: "Cyberpunk Emerald",
    tagline: "Neon green / carbon",
    swatch: ["#10f0a0", "#00c88c", "#06201a"],
  },
  {
    key: "amethyst",
    name: "Amethyst Night",
    tagline: "Violet / magenta",
    swatch: ["#a855f7", "#e848c8", "#140a2e"],
  },
];

interface ThemeCtx {
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "oceanic", setTheme: () => {} });

export function useTheme() {
  return useContext(Ctx);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>("oceanic");

  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      (window.localStorage.getItem("hemora-theme") as ThemeKey)) || "oceanic";
    setThemeState(stored);
    document.documentElement.setAttribute("data-theme", stored);
  }, []);

  const setTheme = useCallback((t: ThemeKey) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      window.localStorage.setItem("hemora-theme", t);
    } catch {
      /* ignore */
    }
  }, []);

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}
