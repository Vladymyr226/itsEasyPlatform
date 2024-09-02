import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (request.cookies.get('jwt')?.value) {
    return
  }
  return NextResponse.redirect(new URL('/admin/login', request.url))
}
export const config = {
  matcher: [
    '/admin/',
    '/personal-cabinet/my-courses/:path*',
    '/personal-cabinet/:path*',
    '/create/:path*',
  ],
}
