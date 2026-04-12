'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, customers: 0, openTickets: 0, recentOrders: [] as { customer_name: string; total: number; status: string; tracking_code: string; created_at: string }[] });
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
      setStats({ orders: orders.length, revenue: orders.reduce((a: number, b: { total: number }) => a + (b.total || 0), 0), products: (p.data || []).length, customers: (c.data || []).length, openTickets: (t.data || []).length, recentOrders: orders.slice(0, 6) });
      setLoading(false);
    };
    fetch_();
  }, []);

  const statusColors: Record<string, string> = { Processing: '#fbbf24', Confirmed: '#60a5fa', Shipped: '#a78bfa', Delivered: '#34d399', Cancelled: '#f87171' };

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-[3px] border-slate-700 border-t-emerald-400 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Platform Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Revenue', value: `DA ${stats.revenue.toLocaleString()}`, color: 'emerald' },
          { label: 'Orders', value: stats.orders, color: 'blue' },
          { label: 'Products', value: stats.products, color: 'purple' },
          { label: 'Customers', value: stats.customers, color: 'amber' },
          { label: 'Open Tickets', value: stats.openTickets, color: 'red' },
        ].map(k => (
          <div key={k.label} className="bg-[#0A1628] p-5 rounded-xl border border-slate-800">
            <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">{k.label}</h3>
            <p className="text-2xl font-bold text-white mt-2">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0A1628] rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-semibold text-lg">Recent Orders</h3>
          <span className="text-xs text-emerald-400 font-semibold">Live from database</span>
        </div>
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-slate-800 text-slate-400 text-xs">
            <th className="px-6 py-3 font-medium">Tracking</th>
            <th className="px-6 py-3 font-medium">Customer</th>
            <th className="px-6 py-3 font-medium text-right">Total</th>
            <th className="px-6 py-3 font-medium text-center">Status</th>
            <th className="px-6 py-3 font-medium text-right">Date</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-800/50">
            {stats.recentOrders.map((o, i) => (
              <tr key={i} className="hover:bg-slate-800/30">
                <td className="px-6 py-3 text-blue-400 font-medium">{o.tracking_code}</td>
                <td className="px-6 py-3 text-white font-medium">{o.customer_name}</td>
                <td className="px-6 py-3 text-right text-emerald-400 font-bold">DA {o.total?.toLocaleString()}</td>
                <td className="px-6 py-3 text-center"><span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${statusColors[o.status]}15`, color: statusColors[o.status] }}>{o.status}</span></td>
                <td className="px-6 py-3 text-right text-slate-400">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
