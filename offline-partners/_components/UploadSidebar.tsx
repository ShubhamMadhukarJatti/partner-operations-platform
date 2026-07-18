'use client'

import React, { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import {
  useUploadContractFile,
  useUploadSignDocument
} from '@/http-hooks/offline-partners'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, X } from 'lucide-react'

import { cn, convertFileToBinary } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { showCustomToast } from '@/components/custom-toast'
import {
  BannerIocn,
  DocumentIcon,
  Signature,
  UploadIocn
} from '@/components/icons/icons'

import ShowPreviewTabs from './ShowpreviewTabs'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const UploadSidebar: React.FC<{
  receipientEmail: string
  currentOrgName: string
  organizationId: number
  orgName: string
  inDummyFlow?: boolean
}> = ({
  receipientEmail,
  currentOrgName,
  organizationId,
  orgName,
  inDummyFlow = false
}) => {
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
  const mouInputRef = useRef<HTMLInputElement>(null)
  const ndaInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)
  const [uploadFile, setUploadFile] = useState(false)

  const [step, setStep] = useState(1)
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null)
  const [signedSuccess, setSignedSuccess] = useState(false)
  const { mutate: uploadSignedDoc, isPending } = useUploadSignDocument()

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
    setSignedSuccess(false)
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

  const handleClick = (docType: string, ref: any) => {
    setSelectedDocType(docType)
    ref?.current?.click()
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
      uploadSignedDoc(
        {
          organizationId: organizationId,
          partnerEmail: receipientEmail,
          binaryPdf: file
        },
        {
          onSuccess: () => {
            setSignedSuccess(true)
            setFile(null)
            setUploadProgress(0)
          }
        }
      )
    } catch (error: any) {
      console.error('File upload error:', error) // Log the error details
    }
  }

  return (
    <Drawer>
      <DrawerTrigger className='flex' asChild>
        <Button
          variant='primary'
          className='flex w-32 items-center gap-2'
          onClick={(e) => {
            if (inDummyFlow) {
              e.preventDefault()
              e.stopPropagation()
              handleDummyAction()
              return
            }
          }}
        >
          <Upload size={16} /> Sign Document
        </Button>
      </DrawerTrigger>

      <DrawerContent className='flex flex-col p-0'>
        <DrawerHeader className='border-b py-3'>
          <div className='flex w-full items-center justify-between  '>
            <div className='flex items-center gap-3'>
              <UploadIocn />
              <div className='flex flex-col'>
                <p className='text-lg font-bold text-[#2A3241]'>
                  {currentOrgName} and {orgName}
                </p>
                <p className='text-center text-base text-[#2A3241]'>
                  Congratulations on a new beginning!
                </p>
              </div>
            </div>
            <DrawerClose asChild>
              <Button
                variant='ghost'
                size='icon'
                className='hover:bg-transparent'
              >
                <X size={20} />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        {!uploadFile && (
          <ScrollArea>
            {step === 1 && (
              <div className='px-6 py-4 text-[#2A3241]'>
                <div className='flex flex-col gap-1 pb-4'>
                  <p className='text-lg font-bold text-[#2A3241]'>
                    Choose the document type
                  </p>
                  <p className='text-base text-[#2A3241]'>
                    Please choose how you’d like to proceed with MoU or NDA
                  </p>
                </div>
                <BannerIocn />

                {/* <div>
                <div className='mx-auto h-[150px] w-[150px]'>
                  <Lottie
                    animationData={require('@/lib/lottie-json/hand-holding-sand-glass.json')}
                    loop={true}
                  />
                </div>
                <p className='text-center text-lg font-bold text-[#2A3241]'>
                  {currentOrgName} and {orgName}
                </p>
                <p className='text-center text-base text-[#2A3241]'>
                  Congratulations on a new beginning!
                </p>
              </div> */}

                <div className='mt-2 flex flex-col gap-4 pt-4'>
                  <button
                    onClick={() => handleClick('MoU', mouInputRef)}
                    className='flex w-full flex-col gap-3 rounded-lg border border-[#EBEBEB] p-3'
                  >
                    <Input
                      ref={mouInputRef}
                      type='file'
                      accept='.pdf,.doc,.docx'
                      className='hidden'
                      onChange={handleFileChange}
                    />
                    <div className='flex items-center gap-4'>
                      <DocumentIcon />
                      <div>
                        <p className='mb-0.5 text-left text-base font-bold'>
                          Upload Custom MoU
                        </p>
                        <p className='text-left text-sm '>
                          Upload your own MoU document
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleClick('NDA', ndaInputRef)}
                    className='flex w-full flex-col gap-3 rounded-lg border border-[#EBEBEB] p-3'
                  >
                    <Input
                      ref={ndaInputRef}
                      type='file'
                      accept='.pdf,.doc,.docx'
                      className='hidden'
                      onChange={handleFileChange}
                    />
                    <div className='flex items-center gap-4'>
                      <DocumentIcon />
                      <div>
                        <p className='mb-0.5 text-left text-base font-bold'>
                          Upload Custom NDA
                        </p>
                        <p className='text-left text-sm '>
                          Upload your own NDA document
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleClick('Document', docInputRef)}
                    className='flex w-full flex-col gap-3 rounded-lg border border-[#EBEBEB] p-3'
                  >
                    <Input
                      ref={docInputRef}
                      type='file'
                      accept='.pdf,.doc,.docx'
                      className='hidden'
                      onChange={handleFileChange}
                    />
                    <div className='flex items-center gap-4'>
                      <DocumentIcon />
                      <div>
                        <p className='mb-0.5 text-left text-base font-bold'>
                          Other
                        </p>
                        <p className='text-left text-sm '>
                          Upload your own NDA or MoU
                        </p>
                      </div>
                    </div>
                  </button>
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
                              {file?.name}
                            </motion.p>
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              layout
                              className='mt-1 w-fit text-sm font-normal leading-4 text-text-80'
                            >
                              {(file?.size / (1024 * 1024)).toFixed(2)} MB
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
              </div>
            )}

            {step === 2 && (
              <div>
                <DrawerHeader className='flex items-center gap-2 border-b px-6 py-5 '>
                  <ArrowLeft
                    onClick={() => setStep(1)}
                    stroke='#3E50F7'
                    size={20}
                  />
                  <h1 className='text-lg font-semibold'>
                    Memorandum of Understanding
                  </h1>
                </DrawerHeader>
                <div className='px-6'>
                  <div>
                    <div className='mx-auto h-[150px] w-[150px]'>
                      <Lottie
                        animationData={require('@/lib/lottie-json/deposit.json')}
                        loop={true}
                      />
                    </div>
                    <p className='text-center text-lg font-bold'>
                      {selectedDocType} to sign
                    </p>
                  </div>

                  <p className='mt-8 text-sm text-[#2A3241]'>
                    Email for signing would be shared to your partners
                  </p>

                  <button className='mt-4 flex w-full flex-col gap-3 rounded-lg border border-[#EBEBEB] p-4'>
                    <DocumentIcon />
                    <div>
                      <p className='mb-0.5 text-left text-base font-bold'>
                        {orgName}
                      </p>
                      <p className='text-left text-sm '>{receipientEmail}</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </ScrollArea>
        )}

        {uploadFile && (
          <>
            {(file || isPending || signedSuccess) && (
              <div className='border-b bg-[#F8FAFF] px-6 py-4'>
                <div className='flex items-center gap-3'>
                  <Image
                    src='/file-upload.svg'
                    alt='Document'
                    width={40}
                    height={40}
                  />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-[#2A3241]'>
                      {signedSuccess
                        ? 'Document sent successfully'
                        : isPending
                          ? 'Uploading...'
                          : file
                            ? file.name
                            : 'Selected document'}
                    </p>
                    {file && !signedSuccess && (
                      <p className='mt-0.5 text-xs text-[#535862]'>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                        {isPending && ' • Sending...'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            <ShowPreviewTabs file={file} />
          </>
        )}

        <DrawerFooter className='border-t'>
          {step === 1 && (
            <div className='flex justify-end'>
              <Button
                variant='primary'
                disabled={!file}
                onClick={() => {
                  setStep(2)
                  setUploadFile(true)
                }}
                className={cn(
                  'flex items-center gap-2',
                  !file && 'cursor-not-allowed'
                )}
              >
                Upload
              </Button>
              {/* <DrawerClose asChild>
                <Button className='w-fit' variant={'link'}>
                  Not for now
                </Button>
              </DrawerClose> */}
            </div>
          )}
          {step === 2 && (
            <div className='flex items-center gap-2'>
              <div className='flex'>
                <Signature />
                <div className='text-xs'>
                  <p className='font-semibold'>Upload & Sign?</p>
                  <p className='text-[#535862]'>
                    Use Zoho Sign for secure, legally-binding digital signatures
                    with real-time tracking and notifications. <br /> Legally
                    binding digital signatures | Real-time tracking | Secure
                    document handling
                  </p>
                </div>
              </div>
              {!signedSuccess && (
                <Button
                  variant='primary'
                  onClick={() => handleSubmit()}
                  loading={isPending}
                  disabled={isPending}
                  className={cn(
                    'w-fit text-sm font-semibold',
                    isPending && 'cursor-not-allowed'
                  )}
                >
                  Send Now
                </Button>
              )}
            </div>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default UploadSidebar
