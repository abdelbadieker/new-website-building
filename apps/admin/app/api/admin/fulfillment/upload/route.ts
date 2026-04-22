import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// POST /api/admin/fulfillment/upload
// Multipart form: file (image)
// Returns: { publicUrl }
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `product-images/${fileName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from('products')
    .upload(filePath, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('products')
    .getPublicUrl(filePath);

  return NextResponse.json({ publicUrl });
}
