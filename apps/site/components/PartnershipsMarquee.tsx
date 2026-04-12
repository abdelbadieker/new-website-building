'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function PartnershipsMarquee() {
  const [partners, setPartners] = useState<any[]>([]);
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
    <section className="py-20 bg-[#0A1628] border-y border-slate-800/50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto text-center mb-10 px-5">
        <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">
          Trusted by Top Partners & Logistics Networks
        </p>
      </div>

      <div className="relative w-full overflow-hidden flex">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A1628] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A1628] to-transparent z-10 pointer-events-none"></div>

        {/* CSS Keyframes for the marquee are already in tailwind config under 'mqani' likely, if not we inline style */}
        <div className="flex animate-mqani gap-12 w-max items-center pr-12">
          {/* We duplicate the array to create a seamless loop effect */}
          {[...partners, ...partners, ...partners].map((partner, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all cursor-default">
              {partner.is_emoji ? (
                <span className="text-4xl">{partner.content}</span>
              ) : (
                <img src={partner.content} alt={partner.name} className="h-10 object-contain max-w-[150px]" />
              )}
              <span className="text-white font-bold text-xl tracking-tight hidden md:inline-block">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
