import type { OccupationCategory, QuestDraft } from "@/types";

export type Mood = "bored" | "tired" | "good" | "out" | "social" | "quiet";
export type AvailableTime = "5" | "15" | "30" | "60";

export interface MicroAdventure extends QuestDraft {
  id: string;
  moods: Mood[];
  times: AvailableTime[];
}

type AdventureSeed = [string, string, Mood[], AvailableTime[], QuestDraft["category"], OccupationCategory];

const seeds: AdventureSeed[] = [
  ["favorite-light", "拍下今天最喜歡的一束光", ["bored", "good", "quiet"], ["5", "15"], "creativity", "student"],
  ["different-route", "用不同路線走到下一個目的地", ["bored", "good", "out"], ["15", "30", "60"], "exploration", "student"],
  ["quiet-five", "安靜看窗外五分鐘", ["tired", "quiet"], ["5", "15"], "exploration", "student"],
  ["friend-message", "傳一則真心的問候", ["good", "social"], ["5", "15"], "social", "student"],
  ["funniest-line", "記下今天聽過最好笑的一句話", ["bored", "good", "social"], ["5", "15", "30"], "creativity", "student"],
  ["small-shop", "走進一間從沒去過的小店", ["out", "bored"], ["30", "60"], "exploration", "student"],
  ["window-seat", "找個窗邊座位放空", ["tired", "quiet"], ["15", "30"], "exploration", "student"],
  ["desk-stretch", "做一輪肩頸伸展", ["tired", "bored"], ["5", "15"], "fitness", "general"],
  ["water-and-breathe", "喝水並做六次慢呼吸", ["tired", "quiet"], ["5"], "fitness", "general"],
  ["learn-one-word", "學一個新詞並造句", ["bored", "good"], ["5", "15"], "learning", "developer"],
  ["three-line-journal", "寫下三行此刻的想法", ["quiet", "good"], ["5", "15"], "creativity", "creator"],
  ["playlist-rediscover", "重聽一首遺忘的歌", ["tired", "quiet", "bored"], ["5", "15"], "creativity", "general"],
  ["compliment-someone", "具體稱讚一個人", ["social", "good"], ["5", "15"], "social", "service"],
  ["fresh-air-loop", "到戶外繞一小圈", ["out", "tired", "bored"], ["5", "15"], "fitness", "general"],
  ["notice-five-things", "找出身邊五個有趣細節", ["bored", "quiet", "out"], ["5", "15"], "exploration", "designer"],
  ["tidy-one-surface", "整理一個平面", ["tired", "bored"], ["5", "15"], "discipline", "general"],
  ["sketch-a-mug", "畫下眼前的一個杯子", ["bored", "quiet", "good"], ["15", "30"], "creativity", "designer"],
  ["share-a-small-find", "分享一個剛發現的好東西", ["social", "good"], ["15", "30"], "social", "marketer"],
  ["tea-break-without-screen", "不看螢幕喝完一杯飲料", ["tired", "quiet"], ["15", "30"], "fitness", "developer"],
  ["ask-a-curious-question", "問一個真正好奇的問題", ["social", "out"], ["15", "30"], "social", "educator"],
  ["library-or-bookstore-stop", "在書店或圖書館停留", ["out", "quiet", "good"], ["30", "60"], "learning", "researcher"],
  ["neighborhood-photo-walk", "拍三張社區裡的紋理", ["out", "bored", "good"], ["30", "60"], "exploration", "freelancer"],
  ["make-a-tiny-plan", "替明天寫一張小計畫", ["quiet", "tired", "good"], ["15", "30"], "discipline", "business"],
  ["slow-neighborhood-bench", "在附近坐十分鐘觀察人來人往", ["tired", "out", "quiet"], ["30", "60"], "exploration", "general"],
  ["one-tab", "關掉一個不需要的分頁", ["tired", "bored"], ["5"], "discipline", "developer"],
  ["teach-back", "用一句話解釋剛學到的事", ["good", "quiet"], ["5", "15"], "learning", "student"],
  ["stairs", "走一層樓梯再回來", ["tired", "bored"], ["5", "15"], "fitness", "general"],
  ["voice-note", "錄一段給未來自己的語音", ["quiet", "good"], ["5", "15"], "creativity", "creator"],
  ["color-hunt", "找出三種今天的主色", ["out", "bored"], ["5", "15"], "creativity", "designer"],
  ["ask-name", "記住一位服務人員的名字", ["social", "out"], ["5", "15"], "social", "service"],
  ["posture", "調整坐姿並放鬆下巴", ["tired", "quiet"], ["5"], "fitness", "healthcare"],
  ["inbox-five", "處理五封最短的訊息", ["bored", "good"], ["5", "15"], "discipline", "business"],
  ["new-tool", "試用一個小工具或快捷鍵", ["bored", "good"], ["15", "30"], "learning", "developer"],
  ["street-tree", "認識路邊一棵樹", ["out", "quiet"], ["15", "30"], "exploration", "researcher"],
  ["one-doodle", "畫一個不求好看的塗鴉", ["bored", "quiet"], ["5", "15"], "creativity", "creator"],
  ["memory-call", "打給一位很久沒聊天的人", ["social", "good"], ["15", "30"], "social", "general"],
  ["market-ingredient", "買一樣沒煮過的食材", ["out", "good"], ["30", "60"], "exploration", "general"],
  ["walk-meeting", "把一通電話改在散步時完成", ["tired", "out"], ["15", "30"], "fitness", "business"],
  ["read-page", "讀完一頁長文並寫下重點", ["quiet", "good"], ["5", "15"], "learning", "researcher"],
  ["camera-roll", "刪除十張不需要的截圖", ["bored", "tired"], ["5", "15"], "discipline", "general"],
  ["kind-reply", "回覆一則拖延已久的訊息", ["social", "quiet"], ["5", "15"], "social", "freelancer"],
  ["balance", "單腳站立並換邊", ["tired", "bored"], ["5"], "fitness", "fitness_coach"],
  ["museum-online", "看一件博物館公開藏品", ["quiet", "bored"], ["15", "30"], "learning", "designer"],
  ["freewrite", "不限題目寫滿五分鐘", ["quiet", "good"], ["5", "15"], "creativity", "creator"],
  ["local-history", "查一件所在地的小歷史", ["out", "bored"], ["15", "30"], "exploration", "public_servant"],
  ["meal-notice", "慢慢吃完前三口食物", ["tired", "quiet"], ["5"], "fitness", "healthcare"],
  ["desk-reset", "清出明天要用的桌面空間", ["tired", "good"], ["5", "15"], "discipline", "student"],
  ["one-idea", "記錄一個可以改善的流程", ["bored", "good"], ["5", "15"], "creativity", "business"],
  ["community-board", "看一眼社區公告或活動", ["out", "social"], ["15", "30", "60"], "social", "public_servant"],
  ["sunset", "在日落前後抬頭兩分鐘", ["tired", "out", "quiet"], ["5", "15"], "exploration", "general"],
  ["one-rep", "完成一組最輕量的運動", ["bored", "good"], ["5", "15"], "fitness", "fitness_coach"],
  ["translate", "翻譯一句你喜歡的短句", ["quiet", "bored"], ["5", "15"], "learning", "educator"],
  ["thank-you", "寫下一件值得感謝的小事", ["quiet", "good"], ["5"], "creativity", "general"],
  ["map-pin", "在地圖上標記想去的地方", ["out", "good"], ["15", "30"], "exploration", "freelancer"],
  ["workspace-tour", "換個角度看你的工作區", ["bored", "tired"], ["5", "15"], "exploration", "designer"],
  ["one-lesson", "把一件小失誤寫成一個教訓", ["quiet", "tired"], ["5", "15"], "learning", "developer"],
  ["donate-box", "挑出一樣可轉贈的物品", ["good", "out"], ["15", "30"], "social", "general"],
  ["weekend-dot", "為週末畫一個值得期待的點", ["good", "bored"], ["5", "15"], "discipline", "student"],
  ["slow-look", "看一張照片直到發現新細節", ["quiet", "tired"], ["5", "15"], "creativity", "designer"],
  ["library-list", "列出下次想借的三本書", ["quiet", "good"], ["15", "30"], "learning", "researcher"]
];

export const microAdventures: MicroAdventure[] = seeds.map(([id, title, moods, times, category, occupation]) => ({
  id,
  title,
  description: `花 ${times[0]} 分鐘完成「${title}」。`,
  moods,
  times,
  type: category === "exploration" || category === "social" ? "side" : "daily",
  category,
  occupation,
  difficulty: "easy"
}));
