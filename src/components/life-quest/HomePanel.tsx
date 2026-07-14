"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock, Lightning, Quotes, Sparkle } from "@phosphor-icons/react";
import type { AppTab } from "@/components/BottomNav";
import { ExpBar } from "@/components/ExpBar";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { LifeMomentForm } from "@/components/life-quest/LifeMomentForm";
import { WeeklyReflection } from "@/components/life-quest/WeeklyReflection";
import { categoryLabels } from "@/data/labels";
import { microAdventures, type AvailableTime, type Mood } from "@/data/microAdventures";
import { reflectionQuotes, type ReflectionQuote } from "@/data/quotes";
import { isToday } from "@/lib/utils";

const moodOptions: Array<{ value: Mood; label: string }> = [
  { value: "bored", label: "有點無聊" }, { value: "tired", label: "有點累" },
  { value: "good", label: "心情不錯" }, { value: "out", label: "想出門" },
  { value: "social", label: "想互動" }, { value: "quiet", label: "想安靜" }
];
const timeOptions: Array<{ value: AvailableTime; label: string }> = [
  { value: "5", label: "5 分鐘" }, { value: "15", label: "15 分鐘" },
  { value: "30", label: "30 分鐘" }, { value: "60", label: "1 小時" }
];
const quoteTypeLabels: Record<ReflectionQuote["sourceType"], string> = {
  "public-domain": "公版原文翻譯", original: "Life Quest Map 原創", paraphrase: "作品主題轉述",
  movie: "電影內容", anime: "動畫內容", song: "歌曲內容"
};

function SelectionButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-xl border px-3 py-2 text-sm font-semibold transition active:scale-[.98] ${active ? "border-emerald-200 bg-emerald-300 text-zinc-950" : "border-white/10 bg-white/[.03] text-zinc-200 hover:border-emerald-200/50 hover:bg-emerald-300/10"}`}>{children}</button>;
}

function ReflectionQuoteCard({ quote }: { quote: ReflectionQuote }) {
  const [showOriginal, setShowOriginal] = useState(false);
  useEffect(() => setShowOriginal(false), [quote.id]);
  return <figure className="game-card p-5" aria-label="今日語錄">
    <Quotes className="size-7 text-emerald-200" weight="fill" />
    <blockquote className="mt-3 max-w-2xl text-lg font-semibold leading-8 text-zinc-100">「{quote.text}」</blockquote>
    <figcaption className="mt-3 text-sm text-zinc-400">
      <span>{quote.author}{quote.work ? `，《${quote.work}》` : ""}</span>
      <span className="ml-2 rounded-full border border-white/10 px-2 py-0.5 text-xs text-zinc-400">{quoteTypeLabels[quote.sourceType]}</span>
      {quote.sourceUrl ? <a className="ml-2 text-emerald-200 underline underline-offset-4 hover:text-emerald-100" href={quote.sourceUrl} target="_blank" rel="noreferrer">來源</a> : null}
      {quote.originalText ? <button type="button" className="ml-3 text-xs font-semibold text-emerald-200 underline underline-offset-4" aria-expanded={showOriginal} onClick={() => setShowOriginal((value) => !value)}>{showOriginal ? "收合原文" : "查看原文"}</button> : null}
      {showOriginal && quote.originalText ? <p className="mt-3 max-w-2xl border-l-2 border-emerald-200/40 pl-3 text-sm leading-6 text-zinc-300" lang={quote.originalLanguage === "English" ? "en" : undefined}>{quote.originalText}</p> : null}
      {quote.note ? <span className="mt-2 block text-xs text-zinc-500">{quote.note}</span> : null}
    </figcaption>
  </figure>;
}

export function HomePanel({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  const { state, completeMicroAdventure } = useLifeQuest();
  const [mood, setMood] = useState<Mood>("bored");
  const [time, setTime] = useState<AvailableTime>("15");
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [isMomentFormOpen, setIsMomentFormOpen] = useState(false);
  const profile = state.profile;
  const recommendations = useMemo(() => microAdventures.slice().sort((a, b) => {
    const score = (item: typeof a) => (item.moods.includes(mood) ? 4 : 0) + (item.times.includes(time) ? 4 : 0) + (profile?.focuses.includes(item.category) ? 2 : 0) + (item.occupation === "general" || item.occupation === profile?.occupation ? 1 : 0);
    return score(b) - score(a) || a.id.localeCompare(b.id);
  }), [mood, time, profile]);
  const adventure = recommendations.length ? recommendations[recommendationIndex % recommendations.length] : undefined;
  const quote = useMemo(() => {
    if (!adventure || reflectionQuotes.length === 0) return undefined;
    const byMoodAndCategory = reflectionQuotes.filter((item) => item.moods.includes(mood) && item.categories.includes(adventure.category));
    const byMood = reflectionQuotes.filter((item) => item.moods.includes(mood));
    const byCategory = reflectionQuotes.filter((item) => item.categories.includes(adventure.category));
    const choices = byMoodAndCategory.length ? byMoodAndCategory : byMood.length ? byMood : byCategory.length ? byCategory : reflectionQuotes;
    const seed = `${mood}|${time}|${recommendationIndex}|${adventure.id}|${adventure.category}`;
    const index = Array.from(seed).reduce((sum, character) => sum + character.charCodeAt(0), 0) % choices.length;
    return choices[index];
  }, [adventure, mood, recommendationIndex, time]);
  const completedMoment = adventure ? state.lifeMoments.find((item) => (item.adventureId === adventure.id || (!item.adventureId && item.adventureName === adventure.title)) && (item.rewardGranted ?? true) && isToday(item.completedAt)) : undefined;
  const recentMoments = state.lifeMoments.slice().sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 3);

  if (!profile || !adventure || !quote) return null;
  const resetRecommendation = () => { setRecommendationIndex(0); setIsMomentFormOpen(false); };
  const saveAdventure = (note: string, momentMood: "happier" | "relaxed" | "refreshed" | "unchanged" | "trySomethingElse") => { completeMicroAdventure(adventure.id, adventure, note, momentMood); setIsMomentFormOpen(false); };

  return <main className="mx-auto max-w-4xl space-y-6 pb-8">
    <header className="px-1 pt-3">
      <p className="text-sm font-semibold tracking-wide text-emerald-200">今天好，{profile.name}</p>
      <h1 className="mt-2 max-w-2xl text-4xl font-black leading-[1.05] tracking-[-0.045em] text-zinc-50 sm:text-5xl">為今天挑一個剛剛好的小冒險。</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">從現在的心情與時間開始，累積屬於你的 EXP。</p>
    </header>
    <section className="game-card p-4 sm:p-5" aria-labelledby="check-in-heading">
      <h2 id="check-in-heading" className="text-lg font-bold text-zinc-50">現在的心情如何？</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {moodOptions.map((option) => <SelectionButton key={option.value} active={mood === option.value} onClick={() => { setMood(option.value); resetRecommendation(); }}>{option.label}</SelectionButton>)}
      </div>
      <div className="mt-5 flex items-center gap-2 text-sm font-bold text-zinc-50"><Clock className="size-5 text-emerald-200" weight="duotone" />你有多少時間？</div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {timeOptions.map((option) => <SelectionButton key={option.value} active={time === option.value} onClick={() => { setTime(option.value); resetRecommendation(); }}>{option.label}</SelectionButton>)}
      </div>
    </section>
    <section className="relative overflow-hidden rounded-2xl border border-emerald-200/25 bg-[linear-gradient(135deg,rgba(52,211,153,.18),rgba(24,24,27,.9)_55%)] p-5 shadow-[0_20px_60px_rgba(3,20,15,.3)]" aria-labelledby="adventure-heading"><Sparkle className="absolute right-4 top-4 size-9 text-emerald-200/40" weight="fill" /><p className="text-sm font-semibold text-emerald-100">目前推薦的小冒險</p><h2 id="adventure-heading" className="mt-2 max-w-md text-2xl font-black tracking-[-.02em] text-zinc-50">{adventure.title}</h2><p className="mt-2 max-w-lg text-sm leading-6 text-zinc-200">{adventure.description}</p><div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => setIsMomentFormOpen(true)} disabled={Boolean(completedMoment)} className="rounded-xl bg-emerald-300 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60">{completedMoment ? "今天已完成" : "完成並記錄"}</button><button type="button" onClick={() => { setRecommendationIndex((value) => value + 1); setIsMomentFormOpen(false); }} className="rounded-xl border border-emerald-200/50 px-4 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/10">換一個提案</button></div>{completedMoment ? <p className="mt-3 text-xs text-emerald-100/80">今天已於 {new Date(completedMoment.completedAt).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })} 記錄並取得獎勵。</p> : null}</section>
    <ReflectionQuoteCard quote={quote} />
    <section className="game-card p-4 sm:p-5" aria-labelledby="moments-heading"><div className="flex items-baseline justify-between gap-3"><div><h2 id="moments-heading" className="text-xl font-black text-zinc-50">最近生活片刻</h2><p className="mt-1 text-sm text-zinc-400">把完成的小事留成可回看的足跡。</p></div><button type="button" onClick={() => onNavigate("quests")} className="text-sm font-bold text-emerald-200 hover:text-emerald-100">查看任務</button></div>{recentMoments.length ? <div className="mt-4 space-y-2">{recentMoments.map((item) => <div key={item.id} className="flex gap-3 rounded-xl bg-white/[.04] px-3 py-3"><CheckCircle className="mt-.5 size-5 shrink-0 text-emerald-200" weight="fill" /><div><p className="text-sm font-bold text-zinc-100">{item.adventureName}</p>{item.note ? <p className="mt-1 text-sm text-zinc-300">{item.note}</p> : null}<p className="mt-1 text-xs text-zinc-500">{isToday(item.completedAt) ? "今天" : new Date(item.completedAt).toLocaleDateString("zh-TW")}</p></div></div>)}</div> : <p className="mt-4 rounded-xl bg-white/[.04] px-4 py-5 text-sm leading-6 text-zinc-300">完成一個小冒險後，這裡會留下你的生活紀錄。</p>}</section>
    <WeeklyReflection lifeMoments={state.lifeMoments} onFindAdventure={() => document.getElementById("adventure-heading")?.scrollIntoView({ behavior: "smooth", block: "center" })} />
    <section className="game-card flex flex-wrap items-center justify-between gap-4 p-4" aria-label="經驗值與技能"><div className="min-w-[14rem] flex-1"><p className="text-sm font-bold text-zinc-100">你的冒險進度</p><p className="mt-1 text-xs text-zinc-400">完成任務與小冒險可獲得 EXP。</p><div className="mt-3"><ExpBar exp={profile.exp} /></div></div><div className="flex items-center gap-3"><Lightning className="size-5 text-emerald-200" weight="fill" /><span className="text-sm font-bold text-emerald-100">{profile.exp} EXP</span><button type="button" onClick={() => onNavigate("skills")} className="rounded-lg border border-emerald-300/25 px-3 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-300/10">{categoryLabels[profile.focus]}技能</button></div></section>
    {isMomentFormOpen ? <LifeMomentForm adventureName={adventure.title} onSave={saveAdventure} onClose={() => setIsMomentFormOpen(false)} /> : null}
  </main>;
}
