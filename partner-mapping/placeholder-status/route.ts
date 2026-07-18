import { NextResponse } from 'next/server'
import { checkPartnerMappingStatus } from '@/services/placeholder-status'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const result = await checkPartnerMappingStatus()

    if (!result.canContinue) {
      return NextResponse.json(
        { error: result.error || 'Cannot continue', canContinue: false },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { canContinue: result.canContinue },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error in partner mapping placeholder status API:', error)

    return NextResponse.json(
      {
        error: error?.message || 'Failed to check placeholder status',
        canContinue: false
      },
      { status: 500 }
    )
  }
}
