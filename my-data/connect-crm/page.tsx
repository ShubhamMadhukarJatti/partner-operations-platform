'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  CalendarCheck,
  CalendarDays,
  Check,
  Clock,
  Coins,
  Download,
  FileText,
  LayoutGrid,
  Shield
} from 'lucide-react'

import { Button } from '@/components/ui/button'
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

const popularCrmOptions = [
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
      <img
        src='/salesforce.jpeg'
        alt='Salesforce CRM'
        className='h-8 w-8 rounded'
      />
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
  }
]

const manualCrmOptions = [
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

const featureItems = [
  {
    title: '2-minute setup',
    desc: 'One OAuth click. No API keys, no developer needed.',
    icon: <Clock className='h-6 w-6 text-[#3E50F7]' />
  },
  {
    title: 'Your data stays yours',
    desc: 'We never sell data. Read-only sync with your permission.',
    icon: <Shield className='h-6 w-6 text-[#3E50F7]' />
  },
  {
    title: 'SOC 2 compliant',
    desc: 'Enterprise-grade security. Encrypted at rest and in transit.',
    icon: <FileText className='h-6 w-6 text-[#3E50F7]' />
  }
]

type CrmOption = {
  key: string
  label: string
  icon: React.ReactNode
  desc: string
}

const CrmCard = ({
  opt,
  isSelected,
  onClick,
  fullWidth = false,
  showUnselectedOutline = true
}: {
  opt: CrmOption
  isSelected: boolean
  onClick: () => void
  fullWidth?: boolean
  showUnselectedOutline?: boolean
}) => (
  <div
    onClick={onClick}
    className={`relative flex cursor-pointer flex-col gap-2.5 p-[14px] transition-all ${
      fullWidth ? 'flex-1' : 'w-[220px]'
    } ${
      isSelected
        ? 'rounded-[7px] border-2 border-[#2563EB] bg-[#EAF0FF]'
        : 'rounded-[14px] border border-[#E9EAEB] bg-white'
    }`}
  >
    <div className='flex items-start justify-between'>
      <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-white shadow-sm'>
        {opt.icon}
      </div>
      {isSelected ? (
        <div className='flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#2563EB]'>
          <Check className='h-3.5 w-3.5 text-white' strokeWidth={3} />
        </div>
      ) : showUnselectedOutline ? (
        <div className='h-[19px] w-[19px] rounded-full border border-[#D5D7DA] bg-white' />
      ) : null}
    </div>
    <div className='flex flex-col gap-1'>
      <span className='text-base font-medium leading-6 text-[#414651]'>
        {opt.label}
      </span>
      <span className='text-sm leading-[22px] text-[#657795]'>{opt.desc}</span>
    </div>
  </div>
)

const ConnectCrmPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const recordType = searchParams.get('recordType') || 'CUSTOMER'
  const [selected, setSelected] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    sessionStorage.removeItem('returnToPartnerPortal')
  }, [])

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
    if (selected === 'hubspot') router.push('/my-data/connect-service/hubspot')
    else if (selected === 'zoho') router.push('/my-data/connect-service/zoho')
    else if (selected === 'salesforce')
      router.push('/my-data/connect-service/salesforce')
    else if (selected === 'pipedrive')
      router.push('/my-data/connect-service/pipedrive')
    else if (selected === 'sheets')
      router.push('/my-data/connect-service/google-sheets')
    else if (selected === 'csv') router.push('/my-data/upload-csv')
  }

  return (
    <GradientPageBackground className='relative flex min-h-[calc(100vh-50px)] flex-col'>
      <div className='mx-auto flex w-full max-w-5xl flex-col px-4 pb-8 pt-12'>
        <CrmStepper current={1} />

        {/* Centered header */}
        <div className='mb-[30px] mt-8 flex flex-col items-center gap-[18px] text-center'>
          <h2 className='text-[28px] font-semibold leading-[34px] text-[#25224A]'>
            Connect your CRM
          </h2>
          <p className='text-lg leading-5 text-[#4D5C78]'>
            Select where you want to take your data from
          </p>
        </div>

        {/* Main content container */}
        <div className='mx-auto flex w-full max-w-[730px] flex-col gap-5'>
          {/* Popular integrations */}
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-1'>
              <img src='/icons/flash.svg' alt='Flash' className='h-4 w-4' />
              <span className='text-[14.5px] font-medium leading-5 text-[#475467]'>
                Popular integrations
              </span>
            </div>
            <div className='flex flex-wrap gap-[14px]'>
              {popularCrmOptions.map((opt) => (
                <CrmCard
                  key={opt.key}
                  opt={opt}
                  isSelected={selected === opt.key}
                  onClick={() => setSelected(opt.key)}
                />
              ))}
            </div>
          </div>

          {/* Or Import Manually */}
          <div className='flex flex-col gap-2.5'>
            <div className='flex items-center gap-1'>
              <img src='/icons/flash.svg' alt='Flash' className='h-4 w-4' />
              <span className='text-[14.5px] font-medium leading-5 text-[#475467]'>
                Or Import Manually
              </span>
            </div>
            <div className='flex gap-[14px]'>
              {manualCrmOptions.map((opt) => (
                <CrmCard
                  key={opt.key}
                  opt={opt}
                  isSelected={selected === opt.key}
                  onClick={() => setSelected(opt.key)}
                  fullWidth
                  showUnselectedOutline={false}
                />
              ))}
            </div>
          </div>

          {/* Feature trust cards */}
          <div className='flex flex-col gap-4 rounded-lg bg-white p-4'>
            {featureItems.map((item) => (
              <div key={item.title} className='flex items-start gap-5'>
                <div className='flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-[6px] bg-[#EAECFF]'>
                  {item.icon}
                </div>
                <div className='flex flex-col gap-0.5'>
                  <span className='text-base font-medium text-[#2A3241]'>
                    {item.title}
                  </span>
                  <span className='text-sm leading-5 text-[#657795]'>
                    {item.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* What data we import */}
          <div className='flex flex-col gap-4 rounded-xl bg-white p-4'>
            <button
              onClick={handleDownloadTemplate}
              className='flex items-center gap-1 self-end text-sm font-medium text-[#3E50F7]'
            >
              <Download className='h-5 w-5' />
              Download template
            </button>
          </div>
        </div>

        {/* Bottom navigation */}
      </div>
      <div className='sticky bottom-0 z-50 mt-auto w-full border-t border-[#CDD9F2] bg-white'>
        <div className='flex w-full items-center justify-between px-6 py-4'>
          <div className='flex w-full items-center justify-between gap-3'>
            <Link href='/my-data'>
              <button className='flex h-8 items-center rounded-[4px] bg-white px-4 text-sm font-semibold text-[#21232C] shadow-[0px_1px_2px_rgba(42,54,71,0.05)] outline outline-1 outline-[rgba(33,35,44,0.24)]'>
                Back
              </button>
            </Link>
            <button
              onClick={handleNext}
              disabled={!selected}
              className='flex h-8 items-center rounded-[4px] bg-[#2563EB] px-4 text-sm font-semibold text-white shadow-[0px_1px_2px_rgba(42,54,71,0.05)] disabled:cursor-not-allowed disabled:opacity-50'
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </GradientPageBackground>
  )
}

export default ConnectCrmPage
