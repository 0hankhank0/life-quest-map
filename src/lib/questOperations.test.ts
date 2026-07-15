import { describe, expect, it } from "vitest";
import { createInitialLifeQuestState, mapLocations } from "@/data/defaults";
import { completeMapLocation, completeMicroAdventure, completeQuest } from "@/lib/questOperations";

describe("completion rewards", () => {
  it("does not reward an ordinary quest twice", () => {
    const initial = { ...createInitialLifeQuestState(), profile: { ...createInitialLifeQuestState().profile!, exp: 0, level: 1 } };
    initial.profile = { id: "hero", name: "Hero", lifeStage: "adult", role: "creator", occupation: "general", focus: "learning", focuses: ["learning"], exp: 0, level: 1, createdAt: "2026-07-15T00:00:00" };
    const once = completeQuest(initial, initial.quests[0].id, "2026-07-15T10:00:00+08:00");
    expect(completeQuest(once, initial.quests[0].id, "2026-07-15T11:00:00+08:00")).toEqual(once);
  });

  it("does not reward the same micro-adventure or map location twice", () => {
    const base = createInitialLifeQuestState();
    const withProfile = { ...base, profile: { id: "hero", name: "Hero", lifeStage: "adult" as const, role: "creator" as const, occupation: "general" as const, focus: "learning" as const, focuses: ["learning" as const], exp: 0, level: 1, createdAt: "2026-07-15T00:00:00" } };
    const micro = completeMicroAdventure(withProfile, "walk", { title: "Walk", description: "", type: "daily", category: "fitness", occupation: "general", difficulty: "easy" }, "", "happier", "2026-07-15T10:00:00+08:00");
    expect(completeMicroAdventure(micro, "walk", { title: "Walk", description: "", type: "daily", category: "fitness", occupation: "general", difficulty: "easy" }, "", "happier", "2026-07-15T11:00:00+08:00")).toEqual(micro);
    const map = completeMapLocation(withProfile, mapLocations[0], "2026-07-15T10:00:00+08:00");
    expect(completeMapLocation(map, mapLocations[0], "2026-07-15T11:00:00+08:00")).toEqual(map);
  });
});
