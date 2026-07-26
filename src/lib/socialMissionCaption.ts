import type { SocialMission } from "@/types";

export function createMissionCaption(mission: SocialMission, variant = Math.abs([...mission.id].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % 3) {
  const prompt = mission.optionalPrompt ? `\n\n${mission.optionalPrompt}` : "";
  const templates = [
    `今天的任務：\n\n${mission.title}。\n\n${mission.description}\n${mission.completionCondition}\n\n完成後回來留言「任務完成」。`,
    `給今天的你一個小提醒：\n\n${mission.title}\n\n${mission.description}\n${mission.completionCondition}\n\n做到這裡就很好了。`,
    `如果今天只選一件小事，你會選這個嗎？\n\n${mission.title}\n\n${mission.description}\n${mission.completionCondition}${prompt}\n\n完成了，跟我們說一聲。`
  ];
  return `${templates[variant % templates.length]}\n\n#LifeQuestMap #今日任務`;
}
