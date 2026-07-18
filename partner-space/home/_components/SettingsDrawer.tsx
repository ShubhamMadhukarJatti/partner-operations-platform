'use client'

import React from 'react'
import { PencilIcon, Plus, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { SettingPin } from '@/components/icons/icons'

const MemberListItem = () => (
  <div className='flex items-center justify-between p-2.5'>
    <div className='flex items-center gap-2'>
      <Avatar className='h-5 w-5'>
        <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Label className='text-shark-sm text-[#414651]'>TechCorp</Label>
    </div>
    <Badge className='h-fit rounded-md border border-[#E9EAEB] bg-[#FAFAFA] px-1.5 py-0.5 text-text-100 hover:bg-[#FAFAFA]'>
      Admin
    </Badge>
  </div>
)

const SettingsDrawer: React.FC<{ buttonText?: string }> = ({
  buttonText = ''
}) => {
  return (
    <Drawer>
      <DrawerTrigger className='flex'>
        <button
          className={cn(
            'flex items-start align-top',
            buttonText ? 'gap-3 text-shark-sm font-medium' : ''
          )}
        >
          <SettingPin /> {buttonText}
        </button>
      </DrawerTrigger>

      <DrawerContent className='flex flex-col p-0'>
        <ScrollArea>
          <div className=''>
            <DrawerHeader className='flex w-full items-center justify-between border-b px-6 py-5'>
              <h3 className='text-xl font-semibold leading-7 text-text-100'>
                Space Settings
              </h3>

              <DrawerClose>
                <X size={24} />
              </DrawerClose>
            </DrawerHeader>

            <div className='flex flex-col gap-6 p-4'>
              <div className='flex flex-col gap-1.5'>
                <Label className='text-shark-sm text-[#414651]'>
                  Partnership Name*
                </Label>
                <Input placeholder='Partnership name' />
                {/* <PencilIcon /> */}
              </div>
              <Separator />

              <div className='flex flex-col gap-5'>
                <div>
                  <p className='text-shark-sm/6 font-semibold text-[#414651]'>
                    Members*
                  </p>
                  <p className='text-shark-sm font-normal text-[#535862]'>
                    2 Members
                  </p>
                </div>
                <div className='flex flex-col gap-1'>
                  <MemberListItem />
                  <MemberListItem />

                  <button className='mt-2 flex items-center gap-1.5 text-shark-sm/5 font-bold text-[#535862]'>
                    <Plus size={20} /> Invite another
                  </button>
                </div>
              </div>
              <Separator />

              <div className='flex flex-col gap-5'>
                <div>
                  <Label className='text-shark-sm/5 font-semibold text-[#414651]'>
                    Notification Preferences
                  </Label>
                  <p className='text-shark-sm/5 font-normal text-[#535862]'>
                    When should notifications be sent?
                  </p>
                </div>

                <div>
                  <RadioGroup
                    defaultValue='all'
                    className='flex flex-col gap-4'
                  >
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='all' id='r1' />
                      <div className='flex flex-col'>
                        <Label
                          className='!text-shark-sm/5 text-[#414651]'
                          htmlFor='r1'
                        >
                          All messages
                        </Label>
                        <Label
                          className='text-shark-sm/5 font-normal text-[#535862]'
                          htmlFor='r1'
                        >
                          Get notified about all messages and activities
                        </Label>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='mentions-only' id='r2' disabled />
                      <div className='flex flex-col'>
                        <Label
                          className='!text-shark-sm/5 text-[#414651]'
                          htmlFor='r2'
                        >
                          Mentions Only{' '}
                        </Label>
                        <Label
                          className='text-shark-sm/5 font-normal text-[#535862]'
                          htmlFor='r2'
                        >
                          Only receive notifications when you are mentioned
                        </Label>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='disabled' id='r3' disabled />
                      <div className='flex flex-col'>
                        <Label
                          className='!text-shark-sm/5 text-[#414651]'
                          htmlFor='r3'
                        >
                          Disabled
                        </Label>
                        <Label
                          className='text-shark-sm/5 font-normal text-[#535862]'
                          htmlFor='r3'
                        >
                          Turn off All Notifications
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DrawerFooter className='border-t p-4'>
          <Button>Save Changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default SettingsDrawer
