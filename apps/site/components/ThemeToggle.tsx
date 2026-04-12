"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="theme-toggle" />;

  return (
    <button 
      className="theme-toggle" 
      title="Toggle light/dark mode" 
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <span className="toggle-icon ti-moon">🌙</span>
      <span className="toggle-icon ti-sun">☀️</span>
    </button>
  );
}
