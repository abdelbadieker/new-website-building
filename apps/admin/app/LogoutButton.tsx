'use client';

import { createBrowserClient } from '@supabase/ssr';

export default function LogoutButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    // 1. Properly revoke session server-side
    await supabase.auth.signOut();

    // 2. Clear all storage levels aggressively
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      // 3. Clear common auth cookies manually as a fallback
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // 4. Hardware redirect to login to bypass Next.js client routing cache
      window.location.replace('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-300 rounded-lg text-sm font-medium transition-all border border-slate-700 hover:border-red-500/30"
    >
      Sign Out
    </button>
  );
}
