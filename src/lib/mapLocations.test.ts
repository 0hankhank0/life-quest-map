import { describe, expect, it } from "vitest";
import { completeMapLocation } from "@/lib/questOperations";
import { createInitialLifeQuestState } from "@/data/defaults";
import { distanceInKilometers, externalNavigationUrl, getVisibleMapLocations, normalizeCustomMapLocation, normalizeCoordinates, selectedCoordinatesFromMapClick, selectedLocationAfterDelete } from "@/lib/mapLocations";

describe("map location helpers", () => {
  it("normalizes valid coordinates and rejects invalid positions", () => {
    expect(normalizeCoordinates({ lat: 25.03301234, lng: 121.56549876 })).toEqual({ lat: 25.033012, lng: 121.565499 });
    expect(normalizeCoordinates({ lat: 91, lng: 121 })).toBeNull();
    expect(normalizeCoordinates({ lat: "25", lng: 121 })).toBeNull();
  });

  it("converts browser GeolocationCoordinates latitude and longitude to map coordinates", () => {
    const browserCoordinates = { latitude: 25.03301234, longitude: 121.56549876 };
    expect(normalizeCoordinates({ lat: browserCoordinates.latitude, lng: browserCoordinates.longitude })).toEqual({ lat: 25.033012, lng: 121.565499 });
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

  it("keeps custom locations in the shared filtered task list and can hide demo locations", () => {
    const custom = normalizeCustomMapLocation({ id: "park", name: "Park", questTitle: "Walk", lat: 25, lng: 121, category: "fitness", expReward: 30 })!;
    const demo = { id: "demo", name: "Demo", type: "Demo", questTitle: "Read", lat: 24, lng: 120, category: "learning" as const, expReward: 20 };
    expect(getVisibleMapLocations([demo, custom], [], "all", null).map((item) => item.id)).toEqual(["demo", "park"]);
    expect(getVisibleMapLocations([demo, custom], [], "hide-demo", null).map((item) => item.id)).toEqual(["park"]);
  });

  it("sorts visible locations by distance only after location is available", () => {
    const far = { id: "far", name: "Far", type: "Demo", questTitle: "Far", lat: 26, lng: 121, category: "learning" as const, expReward: 20 };
    const near = { ...far, id: "near", lat: 25.01 };
    expect(getVisibleMapLocations([far, near], [], "all", null).map((item) => item.id)).toEqual(["far", "near"]);
    expect(getVisibleMapLocations([far, near], [], "all", { lat: 25, lng: 121 }).map((item) => item.id)).toEqual(["near", "far"]);
  });

  it("keeps completion filtering synchronized and creates safe navigation URLs", () => {
    const location = { id: "custom", name: "Custom", type: "Custom", questTitle: "Task", lat: 25.1, lng: 121.5, category: "exploration" as const, expReward: 10, isCustom: true };
    expect(getVisibleMapLocations([location], ["custom"], "completed", null)).toEqual([location]);
    expect(getVisibleMapLocations([location], ["custom"], "pending", null)).toEqual([]);
    expect(externalNavigationUrl(location)).toBe("https://www.google.com/maps/dir/?api=1&destination=25.1%2C121.5");
  });

  it("only creates draft coordinates in explicit selecting mode and clears deleted selection", () => {
    expect(selectedCoordinatesFromMapClick(false, { lat: 25, lng: 121 })).toBeNull();
    expect(selectedCoordinatesFromMapClick(true, { lat: 25, lng: 121 })).toEqual({ lat: 25, lng: 121 });
    expect(selectedLocationAfterDelete("custom", "custom")).toBeNull();
    expect(selectedLocationAfterDelete("other", "custom")).toBe("other");
  });
});
