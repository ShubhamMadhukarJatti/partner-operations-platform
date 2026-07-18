import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { driveLink } = body

    if (!driveLink || typeof driveLink !== 'string' || !driveLink.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Drive link is required.',
          data: null
        },
        { status: 400 }
      )
    }

    // Use fetcher to call the external API
    // Increased timeout to 60 seconds (60000ms) for drive link processing
    const result = await fetcher<{
      success: boolean
      message: string
      data: {
        gcpUrl: string
        fileSizeMb: number
        extension: string
        originalName: string
      } | null
    }>('/api/partner/training/drive', {
      method: 'POST',
      timeout: 60000, // 60 seconds timeout for drive link processing
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        driveLink: driveLink.trim()
      }
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching drive link:', error)

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to fetch drive link.'

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        data: null
      },
      { status: error?.response?.status || 500 }
    )
  }
}
