import { LucideIcon } from 'lucide-react';

export function ComingSoonModule({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: 40 }}>
      <div style={{
        width: 80, height: 80, borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(59,130,246,0.1))',
        border: '1px solid rgba(52,211,153,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 28,
      }}>
        <Icon style={{ width: 36, height: 36, color: '#34d399' }} />
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 10, letterSpacing: '-0.5px' }}>{title}</h1>
      <p style={{ fontSize: 15, color: '#64748b', maxWidth: 420, lineHeight: 1.6, marginBottom: 28 }}>{description}</p>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '10px 22px', borderRadius: 999,
        background: 'rgba(52,211,153,0.08)',
        border: '1px solid rgba(52,211,153,0.2)',
        fontSize: 13, fontWeight: 600, color: '#34d399',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', animation: 'pulse 2s infinite' }} />
        Coming Soon
      </div>
    </div>
  );
}
