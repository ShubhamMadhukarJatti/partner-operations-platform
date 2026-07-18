import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/talent/network/upload/pdf
 * Public endpoint – no auth required.
 * Proxies file upload to backend POST /api/talent/network/upload/pdf
 * Returns { success, message, data: { fileUrl } }
 * Note: Kept as fetch with FormData because fetcher defaults to application/json and would break multipart upload.
 */
export async function POST(req: NextRequest) {
  try {
    const baseUrl =
      process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL
    if (!baseUrl) {
      return NextResponse.json(
        { message: 'API URL not configured' },
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const url = `${baseUrl.replace(/\/$/, '')}/api/talent/network/upload/pdf`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      body: formData
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const message =
        (data as { message?: string })?.message ?? response.statusText
      return NextResponse.json(
        {
          success: false,
          message: typeof message === 'string' ? message : 'Upload failed'
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error uploading PDF:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to upload PDF' },
      { status: 500 }
    )
  }
}
