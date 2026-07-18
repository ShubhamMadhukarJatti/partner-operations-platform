'use client'

import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'

import { BookDemoForm } from './BookDemoForm'

interface DownloadPlaybookButtonProps {
  pdfUrl: string
  fileName?: string
  demoType?: string
  buttonLabel?: string
}

export const DownloadPlaybookButton: React.FC<DownloadPlaybookButtonProps> = ({
  pdfUrl,
  fileName,
  demoType,
  buttonLabel = 'Download the Playbook'
}) => {
  const [open, setOpen] = useState(false)

  const handleFormSuccess = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    if (fileName) {
      link.download = fileName
    }
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => {
      setOpen(false)
    }, 500)
  }

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='inline-flex h-12 w-fit items-center gap-2 rounded-full bg-indigo-500 px-6 text-white transition-all hover:bg-indigo-600'
      >
        {buttonLabel}
        <ArrowRight size={18} />
      </button>

      {open && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div
            className='absolute inset-0 bg-black/40 backdrop-blur-lg'
            onClick={() => setOpen(false)}
          />

          <BookDemoForm demoType={demoType} onSuccess={handleFormSuccess} />
        </div>
      )}
    </>
  )
}

export default DownloadPlaybookButton
