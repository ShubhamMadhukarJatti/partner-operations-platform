'use client'

import React, { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import {
  useOfflinePartnerDetails,
  useUploadContractFile,
  useUploadSignDocument
} from '@/http-hooks/offline-partners'
import { RootState } from '@/redux/store'
import { uploadFileToExtractAPI } from '@/services/offline-partners'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Email from 'next-auth/providers/email'
import { useSelector } from 'react-redux'

import { getServerUser } from '@/lib/server'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { showCustomToast } from '@/components/custom-toast'
import {
  BannerIocn,
  DocumentIcon,
  EmailIocn,
  Signature,
  UploadIocn
} from '@/components/icons/icons'

import HistoryList from './HistoryList'
import ParticipantsList from './Participants'
import PreviewTab from './PreviewTab'
import Remarks from './Remarks'
import ShowPreviewTabs from './ShowpreviewTabs'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const navTabs = [
  {
    name: 'Preview',
    value: 'preview'
  },
  {
    name: 'Participants',
    value: 'participants'
  },
  {
    name: 'History',
    value: 'history'
  },
  {
    name: 'Remarks',
    value: 'remarks'
  }
]

// Type definition for the extracted contract data
interface ExtractedContractData {
  agreement_type?: string
  contract_platform?: string
  doc_id?: string
  effective_date?: string
  governing_law?: string
  key_obligations?: string[]
  parties_involved?: string[]
  signer1_count?: number
  signer1_list?: Array<{ email: string; name: string }>
  signer2_count?: number
  signer2_list?: Array<{ email: string; name: string }>
  signer3_count?: number
  signer3_list?: Array<{ email: string; name: string }>
  summary?: string
  termination_clause?: string
  validity?: string
  validity_tenure?: string
}

// Type definition for the API response
interface ExtractionResponse {
  status: string
  data: {
    data: ExtractedContractData
  }
}

const UploadContract: React.FC<{
  onOpenChange: (open: boolean) => void
  email1: string
  email2: string
  params?: { id: number }
  inDummyFlow?: boolean
}> = ({ email1, email2, onOpenChange, params, inDummyFlow = false }) => {
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
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [extractionData, setExtractionData] =
    useState<ExtractedContractData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const saved = useSelector((state: RootState) => state.currentOrg)
  const [tab, setTab] = useState('overview')
  const { organization } = saved
  const [step, setStep] = useState(1)
  const [uploadFile, setUploadFile] = useState(false)
  const { mutate: uploadContractFile } = useUploadContractFile()
  const { isLoading } = useOfflinePartnerDetails(params?.id || 123)

  const processFileUpload = async (selectedFile: File) => {
    if (inDummyFlow) {
      handleDummyAction()
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)

    try {
      showCustomToast(
        'Info',
        'Processing document... This may take a few seconds.',
        'info',
        5000
      )

      // Simulate progress during API call
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev < 90) return prev + 10
          return prev
        })
      }, 500)

      // Upload file to document extraction API
      const extractionResult = (await uploadFileToExtractAPI({
        binaryPdf: selectedFile
      })) as ExtractionResponse

      clearInterval(progressInterval)
      setProcessingProgress(100)

      console.log('Document extraction result:', extractionResult)
      console.log('Extraction data being set:', extractionResult.data.data)

      if (extractionResult && extractionResult.status === 'success') {
        // The data is nested in extractionResult.data.data
        setExtractionData(extractionResult.data.data)
        console.log(
          'Extraction data set successfully:',
          extractionResult.data.data
        )
        showCustomToast(
          'Success',
          'Document processed successfully!',
          'success',
          5000
        )
        setUploadFile(true) // Show preview tabs
      } else {
        throw new Error('Extraction failed')
      }

      // Original contract upload logic
      const {
        signer1_count = 0,
        signer2_count = 0,
        signer3_count = 0
      } = extractionResult.data.data
      uploadContractFile({
        organizationId: organization?.id,
        email: email2,
        binaryPdf: selectedFile,
        partnerName: '',
        remarks: '',
        docId: extractionResult.data.data.doc_id || '',
        effectiveDate: extractionResult.data.data.effective_date || '',
        count: signer1_count + signer2_count + signer3_count
      })
      console.log(
        'extractionResult.data.doc_id',
        extractionResult.data.data.doc_id
      )
    } catch (error: any) {
      console.error('File upload error:', error)
      showCustomToast(
        'Error',
        `Processing failed: ${error.message || 'Unknown error occurred'}`,
        'error',
        5000
      )
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
        // Auto-start processing after progress completes
        processFileUpload(selectedFile)
      }
    }, 100)
  }

  // const uploadFileToExtractAPI = async (file: File) => {
  //   const { token } = await getServerUser()
  //   const formData = new FormData()
  //   formData.append('file', file)

  //   const response = await fetch('/api/api/docfetcher/extract-agreement', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       'Authorization': `Bearer ${token}`
  //     },
  //     body: formData
  //   })

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`)
  //   }

  //   return await response.json()
  // }

  const handleSubmit = async () => {
    if (inDummyFlow) {
      handleDummyAction()
      return
    }

    if (!file) {
      showCustomToast('Error', 'Please select a file first!', 'error', 5000)
      return
    }

    setIsUploading(true)
    try {
      showCustomToast(
        'Info',
        'Uploading file for document extraction...',
        'info',
        5000
      )

      // Upload file to document extraction API
      const extractionResult = (await uploadFileToExtractAPI({
        binaryPdf: file
      })) as ExtractionResponse
      console.log('Document extraction result:', extractionResult)

      if (extractionResult && extractionResult.status === 'success') {
        setExtractionData(extractionResult.data.data)
        showCustomToast(
          'Success',
          'File uploaded and processed successfully!',
          'success',
          5000
        )
        setUploadFile(true) // Show preview tabs
      } else {
        throw new Error('Extraction failed')
      }

      // Original contract upload logic
      const {
        signer1_count = 0,
        signer2_count = 0,
        signer3_count = 0
      } = extractionResult.data.data
      uploadContractFile({
        organizationId: organization?.id,
        email: email2,
        binaryPdf: file,
        partnerName: '',
        remarks: '',
        docId: extractionResult.data.data.doc_id || '',
        effectiveDate: extractionResult.data.data.effective_date || '',
        count: signer1_count + signer2_count + signer3_count
      })
    } catch (error: any) {
      console.error('File upload error:', error)
      showCustomToast(
        'Error',
        `Upload failed: ${error.message || 'Unknown error occurred'}`,
        'error',
        5000
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const onTabChange = (value: string) => {
    setTab(value)
  }

  return (
    <Drawer>
      <DrawerTrigger className='flex' asChild>
        <Button
          variant='primary'
          className='flex w-36 items-center gap-2 text-white [&_svg]:stroke-white [&_svg]:text-white'
          onClick={(e) => {
            if (inDummyFlow) {
              e.preventDefault()
              e.stopPropagation()
              handleDummyAction()
              return
            }
          }}
        >
          <Upload size={16} /> Add New Contract
        </Button>
      </DrawerTrigger>

      <DrawerContent className='flex flex-col p-0'>
        <DrawerHeader className='border-b py-3'>
          <div className='flex w-full items-center justify-between  '>
            <div className='flex items-center gap-3'>
              <UploadIocn />
              <div className='flex flex-col'>
                <p className='text-lg font-bold text-[#2A3241]'>
                  Upload Contracts
                </p>
                <p className=' text-base text-[#2A3241]'>
                  Upload the pdf/doc file that has access set to open.
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
              <>
                {/* <div className='flex flex-col px-4 pb-2 pt-4'>
                  <p className='text-lg font-bold text-[#2A3241]'>
                    Upload Contract
                  </p>
                  <p className='text-base text-[#2A3241]'>
                    Drag and drop document to upload your portfolio on previous
                    company.
                  </p>
                </div> */}
                <div className='relative m-4 rounded-lg border-2  border-dashed border-[#C4CDD5] bg-[#FAFBFB] py-10'>
                  {/* Processing Overlay */}
                  {isProcessing && (
                    <div className='absolute inset-0 z-50 flex flex-col items-center justify-center rounded-lg bg-white/95 backdrop-blur-sm'>
                      <div className='flex max-w-xs flex-col items-center gap-4'>
                        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent'></div>
                        <div className='text-center'>
                          <p className='text-sm font-semibold text-[#2A3241]'>
                            Processing Document
                          </p>
                          <p className='mt-1 text-xs text-[#ADB5BD]'>
                            Extracting contract information...
                          </p>
                        </div>
                        {/* Progress bar */}
                        <div className='h-2 w-full rounded-full bg-gray-200'>
                          <div
                            className='h-2 rounded-full bg-primary-blue transition-all duration-500 ease-out'
                            style={{ width: `${processingProgress}%` }}
                          ></div>
                        </div>
                        <p className='text-xs text-[#ADB5BD]'>
                          {processingProgress}% complete
                        </p>
                      </div>
                    </div>
                  )}

                  <motion.div
                    whileHover='animate'
                    className={`group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-0 ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
                    onClick={handleClick}
                  >
                    <Input
                      ref={fileInputRef}
                      type='file'
                      accept='.pdf,.doc,.docx'
                      className='hidden'
                      onChange={handleFileChange}
                      disabled={isProcessing}
                    />

                    <div className='flex w-full flex-col items-center justify-center gap-0'>
                      <Image
                        src='/upload.svg'
                        alt='CSV'
                        width={87}
                        height={73}
                      />
                      <p className='relative z-20 mt-2  text-sm font-bold leading-4'>
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
                      className={`rounded-lg border border-text-20 p-4 ${isProcessing ? 'opacity-75' : ''}`}
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
                            className={`h-full rounded-full transition-all duration-300 ease-in-out ${
                              isProcessing
                                ? 'bg-blue-400'
                                : 'bg-primary-light-blue'
                            }`}
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className=' text-right text-xs  text-text-80'>
                          {isProcessing
                            ? 'Processing...'
                            : `${uploadProgress}%`}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                )}
              </>
            )}
            {/* {step === 2 && ( */}

            {/* )} */}
          </ScrollArea>
        )}
        {uploadFile && (
          <ShowPreviewTabs
            params={params}
            extractionData={extractionData}
            file={file}
          />
        )}
        {/* <DrawerFooter className='border-t'>
          {step === 1 && (
            <div className='flex justify-end'>
              <Button
                disabled={!file || isUploading}
                onClick={handleSubmit}
                className='hover:bg-primary-blue/90 flex items-center gap-2 bg-primary-blue text-white'
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          )} */}
        {/* {step === 2 && (
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
                            <Button
                                onClick={() => handleSubmit()}
                                loading={isPending}
                                className='w-fit text-sm font-semibold'
                            >
                                Send Now
                            </Button>
                        </div>
                    )} */}
        {/* </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  )
}

export default UploadContract
