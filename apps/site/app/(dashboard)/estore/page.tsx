'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Store, ShoppingBag, Settings, Eye } from 'lucide-react';

type Product = { id: string; name: string; price: number; stock: number; image_url: string | null; category: string; is_active: boolean };

export default function EStorePage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState('My EcoMate Store');
  const [storeTheme, setStoreTheme] = useState<'dark' | 'light'>('dark');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => { supabase.from('products').select('*').eq('is_active', true).then(({ data }) => { setProducts(data || []); setLoading(false); }); }, []);

  const toggleProduct = async (id: string, active: boolean) => { await supabase.from('products').update({ is_active: !active }).eq('id', id); const { data } = await supabase.from('products').select('*'); setProducts(data || []); };

  const s = { card: { background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 16, padding: 20 } as React.CSSProperties };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div style={{ width: 32, height: 32, border: '3px solid #1e293b', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>E-Store</h1><p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Configure your online storefront</p></div>
        <button onClick={() => setShowPreview(!showPreview)} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Eye style={{ width: 16, height: 16 }} />{showPreview ? 'Hide' : 'Show'} Preview</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={s.card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Settings style={{ width: 16, height: 16 }} />Store Settings</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Store Name</label><input value={storeName} onChange={e => setStoreName(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'rgba(7,16,31,0.8)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 10, color: '#e2e8f0', fontSize: 13, outline: 'none' }} /></div>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Theme</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStoreTheme('dark')} style={{ flex: 1, padding: 12, borderRadius: 10, border: storeTheme === 'dark' ? '2px solid #34d399' : '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Dark Mode</button>
                <button onClick={() => setStoreTheme('light')} style={{ flex: 1, padding: 12, borderRadius: 10, border: storeTheme === 'light' ? '2px solid #3b82f6' : '1px solid #334155', background: '#fff', color: '#111', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Light Mode</button>
              </div>
            </div>
          </div>
        </div>
        <div style={s.card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><ShoppingBag style={{ width: 16, height: 16 }} />Product Visibility ({products.filter(p => p.is_active).length} visible)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {products.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, background: 'rgba(7,16,31,0.4)', border: '1px solid rgba(51,65,85,0.3)' }}>
                <div><div style={{ fontSize: 13, fontWeight: 600, color: p.is_active ? '#e2e8f0' : '#475569' }}>{p.name}</div><div style={{ fontSize: 11, color: '#64748b' }}>DA {p.price?.toLocaleString()}</div></div>
                <button onClick={() => toggleProduct(p.id, p.is_active)} style={{ width: 36, height: 20, borderRadius: 10, border: 'none', background: p.is_active ? '#34d399' : '#334155', position: 'relative', cursor: 'pointer' }}>
                  <span style={{ position: 'absolute', top: 2, left: p.is_active ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPreview && (
        <div style={s.card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Store Preview</div>
          <div style={{ background: storeTheme === 'dark' ? '#0f172a' : '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(128,128,128,0.2)' }}>
            <div style={{ padding: '16px 24px', borderBottom: storeTheme === 'dark' ? '1px solid #1e293b' : '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: 18, color: storeTheme === 'dark' ? '#34d399' : '#111' }}>{storeName}</span>
              <div style={{ display: 'flex', gap: 6 }}><div style={{ width: 32, height: 8, borderRadius: 4, background: storeTheme === 'dark' ? '#1e293b' : '#eee' }} /><div style={{ width: 32, height: 8, borderRadius: 4, background: storeTheme === 'dark' ? '#1e293b' : '#eee' }} /></div>
            </div>
            <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {products.filter(p => p.is_active).map(p => (
                <div key={p.id} style={{ borderRadius: 10, overflow: 'hidden', border: storeTheme === 'dark' ? '1px solid #1e293b' : '1px solid #eee' }}>
                  <div style={{ height: 120, background: storeTheme === 'dark' ? '#1e293b' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Store style={{ width: 32, height: 32, color: '#64748b' }} /></div>
                  <div style={{ padding: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: storeTheme === 'dark' ? '#e2e8f0' : '#111' }}>{p.name}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#34d399', marginTop: 4 }}>DA {p.price?.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
