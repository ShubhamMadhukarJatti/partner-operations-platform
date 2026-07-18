'use client'

import React, { useEffect, useRef, useState } from 'react'
import { getCookie } from 'cookies-next'
import { Download, Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { showCustomToast } from '@/components/custom-toast'
import { DocumentPreview } from '@/components/document-preview'

export interface ContentStageData {
  chapterTitle: string
  contentType: string
  driveLink: string
  documentLink: string
  content: string
  thumbnailUrl: string
}

interface StageContentEditorProps {
  initialData?: ContentStageData
  onSave: (data: ContentStageData) => void | Promise<void>
  isSaving?: boolean
  contentCreated?: boolean
}

const StageContentEditor = ({
  initialData,
  onSave,
  isSaving = false,
  contentCreated = false
}: StageContentEditorProps) => {
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const [data, setData] = useState<ContentStageData>({
    chapterTitle: initialData?.chapterTitle || '',
    contentType: initialData?.contentType || 'VIDEO',
    driveLink: initialData?.driveLink || '',
    documentLink: initialData?.documentLink || '',
    content: initialData?.content || '',
    thumbnailUrl: initialData?.thumbnailUrl || ''
  })
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [fetchingDriveLink, setFetchingDriveLink] = useState(false)
  // Track original Google Drive URL separately from GCP URL
  const [originalDriveUrl, setOriginalDriveUrl] = useState<string>('')
  const [driveLinkFetched, setDriveLinkFetched] = useState(false)

  // Initialize: if driveLink is a GCP URL, it means it was already fetched
  useEffect(() => {
    if (initialData?.driveLink) {
      if (initialData.driveLink.includes('storage.googleapis.com')) {
        // This is a GCP URL, so it was already fetched
        // We don't have the original URL, so leave it empty
        setDriveLinkFetched(true)
      } else {
        // This is the original Google Drive URL
        setOriginalDriveUrl(initialData.driveLink)
        setDriveLinkFetched(false)
      }
    }
  }, [initialData?.driveLink])

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = getCookie('accessToken')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  // Validate if URL is a Google Drive link
  const isValidGoogleDriveUrl = (url: string): boolean => {
    if (!url || !url.trim()) return false
    try {
      const urlObj = new URL(url)
      return (
        urlObj.hostname === 'drive.google.com' ||
        urlObj.hostname.includes('drive.google.com')
      )
    } catch {
      return false
    }
  }

  // Validate if URL is a valid video URL (Google Drive or GCP)
  const isValidVideoUrl = (url: string): boolean => {
    if (!url || !url.trim()) return false
    try {
      const urlObj = new URL(url)
      // Accept Google Drive URLs or GCP storage URLs
      return (
        urlObj.hostname === 'drive.google.com' ||
        urlObj.hostname.includes('drive.google.com') ||
        urlObj.hostname.includes('storage.googleapis.com')
      )
    } catch {
      return false
    }
  }

  const handleThumbnailClick = () => {
    thumbnailInputRef.current?.click()
  }

  const handleClearDriveLink = () => {
    setData({ ...data, driveLink: '' })
    setOriginalDriveUrl('')
    setDriveLinkFetched(false)
  }

  const handleFetchDriveLink = async () => {
    const driveLink = data.driveLink.trim()

    if (!driveLink) {
      showCustomToast(
        'Error',
        'Please enter a Google Drive link first',
        'error',
        5000
      )
      return
    }

    if (!isValidGoogleDriveUrl(driveLink)) {
      showCustomToast(
        'Error',
        'Please enter a valid Google Drive link',
        'error',
        5000
      )
      return
    }

    setFetchingDriveLink(true)

    try {
      // Create AbortController with 60 second timeout for drive link processing
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 seconds

      const response = await fetch('/api/partner/training/drive', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          driveLink: driveLink
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const result = await response.json()

      if (result.success && result.data?.gcpUrl) {
        // Store the GCP URL for saving, but keep original URL for display
        setData({ ...data, driveLink: result.data.gcpUrl })
        setOriginalDriveUrl(driveLink) // Keep the original Google Drive URL
        setDriveLinkFetched(true) // Mark as fetched
        showCustomToast(
          'Success',
          result.message || 'File uploaded successfully',
          'success',
          5000
        )
      } else {
        showCustomToast(
          'Error',
          result.message || 'Failed to fetch drive link',
          'error',
          5000
        )
      }
    } catch (error) {
      console.error('Error fetching drive link:', error)

      let errorMessage = 'Failed to fetch drive link'
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage =
            'Request timeout. The operation is taking longer than expected. Please try again.'
        } else {
          errorMessage = error.message
        }
      }

      showCustomToast('Error', errorMessage, 'error', 5000)
    } finally {
      setFetchingDriveLink(false)
    }
  }

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      showCustomToast(
        'Error',
        'Image size must be less than 5MB. Please choose a smaller image.',
        'error',
        5000
      )
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = ''
      }
      return
    }
    setUploadingThumbnail(true)

    try {
      // Create FormData for upload
      const formData = new FormData()
      formData.append('file', file)

      // Upload to API
      const response = await fetch('/api/partner/training/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Upload failed')
      }

      const result = await response.json()

      // Handle different possible response structures
      const fileUrl =
        result.data?.fileUrl ||
        result.data?.url ||
        result.fileUrl ||
        result.url ||
        result.data

      if (result.success && fileUrl && typeof fileUrl === 'string') {
        setData((prev) => ({
          ...prev,
          thumbnailUrl: fileUrl
        }))
      } else {
        console.error('Invalid upload response:', result)
        throw new Error(
          result.message ||
            'Invalid response from server. Expected fileUrl in response.'
        )
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      showCustomToast(
        'Error',
        error instanceof Error ? error.message : 'Failed to upload thumbnail',
        'error',
        5000
      )
    } finally {
      setUploadingThumbnail(false)
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = ''
      }
    }
  }

  // Validation function to check if all required fields are filled
  const isFormValid = () => {
    // Check basic required fields
    if (!data.chapterTitle.trim() || !data.contentType) {
      return false
    }

    // Check content type specific requirements
    if (data.contentType === 'VIDEO') {
      // For VIDEO: driveLink and thumbnailUrl are required
      if (!data.driveLink.trim()) {
        return false
      }
      // Validate video URL (Google Drive or GCP)
      if (!isValidVideoUrl(data.driveLink)) {
        return false
      }
      // Thumbnail is required for VIDEO
      if (!data.thumbnailUrl.trim()) {
        return false
      }
    } else if (data.contentType === 'DOCUMENT') {
      // For DOCUMENT: documentLink is required
      if (!data.documentLink.trim()) {
        return false
      }
    }

    // Content is required
    if (!data.content.trim()) {
      return false
    }

    // All validations passed
    return true
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Header Buttons */}
      {!contentCreated && (
        <div className='mb-4 flex justify-end gap-3'>
          <Button
            variant='outline'
            onClick={() =>
              setData({
                chapterTitle: '',
                contentType: 'VIDEO',
                driveLink: '',
                documentLink: '',
                content: '',
                thumbnailUrl: ''
              })
            }
          >
            Clear
          </Button>
          <Button
            className='bg-[#3E50F7] text-white hover:bg-blue-700'
            onClick={async () => {
              if (!isFormValid()) {
                showCustomToast(
                  'Error',
                  'Please fill in all required fields correctly',
                  'error',
                  5000
                )
                return
              }
              await onSave(data)
            }}
            disabled={isSaving || !isFormValid()}
          >
            {isSaving ? 'Saving...' : 'Save Module'}
          </Button>
        </div>
      )}

      {/* Chapter Title */}
      <div className='space-y-2'>
        <Label className='flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-white'>
          What is this video about? <span className='text-red-500'>*</span>
          <span className='cursor-help text-gray-400 dark:text-white'>?</span>
        </Label>
        <Input
          value={data.chapterTitle}
          onChange={(e) => setData({ ...data, chapterTitle: e.target.value })}
          placeholder='Your training videos goes here'
          className='bg-gray-50 dark:bg-white/5'
          disabled={contentCreated}
        />
      </div>

      {/* Content Type */}
      <div className='space-y-2'>
        <Label className='flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-white'>
          Content Type <span className='text-red-500'>*</span>
          <span className='cursor-help text-gray-400 dark:text-white'>?</span>
        </Label>
        <Select
          value={data.contentType}
          onValueChange={(value) => setData({ ...data, contentType: value })}
          disabled={contentCreated}
        >
          <SelectTrigger
            className='bg-gray-50 dark:bg-white/5'
            disabled={contentCreated}
          >
            <SelectValue placeholder='Select content type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='VIDEO'>video (.mp4)</SelectItem>
            <SelectItem value='DOCUMENT'>document</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Drive Link - Only show for VIDEO */}
      {data.contentType === 'VIDEO' && (
        <div className='space-y-2'>
          <Label className='flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-white'>
            Paste the Google drive or cloud link to this video{' '}
            <span className='text-red-500'>*</span>
            <span className='cursor-help text-gray-400 dark:text-white'>?</span>
          </Label>
          <div className='flex items-center gap-2'>
            <Input
              value={driveLinkFetched ? originalDriveUrl : data.driveLink}
              onChange={(e) => {
                if (!driveLinkFetched) {
                  const value = e.target.value
                  setData({ ...data, driveLink: value })
                }
              }}
              onBlur={(e) => {
                if (!driveLinkFetched) {
                  const value = e.target.value
                  // Only validate Google Drive URLs on blur (not GCP URLs which are set after fetch)
                  if (
                    value.trim() &&
                    !isValidGoogleDriveUrl(value) &&
                    !value.includes('storage.googleapis.com')
                  ) {
                    showCustomToast(
                      'Error',
                      'Please enter a valid Google Drive link',
                      'error',
                      5000
                    )
                  }
                }
              }}
              placeholder='https://drive.google.com/file/d/...'
              className='bg-gray-50 dark:bg-white/5'
              type='url'
              disabled={contentCreated || driveLinkFetched}
            />
            {driveLinkFetched ? (
              <Button
                type='button'
                onClick={handleClearDriveLink}
                disabled={contentCreated}
                className='shrink-0'
                variant='outline'
              >
                <X className='h-4 w-4' />
              </Button>
            ) : (
              <Button
                type='button'
                onClick={handleFetchDriveLink}
                disabled={
                  contentCreated || fetchingDriveLink || !data.driveLink.trim()
                }
                className='shrink-0'
                variant='outline'
              >
                {fetchingDriveLink ? (
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent' />
                ) : (
                  <Download className='h-4 w-4' />
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Thumbnail Upload - Only show for VIDEO */}
      {data.contentType === 'VIDEO' && (
        <div className='space-y-2'>
          <Label className='flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-white'>
            Add Thumbnail <span className='text-red-500'>*</span>
            <span className='cursor-help text-gray-400 dark:text-white'>?</span>
          </Label>
          <p className='text-xs text-gray-500 dark:text-white'>
            Maximum file size: 5MB
          </p>
          <div className='flex items-center gap-4'>
            {data.thumbnailUrl ? (
              <div className='group relative h-32 w-48 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-border dark:bg-white/10'>
                <img
                  src={data.thumbnailUrl}
                  alt='Thumbnail'
                  className='h-full w-full object-cover'
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                <button
                  onClick={() => {
                    setData({ ...data, thumbnailUrl: '' })
                  }}
                  className='absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100'
                  type='button'
                  disabled={contentCreated}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type='button'
                onClick={handleThumbnailClick}
                disabled={uploadingThumbnail || contentCreated}
                className='flex h-32 w-48 cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-border dark:bg-white/10 dark:bg-white/5'
              >
                {uploadingThumbnail ? (
                  <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent' />
                ) : (
                  <Plus className='text-gray-400 dark:text-white' size={24} />
                )}
              </button>
            )}
          </div>
          <Input
            type='file'
            ref={thumbnailInputRef}
            className='hidden'
            accept='image/*'
            onChange={handleThumbnailChange}
            disabled={contentCreated}
          />
        </div>
      )}

      {/* Document Link - Only show for DOCUMENT */}
      {data.contentType === 'DOCUMENT' && (
        <div className='space-y-2'>
          <Label className='flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-white'>
            Add document link <span className='text-red-500'>*</span>
            <span className='cursor-help text-gray-400 dark:text-white'>?</span>
          </Label>
          <Input
            value={data.documentLink}
            onChange={(e) => {
              setData({ ...data, documentLink: e.target.value })
            }}
            placeholder='https://cdn.example.com/file.pdf'
            className='bg-gray-50 dark:bg-white/5'
            type='url'
            disabled={contentCreated}
          />
          {/* Document Preview */}
          {data.documentLink && (
            <div className='mt-4'>
              <DocumentPreview
                documentLink={data.documentLink}
                height='400px'
                showLabel={true}
                showCloseButton={!contentCreated}
                onClose={() => {
                  setData({ ...data, documentLink: '' })
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className='space-y-2'>
        <Label className='flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-white'>
          What will partners learn from this video?{' '}
          <span className='text-red-500'>*</span>
          <span className='cursor-help text-gray-400 dark:text-white'>?</span>
        </Label>
        <Textarea
          value={data.content}
          onChange={(e) => setData({ ...data, content: e.target.value })}
          placeholder='Describe the content of this resource in way your partner can grasp'
          className='min-h-[200px] resize-none bg-gray-50 dark:bg-white/5'
          disabled={contentCreated}
        />
      </div>
    </div>
  )
}

export default StageContentEditor
