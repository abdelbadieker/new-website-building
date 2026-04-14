import { supabaseAdmin } from '@/lib/supabase-admin';
import { Package, Users, ShoppingBag, DollarSign, MessageSquare, ArrowUpRight, Clock, Briefcase } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Fetch platform-wide stats using the SERVICE_ROLE client to bypass RLS
  const [
    { count: totalMerchants },
    { count: totalProducts },
    { data: orders },
    { count: openTickets },
    { count: totalReviews },
    { count: totalCustomers },
    { count: totalServices }
  ] = await Promise.all([
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'Open'),
    supabaseAdmin.from('reviews').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('customers').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('services').select('*', { count: 'exact', head: true }),
  ]);

  const allOrders = orders || [];
  const totalRevenue = allOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const recentOrders = allOrders.slice(0, 8);

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
              <ShoppingBag className="text-blue-400" size={20} />
              <h3 className="font-bold text-lg">Recent Platform Activity</h3>
            </div>
            <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              View All Orders <ArrowUpRight size={14} />
            </button>
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
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-500 italic">No orders recorded yet.</td>
                  </tr>
                ) : recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[o.status] || 'bg-slate-500/10 text-slate-500'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 font-bold text-white">{o.customer_name}</td>
                    <td className="px-8 py-4 text-right text-emerald-400 font-black">DA {o.total?.toLocaleString()}</td>
                    <td className="px-8 py-4 text-right">
                       <code className="text-xs text-blue-400 font-mono bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10">{o.tracking_code || 'N/A'}</code>
                    </td>
                    <td className="px-8 py-4 text-right text-slate-500 font-medium">
                      {new Date(o.created_at).toLocaleDateString()}
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
            <button className="w-full py-3 bg-white text-blue-700 font-black rounded-2xl hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20">
              Open Ticket Manager
            </button>
          </div>

          <div className="bg-[#0A1628] rounded-3xl border border-slate-800 p-8 shadow-xl">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
               Quick Actions
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <button className="w-full py-3 px-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all text-left">
                Export Revenue Report
              </button>
              <button className="w-full py-3 px-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all text-left">
                Generate Partner Invoice
              </button>
               <button className="w-full py-3 px-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all text-left">
                Audit Security Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
