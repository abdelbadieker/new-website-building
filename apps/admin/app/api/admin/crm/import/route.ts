import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (!session || session !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { merchantId, customers } = await req.json();

    if (!merchantId || !customers || !Array.isArray(customers)) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Clean data and add merchant_id
    const finalRows = customers.map(c => ({
      name: c.name || null,
      email: c.email || null,
      phone: c.phone || null,
      city: c.city || null,
      notes: c.notes || null,
      merchant_id: merchantId
    }));

    // Split into chunks of 100 to avoid payload limits if needed, but for now direct insert
    const { error } = await supabaseAdmin.from('customers').insert(finalRows);

    if (error) throw error;

    // Log the activity
    await supabaseAdmin.from('activity_logs').insert({
      action: `Bulk CRM Injection: ${finalRows.length} contacts for Merchant ID ${merchantId}`,
      entity_type: 'crm'
    });

    return NextResponse.json({ success: true, count: finalRows.length });
  } catch (err: any) {
    console.error('CRM Import Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
