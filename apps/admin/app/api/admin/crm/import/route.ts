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
      total_orders: parseInt(c.total_orders || '0') || 0,
      total_spent: parseFloat(c.total_spent || '0') || 0,
      merchant_id: merchantId
    }));

    // Split into chunks of 100 to avoid payload limits OR timeout during large inserts
    const CHUNK_SIZE = 100;
    let totalInserted = 0;

    for (let i = 0; i < finalRows.length; i += CHUNK_SIZE) {
      const chunk = finalRows.slice(i, i + CHUNK_SIZE);
      const { error } = await supabaseAdmin.from('customers').insert(chunk);
      if (error) {
        console.error(`Error inserting chunk ${i / CHUNK_SIZE}:`, error);
        throw error;
      }
      totalInserted += chunk.length;
    }

    // Log the activity
    await supabaseAdmin.from('activity_logs').insert({
      action: `Bulk CRM Injection: ${totalInserted} contacts for Merchant ID ${merchantId}`,
      entity_type: 'crm'
    });

    return NextResponse.json({ success: true, count: totalInserted });
  } catch (err: any) {
    console.error('CRM Import Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
