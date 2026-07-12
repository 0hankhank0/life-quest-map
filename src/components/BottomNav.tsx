"use client";

import {
  ClipboardText,
  House,
  MapTrifold,
  TreeStructure,
  UserCircle
} from "@phosphor-icons/react";

export type AppTab = "home" | "quests" | "map" | "skills" | "profile";

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const navItems: Array<{
  tab: AppTab;
  label: string;
  Icon: typeof House;
}> = [
  { tab: "home", label: "Home", Icon: House },
  { tab: "quests", label: "Quests", Icon: ClipboardText },
  { tab: "map", label: "Map", Icon: MapTrifold },
  { tab: "skills", label: "Skills", Icon: TreeStructure },
  { tab: "profile", label: "Profile", Icon: UserCircle }
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-emerald-300/15 bg-zinc-950/88 px-3 py-2 backdrop-blur-xl">
      <div className="mx-auto grid max-w-xl grid-cols-5 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {navItems.map(({ tab, label, Icon }) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-bold transition active:translate-y-px ${
                isActive
                  ? "bg-emerald-300 text-zinc-950 shadow-[0_0_18px_rgba(52,211,153,0.28)]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-5" weight={isActive ? "fill" : "duotone"} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
