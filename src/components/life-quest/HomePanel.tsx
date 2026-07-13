"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Clock, Lightning, Sparkle } from "@phosphor-icons/react";
import { type AppTab } from "@/components/BottomNav";
import { ExpBar } from "@/components/ExpBar";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { microAdventures, type Mood, type AvailableTime } from "@/data/microAdventures";
import { categoryLabels } from "@/data/labels";
import { isToday } from "@/lib/utils";
import { LifeMomentForm } from "@/components/life-quest/LifeMomentForm";
import { WeeklyReflection } from "@/components/life-quest/WeeklyReflection";

const lifeMomentMoodLabels = {
  happier: "更開心了",
  relaxed: "比較放鬆",
  refreshed: "有一點新鮮感",
  unchanged: "沒有太大變化",
  trySomethingElse: "想再試試其他事情"
};

const moods: Array<{ value: Mood; label: string }> = [
  { value: "bored", label: "無聊" },
  { value: "tired", label: "有點累" },
  { value: "good", label: "心情不錯" },
  { value: "out", label: "想出去走走" },
  { value: "social", label: "想和別人互動" },
  { value: "quiet", label: "想一個人安靜一下" }
];

const times: Array<{ value: AvailableTime; label: string }> = [
  { value: "5", label: "5 分鐘" },
  { value: "15", label: "15 分鐘" },
  { value: "30", label: "30 分鐘" },
  { value: "60", label: "1 小時以上" }
];

export function HomePanel({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  const { state, completeMicroAdventure } = useLifeQuest();
  const [mood, setMood] = useState<Mood>("bored");
  const [time, setTime] = useState<AvailableTime>("15");
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [isMomentFormOpen, setIsMomentFormOpen] = useState(false);
  const [savedAdventureId, setSavedAdventureId] = useState<string | null>(null);
  const profile = state.profile;

  const recommendationCandidates = useMemo(() => {
    const exactMatches = microAdventures.filter(
      (adventure) => adventure.moods.includes(mood) && adventure.times.includes(time)
    );

    if (exactMatches.length > 1) return exactMatches;

    const partialMatches = microAdventures.filter(
      (adventure) =>
        !exactMatches.some((match) => match.id === adventure.id) &&
        (adventure.moods.includes(mood) || adventure.times.includes(time))
    );

    return [...exactMatches, ...partialMatches];
  }, [mood, time]);
  const recommendation =
    recommendationCandidates[recommendationIndex % recommendationCandidates.length] ??
    microAdventures[0];

  if (!profile) return null;

  const recentMoments = state.lifeMoments
    .slice()
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, 3);
  const momentsToday = state.lifeMoments.filter((moment) => isToday(moment.completedAt)).length;

  function updateMood(nextMood: Mood) {
    setMood(nextMood);
    setRecommendationIndex(0);
  }

  function updateTime(nextTime: AvailableTime) {
    setTime(nextTime);
    setRecommendationIndex(0);
  }

  function showAnotherAdventure() {
    if (recommendationCandidates.length < 2) return;

    setRecommendationIndex((index) => (index + 1) % recommendationCandidates.length);
    setIsMomentFormOpen(false);
  }

  function saveAdventure(note: string, mood: keyof typeof lifeMomentMoodLabels) {
    if (!recommendation || savedAdventureId === recommendation.id) return;
    completeMicroAdventure(recommendation, note, mood);
    setSavedAdventureId(recommendation.id);
    setIsMomentFormOpen(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header className="px-1 pt-2">
        <p className="text-sm font-medium text-emerald-200/80">嗨，{profile.name}</p>
        <h1 className="mt-2 max-w-xl text-4xl font-black leading-[1.08] tracking-[-0.04em] text-zinc-50 text-balance sm:text-5xl">
          今天想讓生活有哪一點不一樣？
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-300">不需要做大事，留下一個片段就好。</p>
      </header>

      <section className="game-card p-4 sm:p-5" aria-labelledby="check-in-heading">
        <h2 id="check-in-heading" className="text-lg font-bold text-zinc-50">現在的你，感覺怎麼樣？</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {moods.map((option) => (
            <button key={option.value} type="button" onClick={() => updateMood(option.value)} className={`rounded-full border px-3 py-2 text-sm font-medium transition active:scale-[0.98] ${mood === option.value ? "border-emerald-200 bg-emerald-300 text-zinc-950" : "border-white/10 bg-white/[0.03] text-zinc-200 hover:border-emerald-200/50 hover:bg-emerald-300/10"}`}>
              {option.label}
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2 text-sm font-bold text-zinc-50"><Clock className="size-5 text-emerald-200" weight="duotone" />你現在有多少時間？</div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {times.map((option) => (
            <button key={option.value} type="button" onClick={() => updateTime(option.value)} className={`rounded-xl border px-3 py-3 text-sm font-medium transition active:scale-[0.98] ${time === option.value ? "border-emerald-200 bg-emerald-300 text-zinc-950" : "border-white/10 bg-zinc-950/40 text-zinc-200 hover:border-emerald-200/50 hover:bg-emerald-300/10"}`}>
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section id="micro-adventure-recommendation" className="relative overflow-hidden rounded-2xl border border-emerald-200/25 bg-[linear-gradient(135deg,rgba(52,211,153,0.18),rgba(24,24,27,0.9)_55%)] p-5 shadow-[0_20px_60px_rgba(3,20,15,0.3)]" aria-labelledby="adventure-heading">
        <Sparkle className="absolute right-4 top-4 size-9 text-emerald-200/40" weight="fill" />
        <p className="text-sm font-semibold text-emerald-100">給現在的你一個剛剛好的小任務</p>
        <h2 id="adventure-heading" className="mt-2 max-w-md text-2xl font-black tracking-[-0.02em] text-zinc-50">{recommendation.title}</h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-200">{recommendation.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setIsMomentFormOpen(true)} disabled={savedAdventureId === recommendation.id} className="rounded-xl bg-emerald-300 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-200 active:scale-[0.98] disabled:cursor-default disabled:bg-emerald-100">
            {savedAdventureId === recommendation.id ? "你為今天留下了一個不一樣的片段" : "我完成了"}
          </button>
          <button type="button" onClick={showAnotherAdventure} disabled={recommendationCandidates.length < 2} className="rounded-xl border border-emerald-200/50 px-4 py-3 text-sm font-bold text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-300/10 active:scale-[0.98] disabled:cursor-default disabled:opacity-50">
            換一個小冒險
          </button>
          <span className="text-xs text-zinc-300">{time === "60" ? "慢慢來也很好" : `${time} 分鐘左右就可以`}</span>
        </div>
      </section>

      <section className="game-card p-4 sm:p-5" aria-labelledby="moments-heading">
        <div className="flex items-baseline justify-between gap-3">
          <div><h2 id="moments-heading" className="text-xl font-black text-zinc-50">最近的生活片段</h2><p className="mt-1 text-sm text-zinc-400">今天有什麼值得被記住？</p></div>
          <button type="button" onClick={() => onNavigate("quests")} className="shrink-0 text-sm font-bold text-emerald-200 hover:text-emerald-100">看看任務</button>
        </div>
        {recentMoments.length ? <div className="mt-4 space-y-2">{recentMoments.map((moment) => <div key={moment.id} className="flex items-start gap-3 rounded-xl bg-white/[0.04] px-3 py-3"><CheckCircle className="mt-0.5 size-5 shrink-0 text-emerald-200" weight="fill" /><div className="min-w-0"><p className="truncate text-sm font-bold text-zinc-100">{moment.adventureName}</p>{moment.note ? <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-300">{moment.note}</p> : null}<p className="mt-1 text-xs text-zinc-400">{lifeMomentMoodLabels[moment.mood]} · {isToday(moment.completedAt) ? "今天" : new Date(moment.completedAt).toLocaleDateString("zh-TW")}</p></div></div>)}</div> : <div className="mt-4 rounded-xl bg-white/[0.04] px-4 py-5 text-sm leading-6 text-zinc-300">還沒有生活片段，完成一次小冒險後，回憶會出現在這裡。</div>}
      </section>

      <WeeklyReflection
        lifeMoments={state.lifeMoments}
        onFindAdventure={() => document.getElementById("micro-adventure-recommendation")?.scrollIntoView({ behavior: "smooth", block: "center" })}
      />

      <details className="group rounded-xl border border-white/10 bg-zinc-900/50 p-4">
        <summary className="cursor-pointer list-none text-sm font-bold text-zinc-300">想看看你的探索紀錄嗎？</summary>
        <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-sm text-zinc-300">今天留下了 {momentsToday} 個片段</p><p className="mt-1 text-xs text-zinc-500">等級、EXP 和技能會繼續陪你記錄每一次嘗試。</p><ExpBar exp={profile.exp} /></div><div className="flex items-center gap-3 text-sm text-emerald-100"><Lightning className="size-5" weight="fill" />{profile.exp} EXP <button type="button" onClick={() => onNavigate("skills")} className="rounded-lg border border-emerald-300/25 px-3 py-2 text-xs font-bold hover:bg-emerald-300/10">技能：{categoryLabels[profile.focus]}</button></div></div>
      </details>
      {isMomentFormOpen ? <LifeMomentForm adventureName={recommendation.title} onSave={saveAdventure} onClose={() => setIsMomentFormOpen(false)} /> : null}
    </div>
  );
}
