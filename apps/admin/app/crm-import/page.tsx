import dynamicImport from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Prevent static generation — this page fetches fresh data on every request
export const dynamic = 'force-dynamic';

// Dynamically import the CRM Import logic with SSR disabled.
// This prevents server-side exceptions caused by heavy file-parsing libraries
// (xlsx, pdfjs-dist) that touch browser-only or Node-only APIs during pre-rendering.
const CRMImportClient = dynamicImport(() => import('./CRMImportClient'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
      <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-6" />
      <h3 className="text-xl font-bold text-white mb-2">Initializing CRM Hub</h3>
      <p className="text-slate-500 text-sm font-medium">Safe-loading file parsing engine...</p>
    </div>
  )
});

export default async function CRMImportPage() {
  // Fetch merchants server-side using the admin client (bypasses RLS).
  // This prevents an empty merchant selector when Supabase RLS is enabled.
  const { data: merchants } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email')
    .order('full_name', { ascending: true });

  return <CRMImportClient initialMerchants={merchants || []} />;
}
