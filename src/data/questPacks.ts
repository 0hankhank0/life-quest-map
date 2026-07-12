import type { OccupationCategory, QuestDraft } from "@/types";

export interface OccupationQuestPack {
  occupation: OccupationCategory;
  title: string;
  description: string;
  quests: QuestDraft[];
}

export const occupationQuestPacks: OccupationQuestPack[] = [
  {
    occupation: "general",
    title: "通用冒險者任務包",
    description: "適合任何路線的每日推進、整理與探索任務。",
    quests: [
      {
        title: "規劃今天三個行動點",
        description: "寫下今天最重要的三個小行動，完成一項就能推進角色狀態。",
        type: "main",
        category: "discipline",
        occupation: "general",
        difficulty: "easy"
      },
      {
        title: "整理一個待辦區塊",
        description: "把一個混亂的任務、資料夾或筆記區塊整理到可使用狀態。",
        type: "side",
        category: "discipline",
        occupation: "general",
        difficulty: "easy"
      },
      {
        title: "完成一段 20 分鐘專注",
        description: "選一件明確任務，關掉干擾並專注 20 分鐘。",
        type: "daily",
        category: "learning",
        occupation: "general",
        difficulty: "normal"
      }
    ]
  },
  {
    occupation: "student",
    title: "學生任務包",
    description: "針對學習、複習、專題與輸出建立節奏。",
    quests: [
      {
        title: "整理一頁課堂重點",
        description: "把今天最重要的概念整理成一頁筆記，留下可複習的版本。",
        type: "main",
        category: "learning",
        occupation: "student",
        difficulty: "normal"
      },
      {
        title: "完成 20 分鐘複習",
        description: "選一個科目複習 20 分鐘，最後寫下三個關鍵詞。",
        type: "daily",
        category: "learning",
        occupation: "student",
        difficulty: "easy"
      },
      {
        title: "推進專題一個小段落",
        description: "完成專題中的一個小交付，例如摘要、資料整理或簡短說明。",
        type: "side",
        category: "creativity",
        occupation: "student",
        difficulty: "normal"
      }
    ]
  },
  {
    occupation: "developer",
    title: "工程師任務包",
    description: "聚焦開發推進、除錯、文件與作品集累積。",
    quests: [
      {
        title: "完成一個小功能切片",
        description: "挑一個可在 30 分鐘內完成的功能，完成後確認能實際操作。",
        type: "main",
        category: "creativity",
        occupation: "developer",
        difficulty: "normal"
      },
      {
        title: "寫下今天的技術筆記",
        description: "記錄一個今天解掉的問題、踩過的坑或學到的 API。",
        type: "daily",
        category: "learning",
        occupation: "developer",
        difficulty: "easy"
      },
      {
        title: "整理一段 README 或註解",
        description: "讓一段程式用途更容易被未來的自己或面試官看懂。",
        type: "side",
        category: "discipline",
        occupation: "developer",
        difficulty: "easy"
      }
    ]
  },
  {
    occupation: "designer",
    title: "設計師任務包",
    description: "協助累積研究、設計輸出與案例表達。",
    quests: [
      {
        title: "重畫一個關鍵畫面",
        description: "挑一個核心畫面，改善資訊層級、間距或狀態呈現。",
        type: "main",
        category: "creativity",
        occupation: "designer",
        difficulty: "normal"
      },
      {
        title: "收集三個介面參考",
        description: "找三個相關產品畫面，記錄它們解決問題的方式。",
        type: "side",
        category: "learning",
        occupation: "designer",
        difficulty: "easy"
      },
      {
        title: "寫一段設計決策說明",
        description: "用簡短文字說明一個設計選擇背後的目的與取捨。",
        type: "daily",
        category: "social",
        occupation: "designer",
        difficulty: "easy"
      }
    ]
  },
  {
    occupation: "creator",
    title: "內容創作者任務包",
    description: "把靈感、腳本、發布與回顧變成可完成的任務。",
    quests: [
      {
        title: "完成一段內容草稿",
        description: "寫出一段貼文、腳本或段落草稿，不追求完美，先留下素材。",
        type: "main",
        category: "creativity",
        occupation: "creator",
        difficulty: "normal"
      },
      {
        title: "整理三個選題靈感",
        description: "把觀察到的問題、畫面或句子整理成可延伸的選題。",
        type: "side",
        category: "exploration",
        occupation: "creator",
        difficulty: "easy"
      },
      {
        title: "回顧一則已發布內容",
        description: "看一則過去作品，寫下下次可以更清楚的地方。",
        type: "daily",
        category: "learning",
        occupation: "creator",
        difficulty: "easy"
      }
    ]
  },
  {
    occupation: "marketer",
    title: "行銷企劃任務包",
    description: "適合文案、受眾、活動與成長實驗。",
    quests: [
      {
        title: "寫一版活動主訊息",
        description: "用一句主訊息說清楚目標受眾、價值與下一步行動。",
        type: "main",
        category: "social",
        occupation: "marketer",
        difficulty: "normal"
      },
      {
        title: "檢查一個成效指標",
        description: "選一個指標，記錄它現在的狀態與可能原因。",
        type: "side",
        category: "learning",
        occupation: "marketer",
        difficulty: "easy"
      },
      {
        title: "整理三個受眾問題",
        description: "從留言、訪談或觀察中整理三個真實使用者問題。",
        type: "daily",
        category: "exploration",
        occupation: "marketer",
        difficulty: "easy"
      }
    ]
  },
  {
    occupation: "educator",
    title: "教育工作者任務包",
    description: "支援備課、教學回饋與知識整理。",
    quests: [
      {
        title: "設計一個課堂提問",
        description: "準備一個能引導學生思考的問題，並寫下預期回應。",
        type: "main",
        category: "learning",
        occupation: "educator",
        difficulty: "normal"
      },
      {
        title: "整理一份教學回饋",
        description: "記錄一個學生卡住的地方，思考下一次可以怎麼說明。",
        type: "side",
        category: "social",
        occupation: "educator",
        difficulty: "easy"
      },
      {
        title: "更新一段教材",
        description: "把一段教材改成更清楚、更容易操作的版本。",
        type: "daily",
        category: "creativity",
        occupation: "educator",
        difficulty: "easy"
      }
    ]
  },
  {
    occupation: "freelancer",
    title: "自由工作者任務包",
    description: "管理接案、交付、溝通與自我節奏。",
    quests: [
      {
        title: "整理一個客戶交付清單",
        description: "列出下一次交付要包含的項目，確認沒有模糊邊界。",
        type: "main",
        category: "discipline",
        occupation: "freelancer",
        difficulty: "normal"
      },
      {
        title: "更新一段作品案例",
        description: "補上一段成果、流程或你解決的問題，讓案例更完整。",
        type: "side",
        category: "creativity",
        occupation: "freelancer",
        difficulty: "normal"
      },
      {
        title: "安排明天的工作時段",
        description: "把明天的工作分成可執行區塊，保留休息時間。",
        type: "daily",
        category: "discipline",
        occupation: "freelancer",
        difficulty: "easy"
      }
    ]
  },
  {
    occupation: "business",
    title: "商務管理任務包",
    description: "聚焦規劃、協作、決策與營運推進。",
    quests: [
      {
        title: "寫下本週一個決策",
        description: "記錄要決定的事、可選方案與下一步負責人。",
        type: "main",
        category: "discipline",
        occupation: "business",
        difficulty: "normal"
      },
      {
        title: "整理一次會議重點",
        description: "把會議中的結論、待辦與風險整理成可追蹤項目。",
        type: "side",
        category: "social",
        occupation: "business",
        difficulty: "easy"
      },
      {
        title: "檢查一個營運流程",
        description: "選一段流程，找出一個可以減少摩擦的小改進。",
        type: "daily",
        category: "learning",
        occupation: "business",
        difficulty: "easy"
      }
    ]
  }
];

export function getOccupationQuestPack(occupation: OccupationCategory) {
  if (occupation === "custom") {
    return occupationQuestPacks.find((pack) => pack.occupation === "general");
  }

  return (
    occupationQuestPacks.find((pack) => pack.occupation === occupation) ??
    occupationQuestPacks.find((pack) => pack.occupation === "general")
  );
}
