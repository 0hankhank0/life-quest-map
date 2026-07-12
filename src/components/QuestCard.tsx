"use client";

import {
  CheckCircle,
  Lightning,
  PencilSimple,
  Scroll,
  Trash
} from "@phosphor-icons/react";
import {
  categoryLabels,
  difficultyLabels,
  occupationLabels,
  questTypeLabels
} from "@/data/labels";
import type { Quest } from "@/types";

interface QuestCardProps {
  quest: Quest;
  featured?: boolean;
  onComplete?: (questId: string) => void;
  onEdit?: (quest: Quest) => void;
  onDelete?: (questId: string) => void;
}

export function QuestCard({
  quest,
  featured = false,
  onComplete,
  onEdit,
  onDelete
}: QuestCardProps) {
  const isCompleted = quest.status === "completed";

  return (
    <article
      className={`relative overflow-hidden rounded-lg border transition ${
        featured
          ? "border-emerald-300/35 bg-[linear-gradient(145deg,rgba(16,185,129,0.18),rgba(9,9,11,0.76))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
          : "border-white/10 bg-zinc-900/70 p-4"
      } ${isCompleted ? "opacity-70" : ""}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-emerald-300/20 bg-emerald-300/10">
            {isCompleted ? (
              <CheckCircle className="size-6 text-emerald-200" weight="fill" />
            ) : (
              <Scroll className="size-6 text-emerald-200" weight="duotone" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-xs font-bold text-emerald-100">
                {questTypeLabels[quest.type]}
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-zinc-300">
                {categoryLabels[quest.category]} +2
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-zinc-300">
                {occupationLabels[quest.occupation]}
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-zinc-300">
                {difficultyLabels[quest.difficulty]}
              </span>
            </div>

            <h3
              className={`mt-3 font-black leading-snug text-zinc-50 ${
                featured ? "text-2xl" : "text-lg"
              }`}
            >
              {quest.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-300">{quest.description}</p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="inline-flex items-center gap-1 rounded-lg border border-emerald-300/20 bg-zinc-950/60 px-3 py-2 text-sm font-black text-emerald-100">
            <Lightning className="size-4" weight="fill" />
            {quest.expReward}
          </div>
          <p className="mt-1 text-xs text-zinc-500">EXP</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {onComplete ? (
          <button
            type="button"
            onClick={() => onComplete(quest.id)}
            disabled={isCompleted}
            className={`rounded-lg px-4 py-2 text-sm font-black transition active:translate-y-px ${
              isCompleted
                ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                : "bg-emerald-300 text-zinc-950 hover:bg-emerald-200"
            }`}
          >
            {isCompleted ? "已通關" : "領取 EXP"}
          </button>
        ) : null}

        {onEdit && !isCompleted ? (
          <button
            type="button"
            onClick={() => onEdit(quest)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-zinc-200 transition hover:border-emerald-300/30 hover:text-emerald-100 active:translate-y-px"
          >
            <PencilSimple className="size-4" />
            編輯
          </button>
        ) : null}

        {onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(quest.id)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-zinc-300 transition hover:border-red-300/30 hover:text-red-100 active:translate-y-px"
          >
            <Trash className="size-4" />
            刪除
          </button>
        ) : null}
      </div>
    </article>
  );
}
