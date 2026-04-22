import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();

  // Clear the admin session cookie (the one the middleware checks)
  cookieStore.set('admin_session', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  const cookieStore = cookies();
  cookieStore.set('admin_session', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL || 'http://localhost:3001'));
}
