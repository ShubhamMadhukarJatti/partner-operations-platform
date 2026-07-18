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
      `/api/partner/training/courses/stages/${stageId}/quiz`,
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
        message: details?.message || 'Failed to fetch stage quiz.',
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
    const { title, questions, thumbnailUrl } = body

    // Validate required fields
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { message: 'Title is required.' },
        { status: 400 }
      )
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { message: 'At least one question is required.' },
        { status: 400 }
      )
    }

    // Validate each question
    for (const question of questions) {
      if (
        !question.question ||
        typeof question.question !== 'string' ||
        !question.question.trim()
      ) {
        return NextResponse.json(
          { message: 'Each question must have a question text.' },
          { status: 400 }
        )
      }
      if (!Array.isArray(question.options) || question.options.length === 0) {
        return NextResponse.json(
          { message: 'Each question must have at least one option.' },
          { status: 400 }
        )
      }
      if (
        !question.correctAnswer ||
        typeof question.correctAnswer !== 'string'
      ) {
        return NextResponse.json(
          { message: 'Each question must have a correct answer.' },
          { status: 400 }
        )
      }
    }

    const payload: Record<string, unknown> = {
      title: title.trim(),
      questions: questions.map((q: any) => ({
        question: q.question.trim(),
        options: q.options.map((opt: string) => opt.trim()),
        correctAnswer: q.correctAnswer.trim()
      }))
    }
    if (thumbnailUrl) {
      payload.thumbnailUrl = thumbnailUrl
    }

    const data = await fetcher(
      `/api/partner/training/courses/stages/${stageId}/quiz`,
      {
        method: 'POST',
        headers: {
          accept: 'application/hal+json',
          'Content-Type': 'application/json'
        },
        data: payload
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to save stage quiz.',
        ...details
      },
      { status }
    )
  }
}
