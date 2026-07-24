# Cloud save setup

Life Quest Map stores one JSONB document per signed-in user in `public.user_saves`. The application uses the publishable key and the user's Supabase session only; it never needs a service-role key.

## Storage scopes

- Guest and legacy local progress: `lifeQuestMap:v0.1`
- Signed-in cache: `lifeQuestMap:user:<user-id>:v1` (a `CloudSaveEnvelope` with state, revision, sync time, and dirty flag)

These keys are deliberately separate. Signing in does not silently import guest data, signing out does not copy account data to the guest key, and a different account cannot load another account's key.

## Apply the migration manually

Before cloud saves can work, an authorized project administrator must review and apply [20260723_create_user_saves.sql](../supabase/migrations/20260723_create_user_saves.sql) through the team's normal Supabase migration process. This change only adds the local migration file; the application treats a missing table as “雲端存檔尚未啟用” and retains account-local cache safely.

The migration enables RLS and provides only authenticated own-row select, insert, and update policies. It grants no anonymous writes and no delete permission. To verify manually, sign in as two different users and confirm that each can select/update only its own `user_id` row; requests for the other row should return no row or an RLS error.

## First sign-in, offline behavior, and conflicts

When an account has no cloud save but this device has a guest character, the user chooses either **將這台裝置的進度存入帳號** or **建立全新的帳號進度**. The guest key is never deleted.

Every signed-in change is written to the account-local envelope immediately and marked dirty. A debounced sync uses the row revision as an optimistic concurrency check. Offline or failed syncs retain dirty data and retry once when the browser returns online.

If another device has changed the row, automatic writes stop. The user can use the cloud version or explicitly overwrite it with this device's version; either action first saves a local conflict backup under `lifeQuestMap:conflictBackup:<user-id>:<timestamp>`. Signing out retains guest data, account cache, and cloud data.
