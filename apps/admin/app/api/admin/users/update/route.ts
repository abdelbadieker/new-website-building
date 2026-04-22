import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = cookies().get('admin_session')?.value;
    if (session !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // ── DELETE ──────────────────────────────────────────────────────────────
    if (action === 'delete') {
      const { error } = await supabaseAdmin.from('profiles').delete().eq('id', id);
      if (error) throw error;

      await supabaseAdmin.from('activity_logs').insert({
        action: 'merchant_deleted',
        actor_role: 'admin',
        actor_name: 'Admin',
        target: `merchant:${id}`,
      }).then(null, null);

      return NextResponse.json({ success: true, message: 'Merchant account deleted' });
    }

    // ── UPDATE ───────────────────────────────────────────────────────────────
    // Whitelist the fields that can be updated to prevent mass-assignment
    const allowed = [
      'full_name', 'email', 'plan', 'is_banned',
      'account_status', 'locked_sections', 'features',
    ];
    const safeUpdates = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowed.includes(k))
    );

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid update fields provided' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log the action (non-blocking)
    await supabaseAdmin.from('activity_logs').insert({
      action: 'merchant_updated',
      actor_role: 'admin',
      actor_name: 'Admin',
      target: `merchant:${id}`,
      metadata: safeUpdates,
    }).then(null, null);

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = (err as Error).message || 'Internal server error';
    console.error('[/api/admin/users/update]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
