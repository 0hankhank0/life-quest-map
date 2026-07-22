import type {
  Achievement,
  LifeQuestState,
  MapLocation,
  Quest,
  Stats,
  UserSettings
} from "@/types";
import { getExpReward } from "@/lib/progression";
import { calendarDateKey } from "@/lib/utils";

export const STORAGE_KEY = "lifeQuestMap:v0.1";

export const defaultStats: Stats = {
  learning: 0,
  fitness: 0,
  creativity: 0,
  social: 0,
  discipline: 0,
  exploration: 0
};

export const defaultUserSettings: UserSettings = {
  theme: "system",
  reducedMotion: false,
  notificationsEnabled: false
};

export function createDemoQuests(now = new Date().toISOString()): Quest[] {
  return [
    {
      id: "demo-main-english",
      title: "背英文單字 20 個",
      description: "用 15 分鐘整理今天最想記住的單字，完成後做一次快速回想。",
      type: "main",
      category: "learning",
      occupation: "student",
      difficulty: "normal",
      expReward: getExpReward("normal"),
      status: "pending",
      createdAt: now,
      completedAt: null
    },
    {
      id: "demo-side-desk",
      title: "整理書桌 10 分鐘",
      description: "清出工作區，把下一個任務需要的物品放到看得到的位置。",
      type: "side",
      category: "discipline",
      occupation: "general",
      difficulty: "easy",
      expReward: getExpReward("easy"),
      status: "pending",
      createdAt: now,
      completedAt: null
    },
    {
      id: "demo-daily-walk",
      title: "跑步或走路 15 分鐘",
      description: "保持輕鬆速度，以安全、舒服、能持續的節奏完成。",
      type: "daily",
      category: "fitness",
      occupation: "general",
      difficulty: "easy",
      expReward: getExpReward("easy"),
      status: "pending",
      createdAt: now,
      completedAt: null
    },
    {
      id: "demo-side-portfolio",
      title: "推進作品集 30 分鐘",
      description: "整理一段作品說明、截圖或案例流程，讓作品更容易被看懂。",
      type: "side",
      category: "creativity",
      occupation: "creator",
      difficulty: "normal",
      expReward: getExpReward("normal"),
      status: "pending",
      createdAt: now,
      completedAt: null
    },
    {
      id: "demo-daily-note",
      title: "寫一句今日紀錄",
      description: "記下今天完成的一件小事，保留行動的證據。",
      type: "daily",
      category: "discipline",
      occupation: "general",
      difficulty: "easy",
      expReward: getExpReward("easy"),
      status: "pending",
      createdAt: now,
      completedAt: null
    },
    {
      id: "demo-hidden-city-photo",
      title: "拍一張城市觀察照片",
      description: "只拍公共空間或物件，不拍攝可識別的陌生人或私人資訊。",
      type: "hidden",
      category: "exploration",
      occupation: "general",
      difficulty: "normal",
      expReward: getExpReward("normal"),
      status: "pending",
      createdAt: now,
      completedAt: null
    }
  ].map((quest) => ({
    ...quest,
    priority: "normal" as const,
    dueDate: null,
    estimatedMinutes: null,
    recurrence: "none" as const,
    subtasks: [],
    questChainId: null
  })) as Quest[];
}

export function createDefaultAchievements(): Achievement[] {
  return [
    {
      id: "first-quest",
      title: "新手冒險者",
      description: "完成第一個任務",
      unlocked: false,
      unlockedAt: null
    },
    {
      id: "five-quests",
      title: "任務起步者",
      description: "完成 5 個任務",
      unlocked: false,
      unlockedAt: null
    },
    {
      id: "ten-quests",
      title: "穩定行動者",
      description: "完成 10 個任務",
      unlocked: false,
      unlockedAt: null
    },
    {
      id: "three-learning",
      title: "學習型玩家",
      description: "完成 3 個學習任務",
      unlocked: false,
      unlockedAt: null
    },
    {
      id: "three-creativity",
      title: "創作起步者",
      description: "完成 3 個創作任務",
      unlocked: false,
      unlockedAt: null
    },
    {
      id: "three-map",
      title: "城市探索者",
      description: "完成 3 個地圖任務",
      unlocked: false,
      unlockedAt: null
    }
  ];
}

export const mapLocations: MapLocation[] = [
  {
    id: "school",
    name: "學校",
    type: "學習任務據點",
    lat: 25.033,
    lng: 121.5654,
    questTitle: "整理一頁今日學習筆記",
    category: "learning",
    expReward: 50
  },
  {
    id: "home",
    name: "家裡",
    type: "自律與創作基地",
    lat: 25.0418,
    lng: 121.554,
    questTitle: "完成 20 分鐘專注創作",
    category: "creativity",
    expReward: 50
  },
  {
    id: "library",
    name: "圖書館",
    type: "專注任務據點",
    lat: 25.0479,
    lng: 121.5171,
    questTitle: "閱讀 10 頁並寫下重點",
    category: "learning",
    expReward: 50
  },
  {
    id: "field",
    name: "操場",
    type: "安全體能任務",
    lat: 25.0219,
    lng: 121.535,
    questTitle: "輕鬆走路或慢跑 15 分鐘",
    category: "fitness",
    expReward: 20
  },
  {
    id: "city-observation",
    name: "城市探索點",
    type: "探索任務據點",
    lat: 25.052,
    lng: 121.544,
    questTitle: "記錄一個公共空間觀察",
    category: "exploration",
    expReward: 50
  }
];

export function createInitialLifeQuestState(): LifeQuestState {
  return {
    schemaVersion: 6,
    profile: null,
    quests: createDemoQuests(),
    stats: { ...defaultStats },
    achievements: createDefaultAchievements(),
    mapCompletions: [],
    occupationSuggestions: [],
    lifeMoments: [],
    favoriteAdventureIds: [],
    savedAdventureIds: [],
    dismissedAdventures: [],
    recommendationHistory: [],
    selectedAdventureId: null,
    dailyProgress: {
      date: calendarDateKey(),
      completedQuestIds: [],
      expEarned: 0
    },
    streak: {
      current: 0,
      longest: 0,
      lastCompletedDate: null
    },
    customMapLocations: [],
    unlockedSkillNodeIds: [],
    savedQuotes: [],
    adventureJournal: [],
    recentAdventureQuoteIds: [],
    userSettings: { ...defaultUserSettings }
  };
}
