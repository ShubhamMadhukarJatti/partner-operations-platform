import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json(
        { reply: 'Message is required.' },
        { status: 400 }
      )
    }

    const botResponse = await fetch(
      'https://sharkdom-chatbot.azurewebsites.net/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie:
            'ARRAffinity=13db39906db3ac83ab5ec0930cf49d7357018899176733a7178f233e3fca4e59; ARRAffinitySameSite=13db39906db3ac83ab5ec0930cf49d7357018899176733a7178f233e3fca4e59'
        },
        body: JSON.stringify({ message: message })
      }
    )

    if (!botResponse.ok) {
      throw new Error(`Error: ${botResponse.statusText}`)
    }

    const data = await botResponse.json()

    return NextResponse.json({ reply: data.response })
  } catch (error) {
    console.error('Error fetching bot response:', error)
    return NextResponse.json({ reply: 'An error occurred.' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ reply: 'Method Not Allowed' }, { status: 405 })
}
