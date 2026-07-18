'use client'

import React from 'react'
import { X } from 'lucide-react'

import { ScrollArea } from '@/components/ui/scroll-area'

import ReceivedMessage, { MessageContainer } from './ReceivedMessage'

const RightSidebar = () => {
  return (
    <aside className='float-right h-full w-[283px] border-l'>
      <ScrollArea className='h-[calc(100%-81px)]'>
        <div className='flex w-full items-center justify-between border-b border-[#E4E7EE] p-4'>
          <h2 className='text-shark-sm'>Pinned Messages</h2>
          <X size={16} stroke='#717680' />
        </div>

        <div className='flex flex-col gap-6 p-4'>
          {/* <MessageContainer avatarShow={false} type='RECEIVER'>
            <ReceivedMessage
              message={
                'Sure thing, I’ll have a look today. They’re looking great!'
              }
            /> */}
          {/* </MessageContainer> */}
          {/* <MessageContainer avatarShow={false} type='SENDER'>
            <ReceivedMessage
              message={
                'Sure thing, I’ll have a look today. They’re looking great!'
              }
            />
          </MessageContainer>
          <MessageContainer avatarShow={false} type='receive'>
            <ReceivedMessage
              message={
                'Sure thing, I’ll have a look today. They’re looking great!'
              }
            />
          </MessageContainer>
          <MessageContainer avatarShow={false} type='receive'>
            <ReceivedMessage
              message={
                'Sure thing, I’ll have a look today. They’re looking great!'
              }
            />
          </MessageContainer>
          <MessageContainer avatarShow={false} type='receive'>
            <ReceivedMessage
              message={
                'Sure thing, I’ll have a look today. They’re looking great!'
              }
            />
          </MessageContainer>
          <MessageContainer avatarShow={false} type='receive'>
            <ReceivedMessage
              message={
                'Sure thing, I’ll have a look today. They’re looking great!'
              }
            />
          </MessageContainer>
          <MessageContainer avatarShow={false} type='receive'>
            <ReceivedMessage
              message={
                'Sure thing, I’ll have a look today. They’re looking great!'
              }
            />
          </MessageContainer>
          <MessageContainer avatarShow={false} type='receive'>
            <ReceivedMessage
              message={
                'Sure thing, I’ll have a look today. They’re looking great!'
              }
            />
          </MessageContainer>
          <MessageContainer avatarShow={false} type='receive'>
            <ReceivedMessage
              message={
                'Sure thing, I’ll have a look today. They’re looking great!'
              }
            />
          </MessageContainer>
          <MessageContainer avatarShow={false} type='receive'>
            <ReceivedMessage
              message={
                'Sure thing, I’ll have a look today. They’re looking great!'
              }
            />
          </MessageContainer> */}
        </div>
      </ScrollArea>
    </aside>
  )
}

export default RightSidebar
