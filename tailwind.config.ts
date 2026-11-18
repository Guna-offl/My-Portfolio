import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0d0d0d",
        line: "#272c34",
        muted: "#7a889e",
        accent: "#93ff3b",
        red: "#eb4736",
      },
      fontFamily: { sans: ["var(--font-geist)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
