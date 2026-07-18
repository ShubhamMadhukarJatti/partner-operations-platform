import { NextResponse } from 'next/server'

export async function POST(req: Request, res: Response) {
  const body = await req.json()

  console.log(body, `demo book bodyt`)

  const url = `${process.env.NEXT_PUBLIC_SHARKDOM_API_URL}/demo-book`
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    console.log(data)

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error('BOOK DEMO ERROR:', error)
    return NextResponse.error()
  }
}
