'use client'

import { ChangeEvent, useState } from 'react'
import { MessageQuestion, Send } from 'iconsax-react'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

type Message = {
  sender: 'user' | 'bot'
  text: string
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { sender: 'user', text: input }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      const data = await response.json()
      const botMessage: Message = { sender: 'bot', text: data.reply }

      setMessages((prevMessages) => [...prevMessages, botMessage])
    } catch (error) {
      console.error('Error:', error)
    }

    setLoading(false)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className='fixed bottom-4 right-4 z-50 flex flex-col items-end'>
      {isOpen && (
        <Card className='mb-4 w-full max-w-[calc(100vw-2rem)] shadow-lg sm:w-96'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <div className='text-sm font-bold'>Chat Support</div>
            <Button
              variant='ghost'
              size='icon'
              onClick={toggleChat}
              className='h-8 w-8 rounded-full p-0'
            >
              <X className='h-4 w-4' />
              <span className='sr-only'>Close</span>
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-[50vh] max-h-[400px] pr-4'>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-2 ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className='flex justify-start'>
                  <div className='animate-pulse rounded-lg bg-muted p-2 text-muted-foreground'>
                    Bot is typing...
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
              className='flex w-full items-center space-x-2'
            >
              <Input
                type='text'
                placeholder='Type a message...'
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <Button type='submit' size='icon'>
                <Send className='h-4 w-4' />
                <span className='sr-only'>Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
      <Button
        onClick={toggleChat}
        size='icon'
        className='h-12 w-12 rounded-full shadow-lg'
      >
        {isOpen ? (
          <X className='h-6 w-6' />
        ) : (
          <MessageQuestion className='h-8 w-8' />
        )}
        <span className='sr-only'>{isOpen ? 'Close chat' : 'Open chat'}</span>
      </Button>
    </div>
  )
}
