// Deprecated: all review operations are now handled by /api/admin/reviews (POST)
// This route is kept for backward compatibility only.
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = cookies().get('admin_session')?.value;
    if (session !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, is_approved, action } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    if (action === 'delete') {
      const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update({
        is_approved,
        approved_at: is_approved ? new Date().toISOString() : null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
