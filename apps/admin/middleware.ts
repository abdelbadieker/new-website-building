import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  const { pathname } = request.nextUrl;

  // Always-public routes that never require authentication
  const isPublicRoute =
    pathname === '/login' ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico';

  // Auth API routes are public (login/logout)
  const isAuthApiRoute =
    pathname === '/api/auth/login' ||
    pathname === '/api/auth/logout' ||
    pathname === '/api/admin/auth/login' ||
    pathname === '/api/admin/auth/logout';

  if (isPublicRoute || isAuthApiRoute) {
    // If already authenticated and hitting the login page, redirect to dashboard
    if (pathname === '/login' && session?.value === 'authenticated') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // All other routes require authentication
  if (session?.value !== 'authenticated') {
    // API routes → return 401 JSON (not a redirect)
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Page routes → redirect to login with return path
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
