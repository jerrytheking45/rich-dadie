import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login', '/register', '/verify'];

const protectedPaths = [
  '/investment',
  '/admin',
  '/superadmin',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  // Public landing page.
// Authenticated and unauthenticated users can both view it.
if (pathname === '/') {
  return NextResponse.next();
}

  // Public pages
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Protected pages
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);

      loginUrl.searchParams.set(
        'redirect',
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};