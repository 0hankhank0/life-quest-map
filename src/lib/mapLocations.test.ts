import { describe, expect, it } from "vitest";
import { completeMapLocation } from "@/lib/questOperations";
import { createInitialLifeQuestState } from "@/data/defaults";
import { distanceInKilometers, normalizeCustomMapLocation, normalizeCoordinates } from "@/lib/mapLocations";

describe("map location helpers", () => {
  it("normalizes valid coordinates and rejects invalid positions", () => {
    expect(normalizeCoordinates({ lat: 25.03301234, lng: 121.56549876 })).toEqual({ lat: 25.033012, lng: 121.565499 });
    expect(normalizeCoordinates({ lat: 91, lng: 121 })).toBeNull();
    expect(normalizeCoordinates({ lat: "25", lng: 121 })).toBeNull();
  });

  it("normalizes custom locations without keeping unknown fields", () => {
    expect(normalizeCustomMapLocation({ id: "park", name: " Park ", questTitle: " Walk ", type: "", notes: " note ", lat: 25, lng: 121, category: "fitness", expReward: 12.6, ignored: true })).toMatchObject({ id: "park", name: "Park", questTitle: "Walk", type: "自訂地點", notes: "note", isCustom: true, expReward: 13 });
  });

  it("calculates an approximate distance", () => {
    expect(distanceInKilometers({ lat: 25.033, lng: 121.5654 }, { lat: 25.0479, lng: 121.5171 })).toBeCloseTo(5.16, 1);
  });

  it("completes a custom exploration once and awards its EXP", () => {
    const state = { ...createInitialLifeQuestState(), profile: { id: "hero", name: "Hero", lifeStage: "adult" as const, role: "creator" as const, occupation: "general" as const, focus: "exploration" as const, focuses: ["exploration" as const], level: 1, exp: 0, createdAt: "2026-01-01T00:00:00.000Z" } };
    const location = normalizeCustomMapLocation({ id: "park", name: "Park", questTitle: "Walk", lat: 25, lng: 121, category: "exploration", expReward: 30 })!;
    const completed = completeMapLocation(state, location, "2026-01-02T00:00:00.000Z");
    expect(completed.mapCompletions).toContain("park");
    expect(completed.profile?.exp).toBe(30);
    expect(completeMapLocation(completed, location).profile?.exp).toBe(30);
  });
});
