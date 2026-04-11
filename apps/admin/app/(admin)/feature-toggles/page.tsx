export default function FeatureToggles() {
  const merchants = [
    { id: 1, name: "Youcef Benmoussa", email: "youcef@dz.com", plan: "Growth", features: { crm: true, chatbot: false, ecotrack: true, fulfillment: false, analytics: true, creative: false, web: false, estore: false } },
    { id: 2, name: "Amira Salhi", email: "amira@dz.com", plan: "Starter", features: { crm: false, chatbot: false, ecotrack: false, fulfillment: false, analytics: false, creative: false, web: false, estore: false } }
  ];

  const toggleColumns = ["CRM", "Chatbot", "Ecotrack", "Fulfillment", "Analytics", "Creative", "Web", "Estore"];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Feature Toggle Engine</h2>
      <p className="text-slate-400">Control what each merchant can access.</p>
      
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
            {merchants.map(m => (
              <tr key={m.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{m.name}</div>
                  <div className="text-xs text-slate-500">{m.email}</div>
                </td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">
                    {m.plan}
                  </span>
                </td>
                {toggleColumns.map(col => {
                  const key = col.toLowerCase() as keyof typeof m.features;
                  const isActive = m.features[key];
                  return (
                    <td key={col} className="p-4 text-center">
                      <button 
                        className={`w-10 h-5 rounded-full relative transition-colors ${isActive ? 'bg-emerald-500' : 'bg-slate-700'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-5' : ''}`} />
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
