import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

const getConfiguration = async () => {
  try {
    const data = await fetcher(`/configuration/all?size=150`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return data
  } catch (error) {
    console.error('Error fetching configuration:', error)
    return [] // Return empty array in case of error
  }
}

export async function GET(req: Request, res: Response) {
  const data = await getConfiguration()
  return NextResponse.json({ message: 'Fetched  Data', data }, { status: 200 })
}
