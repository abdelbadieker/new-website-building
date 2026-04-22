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

    const { id, action, ...updates } = await req.json();

    if (action === 'delete') {
      const { error } = await supabaseAdmin.from('partner_links').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (id) {
      const { data, error } = await supabaseAdmin
        .from('partner_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    } else {
      const { data, error } = await supabaseAdmin
        .from('partner_links')
        .insert(updates)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
