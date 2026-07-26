import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve, isAbsolute } from "node:path";

const args = Object.fromEntries(process.argv.slice(2).map((arg) => { const [key, ...values] = arg.replace(/^--/, "").split("="); return [key, values.join("=") || true]; }));
const type = args.type === "mission" ? "mission" : "quote";
if (args.type && !["quote", "mission"].includes(args.type)) throw new Error("--type 必須是 quote 或 mission。");
const quote = typeof args.quote === "string" ? args.quote : "city-1";
const mission = typeof args.mission === "string" ? args.mission : "daily-walk-1";
const format = args.format === "square" || args.format === "threads" ? args.format : "portrait";
if (args.format && !["portrait", "square", "threads"].includes(args.format)) throw new Error("--format 只接受 portrait、square 或 threads。");
const port = Number(process.env.SOCIAL_SCREENSHOT_PORT ?? "3102");
const baseURL = process.env.SOCIAL_BASE_URL ?? `http://127.0.0.1:${port}`;
const date = new Date().toISOString().slice(0, 10);
const outputDirectory = resolve("social-exports");
mkdirSync(outputDirectory, { recursive: true });
const itemId = type === "mission" ? mission : quote;
const suppliedOutput = typeof args.output === "string" ? args.output : `${date}-${itemId}-${format}.png`;
const outputPath = isAbsolute(suppliedOutput) ? suppliedOutput : resolve(outputDirectory, suppliedOutput);

let server;
async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try { const response = await fetch(baseURL); if (response.ok) return; } catch { /* development server is still starting */ }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
  }
  throw new Error(`無法在 ${baseURL} 啟動 Life Quest Map。請確認 npm.cmd run dev 可以正常執行。`);
}

try {
  if (!process.env.SOCIAL_BASE_URL) {
    const isWindows = process.platform === "win32";
    server = isWindows
      ? spawn(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", `npm.cmd run dev -- --hostname 127.0.0.1 --port ${port}`], { stdio: "pipe", shell: false })
      : spawn("npm", ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(port)], { stdio: "pipe", shell: false });
    server.stderr.on("data", () => undefined);
    await waitForServer();
  }
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: format === "portrait" ? 1350 : format === "threads" ? 810 : 1080 }, deviceScaleFactor: 1 });
  const url = type === "mission"
    ? `${baseURL}/social-studio/preview?type=mission&mission=${encodeURIComponent(mission)}&format=${format}`
    : `${baseURL}/social-studio/preview?type=quote&quote=${encodeURIComponent(quote)}&format=${format}&source=${args.source === "0" ? "0" : "1"}`;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(async () => { await document.fonts.ready; });
  const card = page.getByTestId("social-post-card");
  if (await card.count() !== 1) throw new Error(`找不到社群貼文卡片。請確認 ${type === "mission" ? "mission ID「" + mission : "quote ID「" + quote}」存在且可用。`);
  await card.screenshot({ path: outputPath, type: "png" });
  await browser.close();
  console.log(`社群貼文 PNG 已輸出：${outputPath}`);
} catch (error) {
  console.error(`社群貼文截圖失敗：${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  if (server && !server.killed) server.kill();
}
