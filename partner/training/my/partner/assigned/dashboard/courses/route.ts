import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { token } = await getServerUser()

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { assignedOrgId, status, page, size } = body

    // Validate required fields
    if (
      !assignedOrgId ||
      assignedOrgId === undefined ||
      assignedOrgId === null
    ) {
      return NextResponse.json(
        { message: 'assignedOrgId is required.' },
        { status: 400 }
      )
    }

    const apiUrl =
      process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL

    if (!apiUrl) {
      return NextResponse.json(
        { message: 'API URL not configured.' },
        { status: 500 }
      )
    }

    // Forward the request to the external API
    const response = await axios.post(
      `${apiUrl}/api/partner/training/my/partner/assigned/dashboard/courses`,
      {
        assignedOrgId: Number(assignedOrgId),
        status: status || 'ASSIGNED',
        page: page || 0,
        size: size || 10
      },
      {
        headers: {
          accept: 'application/hal+json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    return NextResponse.json(response.data, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching partner assigned dashboard courses:', error)

    if (error.response) {
      return NextResponse.json(
        {
          message:
            error.response.data?.message ||
            'Failed to fetch partner assigned dashboard courses.'
        },
        { status: error.response.status || 500 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 }
    )
  }
}
