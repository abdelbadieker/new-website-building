import { supabaseAdmin } from '@/lib/supabase-admin';
import { Share2 } from 'lucide-react';
import PartnersListClient from './PartnershipsListClient';

export const dynamic = 'force-dynamic';

export default async function PartnershipsCMS() {
  const { data: partners, error } = await supabaseAdmin
    .from('partnerships')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching partners:', error);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
           <Share2 className="text-blue-500 w-10 h-10" />
           Platform Partnerships
        </h2>
        <p className="text-slate-400 mt-1 font-medium italic text-sm">Manage the trust network marquee logos and branding displayed on the landing page.</p>
      </div>

      <div className="bg-[#0A1628] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
         <PartnersListClient initialPartners={partners || []} />
      </div>
    </div>
  );
}
