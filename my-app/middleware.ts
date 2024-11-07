import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const urlUser = `${process.env.NEXT_BACK_HOST_API}/auth/user`

export async function middleware(request: NextRequest) {
  if (request.cookies.get('jwt')?.value) {
    const userId = request.cookies.get('cookieUserID')?.value
    const responseUser = await fetch(urlUser + '/' + userId, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const resultUser = await responseUser.json()
    if (!resultUser.is_admin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return
  }
  return NextResponse.redirect(new URL('/admin/login', request.url))
}
export const config = {
  matcher: [
    '/admin/',
    '/admin/create/:path*',
    '/admin/feedback/:path*',
    '/admin/payments/:path*',
    '/admin/users/:path*',
    '/personal-cabinet/my-courses/:path*',
    '/personal-cabinet/:path*',
    '/create/:path*',
  ],
}
