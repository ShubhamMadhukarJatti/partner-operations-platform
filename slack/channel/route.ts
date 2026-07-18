import { NextResponse } from 'next/server'

import { getSlackToken } from '@/lib/actions/slack'
import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    // Fetch the current user and Slack token
    const { user } = await getServerUser()
    const tokenData = await getSlackToken()

    if (!tokenData || !tokenData.refreshToken) {
      return NextResponse.json(
        { error: 'Slack token not found' },
        { status: 400 }
      )
    }

    const { refreshToken } = tokenData

    // Fetch Slack channels using the access token
    const response = await fetch('https://slack.com/api/conversations.list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    console.log(data, `slack channels`)

    if (!data.ok) {
      throw new Error(data.error || 'Failed to fetch Slack channels')
    }

    // Return only required fields channel name and id
    data.channels = data.channels.map((channel: any) => ({
      id: channel.id,
      name: channel.name
    }))

    // Return the list of channels
    return NextResponse.json({ channels: data.channels }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
