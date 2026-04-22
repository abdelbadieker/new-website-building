'use client';

import React from 'react';
import { Lock, Sparkles, ShieldAlert, Rocket } from 'lucide-react';

interface SectionLockProps {
  title: string;
  description?: string;
}

export default function SectionLock({ title, description }: SectionLockProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <div style={{
        background: 'rgba(10, 22, 40, 0.4)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        borderRadius: '32px',
        padding: '60px 40px',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.1), rgba(59, 130, 246, 0.1))',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
          }}>
            <Lock style={{ width: 32, height: 32, color: '#34d399' }} />
          </div>

          <h2 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#f1f5f9',
            marginBottom: '12px',
            letterSpacing: '-0.02em'
          }}>
            {title} is Locked
          </h2>
          
          <p style={{
            fontSize: '15px',
            color: '#94a3b8',
            lineHeight: 1.6,
            marginBottom: '32px'
          }}>
            {description || `This feature is currently not included in your plan. Upgrade your subscription or contact the administrator to unlock the full potential of EcoMate.`}
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button 
              onClick={() => window.location.href = '/billing'}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #34d399, #3b82f6)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 10px 15px -3px rgba(52, 211, 153, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Rocket style={{ width: 18, height: 18 }} /> Upgrade Now
            </button>
            
            <button 
              onClick={() => window.location.href = '/support'}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: '12px',
                background: 'rgba(51, 65, 85, 0.3)',
                color: '#e2e8f0',
                fontSize: '15px',
                fontWeight: 600,
                border: '1px solid rgba(51, 65, 85, 0.5)',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(51, 65, 85, 0.3)'}
            >
              Contact Support
            </button>
          </div>

          <div style={{ 
            marginTop: '40px', 
            paddingTop: '24px', 
            borderTop: '1px solid rgba(51, 65, 85, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
              <ShieldAlert style={{ width: 14, height: 14 }} /> Secure Access
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
              <Sparkles style={{ width: 14, height: 14 }} /> Premium Feature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
