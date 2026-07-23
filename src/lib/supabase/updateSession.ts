import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

// Kept ready for a future Next proxy/middleware integration. Next 15.5 does not
// require a project middleware file for this client-led OAuth foundation.
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  const config = getSupabaseConfig();
  if (!config) return response;
  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items) => items.forEach(({ name, value, options }) => {
        request.cookies.set(name, value);
        response.cookies.set(name, value, options);
      })
    }
  });
  await supabase.auth.getClaims();
  return response;
}
