import { describe, expect, it } from "vitest";
import { adventureQuotes } from "@/data/adventureQuotes";
import { inferTaskContext, selectQuoteForTask } from "@/lib/quoteSelection";
import type { AdventureQuote, Quest } from "@/types";

const task = (title: string, category: Quest["category"] = "discipline", difficulty: Quest["difficulty"] = "easy") => ({
  id: title, title, description: "", category, type: "daily" as const, difficulty, expReward: difficulty === "hard" ? 60 : 10, questChainId: null
});
const quote = (id: string, themes: AdventureQuote["themes"], contexts: AdventureQuote["contexts"], intensity: AdventureQuote["intensity"] = "normal"): AdventureQuote => ({
  id, text: id, categories: ["daily"], sourceType: "original", sourceStatus: "original", sourceTitle: "test", enabled: true, themes, contexts, intensity
});

describe("semantic quote selection", () => {
  it("classifies required Traditional Chinese task contexts", () => {
    expect(inferTaskContext(task("複習英文單字")).context).toBe("study");
    expect(inferTaskContext(task("跑步 3 公里")).context).toBe("exercise");
    expect(inferTaskContext(task("整理房間")).context).toBe("daily");
    expect(inferTaskContext(task("完成作品集設計")).context).toBe("creative");
    expect(inferTaskContext(task("和家人吃飯")).context).toBe("social");
  });

  it("prefers learning, action, creativity, and relationship themes for matching tasks", () => {
    const quotes = [quote("learn", ["learning", "growth"], ["study"]), quote("run", ["action", "persistence"], ["exercise"]), quote("create", ["creativity"], ["creative"]), quote("social", ["relationships"], ["social"]), quote("other", ["reflection"], ["general"])];
    expect(selectQuoteForTask({ task: task("複習英文單字"), quotes, random: () => 0 }).id).toBe("learn");
    expect(selectQuoteForTask({ task: task("跑步 3 公里"), quotes, random: () => 0 }).id).toBe("run");
    expect(selectQuoteForTask({ task: task("完成作品集設計"), quotes, random: () => 0 }).id).toBe("create");
    expect(selectQuoteForTask({ task: task("和家人吃飯"), quotes, random: () => 0 }).id).toBe("social");
  });

  it("strongly avoids epic quotes for a small daily task, but permits them for hard work", () => {
    const quotes = [quote("gentle", ["daily-life", "growth"], ["daily"], "gentle"), quote("epic", ["courage", "persistence"], ["daily"], "epic")];
    expect(selectQuoteForTask({ task: task("整理房間"), quotes, random: () => 0 }).id).toBe("gentle");
    expect(selectQuoteForTask({ task: task("困難的長期挑戰", "discipline", "hard"), quotes, random: () => 0 }).id).toBe("epic");
  });

  it("does not repeat a recent quote when another candidate exists and safely falls back for unknown tasks", () => {
    const quotes = [quote("recent", ["growth"], ["general"]), quote("fresh", ["growth"], ["general"])];
    expect(selectQuoteForTask({ task: task("未分類事項"), quotes, recentQuoteIds: ["recent"], random: () => 0 }).id).toBe("fresh");
    expect(selectQuoteForTask({ task: task("未分類事項"), quotes: [quotes[0]], recentQuoteIds: ["recent"], random: () => 0 }).id).toBe("recent");
  });

  it("enriches the existing catalog without requiring legacy quote fields", () => {
    expect(adventureQuotes).toHaveLength(86);
    expect(adventureQuotes.every((item) => item.themes?.length && item.contexts?.length && item.intensity)).toBe(true);
    expect(selectQuoteForTask({ task: task("任何事情"), quotes: [{ ...quote("legacy", undefined, undefined), themes: undefined, contexts: undefined, intensity: undefined }], random: () => 0 }).id).toBe("legacy");
  });
});
