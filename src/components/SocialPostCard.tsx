import type { CSSProperties } from "react";
import type { AdventureQuote, SocialMission } from "@/types";
import { formatAdventureQuoteAttribution } from "@/lib/adventureQuoteAttribution";

export type SocialPostFormat = "portrait" | "square" | "threads";

interface SocialPostCardProps {
  quote?: AdventureQuote;
  mission?: SocialMission;
  format: SocialPostFormat;
  showSource?: boolean;
  className?: string;
}

export function socialPostHeight(format: SocialPostFormat) {
  if (format === "portrait") return 1350;
  if (format === "threads") return 810;
  return 1080;
}

function difficultyLabel(difficulty: SocialMission["difficulty"]) {
  return difficulty === "easy" ? "簡單" : difficulty === "normal" ? "普通" : "挑戰";
}

export function SocialPostCard({ quote, mission, format, showSource = true, className }: SocialPostCardProps) {
  if (!quote && !mission) throw new Error("SocialPostCard requires a quote or mission.");
  const attribution = quote ? formatAdventureQuoteAttribution(quote) : null;
  const style = { "--social-card-height": `${socialPostHeight(format)}px` } as CSSProperties;

  return (
    <article data-testid="social-post-card" className={`social-post-card social-post-card--${format} ${mission ? "social-post-card--mission" : ""} ${className ?? ""}`} style={style} aria-label={mission ? "Life Quest Map 今日任務貼文" : "Life Quest Map 社群貼文"}>
      <div className="social-post-contours" aria-hidden="true" />
      <div className="social-post-compass" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="social-post-frame" aria-hidden="true" />
      <div className="social-post-content">
        {mission ? <>
          <div className="social-post-kicker"><span className="social-post-mark" />今日任務 · {mission.category}</div>
          <h1 className="social-post-mission-title">{mission.title}</h1>
          <p className="social-post-mission-description">{mission.description}</p>
          <div className="social-post-mission-condition"><span>完成條件</span><p>{mission.completionCondition}</p></div>
          <div className="social-post-mission-meta"><span>{mission.estimatedMinutes} 分鐘</span><span>{difficultyLabel(mission.difficulty)}</span><strong>+{mission.xp} XP</strong></div>
          <div className="social-post-footer"><span>Life Quest Map</span></div>
        </> : <>
          <div className="social-post-kicker"><span className="social-post-mark" />探索者語錄</div>
          <blockquote className="social-post-quote">「{quote!.text}」</blockquote>
          {showSource && attribution ? <p className="social-post-source">{attribution}</p> : <div className="social-post-source-spacer" />}
          <div className="social-post-footer"><span>Life Quest Map</span><span className="social-post-coordinate">KEEP EXPLORING</span></div>
        </>}
      </div>
    </article>
  );
}
