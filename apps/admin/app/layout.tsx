import Link from 'next/link';
import { ReactNode } from 'react';
import LogoutButton from './LogoutButton';
import { Metadata } from 'next';
import './globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'EcoMate Admin Dashboard',
  description: 'Manage your merchants and orders',
};

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Merchants', href: '/merchants', icon: '👥' },
  { name: 'User Management', href: '/users', icon: '🛡️' },
  { name: 'Creative Studio', href: '/creative-studio', icon: '🎨' },
  { name: 'Partner Links', href: '/partnerships', icon: '🔗' },
  { name: 'CRM Import', href: '/crm-import', icon: '📤' },
  { name: 'Feature Toggles', href: '/feature-toggles', icon: '⚙️' },
  { name: 'Fulfillment', href: '/fulfillment-engine', icon: '📦' },
  { name: 'Platform Contacts', href: '/platform-contacts', icon: '🏢' },
  { name: 'Chatbot Control', href: '/chatbot-control', icon: '🤖' },
  { name: 'Activity Logs', href: '/activity-logs', icon: '📜' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex h-screen bg-[#07101F] text-white overflow-hidden font-sans">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 bg-[#0A1628] border-r border-slate-800 flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                EcoMate Admin
              </span>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                  AK
                </div>
                <div>
                  <div className="text-sm font-medium">Abdelbadie</div>
                  <div className="text-xs text-slate-400">Super Admin</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Topbar */}
            <header className="h-16 flex items-center justify-between px-8 bg-[#0A1628] border-b border-slate-800">
              <div className="flex items-center gap-6">
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-black tracking-widest bg-emerald-500 text-[#07101F] px-3 py-1 rounded shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    SYNC-STABLE-V3
                  </span>
                </div>
              </div>
              <LogoutButton />
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
