'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Link as LinkIcon, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

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
      if (header.includes('name')) row.name = values[index] || '';
      if (header.includes('email')) row.email = values[index] || '';
      if (header.includes('phone')) row.phone = values[index] || '';
      if (header.includes('city')) row.city = values[index] || '';
      if (header.includes('note')) row.notes = values[index] || '';
    });
    return row;
  });
}

function parseExcel(buffer: ArrayBuffer): Record<string, string>[] {
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

function parseTextDocument(text: string): Record<string, string>[] {
  // Try to extract structured data from text documents (PDF/DOCX)
  // Look for tabular patterns: lines with consistent delimiters
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  // Try tab-separated
  if (lines[0].includes('\t')) {
    const headers = lines[0].split('\t').map(h => h.trim().toLowerCase());
    return lines.slice(1).map(line => {
      const values = line.split('\t').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        if (header.includes('name')) row.name = values[index] || '';
        if (header.includes('email')) row.email = values[index] || '';
        if (header.includes('phone')) row.phone = values[index] || '';
        if (header.includes('city')) row.city = values[index] || '';
        if (header.includes('note')) row.notes = values[index] || '';
      });
      return row;
    });
  }

  // Try comma-separated
  if (lines[0].includes(',')) {
    return parseCSV(lines.join('\n'));
  }

  // Try semi-colon separated
  if (lines[0].includes(';')) {
    const headers = lines[0].split(';').map(h => h.trim().toLowerCase());
    return lines.slice(1).map(line => {
      const values = line.split(';').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        if (header.includes('name')) row.name = values[index] || '';
        if (header.includes('email')) row.email = values[index] || '';
        if (header.includes('phone')) row.phone = values[index] || '';
        if (header.includes('city')) row.city = values[index] || '';
        if (header.includes('note')) row.notes = values[index] || '';
      });
      return row;
    });
  }

  return [];
}

export default function CRMImport() {
  const supabase = createClient();
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
  }, []);

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
  };

  const processFile = async (file: File): Promise<Record<string, string>[]> => {
    const ext = getFileExtension(file.name);

    if (ext === '.csv') {
      const text = await file.text();
      return parseCSV(text);
    }

    if (ext === '.xlsx' || ext === '.xls') {
      const buffer = await file.arrayBuffer();
      return parseExcel(buffer);
    }

    if (ext === '.docx') {
      // Use mammoth for DOCX — dynamic import
      try {
        const mammoth = await import('mammoth');
        const buffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buffer });
        return parseTextDocument(result.value);
      } catch {
        throw new Error('Could not parse DOCX file. Please ensure it contains tabular data (comma, tab, or semicolon separated).');
      }
    }

    if (ext === '.pdf') {
      // For PDF, try to extract text
      try {
        const text = await file.text();
        const parsed = parseTextDocument(text);
        if (parsed.length === 0) {
          throw new Error('Could not extract structured data from PDF. Please convert to CSV or Excel format for best results.');
        }
        return parsed;
      } catch {
        throw new Error('Could not parse PDF file. PDF parsing has limitations — for best results, export your data as CSV or Excel.');
      }
    }

    throw new Error('Unsupported format');
  };

  const handleImportFromSheets = async () => {
    if (!googleSheetsUrl || !selectedMerchant) return;
    setImporting(true);
    setError(null);
    setResults(null);

    try {
      // Convert Google Sheets URL to CSV export URL
      let csvUrl = googleSheetsUrl;
      const match = googleSheetsUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (match) {
        const sheetId = match[1];
        csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      }

      const response = await fetch(csvUrl);
      if (!response.ok) throw new Error('Could not fetch Google Sheet. Make sure it is publicly accessible (Share → Anyone with the link).');
      
      const text = await response.text();
      const dataRows = parseCSV(text).map(row => ({ ...row, merchant_id: selectedMerchant }));

      if (dataRows.length === 0) throw new Error('No data rows found in the Google Sheet.');

      const { error: insertError } = await supabase.from('customers').insert(dataRows, { count: 'exact' });
      if (insertError) throw insertError;

      setResults({ success: dataRows.length, failed: 0 });
      await supabase.from('activity_logs').insert({
        action: `Imported ${dataRows.length} CRM records from Google Sheets`,
        entity_type: 'crm',
        details: `Merchant: ${selectedMerchant}`
      });
    } catch (err: any) {
      setError(err.message || 'Error importing from Google Sheets');
    } finally {
      setImporting(false);
    }
  };

  const handleImport = async () => {
    if (!file || !selectedMerchant) return;
    setImporting(true);
    setError(null);
    setResults(null);

    try {
      const dataRows = (await processFile(file)).map(row => ({ ...row, merchant_id: selectedMerchant }));

      if (dataRows.length === 0) {
        throw new Error('No data rows found. Make sure your file has headers (name, email, phone, city) and data rows.');
      }

      const { error: insertError } = await supabase.from('customers').insert(dataRows, { count: 'exact' });
      if (insertError) throw insertError;

      setResults({ success: dataRows.length, failed: 0 });
      await supabase.from('activity_logs').insert({
        action: `Bulk imported ${dataRows.length} CRM records`,
        entity_type: 'crm',
        details: `Merchant: ${selectedMerchant}, File: ${file.name}`
      });
    } catch (err: any) {
      setError(err.message || 'Error processing file');
    } finally {
      setImporting(false);
    }
  };

  const fileTypeLabel = (name: string) => {
    const ext = getFileExtension(name);
    const labels: Record<string, string> = { '.csv': 'CSV', '.xlsx': 'Excel', '.xls': 'Excel', '.pdf': 'PDF', '.docx': 'Word' };
    return labels[ext] || 'File';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Upload className="text-blue-500 w-10 h-10" />
          Bulk CRM Import
        </h2>
        <p className="text-slate-400 mt-2">Import customer data for specific merchants via CSV, Excel, PDF, DOCX, or Google Sheets.</p>
      </div>

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

      {/* Step 2: Import Mode */}
      <div className="bg-[#0A1628] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">2</span>
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">Import Data</h3>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setImportMode('file')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${importMode === 'file' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-transparent hover:text-white'}`}
          >
            <FileText className="w-4 h-4" /> Upload File
          </button>
          <button
            onClick={() => setImportMode('sheets')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${importMode === 'sheets' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-transparent hover:text-white'}`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Google Sheets
          </button>
        </div>

        {importMode === 'file' ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">Accepted formats: CSV, Excel (.xlsx, .xls), PDF, Word (.docx). File must include headers: name, email, phone, city.</p>
            <label className={`w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 hover:border-slate-700'}`}>
              <input type="file" className="hidden" accept={ACCEPT_STRING} onChange={handleFileChange} />
              {file ? (
                <>
                  <FileText className="text-emerald-400 mb-2" />
                  <span className="text-xs font-bold text-emerald-400">{file.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full font-semibold">{fileTypeLabel(file.name)}</span>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="text-slate-600 mb-2" />
                  <span className="text-xs text-slate-500 font-medium">Click or drag file here</span>
                  <span className="text-[10px] text-slate-600 mt-1">CSV · Excel · PDF · DOCX</span>
                </>
              )}
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">Paste a Google Sheets URL. The sheet must be publicly accessible (Share → Anyone with the link) and include headers: name, email, phone, city.</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  value={googleSheetsUrl}
                  onChange={e => setGoogleSheetsUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full bg-[#07101F] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-emerald-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={importMode === 'file' ? handleImport : handleImportFromSheets}
          disabled={(importMode === 'file' ? !file : !googleSheetsUrl) || !selectedMerchant || importing}
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
            onClick={() => {setFile(null); setResults(null); setGoogleSheetsUrl('');}}
            className="text-xs text-slate-400 hover:text-white underline font-medium"
          >
            Import another file
          </button>
        </div>
      )}
    </div>
  );
}
