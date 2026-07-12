"use client";

import { useEffect, useState, type FormEvent } from "react";
import { FloppyDisk, X } from "@phosphor-icons/react";
import {
  categoryLabels,
  difficultyLabels,
  occupationOptions,
  questTypeLabels
} from "@/data/labels";
import { getExpReward } from "@/lib/progression";
import type {
  OccupationCategory,
  Quest,
  QuestCategory,
  QuestDifficulty,
  QuestDraft,
  QuestType
} from "@/types";

interface QuestFormProps {
  quest?: Quest | null;
  onSubmit: (draft: QuestDraft) => void;
  onCancel: () => void;
}

const initialDraft: QuestDraft = {
  title: "",
  description: "",
  type: "side",
  category: "learning",
  occupation: "general",
  difficulty: "easy"
};

const questTypes: QuestType[] = ["main", "side", "daily", "hidden"];
const categories: QuestCategory[] = [
  "learning",
  "fitness",
  "creativity",
  "social",
  "discipline",
  "exploration"
];
const difficulties: QuestDifficulty[] = ["easy", "normal", "hard"];

export function QuestForm({ quest, onSubmit, onCancel }: QuestFormProps) {
  const [draft, setDraft] = useState<QuestDraft>(initialDraft);
  const [error, setError] = useState("");

  useEffect(() => {
    if (quest) {
      setDraft({
        title: quest.title,
        description: quest.description,
        type: quest.type === "map" ? "side" : quest.type,
        category: quest.category,
        occupation: quest.occupation,
        difficulty: quest.difficulty
      });
    } else {
      setDraft(initialDraft);
    }
    setError("");
  }, [quest]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.title.trim()) {
      setError("請輸入任務名稱。");
      return;
    }

    onSubmit({
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim() || "完成一個清楚、可行的小任務。"
    });
  }

  return (
    <form onSubmit={handleSubmit} className="game-card space-y-4 p-5">
      <div>
        <h2 className="text-xl font-black text-zinc-50">
          {quest ? "編輯任務牌" : "新增任務牌"}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          把任務寫成可以完成的小行動，完成後會轉成 EXP 與技能點。
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-bold text-zinc-200">任務名稱</span>
        <input
          value={draft.title}
          onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          className="field-control"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-bold text-zinc-200">任務描述</span>
        <textarea
          value={draft.description}
          onChange={(event) =>
            setDraft((current) => ({ ...current, description: event.target.value }))
          }
          className="field-control min-h-24 resize-y"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block space-y-2">
          <span className="text-sm font-bold text-zinc-200">任務分類</span>
          <select
            value={draft.type}
            onChange={(event) =>
              setDraft((current) => ({ ...current, type: event.target.value as QuestType }))
            }
            className="field-control"
          >
            {questTypes.map((type) => (
              <option key={type} value={type}>
                {questTypeLabels[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-bold text-zinc-200">能力分類</span>
          <select
            value={draft.category}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                category: event.target.value as QuestCategory
              }))
            }
            className="field-control"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {categoryLabels[category]}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-bold text-zinc-200">難度</span>
          <select
            value={draft.difficulty}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                difficulty: event.target.value as QuestDifficulty
              }))
            }
            className="field-control"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficultyLabels[difficulty]} · {getExpReward(difficulty)} EXP
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-bold text-zinc-200">職業分類</span>
          <select
            value={draft.occupation}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                occupation: event.target.value as OccupationCategory
              }))
            }
            className="field-control"
          >
            {occupationOptions.map((occupation) => (
              <option key={occupation.value} value={occupation.value}>
                {occupation.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <p className="text-sm font-bold text-red-200">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-300 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-emerald-200 active:translate-y-px"
        >
          <FloppyDisk className="size-4" weight="bold" />
          保存任務
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:border-emerald-300/30 active:translate-y-px"
        >
          <X className="size-4" weight="bold" />
          取消
        </button>
      </div>
    </form>
  );
}
