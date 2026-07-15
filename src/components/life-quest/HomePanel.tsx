"use client";

import { useEffect, useMemo, useState } from "react";
import { BookmarkSimple, CheckCircle, Clock, Heart, Prohibit, Shuffle, Sparkle } from "@phosphor-icons/react";
import type { AppTab } from "@/components/BottomNav";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { LifeMomentForm } from "@/components/life-quest/LifeMomentForm";
import { microAdventures, type AvailableTime, type Mood } from "@/data/microAdventures";
import { getAdventureRecommendations } from "@/lib/recommendations";
import { isToday } from "@/lib/utils";

const moods: Array<{ value: Mood; label: string }> = [
  { value: "bored", label: "有點無聊" }, { value: "tired", label: "需要充電" }, { value: "good", label: "狀態不錯" },
  { value: "out", label: "想出門" }, { value: "social", label: "想互動" }, { value: "quiet", label: "想安靜一下" }
];
const times: AvailableTime[] = ["5", "15", "30", "60"];

function Choice({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-xl border px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 active:scale-[.98] ${active ? "border-emerald-200 bg-emerald-300 text-zinc-950" : "border-white/10 bg-white/[.03] text-zinc-200 hover:border-emerald-200/50"}`}>{children}</button>;
}

function RecommendationReasons({ reasons }: { reasons: string[] }) {
  if (!reasons.length) return null;
  return <ul className="mt-4 flex flex-wrap gap-2" aria-label="推薦原因">{reasons.map((reason) => <li key={reason} className="rounded-md bg-emerald-200/10 px-2.5 py-1 text-xs text-emerald-100">{reason}</li>)}</ul>;
}

export function HomePanel({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  const { state, completeMicroAdventure, toggleFavoriteAdventure, toggleSavedAdventure, dismissAdventure, showAdventure, clearSelectedAdventure } = useLifeQuest();
  const [mood, setMood] = useState<Mood>("bored");
  const [time, setTime] = useState<AvailableTime>("15");
  const [offset, setOffset] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const completedTodayIds = useMemo(() => state.lifeMoments.filter((item) => item.adventureId && (item.rewardGranted ?? true) && isToday(item.completedAt)).map((item) => item.adventureId as string), [state.lifeMoments]);
  const recentIds = useMemo(() => state.recommendationHistory.filter((item) => item.action === "shown").slice(-12).map((item) => item.adventureId), [state.recommendationHistory]);
  const recommendations = useMemo(() => getAdventureRecommendations(microAdventures, { mood, time, focuses: state.profile?.focuses, occupation: state.profile?.occupation, favoriteAdventureIds: state.favoriteAdventureIds, savedAdventureIds: state.savedAdventureIds, dismissedAdventures: state.dismissedAdventures, recentlyShownIds: recentIds, completedTodayIds }), [completedTodayIds, mood, recentIds, state.dismissedAdventures, state.favoriteAdventureIds, state.profile?.focuses, state.profile?.occupation, state.savedAdventureIds, time]);
  const selected = state.selectedAdventureId ? recommendations.find((item) => item.adventure.id === state.selectedAdventureId) : undefined;
  const recommended = selected ?? recommendations[offset % Math.max(1, recommendations.length)];
  const adventure = recommended?.adventure;
  const completed = adventure ? completedTodayIds.includes(adventure.id) : false;

  useEffect(() => {
    if (!adventure) return;
    showAdventure(adventure.id);
    if (state.selectedAdventureId === adventure.id) clearSelectedAdventure();
  // The recommendation is intentionally recorded only when its identity changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adventure?.id]);

  if (!state.profile || !adventure || !recommended) return null;
  const isFavorite = state.favoriteAdventureIds.includes(adventure.id);
  const isSaved = state.savedAdventureIds.includes(adventure.id);
  const next = () => { setOffset((value) => value + 1); setFormOpen(false); };
  const finish = (note: string, momentMood: "happier" | "relaxed" | "refreshed" | "unchanged" | "trySomethingElse") => { completeMicroAdventure(adventure.id, adventure, note, momentMood); setFormOpen(false); };

  return <main className="mx-auto max-w-4xl space-y-6 pb-8">
    <header className="px-1 pt-3"><p className="text-sm font-semibold tracking-wide text-emerald-200">今日的小探索 · {state.profile.name}</p><h1 className="mt-2 text-4xl font-black leading-[1.05] tracking-[-.045em] text-zinc-50 sm:text-5xl">找一件現在就能做的小事</h1><p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">選擇你的狀態，我們會避開近期重複出現的提案。</p></header>
    <section className="game-card p-4 sm:p-5"><h2 className="text-lg font-bold text-zinc-50">你現在感覺如何？</h2><div className="mt-3 flex flex-wrap gap-2">{moods.map((item) => <Choice key={item.value} active={mood === item.value} onClick={() => { setMood(item.value); setOffset(0); }}>{item.label}</Choice>)}</div><div className="mt-5 flex items-center gap-2 text-sm font-bold text-zinc-50"><Clock className="size-5 text-emerald-200" weight="duotone" />可用時間</div><div className="mt-3 flex flex-wrap gap-2">{times.map((item) => <Choice key={item} active={time === item} onClick={() => { setTime(item); setOffset(0); }}>{item === "60" ? "約 1 小時" : `${item} 分鐘`}</Choice>)}</div></section>
    <section className="relative overflow-hidden rounded-2xl border border-emerald-200/25 bg-[linear-gradient(135deg,rgba(52,211,153,.18),rgba(24,24,27,.9)_55%)] p-5 shadow-[0_20px_60px_rgba(3,20,15,.3)]"><Sparkle className="absolute right-4 top-4 size-9 text-emerald-200/40" weight="fill" /><p className="text-sm font-semibold text-emerald-100">現在的微冒險</p><h2 className="mt-2 max-w-md text-2xl font-black tracking-[-.02em] text-zinc-50">{adventure.title}</h2><p className="mt-2 max-w-lg text-sm leading-6 text-zinc-200">{adventure.description}</p><RecommendationReasons reasons={recommended.reasons} /><div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => setFormOpen(true)} disabled={completed} className="rounded-xl bg-emerald-300 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-100 disabled:cursor-not-allowed disabled:opacity-60">{completed ? "今日已完成" : "完成並記錄"}</button><button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200/50 px-4 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/10"><Shuffle className="size-4" />換一個提案</button></div><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => toggleFavoriteAdventure(adventure.id)} aria-label={isFavorite ? "取消收藏" : "收藏此微冒險"} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/10"><Heart className="size-4 text-emerald-200" weight={isFavorite ? "fill" : "regular"} />{isFavorite ? "已收藏" : "收藏"}</button><button type="button" onClick={() => toggleSavedAdventure(adventure.id)} aria-label={isSaved ? "從稍後清單移除" : "加入稍後清單"} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/10"><BookmarkSimple className="size-4 text-emerald-200" weight={isSaved ? "fill" : "regular"} />{isSaved ? "已加入稍後" : "稍後再做"}</button><button type="button" onClick={() => { dismissAdventure(adventure.id); next(); }} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10"><Prohibit className="size-4" />不適合我</button></div></section>
    <section className="game-card flex items-center gap-3 p-4"><CheckCircle className="size-5 text-emerald-200" weight="fill" /><p className="text-sm text-zinc-300">喜歡的提案可以收藏，想晚點做就留在稍後清單。</p><button type="button" onClick={() => onNavigate("quests")} className="ml-auto shrink-0 text-sm font-bold text-emerald-200 hover:text-emerald-100">查看清單</button></section>
    {formOpen ? <LifeMomentForm adventureName={adventure.title} onSave={finish} onClose={() => setFormOpen(false)} /> : null}
  </main>;
}
