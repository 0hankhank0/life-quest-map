import { describe, expect, it } from "vitest";
import { recordDailyQuestCompletion, updateStreakForCompletion } from "@/lib/dailyProgress";

const taipei = "Asia/Taipei";

describe("daily progress and streak", () => {
  it("accumulates multiple task IDs on the same date", () => {
    const first = recordDailyQuestCompletion({ date: "2026-07-15", completedQuestIds: [], expEarned: 0 }, "a", 20, "2026-07-15T08:00:00+08:00", taipei);
    expect(recordDailyQuestCompletion(first, "b", 50, "2026-07-15T17:00:00+08:00", taipei)).toEqual({ date: "2026-07-15", completedQuestIds: ["a", "b"], expEarned: 70 });
  });

  it("resets EXP on a new local day and does not duplicate a quest reward", () => {
    const today = recordDailyQuestCompletion({ date: "2026-07-14", completedQuestIds: ["old"], expEarned: 20 }, "a", 50, "2026-07-15T00:15:00+08:00", taipei);
    expect(today).toEqual({ date: "2026-07-15", completedQuestIds: ["a"], expEarned: 50 });
    expect(recordDailyQuestCompletion(today, "a", 50, "2026-07-15T20:00:00+08:00", taipei)).toEqual(today);
  });

  it("increments only once per day, continues next day, and resets after a gap", () => {
    const first = updateStreakForCompletion({ current: 0, longest: 0, lastCompletedDate: null }, "2026-07-10T08:00:00+08:00", taipei);
    const sameDay = updateStreakForCompletion(first, "2026-07-10T20:00:00+08:00", taipei);
    const nextDay = updateStreakForCompletion(sameDay, "2026-07-11T08:00:00+08:00", taipei);
    expect(sameDay).toEqual(first);
    expect(nextDay).toMatchObject({ current: 2, longest: 2, lastCompletedDate: "2026-07-11" });
    expect(updateStreakForCompletion(nextDay, "2026-07-13T08:00:00+08:00", taipei)).toMatchObject({ current: 1, longest: 2, lastCompletedDate: "2026-07-13" });
  });

  it("keeps streaks correct across Taiwan midnight", () => {
    const first = updateStreakForCompletion({ current: 0, longest: 0, lastCompletedDate: null }, "2026-07-14T15:59:59.999Z", taipei);
    expect(updateStreakForCompletion(first, "2026-07-14T16:00:00.000Z", taipei)).toMatchObject({ current: 2, lastCompletedDate: "2026-07-15" });
  });
});
