'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'

export default function UploadFile({
  onChange,
  heading,
  subheading
}: {
  onChange?: (data: any[], fileInfo: any) => void
  heading: string
  subheading: string
}): React.ReactElement {
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileLoad = (data: any[], fileInfo: any) => {
    if (!['text/csv'].includes(fileInfo.type)) {
      showCustomToast('Error', 'File type not allowed!', 'error', 5000)
      return
    }
    setFile(fileInfo)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        onChange && onChange(data, fileInfo)
        clearInterval(interval)
      }
    }, 100)
  }

  const parserOptions = {
    header: false,
    dynamicTyping: true,
    skipEmptyLines: true
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <div className='mb-4'>
        <h4 className='text-shark-base font-bold text-text-100'>{heading}</h4>
        <p className='mt-1 text-shark-xs text-text-70'>{subheading}</p>
      </div>
      <div className='w-full rounded-lg border border-dashed border-primary-light-blue bg-background-ghost-white py-4'>
        <motion.div
          whileHover='animate'
          className='group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-0'
          onClick={handleClick}
        >
          <Input
            type='file'
            accept='image/*'
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => {
              //   if (e.target.files && e.target.files[0]) {
              //     const reader = new FileReader()
              //     reader.onload = (e) => {
              //       if (e.target && e.target.result) {
              //         setFile(e.target.result as string)
              //       }
              //     }
              //     reader.readAsDataURL(e.target.files[0])
              //   }
            }}
          />
          <div className='flex w-full flex-col items-center justify-center gap-0'>
            <Image src='/upload.svg' alt='CSV' width={87} height={73} />
            <p className='relative z-20 mt-2  text-sm font-bold leading-4 text-primary-light-blue'>
              Select a file to upload
            </p>
            <p className='relative z-20 mt-0.5 text-center text-xs font-normal leading-[14.52px] text-text-80'>
              or drag & drop it here
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}
