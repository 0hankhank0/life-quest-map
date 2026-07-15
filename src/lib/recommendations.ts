import type { AvailableTime, MicroAdventure, Mood } from "../data/microAdventures";
import type { DismissedAdventure, GrowthFocus, OccupationCategory } from "../types";

export interface AdventureRecommendationContext {
  mood: Mood;
  time: AvailableTime;
  focuses?: GrowthFocus[];
  occupation?: OccupationCategory;
  favoriteAdventureIds: string[];
  savedAdventureIds: string[];
  dismissedAdventures: DismissedAdventure[];
  recentlyShownIds: string[];
  recentlyShownCategories?: GrowthFocus[];
  completedTodayIds: string[];
}

export interface ScoredAdventure { adventure: MicroAdventure; score: number; reasons: string[] }

const dayMs = 24 * 60 * 60 * 1000;

export function getAdventureRecommendations(
  adventures: MicroAdventure[],
  context: AdventureRecommendationContext,
  now = new Date()
): ScoredAdventure[] {
  const recent = new Set(context.recentlyShownIds);
  const completed = new Set(context.completedTodayIds);
  const favorites = new Set(context.favoriteAdventureIds);
  const saved = new Set(context.savedAdventureIds);
  const dismissed = new Map(context.dismissedAdventures.map((item) => [item.adventureId, item]));
  const recentCategoryCounts = (context.recentlyShownCategories ?? []).reduce<Partial<Record<GrowthFocus, number>>>(
    (counts, category) => ({ ...counts, [category]: (counts[category] ?? 0) + 1 }),
    {}
  );

  return adventures.map((adventure) => {
    let score = 0;
    const reasons: string[] = [];
    if (adventure.moods.includes(context.mood)) { score += 40; reasons.push("符合你現在的心情"); }
    if (adventure.times.includes(context.time)) { score += 34; reasons.push(`大約 ${context.time === "60" ? "60" : context.time} 分鐘能完成`); }
    if (context.focuses?.includes(adventure.category)) { score += 15; reasons.push("和你的成長方向有關"); }
    if (adventure.occupation === context.occupation) score += 9;
    if (adventure.occupation === "general") score += 5;
    if (context.mood === "tired" && adventure.difficulty === "easy") { score += 10; reasons.push("適合需要充電的狀態"); }
    if (context.mood === "out" && ["exploration", "fitness"].includes(adventure.category)) score += 10;
    if (context.mood === "social" && adventure.category === "social") score += 12;
    if (context.mood === "quiet" && ["creativity", "learning", "exploration"].includes(adventure.category)) score += 8;
    if (favorites.has(adventure.id)) { score += 6; reasons.push("你之前收藏過這個提案"); }
    if (saved.has(adventure.id)) { score += 4; reasons.push("已留在你的稍後清單"); }
    if (recent.has(adventure.id)) score -= 24;
    score -= (recentCategoryCounts[adventure.category] ?? 0) * 7;
    if (completed.has(adventure.id)) score -= 1000;
    const dismissal = dismissed.get(adventure.id);
    if (dismissal) {
      const age = now.getTime() - new Date(dismissal.dismissedAt).getTime();
      if (age < dayMs * 7) score -= 45 + dismissal.count * 5;
    }
    return { adventure, score, reasons: reasons.slice(0, 3) };
  }).sort((a, b) => b.score - a.score || a.adventure.id.localeCompare(b.adventure.id));
}
