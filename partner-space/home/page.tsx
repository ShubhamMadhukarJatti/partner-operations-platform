'use client'

import React from 'react'
import { useGetSpace } from '@/http-hooks/partner-space'

import { Separator } from '@/components/ui/separator'
import PageHeader from '@/components/shared/page-header'

import CreateSpaceDialog from '../_components/CreateSpaceDialog'
import SpaceCard from './_components/SpaceCard'

const Container: React.FC<{ children: React.ReactElement }> = ({
  children
}) => <div className='rounded-xl border border-[#E9EAEB]'>{children}</div>

const Home = () => {
  const { data, isLoading } = useGetSpace() as { data: any; isLoading: boolean }
  return (
    <div>
      <PageHeader
        title='Partner Valve Rooms'
        // description='Add subtext about partner valve rooms'
        actionButtons={<CreateSpaceDialog />}
      />

      <div className='select-none p-6'>
        <Container>
          {data &&
            data?.map((space: any) => {
              return (
                <>
                  <SpaceCard
                    channels={space.channel}
                    key={space.chatRoomId}
                    id={space.chatRoomId}
                    spaceName={space.spaceName}
                    members={space.totalMembers}
                    messages={space.totalMessageCount}
                    createdAt={space.creationTimestamp}
                  />
                  <Separator />
                </>
              )
            })}
        </Container>
      </div>
    </div>
  )
}

export default Home
