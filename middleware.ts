import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('hobot_session')?.value;
  const { pathname } = request.nextUrl;

  // อนุญาตให้เข้าถึง API routes และ static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // อนุญาตให้เข้าถึงหน้า login - ให้ getServerSideProps จัดการ redirect
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // สำหรับหน้าอื่นๆ ให้ getServerSideProps ตรวจสอบ session
  // Middleware จะไม่ redirect เพื่อป้องกัน loop
  // ให้ getServerSideProps จัดการ authentication
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

