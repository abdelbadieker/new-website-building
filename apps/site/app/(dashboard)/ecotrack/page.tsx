'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Package, Truck, CheckCircle, Clock, Search } from 'lucide-react';

type Order = { id: string; customer_name: string; status: string; total: number; city: string; tracking_code: string; created_at: string };

const statusSteps = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];

export default function EcotrackPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => { setOrders(data || []); setLoading(false); });
  }, [supabase]);

  const filtered = orders.filter(o => o.tracking_code?.toLowerCase().includes(search.toLowerCase()) || o.customer_name?.toLowerCase().includes(search.toLowerCase()));
  const s = { card: { background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 16, padding: 20 } as React.CSSProperties };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div style={{ width: 32, height: 32, border: '3px solid #1e293b', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div><h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>Ecotrack — Delivery Tracking</h1><p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Track orders across all 58 wilayas</p></div>

      <div style={{ display: 'flex', alignItems: 'center', ...s.card, padding: '10px 16px', gap: 10 }}>
        <Search style={{ width: 16, height: 16, color: '#64748b' }} />
        <input placeholder="Search by tracking code or customer..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', background: 'transparent', border: 'none', color: '#e2e8f0', fontSize: 13, outline: 'none' }} />
      </div>

      {selected && (
        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div><h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{selected.tracking_code}</h2><div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{selected.customer_name} • {selected.city}</div></div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 20 }}>×</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
            {statusSteps.map((step, i) => {
              const currentIdx = statusSteps.indexOf(selected.status);
              const reached = i <= currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  {i > 0 && <div style={{ position: 'absolute', top: 16, right: '50%', width: '100%', height: 3, background: reached ? '#34d399' : '#1e293b', zIndex: 0 }} />}
                  <div style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, background: reached ? (isCurrent ? 'linear-gradient(135deg, #34d399, #059669)' : '#34d399') : '#1e293b', border: reached ? '2px solid #34d399' : '2px solid #334155', boxShadow: isCurrent ? '0 0 16px rgba(52,211,153,0.5)' : 'none' }}>
                    {step === 'Processing' && <Clock style={{ width: 16, height: 16, color: reached ? '#fff' : '#475569' }} />}
                    {step === 'Confirmed' && <CheckCircle style={{ width: 16, height: 16, color: reached ? '#fff' : '#475569' }} />}
                    {step === 'Shipped' && <Truck style={{ width: 16, height: 16, color: reached ? '#fff' : '#475569' }} />}
                    {step === 'Delivered' && <Package style={{ width: 16, height: 16, color: reached ? '#fff' : '#475569' }} />}
                  </div>
                  <span style={{ fontSize: 11, color: reached ? '#34d399' : '#64748b', marginTop: 8, fontWeight: 600 }}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(o => (
          <div key={o.id} onClick={() => setSelected(o)} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, transition: 'border-color 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ padding: 10, borderRadius: 10, background: 'rgba(52,211,153,0.1)' }}><MapPin style={{ width: 18, height: 18, color: '#34d399' }} /></div>
              <div><div style={{ fontSize: 14, fontWeight: 700, color: '#60a5fa' }}>{o.tracking_code}</div><div style={{ fontSize: 12, color: '#94a3b8' }}>{o.customer_name}</div></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{o.city}</span>
              <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: o.status === 'Delivered' ? 'rgba(52,211,153,0.1)' : o.status === 'Shipped' ? 'rgba(139,92,246,0.1)' : 'rgba(251,191,36,0.1)', color: o.status === 'Delivered' ? '#34d399' : o.status === 'Shipped' ? '#a78bfa' : '#fbbf24' }}>{o.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
