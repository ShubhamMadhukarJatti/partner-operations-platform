'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { EyeSlash, Share } from 'iconsax-react'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const crmOptions = [
  {
    key: 'hubspot',
    label: 'HubSpot',
    icon: (
      <img src='/icons/hubspot-icon.svg' alt='HubSpot' className='h-8 w-8' />
    ),
    desc: 'One time setup and we will do the rest!'
  },
  {
    key: 'zoho',
    label: 'Zoho',
    icon: (
      <img src='/icons/zoho-crm-icon.svg' alt='Zoho CRM' className='h-8 w-8' />
    ),
    desc: 'One time setup and we will do the rest!'
  },
  {
    key: 'salesforce',
    label: 'Salesforce',
    icon: (
      <img src='/salesforce.jpeg' alt='Salesforce CRM' className='h-8 w-8' />
    ),
    desc: 'One time setup and we will do the rest!'
  },
  {
    key: 'pipedrive',
    label: 'Pipedrive',
    icon: (
      <img
        src='/icons/pipedrive.png'
        alt='Pipedrive'
        className='h-8 w-8 opacity-50'
      />
    ),
    desc: 'One time setup and we will do the rest!'
  },
  {
    key: 'sheets',
    label: 'Google Sheets',
    icon: (
      <img
        src='/icons/google-sheets-icon.svg'
        alt='Google Sheets'
        className='h-8 w-8'
      />
    ),
    desc: 'Good for a company when there is no HubSpot'
  },
  {
    key: 'csv',
    label: 'CSV',
    icon: <img src='/csv.svg' alt='CSV' className='h-8 w-8' />,
    desc: 'Best option to just "try" partner match journey!'
  }
]

export default function PartnerPortalConnectCrmWithOrgPage() {
  const router = useRouter()
  const params = useParams()
  const vendorOrgId = params?.vendorOrgId as string | undefined
  const base = vendorOrgId
    ? `/partner-portal/partner-mapping/${vendorOrgId}`
    : '/partner-portal/partner-mapping'

  const [selected, setSelected] = useState<string | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (selected) {
      setShowSkeleton(true)
      const timeout = setTimeout(() => setShowSkeleton(false), 600)
      return () => clearTimeout(timeout)
    }
  }, [selected])

  if (!isClient) {
    return (
      <div className='relative flex h-[calc(100vh-50px)] flex-col bg-white'>
        <div className='mx-auto flex w-full max-w-4xl flex-col pb-32 pt-12'>
          <div className='flex items-center justify-center'>
            <div className='text-center'>
              <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
              <p className='mt-2'>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleDownloadTemplate = () => {
    const csvContent = `name,website,ticket_size($),country,industry,contact_email,creation_date
Katylyst,https://katylyst.com,23900,IN,Internet & Technology,karti@katylyst.com,2025-09-14`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'Sharkdom_Customer_Opportunity_format.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleNext = () => {
    if (!selected) return
    if (selected === 'hubspot') router.push(`${base}/connect-service/hubspot`)
    else if (selected === 'zoho') router.push(`${base}/connect-service/zoho`)
    else if (selected === 'salesforce')
      router.push(`${base}/connect-service/salesforce`)
    else if (selected === 'pipedrive')
      router.push(`${base}/connect-service/pipedrive`)
    else if (selected === 'sheets')
      router.push(`${base}/connect-service/google-sheets`)
    else if (selected === 'csv') router.push(`${base}/upload-csv`)
  }

  return (
    <div className='relative flex h-[calc(100vh-50px)] flex-col bg-white px-4'>
      <div className='mx-auto flex w-full max-w-5xl flex-col pb-32 pt-12'>
        <div className='my-4 flex w-full flex-row items-center justify-between md:pr-8'>
          <div>
            <h2 className='text-2xl font-bold'>Select Your CRM</h2>
            <p className='text-[#6B7280]'>
              Select where you want to take your data from
            </p>
          </div>
          <div className='font-medium text-[#6B7280]'>Step 1/3</div>
        </div>
        <div className='mb-4 flex items-center text-sm font-medium'>
          <img src='/icons/flash.svg' alt='Flash' className='h-4 w-4' />
          Onetime setup
        </div>
        <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {crmOptions.map((opt) => (
            <div
              key={opt.key}
              className={`relative flex min-h-[140px] w-full cursor-pointer flex-col rounded-xl border-2 p-6 transition-all duration-100 ${
                selected === opt.key
                  ? 'border-[#7F56D9] bg-[#F9FAFF] shadow-md'
                  : 'border-[#E3E8EF] bg-white'
              }`}
              style={{ boxSizing: 'border-box', minWidth: '0' }}
              onClick={() => setSelected(opt.key)}
            >
              <div className='mb-2'>{opt.icon}</div>
              <div className='mb-1 font-semibold'>{opt.label}</div>
              <div className='mb-2 text-xs text-[#6B7280]'>{opt.desc}</div>
              <span
                className={`absolute right-3 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                  selected === opt.key
                    ? 'border-[#7F56D9] bg-[#7F56D9]'
                    : 'border-[#D1D5DB] bg-white'
                }`}
                style={{ transition: 'border-color 0.15s, background 0.15s' }}
              >
                {selected === opt.key && (
                  <span className='block h-3 w-3 rounded-full bg-white' />
                )}
              </span>
            </div>
          ))}
        </div>
        <div className='relative flex flex-col gap-2 rounded-lg border border-[#E3E8EF] bg-[#F1F5FF] p-4 sm:p-6'>
          <h4 className='mb-2 text-lg font-semibold sm:text-xl'>
            Recommended fields for better results
          </h4>
          <div className='mb-1 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2'>
            <span className='font-normal text-[#1A1A1A]'>✅ Mandatory:</span>
            <span className='text-[#6B7280]'>Name, Website</span>
          </div>
          <div className='flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2'>
            <span className='font-normal text-[#1A1A1A]'>
              🟡 Nice-to-have <i className='not-italic'>(Optional though):</i>
            </span>
            <span className='text-[#6B7280]'>Industry, Contact Number</span>
          </div>
          <div className='mt-3 flex justify-start sm:justify-end md:absolute md:bottom-3 md:right-4'>
            <Button
              variant='ghost'
              className='flex items-center gap-2 px-2 py-1 text-sm font-medium text-[#3E50F7]'
              onClick={handleDownloadTemplate}
            >
              <img
                src='/icons/inbox-download.svg'
                className='h-4 w-4'
                alt='Download'
              />
              Download template
            </Button>
          </div>
        </div>
        <div className='my-6 flex flex-col gap-3 rounded-lg border border-[#E4E7EE] p-4'>
          <div className='flex flex-1 items-center gap-3'>
            <Share className='h-6 w-6 text-[#6B7280]' />
            <div>
              <div className='font-semibold text-[#1A1A1A]'>
                Connect Effortlessly
              </div>
              <div className='text-sm text-[#6B7280]'>
                Sharkdom lets you securely connect your marketing data in couple
                of minutes.
              </div>
            </div>
          </div>
          <div className='flex flex-1 items-center gap-3'>
            <EyeSlash className='h-6 w-6 text-[#6B7280]' />
            <div>
              <div className='font-semibold text-[#1A1A1A]'>
                Your data belongs to you
              </div>
              <div className='text-sm text-[#6B7280]'>
                Sharkdom doesn&apos;t sell personal info, and will only use it
                with your permission.
              </div>
            </div>
          </div>
        </div>
        {selected && showSkeleton && (
          <div className='my-8 flex flex-col items-center justify-center'>
            <Skeleton className='mb-4 h-8 w-1/2' />
            <Skeleton className='mb-2 h-6 w-1/3' />
            <Skeleton className='mb-2 h-6 w-1/3' />
            <Skeleton className='h-12 w-1/4' />
          </div>
        )}
        {selected && !showSkeleton && (
          <>
            <p className='mb-2 text-center text-sm text-[#6B7280]'>
              By selecting &quot;Next&quot; you agree to the{' '}
              <Link href='/privacy-policy' className='text-[#2563EB]'>
                Sharkdom End User Privacy Policy
              </Link>
            </p>
            <div className='sticky bottom-0 w-full'>
              <div className='flex w-full items-center justify-between border-t border-[#E4E7EE] bg-white py-4 md:px-4'>
                <Link
                  href={base}
                  className='flex items-center gap-2 rounded-lg px-8 py-3 text-base font-semibold text-[#3E50F7]'
                >
                  <Button variant='outline'>
                    <ArrowLeft className='h-5 w-5' /> Back
                  </Button>
                </Link>
                <Button
                  onClick={handleNext}
                  disabled={!selected}
                  className='flex items-center gap-2 rounded-lg bg-[#3E50F7] px-8 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
