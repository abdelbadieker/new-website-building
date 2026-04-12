'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BarChart3, TrendingUp, Package, Users, ShoppingBag, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  const supabase = createClient();
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0, ordersByStatus: {} as Record<string, number> });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('products').select('*'),
        supabase.from('customers').select('*'),
      ]);
      const orders = ordersRes.data || [];
      const statusCounts: Record<string, number> = {};
      let revenue = 0;
      orders.forEach(o => { revenue += o.total || 0; statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
      setStats({ totalRevenue: revenue, totalOrders: orders.length, totalProducts: (productsRes.data || []).length, totalCustomers: (customersRes.data || []).length, ordersByStatus: statusCounts });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const kpis = [
    { title: 'Total Revenue', value: `DA ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#34d399', trend: '+12.5%', up: true },
    { title: 'Total Orders', value: String(stats.totalOrders), icon: ShoppingBag, color: '#60a5fa', trend: '+8.2%', up: true },
    { title: 'Products', value: String(stats.totalProducts), icon: Package, color: '#a78bfa', trend: '+3.1%', up: true },
    { title: 'Customers', value: String(stats.totalCustomers), icon: Users, color: '#fbbf24', trend: '+15.4%', up: true },
  ];

  const s = { card: { background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 16, padding: 20 } as React.CSSProperties };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div style={{ width: 32, height: 32, border: '3px solid #1e293b', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div><h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>Analytics</h1><p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Real-time insights from your store data</p></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.title} style={{ ...s.card, transition: 'transform 0.2s, border-color 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${k.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon style={{ width: 22, height: 22, color: k.color }} /></div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: k.up ? '#34d399' : '#f87171' }}>
                  {k.up ? <ArrowUpRight style={{ width: 14, height: 14 }} /> : <ArrowDownRight style={{ width: 14, height: 14 }} />}{k.trend}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{k.title}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#f1f5f9', letterSpacing: -1 }}>{k.value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={s.card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Revenue Breakdown</h2>
          <div style={{ display: 'flex', gap: 8, height: 200, alignItems: 'flex-end' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const h = [65, 40, 80, 55, 90, 70, 45][i];
              return (
                <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: '100%', height: `${h}%`, background: 'linear-gradient(180deg, #34d399, #059669)', borderRadius: 6, minHeight: 10, transition: 'height 0.5s ease' }} />
                  <span style={{ fontSize: 11, color: '#64748b' }}>{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={s.card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Orders by Status</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(stats.ordersByStatus).map(([status, count]) => {
              const colors: Record<string, string> = { Processing: '#fbbf24', Confirmed: '#60a5fa', Shipped: '#a78bfa', Delivered: '#34d399', Cancelled: '#f87171' };
              const pct = stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0;
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: '#94a3b8' }}>{status}</span>
                    <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{count}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(30,41,59,0.8)', borderRadius: 999 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: colors[status] || '#60a5fa', borderRadius: 999, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
