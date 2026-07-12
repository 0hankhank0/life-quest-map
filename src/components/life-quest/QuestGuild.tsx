"use client";

import { useMemo, useState } from "react";
import { Package, Plus } from "@phosphor-icons/react";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { PageHeader } from "@/components/PageHeader";
import { QuestCard } from "@/components/QuestCard";
import { QuestForm } from "@/components/QuestForm";
import { occupationLabels, occupationOptions, questTypeLabels } from "@/data/labels";
import { getOccupationQuestPack } from "@/data/questPacks";
import { questFilters, type OccupationFilter } from "@/components/life-quest/constants";
import type { Quest, QuestDraft, QuestType } from "@/types";

export function QuestGuild() {
  const {
    state,
    addQuest,
    addOccupationQuestPack,
    updateQuest,
    deleteQuest,
    completeQuest
  } = useLifeQuest();
  const [filter, setFilter] = useState<QuestType | "all">("all");
  const [occupationFilter, setOccupationFilter] = useState<OccupationFilter>("all");
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [packMessage, setPackMessage] = useState("");
  const currentOccupation = state.profile?.occupation ?? "general";
  const currentPack = getOccupationQuestPack(currentOccupation);
  const currentOccupationName =
    currentOccupation === "custom"
      ? state.profile?.customOccupationName || "通用冒險者"
      : occupationLabels[currentOccupation];

  const filteredQuests = useMemo(() => {
    const byType =
      filter === "all" ? state.quests : state.quests.filter((quest) => quest.type === filter);

    if (occupationFilter === "all") {
      return byType;
    }

    if (occupationFilter === "mine") {
      return byType.filter(
        (quest) =>
          quest.occupation === state.profile?.occupation || quest.occupation === "general"
      );
    }

    return byType.filter((quest) => quest.occupation === occupationFilter);
  }, [filter, occupationFilter, state.profile?.occupation, state.quests]);

  function handleSubmit(draft: QuestDraft) {
    if (editingQuest) {
      updateQuest(editingQuest.id, draft);
    } else {
      addQuest(draft);
    }

    setEditingQuest(null);
    setIsFormOpen(false);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Quest Guild"
        title="任務公會"
        description="新增、編輯與完成任務牌。主線推進等級，支線累積技能。"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingQuest(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-300 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-emerald-200 active:translate-y-px"
          >
            <Plus className="size-4" weight="bold" />
            新增任務
          </button>
        }
      />

      {currentPack ? (
        <section className="game-card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid size-12 shrink-0 place-items-center rounded-lg border border-emerald-300/20 bg-emerald-300/10">
                <Package className="size-6 text-emerald-200" weight="duotone" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-200">職業任務包</p>
                <h2 className="mt-1 text-xl font-black text-zinc-50">
                  {currentOccupationName}路線
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                  {currentPack.description}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const addedCount = addOccupationQuestPack(currentOccupation);
                setPackMessage(
                  addedCount > 0
                    ? `已加入 ${addedCount} 張職業任務牌。`
                    : "這個職業任務包已經加入過了。"
                );
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-emerald-200 active:translate-y-px"
            >
              <Plus className="size-4" weight="bold" />
              加入任務包
            </button>
          </div>
          {packMessage ? (
            <p className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-bold text-emerald-100">
              {packMessage}
            </p>
          ) : null}
        </section>
      ) : null}

      {isFormOpen ? (
        <QuestForm
          quest={editingQuest}
          onSubmit={handleSubmit}
          onCancel={() => {
            setEditingQuest(null);
            setIsFormOpen(false);
          }}
        />
      ) : null}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {questFilters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-bold transition active:translate-y-px ${
              filter === item
                ? "border-emerald-300 bg-emerald-300 text-zinc-950"
                : "border-white/10 text-zinc-300 hover:border-emerald-300/30"
            }`}
          >
            {item === "all" ? "全部" : questTypeLabels[item]}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setOccupationFilter("all")}
          className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-bold transition active:translate-y-px ${
            occupationFilter === "all"
              ? "border-emerald-300 bg-emerald-300 text-zinc-950"
              : "border-white/10 text-zinc-300 hover:border-emerald-300/30"
          }`}
        >
          全部職業
        </button>
        <button
          type="button"
          onClick={() => setOccupationFilter("mine")}
          className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-bold transition active:translate-y-px ${
            occupationFilter === "mine"
              ? "border-emerald-300 bg-emerald-300 text-zinc-950"
              : "border-white/10 text-zinc-300 hover:border-emerald-300/30"
          }`}
        >
          我的路線
        </button>
        {occupationOptions
          .filter((option) => option.value !== "custom")
          .map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setOccupationFilter(option.value)}
              className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-bold transition active:translate-y-px ${
                occupationFilter === option.value
                  ? "border-emerald-300 bg-emerald-300 text-zinc-950"
                  : "border-white/10 text-zinc-300 hover:border-emerald-300/30"
              }`}
            >
              {option.label}
            </button>
          ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {filteredQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onComplete={completeQuest}
            onEdit={(target) => {
              setEditingQuest(target);
              setIsFormOpen(true);
            }}
            onDelete={deleteQuest}
          />
        ))}
      </div>

      {filteredQuests.length === 0 ? (
        <section className="game-card p-6 text-center">
          <p className="font-bold text-zinc-200">這個分類目前沒有任務牌。</p>
        </section>
      ) : null}
    </div>
  );
}
