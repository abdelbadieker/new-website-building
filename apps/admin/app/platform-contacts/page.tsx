'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Phone, Mail, MessageSquare, MapPin, Trash2, Edit2, Plus, Save, X, LucideIcon } from 'lucide-react';

function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type PlatformContact = {
  id: string;
  type: string;
  value: string;
  icon: string;
  is_active: boolean;
};

const ICON_MAP: Record<string, LucideIcon> = {
  phone: Phone,
  email: Mail,
  whatsapp: MessageSquare,
  address: MapPin,
};

export default function PlatformContactsPage() {
  const [contacts, setContacts] = useState<PlatformContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [form, setForm] = useState({
    type: 'phone',
    value: '',
    icon: 'Phone',
    is_active: true
  });

  const supabase = createClient();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('platform_contacts')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (!error && data) {
      setContacts(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await supabase
        .from('platform_contacts')
        .update(form)
        .eq('id', editingId);
      
      if (!error) {
        setEditingId(null);
        fetchContacts();
      }
    } else {
      const { error } = await supabase
        .from('platform_contacts')
        .insert([form]);
      
      if (!error) {
        setShowAddForm(false);
        setForm({ type: 'phone', value: '', icon: 'Phone', is_active: true });
        fetchContacts();
      }
    }
  };

  const startEdit = (contact: PlatformContact) => {
    setEditingId(contact.id);
    setForm({
      type: contact.type,
      value: contact.value,
      icon: contact.icon,
      is_active: contact.is_active
    });
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    const { error } = await supabase.from('platform_contacts').delete().eq('id', id);
    if (!error) fetchContacts();
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex justify-center p-20">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Platform Contacts</h1>
          <p className="text-slate-400">Manage the contact information shown on your landing page.</p>
        </div>
        <button 
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'Add Contact'}
        </button>
      </div>

      {(showAddForm || editingId) && (
        <div className="bg-[#0A1628] border border-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Contact' : 'New Contact'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                <select 
                  value={form.type}
                  onChange={(e) => setForm({...form, type: e.target.value, icon: e.target.value === 'whatsapp' ? 'MessageSquare' : e.target.value === 'phone' ? 'Phone' : e.target.value === 'email' ? 'Mail' : 'MapPin'})}
                  className="w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2 text-white outline-none"
                >
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="address">Address</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Value</label>
                <input 
                  type="text" 
                  value={form.value}
                  onChange={(e) => setForm({...form, value: e.target.value})}
                  placeholder="+213..."
                  required
                  className="w-full bg-[#07101F] border border-slate-700 rounded-lg px-4 py-2 text-white outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="is_active" 
                checked={form.is_active}
                onChange={(e) => setForm({...form, is_active: e.target.checked})}
                className="w-4 h-4 rounded border-slate-700"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-slate-400">Show on Website</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
                <Save className="w-4 h-4" />
                {editingId ? 'Update' : 'Save'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => setEditingId(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {contacts.map((contact) => {
          const Icon = ICON_MAP[contact.type as keyof typeof ICON_MAP] || Phone;
          return (
            <div key={contact.id} className="bg-[#0A1628] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold text-white capitalize">{contact.type}</div>
                  <div className="text-slate-400 text-sm">{contact.value}</div>
                </div>
                {!contact.is_active && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Hidden</span>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => startEdit(contact)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(contact.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
