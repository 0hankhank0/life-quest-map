import type { SocialMission, SocialMissionCategory } from "@/types";

/**
 * Editorial, universally suitable missions for public social posts.
 * This catalog is intentionally separate from localStorage, account quests, journals, and recommendations.
 */
export const socialMissionCategories: SocialMissionCategory[] = ["整理", "行動", "探索", "關係", "休息", "創作", "學習"];

export const socialMissions: SocialMission[] = [
  { id: "daily-walk-1", title: "走一條平常不會走的路", description: "不用走很遠，替今天留一點陌生的風景。", completionCondition: "步行 10 分鐘，回來記下一個以前沒注意到的東西。", category: "探索", estimatedMinutes: 10, difficulty: "easy", xp: 20, optionalPrompt: "你今天發現了什麼？" },
  { id: "desk-reset-1", title: "清出一小塊桌面", description: "不必整理整個房間，先讓眼前有一點空間。", completionCondition: "整理一個手掌大小的區域，丟掉或歸位 5 樣物品。", category: "整理", estimatedMinutes: 10, difficulty: "easy", xp: 15 },
  { id: "water-start-1", title: "先喝一杯水再開始", description: "把下一件事的起點放得簡單一點。", completionCondition: "喝完一杯水，接著開始最想拖延的事 5 分鐘。", category: "行動", estimatedMinutes: 5, difficulty: "easy", xp: 10 },
  { id: "message-someone-1", title: "傳一句近況給一個人", description: "不需要長篇大論，讓關心有一個出口。", completionCondition: "傳一則真誠的問候或謝謝，不必等待立刻回覆。", category: "關係", estimatedMinutes: 5, difficulty: "easy", xp: 15 },
  { id: "quiet-window-1", title: "在窗邊安靜三分鐘", description: "暫時不用解決什麼，只把注意力帶回此刻。", completionCondition: "不看螢幕，觀察呼吸或窗外光線滿 3 分鐘。", category: "休息", estimatedMinutes: 3, difficulty: "easy", xp: 10 },
  { id: "three-lines-1", title: "寫下三行今天的感受", description: "不求寫得好，只把心裡的雜訊放到紙上。", completionCondition: "寫滿三行，不修改也不用分享。", category: "創作", estimatedMinutes: 8, difficulty: "easy", xp: 15 },
  { id: "learn-one-term-1", title: "弄懂一個陌生名詞", description: "把好奇心縮小到可以開始的尺寸。", completionCondition: "查一個名詞，並用自己的話寫下一句解釋。", category: "學習", estimatedMinutes: 10, difficulty: "easy", xp: 20 },
  { id: "bag-reset-1", title: "整理今天會帶的包", description: "替出門前的自己少留一點混亂。", completionCondition: "拿出不需要的物品，確認一件今天真正要用的東西。", category: "整理", estimatedMinutes: 8, difficulty: "easy", xp: 15 },
  { id: "one-small-step-1", title: "完成一件兩分鐘的小事", description: "小到不需要鼓起勇氣，也算是往前。", completionCondition: "選一件能在兩分鐘內完成的事，現在就做完。", category: "行動", estimatedMinutes: 2, difficulty: "easy", xp: 10 },
  { id: "sound-map-1", title: "收集三種身邊的聲音", description: "把熟悉的地方，重新聽一遍。", completionCondition: "停下來辨認並記住三種不同的聲音。", category: "探索", estimatedMinutes: 8, difficulty: "easy", xp: 15 },
  { id: "specific-thanks-1", title: "說一個具體的謝謝", description: "把感謝說得清楚，對方會知道那份心意。", completionCondition: "告訴一個人，你感謝的是哪一件具體的小事。", category: "關係", estimatedMinutes: 5, difficulty: "easy", xp: 15 },
  { id: "stretch-break-1", title: "伸展一下肩頸", description: "讓身體先收到今天已經夠努力的訊號。", completionCondition: "做三個舒服的伸展動作，慢慢呼吸 5 分鐘。", category: "休息", estimatedMinutes: 5, difficulty: "easy", xp: 10 },
  { id: "photo-detail-1", title: "拍下一個有趣的細節", description: "不用去遠方，日常也有值得保存的畫面。", completionCondition: "拍一張今天看到的紋理、光影或小角落。", category: "創作", estimatedMinutes: 10, difficulty: "easy", xp: 20 },
  { id: "read-two-pages-1", title: "讀兩頁想讀的內容", description: "把閱讀還給自己，不必先完成一大段。", completionCondition: "讀兩頁，圈出或記下一句讓你停下來的話。", category: "學習", estimatedMinutes: 10, difficulty: "easy", xp: 15 },
  { id: "drawer-one-1", title: "整理一個抽屜角落", description: "只處理一小格，也能讓明天更容易開始。", completionCondition: "選一格抽屜，留下需要的、移走不需要的。", category: "整理", estimatedMinutes: 15, difficulty: "normal", xp: 25 },
  { id: "first-draft-1", title: "做出第一個不完美版本", description: "先讓它存在，修正可以留到下一步。", completionCondition: "花 15 分鐘完成草稿，不回頭反覆修改。", category: "行動", estimatedMinutes: 15, difficulty: "normal", xp: 30 },
  { id: "new-shop-1", title: "走進一家沒去過的小店", description: "用一點點偏離路線，交換一點點新鮮感。", completionCondition: "安全地走進或經過一家陌生店家，觀察一個特色。", category: "探索", estimatedMinutes: 15, difficulty: "normal", xp: 25 },
  { id: "listen-well-1", title: "好好聽一個人說話", description: "今天先不急著給建議，讓對話多一點空間。", completionCondition: "和一個人聊天時，專心聽完並問一個延伸問題。", category: "關係", estimatedMinutes: 10, difficulty: "normal", xp: 25 },
  { id: "screen-pause-1", title: "給自己十分鐘無螢幕時間", description: "讓眼睛和腦袋一起從訊息裡退一步。", completionCondition: "把手機放遠，做一件不需要螢幕的小事 10 分鐘。", category: "休息", estimatedMinutes: 10, difficulty: "easy", xp: 20 },
  { id: "sketch-map-1", title: "畫一張今天的小地圖", description: "用線條記住你經過的地方或心情。", completionCondition: "隨手畫下今天一段路、房間或腦中的畫面。", category: "創作", estimatedMinutes: 15, difficulty: "normal", xp: 30 }
];
