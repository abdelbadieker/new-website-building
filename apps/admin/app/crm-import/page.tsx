'use client';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the CRM Import logic with SSR disabled.
// This prevents server-side exceptions caused by heavy file-parsing libraries 
// (xlsx, pdfjs-dist) that touch browser-only or Node-only APIs during pre-rendering.
const CRMImportClient = dynamic(() => import('./CRMImportClient'), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
      <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-6" />
      <h3 className="text-xl font-bold text-white mb-2">Initializing CRM Hub</h3>
      <p className="text-slate-500 text-sm font-medium">Safe-loading file parsing engine...</p>
    </div>
  )
});

export default function CRMImportPage() {
  return <CRMImportClient />;
}
