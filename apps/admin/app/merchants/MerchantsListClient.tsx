'use client';
import { useState } from 'react';
import { Search, MoreVertical, Shield, ShieldOff, Edit3, Trash2, Loader2, User } from 'lucide-react';

type Profile = {
  id: string;
  full_name: string;
  email: string;
  plan: string;
  is_banned: boolean;
  account_status: string;
  created_at: string;
};

export function MerchantsListClient({ initialMerchants }: { initialMerchants: Profile[] }) {
  const [merchants, setMerchants] = useState<Profile[]>(initialMerchants);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredMerchants = merchants.filter(m => 
    m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdate = async (id: string, updates: Partial<Profile>) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });

      if (!res.ok) throw new Error('Failed to update account');

      setMerchants(current => 
        current.map(m => m.id === id ? { ...m, ...updates } : m)
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <>
      <div className="px-8 py-6 border-b border-slate-800 flex flex-col md:flex-row justify-between gap-4 items-center bg-slate-800/10">
        <h3 className="font-bold text-lg text-white">Platform Merchants</h3>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#07101F] border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all font-medium"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-800/20">
              <th className="px-8 py-4">Merchant Identity</th>
              <th className="px-8 py-4">Plan Level</th>
              <th className="px-8 py-4">Access Status</th>
              <th className="px-8 py-4 text-right">Registration Date</th>
              <th className="px-8 py-4 text-center">Governance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredMerchants.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-slate-500 italic">No merchant records found matching your search.</td>
              </tr>
            ) : filteredMerchants.map((m) => (
              <tr key={m.id} className={`hover:bg-slate-800/30 transition-colors ${m.is_banned ? 'bg-red-500/5' : ''}`}>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${m.is_banned ? 'bg-red-500/20 text-red-500' : 'bg-blue-600/20 text-blue-400 border border-blue-500/20'}`}>
                      {m.full_name?.charAt(0) || <User size={18} />}
                    </div>
                    <div>
                      <div className="text-white font-bold tracking-tight">{m.full_name || 'Incognito Merchant'}</div>
                      <div className="text-xs text-slate-500 font-medium">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <select 
                    value={m.plan}
                    disabled={processingId === m.id}
                    onChange={(e) => handleUpdate(m.id, { plan: e.target.value })}
                    className="bg-[#07101F] border border-slate-700 rounded-xl px-4 py-2 text-xs font-black text-blue-400 outline-none cursor-pointer focus:border-blue-500 hover:border-slate-600 transition-all appearance-none"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Growth">Growth</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </td>
                <td className="px-8 py-5">
                   <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${m.is_banned ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {m.is_banned ? 'Revoked' : 'Authorized'}
                  </span>
                </td>
                <td className="px-8 py-5 text-right text-slate-500 font-medium">
                  {new Date(m.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleUpdate(m.id, { is_banned: !m.is_banned })}
                      disabled={processingId === m.id}
                      title={m.is_banned ? 'Grant Access' : 'Revoke Access'}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${m.is_banned ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'}`}
                    >
                      {processingId === m.id ? <Loader2 className="w-4 h-4 animate-spin text-slate-500" /> : (m.is_banned ? <Shield size={16} /> : <ShieldOff size={16} />)}
                    </button>
                    <button 
                      className="w-9 h-9 bg-slate-800 text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
                      title="Manage Store Settings"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
