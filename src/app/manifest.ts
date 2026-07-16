import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Life Quest Map 人生任務地圖",
    short_name: "Life Quest",
    description: "把現實生活變成 RPG 任務地圖。",
    start_url: "/",
    display: "standalone",
    background_color: "#03140f",
    theme_color: "#03140f",
    orientation: "any",
    icons: [
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
