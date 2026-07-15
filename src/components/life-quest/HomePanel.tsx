"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BookmarkSimple, CheckCircle, Clock, Heart, Prohibit, Shuffle, Sparkle } from "@phosphor-icons/react";
import type { AppTab } from "@/components/BottomNav";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { LifeMomentForm } from "@/components/life-quest/LifeMomentForm";
import { microAdventures, type AvailableTime, type Mood } from "@/data/microAdventures";
import { getNextDisplayedAdventureId, resolveDisplayedAdventure } from "@/lib/displayedAdventure";
import { getAdventureRecommendations } from "@/lib/recommendations";
import { isToday } from "@/lib/utils";

const moods: Array<{ value: Mood; label: string }> = [
  { value: "bored", label: "有點無聊" },
  { value: "tired", label: "有點累" },
  { value: "good", label: "心情不錯" },
  { value: "out", label: "想出門" },
  { value: "social", label: "想找人" },
  { value: "quiet", label: "想安靜一下" }
];
const times: AvailableTime[] = ["5", "15", "30", "60"];

function ChoiceButton({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-xl border px-3 py-2 text-sm font-semibold transition active:scale-[.98] ${active ? "border-emerald-200 bg-emerald-300 text-zinc-950" : "border-white/10 bg-white/[.03] text-zinc-200 hover:border-emerald-200/50"}`}>{children}</button>;
}

function RecommendationReasons({ reasons }: { reasons: string[] }) {
  if (reasons.length === 0) return null;
  return <ul className="mt-4 flex flex-wrap gap-2" aria-label="推薦原因">{reasons.map((reason) => <li key={reason} className="rounded-md bg-emerald-200/10 px-2.5 py-1 text-xs text-emerald-100">{reason}</li>)}</ul>;
}

export function HomePanel({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  const { state, completeMicroAdventure, toggleFavoriteAdventure, toggleSavedAdventure, dismissAdventure, showAdventure, clearSelectedAdventure } = useLifeQuest();
  const [mood, setMood] = useState<Mood>("bored");
  const [time, setTime] = useState<AvailableTime>("15");
  const [displayedAdventureId, setDisplayedAdventureId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const completedTodayIds = useMemo(() => state.lifeMoments.filter((moment) => moment.adventureId && (moment.rewardGranted ?? true) && isToday(moment.completedAt)).map((moment) => moment.adventureId as string), [state.lifeMoments]);
  const momentsToday = useMemo(() => state.lifeMoments.filter((moment) => isToday(moment.completedAt)).length, [state.lifeMoments]);
  const shownHistory = useMemo(() => state.recommendationHistory.filter((item) => item.action === "shown").slice(-8), [state.recommendationHistory]);
  const recentlyShownIds = useMemo(() => shownHistory.map((item) => item.adventureId), [shownHistory]);
  const recentlyShownCategories = useMemo(() => shownHistory.flatMap((item) => microAdventures.filter((adventure) => adventure.id === item.adventureId).map((adventure) => adventure.category)), [shownHistory]);

  const recommendationContext = useMemo(() => ({
    focuses: state.profile?.focuses, occupation: state.profile?.occupation,
    favoriteAdventureIds: state.favoriteAdventureIds, savedAdventureIds: state.savedAdventureIds,
    dismissedAdventures: state.dismissedAdventures, recentlyShownIds, recentlyShownCategories, completedTodayIds
  }), [completedTodayIds, recentlyShownCategories, recentlyShownIds, state.dismissedAdventures, state.favoriteAdventureIds, state.profile?.focuses, state.profile?.occupation, state.savedAdventureIds]);
  const recommendations = useMemo(() => getAdventureRecommendations(microAdventures, { ...recommendationContext, mood, time }), [mood, recommendationContext, time]);
  const selectedAdventure = state.selectedAdventureId ? recommendations.find((item) => item.adventure.id === state.selectedAdventureId) : undefined;
  const displayedRecommendation = selectedAdventure ?? resolveDisplayedAdventure(recommendations, displayedAdventureId);
  const adventure = displayedRecommendation?.adventure;

  useEffect(() => {
    if (!state.selectedAdventureId || !selectedAdventure) return;
    setDisplayedAdventureId(selectedAdventure.adventure.id);
    clearSelectedAdventure();
  }, [clearSelectedAdventure, selectedAdventure, state.selectedAdventureId]);

  useEffect(() => {
    if (adventure) showAdventure(adventure.id);
  }, [adventure, showAdventure]);

  if (!state.profile || !adventure || !displayedRecommendation) return null;
  const completed = completedTodayIds.includes(adventure.id);
  const isFavorite = state.favoriteAdventureIds.includes(adventure.id);
  const isSaved = state.savedAdventureIds.includes(adventure.id);
  const choose = (nextMood: Mood, nextTime: AvailableTime) => {
    const nextRecommendations = getAdventureRecommendations(microAdventures, { ...recommendationContext, mood: nextMood, time: nextTime });
    setMood(nextMood);
    setTime(nextTime);
    setDisplayedAdventureId(getNextDisplayedAdventureId(nextRecommendations, adventure.id));
    setFormOpen(false);
  };
  const next = () => { setDisplayedAdventureId(getNextDisplayedAdventureId(recommendations, adventure.id)); setFormOpen(false); };
  const finish = (note: string, momentMood: "happier" | "relaxed" | "refreshed" | "unchanged" | "trySomethingElse") => { completeMicroAdventure(adventure.id, adventure, note, momentMood); setFormOpen(false); };

  return <main className="mx-auto max-w-4xl space-y-6 pb-8">
    <header className="px-1 pt-3"><p className="text-sm font-semibold tracking-wide text-emerald-200">Life Quest · {state.profile.name}</p><h1 className="mt-2 text-4xl font-black leading-[1.05] tracking-[-.045em] text-zinc-50 sm:text-5xl">今天，留一點時間給自己。</h1><p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">依照現在的心情與空檔，找一個剛好的小冒險。</p></header>
    <section className="game-card p-4 sm:p-5"><h2 className="text-lg font-bold text-zinc-50">你現在感覺如何？</h2><div className="mt-3 flex flex-wrap gap-2">{moods.map((item) => <ChoiceButton key={item.value} active={mood === item.value} onClick={() => choose(item.value, time)}>{item.label}</ChoiceButton>)}</div><div className="mt-5 flex items-center gap-2 text-sm font-bold text-zinc-50"><Clock className="size-5 text-emerald-200" weight="duotone" />你有多少時間？</div><div className="mt-3 flex flex-wrap gap-2">{times.map((item) => <ChoiceButton key={item} active={time === item} onClick={() => choose(mood, item)}>{item === "60" ? "約 1 小時" : `${item} 分鐘`}</ChoiceButton>)}</div></section>
    <section className="relative overflow-hidden rounded-2xl border border-emerald-200/25 bg-[linear-gradient(135deg,rgba(52,211,153,.18),rgba(24,24,27,.9)_55%)] p-5 shadow-[0_20px_60px_rgba(3,20,15,.3)]"><Sparkle className="absolute right-4 top-4 size-9 text-emerald-200/40" weight="fill" /><p className="text-sm font-semibold text-emerald-100">為你推薦的小冒險</p><h2 className="mt-2 max-w-md text-2xl font-black tracking-[-.02em] text-zinc-50">{adventure.title}</h2><p className="mt-2 max-w-lg text-sm leading-6 text-zinc-200">{adventure.description}</p><RecommendationReasons reasons={displayedRecommendation.reasons} /><div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => setFormOpen(true)} disabled={completed} className="rounded-xl bg-emerald-300 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60">{completed ? "今天已完成" : "我完成了"}</button><button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200/50 px-4 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/10"><Shuffle className="size-4" />換一個小冒險</button></div><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => toggleFavoriteAdventure(adventure.id)} aria-label={isFavorite ? "取消收藏此小冒險" : "收藏此小冒險"} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10"><Heart className="size-4 text-emerald-200" weight={isFavorite ? "fill" : "regular"} />{isFavorite ? "已收藏" : "收藏"}</button><button type="button" onClick={() => toggleSavedAdventure(adventure.id)} aria-label={isSaved ? "從稍後清單移除" : "稍後再做此小冒險"} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10"><BookmarkSimple className="size-4 text-emerald-200" weight={isSaved ? "fill" : "regular"} />{isSaved ? "已加入稍後" : "稍後再做"}</button><button type="button" onClick={() => { dismissAdventure(adventure.id); next(); }} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10"><Prohibit className="size-4" />暫時不想做</button></div></section>
    <section className="game-card flex items-center gap-3 p-4"><CheckCircle className="size-5 text-emerald-200" weight="fill" /><p className="text-sm text-zinc-300">今天留下了 {momentsToday} 個片段</p><button type="button" onClick={() => onNavigate("quests")} className="ml-auto shrink-0 text-sm font-bold text-emerald-200 hover:text-emerald-100">查看任務</button></section>
    {formOpen ? <LifeMomentForm adventureName={adventure.title} onSave={finish} onClose={() => setFormOpen(false)} /> : null}
  </main>;
}
