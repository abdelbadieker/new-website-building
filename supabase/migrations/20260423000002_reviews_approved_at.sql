-- Add approved_at timestamp to reviews for audit/sorting of approvals.
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Backfill existing approved rows with their creation date.
UPDATE public.reviews
  SET approved_at = COALESCE(approved_at, created_at)
  WHERE is_approved = true AND approved_at IS NULL;
