import type { OccupationCategory, QuestCategory, QuestType } from "@/types";

export const statOrder: QuestCategory[] = [
  "learning",
  "fitness",
  "creativity",
  "social",
  "discipline",
  "exploration"
];

export const questFilters: Array<QuestType | "all"> = ["all", "main", "side", "daily", "hidden", "map"];

export type OccupationFilter = "all" | "mine" | OccupationCategory;
