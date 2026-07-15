import { todayKey } from "@/lib/utils";
import type { LifeMoment, Quest, QuestCategory } from "@/types";

export interface DayActivity {
  date: string;
  completedCount: number;
  expEarned: number;
}

export interface CategoryActivity {
  category: QuestCategory;
  count: number;
}

export function getCompletedQuests(quests: Quest[]): Quest[] {
  return quests.filter((quest) => quest.status === "completed" && quest.completedAt !== null);
}

function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, amount: number): Date {
  const result = startOfDay(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function countByDate(quests: Quest[]): Map<string, { count: number; exp: number }> {
  return quests.reduce((summary, quest) => {
    if (!quest.completedAt) return summary;
    const date = todayKey(new Date(quest.completedAt));
    const current = summary.get(date) ?? { count: 0, exp: 0 };
    summary.set(date, { count: current.count + 1, exp: current.exp + quest.expReward });
    return summary;
  }, new Map<string, { count: number; exp: number }>());
}

export function getTodayActivity(quests: Quest[], now = new Date()): DayActivity {
  const date = todayKey(now);
  const activity = countByDate(getCompletedQuests(quests)).get(date) ?? { count: 0, exp: 0 };
  return { date, completedCount: activity.count, expEarned: activity.exp };
}

export function getWeekActivity(quests: Quest[], now = new Date()): DayActivity[] {
  const current = startOfDay(now);
  const day = current.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = addDays(current, mondayOffset);
  const activityByDate = countByDate(getCompletedQuests(quests));

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(monday, index);
    const key = todayKey(date);
    const activity = activityByDate.get(key) ?? { count: 0, exp: 0 };
    return { date: key, completedCount: activity.count, expEarned: activity.exp };
  });
}

export function getRecentDayActivity(quests: Quest[], days = 30, now = new Date()): DayActivity[] {
  const activityByDate = countByDate(getCompletedQuests(quests));
  return Array.from({ length: days }, (_, index) => {
    const date = addDays(now, index - (days - 1));
    const key = todayKey(date);
    const activity = activityByDate.get(key) ?? { count: 0, exp: 0 };
    return { date: key, completedCount: activity.count, expEarned: activity.exp };
  });
}

export function getCategoryActivity(quests: Quest[]): CategoryActivity[] {
  const categories: QuestCategory[] = ["learning", "fitness", "creativity", "social", "discipline", "exploration"];
  const completed = getCompletedQuests(quests);
  return categories.map((category) => ({ category, count: completed.filter((quest) => quest.category === category).length }));
}

export function getRecentCompletedQuests(quests: Quest[], limit = 3): Quest[] {
  return getCompletedQuests(quests).slice().sort((first, second) =>
    (second.completedAt ?? "").localeCompare(first.completedAt ?? "")
  ).slice(0, limit);
}

export function getRecentLifeMoments(lifeMoments: LifeMoment[]): LifeMoment[] {
  return lifeMoments.slice().sort((first, second) => second.completedAt.localeCompare(first.completedAt));
}

export function formatLocalShortDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
