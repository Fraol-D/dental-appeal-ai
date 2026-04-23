import type { Metadata } from "next";
import { Manrope, Merriweather } from "next/font/google";

import "./globals.css";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Merriweather({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dental Appeal Letter Generator",
  description: "Generate payer-specific dental denial appeal letters.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${sans.variable} ${serif.variable} bg-canvas text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
