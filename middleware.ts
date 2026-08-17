import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/register', '/auth/verify'];

// Routes that require specific user types
const parentRoutes = ['/parent'];
const childRoutes = ['/child'];
const adminRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const userType = request.cookies.get('user_type')?.value;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // If user is already authenticated, redirect to appropriate dashboard
    if (token && userType) {
      const redirectMap: Record<string, string> = {
        '1': '/parent/dashboard',  // UserType.Parent
        '3': '/child/portal',      // UserType.Child
        '2': '/admin/dashboard',   // UserType.Admin
      };

      const dashboardPath = redirectMap[userType];
      if (dashboardPath) {
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      }
    }
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  if (userType) {
    // Parent routes
    if (parentRoutes.some(route => pathname.startsWith(route)) && userType !== '1') {
      return NextResponse.redirect(new URL('/auth/login?unauthorized', request.url));
    }

    // Child routes
    if (childRoutes.some(route => pathname.startsWith(route)) && userType !== '3') {
      return NextResponse.redirect(new URL('/auth/login?unauthorized', request.url));
    }

    // Admin routes
    if (adminRoutes.some(route => pathname.startsWith(route)) && userType !== '2') {
      return NextResponse.redirect(new URL('/auth/login?unauthorized', request.url));
    }
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};