import React from 'react'
import Image from 'next/image'
import { RootState } from '@/redux/store'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { CloseCircle } from 'iconsax-react'
import { useSelector } from 'react-redux'

import { useAuth } from '@/lib/firebase/auth/context'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent } from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'

import { Notification } from './notifications'

type Props = {
  open: boolean
  setOpen: (isOpen: boolean) => void
}

const NotificationsDrawer = ({ open, setOpen }: Props) => {
  const { token, user }: any = useAuth()
  const { notifications, notificationLoading, unreadCount } = useSelector(
    (state: RootState) => state.notification
  )

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className='hide-scrollbar fixed top-2.5  h-[calc(100vh-1.25rem)] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-2xl border-none p-5 md:right-2.5 md:top-2.5 '>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <h3 className='fds-heading text-text-100'>Notifications</h3>

            {unreadCount > 0 && (
              <span className='flex h-6 w-6 items-center justify-center rounded-full bg-shark-blue-50 text-shark-sm font-bold text-primary-light-blue'>
                {unreadCount}
              </span>
            )}
          </div>

          <DrawerClose asChild>
            <Button
              variant='link'
              onClick={() => {
                setOpen(false)
              }}
            >
              <CloseCircle size={32} color='#2A3241' />
            </Button>
          </DrawerClose>
        </div>
        <Separator className='my-5 bg-text-20' />

        <div>
          {notifications?.length === 0 && (
            <div className='flex h-full items-center justify-center '>
              <div className='flex flex-col  items-center '>
                <Image
                  src={'/no-noti.png'}
                  alt='no-deals'
                  height={180}
                  width={180}
                />
                <h2 className='mt-5 text-2xl font-semibold  leading-5'>
                  You have no notification
                </h2>
                <p className='mt-2.5 text-sm text-[#667085]'>
                  Check here for update regarding partnership request, who is
                  joining your partner’s network
                </p>
              </div>{' '}
            </div>
          )}
          <ScrollArea className='max-h-auto'>
            <div className='flex flex-col gap-2 rounded-md '>
              {notifications?.map((notification: any) => (
                <Notification
                  key={notification.id}
                  notification={notification}
                  token={token!}
                />
              ))}
            </div>{' '}
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default NotificationsDrawer
