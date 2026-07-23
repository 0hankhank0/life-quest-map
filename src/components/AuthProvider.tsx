"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isFacebookAuthEnabled, isGoogleAuthEnabled, isSupabaseConfigured } from "@/lib/supabase/config";

const AUTH_CHOICE_KEY = "lifeQuestMap:authChoice:v1";
type AuthContextValue = {
  user: User | null; isAuthLoading: boolean; isConfigured: boolean; googleEnabled: boolean; facebookEnabled: boolean; guestMode: boolean;
  signInWithGoogle(): Promise<void>; signInWithFacebook(): Promise<void>; continueAsGuest(): void; signOut(): Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const isConfigured = isSupabaseConfigured();
  const googleEnabled = isGoogleAuthEnabled();
  const facebookEnabled = isFacebookAuthEnabled();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [guestMode, setGuestMode] = useState(false);

  useEffect(() => {
    setGuestMode(window.localStorage.getItem(AUTH_CHOICE_KEY) === "guest");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) { setIsAuthLoading(false); return; }
    let active = true;
    void supabase.auth.getUser().then(({ data }) => { if (active) { setUser(data.user); setIsAuthLoading(false); } });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); setIsAuthLoading(false); });
    return () => { active = false; subscription.subscription.unsubscribe(); };
  }, []);

  const signIn = useCallback(async (provider: "google" | "facebook") => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) throw new Error("Auth is not configured.");
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback?next=/` } });
    if (error) throw error;
  }, []);
  const continueAsGuest = useCallback(() => { window.localStorage.setItem(AUTH_CHOICE_KEY, "guest"); setGuestMode(true); }, []);
  const signOut = useCallback(async () => { const supabase = createSupabaseBrowserClient(); if (supabase) { const { error } = await supabase.auth.signOut(); if (error) throw error; } window.localStorage.removeItem(AUTH_CHOICE_KEY); setGuestMode(false); setUser(null); }, []);
  const value = useMemo(() => ({ user, isAuthLoading, isConfigured, googleEnabled, facebookEnabled, guestMode, signInWithGoogle: () => signIn("google"), signInWithFacebook: () => signIn("facebook"), continueAsGuest, signOut }), [user, isAuthLoading, isConfigured, googleEnabled, facebookEnabled, guestMode, signIn, continueAsGuest, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used inside AuthProvider."); return context; }
