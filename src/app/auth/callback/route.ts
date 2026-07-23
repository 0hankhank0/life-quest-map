import { NextRequest, NextResponse } from "next/server";
import { safeAuthNextPath } from "@/lib/authRedirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const next = safeAuthNextPath(url.searchParams.get("next"));
  const code = url.searchParams.get("code");
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.redirect(new URL("/?auth_error=auth_not_configured", url.origin));
  if (!code) return NextResponse.redirect(new URL("/?auth_error=oauth_callback_failed", url.origin));
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(error ? "/?auth_error=oauth_callback_failed" : next, url.origin));
}
