'use client'

import React from 'react'

import { type EmailFormData } from '../_hooks/useEmailComposerSteps'

interface EmailPreviewProps {
  formData: EmailFormData
  recipientEmail?: string
  recipientName?: string
}

const EmailPreview: React.FC<EmailPreviewProps> = ({
  formData,
  recipientEmail,
  recipientName
}) => {
  const recipient = recipientEmail || recipientName

  return (
    <div className='rounded-2xl border border-gray-200 bg-[#F9FAFB]'>
      {/* Title */}
      <h2 className='p-4 text-lg font-medium text-text-100'>
        This is the preview
      </h2>

      {/* Separator */}
      <div className='mb-2 h-px bg-gray-200' />

      {/* Email Fields */}
      <div className='space-y-2 px-5 py-3'>
        {/* From */}
        <div className='flex items-center gap-3'>
          <span className='text-lg font-medium text-text-60'>From:</span>
          <span className='text-lg font-medium text-text-100'>
            you@company.com
          </span>
        </div>

        {/* To */}
        <div className='flex items-center gap-3'>
          <span className='text-lg font-medium text-text-60'>To:</span>
          <span className='text-lg font-medium text-text-100'>{recipient}</span>
        </div>

        {/* Subject */}
        <div className='flex items-center gap-3'>
          <span className='text-lg font-medium text-text-60'>Subject:</span>
          <span className='text-lg font-medium text-text-100'>
            {formData.subject}
          </span>
        </div>
      </div>

      {/* Email Content */}
      <div className='px-5 py-3'>
        <div
          className='text-base font-normal text-gray-900'
          dangerouslySetInnerHTML={{ __html: formData.body }}
        />
      </div>
    </div>
  )
}

export default EmailPreview
