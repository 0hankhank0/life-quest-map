import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Life Quest Map｜生活冒險地圖", short_name: "Life Quest", description: "用任務、微冒險與技能樹，將日常累積成可看見的成長。", start_url: "/", display: "standalone", background_color: "#03140f", theme_color: "#03140f", orientation: "any", icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" }, { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" }, { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }] };
}
