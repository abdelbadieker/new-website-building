'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, MapPin, 
  Mail, Sparkles, Paintbrush, Globe, Store, 
  PieChart, CreditCard, HelpCircle, Search, Bell, LogOut,
  ChevronRight, Menu, X
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

const sampleNotifications = [
  { id: 1, title: 'New order received', desc: 'Order #ORD-093 from Karim M.', time: '2 min ago', unread: true },
  { id: 2, title: 'Product low stock', desc: 'Wireless Earbuds — 3 units left', time: '18 min ago', unread: true },
  { id: 3, title: 'Payment confirmed', desc: 'DA 12,000 received for #ORD-091', time: '1 hour ago', unread: false },
  { id: 4, title: 'New review submitted', desc: '⭐⭐⭐⭐⭐ from Sarah B.', time: '3 hours ago', unread: false },
];

export default function MerchantLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showNotif, setShowNotif] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#07101F', overflow: 'hidden', color: '#cbd5e1', position: 'relative' }}>
      
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} 
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 260,
        flexShrink: 0,
        background: 'rgba(10,22,40,0.85)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(51,65,85,0.4)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        position: mobileOpen ? 'fixed' as const : 'relative' as const,
        top: 0,
        left: mobileOpen ? 0 : undefined,
        bottom: 0,
        transform: mobileOpen ? 'translateX(0)' : undefined,
      }}>
        {/* Logo */}
        <div style={{ height: 72, display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid rgba(51,65,85,0.4)', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #34d399, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(52,211,153,0.3)' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>E</span>
          </div>
          <Link href="/overview" style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(90deg, #34d399, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none', letterSpacing: '-0.5px' }}>
            EcoMate
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#34d399' : '#94a3b8',
                  background: isActive ? 'rgba(59,130,246,0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(59,130,246,0.15)' : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <Icon style={{ width: 18, height: 18, color: isActive ? '#34d399' : '#64748b' }} />
                <span>{item.name}</span>
                {isActive && <ChevronRight style={{ width: 14, height: 14, marginLeft: 'auto', opacity: 0.5 }} />}
              </Link>
            );
          })}
        </nav>
        
        {/* Merchant Profile */}
        <div style={{ margin: '0 16px 16px', padding: 14, borderRadius: 12, border: '1px solid rgba(51,65,85,0.5)', background: 'rgba(15,23,42,0.6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #1e293b, #334155)', border: '1px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>M</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Merchant Setup</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                Starter Plan
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Topbar */}
        <header style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', background: 'rgba(10,22,40,0.5)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(51,65,85,0.35)', position: 'sticky', top: 0, zIndex: 30 }}>
          {/* Mobile menu toggle */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none', background: 'none', border: 'none', color: '#94a3b8', padding: 4 }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
          </button>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(7,16,31,0.8)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 999, padding: '9px 16px', width: 340, maxWidth: '50vw' }}>
            <Search style={{ width: 16, height: 16, color: '#64748b', flexShrink: 0 }} />
            <input 
              type="text" 
              placeholder="Search orders, products, customers..." 
              style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: 10, fontSize: 13, color: '#e2e8f0', width: '100%' }} 
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotif(!showNotif)}
                style={{ position: 'relative', color: '#94a3b8', background: showNotif ? 'rgba(51,65,85,0.4)' : 'none', border: 'none', padding: 8, borderRadius: 999, transition: 'all 0.2s' }}
              >
                <Bell style={{ width: 20, height: 20 }} />
                <span style={{ position: 'absolute', top: 6, right: 7, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.7)' }} />
              </button>

              {/* Notification Dropdown */}
              {showNotif && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: 340,
                  background: 'rgba(10,22,40,0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(51,65,85,0.5)',
                  borderRadius: 16,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  zIndex: 100,
                  animation: 'fadeInDown 0.2s ease',
                }}>
                  <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(51,65,85,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>Notifications</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#3b82f6', cursor: 'pointer' }}>Mark all read</span>
                  </div>
                  {sampleNotifications.map((n) => (
                    <div key={n.id} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(51,65,85,0.2)', display: 'flex', gap: 12, alignItems: 'flex-start', background: n.unread ? 'rgba(59,130,246,0.04)' : 'transparent', transition: 'background 0.2s' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.unread ? '#3b82f6' : 'transparent', marginTop: 6, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{n.desc}</div>
                        <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '12px 18px', textAlign: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#34d399', cursor: 'pointer' }}>View All Notifications</span>
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ width: 1, height: 24, background: '#1e293b' }} />
            
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8', background: 'none', border: 'none', padding: '6px 12px', borderRadius: 8, transition: 'all 0.2s' }}>
              <LogOut style={{ width: 16, height: 16 }} />
              Log out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
