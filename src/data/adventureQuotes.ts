import type { AdventureQuote, QuoteCategory } from "@/types";

const quotes: Record<QuoteCategory, AdventureQuote[]> = {
  "main-quest": [
    { id: "main-1", category: "main-quest", text: "今天完成的這一步，正在改變未來的地圖。" },
    { id: "main-2", category: "main-quest", text: "主線向前推進，遠方的地標也更清楚了。" },
    { id: "main-3", category: "main-quest", text: "任務完成，這段旅程留下了可靠的座標。" },
    { id: "main-4", category: "main-quest", text: "你沒有跳過這一關，而是親手走了過來。" },
    { id: "main-5", category: "main-quest", text: "地圖不會自己展開；你剛剛讓它多了一條路。" }
  ],
  "level-up": [
    { id: "level-1", category: "level-up", text: "新的等級不是終點，是你已經走遠的證明。" },
    { id: "level-2", category: "level-up", text: "能力值上升，下一段路也有了新的走法。" },
    { id: "level-3", category: "level-up", text: "升級完成：你比昨天多了一點面對未知的裝備。" },
    { id: "level-4", category: "level-up", text: "經驗累積成了階梯，現在可以看得更遠。" },
    { id: "level-5", category: "level-up", text: "這次升級來自每一個沒有被略過的小行動。" }
  ],
  "skill-up": [
    { id: "skill-1", category: "skill-up", text: "技能解鎖：這不是捷徑，是你練出來的新路徑。" },
    { id: "skill-2", category: "skill-up", text: "新的能力已點亮，旅途中多了一盞可以帶著走的燈。" },
    { id: "skill-3", category: "skill-up", text: "你把練習換成了真正可用的本事。" },
    { id: "skill-4", category: "skill-up", text: "技能樹長出新枝，接下來的選擇也更多了。" },
    { id: "skill-5", category: "skill-up", text: "一項能力被解鎖，因為你先做到了它要求的事。" }
  ],
  streak: [
    { id: "streak-1", category: "streak", text: "連續完成不是衝刺，是你為自己留出的穩定路線。" },
    { id: "streak-2", category: "streak", text: "今天也接上了昨天，旅程因此沒有斷線。" },
    { id: "streak-3", category: "streak", text: "你正在把一個選擇，練成可依靠的節奏。" },
    { id: "streak-4", category: "streak", text: "連續紀錄更新，地圖上多了一條不間斷的足跡。" },
    { id: "streak-5", category: "streak", text: "穩定前進的人，會在回頭時看見很長的一段路。" }
  ],
  achievement: [
    { id: "achievement-1", category: "achievement", text: "成就解鎖：這枚徽章記得你完成過的事。" },
    { id: "achievement-2", category: "achievement", text: "新的里程碑亮起，因為你真的走到了這裡。" },
    { id: "achievement-3", category: "achievement", text: "這不是偶然獲得的稱號，是行動留下的印記。" },
    { id: "achievement-4", category: "achievement", text: "成就已收入行囊，下一段探索可以繼續了。" },
    { id: "achievement-5", category: "achievement", text: "一項紀錄完成，地圖也替你標下了這個時刻。" }
  ],
  location: [
    { id: "location-1", category: "location", text: "你在這裡完成任務，這個地點便有了新的意義。" },
    { id: "location-2", category: "location", text: "一段路途、一項任務，現在都成了旅程的座標。" },
    { id: "location-3", category: "location", text: "地圖上的標記亮起，因為你親自抵達並完成了它。" },
    { id: "location-4", category: "location", text: "這裡不再只是地名，而是你完成過一件事的地方。" },
    { id: "location-5", category: "location", text: "把腳步留在地圖上，也把完成留在今天。" }
  ]
};

export function pickAdventureQuote(category: QuoteCategory, recentIds: readonly string[] = []): AdventureQuote {
  const options = quotes[category].filter((quote) => !recentIds.includes(quote.id));
  const pool = options.length ? options : quotes[category];
  return pool[Math.floor(Math.random() * pool.length)];
}

export const quoteCategoryLabels: Record<QuoteCategory, string> = {
  "main-quest": "主線任務",
  "level-up": "角色升級",
  "skill-up": "技能升級",
  streak: "連續完成",
  achievement: "成就解鎖",
  location: "地點任務"
};
