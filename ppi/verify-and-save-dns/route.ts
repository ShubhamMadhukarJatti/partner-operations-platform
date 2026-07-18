import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customDomain,
      targetHost,
      recordType,
      value,
      subdomainName,
      domain,
      formId
    } = body

    if (!customDomain || !targetHost || !recordType || !value) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>('/ppi/verify-and-save-dns', {
      method: 'POST',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: {
        customDomain,
        targetHost,
        recordType,
        value,
        subdomainName: subdomainName ?? null,
        domain: domain ?? null,
        formId: formId != null && formId !== '' ? String(formId) : null
      }
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const errData = error?.response?.data ?? {}
    const errorMessage =
      errData?.errorMessage ??
      errData?.message ??
      errData?.error ??
      error?.message ??
      'Failed to verify and save DNS'
    return NextResponse.json(
      {
        error:
          typeof errorMessage === 'string'
            ? errorMessage
            : 'Failed to verify and save DNS',
        success: false
      },
      { status }
    )
  }
}
