import { describe, expect, it } from "vitest";
import { createInitialLifeQuestState } from "@/data/defaults";
import { getCategoryActivity, getRecentCompletedQuests, getRecentDayActivity, getTodayActivity, getWeekActivity } from "@/lib/activityStats";

const state = createInitialLifeQuestState();
const completed = (index: number, completedAt: string, category = state.quests[index].category) => ({ ...state.quests[index], category, status: "completed" as const, completedAt });

describe("activity statistics", () => {
  it("uses local dates at the Taiwan midnight boundary", () => {
    const quests = [completed(0, "2026-07-14T16:30:00.000Z")];
    expect(getTodayActivity(quests, new Date("2026-07-15T12:00:00+08:00"))).toMatchObject({ date: "2026-07-15", completedCount: 1, expEarned: quests[0].expReward });
  });

  it("returns a Monday-first seven-day summary", () => {
    const quests = [completed(0, "2026-07-13T10:00:00+08:00"), completed(1, "2026-07-15T10:00:00+08:00")];
    const week = getWeekActivity(quests, new Date("2026-07-15T12:00:00+08:00"));
    expect(week.map((day) => day.date)).toEqual(["2026-07-13", "2026-07-14", "2026-07-15", "2026-07-16", "2026-07-17", "2026-07-18", "2026-07-19"]);
    expect(week[0].completedCount).toBe(1);
    expect(week[2].completedCount).toBe(1);
  });

  it("builds heatmap data, categories, recent records, and empty summaries", () => {
    const quests = [completed(0, "2026-07-14T10:00:00+08:00", "learning"), completed(1, "2026-07-15T10:00:00+08:00", "fitness")];
    expect(getRecentDayActivity(quests, 3, new Date("2026-07-15T12:00:00+08:00")).map((day) => day.completedCount)).toEqual([0, 1, 1]);
    expect(getCategoryActivity(quests).filter((item) => item.count > 0)).toEqual([{ category: "learning", count: 1 }, { category: "fitness", count: 1 }]);
    expect(getRecentCompletedQuests(quests, 1)[0].id).toBe(quests[1].id);
    expect(getTodayActivity([], new Date("2026-07-15T12:00:00+08:00"))).toMatchObject({ completedCount: 0, expEarned: 0 });
  });
});
