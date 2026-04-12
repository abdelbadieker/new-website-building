'use client';
import { useState } from 'react';
import { Globe, Layout, Eye, Smartphone, Monitor, Palette } from 'lucide-react';

const themes = [
  { name: 'Modern Dark', preview: '#0f172a', accent: '#34d399' },
  { name: 'Clean White', preview: '#ffffff', accent: '#3b82f6' },
  { name: 'Warm Sunset', preview: '#1c1917', accent: '#f97316' },
  { name: 'Royal Purple', preview: '#1e1b4b', accent: '#a78bfa' },
];

const sections = [
  { name: 'Hero Banner', enabled: true },
  { name: 'Featured Products', enabled: true },
  { name: 'About Us', enabled: true },
  { name: 'Testimonials', enabled: false },
  { name: 'Newsletter', enabled: true },
  { name: 'Contact Form', enabled: false },
];

export default function WebCreationPage() {
  const [activeTheme, setActiveTheme] = useState(0);
  const [sectionStates, setSectionStates] = useState(sections.map(s => s.enabled));
  const [storeName, setStoreName] = useState('My EcoMate Store');
  const [preview, setPreview] = useState<'desktop' | 'mobile'>('desktop');

  const theme = themes[activeTheme];
  const s = { card: { background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 16, padding: 20 } as React.CSSProperties };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div><h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>Web Creation</h1><p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Build your online store in minutes</p></div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        {/* Sidebar Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={s.card}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 14 }}>Store Name</div>
            <input value={storeName} onChange={e => setStoreName(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'rgba(7,16,31,0.8)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 10, color: '#e2e8f0', fontSize: 13, outline: 'none' }} />
          </div>
          <div style={s.card}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Palette style={{ width: 16, height: 16 }} />Theme</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {themes.map((t, i) => (
                <div key={i} onClick={() => setActiveTheme(i)} style={{ padding: 12, borderRadius: 10, border: activeTheme === i ? `2px solid ${t.accent}` : '1px solid rgba(51,65,85,0.4)', cursor: 'pointer', background: activeTheme === i ? `${t.accent}08` : 'transparent' }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}><div style={{ width: 20, height: 20, borderRadius: 4, background: t.preview, border: '1px solid #333' }} /><div style={{ width: 20, height: 20, borderRadius: 4, background: t.accent }} /></div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0' }}>{t.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={s.card}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Layout style={{ width: 16, height: 16 }} />Sections</div>
            {sections.map((sec, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < sections.length - 1 ? '1px solid rgba(51,65,85,0.3)' : 'none' }}>
                <span style={{ fontSize: 13, color: sectionStates[i] ? '#e2e8f0' : '#475569' }}>{sec.name}</span>
                <button onClick={() => { const ns = [...sectionStates]; ns[i] = !ns[i]; setSectionStates(ns); }} style={{ width: 36, height: 20, borderRadius: 10, border: 'none', background: sectionStates[i] ? '#34d399' : '#334155', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                  <span style={{ position: 'absolute', top: 2, left: sectionStates[i] ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}><Eye style={{ width: 16, height: 16 }} />Live Preview</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setPreview('desktop')} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: preview === 'desktop' ? 'rgba(59,130,246,0.15)' : 'transparent', color: preview === 'desktop' ? '#60a5fa' : '#64748b', cursor: 'pointer' }}><Monitor style={{ width: 16, height: 16 }} /></button>
              <button onClick={() => setPreview('mobile')} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: preview === 'mobile' ? 'rgba(59,130,246,0.15)' : 'transparent', color: preview === 'mobile' ? '#60a5fa' : '#64748b', cursor: 'pointer' }}><Smartphone style={{ width: 16, height: 16 }} /></button>
            </div>
          </div>
          <div style={{ background: theme.preview, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(51,65,85,0.3)', maxWidth: preview === 'mobile' ? 375 : '100%', margin: '0 auto', transition: 'max-width 0.3s' }}>
            <div style={{ padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.accent}22` }}>
              <span style={{ fontWeight: 800, color: theme.accent, fontSize: 18 }}>{storeName}</span>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: theme.preview === '#ffffff' ? '#333' : '#999' }}><span>Home</span><span>Shop</span><span>About</span></div>
            </div>
            {sectionStates[0] && <div style={{ padding: '60px 24px', textAlign: 'center', background: `${theme.accent}08` }}><div style={{ fontSize: preview === 'mobile' ? 20 : 28, fontWeight: 900, color: theme.preview === '#ffffff' ? '#111' : '#f1f5f9', marginBottom: 10 }}>Welcome to {storeName}</div><div style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>Discover amazing products</div><div style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 999, background: theme.accent, color: '#fff', fontWeight: 700, fontSize: 13 }}>Shop Now</div></div>}
            {sectionStates[1] && <div style={{ padding: '30px 24px' }}><div style={{ fontSize: 16, fontWeight: 700, color: theme.preview === '#ffffff' ? '#111' : '#f1f5f9', marginBottom: 16 }}>Featured Products</div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>{[1,2,3].map(i => <div key={i} style={{ height: 80, borderRadius: 8, background: `${theme.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 11 }}>Product {i}</div>)}</div></div>}
            {sectionStates[4] && <div style={{ padding: '24px', background: `${theme.accent}08`, textAlign: 'center' }}><div style={{ fontSize: 14, fontWeight: 700, color: theme.preview === '#ffffff' ? '#111' : '#ccc', marginBottom: 8 }}>Subscribe to our newsletter</div><div style={{ display: 'flex', gap: 8, maxWidth: 300, margin: '0 auto' }}><div style={{ flex: 1, height: 36, borderRadius: 8, background: theme.preview === '#ffffff' ? '#eee' : '#333' }} /><div style={{ width: 80, height: 36, borderRadius: 8, background: theme.accent }} /></div></div>}
            <div style={{ padding: '16px 24px', textAlign: 'center', fontSize: 11, color: '#666', borderTop: '1px solid rgba(128,128,128,0.1)' }}>© 2026 {storeName}. Powered by EcoMate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
