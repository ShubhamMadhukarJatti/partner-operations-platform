import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

interface SharePayloadLegacy {
  emails: string[]
  access: 'VIEWER' | 'EDIT'
  progressChartShared?: boolean
  notesAndAttachmentsShared?: boolean
}

interface SharePayloadSingle {
  email: string
  access: 'VIEWER' | 'EDIT'
  externalPartnerCode: string
}

type SharePayload = SharePayloadLegacy | SharePayloadSingle

function isSingleShare(body: SharePayload): body is SharePayloadSingle {
  return (
    'email' in body &&
    typeof (body as SharePayloadSingle).email === 'string' &&
    'externalPartnerCode' in body &&
    typeof (body as SharePayloadSingle).externalPartnerCode === 'string'
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SharePayload

    if (isSingleShare(body)) {
      const result = await fetcher<{
        success: boolean
        message: string
        data?: unknown
      }>('/api/partner/portal/share', {
        method: 'POST',
        data: {
          email: body.email,
          access: body.access ?? 'VIEWER',
          externalPartnerCode: body.externalPartnerCode
        }
      })
      return NextResponse.json(result, { status: 200 })
    }

    const legacy = body as SharePayloadLegacy
    if (!legacy.emails?.length) {
      return NextResponse.json(
        { message: 'At least one email is required' },
        { status: 400 }
      )
    }

    const result = await fetcher<{
      success: boolean
      message: string
      data?: unknown
    }>('/api/partner/portal/share', {
      method: 'POST',
      data: {
        emails: legacy.emails,
        access: legacy.access ?? 'VIEWER',
        progressChartShared: legacy.progressChartShared ?? true,
        notesAndAttachmentsShared: legacy.notesAndAttachmentsShared ?? true
      }
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to share snapshot'
    const status =
      (error as { response?: { status?: number } })?.response?.status ?? 500
    return NextResponse.json({ message }, { status })
  }
}
