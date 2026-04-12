'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BarChart3, Package, Users, ShoppingBag, ArrowUpRight, DollarSign, HelpCircle, Activity } from 'lucide-react';

export default function OverviewPage() {
  const supabase = createClient();
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, customers: 0, openTickets: 0, recentOrders: [] as { customer_name: string; total: number; status: string; tracking_code: string }[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      const [o, p, c, t] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('id'),
        supabase.from('customers').select('id'),
        supabase.from('support_tickets').select('id').eq('status', 'Open'),
      ]);
      const orders = o.data || [];
      const rev = orders.reduce((a: number, b: { total: number }) => a + (b.total || 0), 0);
      setStats({ revenue: rev, orders: orders.length, products: (p.data || []).length, customers: (c.data || []).length, openTickets: (t.data || []).length, recentOrders: orders.slice(0, 5) });
      setLoading(false);
    };
    fetch_();
  }, []);

  const s = { card: { background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 16, padding: 20 } as React.CSSProperties };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div style={{ width: 32, height: 32, border: '3px solid #1e293b', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;

  const kpis = [
    { title: 'Total Revenue', value: `DA ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: '#34d399' },
    { title: 'Orders', value: String(stats.orders), icon: ShoppingBag, color: '#60a5fa' },
    { title: 'Products', value: String(stats.products), icon: Package, color: '#a78bfa' },
    { title: 'Customers', value: String(stats.customers), icon: Users, color: '#fbbf24' },
  ];

  const statusColors: Record<string, string> = { Processing: '#fbbf24', Confirmed: '#60a5fa', Shipped: '#a78bfa', Delivered: '#34d399', Cancelled: '#f87171' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div><h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>Dashboard Overview</h1><p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Here&apos;s what&apos;s happening with your store today</p></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.title} style={{ ...s.card, transition: 'transform 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${k.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon style={{ width: 22, height: 22, color: k.color }} /></div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 700, color: '#34d399' }}><ArrowUpRight style={{ width: 12, height: 12 }} />Live</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{k.title}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', letterSpacing: -0.5 }}>{k.value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>Recent Orders</h2>
            <span style={{ fontSize: 12, color: '#34d399', fontWeight: 600 }}>View All →</span>
          </div>
          {stats.recentOrders.map((o, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < stats.recentOrders.length - 1 ? '1px solid rgba(51,65,85,0.3)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package style={{ width: 16, height: 16, color: '#64748b' }} /></div>
                <div><div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{o.customer_name}</div><div style={{ fontSize: 11, color: '#64748b' }}>{o.tracking_code}</div></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#34d399' }}>DA {o.total?.toLocaleString()}</div>
                <span style={{ padding: '2px 8px', borderRadius: 999, background: `${statusColors[o.status] || '#60a5fa'}15`, color: statusColors[o.status] || '#60a5fa', fontSize: 10, fontWeight: 600 }}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={s.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}><Activity style={{ width: 18, height: 18, color: '#a78bfa' }} /><span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>Quick Stats</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: '#94a3b8' }}>Open Tickets</span><span style={{ fontWeight: 700, color: stats.openTickets > 0 ? '#fbbf24' : '#34d399' }}>{stats.openTickets}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: '#94a3b8' }}>Avg. Order Value</span><span style={{ fontWeight: 700, color: '#e2e8f0' }}>DA {stats.orders > 0 ? Math.round(stats.revenue / stats.orders).toLocaleString() : 0}</span></div>
            </div>
          </div>
          <div style={{ ...s.card, background: 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(59,130,246,0.08))' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#34d399', marginBottom: 6 }}>🚀 Tip of the Day</div>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>Add product descriptions to boost your conversion rate by up to 30%!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
