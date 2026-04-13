'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type BotResponse = { id: string; trigger_phrase: string; response: string; category: string; is_active: boolean; created_at: string };
type Demo = { id: string; video_url: string; title: string; description: string };

export default function ChatbotControl() {
  const supabase = createClient();
  const [responses, setResponses] = useState<BotResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ trigger_phrase: '', response: '', category: 'General' });
  const [demo, setDemo] = useState<Demo | null>(null);
  const [demoForm, setDemoForm] = useState({ video_url: '', title: 'AI Chatbot Demo', description: '' });
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetch_ = async () => { const { data } = await supabase.from('chatbot_responses').select('*').order('created_at', { ascending: false }); setResponses(data || []); setLoading(false); };
  const fetchDemo = async () => {
    const { data } = await supabase.from('chatbot_demo').select('*').order('created_at', { ascending: false }).limit(1);
    const d = data?.[0] || null;
    setDemo(d);
    if (d) setDemoForm({ video_url: d.video_url, title: d.title, description: d.description });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetch_(); fetchDemo(); }, []);

  const handleUploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `chatbot-demos/${fileName}`;

      const { error } = await supabase.storage
        .from('platform-assets')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('platform-assets')
        .getPublicUrl(filePath);

      setDemoForm({ ...demoForm, video_url: publicUrl });
      alert('Video uploaded successfully!');
    } catch (error: any) {
      alert('Error uploading video: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDemo = async () => {
    if (!demoForm.video_url.trim()) return;
    if (demo) {
      await supabase.from('chatbot_demo').update(demoForm).eq('id', demo.id);
    } else {
      await supabase.from('chatbot_demo').insert(demoForm);
    }
    await supabase.from('activity_logs').insert({ action: 'Updated chatbot demo video', entity_type: 'chatbot' });
    setShowDemoForm(false);
    fetchDemo();
  };

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

      {/* Demo Video Management */}
      <div className="bg-[#0A1628] border border-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">📹 Client Demo Video</h3>
          <button onClick={() => setShowDemoForm(!showDemoForm)} className="text-xs px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{demo ? 'Edit Video' : 'Set Video'}</button>
        </div>
        {demo ? (
          <div className="text-sm">
            <p className="text-slate-300 mb-1"><span className="text-slate-500">Title:</span> {demo.title}</p>
            <p className="text-slate-300 mb-1"><span className="text-slate-500">URL:</span> <a href={demo.video_url} target="_blank" rel="noreferrer" className="text-blue-400 underline">{demo.video_url}</a></p>
            {demo.description && <p className="text-slate-400 text-xs mt-2">{demo.description}</p>}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No demo video set yet. Clients will see a placeholder message.</p>
        )}
        {showDemoForm && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Video URL / Source</label>
              <div className="flex gap-2">
                <input 
                  value={demoForm.video_url} 
                  onChange={e => setDemoForm({ ...demoForm, video_url: e.target.value })} 
                  placeholder="https://..." 
                  className="flex-1 bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none text-sm" 
                />
                <label className="relative cursor-pointer bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  {uploading ? 'Uploading...' : 'Import Video'}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="video/*" 
                    disabled={uploading}
                    onChange={handleUploadVideo}
                  />
                </label>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Provide a URL or upload a video file directly.</p>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Title</label>
              <input value={demoForm.title} onChange={e => setDemoForm({ ...demoForm, title: e.target.value })} className="w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Description</label>
              <textarea value={demoForm.description} onChange={e => setDemoForm({ ...demoForm, description: e.target.value })} className="w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none text-sm min-h-[60px] resize-y" />
            </div>
            <button 
              onClick={handleSaveDemo} 
              disabled={uploading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] disabled:opacity-50"
            >
              Save Demo & Publish
            </button>
          </div>
        )}
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
