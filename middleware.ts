import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Create Supabase client for middleware using environment variables
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  // Get session from cookie
  const token = req.cookies.get('sb-access-token')?.value
  const refreshToken = req.cookies.get('sb-refresh-token')?.value
  
  let session = null
  
  if (token && refreshToken) {
    try {
      const { data: { session: userSession } } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: refreshToken
      })
      session = userSession
    } catch (error) {
      console.error('[MIDDLEWARE] Error validating session:', error)
    }
  }

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/history', '/profile', '/settings']
  const authRoutes = ['/login', '/signup']
  
  const { pathname } = req.nextUrl
  
  // Check if user is accessing a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if user is accessing auth route
  const isAuthRoute = authRoutes.includes(pathname)
  
  // Redirect logic
  if (isProtectedRoute && !session) {
    // User is not authenticated and trying to access protected route
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }
  
  if (isAuthRoute && session) {
    // User is already authenticated and trying to access auth pages
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  // Allow access to public routes and authenticated users to protected routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
