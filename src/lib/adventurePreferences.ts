import type { RecommendationAction, RecommendationHistoryEntry } from "@/types";

export function toggleUniqueId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}

export function appendRecommendationHistory(
  history: RecommendationHistoryEntry[],
  adventureId: string,
  action: RecommendationAction,
  shownAt = new Date().toISOString()
): RecommendationHistoryEntry[] {
  if (action === "shown") {
    const last = history.at(-1);
    if (last?.action === "shown" && last.adventureId === adventureId) return history;
  }

  return [...history, { adventureId, shownAt, action }].slice(-100);
}
