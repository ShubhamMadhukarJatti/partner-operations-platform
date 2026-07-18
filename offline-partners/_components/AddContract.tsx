import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { useUploadContractFile } from '@/http-hooks/offline-partners'
import { RootState } from '@/redux/store'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'

import { convertFileToBinary } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { showCustomToast } from '@/components/custom-toast'

export default function ContractUpload({
  open,
  onOpenChange,
  email1,
  email2,
  inDummyFlow = false
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  email1: string
  email2: string
  inDummyFlow?: boolean
}): React.ReactElement {
  const handleDummyAction = () => {
    showCustomToast(
      'Info',
      'No edit access for this dummy account',
      'info',
      5000
    )
  }
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutate: uploadContractFile } = useUploadContractFile()

  const saved = useSelector((state: RootState) => state.currentOrg)

  const { organization } = saved

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (inDummyFlow) {
      event.target.value = '' // Reset file input
      handleDummyAction()
      return
    }

    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (
      ![
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(selectedFile.type)
    ) {
      showCustomToast(
        'Error',
        'Please upload a PDF or DOC file!',
        'error',
        5000
      )
      return
    }

    setFile(selectedFile)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 100)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files[0]
    if (
      ![
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(droppedFile?.type || '')
    ) {
      showCustomToast(
        'Error',
        'Please upload a PDF or DOC file!',
        'error',
        5000
      )
      return
    }
    setFile(droppedFile)
  }

  const handleSubmit = async () => {
    if (inDummyFlow) {
      handleDummyAction()
      return
    }

    if (!file) {
      showCustomToast('Error', 'Please select a file first!', 'error', 5000)
      return
    }
    try {
      // const formData = new FormData()
      // formData.append('document', file);

      uploadContractFile({
        organizationId: organization?.id,
        email: email2,
        binaryPdf: file,
        partnerName: '',
        remarks: ''
      })

      onOpenChange(false)
      setFile(null)
      setUploadProgress(0)
    } catch (error: any) {
      console.error('File upload error:', error) // Log the error details
    }
  }
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='max-w-[90%] gap-6 rounded-2xl p-1 px-5 py-4 md:max-w-[483px]'
        hideCloseBtn
      >
        <DialogHeader className='my-0 flex flex-row items-start justify-between py-0'>
          <div>
            <DialogTitle className='mt-2 text-xl font-bold leading-6 text-text-100 '>
              Add Contracts
            </DialogTitle>
            <DialogDescription className='text-sm leading-4 text-text-80'>
              Upload the pdf/doc file that has access set to open.
            </DialogDescription>
          </div>

          <DialogClose asChild>
            <Button
              variant='ghost'
              className='p-0 hover:bg-transparent'
              onClick={() => onOpenChange(false)}
            >
              <Image
                src={'/close-circle.svg'}
                alt='method-logo'
                width={32}
                height={32}
              />
            </Button>
          </DialogClose>
        </DialogHeader>

        <>
          <div className='w-full rounded-lg border border-dashed border-primary-light-blue bg-background-ghost-white py-10'>
            <motion.div
              whileHover='animate'
              className='group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-0'
              onClick={handleClick}
            >
              <Input
                ref={fileInputRef}
                type='file'
                accept='.pdf,.doc,.docx'
                className='hidden'
                onChange={handleFileChange}
              />

              <div className='flex w-full flex-col items-center justify-center gap-0'>
                <Image src='/upload.svg' alt='CSV' width={87} height={73} />
                <p className='relative z-20 mt-2  text-sm font-bold leading-4 text-primary-light-blue'>
                  Select a Pdf, Docx file to upload
                </p>
                <p className='relative z-20 mt-0.5 text-center text-xs font-normal leading-[14.52px] text-text-80'>
                  or drag & drop it here
                </p>
              </div>
            </motion.div>
          </div>

          {file && (
            <div className='relative mx-auto mt-6 w-full max-w-xl'>
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

        <Separator className=' bg-text-20 text-text-20' />

        <Button
          className=' fds-text-semibold h-12 w-full rounded-lg bg-primary-light-blue text-white hover:bg-primary-light-blue'
          disabled={!file || uploadProgress < 100}
          onClick={handleSubmit}
        >
          Upload
        </Button>
      </DialogContent>
    </Dialog>
  )
}
