-- ============================================================
-- Migration: handle_new_user trigger
-- Purpose : Auto-create a profile row whenever a new user signs
--           up via Supabase Auth (email/password or Google OAuth).
--           This ensures every merchant immediately appears in
--           the admin panel after registration — no manual step.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    ),
    'Starter',                   -- default plan
    '{"crm":true,"orders":true,"support":true,"chatbot":false,"analytics":false}'::jsonb,
    ARRAY[]::text[],             -- no locked sections by default
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;  -- safe to re-run; won't overwrite existing profiles

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists, then recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
