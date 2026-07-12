"use client";

import { Compass, Target } from "@phosphor-icons/react";
import { type AppTab } from "@/components/BottomNav";
import { CharacterCard } from "@/components/CharacterCard";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { QuestCard } from "@/components/QuestCard";
import { StatCard } from "@/components/StatCard";
import { mapLocations } from "@/data/defaults";
import { isToday } from "@/lib/utils";
import { statOrder } from "@/components/life-quest/constants";

export function HomePanel({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  const { state, completeQuest } = useLifeQuest();
  const profile = state.profile;

  if (!profile) {
    return null;
  }

  const pendingQuests = state.quests.filter((quest) => quest.status === "pending");
  const mainQuest =
    pendingQuests.find((quest) => quest.type === "main") ?? pendingQuests[0] ?? null;
  const sideQuests = pendingQuests
    .filter((quest) => quest.id !== mainQuest?.id && quest.type !== "hidden")
    .slice(0, 3);
  const completedToday = state.quests.filter((quest) => isToday(quest.completedAt)).length;
  const totalToday = Math.max(
    completedToday + pendingQuests.filter((quest) => quest.type !== "hidden").length,
    1
  );

  return (
    <div className="space-y-5">
      <CharacterCard
        profile={profile}
        stats={state.stats}
        completedToday={completedToday}
        totalToday={totalToday}
      />

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Main Quest
              </p>
              <h1 className="mt-1 text-3xl font-black text-zinc-50">今日主線</h1>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("quests")}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-zinc-200 transition hover:border-emerald-300/30 active:translate-y-px"
            >
              任務公會
            </button>
          </div>

          {mainQuest ? (
            <QuestCard quest={mainQuest} featured onComplete={completeQuest} />
          ) : (
            <EmptyQuestState onNavigate={onNavigate} />
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            {sideQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onComplete={completeQuest} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <section className="game-card p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-zinc-50">技能成長</h2>
                <p className="mt-1 text-sm text-zinc-400">完成任務後即時提升能力值</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("skills")}
                className="rounded-lg bg-emerald-300 px-3 py-2 text-xs font-black text-zinc-950 transition hover:bg-emerald-200 active:translate-y-px"
              >
                技能樹
              </button>
            </div>
            <div className="grid gap-3">
              {statOrder.slice(0, 4).map((category) => (
                <StatCard
                  key={category}
                  category={category}
                  value={state.stats[category]}
                  compact
                />
              ))}
            </div>
          </section>

          <MiniMapPanel onNavigate={onNavigate} />
        </div>
      </section>
    </div>
  );
}

function EmptyQuestState({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  return (
    <section className="game-card p-6">
      <Target className="mb-3 size-8 text-emerald-200" weight="duotone" />
      <h2 className="text-2xl font-black text-zinc-50">今日主線已清空</h2>
      <p className="mt-2 text-sm text-zinc-400">新增一張主線任務牌，讓今天有明確推進方向。</p>
      <button
        type="button"
        onClick={() => onNavigate("quests")}
        className="mt-4 rounded-lg bg-emerald-300 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-emerald-200 active:translate-y-px"
      >
        新增任務
      </button>
    </section>
  );
}

function MiniMapPanel({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  const { state } = useLifeQuest();

  return (
    <section className="game-card overflow-hidden p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-zinc-50">任務地圖</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {state.mapCompletions.length} / {mapLocations.length} 地點已探索
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("map")}
          className="grid size-10 place-items-center rounded-lg border border-emerald-300/20 bg-emerald-300/10 text-emerald-100 transition hover:bg-emerald-300 hover:text-zinc-950 active:translate-y-px"
          aria-label="前往地圖"
        >
          <Compass className="size-5" weight="bold" />
        </button>
      </div>
      <div className="map-preview-panel h-56">
        {mapLocations.map((location, index) => {
          const completed = state.mapCompletions.includes(location.id);

          return (
            <span
              key={location.id}
              className={`map-preview-node ${completed ? "map-preview-node-completed" : ""}`}
              style={{
                left: `${16 + (index % 3) * 31}%`,
                top: `${16 + Math.floor(index / 3) * 34}%`
              }}
            >
              {location.name}
            </span>
          );
        })}
      </div>
    </section>
  );
}
