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

    const { id, action, status, admin_reply } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing Ticket ID' }, { status: 400 });
    }

    if (action === 'delete') {
      const { error } = await supabaseAdmin.from('support_tickets').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // Handle updates (Status, Admin Reply)
    const { error } = await supabaseAdmin
      .from('support_tickets')
      .update({ 
        status: status || undefined, 
        admin_reply: admin_reply !== undefined ? admin_reply : undefined 
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Ticket update error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
