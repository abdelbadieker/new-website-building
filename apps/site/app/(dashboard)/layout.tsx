import Link from 'next/link';
import { ReactNode } from 'react';

const navItems = [
  { name: 'Overview', href: '/overview', icon: '📊' },
  { name: 'Orders', href: '/orders', icon: '📦' },
  { name: 'Products', href: '/products', icon: '🛍️' },
  { name: 'CRM', href: '/crm', icon: '👥' },
  { name: 'Ecotrack', href: '/ecotrack', icon: '📍' },
  { name: 'Fulfillment', href: '/fulfillment', icon: '📬' },
  { name: 'AI Chatbot', href: '/ai-chatbot', icon: '🤖' },
  { name: 'Creative Studio', href: '/creative-studio', icon: '🎬' },
  { name: 'Web Creation', href: '/web-creation', icon: '🌐' },
  { name: 'E-Store', href: '/estore', icon: '🏪' },
  { name: 'Analytics', href: '/analytics', icon: '📈' },
  { name: 'Billing', href: '/billing', icon: '💳' },
  { name: 'Support', href: '/support', icon: '💬' },
];

export default function MerchantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="text-xl font-bold text-blue-900">
            EcoMate
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <span>{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              M
            </div>
            <div>
              <div className="text-sm font-medium">Merchant Setup</div>
              <div className="text-xs text-emerald-600">Starter Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2">
             <span className="text-slate-400">🔍</span>
             <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none ml-2 text-sm" />
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              🔔
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </button>
            <button className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
              Log out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
