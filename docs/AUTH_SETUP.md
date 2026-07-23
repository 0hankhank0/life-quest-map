# Supabase Auth setup

Copy `.env.example` to `.env.local` and enter only your Supabase project URL and **Publishable Key**. Never expose a service-role key, OAuth client secret, provider token, or refresh token in `NEXT_PUBLIC_*` variables.

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true
NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED=false
```

In Supabase Auth URL Configuration, add these redirect URLs:

```text
http://localhost:3000/auth/callback
https://<your-domain>/auth/callback
```

For Google, create a Web application OAuth client. Its authorized JavaScript origins are your app URLs, while its authorized redirect URI is Supabase's callback: `https://<project-ref>.supabase.co/auth/v1/callback`. Enter the Google client ID and secret only in the Supabase dashboard, then enable Google and set `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true`.

For Facebook, configure the same Supabase callback as the valid OAuth redirect URI and request only the `email` permission. Keep the feature flag false until the provider is configured and the Meta app is ready for your intended users.

The app's `/auth/callback` exchanges Supabase's authorization code for a cookie session and accepts only internal `next` paths, preventing open redirects. This phase intentionally keeps Life Quest progress in `lifeQuestMap:v0.1` local storage; signing out does not delete it.
