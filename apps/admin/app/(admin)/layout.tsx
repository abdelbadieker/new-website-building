import Link from 'next/link';
import { ReactNode } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Merchants', href: '/merchants', icon: '👥' },
  { name: 'Feature Toggles', href: '/feature-toggles', icon: '⚙️' },
  { name: 'Subscriptions', href: '/subscriptions', icon: '💳' },
  { name: 'Fulfillment', href: '/fulfillment-engine', icon: '📦' },
  { name: 'Landing CMS', href: '/landing-cms', icon: '📝' },
  { name: 'Reviews', href: '/reviews', icon: '⭐' },
  { name: 'Contact Manager', href: '/contact-manager', icon: '📞' },
  { name: 'Partner Sync', href: '/partner-sync', icon: '🔗' },
  { name: 'Chatbot Control', href: '/chatbot-control', icon: '🤖' },
  { name: 'Activity Logs', href: '/activity-logs', icon: '📜' },
  { name: 'Data Export', href: '/data-export', icon: '📤' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#07101F] text-white overflow-hidden">
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
              <span>{item.icon}</span>
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
          <h1 className="text-xl font-semibold">Admin Overview</h1>
          <button className="text-sm text-slate-400 hover:text-white transition-colors">
            Log out
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
