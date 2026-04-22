'use client';
import { useState } from 'react';
import { Share2, Plus, Edit2, Trash2, Loader2, Save, X, ExternalLink } from 'lucide-react';

type PLink = { 
  id: string; 
  service: string; 
  partner_name: string; 
  url: string; 
  description: string; 
  created_at: string 
};

export function PartnershipsClient({ initialLinks }: { initialLinks: PLink[] }) {
  const [links, setLinks] = useState<PLink[]>(initialLinks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Partial<PLink>>({ service: 'web-creation' });

  const handleSave = async () => {
    setProcessingId(editingId || 'new');
    try {
      const res = await fetch('/api/admin/partner-links/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...form })
      });
      if (!res.ok) throw new Error('Save failed');
      const { data } = await res.json();
      
      if (editingId) {
        setLinks(current => current.map(l => l.id === editingId ? data : l));
      } else {
        setLinks([data, ...links]);
      }
      reset();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this partner link?')) return;
    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/partner-links/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'delete' })
      });
      if (!res.ok) throw new Error('Delete failed');
      setLinks(current => current.filter(l => l.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const reset = () => {
    setEditingId(null);
    setShowAdd(false);
    setForm({ service: 'web-creation' });
  };

  const services = [
    { id: 'web-creation', name: 'Web Creation' },
    { id: 'estore', name: 'E-Store' }
  ];

  const inp = "w-full bg-[#07101F] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none text-sm focus:border-blue-500 transition-all";

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {(showAdd || editingId) && (
        <div className="bg-[#0A1628] border border-blue-500/20 rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-white text-lg">{editingId ? 'Refine Connection' : 'Register New Partner'}</h3>
            <button onClick={reset} className="text-slate-500 hover:text-white"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Partner Channel</label>
              <select 
                value={form.service}
                onChange={e => setForm({ ...form, service: e.target.value })}
                className={inp}
              >
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Partner Name</label>
              <input 
                value={form.partner_name || ''}
                onChange={e => setForm({ ...form, partner_name: e.target.value })}
                className={inp}
                placeholder="e.g. EcoAgency Algeria"
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Target Link URL</label>
              <input 
                value={form.url || ''}
                onChange={e => setForm({ ...form, url: e.target.value })}
                className={inp}
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Engagement Description</label>
              <textarea 
                value={form.description || ''}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className={`${inp} h-24 resize-none`}
                placeholder="Briefly describe what this partner offers..."
              />
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button 
              onClick={handleSave}
              disabled={processingId !== null}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {processingId !== null ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {editingId ? 'Apply Changes' : 'Confirm Registration'}
            </button>
            <button onClick={reset} className="px-8 py-3 bg-slate-800 text-slate-300 font-bold rounded-2xl hover:bg-slate-700 transition-all border border-slate-700">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Links List */}
      {!showAdd && !editingId && (
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => setShowAdd(true)}
            className="w-full py-8 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5 transition-all flex flex-col items-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-blue-500/10 flex items-center justify-center transition-colors">
              <Plus size={24} />
            </div>
            <span className="font-black uppercase tracking-widest text-[10px]">Onboard New Strategic Partner</span>
          </button>

          {links.map(l => (
            <div key={l.id} className="bg-[#0A1628] border border-slate-800 rounded-3xl p-6 group hover:border-slate-700 transition-all shadow-xl flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <Share2 size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                   <h4 className="text-white font-black text-lg truncate">{l.partner_name}</h4>
                   <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded">
                    {l.service.replace('-', ' ')}
                   </span>
                </div>
                <p className="text-slate-400 text-sm line-clamp-1">{l.description}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 font-mono italic">
                  <ExternalLink size={10} /> {l.url}
                </div>
              </div>
              <div className="flex items-center gap-2 px-6">
                <button 
                  onClick={() => {
                    setEditingId(l.id);
                    setForm(l);
                  }}
                  className="w-10 h-10 bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-400 border border-slate-700 transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(l.id)}
                  disabled={processingId === l.id}
                  className="w-10 h-10 bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 border border-slate-700 transition-all"
                >
                  {processingId === l.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
