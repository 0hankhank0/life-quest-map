import { describe, expect, it } from "vitest";
import { appendRecommendationHistory, toggleUniqueId } from "./adventurePreferences";

describe("adventure preferences", () => {
  it("adds and removes a unique preference ID", () => {
    expect(toggleUniqueId([], "a")).toEqual(["a"]);
    expect(toggleUniqueId(["a"], "a")).toEqual([]);
  });

  it("does not append duplicate consecutive shown entries and caps history", () => {
    const shown = appendRecommendationHistory([], "a", "shown", "2026-07-15T00:00:00.000Z");
    expect(appendRecommendationHistory(shown, "a", "shown", "2026-07-15T00:01:00.000Z")).toBe(shown);
    const history = Array.from({ length: 100 }, (_, index) => ({ adventureId: String(index), shownAt: "2026-07-15T00:00:00.000Z", action: "shown" as const }));
    expect(appendRecommendationHistory(history, "next", "shown")).toHaveLength(100);
  });
});
