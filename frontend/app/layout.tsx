import type { Metadata } from "next";
import { Inter, Manrope, Work_Sans } from "next/font/google";

import "./globals.css";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const work = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AppealMD",
  description: "Recover denied dental revenue with payer-aware appeal letters in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${sans.variable} ${work.variable} ${inter.variable} bg-canvas text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
