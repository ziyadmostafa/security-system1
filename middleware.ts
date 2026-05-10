import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Get the pathname of the request
  const { pathname } = req.nextUrl

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/signup']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/history']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Allow access to public routes
  if (isPublicRoute) {
    console.log(`[MIDDLEWARE] Public route access: ${pathname}`)
    return NextResponse.next()
  }

  // For protected routes, check authentication
  if (isProtectedRoute) {
    try {
      // Create Supabase client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        console.warn('[MIDDLEWARE] Supabase environment variables not configured')
        return NextResponse.redirect(new URL('/login', req.url))
      }

      const supabase = createClient(supabaseUrl, supabaseKey)

      // Get session from cookies
      const token = req.cookies.get('sb-access-token')?.value
      const refreshToken = req.cookies.get('sb-refresh-token')?.value

      if (!token || !refreshToken) {
        console.log(`[MIDDLEWARE] No session found for protected route: ${pathname}`)
        return NextResponse.redirect(new URL('/login', req.url))
      }

      // Validate session
      const { data: { session }, error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: refreshToken
      })

      if (error || !session?.user) {
        console.log(`[MIDDLEWARE] Invalid session for protected route: ${pathname}`)
        return NextResponse.redirect(new URL('/login', req.url))
      }

      console.log(`[MIDDLEWARE] Valid session for protected route: ${pathname}`)
      return NextResponse.next()

    } catch (error) {
      console.error('[MIDDLEWARE] Error checking authentication:', error)
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Allow access to all other routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
