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

export interface LifeQuestState {
  profile: UserProfile | null;
  quests: Quest[];
  stats: Stats;
  achievements: Achievement[];
  mapCompletions: string[];
  occupationSuggestions: OccupationSuggestion[];
  lifeMoments: LifeMoment[];
}
