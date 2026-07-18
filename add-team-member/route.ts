import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, role, organizationId } = body

    const query = new URLSearchParams({
      email: email ?? '',
      organizationId: organizationId ?? '',
      role: role ?? ''
    }).toString()

    const data = await fetcher(`/user/addUser?${query}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body
    })

    return NextResponse.json(
      {
        signupUrl: data?.signupUrl,
        message: 'Team member added'
      },
      { status: 200 }
    )
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      { message: details?.message || 'Something went wrong', ...details },
      { status }
    )
  }
}
