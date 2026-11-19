import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeToggle } from "@/components/theme";

// Everything is Geist (set in the root layout) except the sticky-note handwriting font, kept wherever the Figma used it.
const hand = localFont({ src: "./fonts/StickyNotes.ttf", weight: "400", variable: "--font-hand", fallback: ["cursive"] });

export const metadata: Metadata = {
  title: "Recotap case study — Guna",
  description: "Redesigning Recotap’s ABM platform: turning complex workflows into confident actions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={hand.variable}>
      <div className="fixed right-4 top-4 z-40 rounded-full border border-line bg-bg/70 backdrop-blur-sm">
        <ThemeToggle flush />
      </div>
      {children}
    </div>
  );
}
