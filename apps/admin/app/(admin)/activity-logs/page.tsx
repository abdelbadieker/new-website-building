'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type Log = { id: string; action: string; details: string | null; entity_type: string | null; entity_id: string | null; created_at: string };

export default function ActivityLogs() {
  const supabase = createClient();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(50).then(({ data }) => { setLogs(data || []); setLoading(false); });
  }, []);

  const entityColors: Record<string, string> = { order: '#60a5fa', customer: '#34d399', review: '#fbbf24', support_ticket: '#a78bfa', chatbot: '#f97316', product: '#ec4899' };

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-[3px] border-slate-700 border-t-emerald-400 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold">Activity Logs</h2><p className="text-slate-400 text-sm mt-1">Showing last 50 actions</p></div>
      
      <div className="bg-[#0A1628] rounded-xl border border-slate-800 overflow-hidden">
        {logs.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No activity logs yet. Actions like managing orders, customers, and reviews will appear here.</div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {logs.map(l => (
              <div key={l.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-800/30">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entityColors[l.entity_type || ''] || '#64748b' }} />
                <div className="flex-1">
                  <div className="text-sm text-white">{l.action}</div>
                  {l.entity_type && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 mt-1 inline-block">{l.entity_type}</span>}
                </div>
                <div className="text-xs text-slate-500 flex-shrink-0">{new Date(l.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
