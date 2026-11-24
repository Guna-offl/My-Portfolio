import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import SquareCursor from "@/components/SquareCursor";

// Everything is Geist (set in the root layout) except the sticky-note handwriting font, kept wherever the Figma used it.
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-geist-mono" });
const hand = localFont({ src: "./fonts/StickyNotes.ttf", weight: "400", variable: "--font-hand", fallback: ["cursive"] });

export const metadata: Metadata = {
  title: "Recotap case study — Guna",
  description: "Redesigning Recotap’s ABM platform: turning complex workflows into confident actions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${hand.variable} ${mono.variable}`}>
      <SquareCursor />
      {children}
    </div>
  );
}
