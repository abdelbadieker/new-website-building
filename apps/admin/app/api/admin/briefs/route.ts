import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (!session || session !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('creative_briefs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (!session || session !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, action, status, admin_notes, delivery_url } = await req.json();

    if (action === 'delete') {
      const { error } = await supabaseAdmin.from('creative_briefs').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // Handle updates (Status, Notes, Delivery)
    const { error } = await supabaseAdmin
      .from('creative_briefs')
      .update({ 
        status: status || undefined, 
        admin_notes: admin_notes !== undefined ? admin_notes : undefined, 
        delivery_url: delivery_url !== undefined ? delivery_url : undefined 
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
