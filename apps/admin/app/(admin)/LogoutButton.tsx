'use client';

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      // Clear local state if any, then redirect
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
      // Fallback
      window.location.href = '/login';
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="text-sm text-slate-400 hover:text-white transition-colors"
    >
      Log out
    </button>
  );
}
