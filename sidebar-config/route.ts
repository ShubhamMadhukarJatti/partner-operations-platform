import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getAuthenticatedSession } from '@/lib/server'

export const dynamic = 'force-dynamic'

type SidebarConfigBody = {
  userId: string
  pinnedItemHrefs?: string[]
  openNestedItems?: Record<string, boolean>
  isCollapsed?: boolean
  isPartnerView?: boolean
  isVendorView?: boolean
  sidebarItemHrefs?: string[]
}

async function assertUserMatchesBody(body: SidebarConfigBody) {
  const session = await getAuthenticatedSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!body?.userId || body.userId !== session.uid) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SidebarConfigBody
    const authError = await assertUserMatchesBody(body)
    if (authError) return authError

    const data = await fetcher<unknown>('/api/sidebar-config', {
      method: 'POST',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: body
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { success: false, message: 'Failed to create sidebar config', details },
      { status }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as SidebarConfigBody
    const authError = await assertUserMatchesBody(body)
    if (authError) return authError

    const data = await fetcher<unknown>('/api/sidebar-config', {
      method: 'PUT',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: body
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { success: false, message: 'Failed to update sidebar config', details },
      { status }
    )
  }
}
