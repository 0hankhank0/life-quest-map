import type { QuestDraft } from "@/types";

export type Mood = "bored" | "tired" | "good" | "out" | "social" | "quiet";
export type AvailableTime = "5" | "15" | "30" | "60";

export interface MicroAdventure extends QuestDraft {
  id: string;
  moods: Mood[];
  times: AvailableTime[];
}

export const microAdventures: MicroAdventure[] = [
  { id: "favorite-light", title: "拍下今天最喜歡的一束光", description: "不用拍得完美，讓眼前剛好打動你的畫面留下來。", moods: ["bored", "good", "quiet"], times: ["5", "15"], type: "daily", category: "creativity", occupation: "student", difficulty: "easy" },
  { id: "different-route", title: "走一條平常不會走的路", description: "繞一個小彎，看看熟悉的地方會不會有新表情。", moods: ["bored", "good", "out"], times: ["15", "30", "60"], type: "side", category: "exploration", occupation: "student", difficulty: "easy" },
  { id: "quiet-five", title: "找一個安靜的地方坐五分鐘", description: "先不用想要完成什麼，只要讓自己停一下。", moods: ["tired", "quiet"], times: ["5", "15"], type: "daily", category: "exploration", occupation: "student", difficulty: "easy" },
  { id: "friend-message", title: "傳訊息問朋友今天過得怎麼樣", description: "一句簡單的關心，可能剛好讓彼此的今天亮一點。", moods: ["good", "social"], times: ["5", "15"], type: "side", category: "social", occupation: "student", difficulty: "easy" },
  { id: "funniest-line", title: "記錄今天最好笑的一句話", description: "把讓你笑出來的那一刻寫下來，晚點再看也會很好笑。", moods: ["bored", "good", "social"], times: ["5", "15", "30"], type: "daily", category: "creativity", occupation: "student", difficulty: "easy" },
  { id: "small-shop", title: "去沒進過的小店晃一圈", description: "不一定要買東西，只是給日常多一個小小的岔路。", moods: ["out", "bored"], times: ["30", "60"], type: "side", category: "exploration", occupation: "student", difficulty: "normal" },
  { id: "window-seat", title: "在窗邊看十分鐘的雲", description: "把手機先放旁邊，讓眼睛跟著雲慢慢走。", moods: ["tired", "quiet"], times: ["15", "30"], type: "daily", category: "exploration", occupation: "student", difficulty: "easy" }
];
