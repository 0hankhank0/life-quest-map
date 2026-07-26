import type { SocialMissionType } from "@/types";

export function assertNever(value: never): never { throw new Error(`Unhandled social mission type: ${value}`); }

export function getSocialMissionTypeLabel(type: SocialMissionType) {
  switch (type) {
    case "main": return "主線任務";
    case "side": return "支線任務";
    case "daily": return "每日任務";
    case "hidden": return "隱藏任務";
    case "micro": return "微冒險";
    default: return assertNever(type);
  }
}
