'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  Clock,
  FileTextIcon,
  Image as ImageIcon,
  Layers,
  Plus,
  Tag as TagIcon,
  TypeIcon
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export interface CourseData {
  title: string
  description: string
  coverImage: string | null
  duration: string
  level: string
  labels: string[]
  learningPath?: { id: string; title: string; type: string; order: number }[]
  selectedStages?: Record<string, string[]>
  assignmentRules?: {
    tiers: string[]
    geographies: string[]
    programTypes: string[]
  }
}

interface CourseDetailsStepProps {
  data: CourseData
  updateData: (updates: Partial<CourseData>) => void
  onLabelsChange?: (labels: Label[]) => void
}

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export interface Label {
  id: number
  name: string
}

const CourseDetailsStep = ({
  data,
  updateData,
  onLabelsChange
}: CourseDetailsStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDurationEditing, setIsDurationEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [labels, setLabels] = useState<Label[]>([])
  const [isLoadingLabels, setIsLoadingLabels] = useState(false)
  const [isAddLabelDialogOpen, setIsAddLabelDialogOpen] = useState(false)
  const [newLabelName, setNewLabelName] = useState('')
  const [isCreatingLabel, setIsCreatingLabel] = useState(false)
  const [labelError, setLabelError] = useState<string | null>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      setUploadError(
        'Image size must be less than 5MB. Please choose a smaller image.'
      )
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file)
    updateData({ coverImage: previewUrl })
    setUploadError(null)
    setIsUploading(true)

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

      // Save the fileUrl from the response
      if (result.success && result.data?.fileUrl) {
        // Revoke the preview URL to free memory
        URL.revokeObjectURL(previewUrl)
        // Update with the actual fileUrl from the API
        updateData({ coverImage: result.data.fileUrl })
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload image'
      )
      // Keep the preview but show error
    } finally {
      setIsUploading(false)
    }
  }

  // Fetch labels on component mount
  useEffect(() => {
    fetchLabels()
  }, [])

  const fetchLabels = async () => {
    setIsLoadingLabels(true)
    try {
      const response = await fetch('/api/partner/training/labels')
      if (!response.ok) {
        throw new Error('Failed to fetch labels')
      }
      const result = await response.json()
      if (result.success && result.data) {
        setLabels(result.data)
        if (onLabelsChange) {
          onLabelsChange(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching labels:', error)
    } finally {
      setIsLoadingLabels(false)
    }
  }

  const handleAddLabel = async () => {
    if (!newLabelName.trim()) {
      setLabelError('Label name is required')
      return
    }

    setIsCreatingLabel(true)
    setLabelError(null)

    try {
      const response = await fetch('/api/partner/training/labels/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newLabelName.trim() })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to create label')
      }

      const result = await response.json()
      if (result.success && result.data) {
        // Add the new label to the list
        const updatedLabels = [...labels, result.data]
        setLabels(updatedLabels)
        if (onLabelsChange) {
          onLabelsChange(updatedLabels)
        }
        // Automatically select the new label
        const currentLabels = data.labels || []
        updateData({ labels: [...currentLabels, result.data.name] })
        // Reset and close dialog
        setNewLabelName('')
        setIsAddLabelDialogOpen(false)
      }
    } catch (error) {
      console.error('Error creating label:', error)
      setLabelError(
        error instanceof Error ? error.message : 'Failed to create label'
      )
    } finally {
      setIsCreatingLabel(false)
    }
  }

  const toggleLabel = (labelName: string) => {
    const currentLabels = data.labels || []
    if (currentLabels.includes(labelName)) {
      updateData({ labels: currentLabels.filter((l) => l !== labelName) })
    } else {
      updateData({ labels: [...currentLabels, labelName] })
    }
  }

  const handleAddLabelClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAddLabelDialogOpen(true)
  }

  return (
    <div className='mx-auto w-full max-w-[800px] pb-20'>
      {/* Cover Image Section */}
      <div
        className='group relative h-[300px] w-full cursor-pointer overflow-hidden rounded-xl bg-gray-100 transition-all hover:bg-gray-200 dark:bg-white/10 dark:bg-white/20'
        onClick={handleImageClick}
      >
        {data.coverImage ? (
          <img
            src={data.coverImage}
            alt='Cover'
            className='h-full w-full object-cover'
          />
        ) : (
          // Placeholder gradient if no image
          <div className='h-full w-full bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200' />
        )}

        {/* Update Cover Button */}
        <div className='absolute bottom-4 right-4'>
          <Button
            variant='secondary'
            size='sm'
            className='flex items-center gap-2 bg-white text-gray-700 hover:bg-white dark:bg-card dark:bg-card/90 dark:text-white'
            onClick={(e) => {
              e.stopPropagation()
              handleImageClick()
            }}
            disabled={isUploading}
          >
            <ImageIcon size={16} />
            {isUploading ? 'Uploading...' : 'Update Cover'}
          </Button>
        </div>

        {/* Upload Error Message */}
        {uploadError && (
          <div className='absolute left-4 right-4 top-4 rounded-md bg-red-50 p-2 text-sm text-red-600'>
            {uploadError}
          </div>
        )}

        {/* Upload Loading Overlay */}
        {isUploading && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
            <div className='rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:bg-card dark:text-white'>
              Uploading...
            </div>
          </div>
        )}

        <Input
          type='file'
          ref={fileInputRef}
          className='hidden'
          accept='image/*'
          onChange={handleFileChange}
        />

        {/* File Size Limit Info */}
        {/* <div className='absolute left-4 top-4 rounded-md bg-blue-50 px-3 py-1.5 text-xs text-blue-700'>
        </div> */}

        <div className='absolute left-4 top-4 flex items-center gap-2'>
          <span className='rounded-md bg-white px-3 py-1 text-xs text-blue-700 dark:bg-card/90'>
            Max file size: 5MB
            {/* <span className='text-red-500 ml-1'>*</span> */}
          </span>

          <span className='rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600'>
            Required
          </span>

          {/* <div className='mb-3 flex items-center gap-3 text-gray-500 dark:text-white'>
            <ImageIcon size={20} />

            <span className='font-medium'>
              Max file size: 5MB
              Cover Image
              <span className='ml-1 text-red-500'>*</span>
            </span>
          </div> */}
        </div>
      </div>

      {/* Content Section */}
      <div className='mt-8 space-y-8 px-2'>
        {/* Title */}
        <div className='space-y-2'>
          <Label className='flex w-40 items-center gap-3 font-medium text-gray-500 dark:text-white'>
            <TypeIcon size={20} />
            <span>
              Title
              <span className='ml-1 text-red-500'>*</span>
            </span>
          </Label>

          <Input
            type='text'
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            placeholder='Title of the learning path...'
            className='w-full border-none bg-transparent px-0 text-4xl font-bold text-slate-700 placeholder:text-gray-300 focus:outline-none focus:ring-0'
          />
        </div>

        {/* Setup Properties */}
        <div className='space-y-4'>
          {/* Duration */}
          <div className='flex items-center gap-12'>
            <Label className='flex w-40 items-center gap-3 font-medium text-gray-500 dark:text-white'>
              <Clock size={20} />
              <span>
                Duration Estimation
                <span className='ml-1 text-red-500'>*</span>
              </span>
            </Label>

            <div className='flex-1'>
              {isDurationEditing ? (
                <Input
                  autoFocus
                  type='text'
                  value={data.duration}
                  onChange={(e) => updateData({ duration: e.target.value })}
                  onBlur={() => setIsDurationEditing(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsDurationEditing(false)
                  }}
                  placeholder='e.g. 2 hours'
                  className='h-8 w-full rounded-md px-2 py-1 text-sm text-gray-700 dark:text-white'
                />
              ) : (
                <div
                  onClick={() => setIsDurationEditing(true)}
                  className={cn(
                    'cursor-pointer rounded px-2 py-1 text-sm hover:bg-gray-50 dark:bg-white/5',
                    !data.duration
                      ? 'text-gray-400 dark:text-white'
                      : 'text-gray-700 dark:text-white'
                  )}
                >
                  {data.duration ||
                    'How long will it take to build this training? (in hours)'}
                </div>
              )}
            </div>
          </div>

          {/* Level */}
          <div className='flex items-center gap-12'>
            <Label className='flex w-40 items-center gap-3 font-medium text-gray-500 dark:text-white'>
              <Layers size={20} />
              <span className='gap-1'>
                Level
                <span className='ml-1 text-red-500'>*</span>
              </span>
            </Label>
            <div className='flex-1'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={cn(
                      'inline-block min-w-[100px] cursor-pointer rounded px-2 py-1 text-sm hover:bg-gray-50 dark:bg-white/5',
                      !data.level
                        ? 'text-gray-400 dark:text-white'
                        : 'text-gray-700 dark:text-white'
                    )}
                  >
                    {data.level || 'Empty'}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                  {LEVELS.map((level) => (
                    <DropdownMenuItem
                      key={level}
                      onClick={() => updateData({ level })}
                    >
                      {level}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Labels */}
          <div className='flex items-center gap-12'>
            <div className='flex w-40 items-center gap-3 text-gray-500 dark:text-white'>
              <TagIcon size={20} />
              <span className='font-medium'>Labels</span>
            </div>
            <div className='flex-1'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={cn(
                      'inline-block min-w-[100px] cursor-pointer rounded px-2 py-1 text-sm hover:bg-gray-50 dark:bg-white/5',
                      !data.labels || data.labels.length === 0
                        ? 'text-gray-400 dark:text-white'
                        : 'text-gray-700 dark:text-white'
                    )}
                  >
                    {!data.labels || data.labels.length === 0 ? (
                      'Keywords partner will search for'
                    ) : (
                      <div className='flex flex-wrap gap-2'>
                        {data.labels.map((l) => (
                          <span
                            key={l}
                            className='rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700'
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start' className='w-56'>
                  {isLoadingLabels ? (
                    <DropdownMenuItem disabled>
                      Loading labels...
                    </DropdownMenuItem>
                  ) : labels.length === 0 ? (
                    <DropdownMenuItem
                      onClick={handleAddLabelClick}
                      className='flex items-center gap-2 text-blue-600'
                    >
                      <Plus size={16} />
                      Add label
                    </DropdownMenuItem>
                  ) : (
                    <>
                      {labels.map((label) => {
                        const isSelected = data.labels?.includes(label.name)
                        return (
                          <DropdownMenuItem
                            key={label.id}
                            onClick={(e) => {
                              e.preventDefault()
                              toggleLabel(label.name)
                            }}
                            className='flex items-center justify-between'
                          >
                            {label.name}
                            {isSelected && (
                              <span className='text-blue-600'>✓</span>
                            )}
                          </DropdownMenuItem>
                        )
                      })}
                      <div className='my-1 border-t border-gray-200 dark:border-border' />
                      <DropdownMenuItem
                        onClick={handleAddLabelClick}
                        className='flex items-center gap-2 text-blue-600'
                      >
                        <Plus size={16} />
                        Add label
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className='mt-8 space-y-2 pt-6'>
          <Label className='flex w-40 items-center gap-3 font-medium text-gray-500 dark:text-white'>
            <FileTextIcon size={20} />
            <span className='gap-1'>
              Description
              <span className='ml-1 text-red-500'>*</span>
            </span>
          </Label>

          <textarea
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            placeholder='What will partners learn and be able to do after this?'
            className='min-h-[200px] w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-600 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-border dark:bg-white/5 dark:text-white dark:text-white'
          />
        </div>
      </div>

      {/* Add Label Dialog */}
      <Dialog
        open={isAddLabelDialogOpen}
        onOpenChange={setIsAddLabelDialogOpen}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                className='h-6 w-6 p-0'
                onClick={() => setIsAddLabelDialogOpen(false)}
              >
                <ChevronLeft size={16} />
              </Button>
              <DialogTitle>Add label</DialogTitle>
            </div>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Input
                placeholder='XYZ'
                value={newLabelName}
                onChange={(e) => {
                  setNewLabelName(e.target.value)
                  setLabelError(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isCreatingLabel) {
                    handleAddLabel()
                  }
                }}
                className={labelError ? 'border-red-500' : ''}
                autoFocus
              />
              {labelError && (
                <p className='text-sm text-red-600'>{labelError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsAddLabelDialogOpen(false)
                setNewLabelName('')
                setLabelError(null)
              }}
              disabled={isCreatingLabel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddLabel}
              disabled={isCreatingLabel || !newLabelName.trim()}
            >
              {isCreatingLabel ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CourseDetailsStep
