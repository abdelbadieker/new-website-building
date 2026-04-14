'use client';
import { useState } from 'react';
import { Search, Clock, CheckCircle2, AlertCircle, MessageSquare, Send, Trash2, Loader2, User, ChevronRight } from 'lucide-react';

type Ticket = {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  admin_reply: string | null;
  user_email: string;
  created_at: string;
};

export default function TicketsClient({ initialTickets }: { initialTickets: Ticket[] }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdate = async (id: string, updates: Partial<Ticket>) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });
      if (!res.ok) throw new Error('Update failed');
      
      setTickets(current => current.map(t => t.id === id ? { ...t, ...updates } : t));
      if (selectedTicket?.id === id) {
        setSelectedTicket({ ...selectedTicket, ...updates });
      }
      if (updates.admin_reply) setReply('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this ticket?')) return;
    setProcessingId(id);
    try {
       const res = await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'delete' })
      });
      if (!res.ok) throw new Error('Deletion failed');
      setTickets(current => current.filter(t => t.id !== id));
      setSelectedTicket(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Normal': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="flex h-[700px]">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              placeholder="Search tickets or merchants..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#07101F] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-[11px] outline-none focus:border-blue-500 transition-all font-bold placeholder:uppercase placeholder:tracking-tighter"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
          {filteredTickets.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className={`w-full text-left p-6 hover:bg-slate-800/20 transition-all group relative ${selectedTicket?.id === t.id ? 'bg-slate-800/40' : ''}`}
            >
              {selectedTicket?.id === t.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getPriorityColor(t.priority)}`}>
                  {t.priority}
                </span>
                <span className="text-[10px] text-slate-500 font-bold">{new Date(t.created_at).toLocaleDateString()}</span>
              </div>
              <h4 className="text-white font-bold text-sm line-clamp-1 mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{t.subject}</h4>
              <p className="text-slate-500 text-[11px] font-medium line-clamp-1 truncate">{t.user_email}</p>
              <div className="mt-3 flex items-center justify-between">
                 <span className={`text-[9px] font-black uppercase tracking-tighter ${t.status === 'Open' ? 'text-amber-500' : 'text-emerald-500'}`}>
                   {t.status === 'Open' ? '• Deployment Pending' : '• Service Resolved'}
                 </span>
                 <ChevronRight size={14} className={`text-slate-700 transition-transform ${selectedTicket?.id === t.id ? 'translate-x-1 text-blue-500' : ''}`} />
              </div>
            </button>
          ))}
          {filteredTickets.length === 0 && (
             <div className="p-10 text-center text-slate-600 italic text-xs font-medium uppercase tracking-widest">No active logs matching search</div>
          )}
        </div>
      </div>

      {/* Detail Area */}
      <div className="flex-1 flex flex-col bg-slate-800/5">
        {selectedTicket ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="p-8 border-b border-slate-800 bg-[#0A1628]/50 flex justify-between items-center shrink-0">
               <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <User size={14} className="text-blue-400" />
                    <span className="text-xs font-bold text-slate-400">{selectedTicket.user_email}</span>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleUpdate(selectedTicket.id, { status: selectedTicket.status === 'Open' ? 'Resolved' : 'Open' })}
                    disabled={processingId === selectedTicket.id}
                    className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                      selectedTicket.status === 'Open' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
                    }`}
                  >
                    {selectedTicket.status === 'Open' ? 'Resolve Node' : 'Reopen Node'}
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedTicket.id)}
                    className="w-10 h-10 bg-slate-800 text-red-500/50 hover:text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500/10 transition-all border border-slate-700"
                  >
                    <Trash2 size={18} />
                  </button>
               </div>
            </div>

            {/* Conversation */}
            <div className="flex-1 overflow-y-auto p-12 space-y-8 bg-[radial-gradient(circle_at_50%_0%,#0f172a_0%,transparent_100%)]">
               {/* User Message */}
               <div className="flex gap-6 max-w-3xl">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black border border-blue-500/20 shrink-0">U</div>
                  <div className="space-y-3">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Merchant Transmission</div>
                    <div className="bg-[#0A1628] border border-slate-800 p-6 rounded-3xl rounded-tl-none shadow-xl text-slate-300 text-sm leading-relaxed font-medium">
                      {selectedTicket.message}
                    </div>
                  </div>
               </div>

               {/* Admin Reply History */}
               {selectedTicket.admin_reply && (
                 <div className="flex gap-6 max-w-3xl ml-auto flex-row-reverse animate-in slide-in-from-right-4 duration-500">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-black border border-emerald-500/20 shrink-0">A</div>
                    <div className="space-y-3 text-right">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin Response Node</div>
                      <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl rounded-tr-none shadow-xl text-emerald-100/80 text-sm leading-relaxed font-medium">
                        {selectedTicket.admin_reply}
                      </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Reply Input */}
            <div className="p-8 bg-[#0A1628]/80 backdrop-blur-md border-t border-slate-800 shrink-0">
               <div className="relative group">
                  <textarea 
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Initialize administrative response sequence..."
                    className="w-full bg-[#07101F] border border-slate-700 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all font-medium text-sm h-32 resize-none placeholder:text-slate-600 placeholder:italic"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-4">
                     <button 
                       onClick={() => handleUpdate(selectedTicket.id, { admin_reply: reply })}
                       disabled={!reply.trim() || processingId === selectedTicket.id}
                       className="bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:grayscale text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-blue-900/40"
                     >
                       {processingId === selectedTicket.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                       Transmit Response
                     </button>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
             <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-slate-700 mb-8 border border-slate-700/50">
               <AlertCircle size={48} />
             </div>
             <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Awaiting Node Selection</h3>
             <p className="text-slate-500 max-w-md font-medium leading-relaxed">Select a communication thread from the terminal on the left to initialize management protocols.</p>
          </div>
        )}
      </div>
    </div>
  );
}
