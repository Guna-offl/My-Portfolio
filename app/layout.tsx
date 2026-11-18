import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Guna ‚Äî Product Designer",
  description: "Guna is a product designer in Bengaluru with 5+ years in B2B SaaS. Case study: redesigning Recotap‚Äôs ABM platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-bg font-sans text-white">{children}</body>
    </html>
  );
}
