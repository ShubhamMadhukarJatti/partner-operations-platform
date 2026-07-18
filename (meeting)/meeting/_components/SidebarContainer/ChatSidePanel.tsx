import React, { useEffect, useRef, useState } from 'react'
import { useMeeting, usePubSub } from '@videosdk.live/react-sdk'

import { Textarea } from '@/components/ui/textarea'

import { formatAMPM, json_verify, nameTructed } from '../helper'

const ChatMessage = ({ senderId, senderName, text, timestamp }: any) => {
  const mMeeting = useMeeting()
  const localParticipantId = mMeeting?.localParticipant?.id
  const localSender = localParticipantId === senderId

  return (
    <div
      className={`flex ${localSender ? 'justify-end' : 'justify-start'} mt-4`}
    >
      <div
        className={`flex ${
          localSender ? 'items-end' : 'items-start'
        } flex-col rounded-md bg-gray-700 px-2 py-1`}
      >
        <p style={{ color: '#ffffff80' }}>
          {localSender ? 'You' : nameTructed(senderName)}
        </p>
        <div>
          <p className='inline-block whitespace-pre-wrap break-words text-right text-white'>
            {text}
          </p>
        </div>
        <div className='mt-1'>
          <p className='text-xs italic' style={{ color: '#ffffff80' }}>
            {formatAMPM(new Date(timestamp))}
          </p>
        </div>
      </div>
    </div>
  )
}

const ChatInput = () => {
  const [message, setMessage] = useState('')
  const { publish } = usePubSub('CHAT')
  const input = useRef<any>()

  return (
    <div>
      <div className='grid gap-2 bg-transparent bg-none  px-6 py-5'>
        <Textarea
          className='relative resize-none rounded-xl border  border-[#D4D4D4] shadow-md'
          placeholder='Type your message here.'
          onChange={(e: any) => {
            setMessage(e.target.value)
          }}
          ref={input}
          value={message}
          onKeyPress={(e: any) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              const messageText = message.trim()

              if (messageText.length > 0) {
                publish(messageText, { persist: true })
                setTimeout(() => {
                  setMessage('')
                }, 100)
                input.current?.focus()
              }
            }
          }}
        ></Textarea>
        <button
          disabled={message.length < 2}
          onClick={() => {
            const messageText = message.trim()
            if (messageText.length > 0) {
              publish(messageText, { persist: true })
              setTimeout(() => {
                setMessage('')
              }, 100)
              input.current?.focus()
            }
          }}
          className='absolute m-2 place-self-end rounded-3xl border bg-[#E7E9EA] px-4 py-2 text-sm'
        >
          Send
        </button>
      </div>
    </div>
  )
}

const ChatMessages = ({ listHeight }: any) => {
  const listRef = useRef<any>()
  const { messages } = usePubSub('CHAT')

  const scrollToBottom = (data?: any) => {
    if (!data) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight
      }
    } else {
      const { text } = data

      if (json_verify(text)) {
        const { type } = JSON.parse(text)
        if (type === 'CHAT') {
          if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight
          }
        }
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return messages ? (
    <div
      ref={listRef}
      style={{ height: listHeight }}
      className='hide-scrollbar    overflow-scroll '
    >
      <div className='hide-scrollbar overflow-y-scroll'>
        {messages.map((msg, i) => {
          const { senderId, senderName, message, timestamp } = msg
          return (
            <ChatMessage
              key={`chat_item_${i}`}
              {...{ senderId, senderName, text: message, timestamp }}
            />
          )
        })}
      </div>
    </div>
  ) : (
    <p>No messages</p>
  )
}

export function ChatSidePanel({ panelHeight }: any) {
  const listHeight = panelHeight - 250

  return (
    <div className='flex h-full flex-col  justify-end   '>
      <ChatMessages listHeight={listHeight} />
      <ChatInput />
    </div>
  )
}
