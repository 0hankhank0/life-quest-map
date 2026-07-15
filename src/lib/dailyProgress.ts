import type { DailyProgress, Streak } from "@/types";
import { addCalendarDays, calendarDateKey } from "@/lib/utils";

export function recordDailyQuestCompletion(dailyProgress: DailyProgress, questId: string, expReward: number, completedAt: string, timeZone?: string): DailyProgress {
  const date = calendarDateKey(new Date(completedAt), timeZone);
  const completedQuestIds = dailyProgress.date === date ? dailyProgress.completedQuestIds : [];
  const alreadyCompleted = completedQuestIds.includes(questId);
  return { date, completedQuestIds: alreadyCompleted ? completedQuestIds : [...completedQuestIds, questId], expEarned: dailyProgress.date === date ? dailyProgress.expEarned + (alreadyCompleted ? 0 : expReward) : expReward };
}

export function updateStreakForCompletion(streak: Streak, completedAt: string, timeZone?: string): Streak {
  const date = calendarDateKey(new Date(completedAt), timeZone);
  if (streak.lastCompletedDate === date) return streak;
  const nextCurrent = streak.lastCompletedDate && addCalendarDays(streak.lastCompletedDate, 1) === date ? streak.current + 1 : 1;
  return { current: nextCurrent, longest: Math.max(streak.longest, nextCurrent), lastCompletedDate: date };
}

export function buildStreakFromCompletionDates(dates: string[]): Streak {
  return [...new Set(dates.filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)))].sort().reduce((streak, date) => updateStreakForCompletion(streak, `${date}T12:00:00`), { current: 0, longest: 0, lastCompletedDate: null } as Streak);
}
