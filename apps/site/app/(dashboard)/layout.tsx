'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, MapPin, 
  Mail, Sparkles, Paintbrush, Globe, Store, 
  PieChart, CreditCard, HelpCircle, Search, Bell, LogOut,
  ChevronRight, ChevronDown, Menu, X, User, Lock
} from 'lucide-react';
import SectionLock from '@/components/SectionLock';

const navItems = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard, feature: 'overview' },
  { name: 'Orders', href: '/orders', icon: ShoppingBag, feature: 'orders' },
  { name: 'Products', href: '/products', icon: Package, feature: 'products' },
  { name: 'CRM', href: '/crm', icon: Users, feature: 'crm' },
  { name: 'Ecotrack', href: '/ecotrack', icon: MapPin, feature: 'ecotrack' },
  { name: 'Fulfillment', href: '/fulfillment', icon: Mail, feature: 'fulfillment' },
  { name: 'AI Chatbot', href: '/ai-chatbot', icon: Sparkles, feature: 'chatbot' },
  { name: 'Creative Studio', href: '/creative-studio', icon: Paintbrush, feature: 'creative' },
  { name: 'Web Creation', href: '/web-creation', icon: Globe, feature: 'web' },
  { name: 'E-Store', href: '/estore', icon: Store, feature: 'estore' },
  { name: 'Analytics', href: '/analytics', icon: PieChart, feature: 'analytics' },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Support', href: '/support', icon: HelpCircle },
];

type Notif = { id: string; title: string; desc: string; time: string };

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MerchantLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotif, setShowNotif] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [navOpen, setNavOpen] = useState(true);
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [userPlan, setUserPlan] = useState('Free');
  const [lockedSections, setLockedSections] = useState<string[]>([]);

  useEffect(() => {
    const supabase = createClient();

    // Fetch user and check ban status
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, is_banned, features, plan, locked_sections')
          .eq('id', data.user.id)
          .single();
        
        if (profile?.features) setFeatures(profile.features);
        if (profile?.plan) setUserPlan(profile.plan);
        if (profile?.locked_sections) setLockedSections(profile.locked_sections);

        if (profile?.is_banned) {
          alert('Your account has been restricted by the administrator.');
          await supabase.auth.signOut();
          window.location.href = '/';
          return;
        }

        const meta = data.user.user_metadata;
        const name = profile?.full_name || meta?.full_name || meta?.name || data.user.email?.split('@')[0] || 'User';
        setUserName(name);
        setUserEmail(data.user.email || '');
      }
    });

    // Fetch notifications
    const fetchNotifs = async () => {
      const items: Notif[] = [];
      const { data: orders } = await supabase.from('orders').select('id, customer_name, tracking_code, total, created_at').order('created_at', { ascending: false }).limit(3);
      if (orders) orders.forEach(o => items.push({ id: 'order-' + o.id, title: 'Order from ' + o.customer_name, desc: `${o.tracking_code} — DA ${o.total?.toLocaleString()}`, time: timeAgo(o.created_at) }));
      const { data: lowStock } = await supabase.from('products').select('id, name, stock').lt('stock', 20).order('stock', { ascending: true }).limit(2);
      if (lowStock) lowStock.forEach(p => items.push({ id: 'stock-' + p.id, title: 'Low stock alert', desc: `${p.name} — ${p.stock} units left`, time: 'Now' }));
      const { data: tickets } = await supabase.from('support_tickets').select('id, subject, created_at').eq('status', 'Open').order('created_at', { ascending: false }).limit(2);
      if (tickets) tickets.forEach(t => items.push({ id: 'ticket-' + t.id, title: 'Open ticket', desc: t.subject, time: timeAgo(t.created_at) }));
      setNotifications(items);
    };
    fetchNotifs();
  }, []);

  const planDefaultsByTier: Record<string, string[]> = {
    'Free': ['overview', 'support'],
    'Pro': ['overview', 'orders', 'products', 'crm', 'analytics', 'support'],
    'Growth': ['overview', 'orders', 'products', 'crm', 'analytics', 'web', 'estore', 'support'],
    'Enterprise': ['overview', 'orders', 'products', 'crm', 'ecotrack', 'fulfillment', 'chatbot', 'creative', 'web', 'estore', 'analytics', 'support']
  };
  const isFeatureEnabled = (featureKey?: string) => {
    if (!featureKey) return true;

    // 1. Check Global Admin Lock (Highest Priority - Master Override)
    if (lockedSections.includes(featureKey)) return false;

    // 2. Check Plan Basics
    if (['overview', 'support', 'billing'].includes(featureKey)) return true;
    
    // 3. Check custom overrides from Admin Hub (Deprecated but preserved for compatibility)
    if (features[featureKey] === true) return true;
    if (features[featureKey] === false) return false;
    
    // 4. Check Plan Defaults
    const defaults = planDefaultsByTier[userPlan || 'Free'] || planDefaultsByTier['Free'];
    return defaults.includes(featureKey);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

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
          <Link href="/" style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(90deg, #34d399, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none', letterSpacing: '-0.5px' }}>
            EcoMate
          </Link>
        </div>

        {/* User Profile + Nav + Logout — all scroll together */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          {/* User Section Header */}
          <button
            onClick={() => setNavOpen(!navOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 12,
              background: 'rgba(52,211,153,0.06)',
              border: '1px solid rgba(52,211,153,0.12)',
              cursor: 'pointer', width: '100%', textAlign: 'left',
              marginBottom: 8,
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e293b, #334155)',
              border: '2px solid rgba(52,211,153,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <User style={{ width: 18, height: 18, color: '#34d399' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userName || 'Loading...'}
              </div>
              <div style={{ fontSize: 10, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userEmail}
              </div>
            </div>
            <ChevronDown style={{
              width: 16, height: 16, color: '#64748b', flexShrink: 0,
              transform: navOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.2s',
            }} />
          </button>

          {/* Nav Items */}
            {navOpen && navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const isLocked = !isFeatureEnabled(item.feature);

              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '9px 14px',
                    paddingLeft: 24,
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#34d399' : isLocked ? '#475569' : '#94a3b8',
                    background: isActive ? 'rgba(59,130,246,0.08)' : 'transparent',
                    border: isActive ? '1px solid rgba(59,130,246,0.15)' : '1px solid transparent',
                    transition: 'all 0.2s',
                    opacity: isLocked ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive && !isLocked) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = '#e2e8f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive && !isLocked) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#94a3b8';
                    }
                  }}
                >
                  <Icon style={{ width: 16, height: 16, color: isActive ? '#34d399' : isLocked ? '#1e293b' : '#64748b' }} />
                  <span>{item.name}</span>
                  {isLocked && <Lock style={{ width: 12, height: 12, marginLeft: 'auto', color: '#475569' }} />}
                  {!isLocked && isActive && <ChevronRight style={{ width: 14, height: 14, marginLeft: 'auto', opacity: 0.5 }} />}
                </Link>
              );
            })}

          {/* Logout — directly after nav items */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(51,65,85,0.4)' }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '10px 14px', borderRadius: 10, border: 'none',
                background: 'rgba(239,68,68,0.06)',
                color: '#f87171', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
            >
              <LogOut style={{ width: 16, height: 16 }} />
              <span>Log Out</span>
            </button>
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
                style={{ position: 'relative', color: '#94a3b8', background: showNotif ? 'rgba(51,65,85,0.4)' : 'none', border: 'none', padding: 8, borderRadius: 999, transition: 'all 0.2s', cursor: 'pointer' }}
              >
                <Bell style={{ width: 20, height: 20 }} />
                {notifications.length > 0 && <span style={{ position: 'absolute', top: 6, right: 7, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.7)' }} />}
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
                  {notifications.length === 0 ? (
                    <div style={{ padding: '28px 18px', textAlign: 'center', color: '#475569', fontSize: 13 }}>No new notifications</div>
                  ) : notifications.map((n) => (
                    <div key={n.id} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(51,65,85,0.2)', display: 'flex', gap: 12, alignItems: 'flex-start', background: 'rgba(59,130,246,0.04)', transition: 'background 0.2s' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', marginTop: 6, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{n.desc}</div>
                        <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ width: 1, height: 24, background: '#1e293b' }} />

            {/* User info in topbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #1e293b, #334155)', border: '1px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{userName?.charAt(0)?.toUpperCase() || 'U'}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{userName}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            {(() => {
              const currentItem = navItems.find(item => item.href === pathname);
              if (currentItem?.feature && !isFeatureEnabled(currentItem.feature)) {
                return <SectionLock title={currentItem.name} />;
              }
              return children;
            })()}
          </div>
        </main>
      </div>
    </div>
  );
}
