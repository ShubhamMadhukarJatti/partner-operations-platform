'use client'

import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { BookDemoForm } from './BookDemoForm'

interface DownloadPlaybookButtonV2Props {
  pdfUrl: string
  fileName?: string
  demoType?: string
  buttonLabel?: string
  onModalToggle?: (isOpen: boolean) => void
}

export const DownloadPlaybookButtonV2: React.FC<DownloadPlaybookButtonV2Props> = ({
  pdfUrl,
  fileName,
  demoType,
  buttonLabel = 'Download the Playbook',
  onModalToggle
}) => {
  const [open, setOpen] = useState(false)

  const toggleModal = (isOpen: boolean) => {
    setOpen(isOpen)
    if (onModalToggle) {
      onModalToggle(isOpen)
    }
  }

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
      toggleModal(false)
    }, 500)
  }

  return (
    <>
      <button
        type='button'
        onClick={() => toggleModal(true)}
        className='inline-flex h-12 w-fit items-center gap-2 rounded-full bg-indigo-500 px-6 text-white transition-all hover:bg-indigo-600'
      >
        {buttonLabel}
        <ArrowRight size={18} />
      </button>

      <Dialog open={open} onOpenChange={toggleModal}>
        <DialogContent 
          hideCloseBtn 
          className='w-full max-w-[720px] border-none bg-transparent p-0 shadow-none'
          overlayClassName='bg-black/60 backdrop-blur-sm'
        >
          <BookDemoForm demoType={demoType} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DownloadPlaybookButtonV2
