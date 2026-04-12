'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type Review = { id: string; name: string; email: string; rating: number; comment: string; is_approved: boolean; created_at: string };

export default function ReviewsPage() {
  const supabase = createClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = async () => { const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false }); setReviews(data || []); setLoading(false); };
  useEffect(() => { fetch_(); }, []);

  const toggleApproval = async (id: string, approved: boolean) => {
    await supabase.from('reviews').update({ is_approved: !approved }).eq('id', id);
    await supabase.from('activity_logs').insert({ action: `${approved ? 'Unapproved' : 'Approved'} review`, entity_type: 'review', entity_id: id });
    fetch_();
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await supabase.from('reviews').delete().eq('id', id);
    fetch_();
  };

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-[3px] border-slate-700 border-t-emerald-400 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reviews Management</h2>
          <p className="text-slate-400 text-sm mt-1">
            {reviews.filter(r => r.is_approved).length} approved / {reviews.length} total
          </p>
        </div>
        <div className="text-xs bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
          Live Database Sync
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="bg-[#0A1628] border border-slate-800 rounded-xl p-5 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-xs font-bold">{r.name?.charAt(0)}</div>
                <div><div className="text-white font-medium text-sm">{r.name}</div><div className="text-xs text-slate-500">{r.email}</div></div>
                <div className="ml-3 text-amber-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${r.is_approved ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'}`}>{r.is_approved ? 'Approved' : 'Pending'}</span>
              </div>
              <p className="text-sm text-slate-300 mt-2">{r.comment}</p>
              <p className="text-xs text-slate-500 mt-2">{new Date(r.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => toggleApproval(r.id, r.is_approved)} className={`text-xs font-medium px-3 py-1.5 rounded-md ${r.is_approved ? 'bg-amber-400/10 text-amber-400' : 'bg-emerald-400/10 text-emerald-400'}`}>{r.is_approved ? 'Unapprove' : 'Approve'}</button>
              <button onClick={() => deleteReview(r.id)} className="text-xs font-medium px-3 py-1.5 rounded-md bg-red-400/10 text-red-400">Delete</button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <div className="text-center text-slate-500 py-16">No reviews yet</div>}
      </div>
    </div>
  );
}
