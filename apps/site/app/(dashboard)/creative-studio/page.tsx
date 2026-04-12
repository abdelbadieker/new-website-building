'use client';
import { useState } from 'react';
import { Paintbrush, Download, Palette, Type, Image } from 'lucide-react';

const templates = [
  { name: 'Flash Sale Banner', category: 'Marketing', colors: ['#ef4444', '#fbbf24', '#f97316'] },
  { name: 'Product Showcase', category: 'E-Commerce', colors: ['#3b82f6', '#1e293b', '#f1f5f9'] },
  { name: 'Social Media Post', category: 'Social', colors: ['#8b5cf6', '#ec4899', '#f43f5e'] },
  { name: 'Story Ad', category: 'Social', colors: ['#059669', '#34d399', '#071a0f'] },
  { name: 'Email Header', category: 'Email', colors: ['#0ea5e9', '#1e293b', '#f1f5f9'] },
  { name: 'Promo Card', category: 'Marketing', colors: ['#f59e0b', '#d97706', '#fef3c7'] },
];

export default function CreativeStudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [text, setText] = useState('Your Title Here');
  const [bg, setBg] = useState('#1e293b');
  const [textColor, setTextColor] = useState('#ffffff');

  const s = { card: { background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 16, padding: 20 } as React.CSSProperties };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div><h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>Creative Studio</h1><p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Design stunning marketing assets</p></div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Canvas */}
        <div style={s.card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Paintbrush style={{ width: 16, height: 16, color: '#a78bfa' }} />Canvas Preview</div>
          <div style={{ background: bg, borderRadius: 12, padding: 60, textAlign: 'center', minHeight: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, border: '1px solid rgba(51,65,85,0.3)' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: textColor, lineHeight: 1.2 }}>{text}</div>
            <div style={{ fontSize: 14, color: `${textColor}88` }}>Your subtitle goes here</div>
            <div style={{ marginTop: 12, padding: '10px 28px', borderRadius: 999, background: '#34d399', color: '#000', fontWeight: 700, fontSize: 14 }}>Shop Now →</div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button style={{ flex: 1, padding: '10px 0', borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Download style={{ width: 14, height: 14 }} /> Export PNG</button>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={s.card}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Type style={{ width: 16, height: 16, color: '#60a5fa' }} />Text</div>
            <input value={text} onChange={e => setText(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'rgba(7,16,31,0.8)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 10, color: '#e2e8f0', fontSize: 13, outline: 'none' }} />
          </div>
          <div style={s.card}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Palette style={{ width: 16, height: 16, color: '#f59e0b' }} />Colors</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 6 }}>Background</label><input type="color" value={bg} onChange={e => setBg(e.target.value)} style={{ width: 48, height: 32, border: 'none', borderRadius: 6, cursor: 'pointer' }} /></div>
              <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 6 }}>Text Color</label><input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} style={{ width: 48, height: 32, border: 'none', borderRadius: 6, cursor: 'pointer' }} /></div>
            </div>
          </div>
          <div style={s.card}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Image style={{ width: 16, height: 16, color: '#34d399' }} />Templates</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {templates.map((t, i) => (
                <div key={i} onClick={() => { setSelectedTemplate(i); setBg(t.colors[0]); setTextColor(t.colors[2]); setText(t.name); }} style={{ padding: 12, borderRadius: 10, border: selectedTemplate === i ? '1px solid #3b82f6' : '1px solid rgba(51,65,85,0.4)', background: selectedTemplate === i ? 'rgba(59,130,246,0.05)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>{t.colors.map((c, j) => <div key={j} style={{ width: 16, height: 16, borderRadius: 4, background: c }} />)}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{t.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
