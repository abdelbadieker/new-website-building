'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Partner = {
  id: string;
  name: string;
  is_emoji: boolean;
  content: string;
  created_at: string;
};

export function PartnershipsMarquee() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchPartners = async () => {
      const { data } = await supabase.from('partnerships').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setPartners(data);
      }
    };
    fetchPartners();
  }, [supabase]);

  if (partners.length === 0) return null;

  return (
    <section className="py-24 bg-[#0A1628] border-y border-slate-800/40 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#07101F] to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto text-center mb-12 px-5 relative z-10">
        <h3 className="text-[#2563EB] font-bold tracking-[0.2em] uppercase text-[10px] mb-3 flex items-center justify-center gap-3">
          <span className="w-8 h-[1px] bg-blue-500/30"></span>
          Trusted Logistics & Business Partners
          <span className="w-8 h-[1px] bg-blue-500/30"></span>
        </h3>
        <p className="text-slate-400 text-sm font-medium">Powering automation across Algeria's top networks</p>
      </div>

      <div className="relative w-full overflow-hidden flex items-center h-20">
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#0A1628] via-[#0A1628]/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#0A1628] via-[#0A1628]/80 to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-mqani gap-16 w-max items-center pr-16 hover:[animation-play-state:paused] transition-all">
          {/* Triplicating for ultra-seamless high-speed loop */}
          {[...partners, ...partners, ...partners].map((partner, i) => (
            <div key={i} className="flex items-center gap-4 shrink-0 group transition-all duration-500">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/30 border border-slate-700/30 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-500/30 transition-all">
                {partner.is_emoji ? (
                  <span className="text-2xl">{partner.content}</span>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={partner.content} alt={partner.name} className="h-6 object-contain max-w-[100px] grayscale transition-all group-hover:grayscale-0" />
                )}
              </div>
              <span className="text-slate-400 group-hover:text-white font-bold text-lg tracking-tight transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes mqani {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-mqani {
          animation: mqani 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
