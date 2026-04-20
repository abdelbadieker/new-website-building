import { supabaseAdmin } from '@/lib/supabase-admin';
import { CreditCard, CheckCircle2, XCircle, Clock, Search } from 'lucide-react';
import { SubscriptionsClient } from './SubscriptionsClient';

export const dynamic = 'force-dynamic';

export default async function SubscriptionsPage() {
  // Use service-role client to bypass RLS — anon client can't see all subscriptions
  const [{ data: profiles }, { data: subs }] = await Promise.all([
    supabaseAdmin.from('profiles').select('id, full_name, email, plan').order('full_name'),
    supabaseAdmin
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false }),
  ]);

  const allSubs = subs || [];
  const pending = allSubs.filter(s => s.status === 'pending').length;
  const active = allSubs.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <CreditCard className="text-blue-400 w-9 h-9" />
            Subscription Manager
          </h2>
          <p className="text-slate-400 mt-1 font-medium">
            Review and approve manual payment submissions from merchants.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-2xl">
            <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-0.5">Pending Approval</p>
            <p className="text-2xl font-black text-white">{pending}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-2xl">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-0.5">Active Plans</p>
            <p className="text-2xl font-black text-white">{active}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0A1628] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <SubscriptionsClient
          initialSubs={allSubs}
          merchants={profiles || []}
        />
      </div>

      <div className="bg-blue-600/5 border border-blue-500/20 rounded-3xl p-6 flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 shrink-0">
          <CreditCard size={22} />
        </div>
        <div>
          <h4 className="font-bold text-white mb-1">Manual Payment Protocol</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            Merchants pay via Baridimob or CCP and submit a payment screenshot here.
            You verify the screenshot, enter the confirmed reference, and click Activate.
            The merchant instantly receives an activation email and their plan goes live.
          </p>
        </div>
      </div>
    </div>
  );
}
