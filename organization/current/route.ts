import { NextResponse } from 'next/server'

import { getCurrentOrganization } from '@/lib/db/organization'
import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const profileCompletionOrgId = searchParams.get('profileCompletionOrgId')

    if (profileCompletionOrgId) {
      const { token } = await getServerUser()

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      const data = await fetcher<unknown>(
        `/api/v1/partner-organizations/${encodeURIComponent(profileCompletionOrgId)}/profile-completion`,
        {
          method: 'GET',
          headers: { accept: 'application/hal+json' },
          noRedirectOn401: true
        }
      )

      return NextResponse.json(data, { status: 200 })
    }

    const organization = await getCurrentOrganization()

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(organization, { status: 200 })
  } catch (error: any) {
    if ((error as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }

    console.error('Error fetching current organization:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch current organization' },
      { status: 500 }
    )
  }
}
