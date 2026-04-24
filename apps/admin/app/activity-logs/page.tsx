import { supabaseAdmin } from '@/lib/supabase-admin';
import { History } from 'lucide-react';

export const dynamic = 'force-dynamic';

type Log = {
  id: string;
  action: string;
  actor_role: string | null;
  actor_name: string | null;
  target: string | null;
  metadata: Record<string, unknown> | null;
  details: string | null;
  entity_type: string | null;
  created_at: string;
};

const ENTITY_COLORS: Record<string, string> = {
  order: '#60a5fa',
  customer: '#34d399',
  review: '#fbbf24',
  support_ticket: '#a78bfa',
  chatbot: '#f97316',
  product: '#ec4899',
  merchant: '#38bdf8',
  subscription: '#a3e635',
};

function getEntityFromTarget(target: string | null, entityType: string | null): string {
  if (entityType) return entityType;
  if (!target) return 'system';
  return target.split(':')[0] || 'system';
}

export default async function ActivityLogsPage() {
  const { data: logs, error } = await supabaseAdmin
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) console.error('Error fetching activity logs:', error);

  const allLogs = (logs || []) as Log[];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <History className="text-blue-500 w-10 h-10" />
            Activity Logs
          </h2>
          <p className="text-slate-400 mt-1 font-medium">
            Last 100 platform events — auto-refreshes on page visit.
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 px-5 py-2.5 rounded-2xl">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Events</span>
          <div className="text-xl font-black text-white">{allLogs.length}</div>
        </div>
      </div>

      <div className="bg-[#0A1628] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {allLogs.length === 0 ? (
          <div className="p-20 text-center text-slate-500 font-medium italic">
            No activity logged yet. Admin actions (merchant edits, subscription approvals, review moderation) will appear here.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {allLogs.map(l => {
              const entity = getEntityFromTarget(l.target, l.entity_type);
              const color = ENTITY_COLORS[entity] || '#64748b';
              const actorLabel = l.actor_name
                ? `${l.actor_name}${l.actor_role ? ` (${l.actor_role})` : ''}`
                : l.entity_type || null;

              return (
                <div key={l.id} className="px-8 py-5 flex items-start gap-5 hover:bg-slate-800/20 transition-colors group">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 shadow-[0_0_8px_currentColor]"
                    style={{ background: color, color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white">{l.action}</div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                      {l.target && (
                        <span className="text-[10px] font-mono text-slate-500">{l.target}</span>
                      )}
                      {actorLabel && (
                        <span
                          className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border"
                          style={{ background: `${color}15`, color, borderColor: `${color}30` }}
                        >
                          {actorLabel}
                        </span>
                      )}
                      {l.metadata && Object.keys(l.metadata).length > 0 && (
                        <span className="text-[10px] text-slate-600 font-mono truncate max-w-xs">
                          {JSON.stringify(l.metadata).slice(0, 80)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold shrink-0 mt-0.5">
                    {new Date(l.created_at).toLocaleString('en-DZ', {
                      month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
