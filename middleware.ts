import { createServerClient } from '@supabase/auth-helpers-nextjs'
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

  // Create Supabase client for server-side auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Get session using official Supabase SSR helper
    const { data: { session }, error } = await supabase.auth.getSession()

    console.log("[MIDDLEWARE] SESSION:", session)
    console.log("[MIDDLEWARE] PATHNAME:", pathname)
    console.log("[MIDDLEWARE] IS PUBLIC:", isPublicRoute)
    console.log("[MIDDLEWARE] IS PROTECTED:", isProtectedRoute)

    // If user is logged in and trying to access login/signup, redirect to dashboard
    if (session?.user && isPublicRoute) {
      console.log("[MIDDLEWARE] Authenticated user accessing public route, redirecting to dashboard")
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If user is not logged in and trying to access protected routes, redirect to login
    if (!session?.user && isProtectedRoute) {
      console.log("[MIDDLEWARE] Unauthenticated user accessing protected route, redirecting to login")
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Allow access to all other routes
    console.log("[MIDDLEWARE] Allowing access to:", pathname)
    return NextResponse.next()

  } catch (error) {
    console.error('[MIDDLEWARE] Error checking authentication:', error)
    // If there's an error, only redirect protected routes
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
  }
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
