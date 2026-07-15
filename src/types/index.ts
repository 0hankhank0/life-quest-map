export type Role = "student" | "creator" | "athlete" | "discipline";

export type LifeStage = "student" | "adult";

export type StudentStage =
  | "junior_high"
  | "senior_high"
  | "university"
  | "graduate"
  | "other";

export type OccupationCategory =
  | "general"
  | "student"
  | "developer"
  | "designer"
  | "creator"
  | "marketer"
  | "educator"
  | "healthcare"
  | "service"
  | "business"
  | "freelancer"
  | "public_servant"
  | "researcher"
  | "fitness_coach"
  | "custom";

export type GrowthFocus =
  | "learning"
  | "fitness"
  | "creativity"
  | "social"
  | "discipline"
  | "exploration";

export type QuestType = "main" | "side" | "daily" | "hidden" | "map";

export type QuestCategory = GrowthFocus;

export type QuestDifficulty = "easy" | "normal" | "hard";

export type QuestStatus = "pending" | "completed";

export interface UserProfile {
  id: string;
  name: string;
  lifeStage: LifeStage;
  studentStage?: StudentStage;
  role: Role;
  occupation: OccupationCategory;
  customOccupationName?: string;
  focus: GrowthFocus;
  focuses: GrowthFocus[];
  level: number;
  exp: number;
  createdAt: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  category: QuestCategory;
  occupation: OccupationCategory;
  difficulty: QuestDifficulty;
  expReward: number;
  status: QuestStatus;
  createdAt: string;
  completedAt: string | null;
}

export type QuestDraft = Pick<
  Quest,
  "title" | "description" | "type" | "category" | "occupation" | "difficulty"
>;

export interface Stats {
  learning: number;
  fitness: number;
  creativity: number;
  social: number;
  discipline: number;
  exploration: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface OccupationSuggestion {
  id: string;
  name: string;
  note: string;
  createdAt: string;
}

export type LifeMomentMood =
  | "happier"
  | "relaxed"
  | "refreshed"
  | "unchanged"
  | "trySomethingElse";

export interface LifeMoment {
  id: string;
  adventureName: string;
  note: string;
  mood: LifeMomentMood;
  completedAt: string;
  /** Stable micro-adventure identifier; absent on records saved before v0.1. */
  adventureId?: string;
  /** Whether this record was the daily completion that awarded EXP and a stat point. */
  rewardGranted?: boolean;
}

export interface MapLocation {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  questTitle: string;
  category: QuestCategory;
  expReward: number;
}

export interface DailyProgress {
  /** Local calendar date in YYYY-MM-DD format. */
  date: string;
  completedQuestIds: string[];
}

export interface Streak {
  current: number;
  longest: number;
  lastCompletedDate: string | null;
}

export interface UserSettings {
  theme: "system" | "dark";
  reducedMotion: boolean;
  notificationsEnabled: boolean;
}

export interface LifeQuestState {
  schemaVersion: 2;
  profile: UserProfile | null;
  quests: Quest[];
  stats: Stats;
  achievements: Achievement[];
  mapCompletions: string[];
  occupationSuggestions: OccupationSuggestion[];
  lifeMoments: LifeMoment[];
  favoriteAdventureIds: string[];
  savedAdventureIds: string[];
  dismissedAdventures: DismissedAdventure[];
  recommendationHistory: RecommendationHistoryEntry[];
  selectedAdventureId: string | null;
  dailyProgress: DailyProgress;
  streak: Streak;
  customMapLocations: MapLocation[];
  unlockedSkillNodeIds: string[];
  userSettings: UserSettings;
}

export interface DismissedAdventure {
  adventureId: string;
  dismissedAt: string;
  count: number;
}

export type RecommendationAction = "shown" | "favorite" | "saved" | "dismissed" | "completed";

export interface RecommendationHistoryEntry {
  adventureId: string;
  shownAt: string;
  action: RecommendationAction;
}
