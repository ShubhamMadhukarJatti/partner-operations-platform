'use client'

import React, { ChangeEvent, useRef, useState } from 'react'

import { updateChatMessages } from '@/lib/actions/inbox'
import { Button } from '@/components/ui/button'

import DashboardItemWrapper from '../../dashboard/[id]/_components/dashboard-item-wrapper'

type Props = {
  chatRoomId: number
  setMessages: any
  isDisabled: boolean
}

const InboxInput = ({ chatRoomId, setMessages, isDisabled }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const [text, setText] = useState('')

  const handleDivClick = () => {
    textareaRef.current?.focus()
  }

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    adjustTextareaHeight()
  }

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  const sendReply = async () => {
    if (text === '') return

    try {
      let type = 'sent'
      const flag = type === 'sent' ? 'SENDER' : 'RECEIVER'
      const newMessage = await updateChatMessages({
        chatRoomId: chatRoomId,
        query: text,
        linkerId: '-1',
        linkerType: 'EMPTY',
        flag,
        senderId: 0,
        receiverId: 0
      })
      setMessages((prevMessages: any) => [...prevMessages, newMessage])

      setText('')
    } catch (error) {
      console.error('Failed to send message:', error)
      // Optionally, display an error message to the user
    }
  }

  return (
    <DashboardItemWrapper className='h-auto'>
      <div className='flex items-center gap-6 p-4' onClick={handleDivClick}>
        <div className='flex w-full flex-col gap-3 '>
          <span className='text-shark-lg font-bold text-text-100'>
            Enter A Message
          </span>

          <textarea
            ref={textareaRef}
            value={text}
            disabled={isDisabled}
            onChange={handleTextChange}
            className='h-auto min-h-[57px] w-full resize-none overflow-hidden border-none text-shark-base font-medium text-text-100 outline-none disabled:bg-white'
            rows={1}
          />
        </div>
        <Button
          onClick={sendReply}
          disabled={isDisabled}
          className='h-12 w-[166px] rounded-lg text-shark-base font-bold text-white hover:bg-shark-blue-500 disabled:bg-text-20 disabled:text-shark-base disabled:font-bold disabled:text-text-60'
        >
          Send
        </Button>
      </div>
    </DashboardItemWrapper>
  )
}

export default InboxInput
