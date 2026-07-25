import { describe, expect, it } from "vitest";
import { shouldShowCompletionQuote } from "@/lib/completionQuoteTrigger";
import { createInitialLifeQuestState } from "@/data/defaults";
import type { Quest } from "@/types";

const now = new Date("2026-07-25T12:00:00.000Z");
const task = (difficulty: Quest["difficulty"] = "easy"): Quest => ({ id: "task", title: "任務", description: "", type: "daily", category: "discipline", occupation: "general", difficulty, expReward: difficulty === "hard" ? 100 : 20, status: "completed", createdAt: now.toISOString(), completedAt: now.toISOString(), priority: "normal", dueDate: null, estimatedMinutes: null, recurrence: "none", subtasks: [], questChainId: null });

describe("completion quote trigger", () => {
  it("always shows for meaningful completion events", () => {
    const state = createInitialLifeQuestState();
    expect(shouldShowCompletionQuote({ state, task: task("hard"), now, random: () => 1 })).toMatchObject({ show: true, reason: "hard-quest" });
    expect(shouldShowCompletionQuote({ state, task: task(), now, isMicroAdventure: true })).toMatchObject({ show: true, reason: "micro-adventure" });
    expect(shouldShowCompletionQuote({ state: { ...state, streak: { current: 7, longest: 7, lastCompletedDate: "2026-07-25" } }, task: task(), now })).toMatchObject({ show: true, reason: "streak-milestone" });
  });

  it("uses deterministic chance, cooldown, and daily cap for routine tasks", () => {
    const state = createInitialLifeQuestState();
    expect(shouldShowCompletionQuote({ state, task: task(), now, random: () => 0.24 }).show).toBe(true);
    expect(shouldShowCompletionQuote({ state, task: task(), now, random: () => 0.25 }).show).toBe(false);
    const cooled = { ...state, completionQuoteEvents: [{ taskId: "before", shownAt: "2026-07-25T11:50:00.000Z" }] };
    expect(shouldShowCompletionQuote({ state: cooled, task: task(), now, random: () => 0 }).show).toBe(false);
    const capped = { ...state, completionQuoteEvents: ["08", "09", "10"].map((hour) => ({ taskId: hour, shownAt: `2026-07-25T${hour}:00:00.000Z` })) };
    expect(shouldShowCompletionQuote({ state: capped, task: task(), now, random: () => 0 }).show).toBe(false);
  });
});
