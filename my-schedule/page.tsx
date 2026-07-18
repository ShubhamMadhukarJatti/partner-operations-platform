'use client'

import React, { useEffect, useState } from 'react'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import { useCollaborationsData } from '@/http-hooks/collaborations'
import { useGetAllEvents } from '@/http-hooks/schedule'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { CalendarDays } from 'lucide-react'
import { useSelector } from 'react-redux'

import { INTEGRATION_STATUS } from '@/lib/constants/integrations'
import { Button } from '@/components/ui/button'

import FilterDropdown, { eventDuration } from './_components/FilterDropdown'
import MeetCard from './_components/MeetCard'
import MeetCardSkeleton from './_components/placeholder/MeetCardSkeleton'
import ProposalMeetSkeleton from './_components/placeholder/ProposalMeetSkeleton'
import ProposalMeetingCard from './_components/ProposalMeetingCard'
import ScheduleMeetDialog from './_components/ScheduleMeetDialog'
import SettingsDialog from './_components/SettingsDialog'

const requiredAppsForMeet = ['G_CALENDAR', 'CALENDLY']

const MySchedule = () => {
  const [value, setValue] = React.useState<eventDuration>('MONTH')
  const { integrations, error: fetchError } = useIntegrationApps()
  const [connectedApps, setConnectedApps] = useState<string[]>([])
  const { data, isLoading } = useGetAllEvents(value) as {
    data: any
    isLoading: boolean
  }
  const { data: proposals, isLoading: proposalLoading } = useCollaborationsData(
    'RECEIVED',
    0,
    3
  )
  const organization = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as any

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (integrations) {
      setConnectedApps(
        integrations
          ?.filter(
            (app) =>
              requiredAppsForMeet.includes(app.id) &&
              app.status === INTEGRATION_STATUS.CONNECTED
          )
          .map((app) => app.id)
      )
    }
  }, [integrations])

  console.log({ connectedApps })

  return (
    <>
      <ScheduleMeetDialog open={open} setOpen={setOpen} />
      <div className='flex flex-col gap-6 px-6'>
        <div className='flex items-center justify-between py-6 '>
          <div className='flex flex-col'>
            <h1 className='text-[20px]/[28px] font-bold '>My Schedule</h1>
            <p className='text-sm font-normal text-[#4D5C78]'>
              View your calendar for meetings
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <FilterDropdown value={value} setValue={setValue} />
            <Button
              disabled={connectedApps.length === 0}
              onClick={() => setOpen(true)}
              className='flex items-center gap-2 text-sm font-bold text-white'
            >
              <CalendarDays size={20} /> Schedule a meeting
            </Button>
            <SettingsDialog />
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <p className='text-lg font-medium '>Upcoming Meetings</p>
          <div className=''>
            {isLoading && (
              <div className='grid grid-cols-4 gap-4'>
                <MeetCardSkeleton />
                <MeetCardSkeleton />
                <MeetCardSkeleton />
              </div>
            )}
            {!isLoading && data?.length === 0 ? (
              <p className='text-sm font-normal text-[#4D5C78]'>
                No upcoming meetings
              </p>
            ) : (
              <div className='grid grid-cols-4 gap-4'>
                {data?.map((event: any) => (
                  <MeetCard data={event} key={event.id} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-4 pb-4'>
          <p className='text-lg font-medium '>Meetings proposals</p>
          {proposalLoading && (
            <div className='grid grid-cols-3 gap-4'>
              <ProposalMeetSkeleton />
              <ProposalMeetSkeleton />
              <ProposalMeetSkeleton />
            </div>
          )}

          {!proposalLoading && proposals?.content?.length === 0 ? (
            <p className='text-sm font-normal text-[#4D5C78]'>
              No proposal received
            </p>
          ) : (
            <div className='grid grid-cols-3 gap-4'>
              {proposals?.content?.map((proposal: any, id: number) => (
                <ProposalMeetingCard
                  key={id}
                  org={organization}
                  data={proposal}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MySchedule
