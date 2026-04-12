'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <>
        <div style={{ width: 70, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ width: 90, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.05)' }} />
      </>
    );
  }

  if (user) {
    return (
      <>
        <Link href="/overview" className="bgh">Dashboard</Link>
        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            setUser(null);
            router.push('/');
            router.refresh();
          }}
          className="bpc"
          style={{ cursor: 'pointer' }}
        >
          Log Out
        </button>
      </>
    );
  }

  return (
    <>
      <Link href="/login" className="bgh">Sign In</Link>
      <Link href="/register" className="bpc">Try It Now →</Link>
    </>
  );
}
