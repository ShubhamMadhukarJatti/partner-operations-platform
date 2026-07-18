'use client'

import { useState } from 'react'
import { notificationAction } from '@/redux/reducers/notification'
import { NotificationType } from '@/types'
import moment from 'moment'
import { useDispatch } from 'react-redux'

import { cn } from '@/lib/utils'
import { ImageFallback } from '@/components/shared/image-with-fallback'

import EventNotification from './event-notification'
import VerifyNotification from './verify-notification'

export const Notification = ({
  notification,
  token
}: {
  notification: NotificationType
  token: string
}) => {
  const { additionalDataMap } = notification

  const renderNotificationContent = () => {
    const additionalData = additionalDataMap
      ?.split(', ')
      ?.reduce((acc: { [key: string]: string }, item) => {
        const [key, value] = item?.split(':')
        acc[key] = value
        return acc
      }, {})

    switch (additionalData?.campaign) {
      case 'event':
        return <EventNotification notification={notification} token={token} />

      case 'verify':
        return <VerifyNotification notification={notification} token={token} />

      default:
        return <NotificationItem notification={notification} token={token} />
    }
  }

  return <div>{renderNotificationContent()}</div>
}

const NotificationItem = ({
  notification,
  token
}: {
  notification: NotificationType
  token: string
}) => {
  const dispatch: any = useDispatch()

  const [read, setRead] = useState(notification?.read)

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

  return (
    <>
      <div
        className={cn(
          'rounded-2xl border border-text-20  bg-background-ghost-white  px-4 py-3',
          {
            'bg-white': read
          }
        )}
        onClick={() => handleReadNotification(notification?.id)}
      >
        <div className='flex items-start gap-4'>
          <ImageFallback
            src={
              'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
            }
            alt=''
            width={56}
            height={56}
            className=' rounded-full p-0'
          />
          <div className='flex flex-col gap-2.5'>
            <h5 className='text-shark-base font-bold text-text-100'>
              {notification?.subject}
            </h5>
            <p className=' text-shark-base font-medium text-text-80'>
              {notification?.body}
            </p>

            <span className='self-start  text-shark-base font-medium text-text-60'>
              {moment(notification?.creationTimestamp).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
