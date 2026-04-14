import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // Initialize Supabase with Service Role Key
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Verify Admin Session via cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || token !== 'mock_superadmin_jwt_123') {
      // Fallback: also try parsing from request headers
      const cookieHeader = req.headers.get('cookie') || '';
      const headerToken = cookieHeader.split('; ')
        .find(row => row.startsWith('admin_token='))
        ?.split('=')[1];
      
      if (!headerToken || headerToken !== 'mock_superadmin_jwt_123') {
        console.error('Auth failed. Cookie token:', token, 'Header token:', headerToken);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Parse request body
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log(`Admin API: Updating profile ${id} with:`, JSON.stringify(updates));

    // Perform Update using Service Role
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Admin API: Update successful:', data);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
