'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ShoppingBag, Plus, Eye, X, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

type Order = { id: string; customer_name: string; customer_email: string; customer_phone: string; status: string; total: number; city: string; address: string; tracking_code: string; notes: string; created_at: string };

const statusColors: Record<string, { bg: string; text: string }> = {
  Processing: { bg: 'rgba(251,191,36,0.1)', text: '#fbbf24' },
  Confirmed: { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa' },
  Shipped: { bg: 'rgba(139,92,246,0.1)', text: '#a78bfa' },
  Delivered: { bg: 'rgba(52,211,153,0.1)', text: '#34d399' },
  Cancelled: { bg: 'rgba(239,68,68,0.1)', text: '#f87171' },
};

const statusIcons: Record<string, React.ReactNode> = {
  Processing: <Clock style={{ width: 14, height: 14 }} />,
  Confirmed: <CheckCircle style={{ width: 14, height: 14 }} />,
  Shipped: <Truck style={{ width: 14, height: 14 }} />,
  Delivered: <CheckCircle style={{ width: 14, height: 14 }} />,
  Cancelled: <XCircle style={{ width: 14, height: 14 }} />,
};

export default function OrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [form, setForm] = useState({ customer_name: '', customer_email: '', customer_phone: '', total: '', city: '', address: '', notes: '' });

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleSubmit = async () => {
    const code = 'ECO-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 999)).padStart(3, '0');
    await supabase.from('orders').insert({ ...form, total: parseFloat(form.total), tracking_code: code, status: 'Processing' });
    setForm({ customer_name: '', customer_email: '', customer_phone: '', total: '', city: '', address: '', notes: '' });
    setShowForm(false);
    fetchOrders();
  };

  const s = {
    card: { background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 16, padding: 20 } as React.CSSProperties,
    input: { width: '100%', padding: '10px 14px', background: 'rgba(7,16,31,0.8)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 10, color: '#e2e8f0', fontSize: 13, outline: 'none' } as React.CSSProperties,
    btn: { padding: '10px 20px', borderRadius: 10, border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 } as React.CSSProperties,
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div style={{ width: 32, height: 32, border: '3px solid #1e293b', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>Orders</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{orders.length} total orders</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ ...s.btn, background: 'linear-gradient(135deg, #34d399, #059669)', color: '#fff' }}>
          <Plus style={{ width: 16, height: 16 }} /> New Order
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        {['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(st => {
          const count = orders.filter(o => o.status === st).length;
          const c = statusColors[st];
          return (
            <div key={st} style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
              <div style={{ background: c.bg, padding: 8, borderRadius: 10, color: c.text }}>{statusIcons[st]}</div>
              <div><div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>{count}</div><div style={{ fontSize: 11, color: '#64748b' }}>{st}</div></div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div style={{ ...s.card, position: 'relative' }}>
          <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X style={{ width: 18, height: 18 }} /></button>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Create Order</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Customer Name</label><input value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} style={s.input} /></div>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Email</label><input value={form.customer_email} onChange={e => setForm({ ...form, customer_email: e.target.value })} style={s.input} /></div>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Phone</label><input value={form.customer_phone} onChange={e => setForm({ ...form, customer_phone: e.target.value })} style={s.input} /></div>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Total (DA)</label><input type="number" value={form.total} onChange={e => setForm({ ...form, total: e.target.value })} style={s.input} /></div>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>City</label><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={s.input} /></div>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Address</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={s.input} /></div>
          </div>
          <button onClick={handleSubmit} style={{ ...s.btn, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', marginTop: 16 }}>Create Order</button>
        </div>
      )}

      {viewOrder && (
        <div style={{ ...s.card, position: 'relative' }}>
          <button onClick={() => setViewOrder(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X style={{ width: 18, height: 18 }} /></button>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Order Details — {viewOrder.tracking_code}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 13 }}>
            <div><span style={{ color: '#64748b' }}>Customer:</span> <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{viewOrder.customer_name}</span></div>
            <div><span style={{ color: '#64748b' }}>Email:</span> <span style={{ color: '#e2e8f0' }}>{viewOrder.customer_email}</span></div>
            <div><span style={{ color: '#64748b' }}>Phone:</span> <span style={{ color: '#e2e8f0' }}>{viewOrder.customer_phone}</span></div>
            <div><span style={{ color: '#64748b' }}>City:</span> <span style={{ color: '#e2e8f0' }}>{viewOrder.city}</span></div>
            <div><span style={{ color: '#64748b' }}>Address:</span> <span style={{ color: '#e2e8f0' }}>{viewOrder.address}</span></div>
            <div><span style={{ color: '#64748b' }}>Total:</span> <span style={{ color: '#34d399', fontWeight: 700 }}>DA {viewOrder.total?.toLocaleString()}</span></div>
            <div><span style={{ color: '#64748b' }}>Status:</span> <span style={{ color: statusColors[viewOrder.status]?.text, fontWeight: 600 }}>{viewOrder.status}</span></div>
            <div><span style={{ color: '#64748b' }}>Date:</span> <span style={{ color: '#e2e8f0' }}>{new Date(viewOrder.created_at).toLocaleDateString()}</span></div>
          </div>
        </div>
      )}

      <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ borderBottom: '1px solid rgba(51,65,85,0.5)', color: '#64748b', fontSize: 12 }}>
            <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 600 }}>Tracking</th>
            <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 600 }}>Customer</th>
            <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 600 }}>City</th>
            <th style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 600 }}>Total</th>
            <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600 }}>Status</th>
            <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600 }}>View</th>
          </tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid rgba(51,65,85,0.3)' }}>
                <td style={{ padding: '14px 18px', fontWeight: 600, color: '#60a5fa', fontSize: 12 }}>{o.tracking_code}</td>
                <td style={{ padding: '14px 18px' }}><div style={{ fontWeight: 600, color: '#e2e8f0' }}>{o.customer_name}</div><div style={{ fontSize: 11, color: '#64748b' }}>{o.customer_email}</div></td>
                <td style={{ padding: '14px 18px', color: '#94a3b8' }}>{o.city}</td>
                <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, color: '#34d399' }}>DA {o.total?.toLocaleString()}</td>
                <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                  <span style={{ padding: '4px 12px', borderRadius: 999, background: statusColors[o.status]?.bg, color: statusColors[o.status]?.text, fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>{statusIcons[o.status]} {o.status}</span>
                </td>
                <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                  <button onClick={() => setViewOrder(o)} style={{ background: 'rgba(59,130,246,0.1)', border: 'none', borderRadius: 8, padding: 6, color: '#60a5fa', cursor: 'pointer' }}><Eye style={{ width: 14, height: 14 }} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
