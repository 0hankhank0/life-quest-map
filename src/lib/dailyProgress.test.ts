import { describe, expect, it } from "vitest";
import { recordDailyQuestCompletion, updateStreakForCompletion } from "@/lib/dailyProgress";

describe("daily progress and streak", () => {
  it("accumulates multiple task IDs on the same date", () => {
    const first = recordDailyQuestCompletion({ date: "2026-07-15", completedQuestIds: [] }, "a", "2026-07-15T08:00:00");
    expect(recordDailyQuestCompletion(first, "b", "2026-07-15T17:00:00")).toEqual({ date: "2026-07-15", completedQuestIds: ["a", "b"] });
  });

  it("increments only once per day, continues next day, and resets after a gap", () => {
    const first = updateStreakForCompletion({ current: 0, longest: 0, lastCompletedDate: null }, "2026-07-10T08:00:00");
    const sameDay = updateStreakForCompletion(first, "2026-07-10T20:00:00");
    const nextDay = updateStreakForCompletion(sameDay, "2026-07-11T08:00:00");
    expect(sameDay).toEqual(first);
    expect(nextDay).toMatchObject({ current: 2, longest: 2, lastCompletedDate: "2026-07-11" });
    expect(updateStreakForCompletion(nextDay, "2026-07-13T08:00:00")).toMatchObject({ current: 1, longest: 2, lastCompletedDate: "2026-07-13" });
  });
});
