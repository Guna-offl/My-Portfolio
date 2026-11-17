import type { Metadata } from "next";
import { Gochi_Hand } from "next/font/google";

// Everything is Geist (set in the root layout) except the sticky-note handwriting font, kept wherever the Figma used it.
const hand = Gochi_Hand({ subsets: ["latin"], weight: "400", variable: "--font-hand" });

export const metadata: Metadata = {
  title: "Recotap case study — Guna",
  description: "Redesigning Recotap’s ABM platform: turning complex workflows into confident actions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={hand.variable}>{children}</div>;
}
