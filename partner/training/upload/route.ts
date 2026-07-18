import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: 'File is required.' },
        { status: 400 }
      )
    }

    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    // Some backends expect 'multipartFile' - append both to support either
    uploadFormData.append('multipartFile', file)

    const data = await fetcher<unknown>('/api/partner/training/upload', {
      method: 'POST',
      timeout: 30000, // 30s for file uploads
      headers: { accept: 'application/hal+json' },
      data: uploadFormData
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    const message =
      details?.errorMessage ??
      details?.message ??
      (typeof error?.message === 'string' ? error.message : null) ??
      'Upload failed.'
    return NextResponse.json(
      {
        message,
        details
      },
      { status }
    )
  }
}
