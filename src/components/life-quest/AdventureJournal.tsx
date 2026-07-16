"use client";

import { useState } from "react";
import { BookmarkSimple, Fire, Trash } from "@phosphor-icons/react";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { quoteCategoryLabels } from "@/data/adventureQuotes";

export function AdventureJournal() {
  const { state, removeSavedQuote } = useLifeQuest();
  const [tab, setTab] = useState<"quotes" | "milestones">("quotes");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const savedQuotes = [...state.savedQuotes].sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  const milestones = state.achievements.filter((achievement) => achievement.unlocked);
  return <section className="game-card p-5" aria-labelledby="adventure-journal-title">
    <div className="flex items-center gap-2"><BookmarkSimple className="size-5 text-emerald-200" weight="duotone" /><div><h2 id="adventure-journal-title" className="text-xl font-black text-zinc-50">冒險手札</h2><p className="mt-1 text-sm text-zinc-400">把值得記住的完成時刻收進旅程。</p></div></div>
    <div className="mt-4 flex gap-2" role="tablist" aria-label="冒險手札內容">
      <button type="button" role="tab" aria-selected={tab === "quotes"} onClick={() => setTab("quotes")} className={`rounded-lg px-3 py-2 text-sm font-bold ${tab === "quotes" ? "bg-emerald-300 text-zinc-950" : "border border-white/10 text-zinc-300"}`}>收藏語錄</button>
      <button type="button" role="tab" aria-selected={tab === "milestones"} onClick={() => setTab("milestones")} className={`rounded-lg px-3 py-2 text-sm font-bold ${tab === "milestones" ? "bg-emerald-300 text-zinc-950" : "border border-white/10 text-zinc-300"}`}>里程碑</button>
    </div>
    {tab === "quotes" ? <div className="mt-4 space-y-3" role="tabpanel">
      {savedQuotes.length ? savedQuotes.map((quote) => <article key={quote.id} className="rounded-xl border border-white/10 bg-zinc-950/50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-emerald-200">{quoteCategoryLabels[quote.category]}</p><blockquote className="mt-2 font-bold leading-6 text-zinc-100">「{quote.text}」</blockquote></div><button type="button" aria-label="刪除收藏語錄" onClick={() => setConfirmId(quote.id)} className="shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-red-300/10 hover:text-red-200"><Trash className="size-4" /></button></div><p className="mt-3 text-xs leading-5 text-zinc-400">{new Intl.DateTimeFormat("zh-TW", { dateStyle: "medium" }).format(new Date(quote.savedAt))}{quote.sourceTitle ? ` ｜ ${quote.sourceTitle}` : ""}{quote.location?.name ? ` ｜ ${quote.location.name}` : ""}</p>{confirmId === quote.id ? <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-300/20 bg-red-300/5 p-2"><p className="mr-auto text-xs text-red-100">確定移除這則收藏？</p><button type="button" onClick={() => { removeSavedQuote(quote.id); setConfirmId(null); }} className="rounded-md bg-red-300 px-2 py-1 text-xs font-bold text-zinc-950">移除</button><button type="button" onClick={() => setConfirmId(null)} className="rounded-md px-2 py-1 text-xs font-bold text-zinc-200">取消</button></div> : null}</article>) : <p className="rounded-xl bg-white/[0.04] p-4 text-sm leading-6 text-zinc-400">你還沒有收藏語錄。完成重要任務時，把想記住的話收進手札吧。</p>}
    </div> : <div className="mt-4 space-y-3" role="tabpanel">{milestones.length ? <><div className="rounded-xl bg-white/[0.04] p-4 text-sm text-zinc-300"><Fire className="mr-2 inline size-4 text-amber-200" weight="fill" />目前連續完成 {state.streak.current} 天，最長紀錄 {state.streak.longest} 天。</div>{milestones.map((item) => <article key={item.id} className="rounded-xl border border-white/10 bg-zinc-950/50 p-4"><p className="font-bold text-zinc-100">{item.title}</p><p className="mt-1 text-sm text-zinc-400">{item.description}</p></article>)}</> : <p className="rounded-xl bg-white/[0.04] p-4 text-sm leading-6 text-zinc-400">尚未解鎖里程碑。完成任務與探索地圖後，新的紀錄會在這裡出現。</p>}</div>}
  </section>;
}
