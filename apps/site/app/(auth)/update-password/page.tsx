"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function UpdatePassword() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Note: Supabase implicitly extracts the access_token from the hash fragment
  // upon hitting this callback and logs the user in if the token is valid.

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      // Wait shortly then redirect them to login
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundColor: 'var(--bg-body)' }}>
        <div className="noise"></div>
        <div className="max-w-md w-full p-8 rounded-2xl relative z-10 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-c)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
           <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-emerald-500">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
           </div>
           <h2 className="text-2xl font-bold text-white mb-2">Password Updated</h2>
           <p style={{ color: 'var(--text-sub)' }}>Your password has been changed successfully. Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundColor: 'var(--bg-body)' }}>
      <div className="noise"></div>
      <div className="max-w-md w-full p-8 rounded-2xl relative z-10" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-c)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent inline-block" style={{ backgroundImage: 'linear-gradient(135deg, var(--s), var(--g))' }}>
              EcoMate
            </h1>
          </Link>
          <p className="mt-2" style={{ color: 'var(--text-sub)' }}>Create a new password</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleUpdate}>
          {error && <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-sub)' }}>New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-1 transition-all"
                style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-c)', color: 'var(--text-main)' }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-all"
                style={{ color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg font-medium transition-all shadow-md mt-6 flex justify-center items-center gap-2"
            style={{ backgroundImage: 'linear-gradient(135deg, var(--s), #1d4ed8)', color: 'white', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
