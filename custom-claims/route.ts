import { NextRequest, NextResponse } from 'next/server'
import { getFirebaseAuth } from 'next-firebase-auth-edge/lib/auth'
import { refreshAuthCookies } from 'next-firebase-auth-edge/lib/next/middleware'
import { getTokens } from 'next-firebase-auth-edge/lib/next/tokens'

import { authConfig } from '@/lib/firebase/config/server-config'

const { setCustomUserClaims, getUser } = getFirebaseAuth(
  authConfig.serviceAccount,
  authConfig.apiKey
)

export async function POST(request: NextRequest) {
  try {
    const tokens = await getTokens(request.cookies, authConfig)

    if (!tokens) {
      return NextResponse.json(
        { error: 'Unauthenticated user' },
        { status: 401 }
      )
    }

    const appCheckToken =
      request.headers.get('X-Firebase-AppCheck') ?? undefined

    await setCustomUserClaims(tokens.decodedToken.uid, {
      someCustomClaim: {
        updatedAt: Date.now()
      }
    })

    const user = await getUser(tokens.decodedToken.uid)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    const response = new NextResponse(
      JSON.stringify({
        customClaims: user?.customClaims
      }),
      {
        status: 200,
        headers
      }
    )

    // Attach `Set-Cookie` headers with token containing new custom claims
    await refreshAuthCookies(tokens.token, response, {
      ...authConfig,
      appCheckToken
    })

    return response
  } catch (error: any) {
    console.error('Error in custom-claims:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
