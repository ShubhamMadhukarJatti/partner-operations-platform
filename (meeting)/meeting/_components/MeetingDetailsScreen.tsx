'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

export function MeetingDetailsScreen({
  onClickJoin,
  onClickCreateMeeting,
  participantName,
  setParticipantName,
  videoTrack,
  setVideoTrack,
  onClickStartMeeting,
  params
}: any) {
  const [meetingId, setMeetingId] = useState('')
  const [meetingIdError, setMeetingIdError] = useState(false)

  return (
    <div className='flex w-full flex-1 flex-col'>
      <Button
        size={'lg'}
        className='font-bold '
        onClick={async (e) => {
          // const meetingId = await onClickCreateMeeting()
          // setMeetingId(meetingId)

          onClickJoin()
        }}
      >
        Join
      </Button>
    </div>
  )
}
