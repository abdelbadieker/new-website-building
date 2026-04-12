'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type Ticket = { id: string; subject: string; message: string; status: string; priority: string; admin_reply: string | null; user_email: string; created_at: string };

export default function SubscriptionsPage() {
  const supabase = createClient();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');

  const fetch_ = async () => { const { data } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false }); setTickets(data || []); setLoading(false); };
  useEffect(() => { fetch_(); }, []);

  const sendReply = async () => {
    if (!selected || !reply.trim()) return;
    await supabase.from('support_tickets').update({ admin_reply: reply, status: 'Resolved' }).eq('id', selected.id);
    await supabase.from('activity_logs').insert({ action: `Replied to ticket: ${selected.subject}`, entity_type: 'support_ticket', entity_id: selected.id });
    setReply(''); setSelected(null); fetch_();
  };

  const updateStatus = async (id: string, status: string) => { await supabase.from('support_tickets').update({ status }).eq('id', id); fetch_(); };

  const prioColors: Record<string, string> = { Low: '#94a3b8', Medium: '#fbbf24', High: '#f97316', Urgent: '#ef4444' };

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-[3px] border-slate-700 border-t-emerald-400 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold">Support Tickets</h2><p className="text-slate-400 text-sm mt-1">{tickets.filter(t => t.status === 'Open').length} open tickets</p></div>

      {selected && (
        <div className="bg-[#0A1628] border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex justify-between"><div><h3 className="text-lg font-bold">{selected.subject}</h3><p className="text-xs text-slate-400 mt-1">{selected.user_email} • {new Date(selected.created_at).toLocaleString()}</p></div><button onClick={() => setSelected(null)} className="text-slate-400 text-xl">×</button></div>
          <div className="bg-[#07101F] rounded-lg p-4"><p className="text-sm text-slate-300 leading-relaxed">{selected.message}</p></div>
          {selected.admin_reply && <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-4"><p className="text-xs text-emerald-400 font-semibold mb-2">Previous Reply</p><p className="text-sm text-slate-300">{selected.admin_reply}</p></div>}
          <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Reply..." className="w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none text-sm min-h-[80px] resize-y" />
          <button onClick={sendReply} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm">Send Reply & Resolve</button>
        </div>
      )}

      <div className="bg-[#0A1628] rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-slate-800 text-slate-400 text-xs">
            <th className="px-5 py-3 font-medium">Subject</th><th className="px-5 py-3 font-medium">Email</th><th className="px-5 py-3 font-medium text-center">Priority</th><th className="px-5 py-3 font-medium text-center">Status</th><th className="px-5 py-3 font-medium text-center">Action</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-800/50">
            {tickets.map(t => (
              <tr key={t.id} className="hover:bg-slate-800/30">
                <td className="px-5 py-3"><div className="text-white font-medium">{t.subject}</div></td>
                <td className="px-5 py-3 text-slate-300 text-xs">{t.user_email}</td>
                <td className="px-5 py-3 text-center"><span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${prioColors[t.priority]}15`, color: prioColors[t.priority] }}>{t.priority}</span></td>
                <td className="px-5 py-3 text-center"><select value={t.status} onChange={e => updateStatus(t.id, e.target.value)} className="bg-[#07101F] border border-slate-700 rounded px-2 py-1 text-xs outline-none text-white">{['Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}</select></td>
                <td className="px-5 py-3 text-center"><button onClick={() => { setSelected(t); setReply(t.admin_reply || ''); }} className="text-blue-400 text-xs font-medium px-3 py-1 bg-blue-400/10 rounded-md">Reply</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
