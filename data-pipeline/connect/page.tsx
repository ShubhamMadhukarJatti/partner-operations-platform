// src/app/(app)/(dashboard-pages)/data-pipeline/connect/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, Briefcase, Building2, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import DataPipelineStepper from '../_components/DataPipelineStepper'
import ImportGuide from '../_components/ImportGuide'
import ImportOptionCard from '../_components/ImportOptionCard'

type ImportOption = 'contacts' | 'companies' | 'deals'

const OPTIONS = [
  {
    id: 'contacts' as ImportOption,
    icon: User,
    title: 'Contacts (Prosects)',
    description: 'People are the individual contacts you communicate with.'
  },
  {
    id: 'companies' as ImportOption,
    icon: Building2,
    title: 'Companies (Customers)',
    description:
      'Organizations are a type of contact which include companies or a collective of people.'
  },
  {
    id: 'deals' as ImportOption,
    icon: Briefcase,
    title: 'Deals (Open Opportunity)',
    description:
      'The revenue connected to a company, commonly called an opportunity.'
  }
]

export default function ConnectUploadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ✅ Hydrate selection from existing URL params (handles Back navigation)
  const [selected, setSelected] = useState<ImportOption[]>(() => {
    const imports = searchParams.getAll('import') as ImportOption[]
    const validIds = OPTIONS.map((o) => o.id)
    return imports.filter((imp) => validIds.includes(imp))
  })

  function toggle(opt: ImportOption) {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    )
  }

  // ✅ Encode selected options into URL params before navigating to page 2
  function handleNext() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('import')
    selected.forEach((opt) => params.append('import', opt))
    router.push(`/data-pipeline?${params.toString()}`)
  }

  return (
    <GradientPageBackground className='flex min-h-full flex-col !overflow-visible'>
      {/* Stepper */}
      <div className='px-6 pt-5'>
        <DataPipelineStepper current={1} />
      </div>

      {/* Heading */}
      <div className='mt-4 px-6'>
        <h1 className='text-2xl font-semibold leading-[34px] text-[#25224A]'>
          Select what you&apos;d like to import
        </h1>
        <p className='text-sm font-normal leading-5 text-[#4D5C78]'>
          Upload the CSV file that has access set to open.
        </p>
      </div>

      {/* Main white card */}
      <div className='mx-4 mb-6 mt-4 flex min-h-0 flex-1 overflow-hidden rounded-lg bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.07),0px_1px_2px_-2px_rgba(0,0,0,0.06),0px_0px_1px_1px_rgba(0,0,0,0.05)]'>
        {/* Left panel */}
        <div className='flex w-[48%] shrink-0 flex-col gap-4 overflow-y-auto border-r border-[rgba(33,35,44,0.12)] p-6'>
          <h2 className='text-sm font-semibold text-[#21232C]'>
            Select all that apply
          </h2>

          {/* Warning banner */}
          <div className='flex items-start gap-3 rounded-lg bg-[#FFF0ED] p-3 outline outline-1 outline-[#FFC6B8]'>
            <div className='mt-0.5 shrink-0 rounded-full p-0.5'>
              <AlertCircle className='h-5 w-5 text-[#FF7A59]' />
            </div>
            <p className='text-[13px] font-normal leading-[18px] text-[#21232C]'>
              Account Mapping requires Contacts, Companies and Deals to work.
              Importing without all three will disable Account Mapping until the
              missing data is added.
            </p>
          </div>

          {/* Option cards */}
          <div className='flex flex-col gap-2'>
            {OPTIONS.map((opt) => (
              <ImportOptionCard
                key={opt.id}
                isSelected={selected.includes(opt.id)}
                onToggle={() => toggle(opt.id)}
                icon={opt.icon}
                title={opt.title}
                description={opt.description}
              />
            ))}
          </div>
        </div>

        {/* Right panel */}
        <ImportGuide />
      </div>

      {/* Footer bar */}
      <div className='sticky bottom-0 z-10 mt-auto flex flex-shrink-0 items-center justify-between border-t border-[#CDD9F2] bg-white px-6 py-4'>
        <Button
          variant='outline'
          className='h-8 px-4 text-sm font-semibold text-[#21232C]'
          onClick={() => {
            const rawSource = searchParams.get('source')
            if (!rawSource) {
              router.push('/my-data')
              return
            }
            const sourceKey = rawSource.toLowerCase()
            const serviceRoute =
              sourceKey === 'google_sheet' ? 'google-sheets' : sourceKey
            router.push(
              `/my-data/connect-service/${serviceRoute}?${searchParams.toString()}`
            )
          }}
        >
          Back
        </Button>
        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            className='h-8 px-4 text-sm font-semibold text-[#21232C]'
          >
            Cancel import
          </Button>
          {/* ✅ Disabled when nothing selected, encodes selection into URL */}
          <Button
            onClick={handleNext}
            disabled={selected.length === 0}
            className='h-8 bg-[#6863FB] px-6 text-sm font-semibold text-white hover:bg-[#5651D9] disabled:opacity-50'
          >
            Next
          </Button>
        </div>
      </div>
    </GradientPageBackground>
  )
}
