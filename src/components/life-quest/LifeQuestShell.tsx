"use client";

import { useState } from "react";
import { BottomNav, type AppTab } from "@/components/BottomNav";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { HomePanel } from "@/components/life-quest/HomePanel";
import { LoadingScreen } from "@/components/life-quest/LoadingScreen";
import { MapPanel } from "@/components/life-quest/MapPanel";
import { Onboarding } from "@/components/life-quest/Onboarding";
import { ProfilePanel } from "@/components/life-quest/ProfilePanel";
import { QuestGuild } from "@/components/life-quest/QuestGuild";
import { SkillTreePanel } from "@/components/life-quest/SkillTreePanel";

export function LifeQuestShell() {
  const { state, isHydrated } = useLifeQuest();
  const [activeTab, setActiveTab] = useState<AppTab>("home");

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  if (!state.profile) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-100">
      <main className="mx-auto min-h-[100dvh] w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        {activeTab === "home" ? <HomePanel onNavigate={setActiveTab} /> : null}
        {activeTab === "quests" ? <QuestGuild onNavigate={setActiveTab} /> : null}
        {activeTab === "map" ? <MapPanel /> : null}
        {activeTab === "skills" ? <SkillTreePanel /> : null}
        {activeTab === "profile" ? <ProfilePanel /> : null}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
