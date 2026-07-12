import type { QuestCategory, QuestDifficulty, Stats } from "@/types";

export const EXP_REWARDS: Record<QuestDifficulty, number> = {
  easy: 20,
  normal: 50,
  hard: 100
};

export const STAT_GAIN_PER_QUEST = 2;

export function getExpReward(difficulty: QuestDifficulty): number {
  return EXP_REWARDS[difficulty];
}

export function getLevelFromExp(exp: number): number {
  return Math.floor(exp / 100) + 1;
}

export function getLevelProgress(exp: number): number {
  return exp % 100;
}

export function addStat(stats: Stats, category: QuestCategory, gain = STAT_GAIN_PER_QUEST) {
  return {
    ...stats,
    [category]: stats[category] + gain
  };
}

export function getStrongestStat(stats: Stats): QuestCategory {
  return (Object.entries(stats) as Array<[QuestCategory, number]>).sort(
    (a, b) => b[1] - a[1]
  )[0][0];
}

export function getStatRank(value: number): number {
  return Math.floor(value / 10) + 1;
}

export function getStatProgress(value: number): number {
  return Math.min(100, (value % 10) * 10);
}
