import { supabaseAdmin } from '@/lib/supabase-admin';
import { Users, Search, ShoppingBag, DollarSign, ShieldAlert, Award, MoreVertical, Trash2, Edit } from 'lucide-react';
import { MerchantsListClient } from './MerchantsListClient';

export const dynamic = 'force-dynamic';

export default async function MerchantsManagement() {
  // Fetch real platform-wide merchant data via Super Admin client
  // This bypasses RLS and solves the "0 registered users" issue
  const { data: merchants, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching merchants:', error);
  }

  const allMerchants = merchants || [];
  
  // Aggregate stats for the top section
  const totalMerchants = allMerchants.length;
  const growthPlanCount = allMerchants.filter(m => m.plan === 'Growth').length;
  const enterprisePlanCount = allMerchants.filter(m => m.plan === 'Enterprise').length;
  const bannedCount = allMerchants.filter(m => m.is_banned).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Merchant & User Hub</h2>
          <p className="text-slate-400 mt-1 font-medium">Manage platform accounts, subscriptions, and access controls.</p>
        </div>
        <div className="bg-blue-500 text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 flex items-center gap-2">
          <Users size={18} />
          {totalMerchants} Total Registered
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0A1628] p-6 rounded-3xl border border-slate-800 flex items-center justify-between group shadow-lg">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Growth Plans</p>
            <p className="text-2xl font-black text-emerald-400">{growthPlanCount}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Award size={24} />
          </div>
        </div>
        <div className="bg-[#0A1628] p-6 rounded-3xl border border-slate-800 flex items-center justify-between group shadow-lg">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Enterprise</p>
            <p className="text-2xl font-black text-blue-400">{enterprisePlanCount}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Award size={24} />
          </div>
        </div>
        <div className="bg-[#0A1628] p-6 rounded-3xl border border-slate-800 flex items-center justify-between group shadow-lg">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Account Bans</p>
            <p className="text-2xl font-black text-red-500">{bannedCount}</p>
          </div>
          <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldAlert size={24} />
          </div>
        </div>
        <div className="bg-[#0A1628] p-6 rounded-3xl border border-slate-800 flex items-center justify-between group shadow-lg">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">New this month</p>
            <p className="text-2xl font-black text-slate-400">0</p>
          </div>
           <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
        </div>
      </div>

      {/* Main Merchants Table Client Component */}
      <div className="bg-[#0A1628] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <MerchantsListClient initialMerchants={allMerchants} />
      </div>

      {/* Note Section */}
      <div className="bg-blue-600/5 border border-blue-500/20 rounded-3xl p-6 flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 shrink-0">
          <Award size={24} />
        </div>
        <div>
          <h4 className="font-bold text-white mb-1">Data Governance Notice</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            All user data presented here is fetched via the Super Admin protocol. Modifications to subscription plans or account status are logged and applied globally across the EcoMate network.
          </p>
        </div>
      </div>
    </div>
  );
}
