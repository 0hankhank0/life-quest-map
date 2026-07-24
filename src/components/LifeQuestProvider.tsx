"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createDefaultAchievements, createDemoQuests, createInitialLifeQuestState, defaultStats } from "@/data/defaults";
import { getOccupationQuestPack } from "@/data/questPacks";
import { pickAdventureQuoteForQuest } from "@/data/adventureQuotes";
import { microAdventures } from "@/data/microAdventures";
import { useAuth } from "@/components/AuthProvider";
import { CloudSaveConflictError, type CloudSaveEnvelope, type CloudSaveRow, type CloudSaveError, conflictBackupKey, createSupabaseCloudSaveAdapter, GUEST_SAVE_KEY, parseCloudSaveEnvelope, userSaveKey } from "@/lib/cloudSave";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { appendRecommendationHistory, toggleUniqueId } from "@/lib/adventurePreferences";
import { addQuest, addQuestPack, completeMapLocation as completeMapLocationOperation, completeMicroAdventure as completeMicroAdventureOperation, completeQuest as completeQuestOperation, deleteQuest as deleteQuestOperation, updateQuest as updateQuestOperation } from "@/lib/questOperations";
import { normalizeCustomMapLocation } from "@/lib/mapLocations";
import { importLifeQuestState, migrateLifeQuestState } from "@/lib/stateMigration";
import { unlockSkillNode as unlockSkillNodeOperation } from "@/lib/skillTree";
import { createId } from "@/lib/utils";
import { categoryLabels } from "@/data/labels";
import type { CompletionFeedback, CompletionMood, GrowthFocus, LifeMomentMood, LifeStage, LifeQuestState, MapLocation, OccupationCategory, Quest, QuestDraft, Role, StudentStage } from "@/types";

interface OnboardingInput { name: string; lifeStage: LifeStage; studentStage?: StudentStage; role: Role; occupation: OccupationCategory; customOccupationName?: string; occupationSuggestion?: string; focuses: GrowthFocus[]; }
interface LifeQuestContextValue {
  state: LifeQuestState; isHydrated: boolean; onboard: (input: OnboardingInput) => void; addQuest: (draft: QuestDraft) => void; addOccupationQuestPack: (occupation: OccupationCategory) => number; updateQuest: (questId: string, draft: QuestDraft) => void; deleteQuest: (questId: string) => void;
  completeQuest: (questId: string) => void; completeMicroAdventure: (adventureId: string, draft: QuestDraft, note: string, mood: LifeMomentMood) => void; toggleFavoriteAdventure: (adventureId: string) => void; toggleSavedAdventure: (adventureId: string) => void; dismissAdventure: (adventureId: string) => void; showAdventure: (adventureId: string) => void; selectAdventure: (adventureId: string) => void; clearSelectedAdventure: () => void;
  completeMapLocation: (location: MapLocation) => void; addCustomMapLocation: (location: MapLocation) => void; updateCustomMapLocation: (location: MapLocation) => void; deleteCustomMapLocation: (locationId: string) => void; unlockSkillNode: (nodeId: string) => boolean;
  completionFeedback: CompletionFeedback | null; closeCompletionFeedback: () => void; saveCompletionExperience: (mood: CompletionMood | null, note: string) => void; removeSavedQuote: (savedQuoteId: string) => void; removeAdventureJournalEntry: (entryId: string) => void;
  completeBeginnerGuide: () => void; restartBeginnerGuide: () => void; resetAppData: () => void; restoreDemoData: () => void; exportData: () => string; importData: (rawJson: string) => { success: boolean; message: string };
  cloudStatus: CloudStatus; cloudError: string | null; cloudBootstrap: CloudBootstrap; lastSyncedAt: string | null; syncNow: () => Promise<void>; retryCloudBootstrap: () => void; importGuestProgress: () => Promise<void>; createFreshAccountProgress: () => Promise<void>; useCloudVersion: () => void; overwriteCloudWithLocal: () => Promise<void>;
}
export type CloudStatus = "guest" | "loading" | "syncing" | "synced" | "unsynced" | "offline" | "unavailable" | "error" | "conflict";
export type CloudBootstrap = "ready" | "choose-import" | "error";
const LifeQuestContext = createContext<LifeQuestContextValue | null>(null);

export function LifeQuestProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const createInitial = useCallback(() => createInitialLifeQuestState(), []);
  const [state, setState] = useState<LifeQuestState>(() => createInitialLifeQuestState());
  const [isHydrated, setIsHydrated] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>("loading");
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [cloudBootstrap, setCloudBootstrap] = useState<CloudBootstrap>("ready");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [bootstrapAttempt, setBootstrapAttempt] = useState(0);
  const userId = user?.id;
  const cloudRevisionRef = useRef<number | null>(null);
  const cloudStatusRef = useRef<CloudStatus>("loading");
  const lastSyncedAtRef = useRef<string | null>(null);
  const stateRef = useRef(state);
  const pendingCloudRef = useRef<CloudSaveRow | null>(null);
  const suppressPersistRef = useRef(false);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncInFlightRef = useRef(false);
  const [completionFeedback, setCompletionFeedback] = useState<CompletionFeedback | null>(null);
  const handledFeedbackEventIds = useRef(new Set<string>());

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { cloudStatusRef.current = cloudStatus; }, [cloudStatus]);
  useEffect(() => { lastSyncedAtRef.current = lastSyncedAt; }, [lastSyncedAt]);
  const writeEnvelope = useCallback((envelope: CloudSaveEnvelope) => {
    try { window.localStorage.setItem(userSaveKey(envelope.userId), JSON.stringify(envelope)); } catch { /* retain in-memory state if storage is unavailable */ }
  }, []);
  const applyCloudRow = useCallback((row: CloudSaveRow, dirty = false) => {
    cloudRevisionRef.current = row.revision;
    const envelope = { userId: row.userId, state: row.state, cloudRevision: row.revision, lastSyncedAt: dirty ? null : row.updatedAt, dirty };
    writeEnvelope(envelope); suppressPersistRef.current = true; setState(row.state); lastSyncedAtRef.current = envelope.lastSyncedAt; setLastSyncedAt(envelope.lastSyncedAt);
  }, [writeEnvelope]);

  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    let cancelled = false;
    const loadGuest = () => {
      let next = createInitialLifeQuestState();
      try { const raw = window.localStorage.getItem(GUEST_SAVE_KEY); if (raw) next = migrateLifeQuestState(JSON.parse(raw)); } catch { /* invalid guest cache falls back safely */ }
      suppressPersistRef.current = true; setState(next); cloudRevisionRef.current = null; setLastSyncedAt(null); setCloudStatus("guest"); setCloudBootstrap("ready"); setCloudError(null); setIsHydrated(true);
    };
    if (!userId) { loadGuest(); return () => { cancelled = true; }; }
    setIsHydrated(false); setCloudStatus("loading"); setCloudBootstrap("ready"); setCloudError(null); pendingCloudRef.current = null;
    const load = async () => {
      let cached: CloudSaveEnvelope | null = null;
      let guest: LifeQuestState | null = null;
      try { cached = parseCloudSaveEnvelope(window.localStorage.getItem(userSaveKey(userId)), userId); } catch { /* storage unavailable */ }
      try { const raw = window.localStorage.getItem(GUEST_SAVE_KEY); if (raw) guest = migrateLifeQuestState(JSON.parse(raw)); } catch { /* invalid guest cache is ignored */ }
      const client = createSupabaseBrowserClient();
      if (!client) {
        const next = cached?.state ?? createInitialLifeQuestState();
        suppressPersistRef.current = true; setState(next); cloudRevisionRef.current = cached?.cloudRevision ?? null; setLastSyncedAt(cached?.lastSyncedAt ?? null); setCloudStatus("unavailable"); setCloudError("雲端存檔尚未啟用。"); setCloudBootstrap("ready"); setIsHydrated(true); return;
      }
      try {
        const adapter = createSupabaseCloudSaveAdapter(client);
        const row = await adapter.read(userId);
        if (cancelled) return;
        if (row) {
          if (cached?.dirty) {
            cloudRevisionRef.current = cached.cloudRevision;
            suppressPersistRef.current = true;
            setState(cached.state);
            setLastSyncedAt(cached.lastSyncedAt);
            // A dirty cache based on the same revision is simply an interrupted
            // debounce. Keep it and retry the optimistic update instead of
            // asking the user to resolve a conflict that does not exist.
            if (cached.cloudRevision === row.revision || JSON.stringify(cached.state) === JSON.stringify(row.state)) {
              setCloudStatus("unsynced");
            } else {
              pendingCloudRef.current = row;
              setCloudStatus("conflict");
            }
          }
          else { applyCloudRow(row); setCloudStatus("synced"); }
          setCloudBootstrap("ready"); setIsHydrated(true); return;
        }
        if (cached) { cloudRevisionRef.current = cached.cloudRevision; suppressPersistRef.current = true; setState(cached.state); setLastSyncedAt(cached.lastSyncedAt); setCloudStatus(cached.dirty ? "unsynced" : "unavailable"); setCloudBootstrap("ready"); setIsHydrated(true); return; }
        if (guest?.profile) { suppressPersistRef.current = true; setState(createInitialLifeQuestState()); setCloudStatus("loading"); setCloudBootstrap("choose-import"); setIsHydrated(true); return; }
        const created = await adapter.create(userId, createInitialLifeQuestState());
        if (cancelled) return;
        applyCloudRow(created); setCloudStatus("synced"); setCloudBootstrap("ready"); setIsHydrated(true);
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "雲端存檔初始化失敗。";
        const kind = (error as CloudSaveError).kind;
        const next = cached?.state ?? createInitialLifeQuestState();
        suppressPersistRef.current = true; setState(next); cloudRevisionRef.current = cached?.cloudRevision ?? null; setLastSyncedAt(cached?.lastSyncedAt ?? null); setCloudStatus(kind === "unavailable" ? "unavailable" : kind === "offline" ? "offline" : "error"); setCloudError(message);
        // Cached account progress remains usable when the network, migration,
        // or Supabase is temporarily unavailable. Only block a brand-new
        // account with no local data and no cloud response.
        setCloudBootstrap(cached ? "ready" : "error"); setIsHydrated(true);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [applyCloudRow, bootstrapAttempt, createInitial, userId]);

  const syncNow = useCallback(async () => {
    if (!userId || syncInFlightRef.current || cloudStatusRef.current === "conflict") return;
    const client = createSupabaseBrowserClient();
    if (!client) { setCloudStatus("unavailable"); setCloudError("雲端存檔尚未啟用。"); return; }
    const cached = parseCloudSaveEnvelope(window.localStorage.getItem(userSaveKey(userId)), userId);
    if (!cached?.dirty) return;
    syncInFlightRef.current = true; setCloudStatus("syncing"); setCloudError(null);
    try {
      const adapter = createSupabaseCloudSaveAdapter(client);
      let row: CloudSaveRow;
      if (cached.cloudRevision === null) {
        try { row = await adapter.create(userId, cached.state); }
        catch (error) {
          const existing = await adapter.read(userId);
          if (existing) { pendingCloudRef.current = existing; setCloudStatus("conflict"); return; }
          throw error;
        }
      } else row = await adapter.update(userId, cached.state, cached.cloudRevision);
      const latest = parseCloudSaveEnvelope(window.localStorage.getItem(userSaveKey(userId)), userId);
      const changedDuringSync = Boolean(latest && JSON.stringify(latest.state) !== JSON.stringify(cached.state));
      const next = { userId, state: latest?.state ?? cached.state, cloudRevision: row.revision, lastSyncedAt: row.updatedAt, dirty: changedDuringSync };
      cloudRevisionRef.current = row.revision; writeEnvelope(next); lastSyncedAtRef.current = row.updatedAt; setLastSyncedAt(row.updatedAt); setCloudStatus(changedDuringSync ? "unsynced" : "synced");
      if (changedDuringSync) { if (syncTimerRef.current) clearTimeout(syncTimerRef.current); syncTimerRef.current = setTimeout(() => void syncNow(), 1200); }
    } catch (error) {
      if (error instanceof CloudSaveConflictError) {
        try { pendingCloudRef.current = await createSupabaseCloudSaveAdapter(client).read(userId); } catch { /* conflict remains actionable even if refetch is offline */ }
        setCloudStatus("conflict");
      } else {
        const kind = (error as CloudSaveError).kind;
        setCloudStatus(kind === "unavailable" ? "unavailable" : kind === "offline" ? "offline" : "error");
        setCloudError(error instanceof Error ? error.message : "同步失敗，資料已保存在這台裝置。");
      }
    } finally { syncInFlightRef.current = false; }
  }, [userId, writeEnvelope]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      try { window.localStorage.setItem(GUEST_SAVE_KEY, JSON.stringify(state)); } catch { /* no-op */ }
      return;
    }
    if (suppressPersistRef.current) { suppressPersistRef.current = false; return; }
    const envelope = { userId: user.id, state, cloudRevision: cloudRevisionRef.current, lastSyncedAt: lastSyncedAtRef.current, dirty: true };
    writeEnvelope(envelope); setCloudStatus((current) => current === "synced" ? "unsynced" : current);
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => void syncNow(), 1200);
    return () => { if (syncTimerRef.current) clearTimeout(syncTimerRef.current); };
  }, [isHydrated, state, syncNow, user, writeEnvelope]);

  useEffect(() => {
    const retry = () => { if (user) void syncNow(); };
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, [syncNow, user]);

  const initializeAccount = useCallback(async (next: LifeQuestState) => {
    if (!user) return;
    setCloudStatus("syncing"); setCloudError(null);
    const client = createSupabaseBrowserClient();
    if (!client) { setCloudStatus("unavailable"); setCloudError("雲端存檔尚未啟用。"); setCloudBootstrap("error"); return; }
    try {
      const adapter = createSupabaseCloudSaveAdapter(client);
      let row: CloudSaveRow;
      try { row = await adapter.create(user.id, next); }
      catch (error) { const existing = await adapter.read(user.id); if (!existing) throw error; row = existing; }
      applyCloudRow(row); setCloudStatus("synced"); setCloudBootstrap("ready");
    } catch (error) { setCloudStatus((error as CloudSaveError).kind === "unavailable" ? "unavailable" : "error"); setCloudError(error instanceof Error ? error.message : "初始化失敗。"); setCloudBootstrap("error"); }
  }, [applyCloudRow, user]);
  const importGuestProgress = useCallback(async () => {
    try { const raw = window.localStorage.getItem(GUEST_SAVE_KEY); const guest = raw ? migrateLifeQuestState(JSON.parse(raw)) : null; if (guest) await initializeAccount(guest); } catch { setCloudError("訪客資料無法讀取，請重試或建立新帳號進度。"); setCloudBootstrap("error"); }
  }, [initializeAccount]);
  const createFreshAccountProgress = useCallback(async () => initializeAccount(createInitialLifeQuestState()), [initializeAccount]);
  const retryCloudBootstrap = useCallback(() => setBootstrapAttempt((current) => current + 1), []);
  const useCloudVersion = useCallback(() => {
    const row = pendingCloudRef.current;
    if (!user || !row) return;
    try { window.localStorage.setItem(conflictBackupKey(user.id), JSON.stringify({ userId: user.id, state: stateRef.current, cloudRevision: cloudRevisionRef.current, createdAt: new Date().toISOString() })); } catch { /* backup is best effort */ }
    applyCloudRow(row); pendingCloudRef.current = null; setCloudStatus("synced");
  }, [applyCloudRow, user]);
  const overwriteCloudWithLocal = useCallback(async () => {
    if (!user || !window.confirm("這會以這台裝置的版本覆蓋雲端較新的資料，其他裝置的變更可能遺失。是否繼續？")) return;
    try { window.localStorage.setItem(conflictBackupKey(user.id), JSON.stringify({ userId: user.id, state: stateRef.current, cloudRevision: cloudRevisionRef.current, createdAt: new Date().toISOString() })); } catch { /* backup is best effort */ }
    const client = createSupabaseBrowserClient(); if (!client) return;
    try {
      const latest = await createSupabaseCloudSaveAdapter(client).read(user.id);
      if (!latest) throw new Error("找不到雲端存檔。");
      const row = await createSupabaseCloudSaveAdapter(client).update(user.id, stateRef.current, latest.revision);
      applyCloudRow(row); pendingCloudRef.current = null; setCloudStatus("synced");
    } catch (error) { setCloudStatus("conflict"); setCloudError(error instanceof Error ? error.message : "無法覆蓋雲端版本。"); }
  }, [applyCloudRow, user]);
  const showFeedback = useCallback((eventId: string, quest: Quest, canSaveJournal = true, rewardLabel?: string, tags: readonly string[] = []) => {
    if (handledFeedbackEventIds.current.has(eventId)) return;
    handledFeedbackEventIds.current.add(eventId);
    const { category, quote } = pickAdventureQuoteForQuest(quest, state.recentAdventureQuoteIds, { tags });
    setState((current) => ({ ...current, recentAdventureQuoteIds: [...current.recentAdventureQuoteIds, quote.id].slice(-4) }));
    setCompletionFeedback({ eventId, quote, taskId: quest.id, taskName: quest.title, completedAt: quest.completedAt ?? new Date().toISOString(), category, questCategory: quest.category, expReward: quest.expReward, rewardLabel, canSaveJournal });
  }, [setState, state.recentAdventureQuoteIds]);
  const onboard = useCallback((input: OnboardingInput) => setState((current) => ({ ...current, occupationSuggestions: input.occupation === "custom" && input.customOccupationName?.trim() ? [...current.occupationSuggestions, { id: createId("occupation"), name: input.customOccupationName.trim(), note: input.occupationSuggestion?.trim() ?? "", createdAt: new Date().toISOString() }] : current.occupationSuggestions, profile: { id: createId("hero"), name: input.name.trim(), lifeStage: input.lifeStage, studentStage: input.lifeStage === "student" ? input.studentStage : undefined, role: input.role, occupation: input.occupation, customOccupationName: input.occupation === "custom" ? input.customOccupationName?.trim() : undefined, focus: input.focuses[0] ?? "learning", focuses: input.focuses.length ? input.focuses : ["learning"], exp: 0, level: 1, createdAt: new Date().toISOString() } })), [setState]);
  const addQuestCallback = useCallback((draft: QuestDraft) => setState((current) => addQuest(current, draft)), [setState]);
  const addOccupationQuestPack = useCallback((occupation: OccupationCategory) => { const pack = getOccupationQuestPack(occupation); if (!pack) return 0; const result = addQuestPack(state, pack.quests); if (result.added) setState((current) => addQuestPack(current, pack.quests).state); return result.added; }, [setState, state]);
  const updateQuest = useCallback((id: string, draft: QuestDraft) => setState((current) => updateQuestOperation(current, id, draft)), [setState]);
  const deleteQuest = useCallback((id: string) => setState((current) => deleteQuestOperation(current, id)), [setState]);
  const completeQuest = useCallback((id: string) => { const quest = state.quests.find((item) => item.id === id); if (!quest || quest.status === "completed") return; const next = completeQuestOperation(state, id); setState(next); const completed = next.quests.find((item) => item.id === id); if (completed) showFeedback(`quest:${id}:${completed.completedAt}`, completed, true, `+1 ${categoryLabels[completed.category]}`); }, [setState, showFeedback, state]);
  const completeMicroAdventure = useCallback((adventureId: string, draft: QuestDraft, note: string, mood: LifeMomentMood) => { const next = completeMicroAdventureOperation(state, adventureId, draft, note, mood); if (next === state) return; setState(next); const completed = next.quests.find((quest) => quest.status === "completed" && quest.title === draft.title && quest.completedAt && !state.quests.some((previous) => previous.id === quest.id)); const adventure = microAdventures.find((item) => item.id === adventureId); if (completed) showFeedback(`micro:${completed.id}`, completed, true, `+1 ${categoryLabels[completed.category]}`, adventure ? [...adventure.moods, ...adventure.times] : []); }, [setState, showFeedback, state]);
  const updateAdventureIds = useCallback((field: "favoriteAdventureIds" | "savedAdventureIds", id: string, action: "favorite" | "saved") => setState((current) => ({ ...current, [field]: toggleUniqueId(current[field], id), recommendationHistory: appendRecommendationHistory(current.recommendationHistory, id, action) })), [setState]);
  const toggleFavoriteAdventure = useCallback((id: string) => updateAdventureIds("favoriteAdventureIds", id, "favorite"), [updateAdventureIds]);
  const toggleSavedAdventure = useCallback((id: string) => updateAdventureIds("savedAdventureIds", id, "saved"), [updateAdventureIds]);
  const dismissAdventure = useCallback((id: string) => setState((current) => { const now = new Date().toISOString(); const found = current.dismissedAdventures.find((item) => item.adventureId === id); return { ...current, dismissedAdventures: found ? current.dismissedAdventures.map((item) => item.adventureId === id ? { ...item, dismissedAt: now, count: item.count + 1 } : item) : [...current.dismissedAdventures, { adventureId: id, dismissedAt: now, count: 1 }], recommendationHistory: appendRecommendationHistory(current.recommendationHistory, id, "dismissed", now) }; }), [setState]);
  const showAdventure = useCallback((id: string) => setState((current) => ({ ...current, recommendationHistory: appendRecommendationHistory(current.recommendationHistory, id, "shown") })), [setState]);
  const selectAdventure = useCallback((id: string) => setState((current) => ({ ...current, selectedAdventureId: id })), [setState]);
  const clearSelectedAdventure = useCallback(() => setState((current) => current.selectedAdventureId ? { ...current, selectedAdventureId: null } : current), [setState]);
  const completeMapLocation = useCallback((location: MapLocation) => { if (state.mapCompletions.includes(location.id)) return; const next = completeMapLocationOperation(state, location); setState(next); const completed = next.quests.find((quest) => quest.id === `map-${location.id}`); if (completed) showFeedback(`location:${location.id}`, completed, true, `+1 ${categoryLabels.exploration}`); }, [setState, showFeedback, state]);
  const addCustomMapLocation = useCallback((location: MapLocation) => setState((current) => { const normalized = normalizeCustomMapLocation(location); return normalized && !current.customMapLocations.some((item) => item.id === normalized.id) ? { ...current, customMapLocations: [normalized, ...current.customMapLocations] } : current; }), [setState]);
  const updateCustomMapLocation = useCallback((location: MapLocation) => setState((current) => { const normalized = normalizeCustomMapLocation(location); return normalized ? { ...current, customMapLocations: current.customMapLocations.map((item) => item.id === normalized.id ? normalized : item) } : current; }), [setState]);
  const deleteCustomMapLocation = useCallback((id: string) => setState((current) => ({ ...current, customMapLocations: current.customMapLocations.filter((item) => item.id !== id), mapCompletions: current.mapCompletions.filter((item) => item !== id) })), [setState]);
  const unlockSkillNode = useCallback((nodeId: string) => { const result = unlockSkillNodeOperation(state, nodeId); if (result.success) { setState(result.state); const now = new Date().toISOString(); showFeedback(`skill:${result.node.id}`, { id: `skill:${result.node.id}`, title: result.node.title, description: result.node.description, type: "hidden", category: result.node.category, occupation: "general", difficulty: "easy", expReward: 0, status: "completed", createdAt: now, completedAt: now, priority: "normal", dueDate: null, estimatedMinutes: null, recurrence: "none", subtasks: [], questChainId: null }, false, result.node.rewardTitle); } return result.success; }, [setState, showFeedback, state]);
  const closeCompletionFeedback = useCallback(() => setCompletionFeedback(null), []);
  const saveCompletionExperience = useCallback((mood: CompletionMood | null, note: string) => { if (!completionFeedback || !completionFeedback.canSaveJournal) return; const id = `journal:${completionFeedback.eventId}`; setState((current) => current.adventureJournal.some((item) => item.id === id) ? current : { ...current, adventureJournal: [{ id, taskId: completionFeedback.taskId, taskName: completionFeedback.taskName, completedAt: completionFeedback.completedAt, category: completionFeedback.category, mood, note: note.trim() || undefined, quoteId: completionFeedback.quote.id, quoteText: completionFeedback.quote.text, quoteSourceType: completionFeedback.quote.sourceType, quoteSourceStatus: completionFeedback.quote.sourceStatus, quoteSourceTitle: completionFeedback.quote.sourceTitle, quoteSourceUrl: completionFeedback.quote.sourceUrl, quoteGame: completionFeedback.quote.game, quoteSkin: completionFeedback.quote.skin, quoteSpeaker: completionFeedback.quote.speaker, quoteAuthor: completionFeedback.quote.author, quoteWork: completionFeedback.quote.work, quoteDynasty: completionFeedback.quote.dynasty, quoteNote: completionFeedback.quote.note, expReward: completionFeedback.expReward, rewardLabel: completionFeedback.rewardLabel }, ...current.adventureJournal] }); setCompletionFeedback(null); }, [completionFeedback, setState]);
  const removeSavedQuote = useCallback((id: string) => setState((current) => ({ ...current, savedQuotes: current.savedQuotes.filter((item) => item.id !== id) })), [setState]);
  const removeAdventureJournalEntry = useCallback((id: string) => setState((current) => ({ ...current, adventureJournal: current.adventureJournal.filter((item) => item.id !== id) })), [setState]);
  const completeBeginnerGuide = useCallback(() => setState((current) => ({ ...current, userSettings: { ...current.userSettings, tutorialCompletedAt: new Date().toISOString() } })), [setState]);
  const restartBeginnerGuide = useCallback(() => setState((current) => ({ ...current, userSettings: { ...current.userSettings, tutorialCompletedAt: null } })), [setState]);
  const resetAppData = useCallback(() => setState(createInitialLifeQuestState()), [setState]);
  const restoreDemoData = useCallback(() => setState((current) => ({ ...createInitialLifeQuestState(), profile: current.profile ? { ...current.profile, exp: 0, level: 1 } : null, quests: createDemoQuests(), stats: { ...defaultStats }, achievements: createDefaultAchievements(), occupationSuggestions: current.occupationSuggestions })), [setState]);
  const exportData = useCallback(() => JSON.stringify(state, null, 2), [state]);
  const importData = useCallback((rawJson: string) => { const result = importLifeQuestState(rawJson); if (!result.success) return { success: false, message: "匯入失敗：請選擇有效的 Life Quest Map JSON 檔。" }; setState(result.state); return { success: true, message: "資料已匯入並完成遷移。" }; }, [setState]);
  const value = useMemo(() => ({ state, isHydrated, onboard, addQuest: addQuestCallback, addOccupationQuestPack, updateQuest, deleteQuest, completeQuest, completeMicroAdventure, toggleFavoriteAdventure, toggleSavedAdventure, dismissAdventure, showAdventure, selectAdventure, clearSelectedAdventure, completeMapLocation, addCustomMapLocation, updateCustomMapLocation, deleteCustomMapLocation, unlockSkillNode, completionFeedback, closeCompletionFeedback, saveCompletionExperience, removeSavedQuote, removeAdventureJournalEntry, completeBeginnerGuide, restartBeginnerGuide, resetAppData, restoreDemoData, exportData, importData, cloudStatus, cloudError, cloudBootstrap, lastSyncedAt, syncNow, retryCloudBootstrap, importGuestProgress, createFreshAccountProgress, useCloudVersion, overwriteCloudWithLocal }), [state, isHydrated, onboard, addQuestCallback, addOccupationQuestPack, updateQuest, deleteQuest, completeQuest, completeMicroAdventure, toggleFavoriteAdventure, toggleSavedAdventure, dismissAdventure, showAdventure, selectAdventure, clearSelectedAdventure, completeMapLocation, addCustomMapLocation, updateCustomMapLocation, deleteCustomMapLocation, unlockSkillNode, completionFeedback, closeCompletionFeedback, saveCompletionExperience, removeSavedQuote, removeAdventureJournalEntry, completeBeginnerGuide, restartBeginnerGuide, resetAppData, restoreDemoData, exportData, importData, cloudStatus, cloudError, cloudBootstrap, lastSyncedAt, syncNow, retryCloudBootstrap, importGuestProgress, createFreshAccountProgress, useCloudVersion, overwriteCloudWithLocal]);
  return <LifeQuestContext.Provider value={value}>{children}</LifeQuestContext.Provider>;
}
export function useLifeQuest() { const context = useContext(LifeQuestContext); if (!context) throw new Error("useLifeQuest must be used inside LifeQuestProvider."); return context; }
