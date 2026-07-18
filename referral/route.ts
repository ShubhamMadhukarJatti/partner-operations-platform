import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface LeadParams {
  referralCode: string
  name?: string
  email?: string
}

async function hitReferralAPI(url: string, params: LeadParams, type: string) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })

    // console.log(`${type}`, `okay?:::::${response?.ok}`, response);

    if (!response?.ok) {
      throw new Error(`${type} referral failed`)
    }

    // Handle cases where the response might not contain valid JSON
    // const data = await response.text();
    // const jsonData = data ? JSON.parse(data) : null;

    return { message: `${type} saved` }
  } catch (error) {
    console.error(`Error hitting ${type} API:`, error)
    throw new Error('Error hitting API')
  }
}

export async function GET(req: Request) {
  // const body = await req.json()
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')!
  const email = searchParams.get('email')!
  const referralCode = searchParams.get('referralCode')!
  const type = searchParams.get('type')!

  if (!['impression', 'lead'].includes(type as string)) {
    return NextResponse.json(
      { message: 'referral type is neither impression nor lead' },
      { status: 404 }
    )
  }

  // Check for required parameters
  if (type === 'lead') {
    if (!name || !email || !referralCode) {
      return NextResponse.json(
        { message: 'Name, Email, and Referral Code are required.' },
        { status: 404 }
      )
    }
  }

  if (type === 'impression') {
    if (!referralCode) {
      return NextResponse.json(
        { message: 'Referral Code is required.' },
        { status: 404 }
      )
    }
  }

  const impressionUrl = `${process.env.NEXT_PUBLIC_SHARKDOM_API_URL}/referral/impression?referralCode=${referralCode}`
  const leadUrl = `${process.env.NEXT_PUBLIC_SHARKDOM_API_URL}/referral/lead?referralCode=${referralCode}&email=${email}&name=${name}`

  try {
    let response
    if (type === 'impression') {
      response = await hitReferralAPI(impressionUrl, { referralCode }, type)
    }
    if (type === 'lead') {
      response = await hitReferralAPI(
        leadUrl,
        { referralCode, name, email },
        type
      )
    }

    if (!response) {
      return NextResponse.json(
        { message: 'no response from server' },
        { status: 500 }
      )
    }

    // Allow requests from all origins
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
      'Access-Control-Max-Age': '86400' // 24 hours
    }

    return NextResponse.json({ response }, { status: 200, headers })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.error()
  }
}
