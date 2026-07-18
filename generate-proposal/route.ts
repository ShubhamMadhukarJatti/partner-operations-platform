export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const response = await fetch(
      'https://sharkdomautoenquiry-g6gycgc2f2h2d3au.centralindia-01.azurewebsites.net/generate_proposal',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt
        })
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.text()

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Error calling Azure endpoint:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate proposal' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
