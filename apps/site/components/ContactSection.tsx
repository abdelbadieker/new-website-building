'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Phone, Mail, MessageSquare, MapPin, LucideIcon } from 'lucide-react';

interface PlatformContact {
  id: string;
  type: 'phone' | 'email' | 'whatsapp' | 'address';
  value: string;
  icon: string;
  is_active: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  phone: Phone,
  email: Mail,
  whatsapp: MessageSquare,
  address: MapPin,
};

export function ContactSection() {
  const [contacts, setContacts] = useState<PlatformContact[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('platform_contacts')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => {
        if (data) setContacts(data);
      });
  }, [supabase]);

  if (contacts.length === 0) return null;

  return (
    <section id="contact" className="py-24 bg-[#07101F] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Have questions about how EcoMate can transform your business? Our team is ready to help you get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contacts.map((contact) => {
            const Icon = ICON_MAP[contact.type] || Phone;
            return (
              <div 
                key={contact.id}
                className="bg-[#0A1628] border border-slate-800 p-8 rounded-3xl hover:border-blue-500/30 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{contact.type}</h3>
                <p className="text-xl font-bold text-white break-words">{contact.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 p-8 md:p-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[40px] text-center shadow-[0_20px_50px_rgba(37,99,235,0.3)]">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Experience the future of sales automation</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the leading merchants in Algeria who are already using EcoMate to scale their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:shadow-lg transition-all">Start Your Free Trial</a>
            <a href="#how" className="bg-blue-700/50 text-white border border-blue-400/30 px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all">How it works</a>
          </div>
        </div>
      </div>
    </section>
  );
}
