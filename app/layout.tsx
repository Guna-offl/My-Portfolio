import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SquareCursor from "@/components/SquareCursor";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Guna — Product Designer",
  description: "Guna is a product designer in Bengaluru with 5+ years in B2B SaaS. Case study: redesigning Recotap’s ABM platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-bg font-sans text-fg">
        <SquareCursor />
        {children}
        {/* Privacy-friendly visitor counts (no cookies). Only reports once Web Analytics is enabled in the Vercel project. */}
        <Analytics />
      </body>
    </html>
  );
}
