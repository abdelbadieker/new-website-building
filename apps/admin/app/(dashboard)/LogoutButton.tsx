'use client';

export default function LogoutButton() {
  const handleLogout = async () => {
    console.log('Initiating logout...');
    try {
      // Force cookie clear via API
      await fetch('/api/admin/auth/logout', { method: 'POST', cache: 'no-store' });
      
      // Clear any potential client-side caches
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        // Force replace to login to ensure middleware runs
        window.location.replace('/login');
      }
    } catch (err) {
      console.error('Logout API failure, falling back to client redirect:', err);
      window.location.replace('/login');
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
