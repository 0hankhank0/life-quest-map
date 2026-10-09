import { describe, expect, it } from "vitest";
import { createInitialLifeQuestState } from "../data/defaults";
import { migrateLifeQuestState } from "./stateMigration";
import { microAdventures, type AdventureLocation, type AdventureTimeOfDay, type AvailableTime } from "../data/microAdventures";
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
  it("discourages categories that were shown repeatedly", () => {
    const target = microAdventures[0];
    const normal = getAdventureRecommendations([target], base)[0].score;
    const varied = getAdventureRecommendations([target], { ...base, recentlyShownCategories: [target.category, target.category] })[0].score;
    expect(varied).toBeLessThan(normal);
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
  it("only recommends activities that fit the selected scene, period and time budget", () => {
    for (const location of ["home", "indoor", "outdoor"] as AdventureLocation[]) {
      for (const timeOfDay of ["morning", "afternoon", "evening"] as AdventureTimeOfDay[]) {
        for (const time of ["5", "15", "30", "60"] as AvailableTime[]) {
          const results = getAdventureRecommendations(microAdventures, { ...base, location, timeOfDay, time });
          expect(results.length).toBeGreaterThan(0);
          for (const { adventure } of results) {
            expect(adventure.locations).toContain(location);
            expect(adventure.timesOfDay).toContain(timeOfDay);
            expect(Math.min(...adventure.times.map(Number))).toBeLessThanOrEqual(Number(time));
          }
        }
      }
    }
  });
  it("excludes trips from home and does not let favorites bypass scene restrictions", () => {
    const results = getAdventureRecommendations(microAdventures, { ...base, mood: "out", time: "60", location: "home", favoriteAdventureIds: ["night-market-sensory-patrol", "metro-art-underground"] });
    expect(results.some(({ adventure }) => adventure.id === "map-pin")).toBe(true);
    expect(results.some(({ adventure }) => adventure.id === "night-market-sensory-patrol" || adventure.id === "metro-art-underground")).toBe(false);
  });
  it("keeps morning markets, night markets and daylight rides in their appropriate periods", () => {
    const eligibleIds = (timeOfDay: AdventureTimeOfDay) => getAdventureRecommendations(microAdventures, { ...base, time: "60", location: "outdoor", timeOfDay }).map(({ adventure }) => adventure.id);
    expect(eligibleIds("morning")).toContain("morning-market-scout");
    expect(eligibleIds("morning")).not.toContain("night-market-sensory-patrol");
    expect(eligibleIds("evening")).toContain("night-market-sensory-patrol");
    expect(eligibleIds("evening")).not.toContain("morning-market-scout");
    expect(eligibleIds("evening")).not.toContain("aimless-bike-ride");
    expect(eligibleIds("evening")).not.toContain("last-light-watch");
  });
  it("includes short activities in longer budgets and states their actual estimated duration", () => {
    const adventure = microAdventures.find((item) => item.id === "water-and-breathe")!;
    const results = getAdventureRecommendations([adventure], { ...base, time: "60", location: "home", timeOfDay: "evening" });
    expect(results).toHaveLength(1);
    expect(results[0].reasons).toContain("約需 5 分鐘，在可用時間內");
    expect(results[0].reasons).toContain("適合在家進行");
    expect(results[0].reasons).toContain("適合晚上進行");
  });
  it("returns no candidates rather than silently relaxing conflicting conditions", () => {
    const market = microAdventures.find((item) => item.id === "morning-market-scout")!;
    expect(getAdventureRecommendations([market], { ...base, time: "60", location: "home", timeOfDay: "morning" })).toEqual([]);
    expect(getAdventureRecommendations([market], { ...base, time: "60", location: "outdoor", timeOfDay: "evening" })).toEqual([]);
    expect(getAdventureRecommendations([market], { ...base, location: "outdoor", timeOfDay: "morning" })).toEqual([]);
  });
  it("treats unrestricted location and period the same as omitted preferences", () => {
    expect(getAdventureRecommendations(microAdventures, { ...base, location: "any", timeOfDay: "any" })).toEqual(getAdventureRecommendations(microAdventures, base));
  });
  it("keeps the expanded adventure catalogue valid and uniquely keyed", () => {
    expect(microAdventures).toHaveLength(101);
    expect(microAdventures.filter((adventure) => adventure.category === "exploration")).toHaveLength(54);
    expect(new Set(microAdventures.map((adventure) => adventure.id)).size).toBe(microAdventures.length);
    expect(new Set(microAdventures.map((adventure) => adventure.title)).size).toBe(microAdventures.length);
    for (const adventure of microAdventures) {
      expect(adventure.moods.length).toBeGreaterThan(0);
      expect(adventure.times.length).toBeGreaterThan(0);
      expect(adventure.locations.length).toBeGreaterThan(0);
      expect(adventure.timesOfDay.length).toBeGreaterThan(0);
    }
  });
});

describe("preference migration", () => {
  it("adds safe defaults to older state", () => {
    const old = createInitialLifeQuestState();
    const normalized = migrateLifeQuestState({ ...old, favoriteAdventureIds: undefined, savedAdventureIds: undefined, dismissedAdventures: undefined, recommendationHistory: undefined, selectedAdventureId: undefined });
    expect(normalized.favoriteAdventureIds).toEqual([]);
    expect(normalized.savedAdventureIds).toEqual([]);
  });
  it("deduplicates IDs and caps history at 100", () => {
    const state = createInitialLifeQuestState();
    const history = Array.from({ length: 105 }, (_, index) => ({ adventureId: String(index), shownAt: new Date().toISOString(), action: "shown" as const }));
    const normalized = migrateLifeQuestState({ ...state, favoriteAdventureIds: ["a", "a"], savedAdventureIds: ["b", "b"], recommendationHistory: history });
    expect(normalized.favoriteAdventureIds).toEqual(["a"]);
    expect(normalized.savedAdventureIds).toEqual(["b"]);
    expect(normalized.recommendationHistory).toHaveLength(100);
  });
});
