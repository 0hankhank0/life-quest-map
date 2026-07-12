import { getLevelProgress } from "@/lib/progression";

interface ExpBarProps {
  exp: number;
  compact?: boolean;
}

export function ExpBar({ exp, compact = false }: ExpBarProps) {
  const progress = getLevelProgress(exp);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-emerald-100/80">
        <span>EXP</span>
        <span>{progress} / 100</span>
      </div>
      <div
        className={`relative overflow-hidden rounded-full border border-emerald-300/20 bg-zinc-950/70 ${
          compact ? "h-2" : "h-3"
        }`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#34d399,#a3e635)] shadow-[0_0_18px_rgba(52,211,153,0.42)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
