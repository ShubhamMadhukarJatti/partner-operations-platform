'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useImportPartners } from '@/http-hooks/offline-partners'
import { RootState } from '@/redux/store'
import { AlertCircle, X } from 'lucide-react'
import Papa from 'papaparse'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'

import MapProperties from '../../customer-persona/_components/map-properties'

const GENERIC_ERROR_PREFIX = 'An error occurred in the Server Components render'
const FALLBACK_ERROR_MESSAGE = 'Failed to import partners. Please try again.'

function getDisplayErrorMessage(message: string | null | undefined): string {
  if (!message) return FALLBACK_ERROR_MESSAGE
  if (message.startsWith(GENERIC_ERROR_PREFIX)) return FALLBACK_ERROR_MESSAGE
  return message
}

type Props = {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const InvitePartnerDrawer = ({ isOpen, onOpenChange }: Props) => {
  const { organizationData } = useSelector(
    (state: RootState) => state.organization
  )
  const [open, setOpen] = useState(isOpen || false)
  const [file, setFile] = useState<File | any>(null)
  const [columns, setColumns] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedMapping, setSelectedMapping] = useState<
    Record<string, string>
  >({
    'Partner name': '',
    'Partner Email': '',
    'Partner Company name': ''
  })
  const [importError, setImportError] = useState<string | null>(null)

  const { mutate: importPartners, isPending } = useImportPartners({
    onSuccess: () => {
      setImportError(null)
      handleOpenChange(false)
    },
    onError: (err: { message?: string }) => {
      setImportError(getDisplayErrorMessage(err?.message))
    }
  })

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) setImportError(null)
    onOpenChange?.(newOpen)
  }

  const handleFileUpload = (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file')
      return
    }

    setFile(file)

    // Parse CSV to extract columns
    Papa.parse(file, {
      complete: (results: any) => {
        if (results.data && results.data.length > 0) {
          // Get column headers from first row
          const headers = results.data[0] as string[]
          setColumns(headers)
        }
      },
      header: false,
      skipEmptyLines: true
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    handleFileUpload(droppedFile)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileUpload(selectedFile)
    }
  }

  const handleInvitePartners = () => {
    setImportError(null)
    // Parse CSV data to get rows (skipping header row)
    Papa.parse(file, {
      complete: (results: any) => {
        const rows = results.data.slice(1) // Skip header row

        // Get column indices from selectedMapping
        const partnerNameColumn = columns.indexOf(
          selectedMapping['Partner name']
        )
        const emailColumn = columns.indexOf(selectedMapping['Partner Email'])
        const partnerCompanyNameColumn = columns.indexOf(
          selectedMapping['Partner Company name']
        )

        // Map the data using correct column indices
        const partnerInviteDetails = rows.map((row: any) => ({
          partnerName: row[partnerNameColumn],
          email: row[emailColumn],
          company: row[partnerCompanyNameColumn]
        }))

        // Call importPartners with mapped data
        importPartners({
          partnerInviteDetails,
          organizationId: organizationData?.id
        })
      },
      header: false,
      skipEmptyLines: true
    })
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className='flex h-[100vh] flex-col p-0'>
        {/* Header */}
        <div className='flex items-center justify-between border-b px-6 py-5'>
          <h3 className='text-xl font-semibold leading-7 text-text-100'>
            Invite partners
          </h3>
          <DrawerTrigger>
            <Button
              variant='ghost'
              className='p-0 font-light hover:bg-transparent'
            >
              <X className='size-4' />
            </Button>
          </DrawerTrigger>
        </div>
        {file && (
          <div className='flex flex-col gap-1 border-b bg-warning-50 p-4 px-6'>
            <h4 className='text-sm font-bold text-text-100'>
              Review column properties
            </h4>
            <h6 className='text-xs font-normal text-text-80'>
              Ensure columns from your file are mapped correctly to contact
              properties.
            </h6>
          </div>
        )}

        <div className='flex flex-1 flex-col gap-4'>
          {file ? (
            <div className='p-5'>
              <MapProperties
                headers={columns}
                allHeaders={columns}
                selectedMapping={selectedMapping}
                setSelectedMapping={setSelectedMapping}
                isSearchEnabledDropdown={true}
              />
            </div>
          ) : (
            <div className='flex flex-col gap-6 p-6'>
              <Input
                type='file'
                ref={fileInputRef}
                className='hidden'
                accept='.csv'
                onChange={handleFileInputChange}
              />

              <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary-light-blue transition-colors ${
                  isDragging ? 'bg-[#E5EFFE]' : 'bg-[#F8FAFF]'
                }`}
              >
                <Image
                  src='/upload-icon.svg'
                  alt='Upload'
                  width={75}
                  height={75}
                />
                <div className='text-center'>
                  <p className='text-sm font-bold text-primary-blue'>
                    Select a CSV file to upload
                  </p>
                  <p className='text-xs text-text-60'>or drag & drop it here</p>
                </div>
              </div>

              {/* Steps */}
              <div className='flex flex-col rounded-lg border border-text-40 text-xs'>
                <div className='flex items-center gap-2 border-b border-text-40 p-4 text-text-60'>
                  <span className='flex items-center justify-center rounded-full text-xs text-text-60'>
                    1
                  </span>
                  <span>Upload .csv file that contains partner details</span>
                </div>
                <div className='flex items-center gap-2 border-b border-text-40 p-4 text-text-60'>
                  <span className='flex items-center justify-center rounded-full text-xs text-text-60'>
                    2
                  </span>
                  <span>Review matched columns</span>
                </div>
                <div className='flex items-center gap-2 p-4 text-text-60 '>
                  <span className='flex items-center justify-center rounded-full text-xs text-text-60'>
                    3
                  </span>
                  <span>Send invites to all partners in one go</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {importError && (
          <div className='mx-6 mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800'>
            <AlertCircle className='size-5 shrink-0 text-red-600' />
            <span>{getDisplayErrorMessage(importError)}</span>
          </div>
        )}
        <DrawerFooter className='mt-6'>
          <Button
            disabled={
              Object.values(selectedMapping).some((value) => value === '') ||
              isPending
            }
            onClick={handleInvitePartners}
          >
            Import Partners
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default InvitePartnerDrawer
