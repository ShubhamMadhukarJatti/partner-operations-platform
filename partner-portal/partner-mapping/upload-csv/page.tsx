'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload } from 'lucide-react'
import CSVReader from 'react-csv-reader'

import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'

const PARTNER_MAPPING_BASE = '/partner-portal/partner-mapping'

export default function PartnerPortalUploadCsvPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [csvData, setCsvData] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileLoad = (data: any[], fileInfo: any) => {
    if (!['text/csv'].includes(fileInfo.type)) {
      showCustomToast('Error', 'File type not allowed!', 'error', 5000)
      return
    }
    setFile(fileInfo)
    setCsvData(data)
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        showCustomToast(
          'Success',
          'CSV file uploaded successfully!',
          'success',
          5000
        )
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

  const handleBack = () => {
    router.push(`${PARTNER_MAPPING_BASE}/connect-crm`)
  }

  const handleNext = () => {
    if (file && uploadProgress === 100 && csvData.length > 0) {
      sessionStorage.setItem('csvData', JSON.stringify(csvData))
      sessionStorage.setItem('csvFileName', file.name)
      const params = new URLSearchParams({ source: 'CSV' })
      router.push(`${PARTNER_MAPPING_BASE}/field-mapping?${params.toString()}`)
    }
  }

  const handleDownloadTemplate = () => {
    const csvContent =
      'Name,Email,Website,Company\nJohn Doe,john@example.com,example.com,Example Corp\nJane Smith,jane@example.com,test.com,Test Inc'
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'customer_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className='flex h-[calc(100vh-50px)] flex-col'>
      <div className='flex flex-1 items-center justify-center'>
        <div className='w-9/12 max-w-4xl'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex flex-col gap-1'>
              <h1 className='text-xl font-semibold text-gray-700'>
                Upload CSV
              </h1>
              <p className='text-sm text-gray-500'>
                Upload the CSV file that has access set to open.
              </p>
            </div>
            <div className='text-sm text-gray-500'>Step 2/3</div>
          </div>

          <div className='mb-6'>
            <div className='w-full rounded-lg border-2 border-dashed border-[#3E50F7] bg-gray-50 py-12'>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className='group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-0'
                onClick={handleClick}
              >
                <CSVReader
                  ref={fileInputRef}
                  cssClass='hidden'
                  onFileLoaded={handleFileLoad}
                  parserOptions={parserOptions}
                />
                <div className='flex w-full flex-col items-center justify-center gap-2'>
                  <Image
                    src='/upload.svg'
                    alt='Upload'
                    width={100}
                    height={100}
                  />
                  <p className='text-base font-bold text-[#3E50F7]'>
                    Select a CSV file to upload
                  </p>
                  <p className='text-sm text-gray-500'>
                    or drag & drop it here
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className='mb-6 flex w-full justify-center'>
            <button
              onClick={handleDownloadTemplate}
              className='flex items-center gap-2 text-sm text-[#3E50F7]'
            >
              <Image
                src='/icons/inbox-download.svg'
                alt='Download'
                width={16}
                height={16}
              />
              Download template
            </button>
          </div>

          {file && (
            <div className='mb-6'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='rounded-lg border border-gray-200 bg-white p-4'
              >
                <div className='flex w-full items-center justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#3E50F7]'>
                      <Upload className='h-5 w-5 text-white' />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-gray-900'>
                        {file.name}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      setFile(null)
                      setUploadProgress(0)
                      setCsvData([])
                    }}
                    className='text-red-500 hover:text-red-700'
                  >
                    Remove
                  </Button>
                </div>
                <div className='mt-3 flex items-center justify-between gap-2'>
                  <div className='h-2 flex-1 rounded-full bg-gray-200'>
                    <div
                      className='h-full rounded-full bg-[#3E50F7] transition-colors duration-300'
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className='text-xs text-gray-500'>{uploadProgress}%</p>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <div className='sticky bottom-0 border-t bg-white px-10 py-4'>
        <div className='flex items-center justify-between'>
          <Button
            variant='ghost'
            onClick={handleBack}
            className='flex items-center gap-2 text-[#3E50F7]'
          >
            <ArrowLeft size={20} />
            Back
          </Button>
          <Button
            disabled={!file || uploadProgress < 100 || csvData.length === 0}
            onClick={handleNext}
            className={
              file && uploadProgress === 100 && csvData.length > 0
                ? 'bg-[#3E50F7] text-white hover:bg-[#2d3bb3]'
                : 'bg-gray-300 text-gray-500 hover:bg-gray-300'
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
