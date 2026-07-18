import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orgUserMappingId, role } = body

    // Validate and normalize the role array
    let rolesArray: string[] = []

    if (Array.isArray(role)) {
      // If it's already an array, use it directly
      rolesArray = role.filter(
        (r) => typeof r === 'string' && r.trim().length > 0
      )
    } else if (typeof role === 'string') {
      // If it's a string, try to parse it
      try {
        const parsed = JSON.parse(role)
        if (Array.isArray(parsed)) {
          rolesArray = parsed.filter(
            (r) => typeof r === 'string' && r.trim().length > 0
          )
        } else {
          // If it's a single string value, wrap it in an array
          rolesArray = [role.trim()].filter((r) => r.length > 0)
        }
      } catch {
        // If parsing fails, treat it as a single role string
        rolesArray = [role.trim()].filter((r) => r.length > 0)
      }
    }

    // Validate that we have at least one role
    if (rolesArray.length === 0) {
      return NextResponse.json(
        { message: 'At least one role is required' },
        { status: 400 }
      )
    }

    // Validate orgUserMappingId
    if (!orgUserMappingId) {
      return NextResponse.json(
        { message: 'orgUserMappingId is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/v1/users/organization/roles?orgUserMappingId=${orgUserMappingId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: rolesArray
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      {
        message:
          (typeof details === 'object' && details?.message) ||
          'Failed to map role to user',
        details
      },
      { status }
    )
  }
}
