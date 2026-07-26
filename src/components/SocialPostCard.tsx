import type { CSSProperties } from "react";
import type { AdventureQuote, SocialMission } from "@/types";
import { formatAdventureQuoteAttribution } from "@/lib/adventureQuoteAttribution";
import { getSocialMissionTypeLabel } from "@/lib/socialMissionMeta";

export type SocialCardFormat = "instagram-portrait" | "square" | "threads-wide";
/** @deprecated Use SocialCardFormat. */
export type SocialPostFormat = SocialCardFormat;

interface SocialPostCardProps {
  quote?: AdventureQuote;
  mission?: SocialMission;
  format: SocialCardFormat;
  showSource?: boolean;
  className?: string;
}

export function socialPostHeight(format: SocialCardFormat) {
  return format === "instagram-portrait" ? 1350 : format === "threads-wide" ? 810 : 1080;
}

function formatClass(format: SocialCardFormat) {
  return format === "instagram-portrait" ? "portrait" : format === "threads-wide" ? "threads" : "square";
}

function difficultyLabel(difficulty: SocialMission["difficulty"]) {
  return difficulty === "easy" ? "簡單" : difficulty === "normal" ? "普通" : "困難";
}

export function SocialPostCard({ quote, mission, format, showSource = true, className }: SocialPostCardProps) {
  if (!quote && !mission) throw new Error("SocialPostCard requires a quote or mission.");
  const attribution = quote ? formatAdventureQuoteAttribution(quote) : null;
  const style = { "--social-card-height": `${socialPostHeight(format)}px` } as CSSProperties;

  return <article data-testid="social-post-card" className={`social-post-card social-post-card--${formatClass(format)} ${mission ? "social-post-card--mission" : ""} ${className ?? ""}`} style={style} aria-label={mission ? "Life Quest Map 任務圖卡" : "Life Quest Map 語錄圖卡"}>
    <div className="social-post-contours" aria-hidden="true" />
    <div className="social-post-compass" aria-hidden="true"><span /><span /><span /><span /></div>
    <div className="social-post-frame" aria-hidden="true" />
    <div className="social-post-content">
      {mission ? <>
        <div className="social-post-kicker"><span className="social-post-mark" />{getSocialMissionTypeLabel(mission.questType)} · {mission.category}</div>
        <h1 className="social-post-mission-title">{mission.title}</h1>
        <h2 className="social-post-mission-objective">{mission.objectiveTitle}</h2>
        <p className="social-post-mission-description">{mission.description}</p>
        <div className="social-post-mission-condition"><span>完成條件</span><p>{mission.completionCondition}</p></div>
        <div className="social-post-mission-meta"><span>{mission.estimatedMinutes} 分鐘</span><span>{difficultyLabel(mission.difficulty)}</span><strong>+{mission.xp} XP</strong></div>
        <p className="social-post-mission-reward">獎勵：{mission.rewardLabel}</p>
        {format === "instagram-portrait" && mission.steps?.length ? <ol className="social-post-mission-steps">{mission.steps.slice(0, 3).map((step, index) => <li key={step}>{index + 1}. {step}</li>)}</ol> : null}
        <div className="social-post-footer"><span>Life Quest Map</span></div>
      </> : <>
        <div className="social-post-kicker"><span className="social-post-mark" />今日語錄</div>
        <blockquote className="social-post-quote">「{quote!.text}」</blockquote>
        {showSource && attribution ? <p className="social-post-source">{attribution}</p> : <div className="social-post-source-spacer" />}
        <div className="social-post-footer"><span>Life Quest Map</span><span className="social-post-coordinate">KEEP EXPLORING</span></div>
      </>}
    </div>
  </article>;
}
