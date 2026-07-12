import { Compass, Medal, Shield, UserCircle } from "@phosphor-icons/react";
import {
  categoryLabels,
  occupationLabels,
  roleOptions,
  studentStageLabels
} from "@/data/labels";
import { getLevelProgress } from "@/lib/progression";
import type { Stats, UserProfile } from "@/types";
import { ExpBar } from "@/components/ExpBar";

interface CharacterCardProps {
  profile: UserProfile;
  stats: Stats;
  completedToday: number;
  totalToday: number;
}

export function CharacterCard({
  profile,
  stats,
  completedToday,
  totalToday
}: CharacterCardProps) {
  const role = roleOptions.find((option) => option.value === profile.role);
  const focuses =
    profile.focuses && profile.focuses.length > 0 ? profile.focuses : [profile.focus];
  const focusLabels = focuses.map((focus) => categoryLabels[focus]).join("、");
  const occupation =
    profile.lifeStage === "student"
      ? `${profile.studentStage ? studentStageLabels[profile.studentStage] : ""}學生`
      : profile.occupation === "custom"
      ? profile.customOccupationName || "自訂職業"
      : occupationLabels[profile.occupation];
  const strongestSelectedFocus = focuses
    .map((focus) => ({ focus, value: stats[focus] }))
    .sort((a, b) => b.value - a.value)[0];

  return (
    <section className="game-card relative overflow-hidden p-5">
      <div className="absolute right-4 top-4 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">
        Lv {profile.level}
      </div>

      <div className="flex items-start gap-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-2xl border border-emerald-300/25 bg-emerald-300/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <UserCircle className="size-10 text-emerald-200" weight="duotone" />
        </div>
        <div className="min-w-0 flex-1 pr-14">
          <p className="text-xs font-semibold text-emerald-200/80">角色狀態</p>
          <h2 className="mt-1 truncate text-2xl font-black text-zinc-50">
            {profile.name}
          </h2>
          <p className="mt-1 text-sm text-zinc-300">
            {role?.label ?? "玩家"} · {occupation}路線
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            主要成長：{focusLabels}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <ExpBar exp={profile.exp} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-white/10 bg-zinc-950/50 p-3">
          <Medal className="mb-2 size-5 text-emerald-200" weight="duotone" />
          <p className="text-xl font-black text-zinc-50">{profile.exp}</p>
          <p className="text-xs text-zinc-400">總 EXP</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-zinc-950/50 p-3">
          <Shield className="mb-2 size-5 text-emerald-200" weight="duotone" />
          <p className="text-xl font-black text-zinc-50">
            {completedToday} / {totalToday}
          </p>
          <p className="text-xs text-zinc-400">今日任務</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-zinc-950/50 p-3">
          <Compass className="mb-2 size-5 text-emerald-200" weight="duotone" />
          <p className="text-xl font-black text-zinc-50">{strongestSelectedFocus.value}</p>
          <p className="text-xs text-zinc-400">
            {categoryLabels[strongestSelectedFocus.focus]}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-zinc-400">
        下一等還需要 {100 - getLevelProgress(profile.exp)} EXP
      </p>
    </section>
  );
}
