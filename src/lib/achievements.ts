import { createDefaultAchievements } from "@/data/defaults";
import type { Achievement, Quest } from "@/types";

interface AchievementContext {
  quests: Quest[];
  mapCompletions: string[];
}

function countCompleted(quests: Quest[]) {
  return quests.filter((quest) => quest.status === "completed");
}

export function evaluateAchievements(
  achievements: Achievement[],
  context: AchievementContext,
  now = new Date().toISOString()
): Achievement[] {
  const templates = createDefaultAchievements();
  const byId = new Map(achievements.map((achievement) => [achievement.id, achievement]));
  const completed = countCompleted(context.quests);

  const conditions: Record<string, boolean> = {
    "first-quest": completed.length >= 1,
    "five-quests": completed.length >= 5,
    "ten-quests": completed.length >= 10,
    "three-learning":
      completed.filter((quest) => quest.category === "learning").length >= 3,
    "three-creativity":
      completed.filter((quest) => quest.category === "creativity").length >= 3,
    "three-map": context.mapCompletions.length >= 3
  };

  return templates.map((template) => {
    const current = byId.get(template.id);
    const wasUnlocked = Boolean(current?.unlocked);
    const shouldUnlock = conditions[template.id] ?? false;

    return {
      ...template,
      unlocked: wasUnlocked || shouldUnlock,
      unlockedAt: current?.unlockedAt ?? (shouldUnlock ? now : null)
    };
  });
}
