import { Package, Users, ShoppingBag, DollarSign, MessageSquare, ArrowUpRight, Clock, Briefcase, Palette, History } from 'lucide-react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Fetch platform-wide stats using the SERVICE_ROLE client to bypass RLS
  const [
    { count: totalMerchants },
    { count: totalProducts },
    { data: orders },
    { data: allTickets, count: openTickets },
    { count: totalReviews },
    { count: totalCustomers },
    { count: totalServices },
    { data: briefs },
    { data: logs }
  ] = await Promise.all([
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('support_tickets').select('*', { count: 'exact' }).eq('status', 'Open').order('created_at', { ascending: false }).limit(5),
    supabaseAdmin.from('reviews').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('customers').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('services').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('creative_briefs').select('*').order('created_at', { ascending: false }).limit(5),
    supabaseAdmin.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(10)
  ]);

  const totalRevenue = (orders || []).reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  
  // Create a unified activity feed
  const activityFeed = [
    ...(orders || []).slice(0, 5).map(o => ({ ...o, type: 'order', label: 'Order Confirmed', icon: ShoppingBag, color: 'text-emerald-400' })),
    ...(briefs || []).slice(0, 5).map(b => ({ ...b, type: 'brief', label: 'Production Brief', icon: Palette, color: 'text-purple-400', customer_name: b.user_email || 'Merchant', total: 0 })),
    ...(allTickets || []).slice(0, 5).map(t => ({ ...t, type: 'ticket', label: 'Support Request', icon: MessageSquare, color: 'text-amber-400', customer_name: t.user_email, total: 0 })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 12);

  const stats = [
    { label: 'Total Revenue', value: `DA ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Merchants & Staff', value: totalMerchants || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'CRM Customers', value: totalCustomers || 0, icon: Users, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Active Orders', value: allOrders.length, icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Platform Services', value: totalServices || 0, icon: Briefcase, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  const statusColors: Record<string, string> = { 
    Processing: 'bg-amber-500/10 text-amber-500 border-amber-500/20', 
    Confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20', 
    Shipped: 'bg-purple-500/10 text-purple-500 border-purple-500/20', 
    Delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', 
    Cancelled: 'bg-red-500/10 text-red-500 border-red-500/20' 
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">System Overview</h2>
          <p className="text-slate-400 mt-1 font-medium">Real-time platform performance and health.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Sync Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#0A1628] p-6 rounded-3xl border border-slate-800 shadow-xl group hover:border-slate-700 transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</h3>
            <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-[#0A1628] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
            <div className="flex items-center gap-3">
              <History className="text-blue-400" size={20} />
              <h3 className="font-bold text-lg text-white">Recent Platform Activity</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-800/10">
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4 text-right">Revenue</th>
                  <th className="px-8 py-4 text-right">Tracking</th>
                  <th className="px-8 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {activityFeed.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-500 italic">No activity recorded yet.</td>
                  </tr>
                ) : activityFeed.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit ${
                          item.status === 'Completed' || item.status === 'Resolved' || item.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          item.status === 'Pending' || item.status === 'Open' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                          {item.status || 'Active'}
                        </span>
                        <span className="text-[8px] font-black text-slate-500 uppercase mt-1 tracking-tighter">{item.label}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                       <div className="flex items-center gap-2">
                         <item.icon size={14} className={item.color} />
                         <span className="font-bold text-white line-clamp-1">{item.customer_name || 'Anonymous'}</span>
                       </div>
                    </td>
                    <td className="px-8 py-4 text-right text-emerald-400 font-black">
                      {item.type === 'order' ? `DA ${item.total?.toLocaleString()}` : '--'}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <code className="text-[10px] text-blue-400 font-mono bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10">
                        {item.type === 'order' ? (item.tracking_code || 'SHIP-ID') : 
                         item.type === 'ticket' ? `TKT-${item.id.slice(0, 4).toUpperCase()}` :
                         (item.video_type || 'CRM')}
                      </code>
                    </td>
                    <td className="px-8 py-4 text-right text-slate-500 font-medium">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Tickets */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 text-white/10 group-hover:scale-110 transition-transform">
              <Clock size={120} />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest opacity-70 mb-2">Pending Support</h4>
            <div className="text-5xl font-black mb-4">{openTickets}</div>
            <p className="text-blue-100 text-sm font-medium leading-relaxed mb-6">There are currently {openTickets} tickets awaiting response from the administrative team.</p>
            <Link 
              href="/tickets" 
              className="w-full py-3 bg-white text-blue-700 font-black rounded-2xl hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20 text-center block"
            >
              Open Ticket Manager
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
