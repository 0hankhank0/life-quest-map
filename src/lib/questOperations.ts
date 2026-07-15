import { evaluateAchievements } from "@/lib/achievements";
import { recordDailyQuestCompletion, updateStreakForCompletion } from "@/lib/dailyProgress";
import { appendRecommendationHistory } from "@/lib/adventurePreferences";
import { STAT_GAIN_PER_QUEST, addStat, getExpReward, getLevelFromExp } from "@/lib/progression";
import { createId, todayKey } from "@/lib/utils";
import type { LifeMomentMood, LifeQuestState, MapLocation, Quest, QuestDraft } from "@/types";

function awardExperience(state: LifeQuestState, amount: number): LifeQuestState {
  if (!state.profile) return state;
  const exp = state.profile.exp + amount;
  return { ...state, profile: { ...state.profile, exp, level: getLevelFromExp(exp) } };
}

function applyCompletion(state: LifeQuestState, quest: Quest, now: string, mapCompletions = state.mapCompletions): LifeQuestState {
  const withExp = awardExperience(state, quest.expReward);
  const quests = [quest, ...state.quests];
  return {
    ...withExp,
    quests,
    stats: quest.type === "map"
      ? { ...withExp.stats, exploration: withExp.stats.exploration + STAT_GAIN_PER_QUEST }
      : addStat(withExp.stats, quest.category),
    achievements: evaluateAchievements(withExp.achievements, { quests, mapCompletions }),
    mapCompletions,
    dailyProgress: recordDailyQuestCompletion(withExp.dailyProgress, quest.id, quest.expReward, now),
    streak: updateStreakForCompletion(withExp.streak, now)
  };
}

export function createQuest(draft: QuestDraft, now = new Date().toISOString(), id = createId("quest")): Quest {
  return { id, ...draft, expReward: getExpReward(draft.difficulty), status: "pending", createdAt: now, completedAt: null };
}

export function addQuest(state: LifeQuestState, draft: QuestDraft): LifeQuestState {
  return { ...state, quests: [createQuest(draft), ...state.quests] };
}

export function addQuestPack(state: LifeQuestState, drafts: QuestDraft[], now = new Date().toISOString()): { state: LifeQuestState; added: number } {
  const existing = new Set(state.quests.map((quest) => `${quest.occupation}:${quest.title}`));
  const additions = drafts.filter((draft) => !existing.has(`${draft.occupation}:${draft.title}`)).map((draft) => createQuest(draft, now, createId("pack")));
  return additions.length ? { state: { ...state, quests: [...additions, ...state.quests] }, added: additions.length } : { state, added: 0 };
}

export function updateQuest(state: LifeQuestState, questId: string, draft: QuestDraft): LifeQuestState {
  return { ...state, quests: state.quests.map((quest) => quest.id === questId ? { ...quest, ...draft, expReward: getExpReward(draft.difficulty) } : quest) };
}

export function deleteQuest(state: LifeQuestState, questId: string): LifeQuestState {
  return { ...state, quests: state.quests.filter((quest) => quest.id !== questId) };
}

export function completeQuest(state: LifeQuestState, questId: string, now = new Date().toISOString()): LifeQuestState {
  const target = state.quests.find((quest) => quest.id === questId);
  if (!target || target.status === "completed") return state;
  const completedQuest = { ...target, status: "completed" as const, completedAt: now };
  const base = { ...state, quests: state.quests.filter((quest) => quest.id !== questId) };
  return applyCompletion(base, completedQuest, now);
}

export function completeMicroAdventure(state: LifeQuestState, adventureId: string, draft: QuestDraft, note: string, mood: LifeMomentMood, now = new Date().toISOString()): LifeQuestState {
  const alreadyRewardedToday = state.lifeMoments.some((moment) =>
    (moment.adventureId === adventureId || (!moment.adventureId && moment.adventureName === draft.title)) &&
    (moment.rewardGranted ?? true) && todayKey(new Date(moment.completedAt)) === todayKey(new Date(now)));
  if (alreadyRewardedToday) return state;
  const quest = { ...createQuest(draft, now, createId("micro-adventure")), status: "completed" as const, completedAt: now };
  const completed = applyCompletion(state, quest, now);
  return {
    ...completed,
    lifeMoments: [{ id: createId("life-moment"), adventureName: draft.title, note: note.trim(), mood, completedAt: now, adventureId, rewardGranted: true }, ...state.lifeMoments],
    savedAdventureIds: state.savedAdventureIds.filter((id) => id !== adventureId),
    recommendationHistory: appendRecommendationHistory(state.recommendationHistory, adventureId, "completed", now)
  };
}

export function completeMapLocation(state: LifeQuestState, location: MapLocation, now = new Date().toISOString()): LifeQuestState {
  if (state.mapCompletions.includes(location.id)) return state;
  const quest: Quest = { id: `map-${location.id}`, title: location.questTitle, description: `${location.name} map quest`, type: "map", category: location.category, occupation: "general", difficulty: location.expReward >= 100 ? "hard" : location.expReward >= 50 ? "normal" : "easy", expReward: location.expReward, status: "completed", createdAt: now, completedAt: now };
  return applyCompletion(state, quest, now, [...state.mapCompletions, location.id]);
}
