import type {
  GrowthFocus,
  LifeStage,
  OccupationCategory,
  QuestCategory,
  QuestDifficulty,
  QuestType,
  Role,
  StudentStage
} from "@/types";

export const lifeStageOptions: Array<{
  value: LifeStage;
  label: string;
  description: string;
}> = [
  {
    value: "student",
    label: "學生階段",
    description: "先選國高中、大學或研究所，再建立學習任務路線"
  },
  {
    value: "adult",
    label: "成人階段",
    description: "依職業、接案、創作或生活節奏建立任務路線"
  }
];

export const studentStageOptions: Array<{
  value: StudentStage;
  label: string;
  description: string;
}> = [
  { value: "junior_high", label: "國中", description: "課業、考試、習慣與探索" },
  { value: "senior_high", label: "高中", description: "學測、分科、社團與作品累積" },
  { value: "university", label: "大學", description: "專題、技能、實習與作品集" },
  { value: "graduate", label: "研究所", description: "研究、論文、專案與專業輸出" },
  { value: "other", label: "其他學生", description: "補習、轉職學習或自學階段" }
];

export const studentStageLabels: Record<StudentStage, string> = studentStageOptions.reduce(
  (labels, option) => ({
    ...labels,
    [option.value]: option.label
  }),
  {} as Record<StudentStage, string>
);

export const roleOptions: Array<{ value: Role; label: string; description: string }> = [
  {
    value: "student",
    label: "學生",
    description: "用任務節奏累積學習與作品"
  },
  {
    value: "creator",
    label: "創作者",
    description: "把創作、輸出與靈感收集變成支線"
  },
  {
    value: "athlete",
    label: "運動玩家",
    description: "以安全的日常活動提升體能"
  },
  {
    value: "discipline",
    label: "自律挑戰者",
    description: "建立穩定、可持續的生活節奏"
  }
];

export const focusOptions: Array<{
  value: GrowthFocus;
  label: string;
  description: string;
}> = [
  { value: "learning", label: "學習", description: "知識、閱讀、語言與專注" },
  { value: "fitness", label: "體能", description: "走路、伸展、輕鬆跑步" },
  { value: "creativity", label: "創作", description: "作品集、寫作、影像與設計" },
  { value: "social", label: "社交", description: "連結、分享、清楚表達" },
  { value: "discipline", label: "自律", description: "整理、紀錄、固定儀式" },
  { value: "exploration", label: "探索", description: "觀察城市、拜訪新地點" }
];

export const occupationOptions: Array<{
  value: OccupationCategory;
  label: string;
  description: string;
}> = [
  { value: "general", label: "通用冒險者", description: "適合還在探索方向的人" },
  { value: "student", label: "學生", description: "學習、考試、專題與作品累積" },
  { value: "developer", label: "工程師", description: "開發、除錯、系統設計與作品集" },
  { value: "designer", label: "設計師", description: "研究、介面、品牌與設計輸出" },
  { value: "creator", label: "內容創作者", description: "寫作、影音、社群與創意企劃" },
  { value: "marketer", label: "行銷企劃", description: "文案、數據、活動與成長實驗" },
  { value: "educator", label: "教育工作者", description: "備課、教學、回饋與知識整理" },
  { value: "healthcare", label: "醫療照護", description: "專業學習、照護流程與身心恢復" },
  { value: "service", label: "服務業", description: "溝通、現場節奏與體力管理" },
  { value: "business", label: "商務管理", description: "規劃、協作、決策與營運推進" },
  { value: "freelancer", label: "自由工作者", description: "接案、交付、時間與客戶管理" },
  { value: "public_servant", label: "公職人員", description: "制度、文件、民眾服務與進修" },
  { value: "researcher", label: "研究者", description: "閱讀、實驗、分析與論文推進" },
  { value: "fitness_coach", label: "健身教練", description: "課表、安全訓練與客戶追蹤" },
  { value: "custom", label: "其他職業", description: "輸入你的職業，並建議我們開發任務包" }
];

export const occupationLabels: Record<OccupationCategory, string> = occupationOptions.reduce(
  (labels, option) => ({
    ...labels,
    [option.value]: option.label
  }),
  {} as Record<OccupationCategory, string>
);

export const categoryLabels: Record<QuestCategory, string> = {
  learning: "學習力",
  fitness: "體能",
  creativity: "創作力",
  social: "社交力",
  discipline: "自律力",
  exploration: "探索力"
};

export const categoryDescriptions: Record<QuestCategory, string> = {
  learning: "閱讀、記憶、研究與專注",
  fitness: "安全、輕量、可持續的身體活動",
  creativity: "寫作、設計、影像與作品推進",
  social: "對話、分享、連結與表達",
  discipline: "整理、紀錄、習慣與節奏",
  exploration: "城市觀察、地圖任務與新場域"
};

export const questTypeLabels: Record<QuestType, string> = {
  main: "主線",
  side: "支線",
  daily: "每日",
  hidden: "隱藏",
  map: "地圖"
};

export const difficultyLabels: Record<QuestDifficulty, string> = {
  easy: "easy",
  normal: "normal",
  hard: "hard"
};
