'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import CSVReader from 'react-csv-reader'

import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'

export default function UploadCSV({
  onChange,
  setCsvData,
  setCsvHeaders
}: {
  onChange?: (data: any[], fileInfo: any) => void
  setCsvData: (data: any[]) => void
  setCsvHeaders: (headers: any[]) => void
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
      <div className='w-full rounded-lg border border-dashed border-primary-light-blue bg-background-ghost-white py-2'>
        <motion.div
          whileHover='animate'
          className='group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-0'
          onClick={handleClick}
        >
          <CSVReader
            ref={fileInputRef}
            cssClass='hidden'
            onFileLoaded={handleFileLoad}
            parserOptions={parserOptions}
          />

          <div className='flex w-full flex-col items-center justify-center gap-0'>
            <Image src='/upload.svg' alt='CSV' width={57} height={43} />
            <p className='relative z-20 mt-2  text-sm font-bold leading-4 text-primary-light-blue'>
              Select a CSV file to upload
            </p>
            <p className='relative z-20 mt-0.5 text-center text-shark-xs font-normal  text-text-80'>
              or drag & drop it here
            </p>
          </div>
        </motion.div>
      </div>

      {file && (
        <div className='relative mx-auto mt-6 w-full'>
          <motion.div
            layoutId='file-upload'
            className='rounded-lg border border-text-20 p-4'
          >
            <div className='flex w-full items-center justify-between gap-4'>
              <div className='flex items-center gap-2'>
                <Image
                  src='/file-upload.svg'
                  alt='CSV'
                  width={40}
                  height={40}
                />

                <div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className='max-w-xs truncate text-base font-bold leading-5  text-text-100 '
                  >
                    {file.name}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className='mt-1 w-fit text-sm font-normal leading-4 text-text-80'
                  >
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </motion.p>
                </div>
              </div>
              <Button
                variant='ghost'
                size='icon'
                className='hover:bg-transparent'
                onClick={() => {
                  setFile(null)
                  setCsvData([])
                  setCsvHeaders([])
                }}
              >
                <Image
                  src='/close-circle-red.svg'
                  alt='CSV'
                  width={32}
                  height={32}
                />
              </Button>
            </div>

            <div className='mt-2 flex items-center justify-between gap-2'>
              <div className='h-2 w-full rounded-full bg-shark-blue-50'>
                <div
                  className='h-full rounded-full bg-primary-light-blue transition-all duration-300 ease-in-out'
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className=' text-right text-xs  text-text-80'>
                {uploadProgress}%
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
