"use client";

import { useMemo, useState } from "react";
import { BookmarkSimple, Heart, Plus, Play, X } from "@phosphor-icons/react";
import type { AppTab } from "@/components/BottomNav";
import { QuestCard } from "@/components/QuestCard";
import { QuestForm } from "@/components/QuestForm";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { microAdventures } from "@/data/microAdventures";
import { categoryLabels } from "@/data/labels";
import { getQuestGuildQuests, type QuestGuildSection } from "@/lib/questSchedule";
import type { Quest, QuestDraft } from "@/types";

const sections: Array<{ id: QuestGuildSection; label: string; empty: string }> = [
  { id: "today", label: "今日", empty: "今天沒有到期或每日任務。" }, { id: "inProgress", label: "進行中", empty: "沒有進行中的支線任務。" }, { id: "upcoming", label: "即將到期", empty: "未來七天沒有任務到期。" }, { id: "main", label: "主線任務", empty: "建立一個主線任務，開始拆解大型目標。" }, { id: "completed", label: "已完成", empty: "完成的任務會在這裡保留成長紀錄。" }, { id: "all", label: "全部任務", empty: "新增第一個任務，開始你的冒險。" }
];

export function QuestGuild({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  const { state, addQuest, updateQuest, deleteQuest, completeQuest, toggleFavoriteAdventure, toggleSavedAdventure, selectAdventure } = useLifeQuest();
  const [activeSection, setActiveSection] = useState<QuestGuildSection>("today");
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const quests = useMemo(() => getQuestGuildQuests(state.quests, activeSection), [activeSection, state.quests]);
  const savedAdventures = state.savedAdventureIds.flatMap((id) => microAdventures.filter((adventure) => adventure.id === id));
  const favoriteAdventures = state.favoriteAdventureIds.flatMap((id) => microAdventures.filter((adventure) => adventure.id === id));
  const currentSection = sections.find((section) => section.id === activeSection)!;
  const closeForm = () => { setFormOpen(false); setEditingQuest(null); };
  const submit = (draft: QuestDraft) => { if (editingQuest) updateQuest(editingQuest.id, draft); else addQuest(draft); closeForm(); };
  const startAdventure = (id: string) => { selectAdventure(id); onNavigate("home"); };
  return <div className="space-y-5"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-emerald-200">Quest Guild</p><h1 className="mt-1 text-3xl font-black text-zinc-50">任務公會</h1><p className="mt-2 text-sm leading-6 text-zinc-400">把今日行動、長期目標與完成紀錄放在同一張冒險地圖。</p></div><button type="button" onClick={() => { setEditingQuest(null); setFormOpen(true); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-emerald-200 active:translate-y-px"><Plus className="size-4" weight="bold" />新增任務</button></header>
    {formOpen ? <QuestForm quest={editingQuest} onSubmit={submit} onCancel={closeForm} /> : null}
    <section className="game-card p-4 sm:p-5"><div className="flex flex-wrap gap-2" role="tablist" aria-label="任務篩選">{sections.map((section) => <button key={section.id} type="button" role="tab" aria-selected={activeSection === section.id} onClick={() => setActiveSection(section.id)} className={`rounded-lg px-3 py-2 text-sm font-bold transition active:translate-y-px ${activeSection === section.id ? "bg-emerald-300 text-zinc-950" : "border border-white/10 text-zinc-300 hover:border-emerald-300/30"}`}>{section.label}</button>)}</div><div className="mt-5"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black text-zinc-50">{currentSection.label}</h2><span className="text-sm font-bold text-emerald-100">{quests.length} 項</span></div>{quests.length ? <div className="mt-4 grid gap-3 xl:grid-cols-2">{quests.map((quest) => <QuestCard key={quest.id} quest={quest} featured={quest.type === "main"} onComplete={completeQuest} onEdit={(item) => { setEditingQuest(item); setFormOpen(true); }} onDelete={deleteQuest} />)}</div> : <div className="mt-4 rounded-lg bg-white/[0.04] p-5 text-sm leading-6 text-zinc-400">{currentSection.empty}</div>}</div></section>
    <section className="grid gap-4 lg:grid-cols-2" aria-label="已收藏的微冒險"><AdventureList title="稍後清單" empty="把想做的微冒險存到這裡。" adventures={savedAdventures} getSecondaryAction={(id) => ({ label: "移出清單", onClick: () => toggleSavedAdventure(id) })} onStart={startAdventure} /><AdventureList title="收藏冒險" empty="收藏喜歡的微冒險，隨時回來完成。" adventures={favoriteAdventures} getSecondaryAction={(id) => ({ label: state.savedAdventureIds.includes(id) ? "移出清單" : "加入稍後", onClick: () => toggleSavedAdventure(id) })} onStart={startAdventure} onRemoveFavorite={toggleFavoriteAdventure} /></section>
  </div>;
}

function AdventureList({ title, empty, adventures, onStart, getSecondaryAction, onRemoveFavorite }: { title: string; empty: string; adventures: typeof microAdventures; onStart: (id: string) => void; getSecondaryAction: (adventureId: string) => { label: string; onClick: () => void }; onRemoveFavorite?: (id: string) => void; }) { return <section className="game-card p-5"><div className="flex items-center gap-2"><BookmarkSimple className="size-5 text-emerald-200" weight="duotone" /><h2 className="text-lg font-black text-zinc-50">{title}</h2></div>{adventures.length === 0 ? <p className="mt-4 text-sm leading-6 text-zinc-400">{empty}</p> : <div className="mt-4 space-y-3">{adventures.map((adventure) => { const secondary = getSecondaryAction(adventure.id); return <article key={adventure.id} className="rounded-xl bg-white/[.04] p-3"><h3 className="font-bold text-zinc-100">{adventure.title}</h3><p className="mt-1 text-sm leading-5 text-zinc-400">{adventure.description}</p><p className="mt-2 text-xs text-emerald-100">{adventure.times[0] === "60" ? "1 小時" : `${adventure.times[0]} 分鐘`} · {categoryLabels[adventure.category]} · {adventure.difficulty}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => onStart(adventure.id)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-300 px-3 py-2 text-xs font-bold text-zinc-950"><Play className="size-3.5" weight="fill" />開始</button>{onRemoveFavorite ? <button type="button" onClick={() => onRemoveFavorite(adventure.id)} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10"><Heart className="size-4" weight="fill" />取消收藏</button> : null}<button type="button" onClick={secondary.onClick} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10"><X className="size-4" />{secondary.label}</button></div></article>; })}</div>}</section>; }
