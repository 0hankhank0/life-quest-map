import { addCalendarDays, calendarDateKey, calendarWeekday, formatCalendarShortDate, type CalendarDate } from "@/lib/utils";
import type { LifeMoment, Quest, QuestCategory } from "@/types";

export interface DayActivity { date: CalendarDate; completedCount: number; expEarned: number }
export interface CategoryActivity { category: QuestCategory; count: number }

export function getCompletedQuests(quests: Quest[]): Quest[] { return quests.filter((quest) => quest.status === "completed" && quest.completedAt !== null); }

function countByDate(quests: Quest[], timeZone?: string): Map<CalendarDate, { count: number; exp: number }> {
  return quests.reduce((summary, quest) => {
    if (!quest.completedAt) return summary;
    const date = calendarDateKey(new Date(quest.completedAt), timeZone);
    const current = summary.get(date) ?? { count: 0, exp: 0 };
    summary.set(date, { count: current.count + 1, exp: current.exp + quest.expReward });
    return summary;
  }, new Map<CalendarDate, { count: number; exp: number }>());
}

export function getTodayActivity(quests: Quest[], now = new Date(), timeZone?: string): DayActivity {
  const date = calendarDateKey(now, timeZone);
  const activity = countByDate(getCompletedQuests(quests), timeZone).get(date) ?? { count: 0, exp: 0 };
  return { date, completedCount: activity.count, expEarned: activity.exp };
}

export function getWeekActivity(quests: Quest[], now = new Date(), timeZone?: string): DayActivity[] {
  const current = calendarDateKey(now, timeZone);
  const weekday = calendarWeekday(current);
  const monday = addCalendarDays(current, weekday === 0 ? -6 : 1 - weekday);
  const activityByDate = countByDate(getCompletedQuests(quests), timeZone);
  return Array.from({ length: 7 }, (_, index) => {
    const date = addCalendarDays(monday, index);
    const activity = activityByDate.get(date) ?? { count: 0, exp: 0 };
    return { date, completedCount: activity.count, expEarned: activity.exp };
  });
}

export function getRecentDayActivity(quests: Quest[], days = 30, now = new Date(), timeZone?: string): DayActivity[] {
  const activityByDate = countByDate(getCompletedQuests(quests), timeZone);
  const current = calendarDateKey(now, timeZone);
  return Array.from({ length: days }, (_, index) => {
    const date = addCalendarDays(current, index - (days - 1));
    const activity = activityByDate.get(date) ?? { count: 0, exp: 0 };
    return { date, completedCount: activity.count, expEarned: activity.exp };
  });
}

export function getCategoryActivity(quests: Quest[]): CategoryActivity[] {
  const categories: QuestCategory[] = ["learning", "fitness", "creativity", "social", "discipline", "exploration"];
  const completed = getCompletedQuests(quests);
  return categories.map((category) => ({ category, count: completed.filter((quest) => quest.category === category).length }));
}
export function getRecentCompletedQuests(quests: Quest[], limit = 3): Quest[] { return getCompletedQuests(quests).slice().sort((first, second) => (second.completedAt ?? "").localeCompare(first.completedAt ?? "")).slice(0, limit); }
export function getRecentLifeMoments(lifeMoments: LifeMoment[]): LifeMoment[] { return lifeMoments.slice().sort((first, second) => second.completedAt.localeCompare(first.completedAt)); }
export const formatLocalShortDate = formatCalendarShortDate;
