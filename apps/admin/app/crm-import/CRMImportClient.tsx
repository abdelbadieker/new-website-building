'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Link as LinkIcon, FileSpreadsheet, X } from 'lucide-react';

function createClient() { return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); }

type Merchant = { id: string; full_name: string; email: string };

const ACCEPTED_EXTENSIONS = ['.csv', '.xlsx', '.xls', '.pdf', '.docx'];
const ACCEPT_STRING = '.csv,.xlsx,.xls,.pdf,.docx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

function getFileExtension(filename: string): string {
  return ('.' + filename.split('.').pop()?.toLowerCase()) || '';
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      const v = values[index] || '';
      if (header.includes('name')) row.name = v;
      if (header.includes('email')) row.email = v;
      if (header.includes('phone')) row.phone = v;
      if (header.includes('city')) row.city = v;
      if (header.includes('note')) row.notes = v;
    });
    return row;
  });
}

export default function CRMImportClient() {
  const [supabase] = useState(() => createClient());
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [importMode, setImportMode] = useState<'file' | 'sheets'>('file');

  useEffect(() => {
    supabase.from('profiles').select('id, full_name, email').order('full_name').then(({ data }) => {
      setMerchants(data || []);
    });
  }, [supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    const ext = getFileExtension(f.name);
    if (ACCEPTED_EXTENSIONS.includes(ext)) {
      setFile(f);
      setError(null);
    } else {
      setError(`Unsupported file type. Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}`);
      setFile(null);
    }
    // Reset the input value so the same file can be selected again after deletion
    e.target.value = '';
  };

  const processFile = async (file: File): Promise<Record<string, string>[]> => {
    const ext = getFileExtension(file.name);

    if (ext === '.csv') {
      const text = await file.text();
      return parseCSV(text);
    }

    if (ext === '.xlsx' || ext === '.xls') {
       // Load XLSX only on demand to prevent SSR errors
       const XLSX = await import('xlsx');
       const buffer = await file.arrayBuffer();
       const workbook = XLSX.read(buffer, { type: 'array' });
       const sheetName = workbook.SheetNames[0];
       const sheet = workbook.Sheets[sheetName];
       const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
       
       if (jsonData.length < 2) return [];
       
       const headers = (jsonData[0] as string[]).map(h => String(h || '').trim().toLowerCase());
       return jsonData.slice(1).filter(row => row.some(cell => cell)).map(row => {
         const record: Record<string, string> = {};
         headers.forEach((header, index) => {
           const value = String(row[index] || '').trim();
           if (header.includes('name')) record.name = value;
           if (header.includes('email')) record.email = value;
           if (header.includes('phone')) record.phone = value;
           if (header.includes('city')) record.city = value;
           if (header.includes('note')) record.notes = value;
         });
         return record;
       });
    }

    if (ext === '.docx') {
      try {
        const mammoth = await import('mammoth');
        const buffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buffer });
        // Simplified text extraction logic as fallback
        return parseCSV(result.value.replace(/\t/g, ','));
      } catch {
        throw new Error('Could not parse DOCX file.');
      }
    }

    if (ext === '.pdf') {
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: buffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          fullText += strings.join(' ') + '\n';
        }
        return parseCSV(fullText.replace(/\s+/g, ','));
      } catch (err: any) {
        throw new Error('PDF parsing failed.');
      }
    }

    throw new Error('Unsupported format');
  };

  const handleImport = async () => {
    const target = importMode === 'file' ? file : googleSheetsUrl;
    if (!target || !selectedMerchant) return;
    
    setImporting(true);
    setError(null);
    setResults(null);

    try {
      let dataRows: Record<string, string>[] = [];
      
      if (importMode === 'sheets') {
        let csvUrl = googleSheetsUrl;
        const match = googleSheetsUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
          const sheetId = match[1];
          csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
        }
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error('Could not fetch Google Sheet.');
        const text = await response.text();
        dataRows = parseCSV(text);
      } else {
        dataRows = await processFile(file!);
      }

      if (dataRows.length === 0) throw new Error('No data rows found.');

      // Call the server-side API to perform the injection with Super Admin privileges
      const importRes = await fetch('/api/admin/crm/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId: selectedMerchant, customers: dataRows })
      });

      if (!importRes.ok) {
        const errData = await importRes.json();
        throw new Error(errData.error || 'Import failed');
      }

      const { count } = await importRes.json();
      setResults({ success: count, failed: 0 });
    } catch (err: any) {
      setError(err.message || 'Error processing import');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Upload className="text-blue-500 w-10 h-10" />
            CRM Intelligence Hub
          </h2>
          <p className="text-slate-400 mt-1 font-medium">Inject high-volume merchant data into the platform engine.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Merchant Context */}
        <div className="bg-[#0A1628] border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-xs">1</div>
            <h3 className="font-black text-white uppercase tracking-widest text-xs">Target Organization</h3>
          </div>
          <select
            value={selectedMerchant}
            onChange={e => setSelectedMerchant(e.target.value)}
            className="w-full bg-[#07101F] border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all appearance-none text-sm font-bold"
          >
            <option value="">Choose Merchant...</option>
            {merchants.map(m => (
              <option key={m.id} value={m.id}>{m.full_name || m.email}</option>
            ))}
          </select>
        </div>

        {/* Step 2: Data Source */}
        <div className="bg-[#0A1628] border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-xs">2</div>
            <h3 className="font-black text-white uppercase tracking-widest text-xs">Source Selection</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setImportMode('file')}
              className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${importMode === 'file' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500 border-transparent hover:text-white'}`}
            >
              <FileText size={14} /> File
            </button>
            <button
              onClick={() => setImportMode('sheets')}
              className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${importMode === 'sheets' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500 border-transparent hover:text-white'}`}
            >
              <FileSpreadsheet size={14} /> Sheets
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#0A1628] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                   </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-600 group-hover:text-slate-400 transition-colors">
                    <Upload size={32} className="mb-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Deploy Local Data File</span>
                  </div>
                )}
                {file && (
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFile(null); setError(null); }}
                    className="absolute top-4 right-4 w-10 h-10 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-xl transition-all flex items-center justify-center shadow-lg border border-slate-700"
                  >
                    <X size={20} />
                  </button>
                )}
             </label>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Cloud Sheet Integration URL</label>
            <div className="relative group">
              <LinkIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
              <input
                value={googleSheetsUrl}
                onChange={e => setGoogleSheetsUrl(e.target.value)}
                placeholder="Paste public Google Sheets URL..."
                className="w-full bg-[#07101F] border border-slate-700 rounded-2xl pl-14 pr-14 py-5 text-white outline-none focus:border-emerald-500 transition-all text-sm font-bold shadow-inner"
              />
              {googleSheetsUrl && (
                <button 
                  onClick={() => setGoogleSheetsUrl('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-800 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-all"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

            <div className="mt-8 flex flex-col items-center gap-4">
                {file && (
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                     <CheckCircle2 size={12} className="text-emerald-500" /> Target: {merchants.find(m => m.id === selectedMerchant)?.full_name}
                   </div>
                )}
                <button
                  onClick={handleImport}
                  disabled={importing || (importMode === 'file' ? !file : !googleSheetsUrl) || !selectedMerchant}
                  className={`px-12 py-5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:scale-[1.02] text-white font-black rounded-2xl shadow-2xl transition-all disabled:opacity-30 disabled:grayscale flex items-center gap-3 text-sm uppercase tracking-widest`}
                >
                  {importing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {importing ? 'Processing Data Pipeline...' : 'Confirm Bulk Ingestion'}
                </button>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl flex items-center gap-4 text-red-400 animate-in slide-in-from-top-4 duration-300">
          <AlertCircle className="shrink-0" />
          <span className="text-xs font-bold leading-relaxed">{error}</span>
        </div>
      )}

      {results && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-3xl space-y-6 shadow-xl animate-in zoom-in duration-300 text-center">
          <div className="inline-flex w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full items-center justify-center mb-2">
            <CheckCircle2 size={32} />
          </div>
          <h4 className="text-xl font-black text-white">Ingestion Successful</h4>
          <div className="flex justify-center gap-8">
             <div>
               <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Records Injected</div>
               <div className="text-3xl font-black text-emerald-400">{results.success}</div>
             </div>
             <div>
               <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Failures</div>
               <div className="text-3xl font-black text-slate-700">{results.failed}</div>
             </div>
          </div>
          <button
            onClick={() => {setFile(null); setResults(null); setGoogleSheetsUrl('');}}
            className="text-xs font-black text-emerald-400 hover:text-white uppercase tracking-widest transition-colors"
          >
            Start New Import Sequence
          </button>
        </div>
      )}
    </div>
  );
}
