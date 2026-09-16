import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJwt } from './lib/auth'
import { createClient } from './utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // First run supabase middleware if they have it
  const supabaseResponse = createClient(request)

  const path = request.nextUrl.pathname

  // Protect /admin routes
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_session')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const verifiedToken = await verifyJwt(token)
    if (!verifiedToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
