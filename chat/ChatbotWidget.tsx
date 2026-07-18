'use client'

import React, { useState } from 'react'
import { MessageSquare, X } from 'lucide-react'

import ArticlesTab from './ArticlesTab'
import MessagesTab from './MessagesTab'

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'articles' | 'messages'>(
    'messages'
  )

  return (
    <div className='fixed bottom-6 right-6 z-[1000] flex flex-col items-end'>
      {/* Popup Window */}
      {isOpen && (
        <div className='mb-4 flex w-[350px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-10'>
          {/* Header */}
          <div className='relative flex flex-col justify-end bg-[#6863FB] p-6 text-white'>
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className='absolute right-4 top-4 text-white/80 hover:text-white'
            >
              <X size={20} />
            </button>

            <h2 className='text-2xl font-bold'>
              Hi 👋
              <br />
              How may i help you?
            </h2>
          </div>

          {/* Tabs */}
          {/* <div className='flex border-b border-gray-100 p-2'>
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
                activeTab === 'articles'
                  ? 'bg-gray-50 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span className='text-lg'>📰</span> Top Articles
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
                activeTab === 'messages'
                  ? 'bg-gray-50 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span className='text-lg'>💬</span> Messages
            </button>
          </div> */}

          {/* Content Area */}
          <div className='h-[400px] overflow-y-auto bg-gray-50 p-4'>
            {/* {activeTab === 'articles' ? <ArticlesTab /> : <MessagesTab />} */}
            <MessagesTab />
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#6863FB] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${isOpen ? 'pointer-events-none absolute bottom-0 right-0 rotate-90 opacity-0' : 'opacity-100'}`}
        aria-label='Toggle Chat'
      >
        <MessageSquare size={24} fill='white' />
      </button>

      {/* Close Button (visible only when open, replacing the chat button) */}
      <button
        onClick={() => setIsOpen(false)}
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#6863FB] text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${!isOpen ? 'pointer-events-none absolute bottom-0 right-0 rotate-90 opacity-0' : 'opacity-100'}`}
        aria-label='Close Chat'
      >
        <X size={24} />
      </button>
    </div>
  )
}

export default ChatbotWidget
