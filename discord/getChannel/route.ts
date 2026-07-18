export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const guildId = searchParams.get('guildId')
  const botToken = searchParams.get('botToken')

  if (!guildId || !botToken) {
    return new Response(
      JSON.stringify({ error: 'Missing guildId or bot token' }),
      { status: 400 }
    )
  }

  try {
    const discordRes = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/channels`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!discordRes.ok) {
      const errorData = await discordRes.json()
      return new Response(JSON.stringify({ error: errorData }), {
        status: discordRes.status
      })
    }

    const data = await discordRes.json()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Discord channels' }),
      { status: 500 }
    )
  }
}
