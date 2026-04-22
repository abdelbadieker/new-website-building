import { supabaseAdmin } from '@/lib/supabase-admin';
import { Briefcase, Plus, Settings2, ShieldCheck, LayoutGrid, ArrowRight } from 'lucide-react';
import ServicesListClient from './ServicesListClient';

export const dynamic = 'force-dynamic';

export default async function ServicesManagement() {
  const { data: services, error } = await supabaseAdmin
    .from('services')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) console.error('Error fetching services:', error);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             <Briefcase className="text-cyan-500 w-10 h-10" />
             Service Inventory
          </h2>
          <p className="text-slate-400 mt-1 font-medium italic text-sm">Orchestrate platform capabilities and manage public-facing service modules.</p>
        </div>
        <div className="flex gap-4">
           {/* Summary Stats */}
           <div className="flex gap-4">
             <div className="bg-slate-800/50 border border-slate-700 px-6 py-3 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black">
                   {services?.length || 0}
                </div>
                <div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Nodes</div>
                   <div className="text-xs font-bold text-white">System Services</div>
                </div>
             </div>
           </div>
        </div>
      </div>

      <div className="bg-[#0A1628] border border-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-blue-600"></div>
         <ServicesListClient initialServices={services || []} />
      </div>
    </div>
  );
}
