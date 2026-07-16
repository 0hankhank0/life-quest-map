import { describe, expect, it } from "vitest";
import { microAdventures } from "@/data/microAdventures";
import { getNextDisplayedAdventureId, resolveDisplayedAdventure, shouldRecordShown } from "./displayedAdventure";

const recommendations = microAdventures.slice(0, 2).map((adventure, index) => ({ adventure, score: 2 - index, reasons: [] }));

describe("displayed adventure", () => {
  it("keeps a valid displayed ID when ranking changes", () => {
    expect(resolveDisplayedAdventure(recommendations, microAdventures[1].id)?.adventure.id).toBe(microAdventures[1].id);
  });
  it("keeps the initial card stable after shown history reorders rankings", () => {
    const initialId = recommendations[0].adventure.id;
    const reordered = [...recommendations].reverse();
    expect(resolveDisplayedAdventure(reordered, initialId)?.adventure.id).toBe(initialId);
  });
  it("changes exactly to the next available card for shuffle, mood, or time changes", () => {
    const initialId = recommendations[0].adventure.id;
    const nextId = getNextDisplayedAdventureId(recommendations, initialId);
    expect(nextId).toBe(recommendations[1].adventure.id);
    expect(getNextDisplayedAdventureId(recommendations, nextId)).toBe(initialId);
  });
  it("records shown only once for the same displayed card", () => {
    const initialId = recommendations[0].adventure.id;
    expect(shouldRecordShown(null, initialId)).toBe(true);
    expect(shouldRecordShown(initialId, initialId)).toBe(false);
    expect(shouldRecordShown(initialId, recommendations[1].adventure.id)).toBe(true);
  });
  it("falls back safely and selects a different next ID", () => {
    expect(resolveDisplayedAdventure(recommendations, "missing")?.adventure.id).toBe(microAdventures[0].id);
    expect(getNextDisplayedAdventureId(recommendations, microAdventures[0].id)).toBe(microAdventures[1].id);
    expect(getNextDisplayedAdventureId([], microAdventures[0].id)).toBeNull();
  });
});
