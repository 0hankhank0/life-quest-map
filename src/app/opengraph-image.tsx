import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "76px", color: "#f4f4f5", background: "linear-gradient(135deg, #03140f, #18181b)" }}><div style={{ color: "#6ee7b7", fontSize: 28, fontWeight: 700, letterSpacing: 8 }}>LIFE QUEST MAP</div><div style={{ marginTop: 28, fontSize: 76, fontWeight: 800 }}>TURN DAILY TASKS</div><div style={{ marginTop: 24, color: "#d4d4d8", fontSize: 34 }}>INTO YOUR OWN ADVENTURE.</div></div>, { ...size });
}
