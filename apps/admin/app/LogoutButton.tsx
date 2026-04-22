'use client';

import { createBrowserClient } from '@supabase/ssr';

export default function LogoutButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    try {
      // 1. Call server-side logout to clear HttpOnly admin_token cookie
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      
      // 2. Properly revoke session if Supabase was also used
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }

    // 3. Clear all storage levels aggressively
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      // 4. Hardware redirect to login
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
