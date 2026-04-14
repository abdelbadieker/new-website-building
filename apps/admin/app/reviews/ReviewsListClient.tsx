'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Star, CheckCircle2, XCircle, Trash2, Clock, Calendar, User } from 'lucide-react';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

interface Review {
  id: string;
  name: string;
  email?: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export default function ReviewsListClient({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [supabase] = useState(() => createClient());

  const toggleApproval = async (review: Review) => {
    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: !review.is_approved })
      .eq('id', review.id);

    if (!error) {
      setReviews(reviews.map(r => r.id === review.id ? { ...r, is_approved: !r.is_approved } : r));
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Permanently delete this review? This action cannot be undone.')) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) {
       setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={i < rating ? 'text-amber-400' : 'text-slate-700'} 
        fill={i < rating ? 'currentColor' : 'none'} 
      />
    ));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-800/10 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
            <th className="px-10 py-6">Customer Sentiment</th>
            <th className="px-10 py-6">Rating</th>
            <th className="px-10 py-6">Status</th>
            <th className="px-10 py-6">Submission Date</th>
            <th className="px-10 py-6 text-center">Controls</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {reviews.length === 0 ? (
            <tr><td colSpan={5} className="p-24 text-center text-slate-600 italic font-medium">No reviews found in the database.</td></tr>
          ) : reviews.map(review => (
            <tr key={review.id} className="hover:bg-slate-800/20 transition-all group">
              <td className="px-10 py-8 max-w-md">
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center text-pink-400 font-black border border-slate-700 shrink-0">
                       {review.name?.charAt(0) || <User size={18} />}
                    </div>
                    <div>
                       <div className="font-black text-white leading-tight mb-1">{review.name}</div>
                       <div className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed italic">"{review.comment}"</div>
                    </div>
                 </div>
              </td>
              <td className="px-10 py-8">
                 <div className="flex gap-1">
                    {renderStars(review.rating)}
                 </div>
                 <div className="text-[10px] font-black text-slate-600 mt-2 uppercase tracking-tighter">Verified Review</div>
              </td>
              <td className="px-10 py-8">
                <button 
                  onClick={() => toggleApproval(review)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                    review.is_approved 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}
                >
                  {review.is_approved ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {review.is_approved ? 'Approved' : 'Pending'}
                </button>
              </td>
              <td className="px-10 py-8">
                 <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                    <Calendar size={14} />
                    {new Date(review.created_at).toLocaleDateString()}
                 </div>
              </td>
              <td className="px-10 py-8 text-center">
                 <button 
                   onClick={() => deleteReview(review.id)}
                   className="w-10 h-10 rounded-xl bg-slate-800/50 text-slate-600 hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all border border-slate-700"
                 >
                   <Trash2 size={18} />
                 </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
