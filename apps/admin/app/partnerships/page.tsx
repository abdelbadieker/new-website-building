'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// Local client specifically initialized using the shared variables
function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type Partner = {
  id: string;
  name: string;
  is_emoji: boolean;
  content: string;
  created_at: string;
};

export default function PartnershipsPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isEmoji, setIsEmoji] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('partnerships').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setPartners(data);
    }
    setLoading(false);
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    
    if (editingId) {
      const { error } = await supabase
        .from('partnerships')
        .update({ name, is_emoji: isEmoji, content })
        .eq('id', editingId);
      
      if (!error) {
        setEditingId(null);
        setName('');
        setContent('');
        setIsEmoji(true);
        await fetchPartners();
      } else {
        alert('Error updating partner: ' + error.message);
      }
    } else {
      const { error } = await supabase.from('partnerships').insert([
        { name, is_emoji: isEmoji, content }
      ]);
      
      if (!error) {
        setName('');
        setContent('');
        setIsEmoji(true);
        await fetchPartners();
      } else {
        alert('Error adding partner: ' + error.message);
      }
    }
    setAdding(false);
  };

  const startEdit = (partner: Partner) => {
    setEditingId(partner.id);
    setName(partner.name);
    setContent(partner.content);
    setIsEmoji(partner.is_emoji);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setContent('');
    setIsEmoji(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;
    
    const { error } = await supabase.from('partnerships').delete().eq('id', id);
    if (!error) {
      await fetchPartners();
    } else {
      alert('Failed to delete: ' + error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Partnerships</h1>
        <p className="text-slate-400">Manage the partners displayed in the marquee on the landing page.</p>
      </div>

      <div className="bg-[#0A1628] border border-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Partner' : 'Add New Partner'}</h2>
        <form onSubmit={handleAddOrUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Company/Partner Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g. Yalidine Express"
              required
            />
          </div>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="radio" checked={isEmoji} onChange={() => setIsEmoji(true)} className="form-radio" />
              Use Emoji
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="radio" checked={!isEmoji} onChange={() => setIsEmoji(false)} className="form-radio" />
              Use Image URL
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">{isEmoji ? 'Emoji' : 'Image URL'}</label>
            <input 
              type="text" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors"
              placeholder={isEmoji ? "📦" : "https://example.com/logo.png"}
              required
            />
          </div>

          <div className="flex gap-3">
            <button 
              type="submit" 
              disabled={adding}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {adding ? 'Saving...' : editingId ? 'Update Partner' : 'Add Partner'}
            </button>
            {editingId && (
              <button 
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-[#0A1628] border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#07101F] text-slate-400 text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">Partner Logo</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading partners...</td>
              </tr>
            ) : partners.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No partners found. Add one above!</td>
              </tr>
            ) : (
              partners.map((partner) => (
                <tr key={partner.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    {partner.is_emoji ? (
                      <span className="text-3xl">{partner.content}</span>
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={partner.content} alt={partner.name} className="h-8 object-contain max-w-[100px]" />
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{partner.name}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {partner.is_emoji ? 'Emoji' : 'Image URL'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => startEdit(partner)}
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium px-3 py-1 bg-blue-400/10 rounded-md"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(partner.id)}
                      className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium px-3 py-1 bg-red-400/10 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
