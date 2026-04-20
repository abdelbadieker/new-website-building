# Supabase Manual Setup Checklist

Every step below must be done manually in the Supabase Dashboard or Vercel Dashboard.
Nothing here can be done automatically by the codebase.

---

## Step 1 — Run SQL migrations in order

Go to **Supabase Dashboard → SQL Editor** and run these two files in order:

1. `supabase/migrations/20260420000001_handle_new_user_trigger.sql`
2. `supabase/migrations/20260420000002_rls_policies.sql`

Paste the entire file contents and click **Run**.

> **Why**: The trigger auto-creates a profile row for every new user. Without it, merchants register but never appear in the admin panel. The RLS policies protect each merchant's data from other merchants.

---

## Step 2 — Verify the trigger works

After running the trigger migration, confirm it exists:

```sql
SELECT trigger_name, event_object_table, action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

Expected: one row, `event_object_table = users`, `action_timing = AFTER`.

---

## Step 3 — Create Supabase Storage bucket for product images

Go to **Storage → New Bucket**:

- **Name**: `products`  
- **Public bucket**: ✅ Yes (so product images have public URLs)
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`

> **Why**: The Fulfillment Engine admin page uploads product images to this bucket via the `/api/admin/fulfillment/upload` route (which uses the service-role key, so no separate bucket policy is needed).

---

## Step 4 — Set Supabase Auth redirect URLs

Go to **Authentication → URL Configuration**:

**Site URL**: `https://your-site-app.vercel.app`

**Redirect URLs** (add all of these):
```
https://your-site-app.vercel.app/auth/callback
http://localhost:3001/auth/callback
https://your-site-app.vercel.app/**
```

> **Why**: Google OAuth and magic links redirect to `/auth/callback`. Without the exact URL in the allowlist, Supabase blocks the redirect and login fails.

---

## Step 5 — Enable Google OAuth provider (if using Google login)

Go to **Authentication → Providers → Google**:

1. Enable Google provider: ✅
2. Enter your **Client ID** from Google Cloud Console
3. Enter your **Client Secret** from Google Cloud Console
4. Copy the **Callback URL** shown by Supabase and add it to your Google OAuth app's authorized redirect URIs

> **How to get Google credentials**: Go to [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials → Create OAuth 2.0 Client ID.

---

## Step 6 — Set environment variables in Vercel

### For `apps/admin` (admin Vercel project):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key (secret) |
| `ADMIN_PASSWORD_HASH` | bcryptjs hash of your admin password |

### For `apps/site` (merchant site Vercel project):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon/public key |
| `NEXT_PUBLIC_SUPPORT_WHATSAPP` | Your WhatsApp business number, e.g. `213555123456` |

> **Critical**: `SUPABASE_SERVICE_ROLE_KEY` is secret — never expose it in `NEXT_PUBLIC_*` variables. It is only used server-side (API routes, server components).

> **How to get keys**: Supabase Dashboard → Settings → API.

---

## Step 7 — Generate ADMIN_PASSWORD_HASH

Run this once locally in the admin app directory:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_PASSWORD', 12).then(h => console.log(h))"
```

Copy the output (starts with `$2a$`) and paste it as the `ADMIN_PASSWORD_HASH` environment variable in Vercel.

---

## Step 8 — Verify RLS is not blocking Realtime

Go to **Database → Replication** and confirm the following tables are in the **Supabase Realtime** publication:

- `profiles` ✅ (needed for feature-gate live sync in merchant dashboard)

If `profiles` is missing from the publication:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
```

---

## Step 9 — Check existing users have profiles

If you already have test users who registered before the trigger was created, they may have no profile row. Run this SQL to back-fill them:

```sql
INSERT INTO public.profiles (id, email, full_name, plan, features, locked_sections, created_at, updated_at)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  'Starter',
  '{"crm":true,"orders":true,"support":true,"chatbot":false,"analytics":false}'::jsonb,
  ARRAY[]::text[],
  NOW(),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;
```

---

## Summary of what is automatic vs. manual

| What | How |
|---|---|
| Profile created on registration | ✅ Automatic (handle_new_user trigger) |
| RLS protection per merchant | ✅ Automatic (after running migration SQL) |
| Admin bypasses RLS | ✅ Automatic (service-role key) |
| Feature flags live sync | ✅ Automatic (Supabase Realtime in layout.tsx) |
| Product image upload | ✅ Automatic (via /api/admin/fulfillment/upload) |
| Subscription date display | ✅ Automatic (reads from subscriptions table) |
| WhatsApp upgrade button | ✅ Automatic (reads NEXT_PUBLIC_SUPPORT_WHATSAPP) |
| Storage bucket creation | ⚠️ Manual (Step 3) |
| Google OAuth setup | ⚠️ Manual (Step 5) |
| Environment variables | ⚠️ Manual (Step 6) |
| Admin password hash | ⚠️ Manual (Step 7) |
| Realtime publication | ⚠️ Manual if missing (Step 8) |
| Back-fill existing users | ⚠️ Manual if needed (Step 9) |
