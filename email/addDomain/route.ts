import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, organizationId, domain } = body

    const query = new URLSearchParams({
      email: email ?? '',
      organizationId: organizationId ?? '',
      domain: domain ?? ''
    }).toString()

    await fetcher(`/email/addDomain?${query}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body
    })

    return NextResponse.json({ proposal_sent: true }, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      { message: details?.message || 'Failed to add domain', ...details },
      { status }
    )
  }
}
