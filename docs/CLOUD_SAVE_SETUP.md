# Cloud save setup

Life Quest Map stores one JSONB document per signed-in user in `public.user_saves`. The browser uses only the Supabase publishable key and the user's session; never add a service-role key to client configuration.

## Storage scopes

- Guest progress: `lifeQuestMap:v0.1`
- Signed-in cache: `lifeQuestMap:user:<user-id>:v1`
- Conflict backups: `lifeQuestMap:conflictBackup:<user-id>:<timestamp>`

These scopes are separate. Signing in does not silently import guest data, signing out does not delete guest or account cache, and one account cannot use another account's cache.

## Apply migrations manually

An authorized administrator must review and apply every file in `supabase/migrations/` with the team's normal Supabase migration process. This repository does not apply remote migrations automatically.

The policies permit authenticated users to select, insert, and update only their own row. Anonymous users have no access and authenticated users cannot delete rows. The save JSON is limited to 1 MiB. Verify with two accounts that neither can read or update the other account's row.

## First sign-in, offline behavior, and conflicts

On first sign-in, a device with guest progress offers **import guest progress** or **create fresh account progress**. The guest key is never deleted.

Every signed-in change first updates the account-local envelope and marks it dirty. A debounced optimistic update uses the cloud revision. If the cache is dirty but has the same revision as the cloud row, it is an interrupted local sync and is retried; it is not a conflict. A conflict is shown only when revisions differ and the versions differ.

Offline and temporary cloud failures keep existing account cache usable and retry after the browser reconnects. If a real multi-device conflict occurs, the user may use the cloud version or explicitly overwrite cloud data with this device's version. Either choice keeps a conflict backup locally.
