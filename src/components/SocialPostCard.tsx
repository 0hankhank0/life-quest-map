import type { CSSProperties } from "react";
import type { AdventureQuote, SocialMission } from "@/types";
import { formatStudioQuoteAttribution } from "@/components/social-studio/quoteStudioFilters";
import { getSocialMissionTypeLabel } from "@/lib/socialMissionMeta";

export type SocialCardFormat = "instagram-portrait" | "square" | "threads-wide";
export type CustomSocialQuote = { text: string; author: string; work: string };
export type SocialPostFormat = SocialCardFormat;
interface SocialPostCardProps { quote?: AdventureQuote; customQuote?: CustomSocialQuote; mission?: SocialMission; format: SocialCardFormat; showSource?: boolean; className?: string; exportMode?: boolean; }
export function socialPostHeight(format: SocialCardFormat) { return format === "instagram-portrait" ? 1350 : format === "threads-wide" ? 810 : 1080; }
function formatClass(format: SocialCardFormat) { return format === "instagram-portrait" ? "portrait" : format === "threads-wide" ? "threads" : "square"; }
function difficultyLabel(difficulty: SocialMission["difficulty"]) { return difficulty === "easy" ? "簡單" : difficulty === "normal" ? "普通" : "挑戰"; }
export function formatCustomSocialQuoteAttribution(quote: CustomSocialQuote) { return quote.author && quote.work ? `—— ${quote.author}，《${quote.work}》` : quote.author ? `—— ${quote.author}` : quote.work ? `——《${quote.work}》` : null; }

export function SocialPostCard({ quote, customQuote, mission, format, showSource = true, className, exportMode = false }: SocialPostCardProps) {
  if (!quote && !customQuote && !mission) throw new Error("SocialPostCard requires content.");
  const attribution = quote ? formatStudioQuoteAttribution(quote) : customQuote ? formatCustomSocialQuoteAttribution(customQuote) : null;
  const quoteText = quote?.text ?? customQuote?.text ?? "";
  const style = { "--social-card-height": `${socialPostHeight(format)}px` } as CSSProperties;
  return <article data-testid="social-post-card" data-format={format} data-social-export={exportMode || undefined} className={`social-post-card social-post-card--${formatClass(format)} ${mission ? "social-post-card--mission" : ""} ${className ?? ""}`} style={style} aria-label={mission ? "Life Quest Map 今日任務貼文" : "Life Quest Map 社群貼文"}>
    <div className="social-post-contours" aria-hidden="true" /><div className="social-post-compass" aria-hidden="true"><span /><span /><span /><span /></div><div className="social-post-frame" aria-hidden="true" />
    <div className="social-post-content">{mission ? <><div className="social-post-kicker"><span className="social-post-mark" />{getSocialMissionTypeLabel(mission.questType)} · {mission.category}</div><h1 className="social-post-mission-title">{mission.title}</h1><h2 className="social-post-mission-objective">{mission.objectiveTitle}</h2><p className="social-post-mission-description">{mission.description}</p><div className="social-post-mission-condition"><span>完成條件</span><p>{mission.completionCondition}</p></div><div className="social-post-mission-meta"><span>{mission.estimatedMinutes} 分鐘</span><span>{difficultyLabel(mission.difficulty)}</span><strong>+{mission.xp} XP</strong></div><p className="social-post-mission-reward">獎勵：{mission.rewardLabel}</p>{format === "instagram-portrait" && mission.steps?.length ? <ol className="social-post-mission-steps">{mission.steps.slice(0, 3).map((step, index) => <li key={step}>{index + 1}. {step}</li>)}</ol> : null}<div className="social-post-footer"><span>Life Quest Map</span></div></> : <><div className="social-post-kicker"><span className="social-post-mark" />探索者語錄</div><blockquote className="social-post-quote">「{quoteText}」</blockquote>{showSource && attribution ? <p className="social-post-source">{attribution}</p> : <div className="social-post-source-spacer" />}<div className="social-post-footer"><span>Life Quest Map</span><span className="social-post-coordinate">KEEP EXPLORING</span></div></>}</div>
  </article>;
}
