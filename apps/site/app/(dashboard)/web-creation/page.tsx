'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Globe, ExternalLink, ArrowRight } from 'lucide-react';

type PartnerLink = { id: string; partner_name: string; url: string; description: string };

export default function WebCreationPage() {
  const supabase = createClient();
  const [partner, setPartner] = useState<PartnerLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) setUserEmail(data.session.user.email);
    });
    supabase.from('partner_links').select('*').eq('service', 'web-creation').limit(1).then(({ data }) => {
      setPartner(data?.[0] || null);
      setLoading(false);
    });
  }, [supabase]);

  const handleClick = async () => {
    if (!partner?.url) return;
    // Log the click
    if (userEmail) {
      await supabase.from('partner_clicks').insert({ service: 'web-creation', user_email: userEmail });
    }
    window.open(partner.url, '_blank');
  };

  const s = { card: { background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 16, padding: 24 } as React.CSSProperties };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div style={{ width: 32, height: 32, border: '3px solid #1e293b', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>Web Creation</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Build your professional website with our partner</p>
      </div>

      <div style={{ ...s.card, textAlign: 'center', padding: 48, background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(52,211,153,0.06))', borderColor: 'rgba(59,130,246,0.2)' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(59,130,246,0.3)' }}>
          <Globe style={{ width: 32, height: 32, color: '#fff' }} />
        </div>

        {partner ? (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>
              Create Your Website with {partner.partner_name}
            </h2>
            <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 500, margin: '0 auto 24px', lineHeight: 1.7 }}>
              {partner.description || `We've partnered with ${partner.partner_name} to offer you professional website creation. Click below to get started — our team will be notified automatically.`}
            </p>
            <button
              onClick={handleClick}
              style={{
                padding: '14px 32px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 10,
                boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <ExternalLink style={{ width: 18, height: 18 }} /> Go to {partner.partner_name}
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Coming Soon</h2>
            <p style={{ fontSize: 14, color: '#64748b', maxWidth: 400, margin: '0 auto' }}>
              We&apos;re setting up our web creation partner. This feature will be available shortly.
            </p>
          </>
        )}
      </div>

      {/* How it works */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { step: '1', title: 'Click the button', desc: 'You\'ll be redirected to our partner\'s website builder' },
          { step: '2', title: 'Build your site', desc: 'Use their tools to design your professional website' },
          { step: '3', title: 'Go live', desc: 'Your website goes live and integrates with your EcoMate dashboard' },
        ].map(s2 => (
          <div key={s2.step} style={{ ...s.card, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 14, fontWeight: 800, color: '#60a5fa' }}>{s2.step}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{s2.title}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{s2.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
