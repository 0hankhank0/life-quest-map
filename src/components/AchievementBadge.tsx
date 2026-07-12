import { LockKey, Trophy } from "@phosphor-icons/react";
import type { Achievement } from "@/types";

interface AchievementBadgeProps {
  achievement: Achievement;
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  return (
    <article
      className={`rounded-lg border p-4 transition ${
        achievement.unlocked
          ? "border-emerald-300/30 bg-emerald-300/10 text-zinc-50"
          : "border-white/10 bg-zinc-950/40 text-zinc-500"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`grid size-10 shrink-0 place-items-center rounded-lg ${
            achievement.unlocked ? "bg-emerald-300/15" : "bg-zinc-900"
          }`}
        >
          {achievement.unlocked ? (
            <Trophy className="size-5 text-emerald-200" weight="duotone" />
          ) : (
            <LockKey className="size-5 text-zinc-500" weight="duotone" />
          )}
        </div>
        <div>
          <h3 className="font-bold">{achievement.title}</h3>
          <p className="mt-1 text-xs leading-5 opacity-80">{achievement.description}</p>
          {achievement.unlocked && achievement.unlockedAt ? (
            <p className="mt-2 text-xs text-emerald-200">
              已解鎖：{achievement.unlockedAt.slice(0, 10)}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
