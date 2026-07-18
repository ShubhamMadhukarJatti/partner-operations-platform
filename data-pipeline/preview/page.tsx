'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Building2, Eye, Tag, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import AutofillBanner from '../_components/AutofillBanner'
import DataPipelineStepper from '../_components/DataPipelineStepper'
import PreviewTable from '../_components/PreviewTable'

const TABS = [
  { id: 'contacts', label: 'Contacts', Icon: Users },
  { id: 'companies', label: 'Companies', Icon: Building2 },
  { id: 'deals', label: 'Deals', Icon: Tag }
] as const

type TabId = (typeof TABS)[number]['id']

export default function DataPipelinePreviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabId>('contacts')
  const [enabledTabs, setEnabledTabs] = useState<string[]>([
    'Contacts',
    'Companies',
    'Deals'
  ])

  useEffect(() => {
    let currentEnabled = ['Contacts', 'Companies', 'Deals']
    const storedMapping = sessionStorage.getItem('fieldMappingData')
    if (storedMapping) {
      try {
        const parsed = JSON.parse(storedMapping)
        if (parsed.enabledTabs && Array.isArray(parsed.enabledTabs)) {
          currentEnabled = parsed.enabledTabs
          setEnabledTabs(parsed.enabledTabs)
        }
      } catch (e) {
        console.error(e)
      }
    }

    const pendingRecordType = sessionStorage.getItem('pending_recordType')
    let defaultTab: TabId = 'contacts'
    if (pendingRecordType === 'CUSTOMER') {
      defaultTab = 'companies'
    } else if (pendingRecordType === 'OPPORTUNITY') {
      defaultTab = 'deals'
    }

    const isDefaultEnabled = currentEnabled.some(
      (et) => et.toLowerCase() === defaultTab
    )
    if (isDefaultEnabled) {
      setActiveTab(defaultTab)
    } else if (currentEnabled.length > 0) {
      setActiveTab(currentEnabled[0].toLowerCase() as TabId)
    }
  }, [])

  return (
    <GradientPageBackground className='flex min-h-full flex-col !overflow-visible'>
      {/* Stepper */}
      <div className='px-6 pt-5'>
        <DataPipelineStepper current={3} />
      </div>

      {/* Heading */}
      <div className='mt-6 flex flex-col items-center gap-1.5 px-6'>
        <h1 className='text-center text-2xl font-semibold leading-[34px] text-[#25224A]'>
          Preview import
        </h1>
        <p className='text-center text-sm font-normal leading-5 text-text-80'>
          Review the data to be imported using the preview. Only up to 20 rows
          of the import are displayed.
        </p>
      </div>

      {/* Main content */}
      <div className='mt-6 flex flex-1 flex-col gap-3 px-6 pb-6'>
        <AutofillBanner />
        <div className='flex items-center justify-between'>
          {/* Tab switcher */}
          <div
            className='inline-flex items-center self-start'
            style={{
              background: 'white',
              borderRadius: 10,
              outline: '1px #B2C3D3 solid',
              outlineOffset: '-1px',
              gap: 2
            }}
          >
            {TABS.filter((tab) =>
              enabledTabs.some((et) => et.toLowerCase() === tab.id)
            ).map(({ id, label, Icon }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className='flex items-center gap-2 rounded-[10px] px-4 transition-colors'
                  style={{
                    background: isActive ? '#212E42' : 'transparent',
                    height: 40
                  }}
                >
                  <Icon
                    className='h-5 w-5'
                    style={{
                      color: isActive ? 'white' : 'rgba(33, 35, 44, 0.72)'
                    }}
                  />
                  <span
                    style={{
                      color: isActive ? 'white' : '#303C4E',
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: '24px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
          <button className='flex items-center gap-1'>
            <Eye
              className='h-5 w-5'
              style={{ color: '#2C3853' }}
              aria-label='Preview'
            />
            Preview
          </button>
        </div>

        <PreviewTable activeTab={activeTab} />
      </div>

      {/* Footer bar */}
      <div className='sticky bottom-0 z-10 mt-auto flex flex-shrink-0 items-center justify-between border-t border-[#CDD9F2] bg-white px-6 py-4'>
        <Button
          variant='outline'
          className='h-8 px-4 text-sm font-semibold text-[#21232C]'
          onClick={() =>
            router.push(`/data-pipeline?${searchParams.toString()}`)
          }
        >
          Back
        </Button>
        <Button
          className='h-8 bg-[#6863FB] px-6 text-sm font-semibold text-white hover:bg-[#5651D9]'
          onClick={() =>
            router.push(`/data-pipeline/finish?${searchParams.toString()}`)
          }
        >
          Next
        </Button>
      </div>
    </GradientPageBackground>
  )
}
