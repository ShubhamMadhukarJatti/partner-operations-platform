import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { MARKETING_LOCALE_HEADER } from '@/lib/pricing-region'

const AUTHENTICATION_PATHS = [
  '/register',
  '/login',
  '/reset-password',
  '/login/verify-otp',
  '/admin-portal',
  '/partner-portal/login',
  '/partner-portal/login/verify-otp',
  '/partner-course/login',
  '/partner-course/otp-verify'
  // 'free-trial',
  // 'enterprise-onboarding',
]
const AUTHENTICATION_API_PATHS = [
  '/api/register',
  '/api/login',
  '/api/login-verify',
  '/api/login-verify-partner', // Allow partner login verification
  '/api/auth/refresh', // Allow token refresh endpoint
  '/api/logout' // Allow logout endpoint
]

// Public paths that don't require authentication
const PUBLIC_PATHS = ['/form-viewer', '/form-viewer.html']

// Exact or prefix public paths (path must equal or start with this + '/')
function isOnboardingPublicPath(pathname: string) {
  return (
    pathname === '/onboarding' ||
    pathname.startsWith('/onboarding/') ||
    pathname === '/onboarding-v2.1' ||
    pathname.startsWith('/onboarding-v2.1/')
  )
}

// Team-invite completion: logged-in invitees MUST be allowed here to complete org mapping
function isTeamInviteCompletionPath(pathname: string) {
  return pathname === '/onboarding-v2.1/newTeamMember'
}

const PROTECTED_PATHS = [
  '/explore',
  '/dashboard',
  // '/company',
  '/offers',
  '/getting-started',
  '/onboarding-new',
  '/playground',
  '/search',
  '/settings',
  '/integrations',
  '/mou',
  '/integration-hub',
  '/priority-trial',
  '/dweep-ai',
  '/home',
  '/my-data',
  '/offline-partners',
  // '/partner-mapping',
  '/partner-match',
  '/partner-programs',
  '/partner-space',
  '/partner-portal/dashboard',
  '/partner-course/dashboard'
]

function redirectToLogin(request: NextRequest) {
  const url = new URL('/login', request.url)
  url.searchParams.set('redirect', request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

function redirectToPartnerPortalLogin(request: NextRequest) {
  const url = new URL('/partner-portal/login', request.url)
  url.searchParams.set('redirect', request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

function redirectToPartnerCourseLogin(request: NextRequest) {
  const url = new URL('/partner-course/login', request.url)
  url.searchParams.set('redirect', request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Handle locale prefix rewrites (e.g., /en-us/pricing -> /pricing?locale=en-us)
  const localeMatch = pathname.match(/^\/([a-z]{2}-[a-z]{2})(\/|$)/)
  if (localeMatch) {
    const locale = localeMatch[1]
    const pathWithoutLocale = pathname.slice(localeMatch[0].length - 1) || '/'

    // Create rewrite URL with locale as query param
    const url = new URL(pathWithoutLocale, request.url)
    url.searchParams.set('locale', locale)

    // Forward locale to RSC/layout (same signal pricing uses via searchParams)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(MARKETING_LOCALE_HEADER, locale)

    return NextResponse.rewrite(url, {
      request: { headers: requestHeaders }
    })
  }

  // Bypass middleware for API login and verification routes
  if (AUTHENTICATION_API_PATHS.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Get access token from cookies
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  // Check if the path is public (no authentication required)
  const isPublicPath =
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    isOnboardingPublicPath(pathname)

  // Logged-in users must not access onboarding, sign-up or OTP verify (redirect to app)
  // EXCEPT newTeamMember: invitees just verified OTP and must complete setup there first
  if (
    accessToken &&
    !isTeamInviteCompletionPath(pathname) &&
    (isOnboardingPublicPath(pathname) ||
      pathname === '/sign-up' ||
      pathname === '/register/verify-otp' ||
      pathname === '/login/verify-otp')
  ) {
    const redirectUrl =
      request.nextUrl.searchParams.get('redirect') || '/offline-partners'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // If it's a public path, allow access without authentication
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check if the path is protected using startsWith for dynamic routes
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )
  const isAuthPath = AUTHENTICATION_PATHS.includes(request.nextUrl.pathname)

  // If the user is logged in and tries to access an authentication page, redirect to dashboard
  if (
    accessToken &&
    isAuthPath &&
    request.nextUrl.pathname != '/admin-portal' &&
    !request.nextUrl.pathname.startsWith('/partner-portal') &&
    !request.nextUrl.pathname.startsWith('/partner-course')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } else if (
    accessToken &&
    isAuthPath &&
    request.nextUrl.pathname == '/admin-portal'
  ) {
    return NextResponse.redirect(new URL('/admin-portal/search', request.url))
  } else if (
    accessToken &&
    isAuthPath &&
    request.nextUrl.pathname.startsWith('/partner-portal')
  ) {
    return NextResponse.redirect(
      new URL('/partner-portal/dashboard', request.url)
    )
  } else if (
    accessToken &&
    isAuthPath &&
    request.nextUrl.pathname.startsWith('/partner-course')
  ) {
    return NextResponse.redirect(
      new URL('/partner-course/dashboard', request.url)
    )
  }

  // If the user is not logged in and is trying to access a protected page, redirect to login
  if (!accessToken && isProtectedPath) {
    // Redirect to partner portal login if accessing partner portal dashboard
    if (request.nextUrl.pathname.startsWith('/partner-portal')) {
      return redirectToPartnerPortalLogin(request)
    }
    // Redirect to partner course login if accessing partner course dashboard
    if (request.nextUrl.pathname.startsWith('/partner-course')) {
      return redirectToPartnerCourseLogin(request)
    }
    return redirectToLogin(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|api).*)' // Protect all pages except _next, favicon, and API routes
  ]
}
