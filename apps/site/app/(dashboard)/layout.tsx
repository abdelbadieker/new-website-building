'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, MapPin, 
  Mail, Sparkles, Paintbrush, Globe, Store, 
  PieChart, CreditCard, HelpCircle, Search, Bell, LogOut 
} from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'Orders', href: '/orders', icon: ShoppingBag },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'CRM', href: '/crm', icon: Users },
  { name: 'Ecotrack', href: '/ecotrack', icon: MapPin },
  { name: 'Fulfillment', href: '/fulfillment', icon: Mail },
  { name: 'AI Chatbot', href: '/ai-chatbot', icon: Sparkles },
  { name: 'Creative Studio', href: '/creative-studio', icon: Paintbrush },
  { name: 'Web Creation', href: '/web-creation', icon: Globe },
  { name: 'E-Store', href: '/estore', icon: Store },
  { name: 'Analytics', href: '/analytics', icon: PieChart },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Support', href: '/support', icon: HelpCircle },
];

export default function MerchantLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#07101F] overflow-hidden text-slate-200">
      {/* Sidebar: Glassmorphism Dark Mode */}
      <aside className="w-64 flex-shrink-0 bg-[#0A1628]/70 backdrop-blur-xl border-r border-slate-800/60 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <div className="h-20 flex items-center px-6 border-b border-slate-800/60">
          <Link href="/overview" className="text-2xl flex items-center gap-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500 tracking-tight cursor-none relative z-50 hover:opacity-80 transition-opacity">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white text-lg">E</span>
            </span>
            EcoMate
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-300 group cursor-none relative z-50 ${
                  isActive 
                    ? 'bg-blue-500/10 text-emerald-400 border border-blue-500/20 shadow-[inset_0px_1px_4px_rgba(255,255,255,0.05)]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="text-sm font-medium tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Merchant Profile Box */}
        <div className="p-4 m-4 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center shadow-inner">
              <span className="text-sm font-bold text-slate-200">M</span>
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-medium text-slate-200 truncate">Merchant Setup</div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Starter Plan
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
        
        {/* Topbar: Blurry Glassmorphism */}
        <header className="h-20 flex items-center justify-between px-8 bg-[#0A1628]/40 backdrop-blur-lg border-b border-slate-800/50 sticky top-0 z-10">
          <div className="flex items-center bg-[#07101F]/80 border border-slate-800/80 rounded-full px-4 py-2.5 w-64 md:w-96 shadow-inner cursor-none group hover:border-slate-700 transition-colors">
             <Search className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
             <input type="text" placeholder="Search orders, products, customers..." className="bg-transparent border-none focus:outline-none ml-3 text-sm text-slate-200 placeholder-slate-500 w-full cursor-none" />
          </div>
          
          <div className="flex items-center space-x-5">
            <button className="relative text-slate-400 hover:text-emerald-400 transition-colors p-2 rounded-full hover:bg-slate-800/50 cursor-none">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              </span>
            </button>
            <div className="h-6 w-px bg-slate-800"></div>
            <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-red-500/10 cursor-none">
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth scrollbar-hide">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
