import { supabaseAdmin } from '@/lib/supabase-admin';
import { Share2, Plus, ExternalLink, MousePointer2 } from 'lucide-react';
import { PartnershipsClient } from './PartnershipsClient';

export const dynamic = 'force-dynamic';

export default async function PartnershipsManagement() {
  const { data: links } = await supabaseAdmin
    .from('partner_links')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: clicks } = await supabaseAdmin
    .from('partner_clicks')
    .select('*')
    .order('clicked_at', { ascending: false })
    .limit(10);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Partner Ecosystem</h2>
          <p className="text-slate-400 mt-1 font-medium">Manage external service integrations and track click-through intelligence.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-2xl">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active Partners</p>
            <p className="text-xl font-black text-white">{links?.length || 0}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Recent Clicks</p>
            <p className="text-xl font-black text-white">{clicks?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <PartnershipsClient initialLinks={links || []} />
        </div>

        <div className="space-y-6">
          <div className="bg-[#0A1628] border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <MousePointer2 size={14} className="text-blue-500" />
              Live Click Intelligence
            </h3>
            <div className="space-y-4">
              {clicks?.map((c) => (
                <div key={c.id} className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white uppercase">{c.service.replace('-', ' ')}</p>
                    <p className="text-[10px] text-slate-500">{c.user_email}</p>
                  </div>
                  <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded uppercase">
                    {new Date(c.clicked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {(!clicks || clicks.length === 0) && (
                <p className="text-xs text-slate-500 italic text-center py-4">No click data available yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
