"use client";

import { useEffect, useRef } from "react";
import { BookmarkSimple, CheckCircle, Sparkle, X } from "@phosphor-icons/react";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { quoteCategoryLabels } from "@/data/adventureQuotes";

export function CompletionFeedbackDialog() {
  const { completionFeedback: feedback, closeCompletionFeedback, saveCompletionQuote, isFeedbackSaved } = useLifeQuest();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const saved = isFeedbackSaved();

  useEffect(() => {
    if (!feedback) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeCompletionFeedback(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeCompletionFeedback, feedback]);

  if (!feedback) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCompletionFeedback(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="completion-feedback-title" className="game-card w-full max-w-md overflow-y-auto border-emerald-300/35 bg-zinc-950 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:max-h-[calc(100dvh-3rem)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-emerald-200"><Sparkle className="size-5" weight="fill" /><p className="text-sm font-black">{quoteCategoryLabels[feedback.quote.category]}</p></div>
          <button ref={closeButtonRef} type="button" onClick={closeCompletionFeedback} aria-label="關閉完成回饋" className="rounded-lg p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"><X className="size-5" /></button>
        </div>
        <h2 id="completion-feedback-title" className="mt-5 text-xl font-black text-zinc-50">{feedback.sourceTitle}</h2>
        <blockquote className="mt-4 border-l-2 border-emerald-300 pl-4 text-lg font-bold leading-8 text-emerald-50">「{feedback.quote.text}」</blockquote>
        {(feedback.expReward || feedback.statLabel) ? <p className="mt-5 text-sm font-bold text-emerald-100">{feedback.expReward ? `+${feedback.expReward} XP` : ""}{feedback.expReward && feedback.statLabel ? " ｜ " : ""}{feedback.statLabel}</p> : null}
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={saveCompletionQuote} disabled={saved} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-black transition active:translate-y-px ${saved ? "border border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : "bg-emerald-300 text-zinc-950 hover:bg-emerald-200"}`}>
            {saved ? <CheckCircle className="size-4" weight="fill" /> : <BookmarkSimple className="size-4" weight="fill" />}{saved ? "已收藏到手札" : "收藏到手札"}
          </button>
          <button type="button" onClick={closeCompletionFeedback} className="min-h-11 rounded-lg border border-white/15 px-4 py-3 text-sm font-bold text-zinc-100 transition hover:border-emerald-300/30 hover:text-emerald-100 active:translate-y-px">繼續冒險</button>
        </div>
      </section>
    </div>
  );
}
