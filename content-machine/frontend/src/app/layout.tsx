/**
 * Root layout for the application
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "KidVid - Toddler Content Machine",
  description:
    "AI-powered video content generation platform for creating engaging toddler videos (0-6 years). Generate, schedule, and optimize your kids content for YouTube and TikTok.",
  keywords: [
    "toddler videos",
    "kids content",
    "AI video generation",
    "YouTube kids",
    "TikTok kids",
    "nursery rhymes",
    "educational content",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
