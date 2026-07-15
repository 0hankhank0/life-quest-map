import { describe, expect, it } from "vitest";
import { createInitialLifeQuestState } from "@/data/defaults";
import { getDueStatus, getQuestGuildQuests, getSubtaskProgress } from "@/lib/questSchedule";

const now = new Date("2026-07-15T12:00:00+08:00");
const taipei = "Asia/Taipei";
const base = createInitialLifeQuestState().quests[0];

describe("quest scheduling", () => {
  it("uses local due dates for today, overdue, upcoming, and no due date", () => {
    expect(getDueStatus({ ...base, dueDate: "2026-07-15" }, now, taipei)).toBe("today");
    expect(getDueStatus({ ...base, dueDate: "2026-07-14" }, now, taipei)).toBe("overdue");
    expect(getDueStatus({ ...base, dueDate: "2026-07-22" }, now, taipei)).toBe("upcoming");
    expect(getDueStatus({ ...base, dueDate: null }, now)).toBe("none");
  });

  it("groups tasks for today, upcoming, main, completed, and all", () => {
    const today = { ...base, id: "today", type: "side" as const, dueDate: "2026-07-15" };
    const daily = { ...base, id: "daily", type: "daily" as const, dueDate: null };
    const upcoming = { ...base, id: "upcoming", type: "side" as const, dueDate: "2026-07-20" };
    const main = { ...base, id: "main", type: "main" as const, dueDate: null };
    const done = { ...base, id: "done", status: "completed" as const, completedAt: "2026-07-14T10:00:00+08:00" };
    const quests = [today, daily, upcoming, main, done];
    expect(getQuestGuildQuests(quests, "today", now, taipei).map((quest) => quest.id)).toEqual(["today", "daily"]);
    expect(getQuestGuildQuests(quests, "upcoming", now, taipei).map((quest) => quest.id)).toEqual(["upcoming"]);
    expect(getQuestGuildQuests(quests, "main", now).map((quest) => quest.id)).toEqual(["main"]);
    expect(getQuestGuildQuests(quests, "completed", now).map((quest) => quest.id)).toEqual(["done"]);
    expect(getQuestGuildQuests(quests, "all", now)).toHaveLength(5);
  });

  it("calculates subtask progress safely", () => {
    expect(getSubtaskProgress({ ...base, subtasks: [] })).toEqual({ completed: 0, total: 0, percentage: 0 });
    expect(getSubtaskProgress({ ...base, subtasks: [{ id: "a", title: "A", completed: true, completedAt: "2026-07-15T10:00:00+08:00" }, { id: "b", title: "B", completed: false, completedAt: null }] })).toEqual({ completed: 1, total: 2, percentage: 50 });
  });
});
