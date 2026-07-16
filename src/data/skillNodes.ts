import type { QuestCategory, SkillNode } from "@/types";

const branchContent: Record<QuestCategory, Array<[string, string, string, string]>> = {
  learning: [
    ["知識萌芽", "建立一個可持續的學習節奏。", "學習者印記", "你已點亮第一盞知識之燈。"],
    ["專注研讀", "讓學習從偶爾嘗試變成穩定累積。", "專注徽章", "你的專注開始形成力量。"],
    ["知識連結", "把新知和既有經驗串成自己的地圖。", "洞察之眼", "你更擅長看見知識間的關聯。"],
    ["學識傳承", "以長期投入建立深厚的學習底蘊。", "學識先鋒", "你的學習之路已成為可靠的資產。"]
  ],
  fitness: [
    ["行動熱身", "從一次身體活動開始照顧自己。", "活力火種", "你已喚醒前進的能量。"],
    ["節奏鍛鍊", "用規律行動養成耐力與韌性。", "耐力徽章", "你的身體開始記住穩定的節奏。"],
    ["強健核心", "把運動變成生活中可靠的支點。", "核心之盾", "你已建立更堅韌的自我。"],
    ["活力領航", "以長期投入展現充沛的生命力。", "活力領航員", "你能帶著能量迎接每一段旅程。"]
  ],
  creativity: [
    ["靈感點火", "讓一個想法離開腦海、成為作品。", "靈感火花", "你的創意已開始發光。"],
    ["創作習慣", "持續練習，把空白頁變成可能。", "創作之筆", "你能更自在地把想法化為成果。"],
    ["風格成形", "在反覆創作中尋找屬於自己的聲音。", "風格印記", "你的作品開始帶有獨特的辨識度。"],
    ["創意開拓", "以成熟創作力開拓新的表達疆域。", "創意開拓者", "你的想像已能為生活打開新路。"]
  ],
  social: [
    ["友善問候", "用一次真誠互動開啟連結。", "連結火花", "你已為關係點上一盞燈。"],
    ["傾聽練習", "在對話中練習理解與回應。", "傾聽徽章", "你更能接住他人的聲音。"],
    ["信任建立", "用穩定互動經營值得珍惜的關係。", "信任之橋", "你已搭起更可靠的人際橋梁。"],
    ["社群凝聚", "在關係網中帶來支持與正向影響。", "社群引路人", "你能讓身邊的人感到被連結。"]
  ],
  discipline: [
    ["秩序起步", "用一件完成的小事建立掌控感。", "秩序火種", "你已開始為生活建立節奏。"],
    ["穩定執行", "把承諾化為日常可重複的行動。", "執行徽章", "你正變得更加可靠。"],
    ["自律深化", "在不容易的時候仍選擇完成目標。", "自律之鎧", "你的意志已獲得更強的支撐。"],
    ["習慣領航", "以成熟節律把長期目標帶往終點。", "習慣領航員", "你已掌握持續前進的節奏。"]
  ],
  exploration: [
    ["好奇出發", "從一個新體驗踏出舒適圈。", "探索火花", "未知已向你打開第一扇門。"],
    ["路徑發現", "持續走進未曾留意的地方與可能。", "發現徽章", "你更敏銳地看見世界的細節。"],
    ["視野拓展", "將不同體驗收進自己的生活地圖。", "視野羅盤", "你的方向感變得更開闊。"],
    ["世界行者", "以好奇與行動把生活活成一場探索。", "世界行者", "你已能自在地走向未知。"]
  ]
};

const requirements = [
  { requiredQuestCount: 1, requiredStat: 2 },
  { requiredQuestCount: 3, requiredStat: 6 },
  { requiredQuestCount: 6, requiredStat: 12 },
  { requiredQuestCount: 10, requiredStat: 20 }
];

export const skillNodes: SkillNode[] = (Object.entries(branchContent) as Array<[QuestCategory, typeof branchContent.learning]>).flatMap(([category, content]) =>
  content.map(([title, description, rewardTitle, rewardDescription], index) => ({
    id: `${category}-${index + 1}`,
    category,
    title,
    description,
    ...requirements[index],
    prerequisiteIds: index === 0 ? [] : [`${category}-${index}`],
    rewardTitle,
    rewardDescription
  }))
);

export const skillNodeIds = new Set(skillNodes.map((node) => node.id));
