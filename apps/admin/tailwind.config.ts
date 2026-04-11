import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        "text-main": "var(--text-main)",
        "text-sub": "var(--text-sub)",
        "text-muted": "var(--text-muted)",
        danger: "var(--danger)",
        warning: "var(--warning)",
        "dark-bg": "var(--dark-bg)",
        "dark-surface": "var(--dark-surface)",
        border: "var(--border)",
      },
    },
  },
  plugins: [],
};
export default config;
