import { NextResponse } from 'next/server'

import { createReferralCampaign } from '@/lib/actions/referral'

export async function POST(req: Request, res: Response) {
  if (req.method === 'POST') {
    const body = await req.json()

    try {
      const data = await createReferralCampaign({ ...body })
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return NextResponse.error()
    }
  } else {
    return NextResponse.json({ message: 'METHOD NOT ALLOWED' }, { status: 405 })
  }
}
