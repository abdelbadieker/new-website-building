export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['Total Merchants', 'Active Subscriptions', 'Trial Accounts', 'Total Revenue'].map(kpi => (
          <div key={kpi} className="bg-[#0A1628] p-6 rounded-xl border border-slate-800">
            <h3 className="text-slate-400 text-sm font-medium">{kpi}</h3>
            <p className="text-3xl font-bold text-white mt-2">12,345</p>
          </div>
        ))}
      </div>
      <div className="h-96 bg-[#0A1628] rounded-xl border border-slate-800 flex items-center justify-center">
        <span className="text-slate-500">Analytics Chart Placeholder</span>
      </div>
    </div>
  );
}
