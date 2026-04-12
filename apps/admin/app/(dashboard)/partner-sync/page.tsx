'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type PLink = { id: string; service: string; partner_name: string; url: string; description: string; created_at: string };
type PClick = { id: string; service: string; user_email: string; clicked_at: string };
type Brief = { id: string; user_email: string; video_type: string; duration: string; description: string; reference_url: string; reference_description: string; status: string; admin_notes: string; created_at: string };

export default function PartnerSync() {
  const supabase = createClient();
  const [links, setLinks] = useState<PLink[]>([]);
  const [clicks, setClicks] = useState<PClick[]>([]);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [linkForm, setLinkForm] = useState({ service: 'web-creation', partner_name: '', url: '', description: '' });
  const [tab, setTab] = useState<'partners' | 'clicks' | 'briefs'>('partners');

  const fetchAll = async () => {
    const [l, c, b] = await Promise.all([
      supabase.from('partner_links').select('*').order('created_at', { ascending: false }),
      supabase.from('partner_clicks').select('*').order('clicked_at', { ascending: false }).limit(50),
      supabase.from('creative_briefs').select('*').order('created_at', { ascending: false }),
    ]);
    setLinks(l.data || []); setClicks(c.data || []); setBriefs(b.data || []); setLoading(false);
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

  const updateBriefStatus = async (id: string, status: string, notes: string) => {
    await supabase.from('creative_briefs').update({ status, admin_notes: notes }).eq('id', id);
    await supabase.from('activity_logs').insert({ action: `Updated creative brief status to: ${status}`, entity_type: 'creative' });
    fetchAll();
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
      <div className="flex gap-2">
        {(['partners', 'clicks', 'briefs'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {t === 'partners' ? `Partner Links (${links.length})` : t === 'clicks' ? `Clicks (${clicks.length})` : `Creative Briefs (${briefs.length})`}
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
        <div className="space-y-3">
          {briefs.map(b => (
            <div key={b.id} className="bg-[#0A1628] border border-slate-800 rounded-xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white font-bold text-sm">{b.video_type} — {b.duration}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${b.status === 'Completed' ? 'bg-emerald-400/10 text-emerald-400' : b.status === 'In Progress' ? 'bg-blue-400/10 text-blue-400' : 'bg-amber-400/10 text-amber-400'}`}>{b.status}</span>
                  </div>
                  <p className="text-xs text-slate-500">{b.user_email} · {new Date(b.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <select
                    defaultValue={b.status}
                    onChange={e => updateBriefStatus(b.id, e.target.value, b.admin_notes || '')}
                    className="text-xs bg-[#07101F] border border-slate-700 rounded-lg px-3 py-1.5 text-white outline-none"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-2">{b.description}</p>
              {b.reference_url && (
                <div className="text-xs text-blue-400 mb-1">📎 Reference: <a href={b.reference_url} target="_blank" rel="noreferrer" className="underline">{b.reference_url}</a></div>
              )}
              {b.reference_description && <p className="text-xs text-slate-500 mb-2">Note: {b.reference_description}</p>}
              <div className="mt-3 pt-3 border-t border-slate-800">
                <label className="text-xs text-slate-500 block mb-1">Admin Notes:</label>
                <div className="flex gap-2">
                  <input
                    defaultValue={b.admin_notes || ''}
                    placeholder="Add notes for the client..."
                    className="flex-1 bg-[#07101F] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none text-xs"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        updateBriefStatus(b.id, b.status, (e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                  <button onClick={e => {
                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                    updateBriefStatus(b.id, b.status, input.value);
                  }} className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-medium">Save</button>
                </div>
              </div>
            </div>
          ))}
          {briefs.length === 0 && <p className="text-center text-slate-500 py-10 text-sm">No creative briefs submitted yet.</p>}
        </div>
      )}
    </div>
  );
}
