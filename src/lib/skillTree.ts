import { skillNodes } from "@/data/skillNodes";
import type { LifeQuestState, Quest, QuestCategory, SkillNode, Stats } from "@/types";

export type SkillNodeStatus = "unlocked" | "available" | "locked";

export interface SkillNodeProgress {
  stat: { current: number; required: number };
  questCount: { current: number; required: number };
  prerequisites: { current: number; required: number; fulfilled: boolean };
}

export function getCompletedQuestCountsByCategory(quests: Quest[]): Record<QuestCategory, number> {
  return quests.filter((quest) => quest.status === "completed").reduce<Record<QuestCategory, number>>((counts, quest) => {
    counts[quest.category] += 1;
    return counts;
  }, { learning: 0, fitness: 0, creativity: 0, social: 0, discipline: 0, exploration: 0 });
}

export function getSkillNodeProgress(node: SkillNode, stats: Stats, completedQuestCounts: Record<QuestCategory, number>, unlockedIds: readonly string[]): SkillNodeProgress {
  const prerequisiteCurrent = node.prerequisiteIds.filter((id) => unlockedIds.includes(id)).length;
  return {
    stat: { current: stats[node.category], required: node.requiredStat },
    questCount: { current: completedQuestCounts[node.category], required: node.requiredQuestCount },
    prerequisites: { current: prerequisiteCurrent, required: node.prerequisiteIds.length, fulfilled: prerequisiteCurrent === node.prerequisiteIds.length }
  };
}

export function getSkillNodeStatus(node: SkillNode, stats: Stats, completedQuestCounts: Record<QuestCategory, number>, unlockedIds: readonly string[]): SkillNodeStatus {
  if (unlockedIds.includes(node.id)) return "unlocked";
  const progress = getSkillNodeProgress(node, stats, completedQuestCounts, unlockedIds);
  return progress.stat.current >= progress.stat.required && progress.questCount.current >= progress.questCount.required && progress.prerequisites.fulfilled ? "available" : "locked";
}

export type UnlockSkillNodeResult =
  | { success: true; state: LifeQuestState; node: SkillNode }
  | { success: false; state: LifeQuestState; reason: "unknown" | "already-unlocked" | "requirements-not-met" };

export function unlockSkillNode(state: LifeQuestState, nodeId: string): UnlockSkillNodeResult {
  const node = skillNodes.find((item) => item.id === nodeId);
  if (!node) return { success: false, state, reason: "unknown" };
  if (state.unlockedSkillNodeIds.includes(node.id)) return { success: false, state, reason: "already-unlocked" };
  const completedQuestCounts = getCompletedQuestCountsByCategory(state.quests);
  if (getSkillNodeStatus(node, state.stats, completedQuestCounts, state.unlockedSkillNodeIds) !== "available") return { success: false, state, reason: "requirements-not-met" };
  return { success: true, state: { ...state, unlockedSkillNodeIds: [...new Set([...state.unlockedSkillNodeIds, node.id])] }, node };
}
