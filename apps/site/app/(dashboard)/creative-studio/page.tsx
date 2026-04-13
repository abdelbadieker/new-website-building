'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Paintbrush, Send, Clock, CheckCircle, Loader, Link as LinkIcon, FileText } from 'lucide-react';

type Brief = { id: string; video_type: string; duration: string; description: string; reference_url: string; reference_description: string; status: string; admin_notes: string; created_at: string };

export default function CreativeStudioPage() {
  const supabase = createClient();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [form, setForm] = useState({
    video_type: 'Short (TikTok/Reels)',
    duration: '30s',
    description: '',
    reference_url: '',
    reference_description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchBriefs = useCallback(async () => {
    const { data: session } = await supabase.auth.getSession();
    const email = session.session?.user?.email;
    if (email) {
      const { data } = await supabase.from('creative_briefs').select('*').eq('user_email', email).order('created_at', { ascending: false });
      setBriefs(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) setUserEmail(data.session.user.email);
    });
    fetchBriefs();
  }, [supabase.auth, fetchBriefs]);

  const handleSubmit = async () => {
    if (!form.description.trim() || !userEmail) return;
    setSubmitting(true);
    await supabase.from('creative_briefs').insert({ ...form, user_email: userEmail, status: 'Pending' });
    setSubmitting(false);
    setShowForm(false);
    setForm({ video_type: 'Short (TikTok/Reels)', duration: '30s', description: '', reference_url: '', reference_description: '' });
    fetchBriefs();
  };

  const statusIcon = (s: string) => {
    if (s === 'Completed') return <CheckCircle style={{ width: 16, height: 16, color: '#34d399' }} />;
    if (s === 'In Progress') return <Loader style={{ width: 16, height: 16, color: '#60a5fa' }} />;
    return <Clock style={{ width: 16, height: 16, color: '#fbbf24' }} />;
  };
  const statusColor = (s: string) => s === 'Completed' ? '#34d399' : s === 'In Progress' ? '#60a5fa' : '#fbbf24';

  const st = {
    card: { background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 16, padding: 20 } as React.CSSProperties,
    input: { width: '100%', padding: '10px 14px', background: 'rgba(7,16,31,0.8)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 10, color: '#e2e8f0', fontSize: 13, outline: 'none' } as React.CSSProperties,
    btn: { padding: '10px 20px', borderRadius: 10, border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 } as React.CSSProperties,
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div style={{ width: 32, height: 32, border: '3px solid #1e293b', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>Creative Studio</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Request custom video content from our creative team</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ ...st.btn, background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', color: '#fff' }}>
          <Paintbrush style={{ width: 16, height: 16 }} /> New Creative Brief
        </button>
      </div>

      {/* Info Card */}
      <div style={{ ...st.card, background: 'linear-gradient(135deg, rgba(167,139,250,0.08), rgba(59,130,246,0.08))', borderColor: 'rgba(167,139,250,0.2)' }}>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
          📹 Submit a creative brief and our team will produce professional video content for your brand. 
          You can request short-form (TikTok, Reels), marketing ads, or long-form content. 
          Attach a reference video link to show us the style you want.
        </p>
      </div>

      {/* Brief Form */}
      {showForm && (
        <div style={{ ...st.card, position: 'relative' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Submit Creative Brief</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Video Type</label>
                <select value={form.video_type} onChange={e => setForm({ ...form, video_type: e.target.value })} style={{ ...st.input, cursor: 'pointer' }}>
                  <option>Short (TikTok/Reels)</option>
                  <option>Marketing Ad</option>
                  <option>Product Showcase</option>
                  <option>Long-form (YouTube)</option>
                  <option>Story/Behind the Scenes</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Duration</label>
                <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} style={{ ...st.input, cursor: 'pointer' }}>
                  <option>15s</option>
                  <option>30s</option>
                  <option>60s</option>
                  <option>2 minutes</option>
                  <option>5+ minutes</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Description / Brief *</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...st.input, minHeight: 100, resize: 'vertical' }} placeholder="Describe what you want in the video: products to show, message, style, target audience..." />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                <LinkIcon style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />Reference Video Link (optional)
              </label>
              <input value={form.reference_url} onChange={e => setForm({ ...form, reference_url: e.target.value })} style={st.input} placeholder="Paste a link to a video you like as reference (YouTube, TikTok, Instagram...)" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Reference Description (optional)</label>
              <textarea value={form.reference_description} onChange={e => setForm({ ...form, reference_description: e.target.value })} style={{ ...st.input, minHeight: 60, resize: 'vertical' }} placeholder="Describe what you like about the reference video, what style you want..." />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={handleSubmit} disabled={submitting || !form.description.trim()} style={{ ...st.btn, background: submitting || !form.description.trim() ? '#1e293b' : 'linear-gradient(135deg, #a78bfa, #7c3aed)', color: submitting || !form.description.trim() ? '#475569' : '#fff' }}>
              <Send style={{ width: 14, height: 14 }} />{submitting ? 'Sending...' : 'Submit Brief'}
            </button>
            <button onClick={() => setShowForm(false)} style={{ ...st.btn, background: 'rgba(51,65,85,0.3)', color: '#94a3b8' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Previous Briefs */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>Your Briefs</h2>
        {briefs.length === 0 ? (
          <div style={{ ...st.card, textAlign: 'center', padding: 40 }}>
            <FileText style={{ width: 40, height: 40, color: '#334155', margin: '0 auto 12px' }} />
            <p style={{ color: '#64748b', fontSize: 13 }}>No briefs submitted yet. Click &quot;New Creative Brief&quot; to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {briefs.map(b => (
              <div key={b.id} style={{ ...st.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {statusIcon(b.status)}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{b.video_type} — {b.duration}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{b.description.slice(0, 80)}{b.description.length > 80 ? '...' : ''}</div>
                    {b.reference_url && <div style={{ fontSize: 11, color: '#60a5fa', marginTop: 4 }}>📎 Reference attached</div>}
                    {b.admin_notes && <div style={{ fontSize: 11, color: '#34d399', marginTop: 4 }}>💬 Team: {b.admin_notes}</div>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ padding: '4px 10px', borderRadius: 999, background: `${statusColor(b.status)}15`, color: statusColor(b.status), fontSize: 11, fontWeight: 600 }}>{b.status}</span>
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>{new Date(b.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
