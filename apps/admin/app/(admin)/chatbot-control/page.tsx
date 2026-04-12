'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type BotResponse = { id: string; trigger_phrase: string; response: string; category: string; is_active: boolean; created_at: string };

export default function ChatbotControl() {
  const supabase = createClient();
  const [responses, setResponses] = useState<BotResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ trigger_phrase: '', response: '', category: 'General' });

  const fetch_ = async () => { const { data } = await supabase.from('chatbot_responses').select('*').order('created_at', { ascending: false }); setResponses(data || []); setLoading(false); };
  useEffect(() => { fetch_(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('chatbot_responses').insert({ ...form, is_active: true });
    await supabase.from('activity_logs').insert({ action: `Added chatbot response: "${form.trigger_phrase}"`, entity_type: 'chatbot' });
    setForm({ trigger_phrase: '', response: '', category: 'General' }); setShowForm(false); fetch_();
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('chatbot_responses').update({ is_active: !active }).eq('id', id);
    fetch_();
  };

  const deleteResponse = async (id: string) => {
    if (!confirm('Delete this response?')) return;
    await supabase.from('chatbot_responses').delete().eq('id', id);
    fetch_();
  };

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-[3px] border-slate-700 border-t-emerald-400 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold">Chatbot Control</h2><p className="text-slate-400 text-sm mt-1">{responses.filter(r => r.is_active).length} active responses</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition-colors">+ Add Response</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-[#0A1628] border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">New Bot Response</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-slate-400 mb-1 font-medium">Trigger Phrase</label><input value={form.trigger_phrase} onChange={e => setForm({ ...form, trigger_phrase: e.target.value })} placeholder="e.g. pricing" required className="w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none text-sm" /></div>
            <div><label className="block text-xs text-slate-400 mb-1 font-medium">Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none text-sm"><option>General</option><option>Sales</option><option>Support</option><option>Logistics</option><option>Billing</option><option>Greeting</option></select></div>
          </div>
          <div><label className="block text-xs text-slate-400 mb-1 font-medium">Response</label><textarea value={form.response} onChange={e => setForm({ ...form, response: e.target.value })} placeholder="The bot will reply with this..." required className="w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none text-sm min-h-[80px] resize-y" /></div>
          <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm">Add Response</button>
        </form>
      )}

      <div className="space-y-3">
        {responses.map(r => (
          <div key={r.id} className="bg-[#0A1628] border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-blue-400">"{r.trigger_phrase}"</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-full">{r.category}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.is_active ? 'bg-emerald-400/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{r.is_active ? 'Active' : 'Disabled'}</span>
                </div>
                <p className="text-sm text-slate-300">{r.response}</p>
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                <button onClick={() => toggleActive(r.id, r.is_active)} className={`text-xs px-3 py-1.5 rounded-md font-medium ${r.is_active ? 'bg-amber-400/10 text-amber-400' : 'bg-emerald-400/10 text-emerald-400'}`}>{r.is_active ? 'Disable' : 'Enable'}</button>
                <button onClick={() => deleteResponse(r.id)} className="text-xs px-3 py-1.5 rounded-md font-medium bg-red-400/10 text-red-400">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
