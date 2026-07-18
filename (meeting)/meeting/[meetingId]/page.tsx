'use client'

import dynamic from 'next/dynamic'

import { useAuth } from '@/lib/firebase/auth/context'

const MeetingAppContainer = dynamic(() => import('../MeetingAppContainer'), {
  ssr: false
})

const MeetingPage = ({ params }: { params: { meetingId: string } }) => {
  const { user } = useAuth()

  return (
    <MeetingAppContainer meetingId={params.meetingId} userId={user?.uid!} />
  )
}

export default MeetingPage
