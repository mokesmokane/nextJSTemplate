import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip middleware for api routes and public assets
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/public')
  ) {
    return NextResponse.next()
  }

  // Skip for auth-related routes
  if (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname === '/forgot-password'
  ) {
    return NextResponse.next()
  }

//   try {
//     // const result = await getUserProfileAction()
    
//     if (result.isSuccess) {
//       const profile = result.data
      
//       // If user hasn't completed onboarding and isn't on the onboarding page
//       if (!profile.preferences?.onboardingCompleted && request.nextUrl.pathname !== '/onboarding') {
//         return NextResponse.redirect(new URL('/onboarding', request.url))
//       }
      
//       // If user has completed onboarding but is trying to access onboarding page
//       if (profile.preferences?.onboardingCompleted && request.nextUrl.pathname === '/onboarding') {
//         return NextResponse.redirect(new URL('/dashboard', request.url))
//       }
//     }

//     return NextResponse.next()
//   } catch (error) {
//     console.error('Middleware error:', error)
//     return NextResponse.next()
//   }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
} 