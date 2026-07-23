const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

export function isSupabaseConfigured(): boolean {
  return Boolean(url && publishableKey);
}

export function getSupabaseConfig() {
  return isSupabaseConfigured() ? { url: url!, publishableKey: publishableKey! } : null;
}

export function isGoogleAuthEnabled(): boolean {
  return isSupabaseConfigured() && process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true";
}

export function isFacebookAuthEnabled(): boolean {
  return isSupabaseConfigured() && process.env.NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED === "true";
}
