import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Prevent Supabase logic during build time
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('[MIDDLEWARE] Skipping during build');
    return NextResponse.next();
  }

  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[MIDDLEWARE] Supabase environment variables not configured');
    const { pathname } = req.nextUrl;
    const protectedRoutes = ['/dashboard', '/history', '/profile', '/settings'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    if (isProtectedRoute) {
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    return NextResponse.next();
  }
  
  // Create Supabase client for middleware
  const cleanUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '');
  const supabase = createClient(cleanUrl, supabaseAnonKey)
  
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
  
  // Check if user is accessing an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (session && isAuthRoute) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Redirect logic - require real Supabase session
  if (isProtectedRoute && !session?.user) {
    // User is not authenticated and trying to access protected route
    console.log('[MIDDLEWARE] Redirecting to login - no session found');
    console.log('[MIDDLEWARE] Requested path:', pathname);
    console.log('[MIDDLEWARE] Session exists:', !!session);
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (session && isAuthRoute) {
    console.log('[MIDDLEWARE] Authenticated user accessing auth route, redirecting to dashboard');
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  console.log('[MIDDLEWARE] Session check passed - allowing access to:', pathname);
  
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
