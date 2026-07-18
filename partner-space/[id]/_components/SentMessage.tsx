'use client'

import React from 'react'

interface MessageT {
  message: string
}

const SentMessage: React.FC<MessageT> = ({ message }) => {
  return (
    <div className='float-right max-w-[442px] rounded-lg rounded-tr-none bg-[#3E50F7] px-3.5 py-2.5 text-white'>
      {message}
    </div>
  )
}

export default SentMessage
