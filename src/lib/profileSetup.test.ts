import { describe, expect, it } from "vitest";
import { createInitialLifeQuestState } from "@/data/defaults";
import { saveProfileSetup, startDirectExperience, type OnboardingInput } from "@/lib/profileSetup";
import { migrateLifeQuestState } from "@/lib/stateMigration";
import { completeQuest } from "@/lib/questOperations";

const now = "2026-10-09T04:00:00.000Z";
const input: OnboardingInput = { name: "新角色", lifeStage: "student", studentStage: "university", role: "creator", occupation: "student", focuses: ["creativity", "learning"] };

describe("deferred profile setup", () => {
  it("starts without settings and keeps the guide deferred across migration", () => {
    const initial = createInitialLifeQuestState();
    const state = startDirectExperience(initial, now);
    expect(state.profile).toMatchObject({ name: "冒險者", exp: 0, level: 1, setupCompletedAt: null });
    expect(state.quests).toEqual(initial.quests);
    expect(state.userSettings).toMatchObject({ tutorialCompletedAt: null, tutorialDeferred: true });
    const restored = migrateLifeQuestState(JSON.parse(JSON.stringify(state)));
    expect(restored.profile).toEqual(state.profile);
    expect(restored.userSettings).toEqual(state.userSettings);
  });

  it("fills settings after earning rewards without resetting progress or identity", () => {
    const started = startDirectExperience(createInitialLifeQuestState(), now);
    const progressed = completeQuest(started, started.quests[0].id);
    expect(progressed.profile!.exp).toBeGreaterThan(0);
    const saved = saveProfileSetup(progressed, input, "2026-10-09T05:00:00.000Z");
    expect(saved.profile).toMatchObject({ ...input, id: progressed.profile!.id, exp: progressed.profile!.exp, level: progressed.profile!.level, createdAt: now, setupCompletedAt: "2026-10-09T05:00:00.000Z" });
    expect({ ...saved, profile: progressed.profile }).toEqual(progressed);
  });

  it("keeps normal onboarding's guide and leaves existing accounts intact on direct entry", () => {
    const state = saveProfileSetup(createInitialLifeQuestState(), input, now);
    expect(state.profile!.setupCompletedAt).toBe(now);
    expect(state.userSettings.tutorialCompletedAt).toBeNull();
    expect(state.userSettings.tutorialDeferred).not.toBe(true);
    expect(startDirectExperience(state)).toBe(state);
  });

  it("rejects invalid names and custom occupations without changing progress", () => {
    const state = startDirectExperience(createInitialLifeQuestState(), now);
    expect(saveProfileSetup(state, { ...input, name: " " })).toBe(state);
    expect(saveProfileSetup(state, { ...input, lifeStage: "adult", occupation: "custom", customOccupationName: " " })).toBe(state);
  });

  it("saves a custom occupation once and clears it when returning to a student stage", () => {
    const custom = { ...input, lifeStage: "adult" as const, occupation: "custom" as const, customOccupationName: "手作職人", occupationSuggestion: "材料探索" };
    const state = saveProfileSetup(createInitialLifeQuestState(), custom, now);
    const savedAgain = saveProfileSetup(state, custom, now);
    expect(savedAgain.occupationSuggestions).toHaveLength(1);
    const student = saveProfileSetup(savedAgain, { ...custom, lifeStage: "student", studentStage: "university" }, now);
    expect(student.profile).toMatchObject({ occupation: "student", studentStage: "university" });
    expect(student.profile!.customOccupationName).toBeUndefined();
  });
});
