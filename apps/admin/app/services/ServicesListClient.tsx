'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { LayoutGrid, CheckCircle2, XCircle, Plus, Trash2, Edit2, Loader2, Link as LinkIcon, Package, Briefcase, Sparkles, Truck, Users } from 'lucide-react';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  is_active: boolean;
  order_index: number;
}

const ICON_MAP: Record<string, any> = {
  Briefcase, Sparkles, Truck, Users, Package, LayoutGrid
};

export default function ServicesListClient({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [supabase] = useState(() => createClient());
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    title: '',
    description: '',
    icon: 'Briefcase',
    category: 'Management',
    is_active: true,
    order_index: services.length
  });

  const [editingService, setEditingService] = useState<Service | null>(null);

  const toggleStatus = async (service: Service) => {
    const { error } = await supabase
      .from('services')
      .update({ is_active: !service.is_active })
      .eq('id', service.id);

    if (!error) {
      setServices(services.map(s => s.id === service.id ? { ...s, is_active: !s.is_active } : s));
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .insert([newService])
      .select()
      .single();

    if (!error && data) {
      setServices([...services, data]);
      setShowAdd(false);
      setNewService({ title: '', description: '', icon: 'Briefcase', category: 'Management', is_active: true, order_index: services.length + 1 });
    }
    setLoading(false);
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setLoading(true);
    
    // Call our admin API to ensure we bypass RLS if needed, or use supabase directly if RLS allows
    const { data, error } = await supabase
      .from('services')
      .update({
        title: editingService.title,
        description: editingService.description,
        icon: editingService.icon,
        category: editingService.category,
        is_active: editingService.is_active
      })
      .eq('id', editingService.id)
      .select()
      .single();

    if (!error && data) {
      setServices(services.map(s => s.id === data.id ? data : s));
      setEditingService(null);
    }
    setLoading(false);
  };

  const deleteService = async (id: string) => {
    if (!confirm('Permanently decommission this service?')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
         <h3 className="font-black text-white text-sm uppercase tracking-widest flex items-center gap-2">
            <LayoutGrid size={18} className="text-cyan-400" /> Administrative Hub Nodes
         </h3>
         <button 
           onClick={() => setShowAdd(true)}
           className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-cyan-900/20"
         >
           <Plus size={16} /> Deploy New Service
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <div className="col-span-full p-20 text-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-600 font-bold italic">
             No system services registered. Start by deploying a new hub node.
          </div>
        ) : services.map(service => {
          const Icon = ICON_MAP[service.icon] || Briefcase;
          return (
            <div key={service.id} className="bg-[#07101F] border border-slate-800 rounded-[2rem] p-8 group hover:border-cyan-500/30 transition-all relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Icon size={64} />
              </div>
              
              <div className="flex justify-between items-start mb-6">
                 <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-cyan-400 border border-slate-700 group-hover:bg-cyan-500/10 transition-colors">
                    <Icon size={28} />
                 </div>
                 <button 
                   onClick={() => toggleStatus(service)}
                   className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                     service.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                   }`}
                 >
                   {service.is_active ? 'Operational' : 'Decommissioned'}
                 </button>
              </div>

              <h4 className="text-xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors tracking-tight">{service.title}</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2">{service.description}</p>
              
              <div className="mt-auto pt-6 border-t border-slate-800 flex justify-between items-center">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{service.category}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingService(service)} 
                      className="px-4 py-2 bg-slate-800 text-blue-400 hover:text-white hover:bg-blue-600 rounded-xl transition-all flex items-center gap-2 border border-slate-700 text-[10px] font-black uppercase tracking-widest"
                    >
                       <Edit2 size={14} /> Edit Service
                    </button>
                    <button 
                      onClick={() => deleteService(service.id)} 
                      className="w-10 h-10 bg-slate-800 text-slate-600 hover:text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500/10 transition-all border border-slate-700"
                    >
                       <Trash2 size={16} />
                    </button>
                  </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#0A1628] border border-slate-700 rounded-[2.5rem] p-10 max-w-xl w-full shadow-2xl relative">
            <h3 className="text-2xl font-black text-white tracking-tight mb-8">Deploy New Capability</h3>
            <form onSubmit={handleAddService} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Service Title</label>
                <input required value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} className="w-full bg-[#07101F] border border-slate-700 rounded-xl px-6 py-3 text-white outline-none focus:border-cyan-500 transition-all font-bold mt-2" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Icon Profile</label>
                <select value={newService.icon} onChange={e => setNewService({...newService, icon: e.target.value})} className="w-full bg-[#07101F] border border-slate-700 rounded-xl px-6 py-3 text-white outline-none focus:border-cyan-500 transition-all font-bold mt-2 appearance-none">
                   {Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Descriptor</label>
                <textarea required value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} className="w-full bg-[#07101F] border border-slate-700 rounded-xl px-6 py-4 text-white outline-none focus:border-cyan-500 transition-all font-bold mt-2 h-32" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                   {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                   Initialize Domain
                </button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-8 py-4 bg-slate-800 text-slate-400 font-black rounded-xl text-xs uppercase tracking-widest">Abort</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#0A1628] border border-slate-700 rounded-[2.5rem] p-10 max-w-xl w-full shadow-2xl relative">
            <h3 className="text-2xl font-black text-white tracking-tight mb-8">Modify System Node</h3>
            <form onSubmit={handleUpdateService} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Service Title</label>
                <input required value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className="w-full bg-[#07101F] border border-slate-700 rounded-xl px-6 py-3 text-white outline-none focus:border-cyan-500 transition-all font-bold mt-2" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Icon Profile</label>
                <select value={editingService.icon} onChange={e => setEditingService({...editingService, icon: e.target.value})} className="w-full bg-[#07101F] border border-slate-700 rounded-xl px-6 py-3 text-white outline-none focus:border-cyan-500 transition-all font-bold mt-2 appearance-none">
                   {Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Descriptor</label>
                <textarea required value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className="w-full bg-[#07101F] border border-slate-700 rounded-xl px-6 py-4 text-white outline-none focus:border-cyan-500 transition-all font-bold mt-2 h-32" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                   {loading ? <Loader2 className="animate-spin" size={18} /> : <Edit2 size={18} />}
                   Update Configuration
                </button>
                <button type="button" onClick={() => setEditingService(null)} className="px-8 py-4 bg-slate-800 text-slate-400 font-black rounded-xl text-xs uppercase tracking-widest">Discard</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
