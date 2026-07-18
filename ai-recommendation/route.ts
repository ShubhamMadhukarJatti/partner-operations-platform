import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json()

    if (!input) {
      return NextResponse.json(
        { reply: 'Message is required.' },
        { status: 400 }
      )
    }

    const botResponse = await fetch(
      'https://sharkdom-search-cdd5a2h0ftgbfqah.centralindia-01.azurewebsites.net/query',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sector: 'AI', input })
      }
    )

    if (!botResponse.ok) {
      throw new Error(`Error: ${botResponse.statusText}`)
    }

    const data = await botResponse.json()
    // const res = JSON.parse(data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching AI response:', error)
    return NextResponse.json({ reply: 'An error occurred.' }, { status: 500 })
  }
}
