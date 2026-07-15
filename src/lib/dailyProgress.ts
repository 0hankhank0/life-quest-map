import type { DailyProgress, Streak } from "@/types";
import { todayKey } from "@/lib/utils";

const DAY_MS = 24 * 60 * 60 * 1000;

export function recordDailyQuestCompletion(
  dailyProgress: DailyProgress,
  questId: string,
  expReward: number,
  completedAt: string
): DailyProgress {
  const date = todayKey(new Date(completedAt));
  const completedQuestIds = dailyProgress.date === date ? dailyProgress.completedQuestIds : [];

  const alreadyCompleted = completedQuestIds.includes(questId);
  return {
    date,
    completedQuestIds: alreadyCompleted
      ? completedQuestIds
      : [...completedQuestIds, questId],
    expEarned: dailyProgress.date === date
      ? dailyProgress.expEarned + (alreadyCompleted ? 0 : expReward)
      : expReward
  };
}

export function updateStreakForCompletion(
  streak: Streak,
  completedAt: string
): Streak {
  const date = todayKey(new Date(completedAt));
  if (streak.lastCompletedDate === date) return streak;

  const previous = streak.lastCompletedDate ? new Date(`${streak.lastCompletedDate}T00:00:00`) : null;
  const current = new Date(`${date}T00:00:00`);
  const isConsecutive = previous !== null && current.getTime() - previous.getTime() === DAY_MS;
  const nextCurrent = isConsecutive ? streak.current + 1 : 1;

  return {
    current: nextCurrent,
    longest: Math.max(streak.longest, nextCurrent),
    lastCompletedDate: date
  };
}

export function buildStreakFromCompletionDates(dates: string[]): Streak {
  const orderedDates = [...new Set(dates.filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)))].sort();
  let current = 0;
  let longest = 0;
  let lastCompletedDate: string | null = null;

  for (const date of orderedDates) {
    const next = updateStreakForCompletion({ current, longest, lastCompletedDate }, `${date}T12:00:00`);
    current = next.current;
    longest = next.longest;
    lastCompletedDate = next.lastCompletedDate;
  }

  return { current, longest, lastCompletedDate };
}
