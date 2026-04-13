'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User, Shield, ShieldOff, Trash2, Search, Edit3, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type Profile = {
  id: string;
  full_name: string;
  email: string;
  plan: string;
  is_banned: boolean;
  account_status: string;
  created_at: string;
};

export default function UserManagement() {
  const supabase = createClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBanToggle = async (id: string, currentStatus: boolean) => {
    setProcessingId(id);
    const { error } = await supabase.from('profiles').update({ is_banned: !currentStatus }).eq('id', id);
    if (error) {
      alert('Error toggling ban: ' + error.message);
    } else {
      fetchUsers();
    }
    setProcessingId(null);
  };

  const handlePlanChange = async (id: string, plan: string) => {
    setProcessingId(id);
    const { error } = await supabase.from('profiles').update({ plan }).eq('id', id);
    if (error) {
      alert('Error updating plan: ' + error.message);
    } else {
      fetchUsers();
    }
    setProcessingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you absolutely sure? This will delete the merchant profile. Note: Auth record must be manually deleted or handled via Admin API.')) return;
    setProcessingId(id);
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      alert('Error deleting profile: ' + error.message);
    } else {
      fetchUsers();
    }
    setProcessingId(null);
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-[3px] border-slate-700 border-t-emerald-400 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Merchant Management</h2>
          <p className="text-slate-400 mt-1">Manage accounts, plans, and platform access.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            placeholder="Search merchants..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#0A1628] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#0A1628] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/20 text-xs uppercase tracking-widest text-slate-500 font-black border-b border-slate-800">
              <th className="px-6 py-4">Merchant Info</th>
              <th className="px-6 py-4">Subscription</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {filteredUsers.length === 0 ? (
              <tr><td colSpan={5} className="p-12 text-center text-slate-500 italic">No merchants found matching your search.</td></tr>
            ) : filteredUsers.map(u => (
              <tr key={u.id} className={`hover:bg-slate-800/30 transition-colors ${u.is_banned ? 'bg-red-500/5' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${u.is_banned ? 'bg-red-500/20 text-red-500' : 'bg-blue-600'}`}>
                      {u.full_name?.charAt(0) || <User />}
                    </div>
                    <div>
                      <div className="text-white font-bold flex items-center gap-2">
                        {u.full_name || 'Anonymous User'}
                        {u.is_banned && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                      </div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={u.plan}
                    onChange={(e) => handlePlanChange(u.id, e.target.value)}
                    disabled={processingId === u.id}
                    className="bg-[#07101F] border border-slate-700 rounded-lg px-2 py-1 text-xs text-blue-400 font-bold outline-none cursor-pointer"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Growth">Growth</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.is_banned ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {u.is_banned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleBanToggle(u.id, u.is_banned)}
                      disabled={processingId === u.id}
                      title={u.is_banned ? 'Unban User' : 'Ban User'}
                      className={`p-2 rounded-lg transition-all ${u.is_banned ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-red-400 hover:bg-red-500/10'}`}
                    >
                      {processingId === u.id ? <Loader2 className="animate-spin w-4 h-4" /> : (u.is_banned ? <Shield size={18} /> : <ShieldOff size={18} />)}
                    </button>
                    <button 
                      onClick={() => handleDelete(u.id)}
                      disabled={processingId === u.id}
                      title="Delete Profile"
                      className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
