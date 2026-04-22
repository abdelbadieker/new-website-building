'use client';
import { useState } from 'react';
import { Plus, Trash2, Loader2, Save, X, Image as ImageIcon, Smile, Share2 } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  is_emoji: boolean;
  content: string;
  created_at: string;
}

export default function PartnershipsListClient({ initialPartners }: { initialPartners: Partner[] }) {
  const [partners, setPartners] = useState(initialPartners);
  const [isAdding, setIsAdding] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', content: '', is_emoji: true });

  const handleSave = async () => {
    if (!form.name || !form.content) return alert('Name and Content are required');
    setProcessingId('new');
    try {
      const res = await fetch('/api/admin/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Save failed');
      const { data } = await res.json();
      setPartners([data, ...partners]);
      setForm({ name: '', content: '', is_emoji: true });
      setIsAdding(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently remove this partner from the marquee?')) return;
    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'delete' })
      });
      if (!res.ok) throw new Error('Deletion failed');
      setPartners(partners.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const inp = "w-full bg-[#07101F] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none text-sm transition-all focus:border-blue-500 shadow-inner";

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center px-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
           Trust Network Registry
        </h3>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <Plus size={14} /> Add Partner
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center px-2">
            <h4 className="text-white font-black text-sm uppercase tracking-widest">New Partnership Listing</h4>
            <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider pl-1">Partner Brand Name</label>
               <input 
                 value={form.name}
                 onChange={e => setForm({ ...form, name: e.target.value })}
                 className={inp}
                 placeholder="e.g. Yalidine Express"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider pl-1">Visual Content Type</label>
               <div className="flex bg-[#07101F] p-1 rounded-xl border border-slate-700">
                  <button 
                    onClick={() => setForm({ ...form, is_emoji: true })}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${form.is_emoji ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Smile size={12} /> Emoji Icon
                  </button>
                  <button 
                    onClick={() => setForm({ ...form, is_emoji: false })}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${!form.is_emoji ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <ImageIcon size={12} /> Image URL
                  </button>
               </div>
            </div>
            <div className="md:col-span-2 space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider pl-1">
                 {form.is_emoji ? 'Enter Single Emoji' : 'Partner Logo Link (Transparent PNG recommended)'}
               </label>
               <input 
                 value={form.content}
                 onChange={e => setForm({ ...form, content: e.target.value })}
                 className={inp}
                 placeholder={form.is_emoji ? "🚀" : "https://ecomate.com/logos/partner.png"}
               />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              onClick={handleSave}
              disabled={processingId === 'new'}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2 text-xs uppercase tracking-widest"
            >
              {processingId === 'new' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Commission Partner
            </button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-3 bg-slate-800 text-slate-400 font-bold rounded-2xl hover:bg-slate-700 transition-all border border-slate-700 text-xs">
              Discard
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map(p => (
          <div key={p.id} className="p-6 bg-[#07101F] border border-slate-800 rounded-3xl group hover:border-slate-700 transition-all shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                {p.is_emoji ? (
                  <span className="text-3xl">{p.content}</span>
                ) : (
                  <img src={p.content} alt={p.name} className="h-8 object-contain px-2" />
                )}
              </div>
              <button 
                onClick={() => handleDelete(p.id)}
                disabled={processingId === p.id}
                className="w-10 h-10 bg-slate-900 text-slate-500 hover:text-red-500 border border-slate-800 hover:border-red-500/20 rounded-xl flex items-center justify-center transition-all"
              >
                {processingId === p.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
            </div>
            <div>
              <h4 className="text-white font-black text-lg tracking-tight truncate">{p.name}</h4>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${p.is_emoji ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
                {p.is_emoji ? 'Vector Emoji' : 'Raster Asset'}
              </p>
            </div>
          </div>
        ))}
        {partners.length === 0 && !isAdding && (
          <div className="col-span-full py-20 text-center space-y-4 border-2 border-dashed border-slate-800/10 rounded-[2.5rem]">
             <Share2 size={40} className="mx-auto text-slate-700" />
             <p className="text-slate-500 font-medium">No platform partners registered. New listings will appear live in the marquee.</p>
          </div>
        )}
      </div>
    </div>
  );
}
