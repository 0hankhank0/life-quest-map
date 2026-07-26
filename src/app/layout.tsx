import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { PwaRegistrar } from "@/components/PwaRegistrar";
import { AppProviders } from "@/components/AppProviders";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: { default: "Life Quest Map｜生活冒險地圖", template: "%s｜Life Quest Map" },
  description: "用任務、微冒險與技能樹，將日常累積成可看見的成長。",
  applicationName: "Life Quest Map",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "zh_TW", title: "Life Quest Map｜生活冒險地圖", description: "用任務、微冒險與技能樹，將日常累積成可看見的成長。", url: "/", siteName: "Life Quest Map", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Life Quest Map 生活冒險地圖" }] },
  twitter: { card: "summary_large_image", title: "Life Quest Map｜生活冒險地圖", description: "用任務、微冒險與技能樹，將日常累積成可看見的成長。", images: ["/opengraph-image"] },
  appleWebApp: { capable: true, title: "Life Quest Map", statusBarStyle: "black-translucent" },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 1, themeColor: "#03140f" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="zh-Hant"><body><AppProviders>{children}</AppProviders><PwaRegistrar /></body></html>;
}
