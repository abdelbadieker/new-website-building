'use client';
import { CreditCard, Check, Zap, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const plans = [
  { name: 'Starter', price: 'DA 2,900', period: '/month', features: ['Up to 100 orders/mo', 'Basic CRM', 'Email support', '1 user'], icon: Zap, color: '#94a3b8' },
  { name: 'Growth', price: 'DA 7,900', period: '/month', features: ['Unlimited orders', 'Full CRM + Analytics', 'AI Chatbot', 'Priority support', '5 users'], icon: CreditCard, color: '#60a5fa' },
  { name: 'Enterprise', price: 'DA 19,900', period: '/month', features: ['Everything in Growth', 'Custom integrations', 'Dedicated account manager', 'White-label options', 'Unlimited users'], icon: Crown, color: '#fbbf24' },
];

export default function BillingPage() {
  const supabase = createClient();
  const [currentPlan, setCurrentPlan] = useState('Starter');
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', data.user.id)
          .single();
        if (profile?.plan) setCurrentPlan(profile.plan);
      }
    });
  }, [supabase]);

  const s = { card: { background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 16, padding: 24 } as React.CSSProperties };

  const handleUpgrade = (planName: string) => {
    const whatsappNumber = "213555123456"; 
    const message = encodeURIComponent(`Hi EcoMate Team! I'd like to update my account to the ${planName} plan. My current plan is ${currentPlan}.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div><h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>Billing & Subscription</h1><p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Manage your plan and payment methods</p></div>

      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Current Plan</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginTop: 4 }}>{currentPlan}</div>
            <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Your next billing date is <span style={{ color: '#34d399', fontWeight: 700 }}>May 12, 2026</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#34d399' }}>{plans.find(p => p.name === currentPlan)?.price || 'DA --'}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>per month</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {plans.map(plan => {
          const Icon = plan.icon;
          const isCurrent = plan.name === currentPlan;
          return (
            <div key={plan.name} style={{ ...s.card, borderColor: isCurrent ? '#34d399' : 'rgba(51,65,85,0.5)', position: 'relative', overflow: 'hidden' }}>
              {isCurrent && <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 12px', borderRadius: 999, background: 'rgba(52,211,153,0.15)', color: '#34d399', fontSize: 11, fontWeight: 700 }}>Current</div>}
              <div style={{ width: 50, height: 50, borderRadius: 14, background: `${plan.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon style={{ width: 24, height: 24, color: plan.color }} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>{plan.name}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: plan.color, margin: '10px 0' }}>{plan.price}<span style={{ fontSize: 14, fontWeight: 500, color: '#64748b' }}>{plan.period}</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                    <Check style={{ width: 16, height: 16, color: '#34d399' }} />{f}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => !isCurrent && handleUpgrade(plan.name)}
                style={{ width: '100%', marginTop: 20, padding: '12px 0', borderRadius: 10, border: isCurrent ? '1px solid #334155' : 'none', background: isCurrent ? 'transparent' : `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`, color: isCurrent ? '#64748b' : '#fff', fontWeight: 700, fontSize: 14, cursor: isCurrent ? 'default' : 'pointer' }}>
                {isCurrent ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
