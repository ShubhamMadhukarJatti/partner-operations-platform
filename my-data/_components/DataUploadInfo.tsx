import React, { useState } from 'react'
import { ChevronDown, Download, Share2, ShieldCheck } from 'lucide-react'

const DataUploadInfo = React.memo(() => {
  const [open, setOpen] = useState(true)

  const handleDownloadTemplate = () => {
    // Create CSV content
    const csvContent = `name,website,ticket_size($),country,industry,contact_email,creation_date
Katylyst,https://katylyst.com,23900,IN,Internet & Technology,karti@katylyst.com,2025-09-14`

    // Create blob with CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

    // Create download link
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'Sharkdom_Customer_Opportunity_format.csv')
    link.style.visibility = 'hidden'

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up
    URL.revokeObjectURL(url)
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* Recommended fields card */}
      <div className='flex flex-col gap-4 rounded-xl bg-[#F1F5FF] p-4'>
        {/* Header */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className='flex w-full items-center justify-between'
        >
          <span className='text-shark-base font-medium text-text-100'>
            Recommended fields for better results
          </span>
          <ChevronDown
            className={`h-6 w-6 text-text-100 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {/* Mandatory / Nice-to-have legend + Download template */}
        {open && (
          <div className='flex items-end justify-between'>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-wrap items-center gap-1'>
                <span className='text-shark-sm text-text-80'>✅</span>
                <span className='text-shark-sm font-medium text-text-100'>
                  Mandatory:
                </span>
                <span className='text-shark-sm text-text-80'>
                  Name, Website
                </span>
              </div>
              <div className='flex flex-wrap items-center gap-1'>
                <span className='text-shark-sm text-text-80'>🟡</span>
                <span className='text-shark-sm font-medium text-text-100'>
                  Nice-to-have
                </span>
                <span className='text-shark-sm font-medium italic text-text-100'>
                  (Optional though)
                </span>
                <span className='text-shark-sm font-medium text-text-100'>
                  :
                </span>
                <span className='text-shark-sm text-text-80'>
                  Industry, Contact Number
                </span>
              </div>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className='flex items-center gap-1 text-primary-blue hover:opacity-80'
            >
              <Download className='h-5 w-5' />
              <span className='text-shark-sm font-medium leading-5'>
                Download template
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Trust / feature info card */}
      <div className='flex flex-col gap-4 rounded-lg border border-text-20 p-4'>
        <div className='flex items-start gap-2'>
          <Share2 className='mt-0.5 h-6 w-6 flex-shrink-0 text-text-40' />
          <div className='flex flex-col gap-0.5'>
            <p className='text-shark-base font-medium text-text-100'>
              Connect Effortlessly
            </p>
            <p className='text-shark-sm text-text-70'>
              Sharkdom lets you securely connect your marketing data in couple
              of minutes.
            </p>
          </div>
        </div>
        <div className='flex items-start gap-2'>
          <ShieldCheck className='mt-0.5 h-6 w-6 flex-shrink-0 text-text-40' />
          <div className='flex flex-col gap-0.5'>
            <p className='text-shark-base font-medium text-text-100'>
              Your data belongs to you
            </p>
            <p className='text-shark-sm text-text-70'>
              Sharkdom doesn&apos;t sell personal info, and will only use it
              with your permission.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

DataUploadInfo.displayName = 'DataUploadInfo'

export default DataUploadInfo
