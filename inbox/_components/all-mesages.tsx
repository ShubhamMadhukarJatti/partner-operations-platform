'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import { getChatMessages, getInbox } from '@/lib/db/inbox'
import { cn } from '@/lib/utils'

import DashboardItemWrapper from '../../dashboard/[id]/_components/dashboard-item-wrapper'
import ChatUI from './chat-ui'
import InboxInput from './inbox-input'

function AllMesages({ id }: { id: number }) {
  const [messages, setMessages] = useState<any[] | null>(null)

  const [activeChat, setActiveChat] = useState<number | null>()

  const [chat, setChat] = useState<any[] | null>(null)
  const [chatLoading, setChatLoading] = useState<boolean>(false)

  console.log(messages, chat, activeChat, `navdi`)

  useEffect(() => {
    const getChat = async () => {
      try {
        const inbox = await getInbox(id)

        setMessages(inbox)
      } catch (error) {
        console.error('Failed to fetch inbox:', error)
      }
    }
    getChat()
  }, [id])

  const handleChatActive = async (id: number) => {
    setChatLoading(true)
    setActiveChat(id)

    try {
      const response = await getChatMessages(id)
      setChat(response)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <>
      {messages?.length ? (
        <div className='flex h-[calc(100vh-6rem)] gap-4'>
          <aside className='w-[300px] flex-shrink-0'>
            <DashboardItemWrapper className='h-full w-full flex-grow'>
              <h1 className='p-4 text-2xl font-semibold text-[0F172A]'>
                Inbox
              </h1>

              <div className='hide-scrollbar h-full overflow-y-scroll'>
                {messages === null && <div>Loading...</div>}
                {/* {messages && messages.length === 0 && <div>No Active Chats</div>} */}
                {messages &&
                  Array.isArray(messages) &&
                  messages?.length > 0 &&
                  messages?.map((message: any, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleChatActive(message.chatRoomId)}
                    >
                      <MessageItem
                        message={message}
                        active={activeChat === message.chatRoomId}
                      />
                    </div>
                  ))}
              </div>
            </DashboardItemWrapper>
          </aside>

          {activeChat && !chatLoading && (
            <div className='flex flex-1 flex-col gap-4'>
              <ChatUI messages={chat} />
              <InboxInput
                chatRoomId={activeChat}
                setMessages={setChat}
                isDisabled={false}
              />
            </div>
          )}
        </div>
      ) : (
        <div className='h-full overflow-hidden p-4'>
          <div>
            <h1 className='text-2xl font-semibold text-[0F172A]'>Inbox</h1>
            <p className='mt-2 text-sm text-[#475569]'>
              Send more proposals and keep track of any terms update from your
              partners.
            </p>
          </div>
          <div className='flex h-full items-center justify-center '>
            <div className='flex flex-col  items-center '>
              <Image
                src={'/no-activities.png'}
                alt='no-deals'
                height={150}
                width={150}
              />
              <h2 className='mt-4 text-shark-lg font-bold text-text-100'>
                No messages
              </h2>
              <p className='mt-4 text-shark-sm font-medium text-text-100 '>
                We’ll notify you when there’s a new message
              </p>
            </div>{' '}
          </div>
        </div>
      )}
    </>
  )
}

export default AllMesages

function MessageItem({ active, message }: { active?: boolean; message: any }) {
  console.log(active)

  return (
    <div
      className={cn('w-full  cursor-pointer border-b px-6  py-3', {
        'border-l-[4px] border-l-primary bg-[#F0F6FC] drop-shadow': active
      })}
    >
      <div className='flex justify-between gap-2'>
        <div className='flex items-start  gap-4 '>
          <Image
            src='/icons/logo.svg'
            className='rounded-full '
            width={28}
            height={28}
            alt=''
          />

          <div>
            <h6 className='text-shark-base font-bold text-text-100'>
              {message.organizationName}
            </h6>
            <p className=' my-1 line-clamp-1  text-ellipsis text-sm'>
              {message.lastMessage.query}
            </p>
            <span className='mt-1.5 text-shark-sm font-bold text-text-60'>
              1 day ago
            </span>
          </div>
        </div>

        <div className='flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-center text-white'>
          <span className='text-shark-sm  font-medium'>
            {message.unreadCount}
          </span>
        </div>
      </div>
    </div>
  )
}
