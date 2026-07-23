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

export type QuestPriority = "low" | "normal" | "high";

export type QuestRecurrence = "none" | "daily" | "weekly";

export interface QuestSubtask {
  id: string;
  title: string;
  completed: boolean;
  completedAt: string | null;
}

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
  priority: QuestPriority;
  dueDate: string | null;
  estimatedMinutes: number | null;
  recurrence: QuestRecurrence;
  subtasks: QuestSubtask[];
  questChainId: string | null;
}

export type QuestDraft = Pick<
  Quest,
  "title" | "description" | "type" | "category" | "occupation" | "difficulty"
> & Partial<Pick<Quest, "priority" | "dueDate" | "estimatedMinutes" | "recurrence" | "subtasks" | "questChainId">>;

export interface Stats {
  learning: number;
  fitness: number;
  creativity: number;
  social: number;
  discipline: number;
  exploration: number;
}

export interface SkillNode {
  id: string;
  category: QuestCategory;
  title: string;
  description: string;
  requiredStat: number;
  requiredQuestCount: number;
  prerequisiteIds: string[];
  rewardTitle: string;
  rewardDescription: string;
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
  notes?: string;
  isCustom?: boolean;
}

export interface DailyProgress {
  /** Local calendar date in YYYY-MM-DD format. */
  date: string;
  completedQuestIds: string[];
  expEarned: number;
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
  tutorialCompletedAt: string | null;
}

export type QuoteCategory =
  | "main-quest"
  | "level-up"
  | "skill-up"
  | "streak"
  | "achievement"
  | "location";

export type CityEchoCategory =
  | "exploration"
  | "connection"
  | "rest"
  | "awareness"
  | "courage"
  | "creation"
  | "daily";

export type QuoteIntent =
  | "small_step" | "progress" | "learning" | "discipline" | "focus"
  | "creation" | "exploration" | "awareness" | "rest" | "fitness"
  | "courage" | "resilience" | "failure" | "dream" | "self_belief"
  | "change" | "connection" | "teamwork" | "reflection";

export type AdventureQuoteSourceType = "movie" | "game" | "proPlayer" | "football" | "athlete" | "proverb" | "published" | "original" | "public_domain";

/** Includes retired values so existing LocalStorage journal snapshots remain readable. */
export type QuoteSourceType = AdventureQuoteSourceType
  | "game-character"
  | "game-skin"
  | "esports-player"
  | "original"
  | "public_domain"
  | "user"
  | "licensed"
  | "unknown";

export type AttributionStatus = "verified" | "source-known" | "unverified";
export type AdventureQuoteSourceStatus = "verified" | "likely" | "paraphrase" | "unverified" | "original";

export interface AdventureQuote {
  id: string;
  text: string;
  /** Speaker for voiced lines; author remains for literary quotations. */
  speaker?: string;
  author?: string;
  work?: string;
  dynasty?: string;
  sourceType: QuoteSourceType;
  sourceStatus: AdventureQuoteSourceStatus;
  sourceTitle?: string;
  sourceUrl?: string;
  game?: string;
  skin?: string;
  /** Retained only to read snapshots written by the previous release. */
  attributionStatus?: AttributionStatus;
  note?: string;
  categories: CityEchoCategory[];
  tags?: string[];
  intents?: QuoteIntent[];
  avoidIntents?: QuoteIntent[];
  specificity?: "neutral" | "specific";
  enabled: boolean;
  weight?: number;
}

export interface SavedQuote {
  id: string;
  quoteId: string;
  text: string;
  category: QuoteCategory;
  savedAt: string;
  sourceType?: string;
  sourceId?: string;
  sourceTitle?: string;
  location?: {
    name?: string;
    latitude?: number;
    longitude?: number;
  };
}

/** Ephemeral UI state. It deliberately is not persisted as a memory fragment yet. */
export interface CompletionFeedback {
  eventId: string;
  quote: AdventureQuote;
  taskId: string;
  taskName: string;
  completedAt: string;
  category: CityEchoCategory;
  questCategory?: QuestCategory;
  expReward?: number;
  rewardLabel?: string;
  canSaveJournal?: boolean;
}

export type CompletionMood = "relaxed" | "happy" | "surprised" | "discovered" | "calm" | "unchanged";

export interface AdventureJournalEntry {
  id: string;
  taskId: string;
  taskName: string;
  completedAt: string;
  category: CityEchoCategory;
  mood: CompletionMood | null;
  note?: string;
  quoteId: string;
  quoteText: string;
  quoteSourceType: QuoteSourceType;
  quoteSourceStatus: AdventureQuoteSourceStatus;
  quoteSourceTitle?: string;
  quoteSourceUrl?: string;
  quoteGame?: string;
  quoteSkin?: string;
  /** Retained only to read snapshots written by the previous release. */
  quoteAttributionStatus?: AttributionStatus;
  quoteSpeaker?: string;
  quoteAuthor?: string;
  quoteWork?: string;
  quoteDynasty?: string;
  quoteNote?: string;
  expReward?: number;
  rewardLabel?: string;
}

export interface LifeQuestState {
  schemaVersion: 10;
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
  savedQuotes: SavedQuote[];
  adventureJournal: AdventureJournalEntry[];
  recentAdventureQuoteIds: string[];
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
