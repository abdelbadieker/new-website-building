import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('partnerships')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (!session || session !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, action, ...updates } = body;

    if (action === 'delete') {
      const { error } = await supabaseAdmin.from('partnerships').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (id) {
      const { data, error } = await supabaseAdmin
        .from('partnerships')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return NextResponse.json({ data });
    } else {
      const { data, error } = await supabaseAdmin
        .from('partnerships')
        .insert(updates)
        .select()
        .single();
      
      if (error) throw error;
      return NextResponse.json({ data });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
