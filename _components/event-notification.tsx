'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notificationAction } from '@/redux/reducers/notification'
import { NotificationType } from '@/types'
import moment from 'moment'
import { useDispatch } from 'react-redux'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const EventNotification = ({
  notification,
  token
}: {
  notification: NotificationType
  token: string
}) => {
  const { body, subject, lastUpdatedTimestamp } = notification
  const dispatch: any = useDispatch()

  const [read, setRead] = useState(notification.read)

  const handleReadNotification = async (id: number) => {
    if (!Number.isInteger(id) || id <= 0) {
      console.error('Invalid notification ID')
      return
    }

    try {
      const response = await fetch(
        `/api/notification?id=${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json-patch+json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify([
            {
              op: 'replace',
              path: '/read',
              value: true
            }
          ])
        }
      )

      if (!response.ok) {
        throw new Error(
          `Failed to update notification. Status: ${response.status}`
        )
      }

      dispatch(notificationAction.markAsRead({ id }))

      setRead(true)
    } catch (error) {
      console.error('Error updating notification:', error)
    }
  }

  const getClickActionUrl = (dataMap: string) => {
    const match = dataMap.match(/clickAction:([^,]+)/)
    return match ? match[1] : null
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-md border-l-[6px] border-primary bg-shark-blue-100 px-5 py-4',
        {
          'bg-background-ghost-white': read
        }
      )}
      onClick={() => handleReadNotification(notification.id)}
    >
      <div className='flex flex-col gap-4 sm:flex-row'>
        <div className='flex size-12 items-center justify-center rounded-full  border border-primary bg-transparent'>
          <Image
            src={
              'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
            }
            alt=''
            width={50}
            height={50}
            className='size-8 '
          />
        </div>

        <div className=''>
          <p className=' max-w-md text-base text-[#101828]  lg:max-w-lg'>
            {subject}
          </p>
          <div className=' mt-1 flex flex-col rounded-md bg-white px-2 py-3'>
            <p className=' max-w-md text-sm text-[#475467] lg:max-w-lg'>
              {body}
            </p>
            <Image
              src={'/assets/event-noti.svg'}
              alt='event-poster'
              className='mt-2'
              height={93}
              width={193}
            />
          </div>
          <Link
            target='_blank'
            href={getClickActionUrl(notification.additionalDataMap)!}
          >
            <Button
              className='mt-2 border border-[#475467] bg-white px-7 text-[#475467] hover:bg-transparent hover:text-[#475467]'
              size='sm'
            >
              {' '}
              Register for event
            </Button>
          </Link>
        </div>
      </div>

      <span className='self-start  text-sm text-muted-foreground'>
        {moment(lastUpdatedTimestamp).fromNow()}
      </span>
    </div>
  )
}

export default EventNotification

function getTimeString(date: string) {
  let now = new Date().getTime()
  let notificationTime = new Date(date).getTime()
  let diff = now - notificationTime
  let hours = Math.floor(diff / 1000 / 60 / 60)
  if (hours < 24) {
    return `${hours} hours ago`
  }
  let days = Math.floor(hours / 24)
  if (days < 7) {
    return `${days} days ago`
  }
  let weeks = Math.floor(days / 7)
  if (weeks < 4) {
    return `${weeks} weeks ago`
  }
  let months = Math.floor(weeks / 4)
  return `${months} months ago`
}
