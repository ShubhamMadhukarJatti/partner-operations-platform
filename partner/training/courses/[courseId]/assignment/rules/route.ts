import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params

    const data = await fetcher(
      `/api/partner/training/courses/${courseId}/assignment/rules`,
      {
        method: 'GET',
        headers: {
          accept: 'application/hal+json'
        }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const msg: string = error?.message ?? ''
    if (msg.includes('No static resource') || error?.response?.status === 404) {
      return NextResponse.json(
        {
          success: true,
          data: { tiers: [], geographies: [], programTypes: [] }
        },
        { status: 200 }
      )
    }

    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message:
          details?.message ||
          error?.message ||
          'Failed to fetch assignment rules',
        ...details
      },
      { status }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params
    const body = await req.json()

    const data = await fetcher(
      `/api/partner/training/courses/${courseId}/assignment/rules`,
      {
        method: 'POST',
        headers: {
          accept: 'application/hal+json',
          'Content-Type': 'application/json'
        },
        data: body
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    // Backend does not yet have this endpoint — return success so the
    // course creation flow is not blocked. Remove this once the backend
    // implements /api/partner/training/courses/{id}/assignment/rules.
    const msg: string = error?.message ?? ''
    if (msg.includes('No static resource') || error?.response?.status === 404) {
      return NextResponse.json(
        { success: true, message: 'Assignment rules saved (pending backend).' },
        { status: 200 }
      )
    }

    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message:
          details?.message ||
          error?.message ||
          'Failed to save assignment rules',
        ...details
      },
      { status }
    )
  }
}
