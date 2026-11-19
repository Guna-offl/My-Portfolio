import type { Metadata } from "next";
import localFont from "next/font/local";
import ForceDark from "@/components/ForceDark";

// Everything is Geist (set in the root layout) except the sticky-note handwriting font, kept wherever the Figma used it.
const hand = localFont({ src: "./fonts/StickyNotes.ttf", weight: "400", variable: "--font-hand", fallback: ["cursive"] });

export const metadata: Metadata = {
  title: "Recotap case study — Guna",
  description: "Redesigning Recotap’s ABM platform: turning complex workflows into confident actions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={hand.variable}><ForceDark />{children}</div>;
}
