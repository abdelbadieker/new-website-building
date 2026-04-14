import { supabaseAdmin } from '@/lib/supabase-admin';
import { LifeBuoy, Filter, Search } from 'lucide-react';
import { SupportTicketsClient } from './SupportTicketsClient';

export const dynamic = 'force-dynamic';

export default async function SupportTicketsManagement() {
  // Fetch real platform support tickets via Super Admin client
  const { data: tickets, error } = await supabaseAdmin
    .from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tickets:', error);
  }

  const allTickets = tickets || [];
  const openTickets = allTickets.filter(t => t.status === 'Open').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             <LifeBuoy className="text-emerald-500 w-8 h-8" />
             Ticket Manager
          </h2>
          <p className="text-slate-400 mt-1 font-medium">Moderate platform support requests and provide administrative assistance.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest text-center">Open Priority</p>
          <p className="text-xl font-black text-white text-center">{openTickets}</p>
        </div>
      </div>

      <div className="bg-[#0A1628] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <SupportTicketsClient initialTickets={allTickets} />
      </div>
    </div>
  );
}
