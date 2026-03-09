import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NicheHunt — Profitable YouTube Niche Database for Creators",
  description: "Discover high-CPM, low-competition YouTube niches backed by real data. Analyzed using YouTube API with difficulty scores, CPM estimates, and trend data.",
  metadataBase: new URL("https://nichehunt.xyz"),
  openGraph: {
    title: "NicheHunt — Profitable YouTube Niche Database",
    description: "170+ data-driven YouTube niches with CPM estimates, difficulty scores, and trend analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2892900713777311"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Gumroad overlay JS */}
        <Script src="https://gumroad.com/js/gumroad.js" strategy="afterInteractive" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
