import type { SocialMission } from "@/types";
import { getSocialMissionTypeLabel } from "@/lib/socialMissionMeta";

export function createMissionCaption(mission: SocialMission, variant = Math.abs([...mission.id].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % 3) {
  const typeLabel = getSocialMissionTypeLabel(mission.questType);
  const details = `完成條件：\n${mission.completionCondition}\n\n預估 ${mission.estimatedMinutes} 分鐘｜${mission.difficulty === "easy" ? "簡單" : mission.difficulty === "normal" ? "普通" : "挑戰"}｜+${mission.xp} XP\n獎勵：${mission.rewardLabel}`;
  const prompt = mission.optionalPrompt ? `\n\n${mission.optionalPrompt}` : "";
  const templates = [
    `【${typeLabel}｜${mission.title}】\n\n任務目標：\n${mission.objectiveTitle}\n\n${mission.description}\n\n${details}\n\n今天不用完成整個人生，先讓這一頁真正存在。`,
    `【${typeLabel}｜${mission.title}】\n\n任務目標：${mission.objectiveTitle}\n\n${mission.description}\n\n${details}\n\n走到這裡，就已經是在推進自己的地圖。`,
    `今天想解鎖哪一個關卡？\n\n【${typeLabel}｜${mission.title}】\n\n任務目標：${mission.objectiveTitle}\n\n${mission.description}\n\n${details}${prompt}\n\n完成了，再回來記下這段路。`
  ];
  return `${templates[variant % templates.length]}\n\n#LifeQuestMap #今日任務`;
}
