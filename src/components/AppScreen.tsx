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
  const { state, isHydrated, cloudBootstrap, cloudError, importGuestProgress, createFreshAccountProgress, retryCloudBootstrap } = useLifeQuest();
  const { user, guestMode, isAuthLoading, signOut } = useAuth();
  if (!isHydrated || isAuthLoading) return <LoadingScreen />;
  if (!user && !guestMode) return <AuthEntry />;
  if (user && cloudBootstrap !== "ready") return <CloudBootstrapScreen mode={cloudBootstrap} error={cloudError} onImport={() => void importGuestProgress()} onFresh={() => void createFreshAccountProgress()} onRetry={retryCloudBootstrap} onSignOut={() => void signOut()} />;
  if (!state.profile) return <Onboarding />;
  const panel = view === "home" ? <HomePanel /> : view === "quests" ? <QuestGuild /> : view === "map" ? <MapPanel /> : view === "skills" ? <SkillTreePanel /> : view === "history" ? <HistoryPanel state={state} /> : <ProfilePanel />;
  return <div className="min-h-dvh bg-zinc-950 text-zinc-100 lg:flex"><DesktopNav /><OfflineStatus /><main className="min-h-dvh w-full px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-8">{panel}</main><BottomNav /><CompletionFeedbackDialog />{state.userSettings.tutorialCompletedAt === null ? <BeginnerGuide /> : null}</div>;
}

function CloudBootstrapScreen({ mode, error, onImport, onFresh, onRetry, onSignOut }: { mode: "choose-import" | "error"; error: string | null; onImport: () => void; onFresh: () => void; onRetry: () => void; onSignOut: () => void }) {
  return <main className="grid min-h-dvh place-items-center bg-zinc-950 px-4 text-zinc-100"><section className="w-full max-w-lg rounded-3xl border border-emerald-300/20 bg-zinc-900/80 p-7 shadow-2xl shadow-emerald-950/30"><p className="text-sm font-black tracking-[0.2em] text-emerald-200">CLOUD SAVE</p>{mode === "choose-import" ? <><h1 className="mt-2 text-3xl font-black">設定帳號進度</h1><p className="mt-3 leading-7 text-zinc-400">這台裝置已有訪客進度。請選擇是否將它複製到目前帳號；原本訪客資料會保留。</p><div className="mt-6 grid gap-3"><button type="button" data-testid="import-guest-progress" onClick={onImport} className="min-h-12 rounded-xl bg-emerald-300 px-4 font-black text-emerald-950">將這台裝置的進度存入帳號</button><p className="text-xs text-zinc-500">會複製目前角色、任務、EXP、技能與冒險手札到此帳號。</p><button type="button" data-testid="create-fresh-account-progress" onClick={onFresh} className="min-h-12 rounded-xl border border-white/15 px-4 font-black text-zinc-100">建立全新的帳號進度</button><p className="text-xs text-zinc-500">不會刪除這台裝置原本的訪客進度。</p></div></> : <><h1 className="mt-2 text-3xl font-black">雲端存檔尚未就緒</h1><p className="mt-3 leading-7 text-zinc-400">{error ?? "初始化失敗。你的本機資料沒有被刪除。"}</p><div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={onRetry} className="min-h-11 rounded-xl bg-emerald-300 px-4 font-black text-emerald-950">重試</button><button type="button" onClick={onSignOut} className="min-h-11 rounded-xl border border-white/15 px-4 font-black text-zinc-100">登出</button></div></>}</section></main>;
}
