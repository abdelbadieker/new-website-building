'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type Order = { id: string; customer_name: string; customer_email: string; customer_phone: string; status: string; total: number; city: string; address: string; tracking_code: string; created_at: string };
const statuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
const statusColors: Record<string, string> = { Processing: '#fbbf24', Confirmed: '#60a5fa', Shipped: '#a78bfa', Delivered: '#34d399', Cancelled: '#f87171' };

export default function FulfillmentEngine() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = async () => { const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }); setOrders(data || []); setLoading(false); };
  useEffect(() => { fetch_(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    await supabase.from('activity_logs').insert({ action: `Order status updated to ${status}`, entity_type: 'order', entity_id: id });
    fetch_();
  };

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-[3px] border-slate-700 border-t-emerald-400 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold">Fulfillment Engine</h2><p className="text-slate-400 text-sm mt-1">Manage order statuses and shipping pipeline</p></div>
      
      <div className="grid grid-cols-5 gap-3">
        {statuses.map(s => (
          <div key={s} className="bg-[#0A1628] p-4 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl font-bold" style={{ color: statusColors[s] }}>{orders.filter(o => o.status === s).length}</div>
            <div className="text-xs text-slate-400 mt-1">{s}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#0A1628] rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-slate-800 text-slate-400 text-xs">
            <th className="px-5 py-3 font-medium">Tracking</th>
            <th className="px-5 py-3 font-medium">Customer</th>
            <th className="px-5 py-3 font-medium">City</th>
            <th className="px-5 py-3 font-medium text-right">Total</th>
            <th className="px-5 py-3 font-medium text-center">Status</th>
            <th className="px-5 py-3 font-medium text-center">Update</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-800/50">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-slate-800/30">
                <td className="px-5 py-3 text-blue-400 font-semibold">{o.tracking_code}</td>
                <td className="px-5 py-3"><div className="text-white font-medium">{o.customer_name}</div><div className="text-xs text-slate-500">{o.customer_email}</div></td>
                <td className="px-5 py-3 text-slate-300">{o.city}</td>
                <td className="px-5 py-3 text-right text-emerald-400 font-bold">DA {o.total?.toLocaleString()}</td>
                <td className="px-5 py-3 text-center"><span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${statusColors[o.status]}15`, color: statusColors[o.status] }}>{o.status}</span></td>
                <td className="px-5 py-3 text-center">
                  <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="bg-[#07101F] border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs outline-none">
                    {statuses.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
