'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { 
  Video, 
  Send, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  User, 
  Calendar, 
  X, 
  FileText,
  Link as LinkIcon,
  MousePointer2,
  Users
} from 'lucide-react';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type PLink = { id: string; service: string; partner_name: string; url: string; description: string; created_at: string };
type PClick = { id: string; service: string; user_email: string; clicked_at: string };
type Brief = { id: string; user_email: string; video_type: string; duration: string; description: string; reference_url: string; reference_description: string; status: string; admin_notes: string; delivery_url: string; created_at: string };

export default function CreativeStudioManagement() {
  const supabase = createClient();
  const [links, setLinks] = useState<PLink[]>([]);
  const [clicks, setClicks] = useState<PClick[]>([]);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [linkForm, setLinkForm] = useState({ service: 'web-creation', partner_name: '', url: '', description: '' });
  const [tab, setTab] = useState<'briefs' | 'partners' | 'clicks'>('briefs');

  const fetchAll = async () => {
    const [l, c] = await Promise.all([
      supabase.from('partner_links').select('*').order('created_at', { ascending: false }),
      supabase.from('partner_clicks').select('*').order('clicked_at', { ascending: false }).limit(50),
    ]);
    setLinks(l.data || []); setClicks(c.data || []);

    // Fetch briefs via admin API to bypass RLS
    try {
      const briefsRes = await fetch('/api/admin/briefs', { credentials: 'include' });
      if (briefsRes.ok) {
        const briefsData = await briefsRes.json();
        setBriefs(briefsData.data || []);
      }
    } catch (err) {
      console.error('Error fetching briefs:', err);
    }

    setLoading(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchAll(); }, []);

  const handleSaveLink = async () => {
    if (!linkForm.partner_name || !linkForm.url) return;
    if (editingLink) {
      await supabase.from('partner_links').update(linkForm).eq('id', editingLink);
    } else {
      await supabase.from('partner_links').insert(linkForm);
    }
    await supabase.from('activity_logs').insert({ action: `Updated partner link: ${linkForm.service}`, entity_type: 'partner' });
    setEditingLink(null); setLinkForm({ service: 'web-creation', partner_name: '', url: '', description: '' }); fetchAll();
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Delete this partner link?')) return;
    await supabase.from('partner_links').delete().eq('id', id);
    fetchAll();
  };

  const updateBriefStatus = async (id: string, status: string, notes: string, deliveryUrl: string = '') => {
    try {
      const res = await fetch('/api/admin/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, status, admin_notes: notes, delivery_url: deliveryUrl }),
      });
      if (!res.ok) throw new Error('Failed to update brief');
      await supabase.from('activity_logs').insert({ action: `Updated creative brief: ${status}`, entity_type: 'creative' });
      fetchAll();
    } catch (err) {
      console.error('Error updating brief:', err);
      alert('Error updating brief');
    }
  };

  const inp = "w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none text-sm";

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-[3px] border-slate-700 border-t-emerald-400 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Partner Sync & Creative Briefs</h2>
        <p className="text-slate-400 text-sm mt-1">Manage partner redirect links, track clicks, and handle creative brief requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900/50 border border-slate-800 rounded-xl w-fit">
        {(['briefs', 'partners', 'clicks'] as const).map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === t 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t === 'briefs' && <Video size={16} />}
            {t === 'partners' && <Users size={16} />}
            {t === 'clicks' && <MousePointer2 size={16} />}
            {t === 'briefs' ? `Client Briefs (${briefs.length})` : t === 'partners' ? `Partner Links (${links.length})` : `Activity Clicks`}
          </button>
        ))}
      </div>

      {/* Partner Links Tab */}
      {tab === 'partners' && (
        <div className="space-y-4">
          {/* Add/Edit Form */}
          <div className="bg-[#0A1628] border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold">{editingLink ? 'Edit Partner Link' : 'Add Partner Link'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Service</label>
                <select value={linkForm.service} onChange={e => setLinkForm({ ...linkForm, service: e.target.value })} className={inp}>
                  <option value="web-creation">Web Creation</option>
                  <option value="estore">E-Store</option>
                </select>
              </div>
              <div><label className="block text-xs text-slate-400 mb-1 font-medium">Partner Name</label><input value={linkForm.partner_name} onChange={e => setLinkForm({ ...linkForm, partner_name: e.target.value })} placeholder="e.g. Shopify, Wix" className={inp} /></div>
            </div>
            <div><label className="block text-xs text-slate-400 mb-1 font-medium">URL</label><input value={linkForm.url} onChange={e => setLinkForm({ ...linkForm, url: e.target.value })} placeholder="https://..." className={inp} /></div>
            <div><label className="block text-xs text-slate-400 mb-1 font-medium">Description</label><textarea value={linkForm.description} onChange={e => setLinkForm({ ...linkForm, description: e.target.value })} className={`${inp} min-h-[60px] resize-y`} /></div>
            <div className="flex gap-2">
              <button onClick={handleSaveLink} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm">{editingLink ? 'Update' : 'Add'} Link</button>
              {editingLink && <button onClick={() => { setEditingLink(null); setLinkForm({ service: 'web-creation', partner_name: '', url: '', description: '' }); }} className="px-4 py-2.5 bg-slate-800 text-slate-400 rounded-lg text-sm">Cancel</button>}
            </div>
          </div>
          {links.map(l => (
            <div key={l.id} className="bg-[#0A1628] border border-slate-800 rounded-xl p-5 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2 py-0.5 bg-blue-400/10 text-blue-400 text-xs rounded-full font-semibold">{l.service}</span>
                  <span className="text-white font-bold text-sm">{l.partner_name}</span>
                </div>
                <a href={l.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline">{l.url}</a>
                {l.description && <p className="text-xs text-slate-500 mt-1">{l.description}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { setEditingLink(l.id); setLinkForm({ service: l.service, partner_name: l.partner_name, url: l.url, description: l.description }); }} className="text-xs px-3 py-1.5 bg-blue-400/10 text-blue-400 rounded-md font-medium">Edit</button>
                <button onClick={() => deleteLink(l.id)} className="text-xs px-3 py-1.5 bg-red-400/10 text-red-400 rounded-md font-medium">Delete</button>
              </div>
            </div>
          ))}
          {links.length === 0 && <p className="text-slate-500 text-center py-10 text-sm">No partner links configured yet.</p>}
        </div>
      )}

      {/* Clicks Tab */}
      {tab === 'clicks' && (
        <div className="bg-[#0A1628] border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-800 text-slate-400 text-xs">
              <th className="text-left px-5 py-3 font-medium">Service</th>
              <th className="text-left px-5 py-3 font-medium">User Email</th>
              <th className="text-left px-5 py-3 font-medium">Clicked At</th>
            </tr></thead>
            <tbody>
              {clicks.map(c => (
                <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="px-5 py-3"><span className="px-2 py-0.5 bg-blue-400/10 text-blue-400 text-xs rounded-full font-semibold">{c.service}</span></td>
                  <td className="px-5 py-3 text-slate-300">{c.user_email}</td>
                  <td className="px-5 py-3 text-slate-500">{new Date(c.clicked_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {clicks.length === 0 && <p className="text-center text-slate-500 py-10 text-sm">No clicks tracked yet.</p>}
        </div>
      )}

      {/* Creative Briefs Tab */}
      {tab === 'briefs' && (
        <div className="grid grid-cols-1 gap-6">
          {briefs.map(b => (
            <div key={b.id} className="group bg-[#0A1628] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[50px] pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Client & Status */}
                <div className="lg:w-1/4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-400">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm truncate max-w-[150px]">{b.user_email}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1"><Calendar size={10} /> {new Date(b.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Order Status</label>
                    <div className="relative">
                      <select
                        value={b.status}
                        onChange={e => updateBriefStatus(b.id, e.target.value, b.admin_notes || '', b.delivery_url || '')}
                        className={`w-full text-xs font-bold bg-[#07101F] border border-slate-700 rounded-xl px-4 py-3 outline-none appearance-none transition-all ${
                          b.status === 'Completed' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' : 
                          b.status === 'In Progress' ? 'text-blue-400 border-blue-500/30 bg-blue-500/5' : 
                          'text-amber-400 border-amber-500/30 bg-amber-500/5'
                        }`}
                      >
                        <option value="Pending">🕒 Pending Review</option>
                        <option value="In Progress">⚙️ Production</option>
                        <option value="Completed">✅ Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Center: Brief Details */}
                <div className="lg:w-1/2 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-2.5 py-1 bg-blue-600/20 text-blue-400 text-[10px] rounded-lg font-black uppercase tracking-wider border border-blue-500/20">{b.video_type}</span>
                       <span className="px-2.5 py-1 bg-slate-800 text-slate-400 text-[10px] rounded-lg font-black uppercase tracking-wider">{b.duration}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed bg-[#07101F]/50 p-4 rounded-xl border border-slate-800/50 italic">"{b.description}"</p>
                  </div>

                  {b.reference_url && (
                    <div className="bg-[#07101F] border border-slate-800 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-2 italic">
                          <ExternalLink size={14} className="text-blue-500" /> Reference Material
                        </span>
                      </div>
                      {b.reference_url.match(/\.(mp4|mov|webm|ogg)($|\?)/) ? (
                        <video src={b.reference_url} controls className="w-full h-40 object-cover rounded-lg shadow-2xl" />
                      ) : (
                        <a href={b.reference_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-blue-400 text-xs transition-colors truncate">
                          <LinkIcon size={14} /> {b.reference_url}
                        </a>
                      )}
                    </div>
                  )}
                  {b.reference_description && (
                    <div className="flex items-start gap-2 text-xs text-slate-500 p-2 border-l-2 border-slate-800">
                      <FileText size={14} className="mt-0.5 flex-shrink-0" />
                      <span>Note: {b.reference_description}</span>
                    </div>
                  )}
                </div>

                {/* Right: Delivery & Notes */}
                <div className="lg:w-1/4 space-y-4">
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      <Send size={12} /> Google Drive Delivery
                    </div>
                    <div className="relative">
                      <input 
                        id={`delivery-${b.id}`}
                        defaultValue={b.delivery_url || ''}
                        placeholder="Paste URL..."
                        className="w-full bg-[#07101F] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none text-xs focus:border-emerald-500 transition-all pr-10"
                      />
                      <button 
                         onClick={() => {
                           const input = document.getElementById(`delivery-${b.id}`) as HTMLInputElement;
                           if (input) input.value = '';
                         }}
                         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => {
                        const input = document.getElementById(`delivery-${b.id}`) as HTMLInputElement;
                        updateBriefStatus(b.id, 'Completed', b.admin_notes || '', input?.value || '');
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                    >
                      <CheckCircle2 size={14} /> Deliver & Complete
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Private Admin Notes</label>
                    <div className="relative">
                      <textarea
                        id={`notes-${b.id}`}
                        defaultValue={b.admin_notes || ''}
                        placeholder="Internal notes..."
                        className="w-full bg-[#07101F] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none text-xs focus:border-blue-500 transition-all min-h-[80px] resize-none"
                      />
                      <button 
                        onClick={() => {
                          const noteInput = document.getElementById(`notes-${b.id}`) as HTMLTextAreaElement;
                          const deliveryInput = document.getElementById(`delivery-${b.id}`) as HTMLInputElement;
                          updateBriefStatus(b.id, b.status, noteInput?.value || '', deliveryInput?.value || b.delivery_url || '');
                        }}
                        className="absolute bottom-2 right-2 text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-md font-bold"
                      >
                        SAVE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {briefs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-[#0A1628] border border-slate-800 border-dashed rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 mb-4 mx-auto">
                <Video size={32} />
              </div>
              <p className="text-slate-500 font-medium">No creative briefs submitted yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
