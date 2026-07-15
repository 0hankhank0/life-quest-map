import { describe, expect, it } from "vitest";
import { createInitialLifeQuestState, normalizeLifeQuestState } from "../data/defaults";
import { microAdventures } from "../data/microAdventures";
import { getAdventureRecommendations } from "./recommendations";

const base = {
  mood: "tired" as const,
  time: "5" as const,
  focuses: ["fitness" as const],
  occupation: "general" as const,
  favoriteAdventureIds: [], savedAdventureIds: [], dismissedAdventures: [], recentlyShownIds: [], completedTodayIds: []
};

describe("micro-adventure recommendations", () => {
  it("puts an exact mood and time match above a mismatch", () => {
    const results = getAdventureRecommendations(microAdventures, base);
    expect(results[0].adventure.moods).toContain("tired");
    expect(results[0].adventure.times).toContain("5");
  });
  it("does not select a completed adventure as the normal first choice", () => {
    const first = getAdventureRecommendations(microAdventures, base)[0].adventure.id;
    expect(getAdventureRecommendations(microAdventures, { ...base, completedTodayIds: [first] })[0].adventure.id).not.toBe(first);
  });
  it("reduces a recently dismissed adventure", () => {
    const id = getAdventureRecommendations(microAdventures, base)[0].adventure.id;
    expect(getAdventureRecommendations(microAdventures, { ...base, dismissedAdventures: [{ adventureId: id, dismissedAt: new Date().toISOString(), count: 1 }] })[0].adventure.id).not.toBe(id);
  });
  it("reduces recently shown adventures", () => {
    const id = getAdventureRecommendations(microAdventures, base)[0].adventure.id;
    expect(getAdventureRecommendations(microAdventures, { ...base, recentlyShownIds: [id] })[0].adventure.id).not.toBe(id);
  });
  it("gives a favorite a small score boost", () => {
    const target = microAdventures.find((adventure) => adventure.id === "water-and-breathe")!;
    const normal = getAdventureRecommendations([target], base)[0].score;
    const favorite = getAdventureRecommendations([target], { ...base, favoriteAdventureIds: [target.id] })[0].score;
    expect(favorite).toBeGreaterThan(normal);
  });
  it("keeps general occupation content eligible", () => {
    expect(getAdventureRecommendations(microAdventures, base).some((item) => item.adventure.occupation === "general")).toBe(true);
  });
  it("handles an empty candidate list and remains deterministic", () => {
    expect(getAdventureRecommendations([], base)).toEqual([]);
    expect(getAdventureRecommendations(microAdventures, base)).toEqual(getAdventureRecommendations(microAdventures, base));
  });
});

describe("preference migration", () => {
  it("adds safe defaults to older state", () => {
    const old = createInitialLifeQuestState();
    const normalized = normalizeLifeQuestState({ ...old, favoriteAdventureIds: undefined as never, savedAdventureIds: undefined as never, dismissedAdventures: undefined as never, recommendationHistory: undefined as never, selectedAdventureId: undefined as never });
    expect(normalized.favoriteAdventureIds).toEqual([]);
    expect(normalized.savedAdventureIds).toEqual([]);
  });
  it("deduplicates IDs and caps history at 100", () => {
    const state = createInitialLifeQuestState();
    const history = Array.from({ length: 105 }, (_, index) => ({ adventureId: String(index), shownAt: new Date().toISOString(), action: "shown" as const }));
    const normalized = normalizeLifeQuestState({ ...state, favoriteAdventureIds: ["a", "a"], savedAdventureIds: ["b", "b"], recommendationHistory: history });
    expect(normalized.favoriteAdventureIds).toEqual(["a"]);
    expect(normalized.savedAdventureIds).toEqual(["b"]);
    expect(normalized.recommendationHistory).toHaveLength(100);
  });
});
