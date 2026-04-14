import { createClient } from '@supabase/supabase-js';

// This client uses the SERVICE_ROLE_KEY to bypass Row Level Security (RLS).
// IT MUST ONLY BE USED ON THE SERVER (Server Components, API Routes, Server Actions).
// NEVER expose this client or the service role key to the browser.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL or Service Role Key missing in environment variables');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
