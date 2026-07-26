import type { SocialMission, SocialMissionCategory, SocialMissionType } from "@/types";

/** Public editorial missions only: never derived from a user's quests, journal, account, or browser storage. */
export const socialMissionCategories: SocialMissionCategory[] = ["整理", "行動", "探索", "關係", "休息", "創作", "學習"];
export const socialMissionTypes: Array<{ value: SocialMissionType; label: string }> = [{ value: "main", label: "主線任務" }, { value: "side", label: "支線任務" }, { value: "daily", label: "每日任務" }, { value: "hidden", label: "隱藏任務" }, { value: "micro", label: "微冒險" }];
const rpgTitles: Record<string, string> = { "portfolio-case-1": "未完成之頁", "learning-week-1": "七日知識遠征", "prototype-1": "構想顯現之刻", "city-route-1": "城市踏查錄", "close-loop-1": "封印解除", "thanks-letter-1": "未寄出的心意", "project-home-1": "冒險者門面整備", "priority-map-1": "行動序列重組", "deep-note-1": "知識解讀任務", "focus-create-1": "無干擾工坊", "design-process-1": "創作軌跡復原", "public-place-1": "未知據點調查", "flow-map-1": "混亂可視化", "listen-conversation-1": "傾聽者委託", "important-focus-1": "今日核心推進", "project-progress-1": "工坊每日進度", "read-ten-1": "知識碎片採集", "safe-walk-1": "冒險者體能維護", "three-priorities-1": "今日航線規劃", "real-progress-1": "進度存檔", "revive-idea-1": "沉睡構想再啟動", "quiet-help-1": "無名支援事件", "city-detail-1": "未標記的城市線索", "tomorrow-easier-1": "給明日的隱藏補給", "daily-walk-1": "路線偏移", "photo-light-1": "光影採集", "desk-reset-1": "據點局部整備", "screen-pause-1": "訊號暫離" };
const mission = (id: string, questType: SocialMissionType, category: SocialMissionCategory, objectiveTitle: string, description: string, completionCondition: string, estimatedMinutes: number, difficulty: SocialMission["difficulty"], xp: number, rewardLabel: string, steps?: string[]): SocialMission => ({ id, questType, category, title: rpgTitles[id], objectiveTitle, description, completionCondition, estimatedMinutes, difficulty, xp, rewardLabel, steps });

export const socialMissions: SocialMission[] = [
  mission("portfolio-case-1", "main", "創作", "完成作品集第一個完整案例", "把一件只存在資料夾裡的作品，整理成別人能理解的故事。", "整理問題、發想、過程與成果，完成一頁可展示的案例介紹。", 60, "normal", 80, "創造力 +2", ["選出一件作品", "整理過程與關鍵畫面", "完成一頁案例說明"]),
  mission("learning-week-1", "main", "學習", "完成一週學習挑戰", "不要一次全部學會，先把一個主題走完七天。", "設定一個學習主題，完成 5 次專注學習並留下重點紀錄。", 150, "hard", 120, "學習力 +3", ["訂出本週主題", "完成五次專注學習", "整理一頁重點"]),
  mission("prototype-1", "main", "創作", "把一個想法做成可展示原型", "讓腦中的構想第一次成為可以看見、操作或說明的東西。", "完成草圖、簡易模型、介面原型或概念頁，並能用三句話說明。", 90, "hard", 110, "創造力 +3", ["畫出核心構想", "做出第一版", "用三句話說明"]),
  mission("city-route-1", "main", "探索", "完成一條城市探索路線", "帶著一個觀察主題重新認識熟悉的城市。", "走訪三個公共地點，記錄三項觀察並整理成一張探索紀錄。", 90, "normal", 90, "探索力 +2"),
  mission("close-loop-1", "main", "行動", "解決一件拖延超過一週的事情", "不必一次解決所有問題，先關閉一個一直佔據注意力的任務。", "選擇一件安全且可控制的待辦，拆成三步並完成最後一步。", 45, "normal", 70, "自律 +2", ["寫下下一步", "排除一個阻礙", "完成最後一步"]),
  mission("thanks-letter-1", "main", "關係", "完成一封真正想說的感謝信", "把平常沒有完整說出口的感謝，整理成對方能理解的話。", "寫完一封具體的感謝信；是否送出由你自行決定。", 30, "normal", 60, "社交力 +2"),
  mission("project-home-1", "side", "創作", "為個人專案完成首頁第一版", "先讓專案有一個能被看見的入口。", "完成首頁標題、核心介紹與一個明確行動入口。", 60, "normal", 65, "創造力 +2"),
  mission("priority-map-1", "side", "整理", "把一週待辦整理成三個優先層級", "讓有限的注意力回到真正重要的地方。", "將待辦分成現在、這週與可以等待三個層級。", 30, "normal", 45, "自律 +1"),
  mission("deep-note-1", "side", "學習", "深度閱讀一篇文章並製作一頁筆記", "讀完不是終點，留下能再次使用的理解。", "完成一頁筆記，寫下三個重點與一個自己的提問。", 45, "normal", 55, "學習力 +2"),
  mission("focus-create-1", "side", "創作", "完成一次無干擾創作", "替正在成形的東西留下一段完整時間。", "關閉干擾 30 分鐘，完成一個可看見的段落或草稿。", 30, "normal", 50, "創造力 +1"),
  mission("design-process-1", "side", "創作", "為一個作品補上設計過程", "讓成果不只是一張最後的圖片。", "補上至少三張過程紀錄與一句關鍵決策說明。", 45, "normal", 55, "創造力 +2"),
  mission("public-place-1", "side", "探索", "訪問一個沒去過的公共場所", "用一個新的公共空間，替日常增加新的視角。", "安全走訪一個公共場所，記下它讓人停留的一個設計。", 45, "normal", 50, "探索力 +1"),
  mission("flow-map-1", "side", "行動", "把一個複雜問題畫成流程圖", "先把混亂放到紙上，下一步才會浮現。", "畫出問題的三個環節，標記一個可行的下一步。", 30, "normal", 45, "自律 +1"),
  mission("listen-conversation-1", "side", "關係", "完成一次不急著給建議的對話", "把理解放在解決之前。", "專心聽完一段分享，問一個延伸問題再回應。", 30, "normal", 45, "社交力 +1"),
  mission("important-focus-1", "daily", "行動", "專注推進重要目標 25 分鐘", "今天只要替重要目標留下一段不被打斷的時間。", "選定一件重要目標，專注 25 分鐘並留下下一步。", 25, "easy", 30, "自律 +1"),
  mission("project-progress-1", "daily", "創作", "推進作品集或個人專案 30 分鐘", "不求完成整個專案，只推進一個明確段落。", "完成一個可展示的小進度，例如畫面、段落或草稿。", 30, "easy", 35, "創造力 +1"),
  mission("read-ten-1", "daily", "學習", "閱讀十頁並記下一個重點", "讓今天的閱讀留下可帶走的一句話。", "讀完十頁，記下一個重點與它和生活的連結。", 20, "easy", 25, "學習力 +1"),
  mission("safe-walk-1", "daily", "休息", "安全走路或輕鬆運動 15 分鐘", "讓身體回到今天的地圖上。", "選擇安全舒適的路線，完成 15 分鐘輕鬆活動。", 15, "easy", 25, "活力 +1"),
  mission("three-priorities-1", "daily", "整理", "整理今天最重要的三件事", "不是把清單變長，而是替今天選出方向。", "寫下三件最重要的事，並為第一件排出開始時間。", 15, "easy", 25, "自律 +1"),
  mission("real-progress-1", "daily", "行動", "寫下一項今天真正完成的進度", "把完成看見，讓下一步有地方接住。", "記下一項具體進度，以及明天可以延續的一步。", 10, "easy", 20, "自律 +1"),
  mission("revive-idea-1", "hidden", "創作", "找回一個曾經放棄的想法", "有些想法不是失敗，只是當時還沒到時候。", "找出一個舊想法，寫下今天能讓它重新開始的第一步。", 30, "normal", 50, "創造力 +1"),
  mission("quiet-help-1", "hidden", "關係", "主動幫助一個正在忙碌的人", "不必很盛大，一個剛好的支援就能改變對方的下午。", "提供一個具體、尊重界線且不要求回報的幫忙。", 20, "normal", 45, "社交力 +1"),
  mission("city-detail-1", "hidden", "探索", "記錄一個平常沒注意過的城市細節", "讓熟悉的街道交出一個新的線索。", "記下或拍下公共空間的一個細節，並寫一句觀察。", 20, "easy", 35, "探索力 +1"),
  mission("tomorrow-easier-1", "hidden", "整理", "完成一件讓明天更容易的事", "沒有人要求，但明天的你會感謝今天的安排。", "完成一件能減少明日摩擦的小準備。", 20, "easy", 35, "自律 +1"),
  mission("daily-walk-1", "micro", "探索", "走一條平常不會走的路", "不用走很遠，替今天留一點陌生的風景。", "步行 10 分鐘，回來記下一個以前沒注意到的東西。", 10, "easy", 20, "探索力 +1"),
  mission("photo-light-1", "micro", "創作", "拍下一個有趣的光影", "把今天擦身而過的一幕留下來。", "拍下一張公共空間中的光影或紋理。", 10, "easy", 15, "創造力 +1"),
  mission("desk-reset-1", "micro", "整理", "清出一小塊桌面", "讓眼前留出一個可以開始的空間。", "整理一個手掌大小的區域，留下真正要用的東西。", 10, "easy", 15, "自律 +1"),
  mission("screen-pause-1", "micro", "休息", "給自己十分鐘無螢幕時間", "從訊息裡退一步，回到自己的節奏。", "把手機放遠，做一件不需要螢幕的小事 10 分鐘。", 10, "easy", 15, "活力 +1")
];
