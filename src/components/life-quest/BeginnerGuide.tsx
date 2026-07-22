"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Compass } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useLifeQuest } from "@/components/LifeQuestProvider";

const steps = [
  {
    title: "歡迎來到 Life Quest Map",
    description: "把每天想完成的事情變成任務，累積 EXP、解鎖技能，留下屬於自己的冒險紀錄。"
  },
  {
    title: "從現在的狀態開始",
    description: "選擇此刻的心情和可用時間，我們會推薦一個剛好做得到的小冒險。"
  },
  {
    title: "每次完成，都會留下回聲",
    description: "完成任務後會獲得 EXP 和一句城市迴響，也能記下當時的感受與一句話。"
  },
  {
    title: "慢慢展開你的冒險地圖",
    description: "",
    features: [
      "任務：建立日常行動與長期目標",
      "地圖：新增屬於自己的探索據點",
      "技能：用完成紀錄解鎖成長節點",
      "檔案：查看手札、歷史與備份資料"
    ]
  },
  {
    title: "不必準備完美，先完成一小步",
    description: "挑一個現在做得到的微冒險，讓今天留下第一筆進度。"
  }
];

const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function BeginnerGuide() {
  const router = useRouter();
  const { completeBeginnerGuide, state } = useLifeQuest();
  const [stepIndex, setStepIndex] = useState(0);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.focus();
    return () => previousFocusRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        completeBeginnerGuide();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [completeBeginnerGuide]);

  const finish = () => {
    window.sessionStorage.setItem("lifeQuestMap:focus-recommended-adventure", "true");
    completeBeginnerGuide();
    if (window.location.pathname !== "/") {
      router.push("/");
      return;
    }
    window.requestAnimationFrame(() => {
      const adventureSection = document.getElementById("recommended-adventure");
      adventureSection?.scrollIntoView({ behavior: state.userSettings.reducedMotion ? "auto" : "smooth", block: "center" });
      adventureSection?.querySelector<HTMLElement>("h2")?.focus();
      window.sessionStorage.removeItem("lifeQuestMap:focus-recommended-adventure");
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/75 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6" role="presentation">
      <section
        ref={dialogRef}
        tabIndex={-1}
        data-testid="beginner-guide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="beginner-guide-title"
        className="game-card max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto border-emerald-300/35 bg-zinc-950 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] outline-none sm:max-h-[calc(100dvh-3rem)] sm:p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm font-black text-emerald-100">
            <Compass className="size-5" weight="duotone" /> 新手指南
          </div>
          <p data-testid="beginner-guide-step" className="rounded-full bg-emerald-300/10 px-3 py-1 text-sm font-bold text-emerald-100">
            {stepIndex + 1} / {steps.length}
          </p>
        </div>

        <div className="mt-7">
          <h2 id="beginner-guide-title" className="text-2xl font-black leading-tight text-zinc-50">{step.title}</h2>
          {step.description ? <p className="mt-4 text-base leading-7 text-zinc-300">{step.description}</p> : null}
          {step.features ? (
            <ul className="mt-5 space-y-3" aria-label="主要功能">
              {step.features.map((feature) => <li key={feature} className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-zinc-200">{feature}</li>)}
            </ul>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button data-testid="beginner-guide-skip" type="button" onClick={completeBeginnerGuide} className="min-h-11 rounded-lg px-4 py-3 text-sm font-bold text-zinc-300 transition motion-reduce:transition-none hover:bg-white/10 hover:text-zinc-100">
            略過教學
          </button>
          <div className="grid gap-2 sm:flex">
            {stepIndex > 0 ? <button data-testid="beginner-guide-back" type="button" onClick={() => setStepIndex((current) => current - 1)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-sm font-bold text-zinc-100 transition motion-reduce:transition-none hover:border-emerald-300/40"><ArrowLeft className="size-4" />上一步</button> : null}
            {isLastStep ? <button data-testid="beginner-guide-start" type="button" onClick={finish} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 py-3 text-sm font-black text-zinc-950 transition motion-reduce:transition-none hover:bg-emerald-200"><Compass className="size-4" weight="fill" />開始第一個冒險</button> : <button data-testid="beginner-guide-next" type="button" onClick={() => setStepIndex((current) => current + 1)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 py-3 text-sm font-black text-zinc-950 transition motion-reduce:transition-none hover:bg-emerald-200">下一步<ArrowRight className="size-4" /></button>}
          </div>
        </div>
      </section>
    </div>
  );
}
