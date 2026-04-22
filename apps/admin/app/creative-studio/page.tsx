import { supabaseAdmin } from '@/lib/supabase-admin';
import { Video, Clock, Filter, Sparkles } from 'lucide-react';
import { CreativeStudioClient } from './CreativeStudioClient';

export const dynamic = 'force-dynamic';

export default async function CreativeStudioManagement() {
  // Fetch real platform briefs via Super Admin client
  // This resolves the "missing briefs" sync issue
  const { data: briefs, error } = await supabaseAdmin
    .from('creative_briefs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching briefs:', error);
  }

  const allBriefs = briefs || [];
  const activeRequests = allBriefs.filter(b => b.status !== 'Completed').length;
  const completedDeliveries = allBriefs.filter(b => b.status === 'Completed').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Creative Production</h2>
          <p className="text-slate-400 mt-1 font-medium">Coordinate video production, manage creative briefs, and secure deliveries.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-2xl">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active Requests</p>
            <p className="text-xl font-black text-white">{activeRequests}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Delivered</p>
            <p className="text-xl font-black text-white">{completedDeliveries}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0A1628] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <CreativeStudioClient initialBriefs={allBriefs} />
      </div>

      {/* Production Tip */}
      <div className="bg-gradient-to-r from-blue-600/10 to-emerald-500/10 border border-slate-800 rounded-3xl p-6 flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400 shrink-0 border border-white/5">
          <Sparkles size={24} />
        </div>
        <div>
          <h4 className="font-bold text-white mb-1">Production Handover Protocol</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            When delivering content, ensure the Google Drive link is set to "Anyone with the link can view". Completing a brief will automatically trigger a notification in the specific client dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
