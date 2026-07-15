import { describe, expect, it } from "vitest";
import { microAdventures } from "@/data/microAdventures";
import { getNextDisplayedAdventureId, resolveDisplayedAdventure } from "./displayedAdventure";

const recommendations = microAdventures.slice(0, 2).map((adventure, index) => ({ adventure, score: 2 - index, reasons: [] }));

describe("displayed adventure", () => {
  it("keeps a valid displayed ID when ranking changes", () => {
    expect(resolveDisplayedAdventure(recommendations, microAdventures[1].id)?.adventure.id).toBe(microAdventures[1].id);
  });
  it("falls back safely and selects a different next ID", () => {
    expect(resolveDisplayedAdventure(recommendations, "missing")?.adventure.id).toBe(microAdventures[0].id);
    expect(getNextDisplayedAdventureId(recommendations, microAdventures[0].id)).toBe(microAdventures[1].id);
    expect(getNextDisplayedAdventureId([], microAdventures[0].id)).toBeNull();
  });
});
