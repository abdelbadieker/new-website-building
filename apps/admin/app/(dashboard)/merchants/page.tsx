'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type Customer = { id: string; name: string; email: string; phone: string; city: string; total_orders: number; total_spent: number; created_at: string };

export default function MerchantsPage() {
  const supabase = createClient();
  const [merchants, setMerchants] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('customers').select('*').order('total_spent', { ascending: false }).then(({ data }) => { setMerchants(data || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-[3px] border-slate-700 border-t-emerald-400 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold">Merchants & Users</h2><p className="text-slate-400 text-sm mt-1">{merchants.length} registered users</p></div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0A1628] p-5 rounded-xl border border-slate-800"><div className="text-xs text-slate-400 uppercase tracking-wider">Total Users</div><div className="text-3xl font-bold mt-2">{merchants.length}</div></div>
        <div className="bg-[#0A1628] p-5 rounded-xl border border-slate-800"><div className="text-xs text-slate-400 uppercase tracking-wider">Total Revenue</div><div className="text-3xl font-bold mt-2 text-emerald-400">DA {merchants.reduce((a, b) => a + (b.total_spent || 0), 0).toLocaleString()}</div></div>
        <div className="bg-[#0A1628] p-5 rounded-xl border border-slate-800"><div className="text-xs text-slate-400 uppercase tracking-wider">Avg. Orders/User</div><div className="text-3xl font-bold mt-2 text-blue-400">{merchants.length > 0 ? Math.round(merchants.reduce((a, b) => a + (b.total_orders || 0), 0) / merchants.length) : 0}</div></div>
      </div>

      <div className="bg-[#0A1628] rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-slate-800 text-slate-400 text-xs">
            <th className="px-5 py-3 font-medium">User</th><th className="px-5 py-3 font-medium">Phone</th><th className="px-5 py-3 font-medium">City</th><th className="px-5 py-3 font-medium text-right">Orders</th><th className="px-5 py-3 font-medium text-right">Total Spent</th><th className="px-5 py-3 font-medium text-right">Joined</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-800/50">
            {merchants.map(m => (
              <tr key={m.id} className="hover:bg-slate-800/30">
                <td className="px-5 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">{m.name?.charAt(0)}</div><div><div className="text-white font-medium">{m.name}</div><div className="text-xs text-slate-500">{m.email}</div></div></div></td>
                <td className="px-5 py-3 text-slate-300">{m.phone}</td>
                <td className="px-5 py-3 text-slate-300">{m.city}</td>
                <td className="px-5 py-3 text-right text-white font-bold">{m.total_orders}</td>
                <td className="px-5 py-3 text-right text-emerald-400 font-bold">DA {m.total_spent?.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-slate-400 text-xs">{new Date(m.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
