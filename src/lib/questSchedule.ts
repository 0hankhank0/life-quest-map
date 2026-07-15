import { calendarDateKey, calendarDayDifference } from "@/lib/utils";
import type { Quest } from "@/types";

export type QuestGuildSection = "today" | "inProgress" | "upcoming" | "main" | "completed" | "all";
function dayDifference(from: string, to: string): number { return calendarDayDifference(from, to); }

export function getDueStatus(quest: Quest, now = new Date(), timeZone?: string): "none" | "today" | "overdue" | "upcoming" {
  if (!quest.dueDate) return "none";
  const difference = dayDifference(calendarDateKey(now, timeZone), quest.dueDate);
  return difference < 0 ? "overdue" : difference === 0 ? "today" : "upcoming";
}
export function getSubtaskProgress(quest: Quest): { completed: number; total: number; percentage: number } { const total = quest.subtasks.length; const completed = quest.subtasks.filter((subtask) => subtask.completed).length; return { completed, total, percentage: total ? Math.round((completed / total) * 100) : 0 }; }
export function getQuestGuildQuests(quests: Quest[], section: QuestGuildSection, now = new Date(), timeZone?: string): Quest[] {
  const pending = quests.filter((quest) => quest.status === "pending");
  switch (section) {
    case "today": return pending.filter((quest) => quest.type === "daily" || getDueStatus(quest, now, timeZone) === "today");
    case "inProgress": return pending.filter((quest) => quest.type !== "main" && quest.type !== "daily" && getDueStatus(quest, now, timeZone) !== "today");
    case "upcoming": return pending.filter((quest) => quest.dueDate !== null && calendarDayDifference(calendarDateKey(now, timeZone), quest.dueDate) > 0 && calendarDayDifference(calendarDateKey(now, timeZone), quest.dueDate) <= 7);
    case "main": return pending.filter((quest) => quest.type === "main");
    case "completed": return quests.filter((quest) => quest.status === "completed");
    case "all": return quests;
  }
}
