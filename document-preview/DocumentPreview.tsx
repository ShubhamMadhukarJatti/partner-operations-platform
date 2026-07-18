'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

import { Label } from '@/components/ui/label'

import { getGoogleDrivePreviewUrl, isValidDocumentUrl } from './document-utils'

interface DocumentPreviewProps {
  documentLink: string
  height?: string
  showLabel?: boolean
  showCloseButton?: boolean
  onClose?: () => void
  className?: string
}

const DocumentPreview = ({
  documentLink,
  height = '400px',
  showLabel = true,
  showCloseButton = false,
  onClose,
  className = ''
}: DocumentPreviewProps) => {
  const [documentPreviewError, setDocumentPreviewError] = useState(false)
  const [documentLoading, setDocumentLoading] = useState(false)

  if (!documentLink) return null

  const previewUrl = getGoogleDrivePreviewUrl(documentLink)
  const isValidUrl = isValidDocumentUrl(documentLink)
  const isGoogleDrive = documentLink.includes('drive.google.com')

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-gray-50 p-4 ${className}`}
    >
      {showLabel && (
        <div className='mb-2 flex items-center justify-between'>
          <Label className='text-sm font-medium text-gray-700'>
            Document Preview
          </Label>
          {showCloseButton && onClose && (
            <button
              onClick={() => {
                onClose()
                setDocumentPreviewError(false)
                setDocumentLoading(false)
              }}
              className='flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600'
              type='button'
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {!isValidUrl && (
        <div className='mb-2 rounded-md bg-yellow-50 p-2 text-xs text-yellow-800'>
          Warning: The URL may not be a valid document link. Please verify the
          link format.
        </div>
      )}

      {isGoogleDrive && (
        <div className='mb-2 rounded-md bg-blue-50 p-2 text-xs text-blue-800'>
          <strong>Important:</strong> For Google Drive files to preview
          correctly, the file must be shared with &quot;Anyone with the
          link&quot; permission. If you see an access denied message, please
          update the file sharing settings in Google Drive.
        </div>
      )}

      <div
        className='relative w-full overflow-hidden rounded-lg border border-gray-300 bg-white'
        style={{ height }}
      >
        {documentPreviewError ? (
          <div className='flex h-full w-full flex-col items-center justify-center bg-gray-100 p-4 text-center'>
            <p className='mb-2 text-sm font-medium text-gray-700'>
              Unable to preview document
            </p>
            <p className='mb-4 text-xs text-gray-500'>
              The document link may be invalid, not accessible, or redirected to
              another page
            </p>
            <a
              href={documentLink}
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-blue-600 hover:underline'
            >
              Open in new tab
            </a>
          </div>
        ) : (
          <>
            {documentLoading && (
              <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/80'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent' />
              </div>
            )}
            <iframe
              key={documentLink}
              src={previewUrl}
              className='h-full w-full'
              title='Document Preview'
              sandbox='allow-same-origin allow-scripts allow-popups allow-forms allow-downloads'
              allow='fullscreen'
              onLoad={() => {
                setDocumentLoading(false)
                setTimeout(() => {
                  // If we can't verify, we'll assume it loaded
                }, 2000)
              }}
              onLoadStart={() => {
                setDocumentLoading(true)
                setDocumentPreviewError(false)
              }}
              onError={() => {
                setDocumentLoading(false)
                setDocumentPreviewError(true)
                console.error('Error loading document:', documentLink)
              }}
            />
          </>
        )}
      </div>

      {/* Show document link for reference */}
      <div className='mt-2'>
        <p className='text-xs text-gray-500'>
          Link:{' '}
          <a
            href={documentLink}
            target='_blank'
            rel='noopener noreferrer'
            className='font-mono text-xs text-blue-600 hover:underline'
          >
            {documentLink}
          </a>
        </p>
      </div>
    </div>
  )
}

export default DocumentPreview
