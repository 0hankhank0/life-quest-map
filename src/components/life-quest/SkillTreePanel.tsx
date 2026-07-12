"use client";

import { Sparkle } from "@phosphor-icons/react";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { statOrder } from "@/components/life-quest/constants";

export function SkillTreePanel() {
  const { state } = useLifeQuest();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Skill Tree"
        title="技能樹"
        description="每次完成任務，對應能力值都會成長。地圖任務會提升探索力。"
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statOrder.map((category) => (
          <StatCard key={category} category={category} value={state.stats[category]} />
        ))}
      </section>
      <section className="game-card p-5">
        <div className="flex items-center gap-3">
          <Sparkle className="size-6 text-emerald-200" weight="fill" />
          <div>
            <h2 className="text-xl font-black text-zinc-50">成長規則</h2>
            <p className="mt-1 text-sm text-zinc-400">
              完成任務可獲得 EXP，並讓對應能力值增加 2 點。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
