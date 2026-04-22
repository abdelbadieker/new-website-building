import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = cookies().get('admin_session')?.value;
    if (session !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
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
    const session = cookies().get('admin_session')?.value;
    if (session !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, action, is_approved } = body;

    if (!id && action !== 'create') {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    if (action === 'delete') {
      const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'approve' || is_approved !== undefined) {
      const approved = action === 'approve' ? true : is_approved;
      const { error } = await supabaseAdmin
        .from('reviews')
        .update({
          is_approved: approved,
          approved_at: approved ? new Date().toISOString() : null,
        })
        .eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'create') {
      const { name, email, rating, comment } = body;
      if (!name || !rating || !comment) {
        return NextResponse.json({ error: 'name, rating and comment are required' }, { status: 400 });
      }
      const { data, error } = await supabaseAdmin.from('reviews').insert({
        name,
        email: email || null,
        rating: Number(rating),
        comment,
        is_approved: true,
        approved_at: new Date().toISOString(),
      }).select().single();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    // Generic update (edit fields)
    const updatePayload: Record<string, unknown> = {};
    if (body.name !== undefined) updatePayload.name = body.name;
    if (body.email !== undefined) updatePayload.email = body.email;
    if (body.rating !== undefined) updatePayload.rating = Number(body.rating);
    if (body.comment !== undefined) updatePayload.comment = body.comment;

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: 'No valid update fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
