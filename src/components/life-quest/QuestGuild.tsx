"use client";

import { BookmarkSimple, Heart, Play, X } from "@phosphor-icons/react";
import type { AppTab } from "@/components/BottomNav";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { microAdventures } from "@/data/microAdventures";
import { categoryLabels } from "@/data/labels";

export function QuestGuild({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  const { state, toggleFavoriteAdventure, toggleSavedAdventure, selectAdventure } = useLifeQuest();
  const savedAdventures = state.savedAdventureIds.flatMap((id) => microAdventures.filter((adventure) => adventure.id === id));
  const favoriteAdventures = state.favoriteAdventureIds.flatMap((id) => microAdventures.filter((adventure) => adventure.id === id));
  const startAdventure = (id: string) => { selectAdventure(id); onNavigate("home"); };

  return <div className="space-y-5">
    <header><p className="text-sm font-semibold text-emerald-200">Quest Guild</p><h1 className="mt-1 text-3xl font-black text-zinc-50">任務公會</h1><p className="mt-2 text-sm text-zinc-400">收藏想再做的事，或先存到稍後清單。</p></header>
    <section className="grid gap-4 lg:grid-cols-2" aria-label="小冒險偏好">
      <AdventureList title="稍後再做" empty="還沒有加入稍後的小冒險。" adventures={savedAdventures} getSecondaryAction={(id) => ({ label: "從稍後移除", ariaLabel: "從稍後清單移除", active: true, onClick: () => toggleSavedAdventure(id) })} onStart={startAdventure} />
      <AdventureList title="我的收藏" empty="還沒有收藏的小冒險。" adventures={favoriteAdventures} getSecondaryAction={(id) => {
        const saved = state.savedAdventureIds.includes(id);
        return { label: saved ? "已加入稍後" : "加入稍後", ariaLabel: saved ? "從稍後清單移除" : "加入稍後清單", active: saved, onClick: () => toggleSavedAdventure(id) };
      }} onStart={startAdventure} onRemoveFavorite={toggleFavoriteAdventure} />
    </section>
  </div>;
}

function AdventureList({ title, empty, adventures, onStart, getSecondaryAction, onRemoveFavorite }: {
  title: string;
  empty: string;
  adventures: typeof microAdventures;
  onStart: (id: string) => void;
  getSecondaryAction: (adventureId: string) => { label: string; ariaLabel: string; active: boolean; onClick: () => void };
  onRemoveFavorite?: (id: string) => void;
}) {
  return <section className="game-card p-5"><div className="flex items-center gap-2"><BookmarkSimple className="size-5 text-emerald-200" weight="duotone" /><h2 className="text-lg font-black text-zinc-50">{title}</h2></div>{adventures.length === 0 ? <p className="mt-4 text-sm leading-6 text-zinc-400">{empty}</p> : <div className="mt-4 space-y-3">{adventures.map((adventure) => {
    const secondary = getSecondaryAction(adventure.id);
    return <article key={adventure.id} className="rounded-xl bg-white/[.04] p-3"><h3 className="font-bold text-zinc-100">{adventure.title}</h3><p className="mt-1 text-sm leading-5 text-zinc-400">{adventure.description}</p><p className="mt-2 text-xs text-emerald-100">{adventure.times[0] === "60" ? "約 1 小時" : `${adventure.times[0]} 分鐘`} · {categoryLabels[adventure.category]} · {adventure.difficulty}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => onStart(adventure.id)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-300 px-3 py-2 text-xs font-bold text-zinc-950"><Play className="size-3.5" weight="fill" />開始冒險</button>{onRemoveFavorite ? <button type="button" onClick={() => onRemoveFavorite(adventure.id)} aria-label="取消收藏" className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10"><Heart className="size-4" weight="fill" />取消收藏</button> : null}<button type="button" onClick={secondary.onClick} aria-label={secondary.ariaLabel} className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold hover:bg-white/10 ${secondary.active ? "text-emerald-200" : "text-zinc-300"}`}>{secondary.active ? <X className="size-4" /> : <BookmarkSimple className="size-4" />}{secondary.label}</button></div></article>;
  })}</div>}</section>;
}
