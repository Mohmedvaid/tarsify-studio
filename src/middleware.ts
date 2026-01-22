import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes configuration for future server-side auth enhancement
// const protectedRoutes = ['/dashboard', '/notebooks', '/analytics', '/earnings', '/settings'];
// const authRoutes = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Firebase auth token in cookies
  // Note: Firebase stores auth state in IndexedDB, not cookies by default
  // This middleware provides basic route protection
  // Full auth state is managed client-side via AuthProvider

  // For now, we'll let the client-side handle auth redirects
  // This middleware can be enhanced later with Firebase Admin SDK for server-side auth

  // Redirect root to dashboard or login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
