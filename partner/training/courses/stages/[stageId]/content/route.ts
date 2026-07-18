import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { stageId: string } }
) {
  try {
    const { stageId } = params

    if (!stageId) {
      return NextResponse.json(
        { message: 'Stage ID is required.' },
        { status: 400 }
      )
    }

    const data = await fetcher(
      `/api/partner/training/courses/stages/${stageId}/content`,
      {
        method: 'GET',
        headers: {
          accept: 'application/hal+json'
        }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to fetch stage content.',
        ...details
      },
      { status }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { stageId: string } }
) {
  try {
    const { stageId } = params

    if (!stageId) {
      return NextResponse.json(
        { message: 'Stage ID is required.' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const {
      content,
      contentType,
      thumbnailUrl,
      driveLink,
      documentLink,
      chapterTitle,
      imageUrls
    } = body

    // Validate required fields
    if (
      content === undefined ||
      content === null ||
      typeof content !== 'string'
    ) {
      return NextResponse.json(
        { message: 'Content must be a string.' },
        { status: 400 }
      )
    }

    if (!Array.isArray(imageUrls)) {
      return NextResponse.json(
        { message: 'Image URLs must be an array.' },
        { status: 400 }
      )
    }

    const data = await fetcher(
      `/api/partner/training/courses/stages/${stageId}/content`,
      {
        method: 'POST',
        headers: {
          accept: 'application/hal+json',
          'Content-Type': 'application/json'
        },
        data: {
          content: content.trim(),
          contentType: contentType || 'VIDEO',
          thumbnailUrl: thumbnailUrl || '',
          driveLink: driveLink || '',
          documentLink: documentLink || '',
          chapterTitle: chapterTitle || '',
          imageUrls: imageUrls || []
        }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to save stage content.',
        ...details
      },
      { status }
    )
  }
}
