'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Phone, Mail, MessageSquare, MapPin, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type Contact = {
  id: string;
  type: string;
  value: string;
  is_active: boolean;
};

export default function ContactsManagement() {
  const supabase = createClient();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newContact, setNewContact] = useState({ type: 'phone', value: '' });

  const fetchContacts = async () => {
    const { data } = await supabase.from('platform_contacts').select('*').order('created_at', { ascending: false });
    setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('platform_contacts').insert(newContact);
    if (error) {
      alert('Error saving contact: ' + error.message);
    } else {
      setNewContact({ type: 'phone', value: '' });
      fetchContacts();
    }
    setSaving(false);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await supabase.from('platform_contacts').update({ is_active: !currentStatus }).eq('id', id);
    fetchContacts();
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('platform_contacts').delete().eq('id', id);
    fetchContacts();
  };

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-[3px] border-slate-700 border-t-emerald-400 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-white">Platform Contact Info</h2>
        <p className="text-slate-400 mt-2">Manage what users see when they click "Contact Us" on the landing page.</p>
      </div>

      <div className="bg-[#0A1628] border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
          <Plus className="text-blue-500 w-5 h-5" />
          Add New Contact Point
        </h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs text-slate-500 uppercase font-black mb-2">Type</label>
            <select 
              value={newContact.type}
              onChange={e => setNewContact({...newContact, type: e.target.value})}
              className="w-full bg-[#07101F] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 appearance-none"
            >
              <option value="phone">Phone Number</option>
              <option value="email">Email Address</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="address">Physical Address</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase font-black mb-2">Value</label>
            <input 
              required
              placeholder="+213..."
              value={newContact.value}
              onChange={e => setNewContact({...newContact, value: e.target.value})}
              className="w-full bg-[#07101F] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>
          <button 
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-[48px] rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            Save Information
          </button>
        </form>
      </div>

      <div className="bg-[#0A1628] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-800/20 font-bold text-sm">Active Contacts</div>
        <div className="divide-y divide-slate-800">
          {contacts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 italic">No contact info added yet.</div>
          ) : contacts.map(c => (
            <div key={c.id} className="p-6 flex items-center justify-between hover:bg-slate-800/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  {c.type === 'phone' && <Phone size={18} />}
                  {c.type === 'email' && <Mail size={18} />}
                  {c.type === 'whatsapp' && <MessageSquare size={18} />}
                  {c.type === 'address' && <MapPin size={18} />}
                </div>
                <div>
                  <div className="text-white font-bold">{c.value}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{c.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleActive(c.id, c.is_active)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${c.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}
                >
                  {c.is_active ? 'Visible' : 'Hidden'}
                </button>
                <button 
                  onClick={() => deleteContact(c.id)}
                  className="p-2 text-slate-600 hover:text-red-400 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
