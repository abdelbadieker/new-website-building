'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Upload, FileText, CheckCircle2, AlertCircle, User, ArrowLeft, Loader2 } from 'lucide-react';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type Merchant = { id: string; full_name: string; email: string };

export default function CRMImport() {
  const supabase = createClient();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('profiles').select('id, full_name, email').order('full_name').then(({ data }) => {
      setMerchants(data || []);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.name.endsWith('.csv')) {
      setFile(f);
      setError(null);
    } else {
      setError('Please upload a valid .csv file');
      setFile(null);
    }
  };

  const handleImport = async () => {
    if (!file || !selectedMerchant) return;
    setImporting(true);
    setError(null);
    setResults(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const dataRows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const row: any = { merchant_id: selectedMerchant };
          headers.forEach((header, index) => {
            if (header.includes('name')) row.name = values[index];
            if (header.includes('email')) row.email = values[index];
            if (header.includes('phone')) row.phone = values[index];
            if (header.includes('city')) row.city = values[index];
            if (header.includes('note')) row.notes = values[index];
          });
          return row;
        });

        const { error: insertError, count } = await supabase
          .from('customers')
          .insert(dataRows, { count: 'exact' });

        if (insertError) throw insertError;

        setResults({ success: dataRows.length, failed: 0 });
        await supabase.from('activity_logs').insert({ 
          action: `Bulk imported ${dataRows.length} CRM records`, 
          entity_type: 'crm', 
          details: `Merchant: ${selectedMerchant}` 
        });
      } catch (err: any) {
        setError(err.message || 'Error parsing CSV');
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Upload className="text-blue-500 w-10 h-10" />
          Bulk CRM Import
        </h2>
        <p className="text-slate-400 mt-2">Import customer data for specific merchants via CSV files.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step 1: Merchant Selection */}
        <div className="bg-[#0A1628] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">1</span>
            <h3 className="font-bold text-white uppercase tracking-wider text-xs">Select Merchant</h3>
          </div>
          <p className="text-xs text-slate-500">Pick the merchant who owns these records.</p>
          <select 
            value={selectedMerchant}
            onChange={e => setSelectedMerchant(e.target.value)}
            className="w-full bg-[#07101F] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all appearance-none"
          >
            <option value="">Select a Merchant...</option>
            {merchants.map(m => (
              <option key={m.id} value={m.id}>{m.full_name || m.email}</option>
            ))}
          </select>
        </div>

        {/* Step 2: File Upload */}
        <div className="bg-[#0A1628] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">2</span>
            <h3 className="font-bold text-white uppercase tracking-wider text-xs">Upload CSV</h3>
          </div>
          <p className="text-xs text-slate-500">File must include headers: name, email, phone, city.</p>
          <label className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 hover:border-slate-700'}`}>
            <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
            {file ? (
              <>
                <FileText className="text-emerald-400 mb-2" />
                <span className="text-xs font-bold text-emerald-400">{file.name}</span>
                <span className="text-[10px] text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB</span>
              </>
            ) : (
              <>
                <Upload className="text-slate-600 mb-2" />
                <span className="text-xs text-slate-500 font-medium">Click or drag CSV file</span>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button 
          onClick={handleImport}
          disabled={!file || !selectedMerchant || importing}
          className="px-12 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-black rounded-2xl shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] flex items-center gap-3"
        >
          {importing ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
          {importing ? 'Processing Import...' : 'Execute Bulk Import'}
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle className="shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {results && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl space-y-4 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <h4 className="font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 fontSize={18} />
            Import Completed Successfully
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#07101F] rounded-xl p-4 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-black">Records Created</div>
              <div className="text-2xl font-black text-white">{results.success}</div>
            </div>
            <div className="bg-[#07101F] rounded-xl p-4 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-black">Failed Rows</div>
              <div className="text-2xl font-black text-slate-500">{results.failed}</div>
            </div>
          </div>
          <button 
            onClick={() => {setFile(null); setResults(null);}}
            className="text-xs text-slate-400 hover:text-white underline font-medium"
          >
            Import another file
          </button>
        </div>
      )}
    </div>
  );
}
