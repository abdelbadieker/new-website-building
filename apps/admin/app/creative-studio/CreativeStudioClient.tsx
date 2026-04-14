'use client';
import { useState } from 'react';
import { 
  Video, 
  User, 
  Calendar, 
  ExternalLink, 
  X, 
  Send, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Loader2,
  FileText,
  Link as LinkIcon
} from 'lucide-react';

type Brief = { 
  id: string; 
  user_email: string; 
  video_type: string; 
  duration: string; 
  description: string; 
  reference_url: string; 
  reference_description: string; 
  status: string; 
  admin_notes: string; 
  delivery_url: string; 
  created_at: string 
};

export function CreativeStudioClient({ initialBriefs }: { initialBriefs: Brief[] }) {
  const [briefs, setBriefs] = useState<Brief[]>(initialBriefs);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);

  const handleUpdate = async (id: string, updates: Partial<Brief>) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });
      if (!res.ok) throw new Error('Action failed');
      
      setBriefs(current => current.map(b => b.id === id ? { ...b, ...updates } : b));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanent delete this creative brief and all associated delivery data?')) return;
    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'delete' })
      });
      if (!res.ok) throw new Error('Deletion failed');
      setBriefs(current => current.filter(b => b.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="divide-y divide-slate-800">
      {briefs.length === 0 ? (
        <div className="p-20 text-center space-y-4">
           <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
             <Video size={32} />
           </div>
           <p className="text-slate-500 font-medium">No client briefs detected in the production pipeline.</p>
        </div>
      ) : briefs.map((b) => (
        <div key={b.id} className="p-8 group hover:bg-slate-800/20 transition-all flex flex-col lg:flex-row gap-8">
          {/* Section 1: Client Metadata */}
          <div className="lg:w-1/4 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center shadow-inner">
                  <User size={20} />
                </div>
                <div>
                  <div className="text-white font-black text-sm">{b.user_email}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Calendar size={10} /> {new Date(b.created_at).toLocaleDateString()}
                  </div>
                </div>
             </div>

             <div className="p-4 bg-[#07101F] border border-slate-700 rounded-2xl space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Production Status</label>
                <select 
                  value={b.status}
                  onChange={(e) => handleUpdate(b.id, { status: e.target.value })}
                  disabled={processingId === b.id}
                  className={`w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs font-black outline-none transition-all appearance-none ${
                    b.status === 'Completed' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 
                    b.status === 'In Progress' ? 'text-blue-400 border-blue-500/20 bg-blue-500/5' : 
                    'text-amber-400 border-amber-500/20 bg-amber-500/5'
                  }`}
                >
                  <option value="Pending">🕒 Pending Review</option>
                  <option value="In Progress">⚙️ In Production</option>
                  <option value="Completed">✅ Delivered</option>
                </select>
             </div>
          </div>

          {/* Section 2: Creative Requirements */}
          <div className="lg:w-1/2 space-y-6">
             <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-wider">{b.video_type}</span>
                <span className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider">{b.duration}</span>
             </div>
             <div>
                <p className="text-white text-sm leading-relaxed bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50 italic shadow-inner">
                  "{b.description}"
                </p>
             </div>
             {b.reference_url && (
                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center justify-between group/ref">
                  <div className="flex items-center gap-3 min-w-0">
                    <LinkIcon className="text-blue-500 shrink-0" size={16} />
                    <span className="text-xs text-slate-400 truncate pr-4">{b.reference_url}</span>
                  </div>
                  <a href={b.reference_url} target="_blank" rel="noreferrer" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl">
                    <ExternalLink size={16} />
                  </a>
                </div>
             )}
          </div>

          {/* Section 3: Delivery Protocol */}
          <div className="lg:w-1/4 space-y-4">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                    <Send size={12} /> Delivery Asset (Cloud Link)
                  </span>
                  {b.delivery_url && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const inp = document.getElementById(`delivery-${b.id}`) as HTMLInputElement;
                          if (inp) inp.focus();
                        }}
                        className="text-[9px] font-black text-blue-400 uppercase hover:underline"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleUpdate(b.id, { delivery_url: '' })}
                        className="text-[9px] font-black text-red-500 uppercase hover:underline"
                      >
                        Delete Delivery
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative group/delivery">
                  <input 
                    id={`delivery-${b.id}`}
                    placeholder="Paste Google Drive / Cloud Link..."
                    defaultValue={b.delivery_url || ''}
                    className="w-full bg-[#07101F] border border-slate-700 group-hover/delivery:border-emerald-500/50 rounded-2xl px-4 py-4 text-xs text-white outline-none transition-all pr-12 font-bold shadow-inner"
                  />
                  {b.delivery_url && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => {
                    const inp = document.getElementById(`delivery-${b.id}`) as HTMLInputElement;
                    handleUpdate(b.id, { delivery_url: inp?.value, status: 'Completed' });
                  }}
                  disabled={processingId === b.id}
                   className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                >
                  {processingId === b.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  {b.delivery_url ? 'Update Delivery Link' : 'Commit & Deliver'}
                </button>
              </div>

             <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDelete(b.id)}
                  className="flex-1 py-3 bg-red-500/5 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 border border-red-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Terminate Request
                </button>
                <button className="w-12 h-12 bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all border border-slate-700">
                  <MoreVertical size={18} />
                </button>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}
