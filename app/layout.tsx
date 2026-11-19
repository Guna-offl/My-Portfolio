import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Guna — Product Designer",
  description: "Guna is a product designer in Bengaluru with 5+ years in B2B SaaS. Case study: redesigning Recotap’s ABM platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint so there is no flash. ?theme=light|dark also works. */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var q=new URLSearchParams(location.search).get("theme");var t=(q==="light"||q==="dark")?q:localStorage.getItem("theme");if(t==="light")document.documentElement.dataset.theme="light"}catch(e){}})()` }} />
      </head>
      <body className="bg-bg font-sans text-fg">
        {children}
        {/* Privacy-friendly visitor counts (no cookies). Only reports once Web Analytics is enabled in the Vercel project. */}
        <Analytics />
      </body>
    </html>
  );
}
