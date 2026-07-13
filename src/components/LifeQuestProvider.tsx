"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode
} from "react";
import {
  STORAGE_KEY,
  createDefaultAchievements,
  createDemoQuests,
  createInitialLifeQuestState,
  defaultStats,
  normalizeLifeQuestState
} from "@/data/defaults";
import { getOccupationQuestPack } from "@/data/questPacks";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { evaluateAchievements } from "@/lib/achievements";
import {
  STAT_GAIN_PER_QUEST,
  addStat,
  getExpReward,
  getLevelFromExp
} from "@/lib/progression";
import { createId } from "@/lib/utils";
import type {
  GrowthFocus,
  LifeMomentMood,
  LifeStage,
  LifeQuestState,
  MapLocation,
  OccupationCategory,
  Quest,
  QuestDraft,
  Role,
  StudentStage
} from "@/types";

interface OnboardingInput {
  name: string;
  lifeStage: LifeStage;
  studentStage?: StudentStage;
  role: Role;
  occupation: OccupationCategory;
  customOccupationName?: string;
  occupationSuggestion?: string;
  focuses: GrowthFocus[];
}

interface LifeQuestContextValue {
  state: LifeQuestState;
  isHydrated: boolean;
  onboard: (input: OnboardingInput) => void;
  addQuest: (draft: QuestDraft) => void;
  addOccupationQuestPack: (occupation: OccupationCategory) => number;
  updateQuest: (questId: string, draft: QuestDraft) => void;
  deleteQuest: (questId: string) => void;
  completeQuest: (questId: string) => void;
  completeMicroAdventure: (
    draft: QuestDraft,
    note: string,
    mood: LifeMomentMood
  ) => void;
  completeMapLocation: (location: MapLocation) => void;
  resetAppData: () => void;
  restoreDemoData: () => void;
  exportData: () => string;
  importData: (rawJson: string) => { success: boolean; message: string };
}

const LifeQuestContext = createContext<LifeQuestContextValue | null>(null);

function awardExp(state: LifeQuestState, amount: number): LifeQuestState {
  if (!state.profile) {
    return state;
  }

  const exp = state.profile.exp + amount;

  return {
    ...state,
    profile: {
      ...state.profile,
      exp,
      level: getLevelFromExp(exp)
    }
  };
}

export function LifeQuestProvider({ children }: { children: ReactNode }) {
  const createInitial = useCallback(() => createInitialLifeQuestState(), []);
  const normalizeState = useCallback((value: LifeQuestState) => normalizeLifeQuestState(value), []);
  const [state, setState, isHydrated] = useLocalStorage(
    STORAGE_KEY,
    createInitial,
    normalizeState
  );

  const onboard = useCallback(
    (input: OnboardingInput) => {
      setState((current) => ({
        ...current,
        occupationSuggestions:
          input.occupation === "custom" && input.customOccupationName?.trim()
            ? [
                ...current.occupationSuggestions,
                {
                  id: createId("occupation"),
                  name: input.customOccupationName.trim(),
                  note: input.occupationSuggestion?.trim() ?? "",
                  createdAt: new Date().toISOString()
                }
              ]
            : current.occupationSuggestions,
        profile: {
          id: createId("hero"),
          name: input.name.trim(),
          lifeStage: input.lifeStage,
          studentStage: input.lifeStage === "student" ? input.studentStage : undefined,
          role: input.role,
          occupation: input.occupation,
          customOccupationName:
            input.occupation === "custom" ? input.customOccupationName?.trim() : undefined,
          focus: input.focuses[0] ?? "learning",
          focuses: input.focuses.length > 0 ? input.focuses : ["learning"],
          exp: 0,
          level: 1,
          createdAt: new Date().toISOString()
        }
      }));
    },
    [setState]
  );

  const addQuest = useCallback(
    (draft: QuestDraft) => {
      setState((current) => {
        const quest: Quest = {
          id: createId("quest"),
          ...draft,
          expReward: getExpReward(draft.difficulty),
          status: "pending",
          createdAt: new Date().toISOString(),
          completedAt: null
        };

        return {
          ...current,
          quests: [quest, ...current.quests]
        };
      });
    },
    [setState]
  );

  const addOccupationQuestPack = useCallback(
    (occupation: OccupationCategory) => {
      const pack = getOccupationQuestPack(occupation);
      if (!pack) {
        return 0;
      }

      const existingTitles = new Set(
        state.quests.map((quest) => `${quest.occupation}:${quest.title}`)
      );
      const now = new Date().toISOString();
      const questsToAdd = pack.quests
        .filter((draft) => !existingTitles.has(`${draft.occupation}:${draft.title}`))
        .map((draft) => ({
          id: createId("pack"),
          ...draft,
          expReward: getExpReward(draft.difficulty),
          status: "pending" as const,
          createdAt: now,
          completedAt: null
        }));

      if (questsToAdd.length === 0) {
        return 0;
      }

      setState((current) => {
        const latestExistingTitles = new Set(
          current.quests.map((quest) => `${quest.occupation}:${quest.title}`)
        );
        const latestQuestsToAdd = questsToAdd.filter(
          (quest) => !latestExistingTitles.has(`${quest.occupation}:${quest.title}`)
        );

        if (latestQuestsToAdd.length === 0) {
          return current;
        }

        return {
          ...current,
          quests: [...latestQuestsToAdd, ...current.quests]
        };
      });

      return questsToAdd.length;
    },
    [setState, state.quests]
  );

  const updateQuest = useCallback(
    (questId: string, draft: QuestDraft) => {
      setState((current) => ({
        ...current,
        quests: current.quests.map((quest) =>
          quest.id === questId
            ? {
                ...quest,
                ...draft,
                expReward: getExpReward(draft.difficulty)
              }
            : quest
        )
      }));
    },
    [setState]
  );

  const deleteQuest = useCallback(
    (questId: string) => {
      setState((current) => ({
        ...current,
        quests: current.quests.filter((quest) => quest.id !== questId)
      }));
    },
    [setState]
  );

  const completeQuest = useCallback(
    (questId: string) => {
      setState((current) => {
        const target = current.quests.find((quest) => quest.id === questId);
        if (!target || target.status === "completed") {
          return current;
        }

        const now = new Date().toISOString();
        const quests = current.quests.map((quest) =>
          quest.id === questId
            ? {
                ...quest,
                status: "completed" as const,
                completedAt: now
              }
            : quest
        );
        const withExp = awardExp(current, target.expReward);
        const stats = addStat(withExp.stats, target.category);
        const achievements = evaluateAchievements(withExp.achievements, {
          quests,
          mapCompletions: withExp.mapCompletions
        });

        return {
          ...withExp,
          quests,
          stats,
          achievements
        };
      });
    },
    [setState]
  );

  const completeMicroAdventure = useCallback(
    (draft: QuestDraft, note: string, mood: LifeMomentMood) => {
      setState((current) => {
        const now = new Date().toISOString();
        const quest: Quest = {
          id: createId("micro-adventure"),
          ...draft,
          expReward: getExpReward(draft.difficulty),
          status: "completed",
          createdAt: now,
          completedAt: now
        };
        const withExp = awardExp(current, quest.expReward);
        const quests = [quest, ...current.quests];
        const stats = addStat(withExp.stats, quest.category);
        const achievements = evaluateAchievements(withExp.achievements, {
          quests,
          mapCompletions: withExp.mapCompletions
        });

        return {
          ...withExp,
          quests,
          stats,
          achievements,
          lifeMoments: [
            {
              id: createId("life-moment"),
              adventureName: draft.title,
              note: note.trim(),
              mood,
              completedAt: now
            },
            ...withExp.lifeMoments
          ]
        };
      });
    },
    [setState]
  );

  const completeMapLocation = useCallback(
    (location: MapLocation) => {
      setState((current) => {
        if (current.mapCompletions.includes(location.id)) {
          return current;
        }

        const now = new Date().toISOString();
        const quest: Quest = {
          id: `map-${location.id}`,
          title: location.questTitle,
          description: `${location.name}的地圖任務已完成。`,
          type: "map",
          category: location.category,
          occupation: "general",
          difficulty: location.expReward >= 100 ? "hard" : location.expReward >= 50 ? "normal" : "easy",
          expReward: location.expReward,
          status: "completed",
          createdAt: now,
          completedAt: now
        };
        const quests = [quest, ...current.quests];
        const mapCompletions = [...current.mapCompletions, location.id];
        const withExp = awardExp(current, location.expReward);
        const stats = {
          ...withExp.stats,
          exploration: withExp.stats.exploration + STAT_GAIN_PER_QUEST
        };
        const achievements = evaluateAchievements(withExp.achievements, {
          quests,
          mapCompletions
        });

        return {
          ...withExp,
          quests,
          stats,
          achievements,
          mapCompletions
        };
      });
    },
    [setState]
  );

  const resetAppData = useCallback(() => {
    setState(createInitialLifeQuestState());
  }, [setState]);

  const restoreDemoData = useCallback(() => {
    setState((current) => ({
      ...createInitialLifeQuestState(),
      profile: current.profile
        ? {
            ...current.profile,
            exp: 0,
            level: 1
          }
        : null,
      quests: createDemoQuests(),
      stats: { ...defaultStats },
      achievements: createDefaultAchievements(),
      mapCompletions: [],
      occupationSuggestions: current.occupationSuggestions
    }));
  }, [setState]);

  const exportData = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const importData = useCallback(
    (rawJson: string) => {
      try {
        const parsed = JSON.parse(rawJson) as LifeQuestState;

        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          return {
            success: false,
            message: "匯入失敗：JSON 必須是一個資料物件。"
          };
        }

        setState(normalizeLifeQuestState(parsed));

        return {
          success: true,
          message: "匯入成功，資料已更新。"
        };
      } catch {
        return {
          success: false,
          message: "匯入失敗：請確認檔案是有效的 JSON。"
        };
      }
    },
    [setState]
  );

  const value = useMemo(
    () => ({
      state,
      isHydrated,
      onboard,
      addQuest,
      addOccupationQuestPack,
      updateQuest,
      deleteQuest,
      completeQuest,
      completeMicroAdventure,
      completeMapLocation,
      resetAppData,
      restoreDemoData,
      exportData,
      importData
    }),
    [
      addQuest,
      addOccupationQuestPack,
      completeMapLocation,
      completeMicroAdventure,
      completeQuest,
      deleteQuest,
      exportData,
      importData,
      isHydrated,
      onboard,
      resetAppData,
      restoreDemoData,
      state,
      updateQuest
    ]
  );

  return <LifeQuestContext.Provider value={value}>{children}</LifeQuestContext.Provider>;
}

export function useLifeQuest() {
  const context = useContext(LifeQuestContext);

  if (!context) {
    throw new Error("useLifeQuest must be used inside LifeQuestProvider.");
  }

  return context;
}
