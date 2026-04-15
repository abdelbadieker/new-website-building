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

    const { id, action, is_approved } = await req.json();

    if (action === 'delete') {
      const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'toggle' || is_approved !== undefined) {
      const { error } = await supabaseAdmin
        .from('reviews')
        .update({ is_approved })
        .eq('id', id);
      
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
