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
      .from('subscriptions')
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

    const { id, action, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    if (action === 'approve') {
      const now = new Date();
      const endDate = new Date(now);
      endDate.setFullYear(endDate.getFullYear() + 1);

      const { data: sub, error: fetchErr } = await supabaseAdmin
        .from('subscriptions')
        .select('merchant_id, plan')
        .eq('id', id)
        .single();

      if (fetchErr) throw fetchErr;

      const { error: subErr } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'active',
          start_date: now.toISOString(),
          end_date: endDate.toISOString(),
        })
        .eq('id', id);

      if (subErr) throw subErr;

      // Update the merchant's plan tier
      if (sub?.merchant_id && sub?.plan) {
        await supabaseAdmin
          .from('profiles')
          .update({ plan: sub.plan })
          .eq('id', sub.merchant_id);
      }

      // Log the action
      await supabaseAdmin.from('activity_logs').insert({
        action: `subscription_approved`,
        actor_role: 'admin',
        actor_name: 'Admin',
        target: `subscription:${id}`,
      }).then(null, null); // Non-blocking

      return NextResponse.json({ success: true, message: 'Subscription activated' });
    }

    if (action === 'reject') {
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Subscription rejected' });
    }

    // Generic update (admin edit)
    const updatePayload: Record<string, unknown> = {};
    if (updates.plan !== undefined) updatePayload.plan = updates.plan;
    if (updates.status !== undefined) updatePayload.status = updates.status;
    if (updates.notes !== undefined) updatePayload.notes = updates.notes;
    if (updates.payment_ref !== undefined) updatePayload.payment_ref = updates.payment_ref;
    if (updates.end_date !== undefined) updatePayload.end_date = updates.end_date;

    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update(updatePayload)
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = (err as Error).message || 'Internal server error';
    console.error('[/api/admin/subscriptions]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
