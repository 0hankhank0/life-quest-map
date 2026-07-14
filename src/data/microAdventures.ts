import type { QuestDraft } from "@/types";

export type Mood = "bored" | "tired" | "good" | "out" | "social" | "quiet";
export type AvailableTime = "5" | "15" | "30" | "60";

export interface MicroAdventure extends QuestDraft {
  id: string;
  moods: Mood[];
  times: AvailableTime[];
}

export const microAdventures: MicroAdventure[] = [
  {
    id: "favorite-light",
    title: "拍下今天最喜歡的一束光",
    description: "不用拍得完美，讓眼前剛好打動你的畫面留下來。",
    moods: ["bored", "good", "quiet"],
    times: ["5", "15"],
    type: "daily",
    category: "creativity",
    occupation: "student",
    difficulty: "easy"
  },
  {
    id: "different-route",
    title: "走一條平常不會走的路",
    description: "繞一個小彎，看看熟悉的地方會不會有新表情。",
    moods: ["bored", "good", "out"],
    times: ["15", "30", "60"],
    type: "side",
    category: "exploration",
    occupation: "student",
    difficulty: "easy"
  },
  {
    id: "quiet-five",
    title: "找一個安靜的地方坐五分鐘",
    description: "先不用想要完成什麼，只要讓自己停一下。",
    moods: ["tired", "quiet"],
    times: ["5", "15"],
    type: "daily",
    category: "exploration",
    occupation: "student",
    difficulty: "easy"
  },
  {
    id: "friend-message",
    title: "傳訊息問朋友今天過得怎麼樣",
    description: "一句簡單的關心，可能剛好讓彼此的今天亮一點。",
    moods: ["good", "social"],
    times: ["5", "15"],
    type: "side",
    category: "social",
    occupation: "student",
    difficulty: "easy"
  },
  {
    id: "funniest-line",
    title: "記錄今天最好笑的一句話",
    description: "把讓你笑出來的那一刻寫下來，晚點再看也會很好笑。",
    moods: ["bored", "good", "social"],
    times: ["5", "15", "30"],
    type: "daily",
    category: "creativity",
    occupation: "student",
    difficulty: "easy"
  },
  {
    id: "small-shop",
    title: "去沒進過的小店晃一圈",
    description: "不一定要買東西，只是給日常多一個小小的岔路。",
    moods: ["out", "bored"],
    times: ["30", "60"],
    type: "side",
    category: "exploration",
    occupation: "student",
    difficulty: "normal"
  },
  {
    id: "window-seat",
    title: "在窗邊看十分鐘的雲",
    description: "把手機先放旁邊，讓眼睛跟著雲慢慢走。",
    moods: ["tired", "quiet"],
    times: ["15", "30"],
    type: "daily",
    category: "exploration",
    occupation: "student",
    difficulty: "easy"
  },
  {
    id: "desk-stretch",
    title: "做一輪輕鬆伸展",
    description: "轉轉肩膀、伸伸背，不追求流汗，只讓身體鬆一點。",
    moods: ["tired", "bored"],
    times: ["5", "15"],
    type: "daily",
    category: "fitness",
    occupation: "general",
    difficulty: "easy"
  },
  {
    id: "water-and-breathe",
    title: "倒杯水，慢慢喝完",
    description: "喝水時做三次緩慢呼吸，給忙亂的腦袋一個小停頓。",
    moods: ["tired", "quiet"],
    times: ["5"],
    type: "daily",
    category: "fitness",
    occupation: "general",
    difficulty: "easy"
  },
  {
    id: "learn-one-word",
    title: "認識一個新詞或冷知識",
    description: "隨手查一個好奇的詞，記住意思就已經很棒。",
    moods: ["bored", "good"],
    times: ["5", "15"],
    type: "daily",
    category: "learning",
    occupation: "developer",
    difficulty: "easy"
  },
  {
    id: "three-line-journal",
    title: "寫下今天的三行小記",
    description: "可以是看見的、想到的，或只是此刻的心情。",
    moods: ["quiet", "good"],
    times: ["5", "15"],
    type: "daily",
    category: "creativity",
    occupation: "creator",
    difficulty: "easy"
  },
  {
    id: "playlist-rediscover",
    title: "重聽一首很久沒播的歌",
    description: "找一首曾經喜歡的歌，完整聽一次就好。",
    moods: ["tired", "quiet", "bored"],
    times: ["5", "15"],
    type: "daily",
    category: "creativity",
    occupation: "general",
    difficulty: "easy"
  },
  {
    id: "compliment-someone",
    title: "真心稱讚一個人",
    description: "說出你注意到的好，簡短一句就能讓互動多一點溫度。",
    moods: ["social", "good"],
    times: ["5", "15"],
    type: "side",
    category: "social",
    occupation: "service",
    difficulty: "easy"
  },
  {
    id: "fresh-air-loop",
    title: "到戶外繞一小圈",
    description: "走到門口、樓下或附近轉一圈，感受一下空氣和光線。",
    moods: ["out", "tired", "bored"],
    times: ["5", "15"],
    type: "daily",
    category: "fitness",
    occupation: "general",
    difficulty: "easy"
  },
  {
    id: "notice-five-things",
    title: "找出身邊五個以前沒注意的細節",
    description: "顏色、聲音或一個小角落都可以，重新看看現在所在的地方。",
    moods: ["bored", "quiet", "out"],
    times: ["5", "15"],
    type: "daily",
    category: "exploration",
    occupation: "designer",
    difficulty: "easy"
  },
  {
    id: "tidy-one-surface",
    title: "整理一個小小的平面",
    description: "只整理桌上一角或包包的一層，完成就可以停下來。",
    moods: ["tired", "bored"],
    times: ["5", "15"],
    type: "daily",
    category: "fitness",
    occupation: "general",
    difficulty: "easy"
  },
  {
    id: "sketch-a-mug",
    title: "畫下眼前的一個小物件",
    description: "拿筆隨手畫杯子、植物或窗外，不需要畫得像。",
    moods: ["bored", "quiet", "good"],
    times: ["15", "30"],
    type: "side",
    category: "creativity",
    occupation: "designer",
    difficulty: "easy"
  },
  {
    id: "share-a-small-find",
    title: "分享一個今天的小發現",
    description: "傳給朋友一張照片、一句話或一個有趣連結。",
    moods: ["social", "good"],
    times: ["15", "30"],
    type: "side",
    category: "social",
    occupation: "marketer",
    difficulty: "easy"
  },
  {
    id: "tea-break-without-screen",
    title: "不看螢幕地休息十五分鐘",
    description: "泡杯飲料或靠著休息，把注意力從通知裡拿回來。",
    moods: ["tired", "quiet"],
    times: ["15", "30"],
    type: "daily",
    category: "fitness",
    occupation: "developer",
    difficulty: "easy"
  },
  {
    id: "ask-a-curious-question",
    title: "問身邊的人一個好奇的小問題",
    description: "例如最近在聽什麼歌，讓對話從一個輕鬆的問題開始。",
    moods: ["social", "out"],
    times: ["15", "30"],
    type: "side",
    category: "social",
    occupation: "educator",
    difficulty: "easy"
  },
  {
    id: "library-or-bookstore-stop",
    title: "到圖書館或書店翻一本到好奇的書",
    description: "看幾頁、認識一個主題就好，不必把它帶回家。",
    moods: ["out", "quiet", "good"],
    times: ["30", "60"],
    type: "side",
    category: "learning",
    occupation: "researcher",
    difficulty: "easy"
  },
  {
    id: "neighborhood-photo-walk",
    title: "在附近找三個有趣的畫面",
    description: "用散步的速度觀察街景，拍下或記住三個讓你停下來的畫面。",
    moods: ["out", "bored", "good"],
    times: ["30", "60"],
    type: "side",
    category: "exploration",
    occupation: "freelancer",
    difficulty: "easy"
  },
  {
    id: "make-a-tiny-plan",
    title: "替明天留一個小期待",
    description: "寫下一件明天想做的小事，像是買喜歡的早餐或早點出門。",
    moods: ["quiet", "tired", "good"],
    times: ["15", "30"],
    type: "daily",
    category: "learning",
    occupation: "business",
    difficulty: "easy"
  },
  {
    id: "slow-neighborhood-bench",
    title: "找個安全的地方坐著看人來人往",
    description: "在公園或公共休息區坐一會兒，讓世界替你慢慢流動。",
    moods: ["tired", "out", "quiet"],
    times: ["30", "60"],
    type: "side",
    category: "exploration",
    occupation: "general",
    difficulty: "easy"
  }
];
