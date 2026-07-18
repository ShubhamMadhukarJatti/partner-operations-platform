'use client'

import React, { useRef, useState } from 'react'
import { FileText, Info, Search, Upload, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface RequestLicensesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dealId?: string
}

export default function RequestLicensesModal({
  open,
  onOpenChange,
  dealId
}: RequestLicensesModalProps) {
  const [numberOfLicenses, setNumberOfLicenses] = useState('')
  const [tier, setTier] = useState('Standard')
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    // Validate file size (30MB)
    const maxSize = 30 * 1024 * 1024 // 30MB in bytes
    if (selectedFile.size > maxSize) {
      alert('File size exceeds 30MB. Please upload a smaller file.')
      return
    }

    setFile(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const maxSize = 30 * 1024 * 1024
      if (droppedFile.size > maxSize) {
        alert('File size exceeds 30MB. Please upload a smaller file.')
        return
      }
      setFile(droppedFile)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleConfirm = () => {
    // TODO: Implement API call to request licenses
    console.log('Requesting licenses:', {
      numberOfLicenses,
      tier,
      file,
      dealId
    })
    // Close modal and reset form
    onOpenChange(false)
    setNumberOfLicenses('')
    setTier('Standard')
    setFile(null)
  }

  const handleCancel = () => {
    onOpenChange(false)
    setNumberOfLicenses('')
    setTier('Standard')
    setFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='max-w-[90%] gap-6 rounded-2xl p-6 md:max-w-[600px]'
        hideCloseBtn
      >
        <DialogHeader className='relative'>
          <DialogTitle className='text-xl font-bold text-[#1A202C]'>
            Request For Licenses
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant='ghost'
              className='absolute right-0 top-0 h-8 w-8 p-0 hover:bg-transparent'
              onClick={handleCancel}
            >
              <X size={20} className='text-gray-500' />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Number of Licenses */}
          <div className='space-y-2'>
            <Label
              htmlFor='licenses'
              className='text-sm font-medium text-[#1A202C]'
            >
              Number of Licenses <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='licenses'
              type='number'
              placeholder='Eg: 123'
              value={numberOfLicenses}
              onChange={(e) => setNumberOfLicenses(e.target.value)}
              className='h-11'
            />
            <div className='flex items-center gap-2 text-xs text-[#6B7280]'>
              <Info size={14} className='text-[#6B7280]' />
              <span>You belong to the gold Tier</span>
            </div>
          </div>

          {/* Tier */}
          <div className='space-y-2'>
            <Label
              htmlFor='tier'
              className='text-sm font-medium text-[#1A202C]'
            >
              Tier
            </Label>
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger id='tier' className='h-11'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Standard'>Standard</SelectItem>
                <SelectItem value='Gold'>Gold</SelectItem>
                <SelectItem value='Platinum'>Platinum</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant='link'
              className='h-auto p-0 text-xs text-primary-blue hover:underline'
              onClick={() => {
                // TODO: Open pricing tier modal/page
                console.log('View pricing tier')
              }}
            >
              View pricing tier
            </Button>
          </div>

          {/* Upload Invoice */}
          <div className='space-y-2'>
            <Label className='text-sm font-medium text-[#1A202C]'>
              Upload Invoice
            </Label>
            {!file ? (
              <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors ${
                  isDragging
                    ? 'border-primary-blue bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <Input
                  ref={fileInputRef}
                  type='file'
                  accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
                  className='hidden'
                  onChange={handleFileChange}
                />
                <Upload size={48} className='text-gray-400' />
                <div className='text-center'>
                  <p className='text-sm font-medium text-[#1A202C]'>
                    Click to upload or drag and drop
                  </p>
                  <p className='mt-1 text-xs text-[#6B7280]'>
                    Max. File Size: 30MB
                  </p>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='mt-2'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClick()
                  }}
                >
                  <Search size={16} className='mr-2' />
                  Browse file
                </Button>
              </div>
            ) : (
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded bg-blue-100'>
                      <FileText size={20} className='text-blue-600' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-[#1A202C]'>
                        {file.name}
                      </p>
                      <p className='text-xs text-[#6B7280]'>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 hover:bg-red-50'
                    onClick={handleRemoveFile}
                  >
                    <X size={16} className='text-red-600' />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className='flex gap-3 sm:gap-3'>
          <Button variant='outline' onClick={handleCancel} className='flex-1'>
            Cancel
          </Button>
          <Button
            variant={!numberOfLicenses ? 'disable' : 'primary'}
            onClick={handleConfirm}
            disabled={!numberOfLicenses}
            className={cn(
              'flex-1',
              !numberOfLicenses &&
                'disabled:pointer-events-auto disabled:cursor-not-allowed'
            )}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
