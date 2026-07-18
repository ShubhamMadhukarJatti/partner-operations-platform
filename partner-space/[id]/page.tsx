'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  useGetBenefits,
  useGetMessage,
  useGetSpace,
  useUpdateMessages
} from '@/http-hooks/partner-space'
import { RootState } from '@/redux/store'
import { update } from 'lodash'
import { LinkIcon, SearchIcon, Smile } from 'lucide-react'
import { useSelector } from 'react-redux'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ThreeDotsIcon } from '@/components/icons/icons'

import { Search } from '../../explore-2/_components/search'
import ReceivedMessage, {
  MessageContainer
} from './_components/ReceivedMessage'
import ReplyUi from './_components/ReplyUi'
import RightSidebar from './_components/RightSidebar'
import SentMessage from './_components/SentMessage'
import SpaceSidebar, { ChannelKeys, ChannelT } from './_components/SpaceSidebar'

export type MessageT = {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  chatRoomId: number
  query: string
  linkerId: number
  linkerType: string
  flag: 'SENDER' | 'RECEIVER' | 'ASSISTANT'
  benefit: string
  description: string
  channelFlag: string
  readAt: string
  senderId: string
  receiverId: number
  read: boolean
}

export type MessagesT = {
  messageByChannel: MessageT[]
  totalMessageCount: number
  currentPage: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  spaceName: string
  totalMemberCount: number
  channels: ChannelT[]
}

type ParamT = {
  id: number
}
const CompanySpacePage: React.FC<{ params: ParamT }> = ({ params: { id } }) => {
  const [text, setText] = useState<string>('')
  const searchParams = useSearchParams()

  const linkerId = searchParams.get('linkerId')
  const linkerType = searchParams.get('type')
  const [textMessages, setTextMessages] = useState<any>([])
  const [activeChannel, setActiveChannel] = useState<ChannelKeys | null>(null)
  const [receiver, setReceiver] = useState<any>({})
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { data, isLoading: spaceLoading } = useGetSpace() as {
    data: any
    isLoading: boolean
  }
  const { data: messages, isLoading } = useGetMessage(id, activeChannel) as {
    data: any
    isLoading: boolean
  }

  const mutate = useUpdateMessages()

  const { data: benefitData } = useGetBenefits(linkerId, linkerType) as {
    data: { id: number; benefit: string; description: string }
  }
  // console.log({ linkerId, linkerType})

  console.log({ benefitData })
  const { loading: orgLoading, organization } = saved

  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp)

    // Get current date
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    // Format time
    const options = { hour: '2-digit', minute: '2-digit', hour12: true } as any
    const time = date.toLocaleString('en-US', options).toLowerCase()

    return `${isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long' })} ${time}`
  }

  const sendReply = async () => {
    if (text === '' && data) return

    if (spaceLoading) return

    const receiverId =
      data
        ?.find((space: any) => space.chatRoomId === Number(id))
        ?.partnerOrgIds?.find((orgId: number) => orgId !== organization?.id) ||
      null

    console.log({ receiverId })
    console.log({ id: organization?.id })
    console.log({ data })
    try {
      if (receiverId === organization?.id) return
      // const newMessage = updateChatMessages({
      //   chatRoomId: id,
      //   query: text,
      //   flag: 'SENDER',
      //   linkerId: linkerId ?? '-1',
      //   linkerType: linkerType ?? 'EMPTY',
      //   senderId: organization.id,
      //   receiverId: receiverId
      // })
      mutate.mutate(
        {
          chatRoomId: id,
          query: text,
          flag: 'SENDER',
          linkerId: linkerId ?? '-1',
          linkerType: linkerType ?? 'EMPTY',
          senderId: organization.id,
          receiverId: receiverId
        },
        {
          onSuccess: (res) => {
            setTextMessages((prevMessages: any) => [res, ...prevMessages])
          }
        }
      )
      // console.log({
      //   chatRoomId: id,
      //   query: text,
      //   flag: 'SENDER',
      //   linkerId: linkerId ?? '-1',
      //   linkerType: linkerType ?? 'EMPTY',
      //   senderId: organization.id,
      //   receiverId: data?.find((space: any) => space.chatRoomId === Number(id))
      //     .partnerJoined[0]
      // })

      // setTextMessages((prevMessages: any) => [newMessage, ...prevMessages])

      setText('')
    } catch (error) {
      console.error('Failed to send message:', error)
      // Optionally, display an error message to the user
    }
  }

  useEffect(() => {
    if (messages)
      setTextMessages(Object.values(messages?.messageByChannel).flat())
  }, [messages])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (data && messages) {
      const receiverId = data?.find(
        (space: any) => space.chatRoomId === Number(id)
      ).partnerJoined[0]

      const partner = messages?.partner?.filter(
        (partner: any) => partner.organizationId === receiverId
      )

      setReceiver(partner)
    }
  }, [data, messages])

  // useEffect(() => {
  //   refetch();
  // }, [activeChannel])

  return (
    <div className='flex h-full select-none'>
      <SpaceSidebar
        id={id}
        channels={messages?.channels}
        partners={messages?.partners}
        activeChannel={activeChannel}
        setActiveChannel={setActiveChannel}
      />
      <main className='h-full grow overflow-hidden'>
        {/* header */}
        <div className='flex w-full justify-between border-b border-[#E4E7EE] px-6 py-4'>
          <div className='flex flex-col gap-[5px]'>
            <h1 className='text-shark-xl font-bold'>Partner Valve Rooms</h1>
            {/* <div className='flex gap-4'>
              <div className='flex gap-0.5'>
                <PinIcon stroke='#3E50F7' />
                <p className='text-shark-base text-[#3E50F7]'>3</p>
              </div>
              <div className='flex gap-0.5'>
                <GiftIcon />
                <p className='text-shark-base text-[#3E50F7]'>3</p>
              </div>
              <div className='flex gap-0.5'>
                <LinkIcon stroke='#3E50F7' size={16} />
                <p className='text-shark-base text-[#3E50F7]'>3</p>
              </div>
            </div> */}
          </div>

          <div className='flex items-center gap-4'>
            <Search
              className='hidden h-fit w-[320px] rounded-lg border-[#D5D7DA] text-shark-base text-[#717680] placeholder:text-shark-base md:flex'
              placeholder='Search'
            />

            <SearchIcon className='flex md:hidden' size={24} />

            {/* <Button>Start Channel</Button> */}
          </div>
        </div>

        <div className='flex h-full w-full'>
          <div className='h-full grow'>
            <ScrollArea
              className={cn(
                'hide-scrollbar h-[calc(100%-201px)] px-6 pt-1 [&:div]:h-full',
                benefitData ? 'h-[calc(100%-259px)]' : ''
              )}
              ref={scrollAreaRef}
            >
              <div className='flex flex-col-reverse justify-end gap-4 pb-4'>
                {textMessages?.map((message: MessageT) => {
                  return message?.flag === 'ASSISTANT' ? (
                    <MessageContainer // AI Assistant
                      key={message?.id}
                      name='AI Assistant'
                      time={formatTimestamp(message?.creationTimestamp)}
                      type={message?.flag}
                      avatarShow={message?.flag === 'ASSISTANT' ? true : false}
                    >
                      <ReceivedMessage message={message?.query} />
                    </MessageContainer>
                  ) : message?.senderId === organization?.id ? (
                    <MessageContainer // sender
                      key={message?.id}
                      type='SENDER'
                      avatarShow={false}
                      name='You'
                      time={formatTimestamp(message?.creationTimestamp)}
                    >
                      {message?.linkerId > 0 ? (
                        <ReplyUi
                          flag='SENDER'
                          replying={true}
                          title={message?.benefit}
                          description={message?.description}
                        >
                          <p className='text-base'>{message?.query}</p>
                        </ReplyUi>
                      ) : (
                        <SentMessage message={message?.query} />
                      )}
                    </MessageContainer>
                  ) : (
                    <MessageContainer // receiver
                      key={message?.id}
                      name={receiver?.organizationName}
                      time={formatTimestamp(message?.creationTimestamp)}
                      type={'RECEIVER'}
                      avatarShow={false}
                    >
                      {message?.linkerId > 0 ? (
                        <ReplyUi
                          flag='RECEIVER'
                          replying={true}
                          title={message?.benefit}
                          description={message?.description}
                        >
                          <p className='text-base'>{message?.query}</p>
                        </ReplyUi>
                      ) : (
                        <ReceivedMessage message={message?.query} />
                      )}
                    </MessageContainer>
                  )
                })}
              </div>
            </ScrollArea>
            <div className='mx-6'>
              {benefitData ? (
                <ReplyUi
                  flag='SENDER'
                  title={benefitData?.benefit}
                  description={benefitData?.description}
                ></ReplyUi>
              ) : (
                <></>
              )}

              <div
                className={cn(
                  'relative  mb-6 h-24 overflow-hidden rounded-lg border'
                )}
              >
                <Input
                  className='border-none px-3.5 py-3 ring-0 focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-transparent'
                  placeholder='Send a message...'
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className='absolute bottom-4 right-4 z-20 flex items-center gap-3 bg-white'>
                  {/* <Smile />
                <button className=' rotate-90'>
                  <ThreeDotsIcon />
                </button> */}
                  <Button onClick={() => sendReply()}>Send</Button>
                </div>
              </div>
            </div>
          </div>
          <RightSidebar />
        </div>
      </main>
    </div>
  )
}

export default CompanySpacePage
