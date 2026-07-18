import { NextResponse } from 'next/server'

import { getLeadsGraphData } from '@/lib/actions/referral'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url)
  const to = searchParams.get('to') as string
  const from = searchParams.get('from') as string
  const referralCode = searchParams.get('referralCode') as string

  try {
    const data = await getLeadsGraphData({
      to,
      from,
      referralCode
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.error()
  }
}
