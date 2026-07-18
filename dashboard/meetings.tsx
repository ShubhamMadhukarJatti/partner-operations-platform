'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import pointer from '@/../public/assets/pointer.svg'
import { Check, Clock, RefreshCcw, StickyNote, Video, X } from 'lucide-react'

import { acceptScheduledMeeting, createMeeting } from '@/lib/actions/meeting'
import { getMeetings } from '@/lib/db/meetings'
import { getServerUser } from '@/lib/server'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { showCustomToast } from '@/components/custom-toast'

import SlotCalander from '../_components/SlotCalender/index'

interface Meeting {
  length: number
  id: number
  title: string
  description: string
  status: 'pending' | 'confirmed' | 'completed'
}

interface MeetingsPropsType {
  email: string
  name: string
  guestname: string
  guestemail: string
  currentId: number
  otherId: number
  allBookings: any
  collabData: any
}
let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]
const Meetings = ({
  email,
  name,
  guestname,
  guestemail,
  currentId,
  otherId,
  collabData,
  allBookings
}: MeetingsPropsType) => {
  const [openCalendar, setOpenCalendar] = useState(false)

  const [meetings, setAllMeetings] = useState<any>([])

  async function createEventType(inputData: any) {
    const queryString = new URLSearchParams(inputData).toString()
    const url = `/api/calander/?${queryString}`
    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to create event type')
      }

      const responseData = await response.json()

      console.log(responseData.bookingId, `meting created`)

      setOpenCalendar(false)

      showCustomToast(
        'Success',
        'Event scheduled successfully',
        'success',
        5000
      )
    } catch (error) {
      showCustomToast('Error', 'Error in scheduling event type', 'error', 5000)
    }
  }

  async function getAllBookings(
    inputData:
      | string
      | string[][]
      | Record<string, string>
      | URLSearchParams
      | undefined
  ) {
    const queryString = new URLSearchParams(inputData).toString()
    const url = `/api/bookings/?${queryString}`
    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to get all bookings')
      }

      const responseData = await response.json()
      // Process responseData as needed
      setAllMeetings((prevDetails: any) => {
        // Check if responseData.bookingData already exists in prevDetails
        const existingMeeting = prevDetails.find(
          (meeting: any) => meeting.id === responseData.bookingData.id
        )

        // If existingMeeting is undefined, the booking data doesn't exist, so add it to the state
        if (!existingMeeting) {
          return [...prevDetails, responseData.bookingData]
        } else {
          // If the booking data already exists, return prevDetails without modifying it
          return prevDetails
        }
      }) // Save booking details in state
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // Fetch booking details for each meeting on component mount
    async function fetchAllBookings() {
      if (
        allBookings &&
        Array.isArray(allBookings) &&
        allBookings?.length > 0
      ) {
        for (const booking of allBookings) {
          await getAllBookings({ meetingId: booking.meetingId })
        }
      }
    }
    fetchAllBookings()
  }, [allBookings])

  useEffect(() => {
    ;(async () => {
      let res = await getMeetings(currentId, otherId)
      console.log({ getMeetings: res })
    })()
  }, [])

  const getAllMeetings = async () => {
    setAllMeetings([])
    console.log('currentId, otherId', currentId, otherId)
    let data = await getMeetings(currentId, otherId)
    console.log('ALL MEETINGS', data)
    let meetingsss = []
    if (Array.isArray(data) && data?.length > 0) {
      meetingsss = data?.filter((meet: any) => {
        let date = new Date()
        let meetingDate = new Date(meet.availability[0].time)
        return meetingDate >= date
      })
    } else {
      meetingsss = []
    }
    setAllMeetings(meetingsss)
  }

  // console.log(currentId, otherId)
  const [token, setToken] = useState<string>('')
  const [user, setUser] = useState({})
  // const [currentOrdId, setCurrentOrdId] = useState<number>(0)
  useEffect(() => {
    ;(async () => {
      const { token, user } = await getServerUser()
      // const org = await getCurrentOrganization()
      // setCurrentOrdId(org.id)
      let res = await getMeetings(currentId, otherId)
      console.log(res, 'response')
      let meetingsss = []
      if (Array.isArray(res) && res?.length > 0) {
        meetingsss = res?.filter((meet: any) => {
          let date = new Date()
          let meetingDate = new Date(meet.availability[0].time)
          return meetingDate >= date
        })
      } else {
        meetingsss = []
      }
      setAllMeetings(meetingsss)
      setToken(token || '')
      setUser(user || {})
    })()
  }, [])
  console.log(collabData, 'collabData')

  const onSubmit = async (params: any) => {
    setOpenCalendar(false)
    let meetings = params.meetings.map((meetDate: any) => {
      let date = new Date(meetDate.date)
      let [time, meridiem] = meetDate.time.split(' ')
      let [hours, minutes] = time.split(':')
      date.setMinutes(minutes)
      date.setHours(meridiem === 'PM' ? parseInt(hours) + 12 : parseInt(hours))
      return date.toISOString()
    })
    let res = await createMeeting({
      senderOrganizationId: currentId,
      receiverOrganizationId: otherId,
      title: `30 Min meeting between ${collabData?.senderOrganizationName} and ${collabData?.receiverOrganizationName}`,
      description: params?.description,
      availability: meetings.map((time: string) => ({ time }))
    })
    console.log(res, 'res')
    // await fetch(`${process.env.NEXT_PUBLIC_SHARKDOM_API_URL}/meetings/create`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`
    //   },
    //   body: JSON.stringify({
    //     senderOrganizationId: currentId,
    //     receiverOrganizationId: otherId,
    //     title: '',
    //     description: '',
    //     availability: meetings.map((time: any) => ({ time }))
    //   })
    // })
    await getAllMeetings()
    // const dateTimeString = moment(params.selectedDate)
    //   .add(moment.duration(params.selectedTime))
    //   .format('YYYY-MM-DDTHH:mm:ssZ')
    // console.log(dateTimeString)
    // const payload = {
    //   start: dateTimeString,
    //   email,
    //   name,
    //   guestname,
    //   guestemail,
    //   otherId,
    //   currentId
    // }
    // await createEventType(payload)
  }

  return (
    <div className='w-full    max-w-[25rem] border-l border-border'>
      <div className='flex  items-center justify-end'>
        {/* <h5 className='inline-flex text-xl font-medium text-muted-foreground'>
          <CalendarDays className='mr-2 h-6 w-6 text-muted-foreground' />{' '}
          Meetings
        </h5> */}
        {/* <Link href={`/dashboard/${collabData?.id}/schedule-meeting`}>
          <Button variant={'link'}>
            <PlusIcon className='mr-2 h-6 w-6 font-medium text-primary' />
            Schedule
          </Button>
        </Link> */}

        <SlotCalander
          onSubmit={onSubmit}
          openCalendar={openCalendar}
          setOpenCalendar={setOpenCalendar}
        />
      </div>

      {meetings.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-4 text-muted-foreground'>
          <Image src={pointer} alt='icon' height={92} width={200} />
          <h5 className='mt-1 text-xl   '>Schedule a meeting</h5>
          <p className='mt-2 text-center text-sm '>
            Schedule meetings to discuss proposal terms and understand your
            partner requirements
          </p>
        </div>
      ) : (
        meetings.map((meeting: any) => (
          <MeetingCard
            key={meeting.id}
            currentId={currentId}
            meeting={meeting}
            otherId={otherId}
            getAllMeetings={getAllMeetings}
            token={token}
          />
        ))
      )}
    </div>
  )
}

export default Meetings

function MeetingCard({
  meeting,
  currentId,
  otherId,
  token,
  getAllMeetings
}: {
  meeting: any
  currentId: any
  otherId: any
  token: any
  getAllMeetings: any
}) {
  const acceptMeeting = async () => {
    console.table(meeting)
    console.log({ id: meeting.id, meetingTime: meeting.availability[0].time })
    let res = await acceptScheduledMeeting(
      meeting.meetingDetailsId,
      selectedMeeting.time
    )
    // console.log(res, 'after api hit')
    getAllMeetings()
  }
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)

  const router = useRouter()

  let time = new Date(meeting?.time)
  // console.log(
  //   {
  //     day: weekday[time.getDay()],
  //     date: time.getDate(),
  //     month: months[time.getMonth()],
  //     hours: time.getHours() > 12 ? time.getHours() - 12 : time.getHours(),
  //     minutes: time.getMinutes(),
  //     AmPm: time.getHours() > 12 ? 'PM' : 'AM'
  //   },
  //   'time'
  // )
  console.log(selectedMeeting, 'selectedMeeting', meeting)
  let timeObj = {
    day: weekday[time.getDay()],
    date: time.getDate(),
    month: months[time.getMonth()],
    hours: time.getHours() > 12 ? time.getHours() - 12 : time.getHours(),
    minutes: time.getMinutes(),
    AmPm: time.getHours() > 12 ? 'PM' : 'AM'
  }
  return (
    <div className='flex w-full flex-col gap-3 border-l-[3px]  border-primary bg-secondary px-5 py-4'>
      <p className=' break-words text-base font-medium text-muted-foreground'>
        {meeting?.title || '30 Min meeting between Sharkdom and Zomato'}
      </p>
      <div className='space-y-2.5'>
        {meeting?.time && (
          <span className='inline-flex items-center gap-1'>
            <Clock className='h-4 w-4 text-muted-foreground' />
            <p className='text-sm text-muted-foreground'>
              {`${timeObj.day}, ${timeObj.month} ${timeObj.date}, ${String(timeObj.hours).padStart(2, '0')}:${String(timeObj.minutes).padStart(2, '0')} ${timeObj.AmPm}`}
            </p>
          </span>
        )}
        {meeting.time === null &&
          otherId === meeting.senderOrganizationId &&
          meeting.meetingStatus === 'PENDING_RECEIVER' && (
            <Select onValueChange={(e) => setSelectedMeeting(e)}>
              <SelectTrigger className='w-[240px]'>
                <SelectValue placeholder='Select a time fot meeting' />
              </SelectTrigger>
              <SelectContent>
                {meeting.availability.map((time: any) => {
                  let timestamp = new Date(time.time)
                  let timeObj = {
                    day: weekday[timestamp.getDay()],
                    date: timestamp.getDate(),
                    month: months[timestamp.getMonth()],
                    hours:
                      timestamp.getHours() > 12
                        ? timestamp.getHours() - 12
                        : timestamp.getHours(),
                    minutes: timestamp.getMinutes(),
                    AmPm: timestamp.getHours() > 12 ? 'PM' : 'AM'
                  }
                  return (
                    <SelectItem key={time.time} value={time}>
                      {`${timeObj.day}, ${timeObj.month} ${timeObj.date}, ${String(timeObj.hours).padStart(2, '0')}:${String(timeObj.minutes).padStart(2, '0')} ${timeObj.AmPm}`}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )}
        <div className='flex gap-1'>
          <StickyNote className='h-6 w-6 text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>
            {meeting?.description}
          </p>
        </div>
      </div>

      {currentId === meeting.senderOrganizationId &&
        meeting.meetingStatus === 'PENDING_RECEIVER' && (
          <div>
            <Button
              className='h-8 rounded-md border border-muted-foreground py-1 text-muted-foreground '
              variant={'ghost'}
            >
              <X className='mr-2 h-5 w-5 ' /> Cancel Meeting
            </Button>
          </div>
        )}
      {otherId === meeting.senderOrganizationId &&
        meeting.meetingStatus === 'PENDING_RECEIVER' && (
          <div className='flex gap-2'>
            <Button
              className='h-8 grow rounded-full border border-muted-foreground py-1 text-muted-foreground '
              variant={'ghost'}
              onClick={acceptMeeting}
              disabled={selectedMeeting === null}
            >
              <Check className='mr-2 h-5 w-5 ' /> Yes
            </Button>
            <Button
              className='h-8 grow rounded-full border border-muted-foreground py-1 text-muted-foreground '
              variant={'ghost'}
            >
              <X className='mr-2 h-5 w-5 ' /> No
            </Button>
          </div>
        )}
      {meeting.meetingStatus === 'ACTIVE' && (
        <div className='flex gap-2'>
          <Button
            className='h-8 grow rounded-full border border-muted-foreground py-1 text-muted-foreground disabled:cursor-not-allowed'
            variant={'ghost'}
            // disabled={
            //   new Date(meeting.availability[0].time).getTime() -
            //     new Date().getTime() >
            //   60 * 60 * 1000
            // }
            onClick={() => {
              router.push(`/meeting/${meeting.roomId}`)
            }}
          >
            <Video className='mr-2 h-5 w-5 ' /> Join
          </Button>

          <Button
            className='h-8 grow rounded-full border border-muted-foreground py-1 text-muted-foreground '
            variant={'ghost'}
          >
            <RefreshCcw className='mr-2 h-5 w-5 ' /> Reschedule
          </Button>
        </div>
      )}
    </div>
  )
}
