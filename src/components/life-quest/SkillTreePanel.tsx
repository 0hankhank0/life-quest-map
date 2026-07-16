"use client";

import { useState } from "react";
import { CheckCircle, Lock, Sparkle, X } from "@phosphor-icons/react";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { skillNodes } from "@/data/skillNodes";
import { categoryLabels } from "@/data/labels";
import { getCompletedQuestCountsByCategory, getSkillNodeProgress, getSkillNodeStatus } from "@/lib/skillTree";
import { statOrder } from "@/components/life-quest/constants";
import type { QuestCategory, SkillNode } from "@/types";

const statusCopy = {
  unlocked: "已解鎖",
  available: "可解鎖",
  locked: "尚未達成"
};

function SkillNodeCard({ node, category, onUnlock }: { node: SkillNode; category: QuestCategory; onUnlock: (node: SkillNode) => void }) {
  const { state } = useLifeQuest();
  const counts = getCompletedQuestCountsByCategory(state.quests);
  const status = getSkillNodeStatus(node, state.stats, counts, state.unlockedSkillNodeIds);
  const progress = getSkillNodeProgress(node, state.stats, counts, state.unlockedSkillNodeIds);
  const isUnlocked = status === "unlocked";

  return (
    <li className={`skill-tree-node ${status !== "locked" ? `skill-tree-node-${status}` : ""}`}>
      <article className="rounded-lg border border-white/10 bg-zinc-950/45 p-4 shadow-inner shadow-black/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-wide text-emerald-200">{categoryLabels[category]} · 節點</p>
            <h3 className="mt-1 font-black text-zinc-50">{node.title}</h3>
            <p className="mt-1 text-sm text-zinc-400">{node.description}</p>
          </div>
          <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${isUnlocked ? "bg-emerald-300 text-emerald-950" : status === "available" ? "bg-amber-300 text-amber-950" : "bg-zinc-800 text-zinc-400"}`}>
            {isUnlocked ? <CheckCircle weight="fill" /> : <Lock weight="bold" />}
            {statusCopy[status]}
          </span>
        </div>
        <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
          <p className="rounded bg-white/5 px-2 py-1.5 text-zinc-300">能力：{progress.stat.current} / {progress.stat.required}</p>
          <p className="rounded bg-white/5 px-2 py-1.5 text-zinc-300">同類任務：{progress.questCount.current} / {progress.questCount.required}</p>
          <p className="rounded bg-white/5 px-2 py-1.5 text-zinc-300">前置：{progress.prerequisites.current} / {progress.prerequisites.required}</p>
        </div>
        <div className="mt-3 rounded border border-emerald-300/15 bg-emerald-300/5 p-2.5">
          <p className="text-xs font-bold text-emerald-200">獎勵：{node.rewardTitle}</p>
          <p className="mt-0.5 text-xs text-zinc-400">{node.rewardDescription}</p>
        </div>
        {status === "available" ? (
          <button type="button" onClick={() => onUnlock(node)} className="mt-3 rounded-md bg-emerald-300 px-3 py-2 text-sm font-black text-emerald-950 transition hover:bg-emerald-200">
            解鎖技能
          </button>
        ) : null}
      </article>
    </li>
  );
}

export function SkillTreePanel() {
  const { state, unlockSkillNode } = useLifeQuest();
  const [reward, setReward] = useState<SkillNode | null>(null);
  const completedQuestCounts = getCompletedQuestCountsByCategory(state.quests);

  const handleUnlock = (node: SkillNode) => {
    if (unlockSkillNode(node.id)) setReward(node);
  };

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Skill Tree" title="能力技能樹" description="完成同分類任務並提升能力值後，手動解鎖每一個成長節點。" />
      {reward ? (
        <section className="game-card flex items-start justify-between gap-4 border-emerald-300/45 bg-emerald-300/10 p-4" role="status">
          <div className="flex gap-3">
            <Sparkle className="mt-0.5 size-6 shrink-0 text-emerald-200" weight="fill" />
            <div>
              <p className="font-black text-emerald-100">技能解鎖：{reward.rewardTitle}</p>
              <p className="mt-1 text-sm text-zinc-300">{reward.rewardDescription}</p>
            </div>
          </div>
          <button type="button" aria-label="關閉獎勵提示" onClick={() => setReward(null)} className="rounded p-1 text-zinc-300 hover:bg-white/10 hover:text-white"><X className="size-5" /></button>
        </section>
      ) : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statOrder.map((category) => {
          const nodes = skillNodes.filter((node) => node.category === category);
          const summary = nodes.reduce((result, node) => {
            const status = getSkillNodeStatus(node, state.stats, completedQuestCounts, state.unlockedSkillNodeIds);
            return { ...result, unlocked: result.unlocked + Number(status === "unlocked"), available: result.available + Number(status === "available") };
          }, { unlocked: 0, available: 0 });
          return <StatCard key={category} category={category} value={state.stats[category]} skillSummary={{ ...summary, total: nodes.length }} />;
        })}
      </section>
      <section className="grid gap-5 xl:grid-cols-2">
        {statOrder.map((category) => (
          <section key={category} className="game-card p-5">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">{categoryLabels[category]} branch</p>
                <h2 className="mt-1 text-xl font-black text-zinc-50">{categoryLabels[category]}技能樹</h2>
              </div>
              <p className="text-xs text-zinc-400">已完成 {completedQuestCounts[category]} 個任務</p>
            </div>
            <ol className="skill-tree-list">
              {skillNodes.filter((node) => node.category === category).map((node) => <SkillNodeCard key={node.id} node={node} category={category} onUnlock={handleUnlock} />)}
            </ol>
          </section>
        ))}
      </section>
    </div>
  );
}
