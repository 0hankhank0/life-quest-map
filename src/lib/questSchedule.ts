import { todayKey } from "@/lib/utils";
import type { Quest } from "@/types";

export type QuestGuildSection = "today" | "inProgress" | "upcoming" | "main" | "completed" | "all";

function localDate(date: string): Date {
  return new Date(`${date}T12:00:00`);
}

function dayDifference(from: string, to: string): number {
  return Math.round((localDate(to).getTime() - localDate(from).getTime()) / (24 * 60 * 60 * 1000));
}

export function getDueStatus(quest: Quest, now = new Date()): "none" | "today" | "overdue" | "upcoming" {
  if (!quest.dueDate) return "none";
  const difference = dayDifference(todayKey(now), quest.dueDate);
  if (difference < 0) return "overdue";
  if (difference === 0) return "today";
  return "upcoming";
}

export function getSubtaskProgress(quest: Quest): { completed: number; total: number; percentage: number } {
  const total = quest.subtasks.length;
  const completed = quest.subtasks.filter((subtask) => subtask.completed).length;
  return { completed, total, percentage: total ? Math.round((completed / total) * 100) : 0 };
}

export function getQuestGuildQuests(quests: Quest[], section: QuestGuildSection, now = new Date()): Quest[] {
  const pending = quests.filter((quest) => quest.status === "pending");
  switch (section) {
    case "today": return pending.filter((quest) => quest.type === "daily" || getDueStatus(quest, now) === "today");
    case "inProgress": return pending.filter((quest) => quest.type !== "main" && quest.type !== "daily" && getDueStatus(quest, now) !== "today");
    case "upcoming": return pending.filter((quest) => {
      if (!quest.dueDate) return false;
      const difference = dayDifference(todayKey(now), quest.dueDate);
      return difference > 0 && difference <= 7;
    });
    case "main": return pending.filter((quest) => quest.type === "main");
    case "completed": return quests.filter((quest) => quest.status === "completed");
    case "all": return quests;
  }
}
