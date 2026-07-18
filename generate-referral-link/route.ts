import { NextResponse } from 'next/server'

import { generateReferralLink } from '@/lib/actions/referral'

export async function POST(req: Request, res: Response) {
  // const { token } = await getServerUser()

  if (req.method === 'POST') {
    const body = await req.json()

    try {
      const data = await generateReferralLink({
        orgId: body?.orgId,
        landingPage: body?.landingPage
      })
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return NextResponse.error()
    }
  } else {
    return NextResponse.json({ message: 'METHOD NOT ALLOWED' }, { status: 405 })
  }
}
