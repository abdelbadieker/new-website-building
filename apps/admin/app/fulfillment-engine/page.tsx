'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Search, User, Package, Plus, Trash2, ArrowLeft, Truck } from 'lucide-react';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type Profile = { id: string; full_name: string; email: string; plan: string };
type Product = { id: string; name: string; price: number; stock: number; merchant_id: string };

export default function FulfillmentEngine() {
  const supabase = createClient();
  const [merchants, setMerchants] = useState<Profile[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<Profile | null>(null);
  const [merchantProducts, setMerchantProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, stock: 0 });

  const fetchMerchants = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setMerchants(data || []);
    setLoading(false);
  };

  const fetchMerchantProducts = async (merchantId: string) => {
    const { data } = await supabase.from('products').select('*').eq('merchant_id', merchantId);
    setMerchantProducts(data || []);
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const handleSelectMerchant = (merchant: Profile) => {
    setSelectedMerchant(merchant);
    fetchMerchantProducts(merchant.id);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMerchant) return;
    
    const { error } = await supabase.from('products').insert({
      ...newProduct,
      merchant_id: selectedMerchant.id
    });

    if (!error) {
      setNewProduct({ name: '', price: 0, stock: 0 });
      setShowAddProduct(false);
      fetchMerchantProducts(selectedMerchant.id);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product from fulfillment?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error && selectedMerchant) fetchMerchantProducts(selectedMerchant.id);
  };

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-[3px] border-slate-700 border-t-emerald-400 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="text-emerald-400" />
            Fulfillment Management
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage merchants and their product pipelines</p>
        </div>
        {selectedMerchant && (
          <button 
            onClick={() => setSelectedMerchant(null)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Merchants
          </button>
        )}
      </div>

      {!selectedMerchant ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {merchants.map(m => (
            <div 
              key={m.id} 
              onClick={() => handleSelectMerchant(m)}
              className="bg-[#0A1628] border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold text-xl group-hover:bg-emerald-500/20">
                  {m.full_name?.charAt(0) || <User />}
                </div>
                <div>
                  <div className="font-bold text-white transition-colors group-hover:text-emerald-400">{m.full_name || 'New Merchant'}</div>
                  <div className="text-xs text-slate-500">{m.email}</div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">{m.plan} PLAN</span>
                <span className="text-xs text-blue-400 font-medium">Manage Fulfillment →</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-2xl">
                {selectedMerchant.full_name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedMerchant.full_name}</h3>
                <p className="text-slate-400 text-sm">{selectedMerchant.email}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddProduct(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="bg-[#0A1628] rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 font-bold text-sm">Merchant Products for Fulfillment</div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-800/20 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 font-medium">Product Name</th>
                  <th className="px-6 py-3 font-medium text-center">Stock</th>
                  <th className="px-6 py-3 font-medium text-right">Price</th>
                  <th className="px-6 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {merchantProducts.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-500">No products found for this merchant.</td></tr>
                ) : merchantProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.stock > 10 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-white">DA {p.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => deleteProduct(p.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A1628] border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Add Fulfillment Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Product Name</label>
                <input 
                  required
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Price (DA)</label>
                  <input 
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: parseInt(e.target.value)})}
                    className="w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Initial Stock</label>
                  <input 
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                    className="w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">Add Product</button>
                <button type="button" onClick={() => setShowAddProduct(false)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
