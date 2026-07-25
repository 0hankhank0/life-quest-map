import type { LifeQuestState, Quest } from "@/types";

export type CompletionQuoteReason = "level-up" | "hard-quest" | "streak-milestone" | "returning" | "micro-adventure" | "map-quest" | "chance";
export interface CompletionQuoteDecision { show: boolean; reason?: CompletionQuoteReason; }
type StateLike = Pick<LifeQuestState, "completionQuoteEvents" | "quests" | "streak">;

const streakMilestones = new Set([3, 7, 14, 30, 60, 100]);
const DAY_MS = 86_400_000;
const COOLDOWN_MS = 25 * 60_000;

export function shouldShowCompletionQuote({ state, task, now = new Date(), levelUp = false, isMicroAdventure = false, isImportantMapQuest = false, random = Math.random }: {
  state: StateLike; task: Quest; now?: Date; levelUp?: boolean; isMicroAdventure?: boolean; isImportantMapQuest?: boolean; random?: () => number;
}): CompletionQuoteDecision {
  if (levelUp) return { show: true, reason: "level-up" };
  if (task.difficulty === "hard") return { show: true, reason: "hard-quest" };
  if (isMicroAdventure) return { show: true, reason: "micro-adventure" };
  if (isImportantMapQuest || task.type === "map") return { show: true, reason: "map-quest" };
  if (streakMilestones.has(state.streak.current)) return { show: true, reason: "streak-milestone" };

  const shown = state.completionQuoteEvents;
  if (shown.filter((event) => new Date(event.shownAt).toDateString() === now.toDateString()).length >= 3) return { show: false };
  const previousCompletion = state.quests.filter((quest) => quest.id !== task.id && quest.status === "completed" && quest.completedAt)
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""))[0]?.completedAt;
  if (previousCompletion && now.getTime() - new Date(previousCompletion).getTime() >= 7 * DAY_MS) return { show: true, reason: "returning" };

  const latest = shown.at(-1);
  if (latest) {
    const elapsed = now.getTime() - new Date(latest.shownAt).getTime();
    const completionsSince = state.quests.filter((quest) => quest.status === "completed" && quest.completedAt && quest.completedAt > latest.shownAt).length;
    if (elapsed < COOLDOWN_MS && completionsSince < 2) return { show: false };
  }
  const chance = task.difficulty === "normal" ? 0.4 : task.recurrence !== "none" ? 0.1 : 0.25;
  return random() < chance ? { show: true, reason: "chance" } : { show: false };
}
