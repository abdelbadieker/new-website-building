'use client';

export default function LogoutButton() {
  const handleLogout = async () => {
    console.log('Initiating logout...');
    try {
      // Force cookie clear via API
  const handleLogout = () => {
    // 1. Clear all storage levels
    localStorage.clear();
    sessionStorage.clear();
    
    // 2. Clear common auth cookies manually just in case
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // 3. Hardware redirect to login to bypass any Next.js client routing cache
    window.location.replace('/login');
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
