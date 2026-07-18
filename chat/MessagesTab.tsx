'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MessageSquare, Plus, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
}

const MessagesTab = () => {
  const [chatStarted, setChatStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (textareaRef.current && !inputMessage) {
      textareaRef.current.style.height = 'auto'
    }
  }, [inputMessage])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const response = await fetch('/api/chatbot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage.text })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          data?.data?.response || 'Sorry, I could not process your request.',
        sender: 'agent',
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, agentMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'agent',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value)
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    const newHeight = Math.min(textarea.scrollHeight, 120)
    textarea.style.height = `${newHeight}px`
  }

  if (!chatStarted) {
    return (
      <div className='flex h-full flex-col items-center justify-center text-center'>
        <div className='mb-4 rounded-full bg-blue-50 p-4'>
          <MessageSquare className='text-[#6863FB]' size={24} />
        </div>
        <h3 className='mb-2 font-semibold text-gray-900'>No messages yet</h3>
        <p className='text-sm text-gray-500'>
          Start a conversation with our support team.
        </p>
        <Button
          className='mt-6 bg-[#6863FB] hover:bg-[#5a56d6]'
          onClick={() => setChatStarted(true)}
        >
          Start Chat
        </Button>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col justify-between'>
      <div className='flex-1 overflow-y-auto p-4'>
        {messages.length === 0 && (
          <div className='flex justify-center'>
            <span className='rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500'>
              Today
            </span>
          </div>
        )}

        <div className='space-y-4'>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-[#6863FB] text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}
              >
                <p className='whitespace-pre-wrap text-sm'>{message.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className='flex justify-start'>
              <div className='max-w-[80%] rounded-2xl bg-white px-4 py-2 shadow-sm'>
                <div className='flex items-center gap-1'>
                  <span className='text-sm text-gray-500'>Agent is typing</span>
                  <div className='flex gap-1'>
                    <span className='h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]'></span>
                    <span className='h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]'></span>
                    <span className='h-1 w-1 animate-bounce rounded-full bg-gray-400'></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className='p-4 pt-2'>
        <div className='relative flex flex-col rounded-2xl border border-indigo-100 bg-white p-3 shadow-sm transition-all focus-within:ring-1 focus-within:ring-[#6863FB]'>
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            className='max-h-[120px] w-full resize-none bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none'
            placeholder='Ask questions...'
            rows={1}
            disabled={isLoading}
          />

          <div className='absolute bottom-3 left-3'>
            {/* <button
              className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200'
              disabled={isLoading}
            >
              <Plus size={16} />
            </button> */}
          </div>

          <div className='absolute bottom-3 right-3'>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className='mt-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-[#6863FB] hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagesTab
