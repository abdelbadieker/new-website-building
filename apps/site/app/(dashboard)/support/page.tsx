'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HelpCircle, Plus, X, MessageSquare, Clock, CheckCircle } from 'lucide-react';

type Ticket = { id: string; subject: string; message: string; status: string; priority: string; admin_reply: string | null; user_email: string; created_at: string };

const prioColors: Record<string, string> = { Low: '#94a3b8', Medium: '#fbbf24', High: '#f97316', Urgent: '#ef4444' };

export default function SupportPage() {
  const supabase = createClient();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [form, setForm] = useState({ subject: '', message: '', priority: 'Medium', user_email: '' });

  const fetch_ = async () => { const { data } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false }); setTickets(data || []); setLoading(false); };
  useEffect(() => { fetch_(); }, []);

  const handleSubmit = async () => {
    await supabase.from('support_tickets').insert({ ...form, status: 'Open' });
    setForm({ subject: '', message: '', priority: 'Medium', user_email: '' }); setShowForm(false); fetch_();
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
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>Support</h1><p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{tickets.filter(t => t.status === 'Open').length} open tickets</p></div>
        <button onClick={() => setShowForm(true)} style={{ ...s.btn, background: 'linear-gradient(135deg, #34d399, #059669)', color: '#fff' }}><Plus style={{ width: 16, height: 16 }} /> New Ticket</button>
      </div>

      {showForm && (
        <div style={{ ...s.card, position: 'relative' }}>
          <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X style={{ width: 18, height: 18 }} /></button>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Submit a Ticket</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Your Email</label><input value={form.user_email} onChange={e => setForm({ ...form, user_email: e.target.value })} style={s.input} placeholder="your@email.com" /></div>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Subject</label><input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={s.input} placeholder="Brief description of the issue" /></div>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Priority</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select>
            </div>
            <div><label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Message</label><textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...s.input, minHeight: 100, resize: 'vertical' }} placeholder="Describe your issue in detail..." /></div>
          </div>
          <button onClick={handleSubmit} style={{ ...s.btn, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', marginTop: 16 }}>Submit Ticket</button>
        </div>
      )}

      {selected && (
        <div style={{ ...s.card, position: 'relative' }}>
          <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X style={{ width: 18, height: 18 }} /></button>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{selected.subject}</h2>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>{new Date(selected.created_at).toLocaleString()} • {selected.user_email}</div>
          <div style={{ ...s.card, background: 'rgba(7,16,31,0.5)', marginBottom: 14 }}><div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>Your Message</div><p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>{selected.message}</p></div>
          {selected.admin_reply ? (
            <div style={{ ...s.card, background: 'rgba(52,211,153,0.05)', borderColor: 'rgba(52,211,153,0.2)' }}><div style={{ fontSize: 11, color: '#34d399', fontWeight: 600, marginBottom: 6 }}>Admin Reply</div><p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>{selected.admin_reply}</p></div>
          ) : (
            <div style={{ padding: 20, textAlign: 'center', color: '#64748b', fontSize: 13 }}><Clock style={{ width: 20, height: 20, display: 'inline', marginRight: 8 }} />Awaiting admin reply...</div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tickets.map(t => (
          <div key={t.id} onClick={() => setSelected(t)} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ padding: 10, borderRadius: 12, background: t.status === 'Resolved' ? 'rgba(52,211,153,0.1)' : 'rgba(59,130,246,0.1)' }}>
                {t.status === 'Resolved' ? <CheckCircle style={{ width: 18, height: 18, color: '#34d399' }} /> : <MessageSquare style={{ width: 18, height: 18, color: '#60a5fa' }} />}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>{t.subject}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{t.message?.slice(0, 60)}...</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <span style={{ padding: '4px 10px', borderRadius: 999, background: `${prioColors[t.priority]}15`, color: prioColors[t.priority], fontSize: 11, fontWeight: 600 }}>{t.priority}</span>
              <span style={{ padding: '4px 10px', borderRadius: 999, background: t.status === 'Open' ? 'rgba(59,130,246,0.1)' : t.status === 'Resolved' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)', color: t.status === 'Open' ? '#60a5fa' : t.status === 'Resolved' ? '#34d399' : '#fbbf24', fontSize: 11, fontWeight: 600 }}>{t.status}</span>
            </div>
          </div>
        ))}
        {tickets.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>No tickets yet. Submit one above!</div>}
      </div>
    </div>
  );
}
