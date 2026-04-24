'use client';
import { useState, useMemo } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, Clock, Calendar, User, RotateCcw, Loader2 } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  email?: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

type Tab = 'pending' | 'approved';

export default function ReviewsListClient({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [tab, setTab] = useState<Tab>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { pending, approved } = useMemo(() => ({
    pending: reviews.filter(r => !r.is_approved),
    approved: reviews.filter(r => r.is_approved),
  }), [reviews]);

  const visible = tab === 'pending' ? pending : approved;

  async function callApi(body: Record<string, unknown>) {
    const res = await fetch('/api/admin/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Action failed' }));
      throw new Error(err.error || 'Action failed');
    }
    return res.json();
  }

  const approve = async (review: Review) => {
    setProcessingId(review.id);
    try {
      await callApi({ id: review.id, action: 'approve' });
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, is_approved: true } : r));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  const unapprove = async (review: Review) => {
    setProcessingId(review.id);
    try {
      await callApi({ id: review.id, is_approved: false });
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, is_approved: false } : r));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  const reject = async (review: Review) => {
    if (!confirm(`Reject and delete review from ${review.name}? This cannot be undone.`)) return;
    setProcessingId(review.id);
    try {
      await callApi({ id: review.id, action: 'delete' });
      setReviews(prev => prev.filter(r => r.id !== review.id));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  const renderStars = (rating: number) => Array.from({ length: 5 }).map((_, i) => (
    <Star key={i} size={14} className={i < rating ? 'text-amber-400' : 'text-slate-700'} fill={i < rating ? 'currentColor' : 'none'} />
  ));

  return (
    <div>
      <div className="px-8 pt-6 pb-0 flex gap-2 border-b border-slate-800">
        <button
          onClick={() => setTab('pending')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-widest rounded-t-xl border border-b-0 transition-all flex items-center gap-2 ${
            tab === 'pending'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'
          }`}
        >
          <Clock size={14} />
          Pending
          <span className="bg-amber-500/20 text-amber-300 rounded-full px-2 py-0.5 text-[10px] font-black">{pending.length}</span>
        </button>
        <button
          onClick={() => setTab('approved')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-widest rounded-t-xl border border-b-0 transition-all flex items-center gap-2 ${
            tab === 'approved'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'
          }`}
        >
          <CheckCircle2 size={14} />
          Approved
          <span className="bg-emerald-500/20 text-emerald-300 rounded-full px-2 py-0.5 text-[10px] font-black">{approved.length}</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/10 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
              <th className="px-10 py-5">Customer Sentiment</th>
              <th className="px-10 py-5">Rating</th>
              <th className="px-10 py-5">Submission Date</th>
              <th className="px-10 py-5 text-right">Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {visible.length === 0 ? (
              <tr><td colSpan={4} className="p-24 text-center text-slate-600 italic font-medium">
                {tab === 'pending' ? 'No reviews awaiting approval.' : 'No approved reviews yet.'}
              </td></tr>
            ) : visible.map(review => (
              <tr key={review.id} className="hover:bg-slate-800/20 transition-all group">
                <td className="px-10 py-6 max-w-md">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center text-pink-400 font-black border border-slate-700 shrink-0">
                      {review.name?.charAt(0) || <User size={18} />}
                    </div>
                    <div>
                      <div className="font-black text-white leading-tight mb-1">{review.name}</div>
                      {review.email && <div className="text-slate-600 text-[10px] font-medium mb-1">{review.email}</div>}
                      <div className="text-slate-400 text-xs font-medium leading-relaxed italic line-clamp-3">&quot;{review.comment}&quot;</div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                    <Calendar size={14} />
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center justify-end gap-2">
                    {tab === 'pending' ? (
                      <>
                        <button
                          onClick={() => approve(review)}
                          disabled={processingId === review.id}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                          {processingId === review.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                          Approve
                        </button>
                        <button
                          onClick={() => reject(review)}
                          disabled={processingId === review.id}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => unapprove(review)}
                          disabled={processingId === review.id}
                          title="Move back to pending"
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                          {processingId === review.id ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                          Unapprove
                        </button>
                        <button
                          onClick={() => reject(review)}
                          disabled={processingId === review.id}
                          title="Delete permanently"
                          className="w-10 h-10 rounded-xl bg-slate-800/50 text-slate-500 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all border border-slate-700 disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
