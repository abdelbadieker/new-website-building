import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  const { pathname } = request.nextUrl;

  // 1. If trying to access login page while authenticated, redirect to dashboard
  if (pathname === '/login' && session?.value) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Identify protected routes
  const isPublicRoute = 
    pathname === '/login' || 
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/_next') || 
    pathname === '/favicon.ico';

  // 3. If trying to access protected routes without valid session, redirect to login
  if (!isPublicRoute && !session?.value) {
    const loginUrl = new URL('/login', request.url);
    // Store current path to redirect back after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
