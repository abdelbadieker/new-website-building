import { BarChart3, TrendingUp, Package, Users, Activity, ShoppingBag, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function OverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium text-slate-200 transition-colors cursor-none">
            Download Report
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all cursor-none">
            + Add Product
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Revenue" 
          value="DA 145,200.00" 
          trend="+12.5%" 
          isPositive={true} 
          icon={<BarChart3 className="w-5 h-5 text-emerald-400" />} 
        />
        <KpiCard 
          title="Active Orders" 
          value="342" 
          trend="+4.2%" 
          isPositive={true} 
          icon={<ShoppingBag className="w-5 h-5 text-blue-400" />} 
        />
        <KpiCard 
          title="Conversion Rate" 
          value="3.8%" 
          trend="-1.1%" 
          isPositive={false} 
          icon={<Activity className="w-5 h-5 text-purple-400" />} 
        />
        <KpiCard 
          title="Total Customers" 
          value="1,204" 
          trend="+18.2%" 
          isPositive={true} 
          icon={<Users className="w-5 h-5 text-amber-400" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 bg-[#0A1628]/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-100">Revenue Overview</h2>
            <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72 w-full bg-slate-800/30 rounded-xl border border-dashed border-slate-700 flex items-center justify-center flex-col gap-3 relative z-10">
            <TrendingUp className="w-8 h-8 text-slate-600" />
            <span className="text-slate-500 text-sm font-medium">Chart visualization will load here</span>
          </div>
        </div>

        {/* Recent Orders / Activity */}
        <div className="bg-[#0A1628]/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-100">Recent Orders</h2>
            <button className="text-sm text-emerald-400 hover:text-emerald-300 font-medium cursor-none">View All</button>
          </div>
          
          <div className="flex-1 space-y-4">
            {[
              { id: '#ORD-092', customer: 'Ahmed K.', amount: 'DA 8,500', status: 'Processing' },
              { id: '#ORD-091', customer: 'Sarah B.', amount: 'DA 12,000', status: 'Shipped' },
              { id: '#ORD-090', customer: 'Younes M.', amount: 'DA 4,200', status: 'Delivered' },
              { id: '#ORD-089', customer: 'Lina R.', amount: 'DA 21,000', status: 'Processing' },
            ].map((order, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-slate-800 transition-colors cursor-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-300">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">{order.customer}</h3>
                    <p className="text-xs text-slate-500">{order.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">{order.amount}</div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                    order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                    order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, isPositive, icon }: { title: string, value: string, trend: string, isPositive: boolean, icon: React.ReactNode }) {
  return (
    <div className="bg-[#0A1628]/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-slate-700 transition-all cursor-none group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-black text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}
