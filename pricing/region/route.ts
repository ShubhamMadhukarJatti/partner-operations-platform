import { NextResponse } from 'next/server'

import { detectPricingRegion } from '@/lib/pricing-region'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const region = await detectPricingRegion(request.headers)

  return NextResponse.json(
    { region },
    {
      headers: {
        'Cache-Control': 'no-store'
      }
    }
  )
}
