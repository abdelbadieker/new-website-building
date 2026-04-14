'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Paintbrush, Send, Clock, CheckCircle, Loader, Link as LinkIcon, FileText, Upload, Video, X } from 'lucide-react';

type Brief = { id: string; video_type: string; duration: string; description: string; reference_url: string; reference_description: string; status: string; admin_notes: string; delivery_url: string; created_at: string };

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
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [referenceMode, setReferenceMode] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceFile(file);
      setReferencePreview(URL.createObjectURL(file));
    }
  };

  const uploadReferenceVideo = async (file: File): Promise<string | null> => {
    if (file.size > 200 * 1024 * 1024) { // 200MB limit for videos
      alert('File is too large. Max size for video references is 200MB.');
      return null;
    }

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    
    try {
      const { error } = await supabase.storage.from('creative-references').upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      if (error) throw error;
      
      const { data: urlData } = supabase.storage.from('creative-references').getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message || 'Unknown error'}. For large videos, ensure your connection is stable.`);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!form.description.trim() || !userEmail) return;
    setSubmitting(true);

    let refUrl = form.reference_url;

    // If uploading a file, upload it first
    if (referenceMode === 'upload' && referenceFile) {
      const uploadedUrl = await uploadReferenceVideo(referenceFile);
      if (uploadedUrl) refUrl = uploadedUrl;
    }

    await supabase.from('creative_briefs').insert({
      video_type: form.video_type,
      duration: form.duration,
      description: form.description,
      reference_url: refUrl,
      reference_description: form.reference_description,
      user_email: userEmail,
      status: 'Pending',
    });

    setSubmitting(false);
    setShowForm(false);
    setForm({ video_type: 'Short (TikTok/Reels)', duration: '30s', description: '', reference_url: '', reference_description: '' });
    setReferenceFile(null);
    setReferencePreview(null);
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
          Upload a reference video or paste a link to show us the style you want.
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

            {/* Reference Video — Toggle between URL and Upload */}
            <div>
              <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                Reference Video (optional)
              </label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                  type="button"
                  onClick={() => setReferenceMode('url')}
                  style={{
                    ...st.btn, padding: '6px 14px', fontSize: 12,
                    background: referenceMode === 'url' ? 'rgba(167,139,250,0.15)' : 'rgba(51,65,85,0.2)',
                    color: referenceMode === 'url' ? '#a78bfa' : '#64748b',
                    border: referenceMode === 'url' ? '1px solid rgba(167,139,250,0.3)' : '1px solid transparent',
                  }}
                >
                  <LinkIcon style={{ width: 12, height: 12 }} /> Paste URL
                </button>
                <button
                  type="button"
                  onClick={() => setReferenceMode('upload')}
                  style={{
                    ...st.btn, padding: '6px 14px', fontSize: 12,
                    background: referenceMode === 'upload' ? 'rgba(167,139,250,0.15)' : 'rgba(51,65,85,0.2)',
                    color: referenceMode === 'upload' ? '#a78bfa' : '#64748b',
                    border: referenceMode === 'upload' ? '1px solid rgba(167,139,250,0.3)' : '1px solid transparent',
                  }}
                >
                  <Upload style={{ width: 12, height: 12 }} /> Upload Video
                </button>
              </div>

              {referenceMode === 'url' ? (
                <div style={{ position: 'relative' }}>
                  <input 
                    value={form.reference_url} 
                    onChange={e => setForm({ ...form, reference_url: e.target.value })} 
                    style={{ ...st.input, paddingRight: form.reference_url ? 40 : 14 }} 
                    placeholder="Paste a link to a video you like (YouTube, TikTok, Instagram...)" 
                  />
                  {form.reference_url && (
                    <button 
                      onClick={() => setForm({ ...form, reference_url: '' })}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                    >
                      <X style={{ width: 14, height: 14 }} />
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <input ref={fileInputRef} type="file" accept="video/mp4,video/mov,video/webm,video/quicktime,video/*" onChange={handleVideoSelect} style={{ display: 'none' }} />
                  {referenceFile ? (
                    <div style={{ border: '1px solid rgba(167,139,250,0.3)', borderRadius: 12, padding: 12, background: 'rgba(167,139,250,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Video style={{ width: 20, height: 20, color: '#a78bfa' }} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{referenceFile.name}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>{(referenceFile.size / (1024 * 1024)).toFixed(1)} MB</div>
                          </div>
                        </div>
                        <button onClick={() => { setReferenceFile(null); setReferencePreview(null); }} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 4 }}>
                          <X style={{ width: 16, height: 16 }} />
                        </button>
                      </div>
                      {referencePreview && (
                        <video src={referencePreview} controls style={{ width: '100%', maxHeight: 200, borderRadius: 8, marginTop: 10 }} />
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#a78bfa'; }}
                      onDragLeave={e => { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)'; }}
                      onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)'; const f = e.dataTransfer.files[0]; if (f) { setReferenceFile(f); setReferencePreview(URL.createObjectURL(f)); } }}
                      style={{
                        border: '2px dashed rgba(51,65,85,0.5)', borderRadius: 12, padding: 32,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'border-color 0.2s', background: 'rgba(7,16,31,0.4)',
                      }}
                    >
                      <Upload style={{ width: 28, height: 28, color: '#475569', marginBottom: 8 }} />
                      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Click or drag & drop a video</span>
                      <span style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>MP4, MOV, WEBM up to 50MB</span>
                    </div>
                  )}
                </div>
              )}
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
            <button onClick={() => { setShowForm(false); setReferenceFile(null); setReferencePreview(null); }} style={{ ...st.btn, background: 'rgba(51,65,85,0.3)', color: '#94a3b8' }}>Cancel</button>
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
              <div key={b.id} style={{ ...st.card, display: 'flex', flexDirection: 'column', gap: 16, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {statusIcon(b.status)}
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{b.video_type} — {b.duration}</div>
                      <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>Order ID: {b.id.slice(0, 8)} · Submitted {new Date(b.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <span style={{ padding: '6px 12px', borderRadius: 999, background: `${statusColor(b.status)}15`, color: statusColor(b.status), fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{b.status}</span>
                </div>

                <div style={{ background: 'rgba(7,16,31,0.4)', borderRadius: 12, padding: 14 }}>
                  <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>{b.description}</p>
                </div>

                {(b.admin_notes || b.delivery_url) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid rgba(51,65,85,0.3)', paddingTop: 16 }}>
                    {b.admin_notes && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ flexShrink: 0, marginTop: 2 }}><CheckCircle style={{ width: 14, height: 14, color: '#34d399' }} /></div>
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Note from Creative Team</span>
                          <p style={{ fontSize: 12, color: '#94a3b8' }}>{b.admin_notes}</p>
                        </div>
                      </div>
                    )}
                    
                    {b.delivery_url && (
                      <div style={{ marginTop: 4 }}>
                        <a 
                          href={b.delivery_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ 
                            ...st.btn, 
                            width: '100%', 
                            justifyContent: 'center', 
                            background: 'linear-gradient(135deg, #34d399, #059669)', 
                            color: '#fff',
                            boxShadow: '0 4px 12px rgba(52, 211, 153, 0.2)'
                          }}
                        >
                          <Video style={{ width: 16, height: 16 }} /> View Final Creative Video
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {b.reference_url && !b.delivery_url && (
                  <div style={{ fontSize: 12, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <LinkIcon style={{ width: 12, height: 12 }} /> 
                    <span>Reference: </span>
                    <a href={b.reference_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: '#60a5fa', opacity: 0.8 }}>View attachment</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
