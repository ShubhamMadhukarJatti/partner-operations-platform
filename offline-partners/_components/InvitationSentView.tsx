'use client'

import React from 'react'
import { IconX } from '@tabler/icons-react'

interface InvitationSentViewProps {
  emails: string[]
  onClose: () => void
}

const InvitationSentView: React.FC<InvitationSentViewProps> = ({
  emails,
  onClose
}) => {
  const formatEmailsList = (emails: string[]): string => {
    if (emails.length === 0) return ''
    if (emails.length === 1) return emails[0]
    if (emails.length === 2) return `${emails[0]}, ${emails[1]}`

    const othersCount = emails.length - 2
    return `${emails[0]}, ${emails[1]} & ${othersCount} others`
  }

  return (
    <div className='flex flex-col items-center'>
      {/* Close button */}
      <div className='flex w-full justify-end p-4 pb-0'>
        <button
          onClick={onClose}
          className='p-1 text-gray-500 transition-colors hover:text-gray-700'
        >
          <IconX size={20} />
        </button>
      </div>

      {/* Avatars section */}
      <div className='relative mb-6 flex items-center justify-center'>
        {/* Left avatar */}
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-medium text-white'>
          {emails[0]?.charAt(0).toUpperCase() || 'A'}
        </div>

        {/* Middle avatar (elevated and larger with white border) */}
        <div
          className='relative z-10 -mx-2 flex items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-purple-500 to-purple-700 text-base font-medium text-white'
          style={{ width: '56px', height: '56px' }}
        >
          {emails[1]?.charAt(0).toUpperCase() || 'B'}
        </div>

        {/* Right avatar */}
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-sm font-medium text-white'>
          {emails[2]?.charAt(0).toUpperCase() || 'C'}
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        {/* Title */}
        <h2 className='text-center text-lg font-bold text-gray-900'>
          Sent Invitation
        </h2>

        {/* Description */}
        <p className='px-6 text-center text-sm text-gray-600'>
          We&apos;ve sent the link to{' '}
          <span className='font-bold'>{formatEmailsList(emails)}</span>.
        </p>
      </div>
    </div>
  )
}

export default InvitationSentView
