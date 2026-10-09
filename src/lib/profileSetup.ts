import { createId } from "@/lib/utils";
import type { GrowthFocus, LifeQuestState, LifeStage, OccupationCategory, Role, StudentStage } from "@/types";

export interface OnboardingInput {
  name: string;
  lifeStage: LifeStage;
  studentStage?: StudentStage;
  role: Role;
  occupation: OccupationCategory;
  customOccupationName?: string;
  occupationSuggestion?: string;
  focuses: GrowthFocus[];
}

export function saveProfileSetup(state: LifeQuestState, input: OnboardingInput, now = new Date().toISOString()): LifeQuestState {
  const name = input.name.trim();
  const occupation = input.lifeStage === "student" ? "student" : input.occupation;
  const customOccupationName = occupation === "custom" ? input.customOccupationName?.trim() : undefined;
  if (!name || (occupation === "custom" && !customOccupationName)) return state;
  const focuses: GrowthFocus[] = input.focuses.length ? [...input.focuses] : ["learning"];
  const note = input.occupationSuggestion?.trim() ?? "";
  const addSuggestion = customOccupationName && !state.occupationSuggestions.some((item) => item.name === customOccupationName && item.note === note);
  return {
    ...state,
    occupationSuggestions: addSuggestion ? [...state.occupationSuggestions, { id: createId("occupation"), name: customOccupationName, note, createdAt: now }] : state.occupationSuggestions,
    profile: {
      id: state.profile?.id ?? createId("hero"),
      name,
      lifeStage: input.lifeStage,
      studentStage: input.lifeStage === "student" ? input.studentStage : undefined,
      role: input.role,
      occupation,
      customOccupationName,
      focus: focuses[0],
      focuses,
      exp: state.profile?.exp ?? 0,
      level: state.profile?.level ?? 1,
      createdAt: state.profile?.createdAt ?? now,
      setupCompletedAt: now
    }
  };
}

export function startDirectExperience(state: LifeQuestState, now = new Date().toISOString()): LifeQuestState {
  if (state.profile) return state;
  const next = saveProfileSetup(state, { name: "冒險者", lifeStage: "adult", role: "discipline", occupation: "general", focuses: ["exploration"] }, now);
  return {
    ...next,
    profile: { ...next.profile!, setupCompletedAt: null },
    userSettings: { ...next.userSettings, tutorialDeferred: true }
  };
}
