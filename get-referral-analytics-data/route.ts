import { NextResponse } from 'next/server'

import { getReferralAnalyticsData } from '@/lib/actions/referral'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url)
  const referralCode = searchParams.get('referralCode') as string
  const page = searchParams.get('page') as string
  const size = searchParams.get('size') as string

  console.log(referralCode, page, size)

  try {
    const data = await getReferralAnalyticsData({
      referralCode,
      page,
      size
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.error()
  }
}
