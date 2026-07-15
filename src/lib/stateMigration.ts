import {
  createDefaultAchievements,
  createInitialLifeQuestState,
  defaultStats,
  defaultUserSettings
} from "@/data/defaults";
import { buildStreakFromCompletionDates } from "@/lib/dailyProgress";
import { getExpReward } from "@/lib/progression";
import { todayKey } from "@/lib/utils";
import type { LifeQuestState, Quest, QuestDifficulty } from "@/types";

type StateRecord = Record<string, unknown>;
type PartialQuest = Partial<Quest> & Pick<Quest, "id" | "title" | "description">;

const recommendationActions = new Set(["shown", "favorite", "saved", "dismissed", "completed"]);
const uniqueIds = (items: unknown): string[] =>
  Array.isArray(items) ? [...new Set(items.filter((item): item is string => typeof item === "string"))] : [];
const isRecord = (value: unknown): value is StateRecord => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isDateString = (value: unknown): value is string => typeof value === "string" && !Number.isNaN(new Date(value).getTime());
const completionDate = (value: unknown): string | null => isDateString(value) ? todayKey(new Date(value)) : null;

function normalizeCustomMapLocations(value: unknown): LifeQuestState["customMapLocations"] {
  return Array.isArray(value)
    ? value.filter((location): location is LifeQuestState["customMapLocations"][number] =>
        isRecord(location) && typeof location.id === "string" && typeof location.name === "string" &&
        typeof location.type === "string" && typeof location.lat === "number" && typeof location.lng === "number" &&
        typeof location.questTitle === "string" && typeof location.category === "string" && typeof location.expReward === "number")
    : [];
}

/** Converts any persisted state-shaped object into the complete v2 schema. */
export function migrateLifeQuestState(value: unknown, now = new Date()): LifeQuestState {
  const fallback = createInitialLifeQuestState();
  const source = isRecord(value) ? value : {};
  const nowKey = todayKey(now);
  const rawQuests = Array.isArray(source.quests) ? source.quests : fallback.quests;
  const quests = rawQuests.filter(isRecord).map((quest) => {
    const partial = quest as PartialQuest;
    const difficulty = (partial.difficulty ?? "easy") as QuestDifficulty;
    return {
      ...partial,
      type: partial.type ?? "side",
      category: partial.category ?? "learning",
      occupation: partial.occupation ?? "general",
      difficulty,
      expReward: typeof partial.expReward === "number" ? partial.expReward : getExpReward(difficulty),
      status: partial.status === "completed" ? "completed" : "pending",
      createdAt: typeof partial.createdAt === "string" ? partial.createdAt : now.toISOString(),
      completedAt: isDateString(partial.completedAt) ? partial.completedAt : null
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
  const derivedTodayIds = quests.filter((quest) => quest.status === "completed" && completionDate(quest.completedAt) === nowKey).map((quest) => quest.id);
  const sourceStreak = isRecord(source.streak) && typeof source.streak.current === "number" && typeof source.streak.longest === "number" && (typeof source.streak.lastCompletedDate === "string" || source.streak.lastCompletedDate === null)
    ? { current: Math.max(0, source.streak.current), longest: Math.max(0, source.streak.longest), lastCompletedDate: typeof source.streak.lastCompletedDate === "string" ? source.streak.lastCompletedDate : null }
    : buildStreakFromCompletionDates(completionDates);
  const profile = isRecord(source.profile)
    ? { ...source.profile, lifeStage: source.profile.lifeStage ?? (source.profile.occupation === "student" || source.profile.role === "student" ? "student" : "adult"), studentStage: source.profile.studentStage ?? (source.profile.occupation === "student" || source.profile.role === "student" ? "university" : undefined), occupation: source.profile.occupation ?? "general", focus: source.profile.focus ?? (Array.isArray(source.profile.focuses) ? source.profile.focuses[0] : undefined) ?? "learning", focuses: Array.isArray(source.profile.focuses) && source.profile.focuses.length > 0 ? source.profile.focuses : [source.profile.focus ?? "learning"] }
    : null;

  return {
    ...fallback,
    schemaVersion: 2,
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
    dailyProgress: { date: nowKey, completedQuestIds: storedDailyIds ?? derivedTodayIds },
    streak: sourceStreak,
    customMapLocations: normalizeCustomMapLocations(source.customMapLocations),
    unlockedSkillNodeIds: uniqueIds(source.unlockedSkillNodeIds),
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
