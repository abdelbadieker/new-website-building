import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET /api/admin/fulfillment?action=merchants
// GET /api/admin/fulfillment?action=products&merchantId=xxx
// GET /api/admin/fulfillment?action=orders&merchantId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'merchants') {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, plan')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (action === 'products') {
    const merchantId = searchParams.get('merchantId');
    if (!merchantId) return NextResponse.json({ error: 'merchantId required' }, { status: 400 });
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('merchant_id', merchantId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (action === 'orders') {
    const merchantId = searchParams.get('merchantId');
    if (!merchantId) return NextResponse.json({ error: 'merchantId required' }, { status: 400 });
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

// POST /api/admin/fulfillment
// Body: { action: 'update_status', orderId, status }
// Body: { action: 'add_product', merchantId, name, price, stock, image_url? }
// Body: { action: 'delete_product', productId }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === 'update_status') {
    const { orderId, status } = body;
    if (!orderId || !status) return NextResponse.json({ error: 'orderId and status required' }, { status: 400 });
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === 'add_product') {
    const { merchantId, name, price, stock, image_url } = body;
    if (!merchantId || !name) return NextResponse.json({ error: 'merchantId and name required' }, { status: 400 });
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        merchant_id: merchantId,
        name,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        image_url: image_url || null,
        is_fulfillment: true,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (action === 'delete_product') {
    const { productId } = body;
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
