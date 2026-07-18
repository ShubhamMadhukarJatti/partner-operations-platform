import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const getBookingDetail = async (searchQuery: string) => {
  const url = `${process.env.NEXT_PUBLIC_SHARKDOM_API_URL}/email/trigger`

  const postData = {
    triggerType: 'NOT_KYB',
    templateCode: 'KYB_failed'
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*'
        //   'Access-Control-Allow-Origin': 'https://dev.sharkdom.com',
        //   'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(postData)
      //mode: 'no-cors' // Add this line to suppress CORS errors, with the mentioned limitations
    })

    console.log('Request sent, response opaque due to no-cors mode')
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url)
  //   const id = searchParams.get('meetingId')!

  const searchResponse = await getBookingDetail('test')

  return NextResponse.json(
    { message: 'Fetched  Data', searchResponse },
    { status: 200 }
  )
}
