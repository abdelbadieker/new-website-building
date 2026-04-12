'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Truck, Package, CheckCircle, Clock, ArrowRight } from 'lucide-react';

type Order = { id: string; customer_name: string; status: string; total: number; city: string; address: string; tracking_code: string; created_at: string };
const stages = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];

export default function FulfillmentPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = async () => { const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }); setOrders(data || []); setLoading(false); };
  useEffect(() => { fetch_(); }, []);

  const s = { card: { background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 16, padding: 20 } as React.CSSProperties };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div style={{ width: 32, height: 32, border: '3px solid #1e293b', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div><h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>Fulfillment Pipeline</h1><p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Manage your shipping pipeline</p></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {stages.map(stage => {
          const stageOrders = orders.filter(o => o.status === stage);
          const icons = { Processing: Clock, Confirmed: CheckCircle, Shipped: Truck, Delivered: Package };
          const colors = { Processing: '#fbbf24', Confirmed: '#60a5fa', Shipped: '#a78bfa', Delivered: '#34d399' };
          const Icon = icons[stage as keyof typeof icons];
          const color = colors[stage as keyof typeof colors];
          return (
            <div key={stage} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Icon style={{ width: 18, height: 18, color }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{stage}</span>
                <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: 999, background: `${color}15`, color, fontSize: 11, fontWeight: 700 }}>{stageOrders.length}</span>
              </div>
              {stageOrders.map(o => (
                <div key={o.id} style={{ ...s.card, padding: 14, borderLeftWidth: 3, borderLeftColor: color }}>
                  <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 13 }}>{o.customer_name}</div>
                  <div style={{ fontSize: 11, color: '#60a5fa', marginTop: 4 }}>{o.tracking_code}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{o.city}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#34d399', marginTop: 8 }}>DA {o.total?.toLocaleString()}</div>
                </div>
              ))}
              {stageOrders.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#334155', fontSize: 12 }}>No orders</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
