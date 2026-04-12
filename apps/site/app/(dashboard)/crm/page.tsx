'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Plus, Pencil, Trash2, X, Search, Phone, Mail, MapPin } from 'lucide-react';

type Customer = { id: string; name: string; email: string; phone: string; city: string; notes: string; total_orders: number; total_spent: number; created_at: string };

export default function CRMPage() {
  const supabase = createClient();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', notes: '' });

  const fetch_ = async () => { const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false }); setCustomers(data || []); setLoading(false); };
  useEffect(() => { fetch_(); }, []);

  const handleSubmit = async () => {
    if (editing) { await supabase.from('customers').update(form).eq('id', editing.id); }
    else { await supabase.from('customers').insert(form); }
    setForm({ name: '', email: '', phone: '', city: '', notes: '' }); setShowForm(false); setEditing(null); fetch_();
  };

  const handleDelete = async (id: string) => { if (confirm('Delete customer?')) { await supabase.from('customers').delete().eq('id', id); fetch_(); } };
  const startEdit = (c: Customer) => { setEditing(c); setForm({ name: c.name, email: c.email || '', phone: c.phone || '', city: c.city || '', notes: c.notes || '' }); setShowForm(true); };
  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));

  const s = {
    card: { background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 16, padding: 20 } as React.CSSProperties,
    input: { width: '100%', padding: '10px 14px', background: 'rgba(7,16,31,0.8)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 10, color: '#e2e8f0', fontSize: 13, outline: 'none' } as React.CSSProperties,
    btn: { padding: '10px 20px', borderRadius: 10, border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 } as React.CSSProperties,
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div style={{ width: 32, height: 32, border: '3px solid #1e293b', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>CRM — Customers</h1><p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{customers.length} customers</p></div>
        <button onClick={() => { setEditing(null); setForm({ name: '', email: '', phone: '', city: '', notes: '' }); setShowForm(true); }} style={{ ...s.btn, background: 'linear-gradient(135deg, #34d399, #059669)', color: '#fff' }}><Plus style={{ width: 16, height: 16 }} /> Add Customer</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', ...s.card, padding: '10px 16px', gap: 10 }}>
        <Search style={{ width: 16, height: 16, color: '#64748b' }} />
        <input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: 0, background: 'transparent', border: 'none', color: '#e2e8f0', fontSize: 13, outline: 'none' }} />
      </div>

      {showForm && (
        <div style={{ ...s.card, position: 'relative' }}>
          <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X style={{ width: 18, height: 18 }} /></button>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>{editing ? 'Edit' : 'Add'} Customer</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={s.input} /></div>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={s.input} /></div>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={s.input} /></div>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>City</label><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={s.input} /></div>
            <div style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Notes</label><input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={s.input} /></div>
          </div>
          <button onClick={handleSubmit} style={{ ...s.btn, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', marginTop: 16 }}>{editing ? 'Update' : 'Add'} Customer</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(c => (
          <div key={c.id} style={{ ...s.card, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #1e293b, #334155)', border: '1px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>{c.name.charAt(0)}</div>
                <div><div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 15 }}>{c.name}</div><div style={{ fontSize: 11, color: '#64748b' }}>Since {new Date(c.created_at).toLocaleDateString()}</div></div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => startEdit(c)} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer' }}><Pencil style={{ width: 14, height: 14 }} /></button>
                <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 style={{ width: 14, height: 14 }} /></button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
              {c.email && <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8' }}><Mail style={{ width: 13, height: 13, color: '#64748b' }} />{c.email}</div>}
              {c.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8' }}><Phone style={{ width: 13, height: 13, color: '#64748b' }} />{c.phone}</div>}
              {c.city && <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8' }}><MapPin style={{ width: 13, height: 13, color: '#64748b' }} />{c.city}</div>}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(51,65,85,0.4)' }}>
              <div><div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>{c.total_orders}</div><div style={{ fontSize: 10, color: '#64748b' }}>Orders</div></div>
              <div><div style={{ fontSize: 18, fontWeight: 800, color: '#34d399' }}>DA {c.total_spent?.toLocaleString()}</div><div style={{ fontSize: 10, color: '#64748b' }}>Total Spent</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
