import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";
import {
  BookOpen,
  Compass,
  Heart,
  PaintBrush,
  Shield,
  Users
} from "@phosphor-icons/react";
import { categoryDescriptions, categoryLabels } from "@/data/labels";
import { getStatProgress, getStatRank } from "@/lib/progression";
import type { QuestCategory } from "@/types";

type IconComponent = ComponentType<IconProps>;

const statIcons: Record<QuestCategory, IconComponent> = {
  learning: BookOpen,
  fitness: Heart,
  creativity: PaintBrush,
  social: Users,
  discipline: Shield,
  exploration: Compass
};

interface StatCardProps {
  category: QuestCategory;
  value: number;
  compact?: boolean;
}

export function StatCard({ category, value, compact = false }: StatCardProps) {
  const Icon = statIcons[category];
  const rank = getStatRank(value);
  const progress = getStatProgress(value);

  return (
    <article className={`game-card p-4 ${compact ? "space-y-3" : "space-y-4"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg border border-emerald-300/20 bg-emerald-300/10">
            <Icon className="size-5 text-emerald-200" weight="duotone" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-50">{categoryLabels[category]}</h3>
            {!compact ? (
              <p className="mt-1 text-xs text-zinc-400">{categoryDescriptions[category]}</p>
            ) : null}
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-zinc-50">{value}</p>
          <p className="text-xs text-emerald-200">Rank {rank}</p>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-zinc-950/80">
        <div
          className="h-full rounded-full bg-emerald-300 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </article>
  );
}
