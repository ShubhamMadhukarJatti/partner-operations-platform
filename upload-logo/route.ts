import { NextResponse } from 'next/server'
import axios from 'axios'

import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request, res: Response) {
  const formData = await req.formData()
  const file = formData.get('logo')
  const logoData = new FormData()
  logoData.append('logo', file !== null ? file : '')

  const { token } = await getServerUser()
  const { searchParams } = new URL(req.url)
  const orgId = searchParams.get('organizationId')!

  const url = `${process.env.NEXT_PUBLIC_SHARKDOM_API_URL}/organization/upload/logo?organizationId=${orgId}`
  try {
    const response = await axios.post(url, logoData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    })

    return NextResponse.json(response.data, { status: 200 })
  } catch (error: any) {
    return NextResponse.error()
  }
}
