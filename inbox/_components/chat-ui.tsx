import React from 'react'
import Image from 'next/image'
import moment from 'moment'

import { cn } from '@/lib/utils'

import DashboardItemWrapper from '../../dashboard/[id]/_components/dashboard-item-wrapper'

type Props = {
  messages: any
}

interface ChatBubbleProps {
  children: React.ReactNode
  sender: 'my-partner' | 'me'
  date: string
}

const ChatUI = ({ messages }: Props) => {
  return (
    <DashboardItemWrapper className='h-full p-4'>
      <div className='hide-scrollbar mb-10 flex-1 overflow-y-auto '>
        {messages.map((item: any, index: any) => (
          <ChatBubble
            sender={item.flag === 'SENDER' ? 'me' : 'my-partner'}
            key={item.id}
            date={item.creationTimestamp}
          >
            {item.linkerId !== '-1' ? <>{item.query}</> : item.query}
          </ChatBubble>
        ))}
      </div>
    </DashboardItemWrapper>
  )
}

export default ChatUI

export const ChatBubble = ({ children, sender, date }: ChatBubbleProps) => {
  const bubbleClasses = cn(
    'max-w-lg p-4 bg-background-ghost-white font-medium text-base text-text-100 rounded-t-2xl rounded-r-2xl',
    {
      'bg-primary-light-blue text-white rounded-t-2xl rounded-l-2xl rounded-b-2xl rounded-br-none':
        sender === 'me'
    }
  )

  return (
    <div
      className={cn('mb-4 flex items-end', {
        'justify-end': sender === 'me'
      })}
    >
      {sender === 'my-partner' && (
        <Image
          src={
            ' https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
          }
          className='mb-[30px] mr-2.5 rounded-lg'
          width={40.03}
          height={40.03}
          alt={''}
        />
      )}
      <div
        className={cn('flex flex-col items-start ', {
          'items-end': sender === 'me'
        })}
      >
        <div className={bubbleClasses}>{children}</div>
        <span className='mt-2.5  text-sm font-medium text-text-60'>
          {moment(date).format('MMM DD  h:mm A')}
        </span>
      </div>
      {sender === 'me' && (
        <Image
          src={
            ' https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
          }
          className='mb-[30px] ml-2.5 rounded-lg'
          width={40.03}
          height={40.03}
          alt={''}
        />
      )}
    </div>
  )
}
