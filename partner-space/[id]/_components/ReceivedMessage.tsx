'use client'

import React from 'react'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'

interface MessageContainerT {
  children: React.ReactNode
  avatarShow?: boolean
  type: 'SENDER' | 'RECEIVER' | 'ASSISTANT'
  name: string
  time: string
}

interface MessageT {
  message: string
}

export const MessageContainer: React.FC<MessageContainerT> = ({
  children,
  avatarShow = true,
  type,
  name,
  time
}) => (
  <div
    className={cn(
      'flex w-full grow',
      type === 'SENDER' ? 'justify-end' : 'justify-start'
    )}
  >
    <div className={cn('flex gap-3')}>
      {avatarShow && (
        <div className='relative h-fit'>
          <Avatar className='h-10 w-10'>
            <AvatarImage
              className='z-0'
              src={'/assets/AI_assistant.svg'}
              alt='@shadcn'
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='absolute bottom-0 right-0 z-10 h-[10px] w-[10px] rounded-full border-[1.5px] border-[#FFFFFF] bg-[#17B26A]' />
        </div>
      )}

      <div className='flex flex-col gap-1.5'>
        <div className='flex w-full items-center justify-between gap-3'>
          <Label className='text-shark-sm/5 text-[#414651]'>{name}</Label>
          <span className='text-shark-xs/5 font-normal text-[#535862]'>
            {time}
          </span>
        </div>
        {children}
      </div>
    </div>
  </div>
)

const ReceivedMessage: React.FC<MessageT> = ({ message }) => {
  return (
    <div className='float-left max-w-[442px] rounded-lg rounded-tl-none border border-[#E9EAEB] bg-[#FAFAFA] px-3.5 py-2.5 text-[#181D27]'>
      {message}
    </div>
  )
}

export default ReceivedMessage
