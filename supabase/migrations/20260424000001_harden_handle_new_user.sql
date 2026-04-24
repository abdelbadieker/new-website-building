-- ============================================================
-- Migration: harden handle_new_user trigger
-- Purpose : Make the profile auto-creation BULLETPROOF. If the
--           insert fails for any reason (schema drift, RLS edge
--           case, unique-violation race, bad meta_data), the
--           trigger must NEVER fail the auth.users insert — users
--           would see "Database error saving new user".
--
--           - Wraps the insert in an EXCEPTION block so any error
--             is swallowed with a warning instead of aborting
--             the transaction.
--           - Explicitly casts every value (handles weird JSON).
--           - ON CONFLICT updates email / full_name / avatar_url
--             so Google-OAuth users who signed up via email first
--             get their Google metadata merged in.
--           - Guarantees locked_sections starts as an empty array
--             so new merchants see every section UNLOCKED.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
  v_avatar    TEXT;
BEGIN
  -- Resolve display name from whatever metadata the provider gave us
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(COALESCE(NEW.email, ''), '@', 1),
    'User'
  );

  v_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture'
  );

  BEGIN
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      avatar_url,
      plan,
      features,
      locked_sections,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      v_full_name,
      v_avatar,
      'Starter',
      '{"crm":true,"orders":true,"support":true,"chatbot":false,"analytics":false}'::jsonb,
      '[]'::jsonb,       -- ALL sections UNLOCKED by default (jsonb array)
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
      SET email      = EXCLUDED.email,
          full_name  = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
          avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
          updated_at = NOW();
  EXCEPTION WHEN OTHERS THEN
    -- NEVER block signup. Log it and move on — the user can still
    -- authenticate; the admin panel will show them once the
    -- profile row is created on next login / via a manual backfill.
    RAISE WARNING 'handle_new_user failed for %: % (%)',
      NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$$;

-- Recreate the trigger to pick up the new function body
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Safety net: backfill any auth.users that somehow don't have a profile row.
-- This fixes historical users who hit the old broken trigger.
INSERT INTO public.profiles (id, email, full_name, plan, features, locked_sections, created_at, updated_at)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email,'@',1), 'User'),
  'Starter',
  '{"crm":true,"orders":true,"support":true,"chatbot":false,"analytics":false}'::jsonb,
  '[]'::jsonb,
  NOW(),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Also clear any existing merchants' locks so "unlock all" sticks.
-- (Safe: resets to fully-unlocked state.)
UPDATE public.profiles
   SET locked_sections = '[]'::jsonb,
       updated_at      = NOW()
 WHERE locked_sections IS NULL
    OR locked_sections = 'null'::jsonb;
