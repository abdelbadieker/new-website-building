'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Play, Sparkles, Video } from 'lucide-react';

type Demo = { id: string; video_url: string; title: string; description: string };

export default function AIChatbotPage() {
  const supabase = createClient();
  const [demo, setDemo] = useState<Demo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('chatbot_demo').select('*').order('created_at', { ascending: false }).limit(1).then(({ data }) => {
      setDemo(data?.[0] || null);
      setLoading(false);
    });
  }, [supabase]);

  const s = {
    card: { background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 16, padding: 24 } as React.CSSProperties,
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div style={{ width: 32, height: 32, border: '3px solid #1e293b', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>AI Sales Chatbot</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>See how your automated sales chatbot works across your channels</p>
      </div>

      {/* Info Banner */}
      <div style={{ ...s.card, background: 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(59,130,246,0.08))', borderColor: 'rgba(52,211,153,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ padding: 10, borderRadius: 12, background: 'rgba(52,211,153,0.1)' }}>
            <Sparkles style={{ width: 22, height: 22, color: '#34d399' }} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>Your AI Sales Chatbot</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Automated across Facebook Messenger, Instagram, Telegram, TikTok & more</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
          Our team sets up a custom AI-powered sales chatbot for your business. Once configured, the bot handles customer conversations, 
          answers questions, and closes sales 24/7 across all your social channels. Below is a demo showing how real customer conversations 
          look after setup.
        </p>
      </div>

      {/* Demo Video */}
      {demo ? (
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Play style={{ width: 20, height: 20, color: '#60a5fa' }} />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{demo.title}</h2>
          </div>
          {demo.description && (
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>{demo.description}</p>
          )}
          <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', position: 'relative' }}>
            <video
              src={demo.video_url}
              controls
              style={{ width: '100%', maxHeight: 500, display: 'block' }}
              poster=""
            />
          </div>
        </div>
      ) : (
        <div style={{ ...s.card, textAlign: 'center', padding: 60 }}>
          <Video style={{ width: 48, height: 48, color: '#334155', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Demo Video Coming Soon</h3>
          <p style={{ fontSize: 13, color: '#64748b', maxWidth: 400, margin: '0 auto' }}>
            Our team is preparing your chatbot showcase video. Once ready, you&apos;ll see a real demo of how customer conversations look after setup.
          </p>
        </div>
      )}

      {/* Channels Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {['Facebook Messenger', 'Instagram DM', 'Telegram', 'TikTok', 'WhatsApp'].map(ch => (
          <div key={ch} style={{ ...s.card, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{ch}</div>
            <div style={{ fontSize: 11, color: '#34d399', marginTop: 4, fontWeight: 600 }}>✓ Supported</div>
          </div>
        ))}
      </div>
    </div>
  );
}
