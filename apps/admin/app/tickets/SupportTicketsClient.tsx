'use client';
import { useState } from 'react';
import { 
  MessageSquare, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Send, 
  Trash2, 
  MoreVertical, 
  Loader2 
} from 'lucide-react';

type Ticket = { 
  id: string; 
  subject: string; 
  message: string; 
  status: string; 
  priority: string; 
  admin_reply: string | null; 
  user_email: string; 
  created_at: string 
};

export function SupportTicketsClient({ initialTickets }: { initialTickets: Ticket[] }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleUpdate = async (id: string, updates: Partial<Ticket>) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });
      if (!res.ok) throw new Error('Action failed');
      
      setTickets(current => current.map(t => t.id === id ? { ...t, ...updates } : t));
      if (selectedTicket?.id === id) {
        setSelectedTicket(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this support ticket?')) return;
    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'delete' })
      });
      if (!res.ok) throw new Error('Deletion failed');
      setTickets(current => current.filter(t => t.id !== id));
      if (selectedTicket?.id === id) setSelectedTicket(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const prioColors: Record<string, string> = { 
    Low: 'text-slate-400 bg-slate-400/10 border-slate-400/20', 
    Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20', 
    High: 'text-orange-500 bg-orange-500/10 border-orange-500/20', 
    Urgent: 'text-red-500 bg-red-500/10 border-red-500/20' 
  };

  const statusColors: Record<string, string> = { 
    Open: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', 
    Resolved: 'bg-slate-800 text-slate-500 border-slate-700', 
    Processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
  };

  return (
    <div className="flex flex-col lg:flex-row h-[700px]">
      {/* Ticket List */}
      <div className="lg:w-1/3 border-r border-slate-800 overflow-y-auto custom-scrollbar bg-[#0A1628]/50">
        <div className="p-6 border-b border-slate-800 bg-slate-900/30">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Incoming Stream</h3>
        </div>
        <div className="divide-y divide-slate-800">
          {tickets.length === 0 ? (
            <div className="p-12 text-center text-slate-500 italic text-sm">No tickets found.</div>
          ) : tickets.map((t) => (
            <div 
              key={t.id} 
              onClick={() => {
                setSelectedTicket(t);
                setReplyText(t.admin_reply || '');
              }}
              className={`p-6 cursor-pointer transition-all hover:bg-slate-800/40 relative group ${selectedTicket?.id === t.id ? 'bg-blue-600/10 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${prioColors[t.priority]}`}>
                  {t.priority}
                </span>
                <span className="text-[10px] text-slate-500 font-bold">{new Date(t.created_at).toLocaleDateString()}</span>
              </div>
              <h4 className="text-sm font-black text-white line-clamp-1">{t.subject}</h4>
              <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-medium">{t.user_email}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusColors[t.status]}`}>
                  {t.status}
                </span>
                {t.admin_reply && (
                   <div className="w-5 h-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                     <CheckCircle2 size={12} />
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Detail & Reply */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#07101F]">
        {selectedTicket ? (
          <div className="p-10 space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center shadow-inner">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{selectedTicket.user_email}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Client Contact</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleUpdate(selectedTicket.id, { status: 'Resolved' })}
                  className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Mark Resolved
                </button>
                <button 
                  onClick={() => handleDelete(selectedTicket.id)}
                  className="w-10 h-10 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all flex items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] shadow-inner space-y-4">
               <h2 className="text-xl font-black text-white">{selectedTicket.subject}</h2>
               <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                 {selectedTicket.message}
               </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 text-blue-400">
                <Send size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Administrative Response</span>
              </div>
              <textarea 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Draft your response here..."
                className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-sm text-white outline-none focus:border-blue-500 transition-all min-h-[150px] shadow-inner font-medium"
              />
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => handleUpdate(selectedTicket.id, { status: 'Processing' })}
                  className="px-6 py-3 bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Save as Draft
                </button>
                <button 
                  onClick={() => handleUpdate(selectedTicket.id, { admin_reply: replyText, status: 'Resolved' })}
                  disabled={processingId === selectedTicket.id}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"
                >
                  {processingId === selectedTicket.id ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  Send Response & Close
                </button>
              </div>
            </div>

            {selectedTicket.admin_reply && (
               <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl mt-8">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <CheckCircle2 size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Current Active Reply</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium italic">"{selectedTicket.admin_reply}"</p>
               </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
            <MessageSquare size={64} className="opacity-20" />
            <p className="text-xs font-black uppercase tracking-widest opacity-50">Select a support stream to respond</p>
          </div>
        )}
      </div>
    </div>
  );
}
