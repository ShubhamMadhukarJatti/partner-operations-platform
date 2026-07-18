import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const getBookingDetail = async (meetingId: string) => {
  const apiKey = 'cal_live_e82d4ebeeb0feb18b3c5757018ea27ba'
  const url = `https://api.cal.com/v1/bookings/${meetingId}?apiKey=${apiKey}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Failed to get booking details')
    }

    const bookingDetail = await response.json()
    return bookingDetail
  } catch (error) {
    console.error('Error fetching booking details:', error)
    return null
  }
}

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('meetingId')!

  const bookingData = await getBookingDetail(id)

  return NextResponse.json(
    { message: 'Fetched Booking Data', bookingData },
    { status: 200 }
  )
}
