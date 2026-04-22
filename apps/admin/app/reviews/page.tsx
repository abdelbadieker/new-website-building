import { supabaseAdmin } from '@/lib/supabase-admin';
import { MessageSquare, Star, CheckCircle2, Trash2, ShieldAlert, Clock, Filter } from 'lucide-react';
import ReviewsListClient from './ReviewsListClient';

export const dynamic = 'force-dynamic';

export default async function ReviewsManagement() {
  const { data: reviews, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching reviews:', error);

  const allReviews = reviews || [];
  const pendingCount = allReviews.filter(r => !r.is_approved).length;
  const approvedCount = allReviews.filter(r => r.is_approved).length;
  const averageRating = allReviews.length > 0 
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             <MessageSquare className="text-pink-500 w-10 h-10" />
             Review Moderation
          </h2>
          <p className="text-slate-400 mt-1 font-medium italic text-sm">Oversee platform sentiment and manage public feedback pipelines.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-800/50 border border-slate-700 px-6 py-3 rounded-2xl">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Average Rating</div>
              <div className="flex items-center gap-2">
                 <Star className="text-amber-400" size={16} fill="currentColor" />
                 <span className="text-xl font-black text-white">{averageRating} / 5.0</span>
              </div>
           </div>
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0A1628] p-8 rounded-[2rem] border border-slate-800 flex items-center gap-6 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
             <Clock size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Awaiting Approval</p>
            <p className="text-3xl font-black text-white">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-[#0A1628] p-8 rounded-[2rem] border border-slate-800 flex items-center gap-6 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
             <CheckCircle2 size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Publicly Active</p>
            <p className="text-3xl font-black text-white">{approvedCount}</p>
          </div>
        </div>
        <div className="bg-[#0A1628] p-8 rounded-[2rem] border border-slate-800 flex items-center gap-6 shadow-xl relative overflow-hidden group hover:border-pink-500/30 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
             <ShieldAlert size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Submissions</p>
            <p className="text-3xl font-black text-white">{allReviews.length}</p>
          </div>
        </div>
      </div>

      {/* Interactive Review Stream */}
      <div className="bg-[#0A1628] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
         <ReviewsListClient initialReviews={allReviews} />
      </div>
    </div>
  );
}
