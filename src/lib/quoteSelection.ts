import type { AdventureQuote, LifeQuestState, Quest, QuoteIntensity, QuoteTheme, TaskContext } from "@/types";

type TaskLike = Pick<Quest, "title" | "description" | "category" | "type" | "difficulty" | "expReward" | "questChainId">;

export interface InferredTaskContext {
  context: TaskContext;
  themes: QuoteTheme[];
  intensity: QuoteIntensity;
}

export interface QuotePlayerState {
  streak?: number;
  daysSinceLastCompletion?: number;
  isRetry?: boolean;
}

const contextRules: Array<[TaskContext, RegExp]> = [
  ["study", /讀書|閱讀|作業|複習|考試|背單字|英文|數學|報告|筆記|study|homework/i],
  ["exercise", /跑步|健身|運動|排球|羽球|訓練|拉伸|伸展|workout|run/i],
  ["creative", /設計|畫圖|寫作|創作|剪輯|攝影|作品|程式|開發|design|write|code/i],
  ["social", /朋友|家人|聊天|聚會|陪伴|聯絡|打電話|見面|friend|family/i],
  ["daily", /打掃|整理|洗衣|洗碗|倒垃圾|收房間|家事|採買|清潔/i],
  ["health", /看醫生|吃藥|復健|睡眠|喝水|健康|門診|回診/i],
  ["self-care", /休息|放鬆|冥想|早睡|照顧自己|紓壓|休假/i],
  ["adventure", /出門|探索|旅行|散步|參觀|挑戰|沒去過|微冒險|地圖|explore|travel/i],
  ["work", /工作|會議|提案|客戶|簡報|專案|mail|email/i]
];

const categoryContext: Partial<Record<Quest["category"], TaskContext>> = {
  learning: "study", fitness: "exercise", creativity: "creative", social: "social", exploration: "adventure"
};

const contextThemes: Record<TaskContext, QuoteTheme[]> = {
  study: ["learning", "growth", "persistence"],
  exercise: ["action", "persistence", "growth"],
  work: ["action", "growth", "persistence"],
  creative: ["creativity", "growth", "exploration"],
  social: ["relationships", "daily-life", "growth"],
  daily: ["daily-life", "growth", "recovery"],
  health: ["recovery", "rest", "growth"],
  adventure: ["exploration", "courage", "growth"],
  "self-care": ["rest", "recovery", "reflection"],
  general: ["growth", "reflection"]
};

export function inferTaskContext(task: TaskLike, tags: readonly string[] = []): InferredTaskContext {
  const metadata = tags.join(" ");
  const text = `${task.title} ${task.description}`;
  // A specific explicit category is trusted; discipline is deliberately left to concrete wording.
  const fromCategory = categoryContext[task.category];
  const tagged = contextRules.find(([, rule]) => rule.test(metadata));
  const titled = contextRules.find(([, rule]) => rule.test(text));
  const context = tagged?.[0] ?? fromCategory ?? titled?.[0] ?? (task.type === "map" ? "adventure" : "general");
  const hard = task.difficulty === "hard" || task.expReward >= 50 || Boolean(task.questChainId);
  const gentle = task.difficulty === "easy" && (context === "daily" || context === "self-care" || context === "health");
  const themes: QuoteTheme[] = [...contextThemes[context], ...(hard ? ["courage", "persistence"] as QuoteTheme[] : [])];
  return { context, themes, intensity: hard ? "epic" : gentle ? "gentle" : "normal" };
}

function scoreQuote(quote: AdventureQuote, inferred: InferredTaskContext, playerState: QuotePlayerState, recent: Set<string>): number {
  const themes = quote.themes ?? [];
  const contextMatch = quote.contexts?.includes(inferred.context) ? 5 : 0;
  const themeMatches = inferred.themes.filter((theme) => themes.includes(theme)).length;
  let score = contextMatch + themeMatches * 3 + (quote.intensity === inferred.intensity ? 2 : 0);
  if (playerState.streak && playerState.streak >= 3 && (themes.includes("action") || themes.includes("growth"))) score += 2;
  if (playerState.daysSinceLastCompletion && playerState.daysSinceLastCompletion >= 7 && (themes.includes("recovery") || quote.intensity === "gentle")) score += 2;
  if (playerState.isRetry && (themes.includes("recovery") || themes.includes("persistence"))) score += 2;
  if (recent.has(quote.id)) score -= 100;
  if ((inferred.context === "daily" || inferred.context === "self-care") && quote.intensity === "epic") score -= 12;
  if (inferred.intensity === "epic" && quote.intensity === "gentle") score -= 3;
  return score;
}

export function selectQuoteForTask({ task, playerState = {}, recentQuoteIds = [], quotes, random = Math.random, tags = [] }: {
  task: TaskLike; playerState?: QuotePlayerState; recentQuoteIds?: readonly string[]; quotes: readonly AdventureQuote[]; random?: () => number; tags?: readonly string[];
}): AdventureQuote {
  const enabled = quotes.filter((quote) => quote.enabled !== false);
  if (!enabled.length) throw new Error("Cannot select a quote from an empty catalog.");
  const inferred = inferTaskContext(task, tags);
  const recent = new Set(recentQuoteIds.slice(-5));
  const ranked = enabled.map((quote) => ({ quote, score: scoreQuote(quote, inferred, playerState, recent) })).sort((a, b) => b.score - a.score);
  // If the catalog is small, relax recency only after semantic ranking has been calculated.
  const fresh = ranked.filter((item) => !recent.has(item.quote.id));
  const pool = fresh.length ? fresh : ranked;
  const cutoff = Math.min(6, Math.max(3, pool.filter((item) => item.score === pool[0].score).length));
  return pool.slice(0, cutoff)[Math.min(cutoff - 1, Math.floor(random() * cutoff))].quote;
}

export function quotePlayerStateFromLifeState(state: Pick<LifeQuestState, "streak" | "quests">, task: TaskLike & Pick<Quest, "id">, now = new Date()): QuotePlayerState {
  const completed = state.quests.filter((quest) => quest.status === "completed" && quest.completedAt).sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
  const last = completed.find((quest) => quest.id !== task.id)?.completedAt;
  const daysSinceLastCompletion = last ? Math.floor((now.getTime() - new Date(last).getTime()) / 86_400_000) : undefined;
  return { streak: state.streak.current, daysSinceLastCompletion: daysSinceLastCompletion && daysSinceLastCompletion > 0 ? daysSinceLastCompletion : undefined };
}
