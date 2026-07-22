import { describe, expect, it } from "vitest";
import { createInitialLifeQuestState } from "@/data/defaults";
import { importLifeQuestState, migrateLifeQuestState } from "@/lib/stateMigration";

const now = new Date("2026-07-15T12:00:00");

describe("state migration", () => {
  it("migrates a v1 state and derives new progress fields", () => {
    const old = createInitialLifeQuestState();
    const completedAt = "2026-07-15T08:00:00.000Z";
    const migrated = migrateLifeQuestState({ ...old, schemaVersion: undefined, dailyProgress: undefined, streak: undefined, customMapLocations: undefined, unlockedSkillNodeIds: undefined, userSettings: undefined, quests: [{ ...old.quests[0], status: "completed", completedAt }] }, now);
    expect(migrated.schemaVersion).toBe(9);
    expect(migrated.dailyProgress).toEqual({ date: "2026-07-15", completedQuestIds: [old.quests[0].id], expEarned: old.quests[0].expReward });
    expect(migrated.streak).toMatchObject({ current: 1, longest: 1, lastCompletedDate: "2026-07-15" });
    expect(migrated.customMapLocations).toEqual([]);
    expect(migrated.userSettings).toEqual({ theme: "system", reducedMotion: false, notificationsEnabled: false, tutorialCompletedAt: null });
    expect(migrated.savedQuotes).toEqual([]);
    expect(migrated.adventureJournal).toEqual([]);
    expect(migrated.recentAdventureQuoteIds).toEqual([]);
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
    expect(migrated.userSettings).toEqual({ theme: "system", reducedMotion: true, notificationsEnabled: false, tutorialCompletedAt: null });
    expect(migrated.customMapLocations).toEqual([]);
  });

  it("preserves legacy lifeMoments without their v0.1 optional fields", () => {
    const state = createInitialLifeQuestState();
    const migrated = migrateLifeQuestState({ ...state, lifeMoments: [{ id: "legacy", adventureName: "Walk", note: "nice", mood: "happier", completedAt: "2026-07-14T08:00:00.000Z" }] }, now);
    expect(migrated.lifeMoments).toEqual([{ id: "legacy", adventureName: "Walk", note: "nice", mood: "happier", completedAt: "2026-07-14T08:00:00.000Z", adventureId: undefined, rewardGranted: undefined }]);
  });

  it("removes unknown skill node IDs while preserving known IDs", () => {
    const state = createInitialLifeQuestState();
    const migrated = migrateLifeQuestState({ ...state, unlockedSkillNodeIds: ["learning-1", "unknown-node", "learning-1"] }, now);
    expect(migrated.unlockedSkillNodeIds).toEqual(["learning-1"]);
  });

  it("keeps valid saved quotes and safely ignores malformed legacy entries", () => {
    const state = createInitialLifeQuestState();
    const migrated = migrateLifeQuestState({ ...state, savedQuotes: [
      { id: "quote-memory:quest-1", quoteId: "main-1", text: "測試語錄", category: "main-quest", savedAt: "2026-07-15T08:00:00.000Z", sourceTitle: "測試任務", location: { name: "台北", latitude: 25.03, longitude: 121.56 } },
      { id: "bad", quoteId: 1 }
    ] }, now);
    expect(migrated.savedQuotes).toHaveLength(1);
    expect(migrated.savedQuotes[0]).toMatchObject({ id: "quote-memory:quest-1", location: { name: "台北" } });
  });

  it("preserves valid journal entries and supplies safe defaults for legacy state", () => {
    const state = createInitialLifeQuestState();
    const migrated = migrateLifeQuestState({ ...state, adventureJournal: [
      { id: "journal:one", taskId: "quest-1", taskName: "散步", completedAt: "2026-07-15T08:00:00.000Z", category: "exploration", mood: "calm", quoteId: "city-4", quoteText: "城市沒有突然改變。", quoteSourceType: "original", expReward: 20 },
      { id: "bad", taskId: 2 }
    ], recentAdventureQuoteIds: ["city-1", "city-1", 3, "city-2", "city-3", "city-4", "city-5"] }, now);
    expect(migrated.adventureJournal).toHaveLength(1);
    expect(migrated.adventureJournal[0]).toMatchObject({ taskName: "散步", mood: "calm", quoteText: "城市沒有突然改變。" });
    expect(migrated.recentAdventureQuoteIds).toEqual(["city-2", "city-3", "city-4", "city-5"]);
  });

  it("migrates text-only journal quotes into known or explicitly unverified snapshots", () => {
    const state = createInitialLifeQuestState();
    const migrated = migrateLifeQuestState({ ...state, adventureJournal: [
      { id: "journal:known", taskId: "quest-1", taskName: "散步", completedAt: "2026-07-15T08:00:00.000Z", category: "exploration", quote: "為了更美好的明天而戰。" },
      { id: "journal:unknown", taskId: "quest-2", taskName: "寫字", completedAt: "2026-07-15T09:00:00.000Z", category: "creation", quote: "舊資料自訂語錄" }
    ] }, now);
    expect(migrated.adventureJournal[0]).toMatchObject({ quoteId: "lol-jayce-better-tomorrow", quoteSpeaker: "杰西", quoteGame: "《英雄聯盟》", quoteSourceType: "game", quoteSourceStatus: "verified" });
    expect(migrated.adventureJournal[1]).toMatchObject({ quoteText: "舊資料自訂語錄", quoteSourceType: "unknown", quoteSourceStatus: "likely" });
    expect(migrateLifeQuestState(migrated, now).adventureJournal).toEqual(migrated.adventureJournal);
  });

  it("preserves modern quote sources and backfills their source URL from the current catalog", () => {
    const state = createInitialLifeQuestState();
    const text = "個人獎項是其次，真正重要的是團隊。";
    const migrated = migrateLifeQuestState({ ...state, adventureJournal: [
      { id: "journal:football", taskId: "quest-1", taskName: "散步", completedAt: "2026-07-15T08:00:00.000Z", category: "connection", quoteId: "football-messi-team-counts", quoteText: text, quoteSourceType: "football", quoteSourceStatus: "verified" },
      { id: "journal:old", taskId: "quest-2", taskName: "寫字", completedAt: "2026-07-15T09:00:00.000Z", category: "creation", quoteId: "city-1", quoteText: "平凡不是空白，只是它很少被好好記住。", quoteSourceType: "original", quoteSourceStatus: "original" }
    ] }, now);
    expect(migrated.adventureJournal[0]).toMatchObject({ quoteSourceType: "football", quoteSourceUrl: "https://inside.fifa.com/news/messi-its-the-team-that-counts" });
    expect(migrated.adventureJournal[1].quoteSourceUrl).toBeUndefined();
    expect(migrateLifeQuestState(migrated, now).adventureJournal).toEqual(migrated.adventureJournal);
  });

  it("starts new accounts with an unfinished beginner guide", () => {
    const state = createInitialLifeQuestState();
    expect(state.schemaVersion).toBe(9);
    expect(state.userSettings.tutorialCompletedAt).toBeNull();
  });

  it("marks legacy users with a profile as having completed the guide", () => {
    const state = createInitialLifeQuestState();
    const profile = {
      id: "legacy-hero", name: "Legacy", lifeStage: "adult" as const, role: "creator" as const,
      occupation: "creator" as const, focus: "creativity" as const, focuses: ["creativity" as const],
      level: 3, exp: 130, createdAt: "2026-07-01T08:00:00.000Z"
    };
    const migrated = migrateLifeQuestState({ ...state, schemaVersion: 8, profile, userSettings: { theme: "dark", reducedMotion: true, notificationsEnabled: true } }, now);
    expect(migrated.userSettings).toEqual({ theme: "dark", reducedMotion: true, notificationsEnabled: true, tutorialCompletedAt: now.toISOString() });
  });

  it("keeps the guide unfinished for legacy data without a profile", () => {
    const state = createInitialLifeQuestState();
    const migrated = migrateLifeQuestState({ ...state, schemaVersion: 8, profile: null, userSettings: { theme: "system", reducedMotion: false, notificationsEnabled: false } }, now);
    expect(migrated.userSettings.tutorialCompletedAt).toBeNull();
  });

  it("preserves a saved guide timestamp and all unrelated persisted data", () => {
    const state = createInitialLifeQuestState();
    const completedAt = "2026-07-14T08:00:00.000Z";
    const migrated = migrateLifeQuestState({ ...state, profile: { id: "hero", name: "Ava", lifeStage: "student", studentStage: "university", role: "athlete", occupation: "student", focus: "fitness", focuses: ["fitness"], level: 2, exp: 50, createdAt: completedAt }, userSettings: { theme: "dark", reducedMotion: true, notificationsEnabled: true, tutorialCompletedAt: completedAt }, favoriteAdventureIds: ["walk"], savedAdventureIds: ["read"], adventureJournal: [{ id: "journal:one", taskId: "quest-1", taskName: "散步", completedAt, category: "exploration", mood: "calm", quoteId: "city-4", quoteText: "城市沒有突然改變。", quoteSourceType: "original" }] }, now);
    expect(migrated.userSettings).toEqual({ theme: "dark", reducedMotion: true, notificationsEnabled: true, tutorialCompletedAt: completedAt });
    expect(migrated.favoriteAdventureIds).toEqual(["walk"]);
    expect(migrated.savedAdventureIds).toEqual(["read"]);
    expect(migrated.adventureJournal).toHaveLength(1);
  });
});

describe("state import", () => {
  it("rejects malformed JSON and non-object documents", () => {
    expect(importLifeQuestState("{")).toEqual({ success: false });
    expect(importLifeQuestState("[]")).toEqual({ success: false });
  });
});
