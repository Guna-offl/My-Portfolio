import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Theme tokens live in app/globals.css (dark by default, light under data-theme="light").
        bg: "rgb(var(--c-bg) / <alpha-value>)",
        fg: "rgb(var(--c-fg) / <alpha-value>)",
        "fg-soft": "rgb(var(--c-fg-soft) / <alpha-value>)",
        card: "rgb(var(--c-card) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        red: "rgb(var(--c-red) / <alpha-value>)",
      },
      fontFamily: { sans: ["var(--font-geist)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
