import { describe, expect, it } from "vitest";
import { socialMissions } from "@/data/socialMissions";
import { createMissionCaption } from "./socialMissionCaption";

describe("social mission captions", () => {
  it("uses natural rotating templates and only the two optional tags", () => {
    const captions = [0, 1, 2].map((variant) => createMissionCaption(socialMissions[0], variant));
    expect(new Set(captions).size).toBe(3);
    expect(captions.every((caption) => caption.includes("#LifeQuestMap #今日任務"))).toBe(true);
  });
});
