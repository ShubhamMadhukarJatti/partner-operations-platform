'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  Coins,
  Download,
  LayoutGrid,
  Upload
} from 'lucide-react'
import CSVReader from 'react-csv-reader'

import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

const steps = [
  { label: 'Connect/upload', icon: Coins },
  { label: 'Mapping', icon: LayoutGrid },
  { label: 'Preview', icon: CalendarDays },
  { label: 'Finish', icon: CalendarCheck }
]

const CrmStepper = ({ current }: { current: number }) => (
  <div className='mx-auto flex w-full max-w-[574px]'>
    {steps.map((step, i) => {
      const isActive = i + 1 === current
      const isFirst = i === 0
      const isLast = i === steps.length - 1
      const Icon = step.icon
      return (
        <div
          key={step.label}
          className='flex flex-1 flex-col items-center gap-2.5'
        >
          <div className='flex w-full items-center gap-3'>
            <div
              className={`h-px flex-1 ${!isFirst ? 'bg-[#D1D5DB]' : 'bg-transparent'}`}
            />
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border ${
                isActive
                  ? 'border-[#2563EB] bg-[#2563EB]'
                  : 'border-[#D1D5DB] bg-white'
              }`}
            >
              <Icon
                className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#21232C]'}`}
              />
            </div>
            <div
              className={`h-px flex-1 ${!isLast ? 'bg-[#D1D5DB]' : 'bg-transparent'}`}
            />
          </div>
          <span className='text-[13.9px] font-medium leading-[21px] text-[#21232C]'>
            {step.label}
          </span>
        </div>
      )
    })}
  </div>
)

const separatorOptions = [
  { label: 'Comma (,)', value: ',' },
  { label: 'Semicolon (;)', value: ';' },
  { label: 'Tab', value: '\t' },
  { label: 'Pipe (|)', value: '|' }
]

const UploadCSVPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const recordType = searchParams.get('recordType') || 'CUSTOMER'
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [csvData, setCsvData] = useState<any[]>([])
  const [showSeparatorDropdown, setShowSeparatorDropdown] = useState(false)
  const [selectedSeparator, setSelectedSeparator] = useState(
    separatorOptions[0]
  )
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

  const handleNext = () => {
    if (file && uploadProgress === 100 && csvData.length > 0) {
      sessionStorage.setItem('csvData', JSON.stringify(csvData))
      sessionStorage.setItem('csvFileName', file.name)
      const params = new URLSearchParams({ source: 'CSV' })
      router.push(`/my-data/field-mapping?${params.toString()}`)
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

  const isNextEnabled = !!file && uploadProgress === 100 && csvData.length > 0

  return (
    <GradientPageBackground className='relative flex min-h-[calc(100vh-56px)] flex-col'>
      {/* Scrollable content */}
      <div className='flex-1 overflow-y-auto px-4 pb-6 pt-12'>
        <div className='mx-auto flex w-full max-w-5xl flex-col'>
          <CrmStepper current={1} />

          {/* Centered header */}
          <div className='mb-7 mt-8 flex flex-col items-center gap-2 text-center'>
            <h1 className='text-[24px] font-semibold leading-[34px] text-[#25224A]'>
              Upload CSV
            </h1>
            <p className='text-sm text-[#4D5C78]'>
              Upload the CSV file that has access set to open.
            </p>
          </div>

          {/* Main content */}
          <div className='mx-auto flex w-full max-w-[720px] flex-col gap-7'>
            {/* Upload zone */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={handleClick}
              className='flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#3E50F7] bg-[#F8FBFF] px-[100px] py-12'
            >
              <CSVReader
                ref={fileInputRef}
                cssClass='hidden'
                onFileLoaded={handleFileLoad}
                parserOptions={parserOptions}
              />
              <Image src='/upload.svg' alt='Upload' width={100} height={100} />
              <p className='text-sm font-bold text-[#3E50F7]'>
                Select a CSV file to upload
              </p>
              <p className='text-xs text-[#4D5C78]'>
                or drag &amp; drop it here
              </p>
            </motion.div>

            {/* Download template */}
            <div className='flex justify-center'>
              <button
                onClick={handleDownloadTemplate}
                className='flex items-center gap-1 text-sm font-medium text-[#3E50F7]'
              >
                <Download className='h-5 w-5' />
                Download template
              </button>
            </div>

            {/* File upload progress */}
            {file && (
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
                      className='h-full rounded-full bg-[#3E50F7] transition-all duration-300 ease-in-out'
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className='text-xs text-gray-500'>{uploadProgress}%</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className='border-t border-[#CDD9F2] bg-white'>
        <div className='flex w-full items-center justify-between px-6 py-4'>
          <Link href='/my-data/connect-crm'>
            <button className='flex h-8 items-center rounded-[4px] bg-white px-4 text-sm font-semibold text-[#21232C] shadow-[0px_1px_2px_rgba(42,54,71,0.05)] outline outline-1 outline-[rgba(33,35,44,0.24)]'>
              Back
            </button>
          </Link>
          <button
            onClick={handleNext}
            disabled={!isNextEnabled}
            className='flex h-8 items-center rounded-[4px] px-4 text-sm font-semibold text-white shadow-[0px_1px_2px_rgba(42,54,71,0.05)] disabled:cursor-not-allowed'
            style={{ backgroundColor: isNextEnabled ? '#2563EB' : '#ABBDE7' }}
          >
            Next
          </button>
        </div>
      </div>
    </GradientPageBackground>
  )
}

export default UploadCSVPage
