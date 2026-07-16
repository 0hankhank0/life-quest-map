import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { PwaRegistrar } from "@/components/PwaRegistrar";
import { AppProviders } from "@/components/AppProviders";

export const metadata: Metadata = {
  title: "Life Quest Map 人生任務地圖",
  description: "把日常任務、技能、等級與地圖探索整合成 RPG 成長介面。",
  applicationName: "Life Quest Map",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Life Quest Map",
    statusBarStyle: "black-translucent"
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#03140f"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>
        <AppProviders>{children}</AppProviders>
        <PwaRegistrar />
      </body>
    </html>
  );
}
