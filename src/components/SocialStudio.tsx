"use client";

import { Copy, DownloadSimple, Shuffle, Sparkle } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { SocialPostCard, type SocialCardFormat } from "@/components/SocialPostCard";
import { adventureQuotes } from "@/data/adventureQuotes";
import { socialMissions } from "@/data/socialMissions";
import { createMissionCaption } from "@/lib/socialMissionCaption";
import { getSocialMissionTypeLabel } from "@/lib/socialMissionMeta";
import type { SocialMission } from "@/types";

type SocialStudioTab = "quote" | "mission";
type ExportPost = { quote: typeof adventureQuotes[number] } | { mission: SocialMission };

const formats: ReadonlyArray<{ value: SocialCardFormat; label: string; dimensions: string; ratio: string }> = [
  { value: "instagram-portrait", label: "Instagram 直式", dimensions: "1080 × 1350", ratio: "4 / 5" },
  { value: "square", label: "正方形", dimensions: "1080 × 1080", ratio: "1 / 1" },
  { value: "threads-wide", label: "Threads 寬版", dimensions: "1080 × 810", ratio: "4 / 3" },
];

export function socialCardDimensions(format: SocialCardFormat) {
  return format === "instagram-portrait" ? { width: 1080, height: 1350 } : format === "threads-wide" ? { width: 1080, height: 810 } : { width: 1080, height: 1080 };
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = []; let line = "";
  for (const character of text) {
    if (line && ctx.measureText(line + character).width > maxWidth) { lines.push(line); line = character; } else line += character;
  }
  if (line) lines.push(line);
  return lines;
}

export async function exportSocialPost(post: ExportPost, format: SocialCardFormat) {
  await document.fonts.ready;
  const { width, height } = socialCardDimensions(format);
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("無法建立 PNG 畫布。");
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#06251a"); gradient.addColorStop(1, "#0b130e");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(251,191,36,.7)"; ctx.lineWidth = 3; ctx.strokeRect(48, 48, width - 96, height - 96);
  const x = 120; let y = 150;
  const write = (text: string, font: string, color: string, maxLines: number, lineHeight: number) => {
    ctx.font = font; ctx.fillStyle = color;
    for (const line of wrapText(ctx, text, width - 240).slice(0, maxLines)) { ctx.fillText(line, x, y); y += lineHeight; }
  };
  if ("mission" in post) {
    const mission = post.mission;
    write(`${getSocialMissionTypeLabel(mission.questType)} · ${mission.category}`, "700 26px system-ui", "#bbf7d0", 1, 36); y += 42;
    write(mission.title, "800 68px system-ui", "#f0fdf4", format === "threads-wide" ? 2 : 3, 78); y += 8;
    write(mission.objectiveTitle, "700 34px system-ui", "#fbbf24", 2, 46); y += 12;
    write(mission.description, "500 28px system-ui", "#d1fae5", format === "threads-wide" ? 2 : 3, 40); y += 24;
    write("完成條件", "800 20px system-ui", "#fbbf24", 1, 30);
    write(mission.completionCondition, "600 28px system-ui", "#f0fdf4", format === "threads-wide" ? 2 : 3, 40);
  } else {
    write("今日語錄", "700 28px system-ui", "#bbf7d0", 1, 36); y += 82;
    write(`「${post.quote.text}」`, "700 60px system-ui", "#f0fdf4", format === "threads-wide" ? 4 : 6, 80);
  }
  ctx.fillStyle = "#bbf7d0"; ctx.font = "700 22px system-ui"; ctx.fillText("Life Quest Map", x, height - 82);
  const kind = "mission" in post ? "mission" : "quote";
  const link = document.createElement("a");
  link.download = `life-quest-${kind}-${format}.png`;
  link.href = canvas.toDataURL("image/png"); link.click();
}

function FormatSelector({ selectedFormat, onSelect }: { selectedFormat: SocialCardFormat; onSelect: (format: SocialCardFormat) => void }) {
  return <div className="social-format-controls" role="group" aria-label="圖卡尺寸">
    {formats.map((format) => {
      const selected = format.value === selectedFormat;
      return <button key={format.value} type="button" aria-pressed={selected} onClick={() => onSelect(format.value)} className={`social-format-button ${selected ? "social-format-button--selected" : ""}`}>
        <span>{format.label}</span><small>{format.dimensions}</small>
      </button>;
    })}
  </div>;
}

function ScaledPreview({ post, selectedFormat }: { post: ExportPost; selectedFormat: SocialCardFormat }) {
  const ratio = formats.find((format) => format.value === selectedFormat)!.ratio;
  return <div className="social-post-preview-shell"><div className="social-post-stage" data-testid="social-post-stage" style={{ aspectRatio: ratio }}><div className="social-post-scale"><SocialPostCard format={selectedFormat} {...post} /></div></div></div>;
}

export function SocialStudio() {
  const [tab, setTab] = useState<SocialStudioTab>("quote");
  const [selectedFormat, setSelectedFormat] = useState<SocialCardFormat>("instagram-portrait");
  const [missionIndex, setMissionIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [notice, setNotice] = useState("");
  const quote = useMemo(() => adventureQuotes.find((item) => item.enabled) ?? adventureQuotes[0], []);
  const mission = socialMissions[missionIndex] ?? socialMissions[0];
  const post: ExportPost = tab === "quote" ? { quote } : { mission };
  const download = async () => { if (isExporting) return; setIsExporting(true); try { await exportSocialPost(post, selectedFormat); setNotice("PNG 已下載。"); } catch (error) { setNotice(error instanceof Error ? error.message : "PNG 匯出失敗。"); } finally { setIsExporting(false); } };

  return <main className="min-h-dvh px-4 py-7 text-zinc-100 sm:px-6 lg:px-10"><div className="mx-auto max-w-6xl">
    <header className="mb-7"><p className="text-xs font-bold tracking-[.18em] text-amber-200">MAPMAKER&apos;S DESK</p><h1 className="mt-2 text-3xl font-black sm:text-5xl">Social Studio</h1></header>
    <div className="mb-5 flex gap-2" role="tablist" aria-label="圖卡內容">
      <button type="button" role="tab" id="social-tab-quote" aria-controls="social-panel" aria-selected={tab === "quote"} onClick={() => setTab("quote")} className={`social-tab ${tab === "quote" ? "social-tab--active" : ""}`}>語錄</button>
      <button type="button" role="tab" id="social-tab-mission" aria-controls="social-panel" aria-selected={tab === "mission"} onClick={() => setTab("mission")} className={`social-tab ${tab === "mission" ? "social-tab--active" : ""}`}>今日任務</button>
    </div>
    <section id="social-panel" role="tabpanel" aria-labelledby={`social-tab-${tab}`} className="game-card relative z-0 p-4 sm:p-5">
      {tab === "mission" ? <div className="mb-4 flex flex-wrap items-center gap-2"><label className="text-sm font-bold text-emerald-100" htmlFor="social-mission">任務</label><select id="social-mission" value={missionIndex} onChange={(event) => setMissionIndex(Number(event.target.value))} className="field-control max-w-md py-2">{socialMissions.map((item, index) => <option key={item.id} value={index}>{item.title}</option>)}</select><button type="button" onClick={() => setMissionIndex((current) => (current + 1) % socialMissions.length)} className="social-secondary-button"><Shuffle className="size-4" />換一個任務</button><button type="button" onClick={() => navigator.clipboard.writeText(createMissionCaption(mission)).then(() => setNotice("任務文案已複製。"))} className="social-secondary-button"><Copy className="size-4" />複製文案</button></div> : null}
      <ScaledPreview post={post} selectedFormat={selectedFormat} />
      <div className="mt-4 relative z-10"><FormatSelector selectedFormat={selectedFormat} onSelect={setSelectedFormat} /></div>
      <div className="mt-4 flex flex-wrap gap-2 relative z-10"><a href={`/social-studio/preview?type=${tab}&${tab === "quote" ? `quote=${encodeURIComponent(quote.id)}` : `mission=${encodeURIComponent(mission.id)}`}&format=${selectedFormat}`} target="_blank" rel="noreferrer" className="social-secondary-button"><Sparkle className="size-4" />純預覽頁</a><button type="button" disabled={isExporting} onClick={() => void download()} aria-busy={isExporting} className="social-download-button"><DownloadSimple className="size-4" />{isExporting ? "匯出中…" : "下載 PNG"}</button></div>
      {notice ? <p role="status" className="mt-3 text-sm text-emerald-200">{notice}</p> : null}
    </section>
  </div></main>;
}
