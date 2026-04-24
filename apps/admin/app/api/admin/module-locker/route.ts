import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/module-locker
 *
 * Actions:
 *   { action: 'set',         id: <merchantId>, locked_sections: string[] }
 *   { action: 'unlock_all',  id: <merchantId> }           // clear for one merchant
 *   { action: 'unlock_everyone' }                         // clear for every merchant
 *   { action: 'lock_all_for', id: <merchantId>, sections: string[] }
 */
export async function POST(req: Request) {
  try {
    const session = cookies().get('admin_session')?.value;
    if (session !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, id } = body;

    if (action === 'unlock_everyone') {
      const { error, count } = await supabaseAdmin
        .from('profiles')
        .update({ locked_sections: [] }, { count: 'exact' })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // match all
      if (error) throw error;
      return NextResponse.json({ success: true, cleared: count ?? 0 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Merchant id required' }, { status: 400 });
    }

    if (action === 'unlock_all') {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ locked_sections: [] })
        .eq('id', id)
        .select('id, locked_sections')
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    if (action === 'lock_all_for') {
      const sections: string[] = Array.isArray(body.sections) ? body.sections : [];
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ locked_sections: sections })
        .eq('id', id)
        .select('id, locked_sections')
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    if (action === 'set') {
      const locked: string[] = Array.isArray(body.locked_sections) ? body.locked_sections : [];
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ locked_sections: locked })
        .eq('id', id)
        .select('id, locked_sections')
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: unknown) {
    const message = (err as Error).message || 'Internal error';
    console.error('[/api/admin/module-locker]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
