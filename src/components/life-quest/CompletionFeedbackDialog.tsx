"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, Sparkle, X } from "@phosphor-icons/react";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { cityEchoCategoryLabels } from "@/data/adventureQuotes";
import type { CompletionMood } from "@/types";

const moods: Array<{ value: CompletionMood; label: string }> = [
  { value: "relaxed", label: "放鬆" }, { value: "happy", label: "開心" }, { value: "surprised", label: "驚喜" },
  { value: "discovered", label: "有所發現" }, { value: "calm", label: "平靜" }, { value: "unchanged", label: "沒有特別感覺" }
];

export function CompletionFeedbackDialog() {
  const { completionFeedback: feedback, closeCompletionFeedback, saveCompletionExperience } = useLifeQuest();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [mood, setMood] = useState<CompletionMood | null>(null);
  const [note, setNote] = useState("");
  useEffect(() => {
    if (!feedback) return;
    setMood(null); setNote(""); closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeCompletionFeedback(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeCompletionFeedback, feedback]);
  if (!feedback) return null;
  const close = <button data-testid="complete-only" type="button" onClick={closeCompletionFeedback} className="min-h-11 rounded-lg border border-white/15 px-4 py-3 text-sm font-bold text-zinc-100">只完成任務</button>;
  return <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCompletionFeedback(); }}>
    <section data-testid="completion-feedback" role="dialog" aria-modal="true" aria-labelledby="completion-feedback-title" className="game-card max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto border-emerald-300/35 bg-zinc-950 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:max-h-[calc(100dvh-3rem)]">
      <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-2 text-emerald-200"><Sparkle className="size-5" weight="fill" /><p className="text-sm font-black">城市迴響・{cityEchoCategoryLabels[feedback.category]}</p></div><button ref={closeButtonRef} type="button" onClick={closeCompletionFeedback} aria-label="關閉完成回饋" className="rounded-lg p-2 text-zinc-300"><X className="size-5" /></button></div>
      <p className="mt-5 text-sm font-bold text-emerald-100">今天留下了一點不一樣。</p><h2 id="completion-feedback-title" className="mt-1 text-xl font-black text-zinc-50">{feedback.taskName}</h2>
      <blockquote data-testid="city-echo-text" className="mt-4 border-l-2 border-emerald-300 pl-4 text-lg font-bold leading-8 text-emerald-50">「{feedback.quote.text}」</blockquote>
      {feedback.quote.author ? <p className="mt-2 text-sm text-zinc-400">——{feedback.quote.author}〈{feedback.quote.work}〉{feedback.quote.dynasty ? `・${feedback.quote.dynasty}` : ""}</p> : null}
      {(feedback.expReward || feedback.rewardLabel) ? <p className="mt-4 text-sm font-bold text-emerald-100">{feedback.expReward ? `+${feedback.expReward} XP` : ""}{feedback.expReward && feedback.rewardLabel ? "　" : ""}{feedback.rewardLabel}</p> : null}
      {feedback.canSaveJournal ? <><fieldset className="mt-6"><legend className="text-sm font-bold text-zinc-100">現在的感受（可略過）</legend><div className="mt-2 flex flex-wrap gap-2">{moods.map((option) => <button key={option.value} type="button" aria-pressed={mood === option.value} onClick={() => setMood(mood === option.value ? null : option.value)} className={`rounded-full border px-3 py-2 text-sm transition ${mood === option.value ? "border-emerald-200 bg-emerald-300 text-zinc-950" : "border-white/15 text-zinc-200"}`}>{option.label}</button>)}</div></fieldset><label className="mt-5 block text-sm font-bold text-zinc-100">想留下一句話嗎？ <span className="font-normal text-zinc-500">可略過</span><textarea data-testid="completion-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={280} rows={3} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-normal text-zinc-100" /></label><div className="mt-6 grid gap-2 sm:grid-cols-2"><button data-testid="save-completion-experience" type="button" onClick={() => saveCompletionExperience(mood, note)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 py-3 text-sm font-black text-zinc-950"><CheckCircle className="size-4" weight="fill" />保存這段經歷</button>{close}</div></> : <button data-testid="complete-only" type="button" onClick={closeCompletionFeedback} className="mt-6 min-h-11 w-full rounded-lg border border-white/15 px-4 py-3 text-sm font-bold text-zinc-100">繼續冒險</button>}
    </section>
  </div>;
}
