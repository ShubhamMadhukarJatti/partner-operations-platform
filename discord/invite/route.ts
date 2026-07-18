import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { channelId, botToken } = await req.json()

    if (!channelId) {
      return NextResponse.json(
        { error: 'channelId is required' },
        { status: 400 }
      )
    }

    const inviteRes = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/invites`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          max_age: 86400, // 1 day
          max_uses: 0, // Unlimited uses
          unique: true // Unique invite link
        })
      }
    )

    if (!inviteRes.ok) {
      const errorData = await inviteRes.json()
      return NextResponse.json({ error: errorData.message }, { status: 500 })
    }

    const invite = await inviteRes.json()

    const inviteLink = `https://discord.gg/${invite.code}`

    return NextResponse.json({ inviteLink })
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while generating the invite link' },
      { status: 500 }
    )
  }
}
