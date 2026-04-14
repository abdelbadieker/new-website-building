'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { 
  Users, 
  MousePointer2, 
  Plus, 
  Trash2, 
  ExternalLink,
  Link as LinkIcon,
  MousePointerClick
} from 'lucide-react';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type PLink = { id: string; service: string; partner_name: string; url: string; description: string; created_at: string };
type PClick = { id: string; service: string; user_email: string; clicked_at: string };

export default function PartnershipsManagement() {
  const supabase = createClient();
  const [links, setLinks] = useState<PLink[]>([]);
  const [clicks, setClicks] = useState<PClick[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [linkForm, setLinkForm] = useState({ service: 'web-creation', partner_name: '', url: '', description: '' });
  const [tab, setTab] = useState<'partners' | 'clicks'>('partners');

  const fetchAll = async () => {
    const [l, c] = await Promise.all([
      supabase.from('partner_links').select('*').order('created_at', { ascending: false }),
      supabase.from('partner_clicks').select('*').order('clicked_at', { ascending: false }).limit(50),
    ]);
    setLinks(l.data || []); 
    setClicks(c.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSaveLink = async () => {
    if (!linkForm.partner_name || !linkForm.url) return;
    if (editingLink) {
      await supabase.from('partner_links').update(linkForm).eq('id', editingLink);
    } else {
      await supabase.from('partner_links').insert(linkForm);
    }
    await supabase.from('activity_logs').insert({ action: `Updated partner link: ${linkForm.service}`, entity_type: 'partner' });
    setEditingLink(null); 
    setLinkForm({ service: 'web-creation', partner_name: '', url: '', description: '' }); 
    fetchAll();
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Delete this partner link?')) return;
    await supabase.from('partner_links').delete().eq('id', id);
    fetchAll();
  };

  const inp = "w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none text-sm focus:border-blue-500 transition-colors";

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-[3px] border-slate-700 border-t-blue-400 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Partner Connections</h2>
        <p className="text-slate-400 text-sm mt-1">Manage external partner redirects and track user integration requests</p>
      </div>

      <div className="flex gap-2 p-1 bg-slate-900/50 border border-slate-800 rounded-xl w-fit">
        {(['partners', 'clicks'] as const).map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === t 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t === 'partners' ? <Users size={16} /> : <MousePointerClick size={16} />}
            {t === 'partners' ? `Partner Links (${links.length})` : `User Activity Clicks`}
          </button>
        ))}
      </div>

      {tab === 'partners' && (
        <div className="space-y-4">
          <div className="bg-[#0A1628] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Plus size={20} className="text-blue-400" />
              {editingLink ? 'Edit Connection' : 'Register New Partner'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 font-bold uppercase tracking-wider">Target Service</label>
                <select value={linkForm.service} onChange={e => setLinkForm({ ...linkForm, service: e.target.value })} className={inp}>
                  <option value="web-creation">Web Creation</option>
                  <option value="estore">E-Store Integration</option>
                  <option value="domain">Domain Registration</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 font-bold uppercase tracking-wider">Partner Brand Name</label>
                <input value={linkForm.partner_name} onChange={e => setLinkForm({ ...linkForm, partner_name: e.target.value })} placeholder="e.g. Shopify, Salla, YouCan" className={inp} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 font-bold uppercase tracking-wider">Referral / Redirect URL</label>
              <input value={linkForm.url} onChange={e => setLinkForm({ ...linkForm, url: e.target.value })} placeholder="https://..." className={inp} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 font-bold uppercase tracking-wider">Display Description (Admin Note)</label>
              <textarea value={linkForm.description} onChange={e => setLinkForm({ ...linkForm, description: e.target.value })} className={`${inp} min-h-[80px] resize-none`} placeholder="Optional internal notes..." />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveLink} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20">
                {editingLink ? 'Save Changes' : 'Activate Connection'}
              </button>
              {editingLink && (
                <button onClick={() => { setEditingLink(null); setLinkForm({ service: 'web-creation', partner_name: '', url: '', description: '' }); }} className="px-6 py-3 bg-slate-800 text-slate-400 rounded-xl text-sm font-bold">
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {links.map(l => (
              <div key={l.id} className="bg-[#0A1628] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500/30 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] rounded-lg font-black uppercase tracking-widest border border-blue-500/10">{l.service}</span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingLink(l.id); setLinkForm({ service: l.service, partner_name: l.partner_name, url: l.url, description: l.description }); }} className="p-2 bg-slate-800 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><ExternalLink size={14} /></button>
                      <button onClick={() => deleteLink(l.id)} className="p-2 bg-slate-800 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <h4 className="text-white font-black text-lg mb-1">{l.partner_name}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 truncate mb-4">
                    <LinkIcon size={12} className="text-slate-600" />
                    {l.url}
                  </div>
                  {l.description && <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-slate-800 pl-3">"{l.description}"</p>}
                </div>
              </div>
            ))}
          </div>
          {links.length === 0 && (
            <div className="text-center py-20 bg-[#0A1628]/50 border border-dashed border-slate-800 rounded-2xl">
              <Users size={32} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-500 text-sm">No partner links configured yet.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'clicks' && (
        <div className="bg-[#0A1628] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/30">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <MousePointer2 size={16} className="text-blue-400" /> Real-time Integration Request Logs
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-900/50">
                <th className="text-left px-6 py-4 font-black">Target Service</th>
                <th className="text-left px-6 py-4 font-black">Merchant Email</th>
                <th className="text-right px-6 py-4 font-black">Request Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {clicks.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] rounded font-black uppercase tracking-tighter">
                      {c.service}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{c.user_email}</td>
                  <td className="px-6 py-4 text-right text-slate-500 text-xs">
                    {new Date(c.clicked_at).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clicks.length === 0 && (
            <div className="text-center py-20">
              <MousePointer2 size={32} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-500 text-sm">No user activity recorded yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
