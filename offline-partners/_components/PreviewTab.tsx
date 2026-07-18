import React, { useEffect, useState } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Users
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { EmailIocn } from '@/components/icons/icons'

import { extractParticipants } from './utils/extractParticipants'

// type Props = {
//   data: any
//   org: any
// }

const PreviewTab: React.FC<{
  extractionData?: any
  file?: File | null
}> = ({ extractionData, file }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file)
      setPdfUrl(url)
      // Reset page to 1 when new file is loaded
      setCurrentPage(1)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // Force iframe reload with new page
    if (pdfUrl) {
      const iframe = document.querySelector(
        'iframe[title="PDF Preview"]'
      ) as HTMLIFrameElement
      if (iframe) {
        iframe.src = `${pdfUrl}#page=${newPage}&toolbar=0&navpanes=0&scrollbar=1&zoom=page-fit`
      }
    }
  }

  // Extract participants using the utility function
  const allSigners = extractParticipants(extractionData)

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className='w-full'>
      {/* PDF Preview Section */}
      <div className='relative h-[60vh] w-full rounded-lg border border-[#C4CDD5] bg-gray-50'>
        {pdfUrl ? (
          <div className='flex h-full flex-col'>
            {/* PDF Viewer Header */}
            <div className='flex items-center justify-between border-b bg-white p-3'>
              <div className='flex items-center gap-2'>
                <FileText className='h-5 w-5 text-gray-600' />
                <span className='text-sm font-medium text-gray-700'>
                  {file?.name || 'Document Preview'}
                </span>
              </div>
            </div>

            {/* PDF Embed */}
            <div className='flex-1 p-4'>
              <div className='relative h-full w-full rounded border bg-gray-50'>
                <iframe
                  src={`${pdfUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=1&zoom=page-fit`}
                  className='h-full w-full rounded'
                  title='PDF Preview'
                  onLoad={() => {
                    console.log('PDF loaded for page:', currentPage)
                  }}
                  onError={() => {
                    console.log('PDF iframe failed to load')
                  }}
                />
                {/* Fallback download link */}
                <div className='absolute bottom-4 right-4'>
                  <a
                    href={pdfUrl || ''}
                    download={file?.name}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:bg-primary-blue/90 rounded bg-primary-blue px-3 py-2 text-xs text-white transition-colors'
                  >
                    Open in New Tab
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex h-full items-center justify-center'>
            <div className='text-center'>
              <FileText className='mx-auto h-12 w-12 text-gray-400' />
              <p className='mt-2 text-sm text-gray-600'>
                {file ? 'Loading document...' : 'No document selected'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Document Info Section */}
      <div className='w-full pt-4'>
        {/* Participants Section */}
        <div className='mb-6'>
          <div className='mb-3 flex items-center gap-2'>
            <Users className='h-5 w-5 text-gray-600' />
            <p className='text-base font-semibold text-[#2C3947]'>
              Participants ({allSigners.length})
            </p>
          </div>

          <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
            {allSigners.map((signer, index) => (
              <div
                key={index}
                className='rounded-xl border border-[#DFE3E8] px-3 py-4'
              >
                <div className='flex justify-between'>
                  <div>
                    <p className='text-sm font-semibold text-[#2C3947]'>
                      {signer.name}
                    </p>
                    <div className='mt-1 flex items-center gap-1'>
                      <EmailIocn />
                      <p className='text-xs text-[#ADB5BD]'>{signer.email}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='flex h-6 w-16 items-center justify-center rounded-full bg-[#00970A]'>
                      <p className='text-xs text-white'>Active</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Dates Section */}
        <div className='mb-6'>
          <div className='mb-3 flex items-center gap-2'>
            <Calendar className='h-5 w-5 text-gray-600' />
            <p className='text-base font-semibold text-[#2C3947]'>Key Dates</p>
          </div>

          <div className='rounded-lg border border-[#DFE3E8] p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col gap-1'>
                <p className='text-sm font-semibold text-[#2C3947]'>
                  Effective Date
                </p>
                <p className='text-xs text-[#ADB5BD]'>
                  {formatDate(extractionData?.data?.effective_date)}
                </p>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='text-sm font-semibold text-[#2C3947]'>Validity</p>
                <p className='text-xs text-[#ADB5BD]'>
                  {extractionData?.data?.validity ?? 'N/A'}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <div className='flex h-6 w-16 items-center justify-center rounded-full bg-[#00970A]'>
                  <p className='text-xs text-white'>Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement Summary */}
        {extractionData?.summary && (
          <div className='mb-6'>
            <p className='mb-3 text-base font-semibold text-[#2C3947]'>
              Agreement Summary
            </p>
            <div className='rounded-lg border border-[#DFE3E8] p-4'>
              <p className='text-sm leading-relaxed text-[#2C3947]'>
                {extractionData.summary}
              </p>
            </div>
          </div>
        )}

        {/* Agreement Type & Platform */}
        {(extractionData?.agreement_type ||
          extractionData?.contract_platform) && (
          <div className='mb-6'>
            <p className='mb-3 text-base font-semibold text-[#2C3947]'>
              Document Details
            </p>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {extractionData?.agreement_type && (
                <div className='rounded-lg border border-[#DFE3E8] p-4'>
                  <p className='text-sm font-semibold text-[#2C3947]'>
                    Agreement Type
                  </p>
                  <p className='mt-1 text-xs text-[#ADB5BD]'>
                    {extractionData.agreement_type}
                  </p>
                </div>
              )}
              {extractionData?.contract_platform && (
                <div className='rounded-lg border border-[#DFE3E8] p-4'>
                  <p className='text-sm font-semibold text-[#2C3947]'>
                    Platform
                  </p>
                  <p className='mt-1 text-xs text-[#ADB5BD]'>
                    {extractionData.contract_platform}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PreviewTab
