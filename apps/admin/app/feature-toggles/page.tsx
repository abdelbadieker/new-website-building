'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type Profile = {
  id: string;
  full_name: string;
  email: string;
  plan: string;
  features: Record<string, boolean>;
};

export default function FeatureToggles() {
  const supabase = createClient();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const toggleFeature = async (profileId: string, feature: string, currentValue: boolean) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;

    const newFeatures = { ...profile.features, [feature]: !currentValue };
    
    // Update locally first for snappy UI
    setProfiles(profiles.map(p => p.id === profileId ? { ...p, features: newFeatures } : p));

    try {
      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: profileId, features: newFeatures })
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update features');
      
      console.log("Features updated successfully");
    } catch (error: any) {
      console.error("Feature Error:", error);
      alert('Error updating feature: ' + error.message);
      fetchProfiles(); // Rollback
    }
  };

  const toggleColumns = ["CRM", "Chatbot", "Ecotrack", "Fulfillment", "Analytics", "Creative", "Web", "Estore"];

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-[3px] border-slate-700 border-t-emerald-400 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Feature Toggle Engine</h2>
      <p className="text-slate-400">Control what each merchant can access in real-time.</p>
      
      <div className="bg-[#0A1628] rounded-xl border border-slate-800 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-sm text-slate-400">
              <th className="p-4 font-medium">Merchant</th>
              <th className="p-4 font-medium text-center">Plan</th>
              {toggleColumns.map(col => (
                <th key={col} className="p-4 font-medium text-center">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {profiles.length === 0 ? (
              <tr><td colSpan={10} className="p-8 text-center text-slate-500">No registered merchants found.</td></tr>
            ) : profiles.map(m => (
              <tr key={m.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{m.full_name || 'New Merchant'}</div>
                  <div className="text-xs text-slate-500">{m.email}</div>
                </td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium uppercase tracking-wider">
                    {m.plan}
                  </span>
                </td>
                {toggleColumns.map(col => {
                  const key = col.toLowerCase();
                  const isActive = m.features?.[key] || false;
                  return (
                    <td key={col} className="p-4 text-center">
                      <button 
                        onClick={() => toggleFeature(m.id, key, isActive)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-700'}`}
                      >
                        <span className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${isActive ? 'translate-x-5' : ''}`} />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
