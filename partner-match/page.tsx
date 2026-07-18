'use client'

import React, { useState } from 'react'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import { useGetPersona } from '@/http-hooks/partner-match'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { OpenDealIcon } from '@/components/icons/icons'
import PageHeader from '@/components/shared/page-header'

import DataMatrix from './_components/DataMatrix'
import DetailsCard from './_components/DetailsCard'
import EmptyState from './_components/EmptyState'
import PartnermatchAnalytics from './_components/parntermatch-analytics'
import PartnerMatchInfo from './_components/partnermatch-info'
import PartnerMatchProcessModal from './_components/partnermatch-process-modal'
import PartnermatchSourceModal from './_components/partnermatch-source-modal'
import UnderReview from './_components/under-review'

type Props = {}

export type DataSource =
  | 'CSV'
  | 'HUBSPOT'
  | 'GOOGLE_SHEET'
  | 'ZOHO'
  | 'PIPEDRIVE'
  | 'SALESFORCE'

export interface PersonaResponse {
  mode: string
  personaStatus: string
  creationTimestamp: string
  personaDetails: {
    content: Array<{
      id: number
      creationTimestamp: string
      lastUpdatedTimestamp: string
      companySector: string
      companySize: string
      isPartnershipProgram: string
      marketSegment: string
      organizationId: number
    }>
    // other pagination properties
    totalElements: number
  }
  category: {
    companySector: Array<{ key: string; percentage: number }>
    companySize: Array<{ key: string; percentage: number }>
    marketSegment: Array<{ key: string; percentage: number }>
    isPartnershipProgram: Array<{ key: string; percentage: number }>
  }
  topIndustry: string
  topIndustryPercentage: string
  topMarketSegment: string
  topMarketSegmentPercentage: string
}

const Badge: React.FC<{ value: string; color: string }> = ({
  value,
  color
}) => (
  <span
    className='rounded-full px-3 py-1 text-[0.75rem]'
    style={{ backgroundColor: color }}
  >
    {value}
  </span>
)

const Container: React.FC<{
  children: React.ReactElement
  className?: string
}> = ({ children, className }) => (
  <div className={cn('rounded-xl border border-[#E4E7EE] bg-white', className)}>
    {children}
  </div>
)

function formatDate(timestamp: string) {
  const date = new Date(timestamp)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const PartnerMatch = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [activeDataSource, setActiveDataSource] = useState<DataSource | null>(
    null
  )
  const [createButtonClicked, setCreateButtonClicked] = useState(false)

  const { data, isLoading } = useGetPersona() as {
    data: PersonaResponse | null
    isLoading: boolean
  }

  const { integrations, error: fetchError } = useIntegrationApps()

  // Function to open modal with specific data source
  const openModalWithSource = (source: DataSource) => {
    setActiveDataSource(source)
    setIsOpen(true)
  }

  const handleCreateButtonClicked = () => {
    setCreateButtonClicked(true)
  }

  return (
    <div>
      <PageHeader
        title='Customer Insights'
        description='Generated based on your customer data'
        actionButtons={
          <button className='rounded-lg border border-[#3E50F7] bg-transparent px-4 py-2 text-[#3E50F7] transition-colors hover:bg-[#3E50F7] hover:text-white'>
            Disconnect
          </button>
        }
      />
      <div className='mx-8 py-4'>
        {!isLoading &&
          (data?.personaStatus === 'PENDING' ||
            data?.personaStatus === 'INITIATED') && (
            <div className='my-12 flex flex-col items-center justify-center'>
              <UnderReview startedAt={data?.creationTimestamp} />
            </div>
          )}
        {data?.personaStatus === 'COMPLETED' && (
          <div className='my-6'>
            <div className='grid grid-cols-3 gap-4'>
              <DetailsCard
                title='Total Records'
                description={String(data?.personaDetails?.totalElements)}
              />
              <DetailsCard
                title='Top Customer Industry '
                description={
                  data?.topIndustry?.charAt(0).toUpperCase() +
                  data?.topIndustry?.slice(1).toLowerCase()
                }
                badge={
                  <Badge
                    value={`${Math.ceil(Number(data?.topIndustryPercentage))}%`}
                    color='#BAF5C8'
                  />
                }
              />
              <DetailsCard
                title='Top Customer Segment'
                description={data?.topMarketSegment}
                badge={
                  <Badge
                    value={`${Math.ceil(Number(data?.topMarketSegmentPercentage))}%`}
                    color='#FCE8AD'
                  />
                }
              />
            </div>
            <DataMatrix data={data?.category} />
          </div>
        )}
      </div>
    </div>
  )
}

export default PartnerMatch
