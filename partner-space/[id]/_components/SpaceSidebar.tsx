'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useGetSpace } from '@/http-hooks/partner-space'
import { OrganizationType } from '@/types'
import { ArrowLeft, ChevronDown } from 'lucide-react'

import { getOrganizationById } from '@/lib/db/organization'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  AnnotationHeart,
  HashIcon,
  Notice,
  Star,
  Users
} from '@/components/icons/icons'

import { Messages } from '../../../dashboard/messages'
import SettingsDrawer from '../../home/_components/SettingsDrawer'

export type ChannelKeys =
  | 'GENERAL'
  | 'LEAD'
  | 'MARKETING'
  | 'LEGAL'
  | 'AI_INSIGHTS'

export type ChannelT = {
  channel: ChannelKeys
  messageCount: number
}

const iconsList: {
  [key in ChannelKeys]: React.JSX.Element
} = {
  GENERAL: <HashIcon />,
  LEAD: <Users />,
  MARKETING: <AnnotationHeart />,
  LEGAL: <Notice />,
  AI_INSIGHTS: <Star />
}

const MemberListItem: React.FC<{ name: string; role: string }> = ({
  name,
  role
}) => (
  <div className='flex items-center justify-between rounded-md bg-[#FAFAFA] px-2 py-2.5'>
    <div className='flex items-center gap-2'>
      {/* <Avatar className='h-5 w-5'>
        <AvatarImage
          src={
            data?.logoUrl
              ? data.logoUrl
              : 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
          }
          alt='@shadcn'
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar> */}
      <Label className='text-shark-sm text-[#414651] '>{name}</Label>
    </div>
    <Badge className='h-fit rounded-md border border-[#E9EAEB] bg-[#FAFAFA] px-1.5 py-0.5 lowercase text-text-100 first-letter:uppercase hover:bg-[#FAFAFA]'>
      {role}
    </Badge>
  </div>
)

const ChannelListItem: React.FC<{
  icon: React.JSX.Element
  title: ChannelKeys
  messages: number
  activeChannel: ChannelKeys | null
  setActiveChannel: React.Dispatch<React.SetStateAction<ChannelKeys | null>>
}> = ({ icon, title, messages, activeChannel, setActiveChannel }) => (
  <button
    onClick={() =>
      activeChannel === title ? setActiveChannel(null) : setActiveChannel(title)
    }
    className={cn(
      'flex w-full items-center justify-between rounded-lg px-2 py-2 hover:cursor-pointer hover:bg-[#E5EFFE]',
      activeChannel === title ? 'bg-[#E5EFFE]' : ''
    )}
  >
    <div className='flex items-center gap-2'>
      {icon}
      <Label className='text-shark-sm lowercase text-[#414651] first-letter:uppercase'>
        {title}
      </Label>
    </div>

    <p className='rounded-full border border-[#E9EAEB] px-2 py-0.5 text-shark-xs/5 font-medium text-[#414651]'>
      {messages}
    </p>
  </button>
)

const SpaceSidebar: React.FC<{
  id: number
  channels: any
  partners: any
  activeChannel: ChannelKeys | null
  setActiveChannel: React.Dispatch<React.SetStateAction<ChannelKeys | null>>
}> = ({ id, channels, partners, activeChannel, setActiveChannel }) => {
  const { data } = useGetSpace() as { data: any }
  const router = useRouter()
  const currentSpace = data?.find(
    (space: any) => space.chatRoomId === Number(id)
  )

  return (
    <aside className='flex h-full w-[256px] flex-col justify-between gap-4 border-r py-5'>
      <ScrollArea className='px-4'>
        <div className='flex h-full flex-col gap-4'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 p-0 text-shark-sm/5 font-bold text-[#3E50F7]'
          >
            <ArrowLeft /> Back
          </button>

          <div>
            <Select
              name={'partner'}
              defaultValue={String(id)}
              onValueChange={(value) => router.push(`/partner-space/${value}`)}
              value={String(id)}
            >
              <SelectTrigger className=' w-full rounded-xl border-text-40'>
                <SelectValue placeholder='Select' />
              </SelectTrigger>

              <SelectContent>
                {data &&
                  data?.map((space: any, key: number) => (
                    <SelectItem key={key} value={String(space.chatRoomId)}>
                      {space.spaceName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex justify-between'>
            <Label className='text-shark-xs font-bold text-[#717680]'>
              Partners
            </Label>
            <p className='text-shark-xs text-[#717680]'>
              {currentSpace?.partnerOrgIds?.length} companies
            </p>
          </div>
          <div className='flex flex-col gap-2 pb-4'>
            {partners?.map((partner: any) => (
              <Collapsible key={partner.organizationId}>
                <div className='flex justify-between py-2.5'>
                  <div className='flex items-center gap-2'>
                    <Avatar className='h-5 w-5 shrink-0'>
                      <AvatarImage
                        className='shrink-0 object-contain'
                        src={
                          partner?.logo_url
                            ? partner.logo_url
                            : 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
                        }
                        alt='@shadcn'
                      />
                      {/* <AvatarFallback></AvatarFallback> */}
                    </Avatar>
                    <h4 className='text-shark-sm text-[#414651]'>
                      {partner.organizationName}
                    </h4>
                  </div>
                  <CollapsibleTrigger asChild>
                    <button>
                      <ChevronDown className='h-4 w-4' />
                      <span className='sr-only'>Toggle</span>
                    </button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className='flex flex-col'>
                  {partner.members.map(
                    (user: { name: string; role: string }, key: number) => (
                      <MemberListItem
                        key={key}
                        name={user.name}
                        role={user.role}
                      />
                    )
                  )}
                </CollapsibleContent>
              </Collapsible>
            ))}

            {/* <MemberListItem data={creator} admin />
            <MemberListItem data={joiner} /> */}
          </div>
          <div className='flex justify-between'>
            <Label className='text-shark-xs font-bold text-[#717680]'>
              Channels
            </Label>
            <p className='text-shark-xs font-normal text-[#717680]'>
              4 channels
            </p>
          </div>

          <div className='pb-4'>
            {channels &&
              channels?.map((channel: ChannelT, index: number) => {
                return (
                  <ChannelListItem
                    activeChannel={activeChannel}
                    setActiveChannel={setActiveChannel}
                    key={index}
                    icon={iconsList[channel.channel]}
                    title={channel?.channel}
                    messages={channel?.messageCount}
                  />
                )
              })}
          </div>
        </div>
      </ScrollArea>

      {/* <SettingsDrawer buttonText={'Space Settings'} /> */}
    </aside>
  )
}

export default SpaceSidebar
