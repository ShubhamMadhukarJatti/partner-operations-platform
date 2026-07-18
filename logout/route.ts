import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = cookies()

  // Deleting cookies with explicit options to ensure they're cleared
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0 // Set to 0 to immediately expire
  }

  cookieStore.set('accessToken', '', cookieOptions)
  cookieStore.set('refreshToken', '', cookieOptions)
  cookieStore.set('user', '', cookieOptions)

  // Also try delete as fallback
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  cookieStore.delete('user')

  // Return success - let client handle redirect to ensure cookies are cleared
  return NextResponse.json({ success: true })
}
