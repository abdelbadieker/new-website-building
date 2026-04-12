'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

export default function DataExport() {
  const supabase = createClient();
  const [counts, setCounts] = useState({ products: 0, orders: 0, customers: 0, reviews: 0, tickets: 0, logs: 0 });
  const [exporting, setExporting] = useState('');

  useEffect(() => {
    const f = async () => {
      const [p, o, c, r, t, l] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('support_tickets').select('id', { count: 'exact', head: true }),
        supabase.from('activity_logs').select('id', { count: 'exact', head: true }),
      ]);
      setCounts({ products: p.count || 0, orders: o.count || 0, customers: c.count || 0, reviews: r.count || 0, tickets: t.count || 0, logs: l.count || 0 });
    };
    f();
  }, []);

  const exportTable = async (table: string) => {
    setExporting(table);
    const { data } = await supabase.from(table).select('*');
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${table}_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click(); URL.revokeObjectURL(url);
    }
    setExporting('');
  };

  const tables = [
    { key: 'products', label: 'Products', count: counts.products, icon: '📦' },
    { key: 'orders', label: 'Orders', count: counts.orders, icon: '🛒' },
    { key: 'customers', label: 'Customers', count: counts.customers, icon: '👥' },
    { key: 'reviews', label: 'Reviews', count: counts.reviews, icon: '⭐' },
    { key: 'support_tickets', label: 'Support Tickets', count: counts.tickets, icon: '🎫' },
    { key: 'activity_logs', label: 'Activity Logs', count: counts.logs, icon: '📜' },
  ];

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold">Data Export</h2><p className="text-slate-400 text-sm mt-1">Export your platform data as JSON files</p></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tables.map(t => (
          <div key={t.key} className="bg-[#0A1628] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl">{t.icon}</span>
              <div><div className="text-white font-semibold">{t.label}</div><div className="text-xs text-slate-400">{t.count} records</div></div>
            </div>
            <button onClick={() => exportTable(t.key)} disabled={exporting === t.key} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-colors">
              {exporting === t.key ? 'Exporting...' : 'Export JSON'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
