'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send, Sparkles, User } from 'lucide-react';

type ChatMsg = { role: 'user' | 'bot'; text: string };
type BotResponse = { id: string; trigger_phrase: string; response: string; category: string; is_active: boolean };

export default function AIChatbotPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<ChatMsg[]>([{ role: 'bot', text: 'Hello! I\'m your EcoMate AI assistant. Ask me anything about orders, shipping, pricing, or features!' }]);
  const [input, setInput] = useState('');
  const [botResponses, setBotResponses] = useState<BotResponse[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    supabase.from('chatbot_responses').select('*').eq('is_active', true).then(({ data }) => setBotResponses(data || []));
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    
    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      const match = botResponses.find(r => lower.includes(r.trigger_phrase.toLowerCase()));
      const reply = match ? match.response : "I'm not sure about that. Try asking about pricing, shipping, features, payments, refunds, or tracking!";
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    }, 600);
  };

  const quickActions = ['What are the pricing plans?', 'How does shipping work?', 'What features are included?', 'How do refunds work?'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', gap: 0 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>AI Chatbot</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Chat with your AI-powered business assistant</p>
      </div>

      <div style={{ flex: 1, background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '16px 16px 0 0', padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'bot' && <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #34d399, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Sparkles style={{ width: 16, height: 16, color: '#fff' }} /></div>}
            <div style={{
              maxWidth: '70%', padding: '12px 16px', borderRadius: 14, fontSize: 13, lineHeight: 1.6,
              background: m.role === 'user' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(30,41,59,0.8)',
              color: '#e2e8f0',
              borderBottomRightRadius: m.role === 'user' ? 4 : 14,
              borderBottomLeftRadius: m.role === 'bot' ? 4 : 14,
            }}>{m.text}</div>
            {m.role === 'user' && <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1e293b', border: '1px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><User style={{ width: 16, height: 16, color: '#94a3b8' }} /></div>}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', background: 'rgba(10,22,40,0.4)', borderLeft: '1px solid rgba(51,65,85,0.5)', borderRight: '1px solid rgba(51,65,85,0.5)', flexWrap: 'wrap' }}>
        {quickActions.map((q, i) => (
          <button key={i} onClick={() => { setInput(q); }} style={{ padding: '6px 14px', borderRadius: 999, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{q}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, padding: 16, background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '0 0 16px 16px', borderTop: 'none' }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '12px 16px', background: 'rgba(7,16,31,0.8)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 12, color: '#e2e8f0', fontSize: 13, outline: 'none' }}
        />
        <button onClick={sendMessage} style={{ padding: '12px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #34d399, #059669)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13 }}>
          <Send style={{ width: 16, height: 16 }} /> Send
        </button>
      </div>
    </div>
  );
}
