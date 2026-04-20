'use client';
import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Loader2, ExternalLink, User } from 'lucide-react';

type Sub = {
  id: string;
  merchant_id: string;
  plan: string;
  status: string;
  payment_ref: string | null;
  payment_type: string | null;
  payment_proof: string | null;
  notes: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
};

type Merchant = {
  id: string;
  full_name: string;
  email: string;
  plan: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  active:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  expired:  'bg-slate-700 text-slate-400 border-slate-600',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  growth: 'Growth',
  business: 'Business',
};

export function SubscriptionsClient({
  initialSubs,
  merchants,
}: {
  initialSubs: Sub[];
  merchants: Merchant[];
}) {
  const [subs, setSubs] = useState<Sub[]>(initialSubs);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const merchantMap = new Map(merchants.map(m => [m.id, m]));

  const filtered = subs.filter(s => filter === 'all' || s.status === filter);

  const performAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Action failed');
      const newStatus = action === 'approve' ? 'active' : 'rejected';
      setSubs(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      {/* Filter Tabs */}
      <div className="px-8 py-4 border-b border-slate-800 flex gap-2">
        {['all', 'pending', 'active', 'expired', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            {f} ({f === 'all' ? subs.length : subs.filter(s => s.status === f).length})
          </button>
        ))}
      </div>

      <div className="divide-y divide-slate-800">
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Clock className="mx-auto mb-3 text-slate-700" size={36} />
            <p className="text-slate-500 font-medium">No subscription records found.</p>
          </div>
        ) : filtered.map(sub => {
          const merchant = merchantMap.get(sub.merchant_id);
          return (
            <div key={sub.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-slate-800/20 transition-colors">
              {/* Merchant Info */}
              <div className="md:w-1/4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0 font-black">
                  {merchant?.full_name?.charAt(0) || <User size={18} />}
                </div>
                <div className="min-w-0">
                  <div className="font-black text-white text-sm truncate">{merchant?.full_name || 'Unknown'}</div>
                  <div className="text-[11px] text-slate-500 truncate">{merchant?.email}</div>
                </div>
              </div>

              {/* Plan + Status */}
              <div className="md:w-1/4 space-y-2">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Requested</div>
                <div className="font-black text-white">{PLAN_LABELS[sub.plan] || sub.plan}</div>
                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border ${STATUS_STYLES[sub.status] || STATUS_STYLES.expired}`}>
                  {sub.status}
                </span>
              </div>

              {/* Payment Details */}
              <div className="md:w-1/4 space-y-2">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payment</div>
                <div className="text-sm text-slate-300">
                  {sub.payment_type ? <span className="capitalize">{sub.payment_type}</span> : <span className="text-slate-600">—</span>}
                </div>
                {sub.payment_ref && (
                  <code className="text-[10px] text-blue-400 bg-blue-500/5 border border-blue-500/10 px-2 py-1 rounded-lg font-mono">
                    {sub.payment_ref}
                  </code>
                )}
                {sub.payment_proof && (
                  <a
                    href={sub.payment_proof}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-black uppercase hover:underline"
                  >
                    <ExternalLink size={12} /> View Proof
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="md:w-1/4 flex items-center gap-3">
                {sub.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => performAction(sub.id, 'approve')}
                      disabled={processingId === sub.id}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      {processingId === sub.id
                        ? <Loader2 size={12} className="animate-spin" />
                        : <CheckCircle2 size={12} />}
                      Activate
                    </button>
                    <button
                      onClick={() => performAction(sub.id, 'reject')}
                      disabled={processingId === sub.id}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      {processingId === sub.id
                        ? <Loader2 size={12} className="animate-spin" />
                        : <XCircle size={12} />}
                      Reject
                    </button>
                  </>
                ) : (
                  <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                    {sub.status === 'active' ? '✅ Activated' : sub.status === 'rejected' ? '❌ Rejected' : '⏰ Expired'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
