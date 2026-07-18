import { NextResponse } from 'next/server'

import { getCampaignByReferralCode } from '@/lib/actions/referral'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url)
  const referralCode = searchParams.get('referralCode') as string

  try {
    const data = await getCampaignByReferralCode({ referralCode })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.error()
  }
}
