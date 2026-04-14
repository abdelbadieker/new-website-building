'use client';
import { useState } from 'react';
import { Search, Lock, Unlock, Loader2, ShieldCheck, User, Check, X } from 'lucide-react';

type Merchant = {
  id: string;
  full_name: string;
  email: string;
  plan: string;
  locked_sections: string[] | null;
};

const MODULES = [
  { id: 'products', name: 'Products Inventory', description: 'Catalog and item management' },
  { id: 'orders', name: 'Revenue & Orders', description: 'Order processing and sales tracking' },
  { id: 'fulfillment', name: 'Fulfillment Engine', description: 'Shipping and delivery tracking' },
  { id: 'crm', name: 'CRM Hub', description: 'Customer management and bulk import' },
  { id: 'creative', name: 'Creative Studio', description: 'Content requests and delivery' },
  { id: 'chatbot', name: 'AI Sales Chatbot', description: 'Automation and lead handling' },
  { id: 'analytics', name: 'Analytics & Insights', description: 'Performance metrics and reports' },
  { id: 'ecotrack', name: 'EcoTrack System', description: 'Logistics and delivery monitoring' }
];

export function LockerClient({ initialMerchants }: { initialMerchants: Merchant[] }) {
  const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  const filtered = merchants.filter(m => 
    m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleModule = async (moduleId: string) => {
    if (!selectedMerchant) return;
    
    const currentLocked = selectedMerchant.locked_sections || [];
    const isLocked = currentLocked.includes(moduleId);
    const newLocked = isLocked 
      ? currentLocked.filter(id => id !== moduleId) 
      : [...currentLocked, moduleId];

    setProcessingId(moduleId);
    try {
      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: selectedMerchant.id, 
          locked_sections: newLocked 
        })
      });

      if (!res.ok) throw new Error('Failed to update locker status');

      // Update local state
      const updatedMerchant = { ...selectedMerchant, locked_sections: newLocked };
      setSelectedMerchant(updatedMerchant);
      setMerchants(prev => prev.map(m => m.id === selectedMerchant.id ? updatedMerchant : m));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Merchant Selector */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-[#0A1628] border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              placeholder="Search merchant..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#07101F] border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-blue-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
            {filtered.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMerchant(m)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                  selectedMerchant?.id === m.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-blue-400">
                   {m.full_name?.charAt(0) || <User size={16} />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-white truncate">{m.full_name || 'Incognito'}</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase truncate">{m.email}</div>
                </div>
                {(m.locked_sections?.length || 0) > 0 && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="lg:col-span-8">
        {!selectedMerchant ? (
          <div className="h-[400px] bg-slate-900/20 border border-slate-800/50 border-dashed rounded-[40px] flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-600">
               <ShieldCheck size={40} />
            </div>
            <h3 className="text-xl font-black text-white capitalize">Select a Merchant</h3>
            <p className="text-slate-500 mt-2 text-sm max-w-xs">Pick a merchant from the list to manage their dashboard permissions and feature visibility.</p>
          </div>
        ) : (
          <div className="bg-[#0A1628] border border-slate-800 rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[20px] bg-blue-600/10 text-blue-400 flex items-center justify-center font-black text-xl">
                   {selectedMerchant.full_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{selectedMerchant.full_name}</h3>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{selectedMerchant.plan} Plan</span>
                    <span className="text-[10px] text-slate-600">•</span>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{selectedMerchant.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase text-red-500 tracking-widest mb-1">Security Enforcement</span>
                <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-widest">
                  {selectedMerchant.locked_sections?.length || 0} Modules Restricted
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MODULES.map(module => {
                const isLocked = selectedMerchant.locked_sections?.includes(module.id);
                const isProcessing = processingId === module.id;

                return (
                  <div 
                    key={module.id}
                    className={`p-6 rounded-3xl border transition-all duration-300 flex items-start justify-between gap-4 group ${
                      isLocked 
                        ? 'bg-red-500/5 border-red-500/20' 
                        : 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                        <h4 className="font-black text-sm text-white">{module.name}</h4>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">{module.description}</p>
                    </div>

                    <button
                      onClick={() => handleToggleModule(module.id)}
                      disabled={isProcessing}
                      className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isLocked 
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 rotate-0' 
                          : 'bg-slate-800 text-slate-500 hover:text-emerald-400 border border-slate-700 rotate-0'
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        isLocked ? <Lock size={20} /> : <Unlock size={20} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0">
                 <ShieldCheck size={20} />
               </div>
               <div>
                  <h5 className="text-xs font-black text-white uppercase tracking-widest mb-1">Policy Governance</h5>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    Changes take effect immediately. Once a module is locked, the merchant will be met with a restriction overlay when trying to access that section of their dashboard.
                  </p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
