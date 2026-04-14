import { supabaseAdmin } from '@/lib/supabase-admin';
import { LockerClient } from './LockerClient';
import { ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ModuleLockerPage() {
  const { data: merchants, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email, plan, locked_sections')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-red-500/5 border border-red-500/20 rounded-3xl">
        <ShieldAlert className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-black text-white capitalize">Security Layer Exception</h2>
        <p className="text-slate-400 mt-2 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">Governance: Module Locker</h2>
        <p className="text-slate-400 mt-1 font-medium">Enforce granular access control by locking or unlocking specific dashboard sections for each merchant.</p>
      </div>

      <LockerClient initialMerchants={merchants || []} />
    </div>
  );
}
