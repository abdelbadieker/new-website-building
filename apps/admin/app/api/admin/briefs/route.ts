import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (session !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('creative_briefs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (session !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json({ error: 'Brief ID is required' }, { status: 400 });
    }

    if (action === 'delete') {
      const { error } = await supabaseAdmin.from('creative_briefs').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // Build update payload — only include fields that were explicitly provided
    const updates: Record<string, unknown> = {};
    if (body.status !== undefined) updates.status = body.status;
    if (body.admin_notes !== undefined) updates.admin_notes = body.admin_notes;
    if (body.delivery_url !== undefined) updates.delivery_url = body.delivery_url;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No update fields provided' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('creative_briefs')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = (err as Error).message || 'Internal server error';
    console.error('[/api/admin/briefs] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
