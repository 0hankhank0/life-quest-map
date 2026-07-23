"use client";

import { useLifeQuest } from "@/components/LifeQuestProvider";
import { BottomNav } from "@/components/BottomNav";
import { DesktopNav } from "@/components/DesktopNav";
import { OfflineStatus } from "@/components/OfflineStatus";
import { LoadingScreen } from "@/components/life-quest/LoadingScreen";
import { Onboarding } from "@/components/life-quest/Onboarding";
import { HomePanel } from "@/components/life-quest/HomePanel";
import { QuestGuild } from "@/components/life-quest/QuestGuild";
import { MapPanel } from "@/components/life-quest/MapPanel";
import { SkillTreePanel } from "@/components/life-quest/SkillTreePanel";
import { HistoryPanel } from "@/components/life-quest/HistoryPanel";
import { ProfilePanel } from "@/components/life-quest/ProfilePanel";
import { CompletionFeedbackDialog } from "@/components/life-quest/CompletionFeedbackDialog";
import { BeginnerGuide } from "@/components/life-quest/BeginnerGuide";
import { AuthEntry } from "@/components/life-quest/AuthEntry";
import { useAuth } from "@/components/AuthProvider";

export type AppView = "home" | "quests" | "map" | "skills" | "history" | "profile";
export function AppScreen({ view }: { view: AppView }) {
  const { state, isHydrated } = useLifeQuest();
  const { user, guestMode, isAuthLoading } = useAuth();
  if (!isHydrated || isAuthLoading) return <LoadingScreen />;
  if (!state.profile && !user && !guestMode) return <AuthEntry />;
  if (!state.profile) return <Onboarding />;
  const panel = view === "home" ? <HomePanel /> : view === "quests" ? <QuestGuild /> : view === "map" ? <MapPanel /> : view === "skills" ? <SkillTreePanel /> : view === "history" ? <HistoryPanel state={state} /> : <ProfilePanel />;
  return <div className="min-h-dvh bg-zinc-950 text-zinc-100 lg:flex"><DesktopNav /><OfflineStatus /><main className="min-h-dvh w-full px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-8">{panel}</main><BottomNav /><CompletionFeedbackDialog />{state.userSettings.tutorialCompletedAt === null ? <BeginnerGuide /> : null}</div>;
}
