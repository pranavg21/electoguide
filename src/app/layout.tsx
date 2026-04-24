import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "ElectoGuide Bharat — AI Election Education Assistant",
  description: "An interactive AI assistant that educates Indian citizens on ECI processes, voter registration (Form 6), EVM voting, and election phases. Supports Hindi, Marathi, and English.",
  keywords: ["election", "India", "ECI", "voter registration", "Form 6", "EPIC", "Voter ID", "EVM", "VVPAT", "AI assistant", "election guide", "भारत निर्वाचन"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ElectoGuide Bharat",
  },
  openGraph: {
    title: "ElectoGuide Bharat — AI Election Education Assistant",
    description: "Interactive AI-powered guide to Indian elections. Check eligibility, learn Form 6 registration, understand EVM voting.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} h-full dark`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="h-full flex flex-col bg-grid">
        <a href="#main-content" className="skip-link">Skip to content</a>
        {/* Screen reader live region for dynamic announcements */}
        <div id="sr-announcer" className="sr-only" aria-live="assertive" aria-atomic="true" role="status" />
        <main id="main-content" className="flex-1 flex flex-col" role="main">
          {children}
        </main>
      </body>
    </html>
  );
}
