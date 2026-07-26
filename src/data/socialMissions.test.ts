import { describe, expect, it } from "vitest";
import { socialMissions, socialMissionTypes } from "./socialMissions";

describe("public social mission catalog", () => {
  it("contains a deliberate RPG mission mix without user data", () => {
    expect(socialMissions.length).toBeGreaterThanOrEqual(28);
    expect(socialMissions[0].questType).not.toBe("micro");
    for (const type of socialMissionTypes) expect(socialMissions.some((mission) => mission.questType === type.value)).toBe(true);
    expect(socialMissions.find((mission) => mission.id === "daily-walk-1")?.questType).toBe("micro");
    expect(socialMissions.every((mission) => mission.rewardLabel && mission.completionCondition)).toBe(true);
  });
});
