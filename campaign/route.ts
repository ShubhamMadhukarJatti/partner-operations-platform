import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

async function createEventType(payload: {
  start: string

  email: string
  name: string
  guestname: string
  guestemail: string
}) {
  const apiKey = 'cal_live_dea7cc73f5941fc2162558d10e52ef2a'
  const url = 'https://api.cal.com/v1/event-types?apiKey=' + apiKey

  const requestData = {
    title: ` ${payload.name} x ${payload.guestname}`,
    slug: ` ${payload.name} x ${payload.guestname}`,
    length: 30
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(requestData)
    })

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error('Failed to create event')
    }

    const data = await createBooking(
      responseData.event_type.id,
      responseData.event_type.slug,
      payload
    )

    return data

    // Handle the response data as needed
  } catch (error: any) {
    console.error('Error creating event type:', error)
    // Handle errors
  }
}

async function createBooking(
  eventTypeId: number,
  slug: string,
  payload: { start: string; email: string; name: string }
) {
  const { start, email, name } = payload
  const apiKey = 'cal_live_dea7cc73f5941fc2162558d10e52ef2a'
  const url = 'https://api.cal.com/v1/bookings?apiKey=' + apiKey

  const requestData = {
    responses: {
      name: name,
      email: email,
      notes: '',
      guests: [],

      location: {
        optionValue: '',
        value: 'inPerson'
      }
    },
    start,

    eventTypeId,
    eventTypeSlug: slug,
    timeZone: 'Asia/Calcutta',
    language: 'en',
    metadata: {},
    hasHashedBookingLink: false
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      console.log(await response.json())

      throw new Error('Failed to create booking')
    }
    const responseData = await response.json()
    await createAttendee(responseData.id, payload)

    return responseData
    console.log('Booking created successfully:', responseData)
  } catch (error) {
    console.error('Error creating booking:', error)
  }
}

async function createAttendee(
  bookingId: any,
  payload: {
    start: string

    email: string
    name: string
    guestname?: string
    guestemail?: string
  }
) {
  const { guestname, guestemail } = payload
  const apiKey = 'cal_live_dea7cc73f5941fc2162558d10e52ef2a'

  const url = 'https://api.cal.com/v1/attendees?apiKey=' + apiKey

  const requestData = {
    name: guestname,
    email: guestemail,
    bookingId: bookingId,
    timeZone: 'Asia/Calcutta'
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    const responseData = await response.json()
    console.log('Attendee created successfully:', responseData)
  } catch (error: any) {
    console.error('Error creating attendee:', error.message)
    // Handle errors
  }
}

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start')!

  const email = searchParams.get('email')!
  const name = searchParams.get('name')!
  const guestname = searchParams.get('guestname')!
  const guestemail = searchParams.get('guestemail')!
  const idA = searchParams.get('currentId')!
  const idB = searchParams.get('otherId')

  const finalBookingData = await createEventType({
    start,
    email,
    name,
    guestname,
    guestemail
  })

  console.log(idA, idB)

  try {
    await fetcher('/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: {
        id: 1,
        creationTimestamp: '2024-03-24T15:02:07.123Z',
        lastUpdatedTimestamp: '2024-03-24T15:02:07.123Z',
        organizationA: idA,
        organizationB: idB,
        meetingId: finalBookingData.id
      }
    })
  } catch (error: any) {
    console.error('Error saving data:', error.message)
  }

  return NextResponse.json(
    { message: 'Slot books successfully', bookingId: finalBookingData.id },
    { status: 200 }
  )
}
