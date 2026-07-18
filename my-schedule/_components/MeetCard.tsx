import React from 'react'
import Image from 'next/image'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { Calendar, ExternalLink } from 'lucide-react'
import { useSelector } from 'react-redux'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowSwapIcon } from '@/components/icons/icons'

import useTimezoneConverter from './useTimeZoneConverter'

export function formatTime(datetimeString: string) {
  const date = new Date(datetimeString)
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'

  // Convert to 12-hour format
  hours = hours % 12 || 12

  const formattedMinutes = minutes.toString().padStart(2, '0')
  return { time: `${hours}:${formattedMinutes}`, ampm }
}
const MeetCard: React.FC<{ data: any }> = ({ data }) => {
  const organization = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  const isSender = data?.senderOrganizationDetail?.id === organization?.id

  function getMeetApp(app: String) {
    if (app === 'CALENDLY') return 'Calendly'
    if (app === 'G_CALENDAR') return 'Google Meet'
  }

  const timezone = useTimezoneConverter()
  console.log(timezone.convertUTCToLocal(`${data.formTime}Z`).time12)

  return (
    <Card className='rounded-2xl border-gray-200 p-0 shadow-sm'>
      <CardContent className='p-4'>
        {/* Header Section */}
        <div className='mb-6 flex items-center gap-3'>
          <div className='relative'>
            {/* Overlapping circles for profile pictures */}
            <div className='relative  flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white'>
              <Image
                src={data.senderOrganizationDetail.logoUrl}
                alt=''
                fill
                objectFit='contain'
              />
            </div>
            <div className='absolute -right-6 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-xs font-medium text-gray-600 shadow-sm'>
              <Image
                src={data.receiverOrganizationDetail.logoUrl}
                alt=''
                fill
                objectFit='contain'
              />
            </div>
          </div>
          <div className='ml-6'>
            <h3 className='mb-1 text-sm font-normal text-[#2A3241]'>
              Upcoming Event
            </h3>
            <div className='flex items-center gap-2'>
              <div className='h-2.5 w-2.5 rounded-full bg-red-500'></div>
              <span className='text-sm font-normal text-[#2A3241]'>
                {data?.title ?? 'Meeting Organized'}
              </span>
            </div>
          </div>
        </div>

        <Separator className='mb-6' />

        {/* Time Section */}
        <div className='mb-6 flex items-center justify-center gap-8'>
          <div className='text-center'>
            <div className='text-sm font-medium text-[#2A3241]'>
              {timezone.convertUTCToLocal(`${data.formTime}Z`).time12}
            </div>
            {/* <div className='text-sm font-medium text-[#2A3241]'>
              {formatTime(data.formTime).ampm}
            </div> */}
          </div>

          <ArrowSwapIcon />

          <div className='text-center'>
            <div className='text-sm font-medium text-[#2A3241]'>
              {timezone.convertUTCToLocal(`${data.toTime}Z`).time12}
            </div>
            {/* <div className='text-sm font-medium text-[#2A3241]'>
              {formatTime(data.toTime).ampm}
            </div> */}
          </div>
        </div>

        {/* Calendly Button */}
        <a
          href={data.meetLink}
          target='_blank'
          className='flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white py-2 transition-colors hover:bg-gray-50'
        >
          {/* <div className="rounded-full flex items-center justify-center"> */}
          <Image
            src={
              data.meetingApp === 'G_CALENDAR'
                ? '/icons/google-meet-rounded-logo.svg'
                : '/assets/calendly.svg'
            }
            alt='Calendly Icon'
            width={32}
            height={32}
          />
          {/* </div> */}
          <span className='text-sm font-medium text-[#2A3241]'>
            Go to {getMeetApp(data.meetingApp)} link
          </span>
        </a>
      </CardContent>
    </Card>
  )
}

export default MeetCard
