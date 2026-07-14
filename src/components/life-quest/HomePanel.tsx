"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Clock, Lightning, Quotes, Sparkle } from "@phosphor-icons/react";
import { type AppTab } from "@/components/BottomNav";
import { ExpBar } from "@/components/ExpBar";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { LifeMomentForm } from "@/components/life-quest/LifeMomentForm";
import { WeeklyReflection } from "@/components/life-quest/WeeklyReflection";
import { microAdventures, type AvailableTime, type Mood } from "@/data/microAdventures";
import { reflectionQuotes } from "@/data/quotes";
import { categoryLabels } from "@/data/labels";
import { isToday } from "@/lib/utils";

const moodOptions: Array<{ value: Mood; label: string }> = [
  { value: "bored", label: "有點無聊" }, { value: "tired", label: "需要充電" },
  { value: "good", label: "狀態不錯" }, { value: "out", label: "想出門" },
  { value: "social", label: "想找人聊聊" }, { value: "quiet", label: "想安靜一下" }
];
const timeOptions: Array<{ value: AvailableTime; label: string }> = [
  { value: "5", label: "5 分鐘" }, { value: "15", label: "15 分鐘" },
  { value: "30", label: "30 分鐘" }, { value: "60", label: "1 小時" }
];

export function HomePanel({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  const { state, completeMicroAdventure } = useLifeQuest();
  const [mood, setMood] = useState<Mood>("bored");
  const [time, setTime] = useState<AvailableTime>("15");
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [isMomentFormOpen, setIsMomentFormOpen] = useState(false);
  const [savedAdventureId, setSavedAdventureId] = useState<string | null>(null);
  const profile = state.profile;

  const recommendations = useMemo(() => {
    const score = (id: string, moods: Mood[], times: AvailableTime[], category: string, occupation: string) =>
      (moods.includes(mood) ? 4 : 0) + (times.includes(time) ? 4 : 0) +
      (profile?.focus === category ? 2 : 0) + (profile?.focuses.includes(category as never) ? 1 : 0) +
      (profile?.occupation === occupation || occupation === "general" ? 1 : 0) + (id.length % 3) / 10;
    return microAdventures.slice().sort((a, b) => score(b.id, b.moods, b.times, b.category, b.occupation) - score(a.id, a.moods, a.times, a.category, a.occupation));
  }, [mood, time, profile]);
  const adventure = recommendations.length > 0
    ? recommendations[recommendationIndex % recommendations.length]
    : microAdventures[0];

  const quote = useMemo(() => {
    const matching = reflectionQuotes.filter((item) => item.moods.includes(mood) && item.categories.includes(profile?.focus ?? "exploration"));
    const fallback = reflectionQuotes.filter((item) => item.moods.includes(mood));
    const choices = matching.length ? matching : fallback.length ? fallback : reflectionQuotes;
    return choices.length > 0 ? choices[recommendationIndex % choices.length] : undefined;
  }, [mood, profile?.focus, recommendationIndex]);

  if (!profile || !adventure || !quote) return null;
  const recentMoments = state.lifeMoments.slice().sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 3);

  function updateMood(next: Mood) { setMood(next); setRecommendationIndex(0); }
  function updateTime(next: AvailableTime) { setTime(next); setRecommendationIndex(0); }
  function saveAdventure(note: string, momentMood: "happier" | "relaxed" | "refreshed" | "unchanged" | "trySomethingElse") {
    if (savedAdventureId !== adventure.id) completeMicroAdventure(adventure, note, momentMood);
    setSavedAdventureId(adventure.id); setIsMomentFormOpen(false);
  }

  return <main className="mx-auto max-w-4xl space-y-6 pb-8">
    <header className="px-1 pt-3">
      <p className="text-sm font-semibold tracking-wide text-emerald-200">今天，{profile.name}</p>
      <h1 className="mt-2 max-w-2xl text-4xl font-black leading-[1.05] tracking-[-0.045em] text-zinc-50 sm:text-5xl">給生活一個可以完成的小任務。</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">從現在的感受與可用時間出發；不必等狀態完美，先做一件剛好的事。</p>
    </header>

    <section className="game-card p-4 sm:p-5" aria-labelledby="check-in-heading">
      <h2 id="check-in-heading" className="text-lg font-bold text-zinc-50">現在的你，比較接近哪種狀態？</h2>
      <div className="mt-3 flex flex-wrap gap-2">{moodOptions.map((option) => <button key={option.value} type="button" onClick={() => updateMood(option.value)} className={`rounded-full border px-3 py-2 text-sm font-semibold transition active:scale-[.98] ${mood === option.value ? "border-emerald-200 bg-emerald-300 text-zinc-950" : "border-white/10 bg-white/[.03] text-zinc-200 hover:border-emerald-200/50 hover:bg-emerald-300/10"}`}>{option.label}</button>)}</div>
      <div className="mt-5 flex items-center gap-2 text-sm font-bold text-zinc-50"><Clock className="size-5 text-emerald-200" weight="duotone" />你有多少時間？</div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{timeOptions.map((option) => <button key={option.value} type="button" onClick={() => updateTime(option.value)} className={`rounded-xl border px-3 py-3 text-sm font-semibold transition active:scale-[.98] ${time === option.value ? "border-emerald-200 bg-emerald-300 text-zinc-950" : "border-white/10 bg-zinc-950/40 text-zinc-200 hover:border-emerald-200/50 hover:bg-emerald-300/10"}`}>{option.label}</button>)}</div>
    </section>

    <section className="relative overflow-hidden rounded-2xl border border-emerald-200/25 bg-[linear-gradient(135deg,rgba(52,211,153,.18),rgba(24,24,27,.9)_55%)] p-5 shadow-[0_20px_60px_rgba(3,20,15,.3)]" aria-labelledby="adventure-heading">
      <Sparkle className="absolute right-4 top-4 size-9 text-emerald-200/40" weight="fill" />
      <p className="text-sm font-semibold text-emerald-100">為你的此刻挑選</p><h2 id="adventure-heading" className="mt-2 max-w-md text-2xl font-black tracking-[-.02em] text-zinc-50">{adventure.title}</h2>
      <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-200">{adventure.description}</p>
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => setIsMomentFormOpen(true)} disabled={savedAdventureId === adventure.id} className="rounded-xl bg-emerald-300 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-200 disabled:opacity-60">{savedAdventureId === adventure.id ? "已記錄這次冒險" : "完成並記錄"}</button><button type="button" onClick={() => { setRecommendationIndex((value) => value + 1); setIsMomentFormOpen(false); }} className="rounded-xl border border-emerald-200/50 px-4 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/10">換一個提案</button></div>
    </section>

    <figure className="game-card p-5" aria-label="今日反思引言"><Quotes className="size-7 text-emerald-200" weight="fill" /><blockquote className="mt-3 max-w-2xl text-lg font-semibold leading-8 text-zinc-100">「{quote.text}」</blockquote><figcaption className="mt-3 text-sm text-zinc-400">— {quote.author}{quote.work ? `，《${quote.work}》` : ""}{quote.sourceUrl ? <a className="ml-2 text-emerald-200 underline underline-offset-4 hover:text-emerald-100" href={quote.sourceUrl} target="_blank" rel="noreferrer">查看來源</a> : null}{quote.note ? <span className="mt-1 block text-xs text-zinc-500">{quote.note}</span> : null}</figcaption></figure>

    <section className="game-card p-4 sm:p-5" aria-labelledby="moments-heading"><div className="flex items-baseline justify-between gap-3"><div><h2 id="moments-heading" className="text-xl font-black text-zinc-50">最近的生活片刻</h2><p className="mt-1 text-sm text-zinc-400">你完成的每一步，都會留在這裡。</p></div><button type="button" onClick={() => onNavigate("quests")} className="text-sm font-bold text-emerald-200 hover:text-emerald-100">查看任務</button></div>{recentMoments.length ? <div className="mt-4 space-y-2">{recentMoments.map((item) => <div key={item.id} className="flex gap-3 rounded-xl bg-white/[.04] px-3 py-3"><CheckCircle className="mt-.5 size-5 shrink-0 text-emerald-200" weight="fill" /><div><p className="text-sm font-bold text-zinc-100">{item.adventureName}</p>{item.note ? <p className="mt-1 text-sm text-zinc-300">{item.note}</p> : null}<p className="mt-1 text-xs text-zinc-500">{isToday(item.completedAt) ? "今天" : new Date(item.completedAt).toLocaleDateString("zh-TW")}</p></div></div>)}</div> : <p className="mt-4 rounded-xl bg-white/[.04] px-4 py-5 text-sm leading-6 text-zinc-300">完成第一個微冒險後，這裡會成為你的生活足跡。</p>}</section>
    <WeeklyReflection lifeMoments={state.lifeMoments} onFindAdventure={() => document.getElementById("adventure-heading")?.scrollIntoView({ behavior: "smooth", block: "center" })} />
    <section className="game-card flex flex-wrap items-center justify-between gap-4 p-4" aria-label="角色進度">
      <div className="min-w-[14rem] flex-1"><p className="text-sm font-bold text-zinc-100">本週累積的角色進度</p><p className="mt-1 text-xs text-zinc-400">完成任務與記錄生活片刻都會累積 EXP。</p><div className="mt-3"><ExpBar exp={profile.exp} /></div></div>
      <div className="flex items-center gap-3"><Lightning className="size-5 text-emerald-200" weight="fill" /><span className="text-sm font-bold text-emerald-100">{profile.exp} EXP</span><button type="button" onClick={() => onNavigate("skills")} className="rounded-lg border border-emerald-300/25 px-3 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-300/10">前往{categoryLabels[profile.focus]}技能</button></div>
    </section>
    {isMomentFormOpen ? <LifeMomentForm adventureName={adventure.title} onSave={saveAdventure} onClose={() => setIsMomentFormOpen(false)} /> : null}
  </main>;
}
