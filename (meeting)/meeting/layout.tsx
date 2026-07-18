import { redirect } from 'next/navigation'

import { getServerUser } from '@/lib/server'

import MeetingHeader from './_components/Header'

export default async function ProtectedRoutesLayout(props: {
  children: React.ReactNode
}) {
  const { token, user: currentUser } = await getServerUser()

  if (!token) {
    redirect('/login')
  }

  return (
    <div className='flex h-screen bg-muted  '>
      <div className='flex  flex-1 flex-col'>
        <MeetingHeader />
        {props.children}
      </div>
    </div>
  )
}
