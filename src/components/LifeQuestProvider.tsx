"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { STORAGE_KEY, createDefaultAchievements, createDemoQuests, createInitialLifeQuestState, defaultStats } from "@/data/defaults";
import { getOccupationQuestPack } from "@/data/questPacks";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { appendRecommendationHistory, toggleUniqueId } from "@/lib/adventurePreferences";
import { addQuest, addQuestPack, completeMapLocation as completeMapLocationOperation, completeMicroAdventure as completeMicroAdventureOperation, completeQuest as completeQuestOperation, deleteQuest as deleteQuestOperation, updateQuest as updateQuestOperation } from "@/lib/questOperations";
import { importLifeQuestState, migrateLifeQuestState } from "@/lib/stateMigration";
import { unlockSkillNode as unlockSkillNodeOperation } from "@/lib/skillTree";
import { createId } from "@/lib/utils";
import type { CompletionFeedback, GrowthFocus, LifeMomentMood, LifeStage, LifeQuestState, MapLocation, OccupationCategory, QuestDraft, QuoteCategory, Role, StudentStage } from "@/types";
import { normalizeCustomMapLocation } from "@/lib/mapLocations";
import { pickAdventureQuote } from "@/data/adventureQuotes";
import { categoryLabels } from "@/data/labels";

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
  addCustomMapLocation: (location: MapLocation) => void;
  updateCustomMapLocation: (location: MapLocation) => void;
  deleteCustomMapLocation: (locationId: string) => void;
  unlockSkillNode: (nodeId: string) => boolean;
  completionFeedback: CompletionFeedback | null;
  closeCompletionFeedback: () => void;
  saveCompletionQuote: () => void;
  removeSavedQuote: (savedQuoteId: string) => void;
  isFeedbackSaved: () => boolean;
  resetAppData: () => void;
  restoreDemoData: () => void;
  exportData: () => string;
  importData: (rawJson: string) => { success: boolean; message: string };
}

const LifeQuestContext = createContext<LifeQuestContextValue | null>(null);

export function LifeQuestProvider({ children }: { children: ReactNode }) {
  const createInitial = useCallback(() => createInitialLifeQuestState(), []);
  const [state, setState, isHydrated] = useLocalStorage(STORAGE_KEY, createInitial, migrateLifeQuestState);
  const [completionFeedback, setCompletionFeedback] = useState<CompletionFeedback | null>(null);
  const recentQuoteIds = useRef<string[]>([]);
  const handledFeedbackEventIds = useRef(new Set<string>());

  const showFeedback = useCallback((eventId: string, category: QuoteCategory, details: Omit<CompletionFeedback, "eventId" | "quote">) => {
    if (handledFeedbackEventIds.current.has(eventId)) return;
    handledFeedbackEventIds.current.add(eventId);
    const quote = pickAdventureQuote(category, recentQuoteIds.current);
    recentQuoteIds.current = [...recentQuoteIds.current, quote.id].slice(-4);
    setCompletionFeedback({ eventId, quote, ...details });
  }, []);

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
  const completeQuest = useCallback((questId: string) => {
    const quest = state.quests.find((item) => item.id === questId);
    if (!quest || quest.status === "completed") return;
    const next = completeQuestOperation(state, questId);
    setState(next);
    const unlockedAchievement = next.achievements.find((item) => item.unlocked && !state.achievements.find((before) => before.id === item.id)?.unlocked);
    const reachedStreak = next.streak.longest > state.streak.longest && next.streak.longest >= 2;
    const category: QuoteCategory | null = quest.type === "main" ? "main-quest" : next.profile && state.profile && next.profile.level > state.profile.level ? "level-up" : unlockedAchievement ? "achievement" : reachedStreak ? "streak" : null;
    if (category) showFeedback(`quest:${quest.id}:${quest.completedAt ?? "completion"}`, category, { sourceType: category === "achievement" ? "achievement" : "quest", sourceId: category === "achievement" ? unlockedAchievement?.id : quest.id, sourceTitle: category === "achievement" ? `解鎖成就：${unlockedAchievement?.title ?? quest.title}` : category === "main-quest" ? `完成主線：${quest.title}` : `完成任務：${quest.title}`, expReward: quest.expReward, statLabel: `+1 ${categoryLabels[quest.category]}` });
  }, [setState, showFeedback, state]);
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
  const completeMapLocation = useCallback((location: MapLocation) => {
    if (state.mapCompletions.includes(location.id)) return;
    const next = completeMapLocationOperation(state, location);
    setState(next);
    showFeedback(`location:${location.id}`, "location", { sourceType: "location", sourceId: location.id, sourceTitle: `完成地點任務：${location.questTitle}`, expReward: location.expReward, statLabel: `+1 ${categoryLabels.exploration}`, location: { name: location.name, latitude: location.lat, longitude: location.lng } });
  }, [setState, showFeedback, state]);
  const addCustomMapLocation = useCallback((location: MapLocation) => setState((current) => {
    const normalized = normalizeCustomMapLocation(location);
    return normalized && !current.customMapLocations.some((item) => item.id === normalized.id) ? { ...current, customMapLocations: [normalized, ...current.customMapLocations] } : current;
  }), [setState]);
  const updateCustomMapLocation = useCallback((location: MapLocation) => setState((current) => {
    const normalized = normalizeCustomMapLocation(location);
    return normalized ? { ...current, customMapLocations: current.customMapLocations.map((item) => item.id === normalized.id ? normalized : item) } : current;
  }), [setState]);
  const deleteCustomMapLocation = useCallback((locationId: string) => setState((current) => ({ ...current, customMapLocations: current.customMapLocations.filter((item) => item.id !== locationId), mapCompletions: current.mapCompletions.filter((id) => id !== locationId) })), [setState]);
  const unlockSkillNode = useCallback((nodeId: string) => {
    const result = unlockSkillNodeOperation(state, nodeId);
    if (result.success) {
      setState(result.state);
      showFeedback(`skill:${result.node.id}`, "skill-up", { sourceType: "skill", sourceId: result.node.id, sourceTitle: `技能解鎖：${result.node.title}`, statLabel: result.node.rewardTitle });
    }
    return result.success;
  }, [setState, showFeedback, state]);
  const closeCompletionFeedback = useCallback(() => setCompletionFeedback(null), []);
  const isFeedbackSaved = useCallback(() => Boolean(completionFeedback && state.savedQuotes.some((item) => item.id === `quote-memory:${completionFeedback.eventId}`)), [completionFeedback, state.savedQuotes]);
  const saveCompletionQuote = useCallback(() => {
    if (!completionFeedback) return;
    const id = `quote-memory:${completionFeedback.eventId}`;
    setState((current) => current.savedQuotes.some((item) => item.id === id) ? current : {
      ...current,
      savedQuotes: [{ id, quoteId: completionFeedback.quote.id, text: completionFeedback.quote.text, category: completionFeedback.quote.category, savedAt: new Date().toISOString(), sourceType: completionFeedback.sourceType, sourceId: completionFeedback.sourceId, sourceTitle: completionFeedback.sourceTitle, location: completionFeedback.location }, ...current.savedQuotes]
    });
  }, [completionFeedback, setState]);
  const removeSavedQuote = useCallback((savedQuoteId: string) => setState((current) => ({ ...current, savedQuotes: current.savedQuotes.filter((item) => item.id !== savedQuoteId) })), [setState]);
  const resetAppData = useCallback(() => setState(createInitialLifeQuestState()), [setState]);
  const restoreDemoData = useCallback(() => setState((current) => ({ ...createInitialLifeQuestState(), profile: current.profile ? { ...current.profile, exp: 0, level: 1 } : null, quests: createDemoQuests(), stats: { ...defaultStats }, achievements: createDefaultAchievements(), occupationSuggestions: current.occupationSuggestions })), [setState]);
  const exportData = useCallback(() => JSON.stringify(state, null, 2), [state]);
  const importData = useCallback((rawJson: string) => {
    const result = importLifeQuestState(rawJson);
    if (!result.success) return { success: false, message: "匯入失敗：請選擇有效的 Life Quest Map JSON 檔案。" };
    setState(result.state);
    return { success: true, message: "資料已匯入並遷移至 schemaVersion 5。" };
  }, [setState]);
  const value = useMemo(() => ({ state, isHydrated, onboard, addQuest: addQuestCallback, addOccupationQuestPack, updateQuest, deleteQuest, completeQuest, completeMicroAdventure, toggleFavoriteAdventure, toggleSavedAdventure, dismissAdventure, showAdventure, selectAdventure, clearSelectedAdventure, completeMapLocation, addCustomMapLocation, updateCustomMapLocation, deleteCustomMapLocation, unlockSkillNode, completionFeedback, closeCompletionFeedback, saveCompletionQuote, removeSavedQuote, isFeedbackSaved, resetAppData, restoreDemoData, exportData, importData }), [state, isHydrated, onboard, addQuestCallback, addOccupationQuestPack, updateQuest, deleteQuest, completeQuest, completeMicroAdventure, toggleFavoriteAdventure, toggleSavedAdventure, dismissAdventure, showAdventure, selectAdventure, clearSelectedAdventure, completeMapLocation, addCustomMapLocation, updateCustomMapLocation, deleteCustomMapLocation, unlockSkillNode, completionFeedback, closeCompletionFeedback, saveCompletionQuote, removeSavedQuote, isFeedbackSaved, resetAppData, restoreDemoData, exportData, importData]);
  return <LifeQuestContext.Provider value={value}>{children}</LifeQuestContext.Provider>;
}

export function useLifeQuest() {
  const context = useContext(LifeQuestContext);
  if (!context) throw new Error("useLifeQuest must be used inside LifeQuestProvider.");
  return context;
}
