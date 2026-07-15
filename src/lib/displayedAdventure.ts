import type { ScoredAdventure } from "@/lib/recommendations";

export function resolveDisplayedAdventure(
  recommendations: ScoredAdventure[],
  displayedAdventureId: string | null
): ScoredAdventure | undefined {
  return recommendations.find((item) => item.adventure.id === displayedAdventureId) ?? recommendations[0];
}

export function getNextDisplayedAdventureId(
  recommendations: ScoredAdventure[],
  displayedAdventureId: string | null
): string | null {
  if (recommendations.length === 0) return null;
  return recommendations.find((item) => item.adventure.id !== displayedAdventureId)?.adventure.id
    ?? recommendations[0].adventure.id;
}
