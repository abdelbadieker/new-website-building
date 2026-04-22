import { supabaseAdmin } from '@/lib/supabase-admin';
import TicketsClient from './TicketsClient';
import { MessageSquare, LifeBuoy } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TicketsManagementPage() {
  const { data: tickets, error } = await supabaseAdmin
    .from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tickets:', error);
  }

  const allTickets = tickets || [];
  const openCount = allTickets.filter(t => t.status === 'Open').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="text-blue-500 w-10 h-10" />
            Support Command Center
          </h2>
          <p className="text-slate-400 mt-1 font-medium">Manage merchant inquiries and resolve technical support nodes.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-amber-500/10 border border-amber-500/20 px-5 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-xs font-black text-amber-500 uppercase tracking-widest">{openCount} Pending Tickets</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0A1628] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <TicketsClient initialTickets={allTickets} />
      </div>

      {/* Admin Advisory */}
      <div className="bg-blue-600/5 border border-blue-500/20 rounded-3xl p-6 flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 shrink-0">
          <LifeBuoy size={24} />
        </div>
        <div>
          <h4 className="font-bold text-white mb-1">Administrative Protocol</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            All replies sent through this portal are transmitted directly to the merchant's dashboard. Resolving a ticket hides it from the merchant's active queue but preserves it in the platform history for auditing.
          </p>
        </div>
      </div>
    </div>
  );
}
