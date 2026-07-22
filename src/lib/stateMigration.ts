import {
  createDefaultAchievements,
  createInitialLifeQuestState,
  defaultStats,
  defaultUserSettings
} from "@/data/defaults";
import { buildStreakFromCompletionDates } from "@/lib/dailyProgress";
import { getExpReward } from "@/lib/progression";
import { calendarDateKey } from "@/lib/utils";
import { skillNodeIds } from "@/data/skillNodes";
import { normalizeCustomMapLocation } from "@/lib/mapLocations";
import { findAdventureQuote } from "@/data/adventureQuotes";
import type { AdventureJournalEntry, AdventureQuoteSourceStatus, AttributionStatus, CityEchoCategory, CompletionMood, LifeQuestState, Quest, QuestDifficulty, QuestPriority, QuestRecurrence, QuestSubtask, QuoteSourceType, SavedQuote } from "@/types";

type StateRecord = Record<string, unknown>;
type PartialQuest = Partial<Quest> & Pick<Quest, "id" | "title" | "description">;

const recommendationActions = new Set(["shown", "favorite", "saved", "dismissed", "completed"]);
const quoteCategories = new Set(["main-quest", "level-up", "skill-up", "streak", "achievement", "location"]);
const cityEchoCategories = new Set<CityEchoCategory>(["exploration", "connection", "rest", "awareness", "courage", "creation", "daily"]);
const completionMoods = new Set<CompletionMood>(["relaxed", "happy", "surprised", "discovered", "calm", "unchanged"]);
const quoteSourceTypes = new Set<QuoteSourceType>(["movie", "game", "proPlayer", "original", "public_domain", "game-character", "game-skin", "esports-player", "user", "licensed", "unknown"]);
const attributionStatuses = new Set<AttributionStatus>(["verified", "source-known", "unverified"]);
const quoteSourceStatuses = new Set<AdventureQuoteSourceStatus>(["verified", "likely", "paraphrase", "original"]);
const uniqueIds = (items: unknown): string[] =>
  Array.isArray(items) ? [...new Set(items.filter((item): item is string => typeof item === "string"))] : [];
const isRecord = (value: unknown): value is StateRecord => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isDateString = (value: unknown): value is string => typeof value === "string" && !Number.isNaN(new Date(value).getTime());
const completionDate = (value: unknown): string | null => isDateString(value) ? calendarDateKey(new Date(value)) : null;
const isLocalDate = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

function normalizeSubtasks(value: unknown): QuestSubtask[] {
  return Array.isArray(value) ? value.filter((subtask): subtask is StateRecord => isRecord(subtask) && typeof subtask.id === "string" && typeof subtask.title === "string")
    .map((subtask) => ({ id: subtask.id as string, title: (subtask.title as string).trim(), completed: subtask.completed === true, completedAt: isDateString(subtask.completedAt) ? subtask.completedAt : null }))
    .filter((subtask) => subtask.title.length > 0) : [];
}

function normalizeCustomMapLocations(value: unknown): LifeQuestState["customMapLocations"] {
  return Array.isArray(value) ? value.map(normalizeCustomMapLocation).filter((location): location is LifeQuestState["customMapLocations"][number] => location !== null) : [];
}

function normalizeSavedQuotes(value: unknown): SavedQuote[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.filter(isRecord).flatMap((item) => {
    if (typeof item.id !== "string" || !item.id || seen.has(item.id) || typeof item.quoteId !== "string" || typeof item.text !== "string" || typeof item.category !== "string" || !quoteCategories.has(item.category) || !isDateString(item.savedAt)) return [];
    seen.add(item.id);
    const location = isRecord(item.location) ? {
      ...(typeof item.location.name === "string" ? { name: item.location.name } : {}),
      ...(typeof item.location.latitude === "number" && Number.isFinite(item.location.latitude) ? { latitude: item.location.latitude } : {}),
      ...(typeof item.location.longitude === "number" && Number.isFinite(item.location.longitude) ? { longitude: item.location.longitude } : {})
    } : undefined;
    return [{ id: item.id, quoteId: item.quoteId, text: item.text, category: item.category as SavedQuote["category"], savedAt: item.savedAt, sourceType: typeof item.sourceType === "string" ? item.sourceType : undefined, sourceId: typeof item.sourceId === "string" ? item.sourceId : undefined, sourceTitle: typeof item.sourceTitle === "string" ? item.sourceTitle : undefined, location: location && Object.keys(location).length ? location : undefined }];
  });
}

function normalizeAdventureJournal(value: unknown): AdventureJournalEntry[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.filter(isRecord).flatMap((item) => {
    const quoteText = typeof item.quoteText === "string" ? item.quoteText : typeof item.quote === "string" ? item.quote : undefined;
    if (typeof item.id !== "string" || !item.id || seen.has(item.id) || typeof item.taskId !== "string" || typeof item.taskName !== "string" || !isDateString(item.completedAt) || typeof item.category !== "string" || !cityEchoCategories.has(item.category as CityEchoCategory) || !quoteText) return [];
    if (item.mood != null && (typeof item.mood !== "string" || !completionMoods.has(item.mood as CompletionMood))) return [];
    const knownQuote = findAdventureQuote(item.quoteId, quoteText);
    const quoteId = typeof item.quoteId === "string" && item.quoteId ? item.quoteId : knownQuote?.id ?? `legacy:${item.id}`;
    const quoteSourceType = typeof item.quoteSourceType === "string" && quoteSourceTypes.has(item.quoteSourceType as QuoteSourceType)
      ? item.quoteSourceType as QuoteSourceType
      : knownQuote?.sourceType ?? "unknown";
    const quoteSourceStatus = typeof item.quoteSourceStatus === "string" && quoteSourceStatuses.has(item.quoteSourceStatus as AdventureQuoteSourceStatus)
      ? item.quoteSourceStatus as AdventureQuoteSourceStatus
      : knownQuote?.sourceStatus ?? (quoteSourceType === "unknown" || item.quoteAttributionStatus === "unverified" ? "likely" : "verified");
    const quoteAttributionStatus = typeof item.quoteAttributionStatus === "string" && attributionStatuses.has(item.quoteAttributionStatus as AttributionStatus)
      ? item.quoteAttributionStatus as AttributionStatus
      : knownQuote?.attributionStatus ?? "unverified";
    seen.add(item.id);
    return [{
      id: item.id, taskId: item.taskId, taskName: item.taskName, completedAt: item.completedAt,
      category: item.category as CityEchoCategory, mood: (item.mood ?? null) as CompletionMood | null,
      note: typeof item.note === "string" && item.note.trim() ? item.note.trim() : undefined,
      quoteId, quoteText, quoteSourceType, quoteSourceStatus, quoteAttributionStatus,
      quoteSourceTitle: typeof item.quoteSourceTitle === "string" ? item.quoteSourceTitle : knownQuote?.sourceTitle,
      quoteGame: typeof item.quoteGame === "string" ? item.quoteGame : knownQuote?.game,
      quoteSkin: typeof item.quoteSkin === "string" ? item.quoteSkin : knownQuote?.skin,
      quoteSpeaker: typeof item.quoteSpeaker === "string" ? item.quoteSpeaker : knownQuote?.speaker,
      quoteAuthor: typeof item.quoteAuthor === "string" ? item.quoteAuthor : knownQuote?.author,
      quoteWork: typeof item.quoteWork === "string" ? item.quoteWork : knownQuote?.work,
      quoteDynasty: typeof item.quoteDynasty === "string" ? item.quoteDynasty : knownQuote?.dynasty,
      quoteNote: typeof item.quoteNote === "string" ? item.quoteNote : knownQuote?.note,
      expReward: typeof item.expReward === "number" && Number.isFinite(item.expReward) ? item.expReward : undefined,
      rewardLabel: typeof item.rewardLabel === "string" ? item.rewardLabel : undefined
    }];
  });
}

/** Converts any persisted state-shaped object into the complete v8 schema. */
export function migrateLifeQuestState(value: unknown, now = new Date()): LifeQuestState {
  const fallback = createInitialLifeQuestState();
  const source = isRecord(value) ? value : {};
  const nowKey = calendarDateKey(now);
  const rawQuests = Array.isArray(source.quests) ? source.quests : fallback.quests;
  const quests = rawQuests.filter(isRecord).map((quest) => {
    const partial = quest as PartialQuest;
    const difficulty = (partial.difficulty ?? "easy") as QuestDifficulty;
    const priority: QuestPriority = partial.priority === "low" || partial.priority === "high" ? partial.priority : "normal";
    const recurrence: QuestRecurrence = partial.recurrence === "daily" || partial.recurrence === "weekly" ? partial.recurrence : "none";
    return {
      ...partial,
      type: partial.type ?? "side",
      category: partial.category ?? "learning",
      occupation: partial.occupation ?? "general",
      difficulty,
      expReward: typeof partial.expReward === "number" ? partial.expReward : getExpReward(difficulty),
      status: partial.status === "completed" ? "completed" : "pending",
      createdAt: typeof partial.createdAt === "string" ? partial.createdAt : now.toISOString(),
      completedAt: isDateString(partial.completedAt) ? partial.completedAt : null,
      priority,
      dueDate: isLocalDate(partial.dueDate) ? partial.dueDate : null,
      estimatedMinutes: typeof partial.estimatedMinutes === "number" && Number.isFinite(partial.estimatedMinutes) && partial.estimatedMinutes > 0 ? Math.round(partial.estimatedMinutes) : null,
      recurrence,
      subtasks: normalizeSubtasks(partial.subtasks),
      questChainId: typeof partial.questChainId === "string" && partial.questChainId ? partial.questChainId : null
    };
  }).filter((quest): quest is Quest => typeof quest.id === "string" && typeof quest.title === "string" && typeof quest.description === "string");
  const lifeMoments: LifeQuestState["lifeMoments"] = (Array.isArray(source.lifeMoments)
    ? source.lifeMoments.filter((moment): moment is StateRecord => isRecord(moment) && typeof moment.id === "string" &&
        typeof moment.adventureName === "string" && typeof moment.note === "string" && typeof moment.mood === "string" && isDateString(moment.completedAt))
      .map((moment) => ({ ...moment, adventureId: typeof moment.adventureId === "string" ? moment.adventureId : undefined, rewardGranted: typeof moment.rewardGranted === "boolean" ? moment.rewardGranted : undefined }))
    : []) as LifeQuestState["lifeMoments"];
  const completionDates = [
    ...quests.filter((quest) => quest.status === "completed").flatMap((quest) => [completionDate(quest.completedAt)]),
    ...lifeMoments.flatMap((moment) => [completionDate(moment.completedAt)])
  ].filter((date): date is string => date !== null);
  const sourceDaily = isRecord(source.dailyProgress) ? source.dailyProgress : null;
  const storedDailyIds = sourceDaily && sourceDaily.date === nowKey ? uniqueIds(sourceDaily.completedQuestIds) : null;
  const todayCompletedQuests = quests.filter((quest) => quest.status === "completed" && completionDate(quest.completedAt) === nowKey);
  const derivedTodayIds = todayCompletedQuests.map((quest) => quest.id);
  const derivedTodayExp = todayCompletedQuests.reduce((total, quest) => total + quest.expReward, 0);
  const storedDailyExp = sourceDaily && sourceDaily.date === nowKey && typeof sourceDaily.expEarned === "number" && sourceDaily.expEarned >= 0
    ? sourceDaily.expEarned
    : derivedTodayExp;
  const sourceStreak = isRecord(source.streak) && typeof source.streak.current === "number" && typeof source.streak.longest === "number" && (typeof source.streak.lastCompletedDate === "string" || source.streak.lastCompletedDate === null)
    ? { current: Math.max(0, source.streak.current), longest: Math.max(0, source.streak.longest), lastCompletedDate: typeof source.streak.lastCompletedDate === "string" ? source.streak.lastCompletedDate : null }
    : buildStreakFromCompletionDates(completionDates);
  const profile = isRecord(source.profile)
    ? { ...source.profile, lifeStage: source.profile.lifeStage ?? (source.profile.occupation === "student" || source.profile.role === "student" ? "student" : "adult"), studentStage: source.profile.studentStage ?? (source.profile.occupation === "student" || source.profile.role === "student" ? "university" : undefined), occupation: source.profile.occupation ?? "general", focus: source.profile.focus ?? (Array.isArray(source.profile.focuses) ? source.profile.focuses[0] : undefined) ?? "learning", focuses: Array.isArray(source.profile.focuses) && source.profile.focuses.length > 0 ? source.profile.focuses : [source.profile.focus ?? "learning"] }
    : null;

  return {
    ...fallback,
    schemaVersion: 8,
    profile: profile as LifeQuestState["profile"],
    quests,
    stats: { ...defaultStats, ...(isRecord(source.stats) ? source.stats : {}) },
    achievements: Array.isArray(source.achievements) ? source.achievements as LifeQuestState["achievements"] : createDefaultAchievements(),
    mapCompletions: uniqueIds(source.mapCompletions),
    occupationSuggestions: Array.isArray(source.occupationSuggestions) ? source.occupationSuggestions as LifeQuestState["occupationSuggestions"] : [],
    lifeMoments: lifeMoments as LifeQuestState["lifeMoments"],
    favoriteAdventureIds: uniqueIds(source.favoriteAdventureIds),
    savedAdventureIds: uniqueIds(source.savedAdventureIds),
    dismissedAdventures: Array.isArray(source.dismissedAdventures) ? source.dismissedAdventures.filter((item) => isRecord(item) && typeof item.adventureId === "string" && typeof item.dismissedAt === "string" && typeof item.count === "number").map((item) => ({ adventureId: item.adventureId as string, dismissedAt: item.dismissedAt as string, count: Math.max(1, item.count as number) })) : [],
    recommendationHistory: Array.isArray(source.recommendationHistory) ? source.recommendationHistory.filter((item) => isRecord(item) && typeof item.adventureId === "string" && typeof item.shownAt === "string" && typeof item.action === "string" && recommendationActions.has(item.action)).slice(-100) as LifeQuestState["recommendationHistory"] : [],
    selectedAdventureId: typeof source.selectedAdventureId === "string" ? source.selectedAdventureId : null,
    dailyProgress: { date: nowKey, completedQuestIds: storedDailyIds ?? derivedTodayIds, expEarned: storedDailyExp },
    streak: sourceStreak,
    customMapLocations: normalizeCustomMapLocations(source.customMapLocations),
    unlockedSkillNodeIds: uniqueIds(source.unlockedSkillNodeIds).filter((id) => skillNodeIds.has(id)),
    savedQuotes: normalizeSavedQuotes(source.savedQuotes),
    adventureJournal: normalizeAdventureJournal(source.adventureJournal),
    recentAdventureQuoteIds: uniqueIds(source.recentAdventureQuoteIds).slice(-4),
    userSettings: { ...defaultUserSettings, ...(isRecord(source.userSettings) && (source.userSettings.theme === "system" || source.userSettings.theme === "dark") ? { theme: source.userSettings.theme } : {}), ...(isRecord(source.userSettings) && typeof source.userSettings.reducedMotion === "boolean" ? { reducedMotion: source.userSettings.reducedMotion } : {}), ...(isRecord(source.userSettings) && typeof source.userSettings.notificationsEnabled === "boolean" ? { notificationsEnabled: source.userSettings.notificationsEnabled } : {}) }
  };
}

export function importLifeQuestState(rawJson: string): { success: true; state: LifeQuestState } | { success: false } {
  try {
    const parsed: unknown = JSON.parse(rawJson);
    return isRecord(parsed) ? { success: true, state: migrateLifeQuestState(parsed) } : { success: false };
  } catch {
    return { success: false };
  }
}
