"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { STORAGE_KEY, createDefaultAchievements, createDemoQuests, createInitialLifeQuestState, defaultStats } from "@/data/defaults";
import { getOccupationQuestPack } from "@/data/questPacks";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { appendRecommendationHistory, toggleUniqueId } from "@/lib/adventurePreferences";
import { addQuest, addQuestPack, completeMapLocation as completeMapLocationOperation, completeMicroAdventure as completeMicroAdventureOperation, completeQuest as completeQuestOperation, deleteQuest as deleteQuestOperation, updateQuest as updateQuestOperation } from "@/lib/questOperations";
import { importLifeQuestState, migrateLifeQuestState } from "@/lib/stateMigration";
import { createId } from "@/lib/utils";
import type { GrowthFocus, LifeMomentMood, LifeStage, LifeQuestState, MapLocation, OccupationCategory, QuestDraft, Role, StudentStage } from "@/types";

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
  completeMicroAdventure: (adventureId: string, draft: QuestDraft, note: string, mood: LifeMomentMood) => void;
  toggleFavoriteAdventure: (adventureId: string) => void;
  toggleSavedAdventure: (adventureId: string) => void;
  dismissAdventure: (adventureId: string) => void;
  showAdventure: (adventureId: string) => void;
  selectAdventure: (adventureId: string) => void;
  clearSelectedAdventure: () => void;
  completeMapLocation: (location: MapLocation) => void;
  resetAppData: () => void;
  restoreDemoData: () => void;
  exportData: () => string;
  importData: (rawJson: string) => { success: boolean; message: string };
}

const LifeQuestContext = createContext<LifeQuestContextValue | null>(null);

export function LifeQuestProvider({ children }: { children: ReactNode }) {
  const createInitial = useCallback(() => createInitialLifeQuestState(), []);
  const [state, setState, isHydrated] = useLocalStorage(STORAGE_KEY, createInitial, migrateLifeQuestState);

  const onboard = useCallback((input: OnboardingInput) => {
    setState((current) => ({
      ...current,
      occupationSuggestions: input.occupation === "custom" && input.customOccupationName?.trim() ? [...current.occupationSuggestions, { id: createId("occupation"), name: input.customOccupationName.trim(), note: input.occupationSuggestion?.trim() ?? "", createdAt: new Date().toISOString() }] : current.occupationSuggestions,
      profile: { id: createId("hero"), name: input.name.trim(), lifeStage: input.lifeStage, studentStage: input.lifeStage === "student" ? input.studentStage : undefined, role: input.role, occupation: input.occupation, customOccupationName: input.occupation === "custom" ? input.customOccupationName?.trim() : undefined, focus: input.focuses[0] ?? "learning", focuses: input.focuses.length ? input.focuses : ["learning"], exp: 0, level: 1, createdAt: new Date().toISOString() }
    }));
  }, [setState]);
  const addQuestCallback = useCallback((draft: QuestDraft) => setState((current) => addQuest(current, draft)), [setState]);
  const addOccupationQuestPack = useCallback((occupation: OccupationCategory) => {
    const pack = getOccupationQuestPack(occupation);
    if (!pack) return 0;
    const result = addQuestPack(state, pack.quests);
    if (result.added) setState((current) => addQuestPack(current, pack.quests).state);
    return result.added;
  }, [setState, state]);
  const updateQuest = useCallback((questId: string, draft: QuestDraft) => setState((current) => updateQuestOperation(current, questId, draft)), [setState]);
  const deleteQuest = useCallback((questId: string) => setState((current) => deleteQuestOperation(current, questId)), [setState]);
  const completeQuest = useCallback((questId: string) => setState((current) => completeQuestOperation(current, questId)), [setState]);
  const completeMicroAdventure = useCallback((adventureId: string, draft: QuestDraft, note: string, mood: LifeMomentMood) => setState((current) => completeMicroAdventureOperation(current, adventureId, draft, note, mood)), [setState]);
  const updateAdventureIds = useCallback((field: "favoriteAdventureIds" | "savedAdventureIds", adventureId: string, action: "favorite" | "saved") => setState((current) => ({ ...current, [field]: toggleUniqueId(current[field], adventureId), recommendationHistory: appendRecommendationHistory(current.recommendationHistory, adventureId, action) })), [setState]);
  const toggleFavoriteAdventure = useCallback((id: string) => updateAdventureIds("favoriteAdventureIds", id, "favorite"), [updateAdventureIds]);
  const toggleSavedAdventure = useCallback((id: string) => updateAdventureIds("savedAdventureIds", id, "saved"), [updateAdventureIds]);
  const dismissAdventure = useCallback((adventureId: string) => setState((current) => {
    const now = new Date().toISOString(); const found = current.dismissedAdventures.find((item) => item.adventureId === adventureId);
    return { ...current, dismissedAdventures: found ? current.dismissedAdventures.map((item) => item.adventureId === adventureId ? { ...item, dismissedAt: now, count: item.count + 1 } : item) : [...current.dismissedAdventures, { adventureId, dismissedAt: now, count: 1 }], recommendationHistory: appendRecommendationHistory(current.recommendationHistory, adventureId, "dismissed", now) };
  }), [setState]);
  const showAdventure = useCallback((id: string) => setState((current) => ({ ...current, recommendationHistory: appendRecommendationHistory(current.recommendationHistory, id, "shown") })), [setState]);
  const selectAdventure = useCallback((id: string) => setState((current) => ({ ...current, selectedAdventureId: id })), [setState]);
  const clearSelectedAdventure = useCallback(() => setState((current) => current.selectedAdventureId ? { ...current, selectedAdventureId: null } : current), [setState]);
  const completeMapLocation = useCallback((location: MapLocation) => setState((current) => completeMapLocationOperation(current, location)), [setState]);
  const resetAppData = useCallback(() => setState(createInitialLifeQuestState()), [setState]);
  const restoreDemoData = useCallback(() => setState((current) => ({ ...createInitialLifeQuestState(), profile: current.profile ? { ...current.profile, exp: 0, level: 1 } : null, quests: createDemoQuests(), stats: { ...defaultStats }, achievements: createDefaultAchievements(), occupationSuggestions: current.occupationSuggestions })), [setState]);
  const exportData = useCallback(() => JSON.stringify(state, null, 2), [state]);
  const importData = useCallback((rawJson: string) => {
    const result = importLifeQuestState(rawJson);
    if (!result.success) return { success: false, message: "匯入失敗：請選擇有效的 Life Quest Map JSON 檔案。" };
    setState(result.state);
    return { success: true, message: "資料已匯入並遷移至 schemaVersion 2。" };
  }, [setState]);
  const value = useMemo(() => ({ state, isHydrated, onboard, addQuest: addQuestCallback, addOccupationQuestPack, updateQuest, deleteQuest, completeQuest, completeMicroAdventure, toggleFavoriteAdventure, toggleSavedAdventure, dismissAdventure, showAdventure, selectAdventure, clearSelectedAdventure, completeMapLocation, resetAppData, restoreDemoData, exportData, importData }), [state, isHydrated, onboard, addQuestCallback, addOccupationQuestPack, updateQuest, deleteQuest, completeQuest, completeMicroAdventure, toggleFavoriteAdventure, toggleSavedAdventure, dismissAdventure, showAdventure, selectAdventure, clearSelectedAdventure, completeMapLocation, resetAppData, restoreDemoData, exportData, importData]);
  return <LifeQuestContext.Provider value={value}>{children}</LifeQuestContext.Provider>;
}

export function useLifeQuest() {
  const context = useContext(LifeQuestContext);
  if (!context) throw new Error("useLifeQuest must be used inside LifeQuestProvider.");
  return context;
}
