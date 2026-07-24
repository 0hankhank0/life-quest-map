"use client";

import { useEffect, useState } from "react";
import { FacebookLogo, GoogleLogo, Shield } from "@phosphor-icons/react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";

export function AuthEntry() {
  const { isConfigured, googleEnabled, facebookEnabled, signInWithGoogle, signInWithFacebook, continueAsGuest } = useAuth();
  const { showToast } = useToast();
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("auth_error");
    if (!error) return;
    showToast(error === "auth_not_configured" ? "登入尚未設定，仍可使用訪客模式。" : "登入取消或失敗，請重試。", "error");
    window.history.replaceState({}, "", window.location.pathname);
  }, [showToast]);

  async function beginSignIn(provider: "google" | "facebook") {
    if (signingIn) return;
    setSigningIn(true);
    try {
      await (provider === "google" ? signInWithGoogle() : signInWithFacebook());
    } catch {
      showToast(`無法開始 ${provider === "google" ? "Google" : "Facebook"} 登入，請確認 OAuth 設定後再試。`, "error");
      setSigningIn(false);
    }
  }

  return <main className="grid min-h-dvh place-items-center bg-zinc-950 px-4 text-zinc-100"><section className="w-full max-w-lg rounded-3xl border border-emerald-300/20 bg-zinc-900/80 p-7 shadow-2xl shadow-emerald-950/30 sm:p-10"><div className="grid size-14 place-items-center rounded-2xl bg-emerald-300/15 text-emerald-200"><Shield size={32} weight="duotone" /></div><p className="mt-6 text-sm font-black tracking-[0.2em] text-emerald-200">LIFE QUEST</p><h1 className="mt-2 text-3xl font-black">開始你的生活冒險</h1><p className="mt-3 leading-7 text-zinc-400">以任務、微冒險與技能樹，將日常累積成可看見的成長。你可先用訪客模式開始，登入後再建立帳號專屬存檔。</p><p className="mt-3 leading-7 text-zinc-400">登入後會同步任務、EXP、技能與手札；首次登入可選擇匯入這台裝置的訪客進度，或建立全新進度。訪客資料不會自動刪除。</p><div className="mt-7 grid gap-3">{googleEnabled ? <button type="button" data-testid="sign-in-google" disabled={signingIn} onClick={() => void beginSignIn("google")} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-emerald-300 px-4 font-black text-emerald-950 transition hover:bg-emerald-200 disabled:cursor-wait disabled:opacity-60"><GoogleLogo size={20} weight="bold" />{signingIn ? "正在前往登入…" : "使用 Google 登入"}</button> : null}{facebookEnabled ? <button type="button" data-testid="sign-in-facebook" disabled={signingIn} onClick={() => void beginSignIn("facebook")} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-[#1877f2]/40 px-4 font-black text-blue-100 transition hover:bg-[#1877f2]/15 disabled:cursor-wait disabled:opacity-60"><FacebookLogo size={20} weight="bold" />使用 Facebook 登入</button> : null}<button type="button" data-testid="continue-as-guest" disabled={signingIn} onClick={continueAsGuest} className="min-h-12 rounded-xl border border-emerald-300/25 px-4 font-black text-emerald-100 transition hover:bg-emerald-300/10 disabled:opacity-60">以訪客模式開始</button></div>{!isConfigured ? <p className="mt-5 rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-sm text-amber-100">登入尚未設定；你仍可使用訪客模式。</p> : null}<p className="mt-6 text-xs leading-5 text-zinc-500">OAuth 登入不會要求 Drive、Calendar 或 Contacts 權限；定位只會在你主動點擊後取得，不會背景追蹤。</p></section></main>;
}
