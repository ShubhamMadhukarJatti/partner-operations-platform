import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const responseData = await fetcher(
      `/api/partner/training/users/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/hal+json'
        }
      }
    )

    // The external API should return: { success: true, message: "...", data: [...] }
    // Return it as-is if it has the expected structure, otherwise wrap it
    if (responseData && typeof responseData === 'object') {
      // If response already has success/data structure, return as is
      if ('success' in responseData && 'data' in responseData) {
        return NextResponse.json(responseData, { status: 200 })
      }
      // If it's just an array, wrap it
      if (Array.isArray(responseData)) {
        return NextResponse.json(
          {
            success: true,
            message: 'Certificates fetched successfully',
            data: responseData
          },
          { status: 200 }
        )
      }
    }

    // Default: return empty array in expected format
    return NextResponse.json(
      {
        success: true,
        message: 'Certificates fetched successfully',
        data: []
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching user certificates:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user certificates',
        message: error instanceof Error ? error.message : 'Unknown error',
        data: []
      },
      { status: 500 }
    )
  }
}
