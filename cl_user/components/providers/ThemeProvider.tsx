"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // On mount: read localStorage → fallback to system preference
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const nextTheme: Theme = (stored === "light" || stored === "dark")
      ? stored
      : window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";

    const handle = setTimeout(() => {
      setTheme(nextTheme);
    }, 0);
    return () => clearTimeout(handle);
  }, []);

  // Sync html class whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
