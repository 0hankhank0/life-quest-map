import { describe, expect, it } from "vitest";
import { createInitialLifeQuestState } from "@/data/defaults";
import { importLifeQuestState, migrateLifeQuestState } from "@/lib/stateMigration";

const now = new Date("2026-07-15T12:00:00");

describe("v2 state migration", () => {
  it("migrates a v1 state and derives new progress fields", () => {
    const old = createInitialLifeQuestState();
    const completedAt = "2026-07-15T08:00:00.000Z";
    const migrated = migrateLifeQuestState({ ...old, schemaVersion: undefined, dailyProgress: undefined, streak: undefined, customMapLocations: undefined, unlockedSkillNodeIds: undefined, userSettings: undefined, quests: [{ ...old.quests[0], status: "completed", completedAt }] }, now);
    expect(migrated.schemaVersion).toBe(4);
    expect(migrated.dailyProgress).toEqual({ date: "2026-07-15", completedQuestIds: [old.quests[0].id], expEarned: old.quests[0].expReward });
    expect(migrated.streak).toMatchObject({ current: 1, longest: 1, lastCompletedDate: "2026-07-15" });
    expect(migrated.customMapLocations).toEqual([]);
    expect(migrated.userSettings).toEqual({ theme: "system", reducedMotion: false, notificationsEnabled: false });
  });

  it("derives daily EXP when a v2 daily summary has no expEarned field", () => {
    const old = createInitialLifeQuestState();
    const completedQuest = { ...old.quests[0], status: "completed" as const, completedAt: "2026-07-15T08:00:00.000Z" };
    const migrated = migrateLifeQuestState({ ...old, schemaVersion: 2, quests: [completedQuest], dailyProgress: { date: "2026-07-15", completedQuestIds: [completedQuest.id] } }, now);
    expect(migrated.dailyProgress).toEqual({ date: "2026-07-15", completedQuestIds: [completedQuest.id], expEarned: completedQuest.expReward });
  });

  it("adds v4 task planning defaults to v3 quests", () => {
    const old = createInitialLifeQuestState();
    const legacyQuest = { ...old.quests[0], priority: undefined, dueDate: undefined, estimatedMinutes: undefined, recurrence: undefined, subtasks: undefined, questChainId: undefined };
    const migrated = migrateLifeQuestState({ ...old, schemaVersion: 3, quests: [legacyQuest] }, now);
    expect(migrated.quests[0]).toMatchObject({ priority: "normal", dueDate: null, estimatedMinutes: null, recurrence: "none", subtasks: [], questChainId: null });
  });

  it("normalizes invalid fields independently without dropping valid quests", () => {
    const state = createInitialLifeQuestState();
    const migrated = migrateLifeQuestState({ ...state, stats: "bad", favoriteAdventureIds: ["one", 3, "one"], userSettings: { theme: "invalid", reducedMotion: true }, customMapLocations: [{ id: "bad" }] }, now);
    expect(migrated.quests).toHaveLength(state.quests.length);
    expect(migrated.stats).toEqual(state.stats);
    expect(migrated.favoriteAdventureIds).toEqual(["one"]);
    expect(migrated.userSettings).toEqual({ theme: "system", reducedMotion: true, notificationsEnabled: false });
    expect(migrated.customMapLocations).toEqual([]);
  });

  it("preserves legacy lifeMoments without their v0.1 optional fields", () => {
    const state = createInitialLifeQuestState();
    const migrated = migrateLifeQuestState({ ...state, lifeMoments: [{ id: "legacy", adventureName: "Walk", note: "nice", mood: "happier", completedAt: "2026-07-14T08:00:00.000Z" }] }, now);
    expect(migrated.lifeMoments).toEqual([{ id: "legacy", adventureName: "Walk", note: "nice", mood: "happier", completedAt: "2026-07-14T08:00:00.000Z", adventureId: undefined, rewardGranted: undefined }]);
  });
});

describe("state import", () => {
  it("rejects malformed JSON and non-object documents", () => {
    expect(importLifeQuestState("{")).toEqual({ success: false });
    expect(importLifeQuestState("[]")).toEqual({ success: false });
  });
});
