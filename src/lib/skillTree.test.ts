import { describe, expect, it } from "vitest";
import { createInitialLifeQuestState } from "@/data/defaults";
import { skillNodes } from "@/data/skillNodes";
import { unlockSkillNode } from "@/lib/skillTree";

const firstLearningNode = skillNodes.find((node) => node.id === "learning-1")!;
const secondLearningNode = skillNodes.find((node) => node.id === "learning-2")!;

function stateForLearning({ stat = 2, questCount = 1, unlockedSkillNodeIds = [] }: { stat?: number; questCount?: number; unlockedSkillNodeIds?: string[] } = {}) {
  const state = createInitialLifeQuestState();
  return {
    ...state,
    stats: { ...state.stats, learning: stat },
    unlockedSkillNodeIds,
    quests: Array.from({ length: questCount }, (_, index) => ({ ...state.quests[0], id: `learning-${index}`, category: "learning" as const, status: "completed" as const }))
  };
}

describe("skill tree unlocking", () => {
  it("rejects a node when its prerequisite is not unlocked", () => {
    const result = unlockSkillNode(stateForLearning({ stat: 6, questCount: 3 }), secondLearningNode.id);
    expect(result).toMatchObject({ success: false, reason: "requirements-not-met" });
  });

  it("rejects a node when its stat is insufficient", () => {
    const result = unlockSkillNode(stateForLearning({ stat: 0, questCount: 1 }), firstLearningNode.id);
    expect(result).toMatchObject({ success: false, reason: "requirements-not-met" });
  });

  it("rejects a node when its completed category quest count is insufficient", () => {
    const result = unlockSkillNode(stateForLearning({ stat: 2, questCount: 0 }), firstLearningNode.id);
    expect(result).toMatchObject({ success: false, reason: "requirements-not-met" });
  });

  it("unlocks a node when all requirements are satisfied", () => {
    const result = unlockSkillNode(stateForLearning(), firstLearningNode.id);
    expect(result.success).toBe(true);
    if (result.success) expect(result.state.unlockedSkillNodeIds).toEqual([firstLearningNode.id]);
  });

  it("does not write the same node ID twice", () => {
    const initial = stateForLearning({ unlockedSkillNodeIds: [firstLearningNode.id] });
    const result = unlockSkillNode(initial, firstLearningNode.id);
    expect(result).toMatchObject({ success: false, reason: "already-unlocked" });
    expect(result.state.unlockedSkillNodeIds).toEqual([firstLearningNode.id]);
  });
});
