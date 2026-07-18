import { NextResponse } from 'next/server'

export async function POST(req: Request, res: Response) {
  const body = await req.json()
  const url = `${process.env.NEXT_PUBLIC_SHARKDOM_API_URL}/v1/users/login`

  console.log(url)

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
      console.log({ data })
      return NextResponse.json(
        { error: data.errorMessage || 'Login failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.error()
  }
}
