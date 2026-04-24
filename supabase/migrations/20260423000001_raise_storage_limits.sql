-- Raise Supabase Storage bucket size limits from 5 MB to 100 MB
-- and widen allowed MIME types where appropriate.
--
-- Safe to run repeatedly: uses ON CONFLICT so it upserts the bucket if missing
-- and updates the limit if already present.

-- ── products bucket (raised to 100 MB) ──────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  104857600, -- 100 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ── creative-briefs bucket (raised to 100 MB, accepts docs + media) ─────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'creative-briefs',
  'creative-briefs',
  true,
  104857600, -- 100 MB
  ARRAY[
    'image/jpeg','image/png','image/webp','image/gif',
    'application/pdf',
    'video/mp4','video/webm'
  ]
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ── generic uploads bucket (100 MB, no MIME restriction) ───────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads',
  true,
  104857600,
  NULL
)
ON CONFLICT (id) DO UPDATE
  SET file_size_limit = GREATEST(storage.buckets.file_size_limit, 104857600);
