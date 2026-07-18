import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      title,
      description,
      coverImageUrl,
      level,
      durationMinutes,
      labelIds
    } = body

    // Validate required fields
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { message: 'Title is required.' },
        { status: 400 }
      )
    }

    if (
      !description ||
      typeof description !== 'string' ||
      !description.trim()
    ) {
      return NextResponse.json(
        { message: 'Description is required.' },
        { status: 400 }
      )
    }

    if (!coverImageUrl || typeof coverImageUrl !== 'string') {
      return NextResponse.json(
        { message: 'Cover image URL is required.' },
        { status: 400 }
      )
    }

    if (coverImageUrl.startsWith('blob:')) {
      return NextResponse.json(
        {
          message:
            'Cover image must be uploaded before creating a course. Please wait for the upload to complete.'
        },
        { status: 400 }
      )
    }

    if (!level || typeof level !== 'string') {
      return NextResponse.json(
        { message: 'Level is required.' },
        { status: 400 }
      )
    }

    if (
      !durationMinutes ||
      typeof durationMinutes !== 'number' ||
      durationMinutes <= 0
    ) {
      return NextResponse.json(
        {
          message: 'Duration in minutes is required and must be greater than 0.'
        },
        { status: 400 }
      )
    }

    if (!Array.isArray(labelIds)) {
      return NextResponse.json(
        { message: 'Label IDs must be an array.' },
        { status: 400 }
      )
    }

    const data = await fetcher('/api/partner/training/courses/add', {
      method: 'POST',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: {
        title: title.trim(),
        description: description.trim(),
        coverImageUrl,
        level: level.toUpperCase(),
        durationMinutes,
        labelIds
      }
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to create course.',
        ...details
      },
      { status }
    )
  }
}
