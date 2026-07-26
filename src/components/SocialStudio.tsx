"use client";

import { Copy, DownloadSimple, MagnifyingGlass, Shuffle, Sparkle } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { adventureQuotes } from "@/data/adventureQuotes";
import { socialMissionCategories, socialMissionTypes, socialMissions } from "@/data/socialMissions";
import { SocialPostCard, type SocialPostFormat } from "@/components/SocialPostCard";
import { createMissionCaption } from "@/lib/socialMissionCaption";
import { getSocialMissionTypeLabel } from "@/lib/socialMissionMeta";
import type { QuestDifficulty, SocialMission, SocialMissionCategory, SocialMissionType } from "@/types";

type MissionFilter = SocialMissionType | "all";
const formats: Array<{ value: SocialPostFormat; label: string; detail: string }> = [{ value: "portrait", label: "Instagram 直式", detail: "1080 × 1350" }, { value: "square", label: "正方形", detail: "1080 × 1080" }, { value: "threads", label: "Threads 寬版", detail: "1080 × 810" }];
const difficulties: Array<{ value: QuestDifficulty; label: string }> = [{ value: "easy", label: "簡單" }, { value: "normal", label: "普通" }, { value: "hard", label: "挑戰" }];
const difficultyLabel = (value: QuestDifficulty) => difficulties.find((item) => item.value === value)?.label ?? "普通";
const safeText = (value: string) => value.trim().slice(0, 240);
const createCustom = (base: SocialMission): SocialMission => ({ ...base, id: "custom-mission", title: "", objectiveTitle: "", description: "", completionCondition: "", rewardLabel: "成長經驗 +1", steps: undefined });
function heightFor(format: SocialPostFormat) { return format === "portrait" ? 1350 : format === "square" ? 1080 : 810; }
function lines(context: CanvasRenderingContext2D, text: string, width: number) { const result: string[] = []; let line = ""; for (const char of text) { if (line && context.measureText(line + char).width > width) { result.push(line); line = char; } else line += char; } if (line) result.push(line); return result; }
async function exportPost(post: { quote?: typeof adventureQuotes[number]; mission?: SocialMission }, format: SocialPostFormat) {
  await document.fonts.ready; const width = 1080; const height = heightFor(format); const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height; const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("無法建立 PNG 畫布。");
  const mission = post.mission; const gradient = ctx.createLinearGradient(0, 0, width, height); gradient.addColorStop(0, "#06251a"); gradient.addColorStop(1, "#0b130e"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height); ctx.strokeStyle = "rgba(251,191,36,.65)"; ctx.lineWidth = 3; ctx.strokeRect(48, 48, width - 96, height - 96); const x = 120; let y = 130; const write = (text: string, font: string, color: string, max = 3, gap = 1.25) => { ctx.font = font; ctx.fillStyle = color; for (const line of lines(ctx, text, 830).slice(0, max)) { ctx.fillText(line, x, y); y += Number(font.match(/(\d+)px/)?.[1] ?? 24) * gap; } };
  if (mission) { write(`${getSocialMissionTypeLabel(mission.questType)} · ${mission.category}`, "700 26px system-ui", "#bbf7d0", 1); y += 50; write(mission.title, "800 72px system-ui", "#f0fdf4", 2, 1.1); y += 12; write(mission.objectiveTitle, "700 34px system-ui", "#fbbf24", 2); y += 12; write(mission.description, "500 28px system-ui", "#d1fae5", format === "threads" ? 2 : 3); y += 28; write("完成條件", "800 20px system-ui", "#fbbf24", 1); write(mission.completionCondition, "600 28px system-ui", "#f0fdf4", format === "threads" ? 2 : 3); y = Math.min(y + 24, height - 135); write(`${mission.estimatedMinutes} 分鐘 · ${difficultyLabel(mission.difficulty)} · +${mission.xp} XP`, "700 23px system-ui", "#d1fae5", 1); write(`獎勵：${mission.rewardLabel}`, "800 23px system-ui", "#fbbf24", 1); } else if (post.quote) { write("探索者語錄", "700 28px system-ui", "#bbf7d0", 1); y += 90; write(`「${post.quote.text}」`, "700 62px system-ui", "#f0fdf4", 6, 1.35); }
  ctx.fillStyle = "#bbf7d0"; ctx.font = "700 22px system-ui"; ctx.fillText("Life Quest Map", x, height - 82); const id = mission?.id ?? post.quote!.id; const link = document.createElement("a"); link.download = `life-quest-map-${id}-${format}.png`; link.href = canvas.toDataURL("image/png"); link.click();
}

function FilterRow({ label, options, value, onChange }: { label: string; options: Array<{ value: string; label: string }>; value: string; onChange: (value: string) => void }) {
  return <fieldset className="mt-3"><legend className="text-xs font-bold text-emerald-100">{label}</legend><div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label={label}>{options.map((option) => <button key={option.value} type="button" role="radio" aria-checked={value === option.value} onClick={() => onChange(option.value)} className={`rounded-full px-2.5 py-1 text-xs font-bold ${value === option.value ? "bg-amber-300 text-zinc-950" : "bg-white/10 text-zinc-300"}`}>{option.label}</button>)}</div></fieldset>;
}

function MissionList({ missions, selectedId, onSelect }: { missions: SocialMission[]; selectedId: string; onSelect: (id: string) => void }) {
  if (!missions.length) return <p role="status" className="mt-4 rounded-lg border border-dashed border-white/15 p-4 text-sm text-zinc-400">沒有符合條件的公開任務，試著調整搜尋或篩選。</p>;
  return <div className="mt-3 max-h-[40dvh] space-y-2 overflow-y-auto pr-1">{missions.map((mission) => <button key={mission.id} type="button" onClick={() => onSelect(mission.id)} className={`w-full rounded-lg border p-3 text-left ${mission.id === selectedId ? "border-amber-300/70 bg-amber-300/10" : mission.questType === "main" ? "border-emerald-200/30 bg-emerald-950/20" : "border-white/10 bg-black/15 hover:border-emerald-300/40"}`}><p className="text-xs font-bold text-amber-100">{getSocialMissionTypeLabel(mission.questType)} · {mission.category}</p><p className="mt-1 text-base font-black text-zinc-50">{mission.title}</p><p className="text-sm font-semibold text-emerald-100">{mission.objectiveTitle}</p><p className="mt-1 text-xs text-zinc-400">{mission.estimatedMinutes} 分鐘 · {difficultyLabel(mission.difficulty)} · +{mission.xp} XP</p><p className="mt-1 text-xs text-amber-100">{mission.rewardLabel}</p></button>)}</div>;
}

function CustomMissionEditor({ mission, onChange }: { mission: SocialMission; onChange: (patch: Partial<SocialMission>) => void }) {
  const text = (key: "title" | "objectiveTitle" | "description" | "completionCondition" | "rewardLabel", label: string, hint: string) => <label className="block text-xs font-bold text-zinc-300">{label}<span className="mt-1 block font-normal text-zinc-500">{hint}</span><input aria-label={label} value={mission[key]} onChange={(event) => onChange({ [key]: safeText(event.target.value) })} className="field-control mt-1 text-sm" /></label>;
  return <details className="mt-4 border-t border-white/10 pt-4"><summary className="cursor-pointer text-sm font-bold text-amber-100">自訂本次任務</summary><div className="mt-3 space-y-3">{text("title", "RPG 任務名稱", "用較有冒險感的名稱包裝任務")}{text("objectiveTitle", "現實目標", "實際要完成的事情")}{text("description", "任務說明", "一句讓人理解這個關卡的說明")}{text("completionCondition", "完成條件", "完成後應該看見什麼")}{text("rewardLabel", "成長獎勵", "留白時使用「成長經驗 +1」")}<div className="grid grid-cols-2 gap-2"><label className="text-xs">任務類型<select aria-label="自訂任務類型" value={mission.questType} onChange={(event) => onChange({ questType: event.target.value as SocialMissionType })} className="field-control mt-1 text-sm">{socialMissionTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="text-xs">成長分類<select aria-label="自訂成長分類" value={mission.category} onChange={(event) => onChange({ category: event.target.value as SocialMissionCategory })} className="field-control mt-1 text-sm">{socialMissionCategories.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-xs">難度<select aria-label="自訂難度" value={mission.difficulty} onChange={(event) => onChange({ difficulty: event.target.value as QuestDifficulty })} className="field-control mt-1 text-sm">{difficulties.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="text-xs">預估時間<input aria-label="預估時間" type="number" min="1" value={mission.estimatedMinutes} onChange={(event) => onChange({ estimatedMinutes: Math.max(1, Number(event.target.value) || 1) })} className="field-control mt-1 text-sm" /></label><label className="text-xs">XP<input aria-label="XP" type="number" min="0" value={mission.xp} onChange={(event) => onChange({ xp: Math.max(0, Math.floor(Number(event.target.value) || 0)) })} className="field-control mt-1 text-sm" /></label></div></div></details>;
}

export function SocialStudio() {
  const [mode, setMode] = useState<"quote" | "mission">("quote"); const [query, setQuery] = useState(""); const [format, setFormat] = useState<SocialPostFormat>("portrait"); const [missionType, setMissionType] = useState<MissionFilter>("all"); const [category, setCategory] = useState<SocialMissionCategory | "all">("all"); const [selectedId, setSelectedId] = useState(socialMissions[0].id); const [custom, setCustom] = useState<SocialMission | null>(null); const [notice, setNotice] = useState(""); const [isExporting, setIsExporting] = useState(false);
  const selectedQuote = adventureQuotes.find((quote) => quote.enabled) ?? adventureQuotes[0];
  const missions = useMemo(() => { const term = query.trim().toLowerCase(); return socialMissions.filter((mission) => (missionType === "all" || mission.questType === missionType) && (category === "all" || mission.category === category) && (!term || [mission.id, mission.title, mission.objectiveTitle, mission.description, mission.completionCondition, getSocialMissionTypeLabel(mission.questType), mission.category, mission.rewardLabel, mission.steps?.join(" ")].join(" ").toLowerCase().includes(term))); }, [category, missionType, query]);
  useEffect(() => { if (custom) return; if (missions.length && !missions.some((mission) => mission.id === selectedId)) setSelectedId(missions[0].id); }, [custom, missions, selectedId]);
  const selected = custom ?? socialMissions.find((mission) => mission.id === selectedId) ?? socialMissions[0];
  const updateCustom = (patch: Partial<SocialMission>) => setCustom((current) => ({ ...(current ?? createCustom(selected)), ...patch, rewardLabel: patch.rewardLabel === "" ? "成長經驗 +1" : (patch.rewardLabel ?? current?.rewardLabel ?? "成長經驗 +1"), steps: undefined }));
  const valid = Boolean(selected.title && selected.objectiveTitle && selected.completionCondition && selected.rewardLabel);
  const copy = async () => { if (!valid) { setNotice("請先填寫 RPG 名稱、現實目標、完成條件與成長獎勵。"); return; } try { await navigator.clipboard.writeText(createMissionCaption(selected)); setNotice("貼文文案已複製。"); } catch { setNotice("無法使用剪貼簿，請手動複製文案。"); } };
  const handleDownload = async () => { if (isExporting) return; try { setIsExporting(true); await exportPost(mode === "mission" ? { mission: selected } : { quote: selectedQuote }, format); setNotice("PNG 已下載。"); } catch (error) { setNotice(error instanceof Error ? error.message : "PNG 產生失敗。"); } finally { setIsExporting(false); } };
  const chooseAnother = () => { const candidates = missions.filter((mission) => mission.id !== selected.id); if (candidates.length) { setCustom(null); setSelectedId(candidates[Math.floor(Math.random() * candidates.length)].id); } };
  const ratio = format === "portrait" ? "4 / 5" : format === "square" ? "1 / 1" : "4 / 3";
  const downloadButton = (
    <button
      type="button"
      disabled={isExporting}
      onClick={handleDownload}
      aria-busy={isExporting}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-3 font-black text-emerald-950 disabled:opacity-60"
    >
      <DownloadSimple className="size-4" aria-hidden="true" />
      {isExporting ? "產生中…" : "下載 PNG"}
    </button>
  );
  return (
    <main className="min-h-dvh px-4 py-7 text-zinc-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 max-w-3xl">
          <p className="text-xs font-bold tracking-[.18em] text-amber-200">MAPMAKER&apos;S DESK</p>
          <h1 className="mt-2 text-3xl font-black sm:text-5xl">社群貼文產生器</h1>
        </header>
        <div className="mb-5 flex gap-2" role="tablist" aria-label="貼文類型">
          <button type="button" role="tab" aria-selected={mode === "quote"} onClick={() => setMode("quote")} className={`rounded-lg px-4 py-2 font-bold ${mode === "quote" ? "bg-amber-300 text-zinc-950" : "border border-white/15"}`}>語錄</button>
          <button type="button" role="tab" aria-selected={mode === "mission"} onClick={() => setMode("mission")} className={`rounded-lg px-4 py-2 font-bold ${mode === "mission" ? "bg-amber-300 text-zinc-950" : "border border-white/15"}`}>今日任務</button>
        </div>
        {mode === "quote" ? (
          <section className="game-card p-5">
            <SocialPostCard quote={selectedQuote} format={format} />
            <div className="mt-4 flex flex-wrap gap-2">{formats.map((item) => <button key={item.value} type="button" onClick={() => setFormat(item.value)} className="rounded-lg border border-white/15 px-3 py-2 text-sm">{item.label}<span className="block text-xs opacity-70">{item.detail}</span></button>)}{downloadButton}</div>
          </section>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
            <section className="game-card p-4">
              <label className="text-sm font-bold text-emerald-100">搜尋公開任務<div className="relative mt-2"><MagnifyingGlass className="absolute left-3 top-3 size-4" /><input aria-label="搜尋公開任務" value={query} onChange={(event) => { setQuery(event.target.value); if (custom) setCustom(null); }} className="field-control pl-9" placeholder="名稱、目標、獎勵或步驟" /></div></label>
              <FilterRow label="任務類型" value={missionType} onChange={(value) => { setMissionType(value as MissionFilter); setCustom(null); }} options={[{ value: "all", label: "全部" }, ...socialMissionTypes]} />
              <FilterRow label="成長分類" value={category} onChange={(value) => { setCategory(value as SocialMissionCategory | "all"); setCustom(null); }} options={[{ value: "all", label: "全部" }, ...socialMissionCategories.map((value) => ({ value, label: value }))]} />
              <p className="mt-3 text-xs text-zinc-400">目前找到 {missions.length} 則公開任務</p>
              <MissionList missions={missions} selectedId={selectedId} onSelect={(id) => { setCustom(null); setSelectedId(id); }} />
              <CustomMissionEditor mission={custom ?? createCustom(selected)} onChange={updateCustom} />
            </section>
            <section className="game-card min-w-0 p-4">
              <div className="flex flex-wrap gap-2">{formats.map((item) => <button key={item.value} type="button" onClick={() => setFormat(item.value)} className="rounded-lg border border-white/15 px-3 py-2 text-sm">{item.label}<span className="block text-xs opacity-70">{item.detail}</span></button>)}</div>
              <div className="mt-5 overflow-hidden rounded-lg bg-black/25 p-3"><div className="social-post-stage" style={{ aspectRatio: ratio }}><div className="social-post-scale"><SocialPostCard mission={selected} format={format} /></div></div></div>
              {!valid ? <p role="status" className="mt-3 text-sm text-amber-100">請填寫 RPG 名稱、現實目標、完成條件與成長獎勵後再分享。</p> : null}
              <div className="mt-4 grid gap-2 sm:grid-cols-4">
                <button type="button" onClick={chooseAnother} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 font-bold"><Shuffle className="size-4" />換一個任務</button>
                <button type="button" onClick={() => void copy()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 font-bold"><Copy className="size-4" />複製貼文文案</button>
                <a href={`/social-studio/preview?type=mission&mission=${encodeURIComponent(selected.id)}&format=${format}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-amber-300/40 px-3 font-bold text-amber-100"><Sparkle className="size-4" />純預覽頁</a>
                {downloadButton}
              </div>
              {notice ? <p role="status" className="mt-3 text-sm text-emerald-200">{notice}</p> : null}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}


