'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  usePartnerMappingComparison,
  useSavePartnerMappingReport
} from '@/http-hooks/partner-mapping'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'

import GetBeeLogo from '../../../../../../public/getbe-icon.svg'
import FilterOption from './FilterOption'
import SearchInput from './SearchInput'

interface Partner {
  id: string
  name: string
  logo?: string | null
  overlaps: number | null
  dataSourceConnected: boolean
}

interface ApiPartner {
  organizationName: string
  dataSourceConnected: boolean
  data: {
    data: {
      records: any[]
      overlap_count: number
      overlap_customer_count: number
      raw_records_A: number
      raw_records_sum: number
      raw_records_B: number
    }
    organizationName: string
    partnerName: string
  }
  partnerOrganizationId: number
  logoUrl: string
}

// const partnersSample: Partner[] = [
//   { id: '1', name: 'GetBee', logo: null, overlaps: 68 },
//   { id: '2', name: 'GetBee', logo: null, overlaps: 61 },
//   { id: '3', name: 'GetBee', logo: null, overlaps: 60 },
//   { id: '4', name: 'GetBee', logo: null, overlaps: 34 },
//   { id: '5', name: 'GetBee', logo: null, overlaps: null } // N.A. example
// ]

function transformApiPartnersToRows(apiPartners: any[]): Partner[] {
  return apiPartners.map((partner) => {
    // Parse the JSON string from the report field
    let reportData = null
    try {
      reportData = JSON.parse(partner.report)
    } catch (error) {
      console.error('Error parsing report data:', error)
    }

    return {
      id: partner.partnerOrganizationId.toString(),
      name: partner.organizationName,
      logo: partner.logoUrl,
      dataSourceConnected: partner.dataSourceConnected,
      overlaps:
        partner.dataSourceConnected &&
        reportData?.data?.overlap_customer_count > 0
          ? reportData.data.overlap_customer_count
          : null
    }
  })
}

function PartnerRow({
  partner,
  selectedColumn,
  onSaveReport,
  organizationId
}: {
  partner: Partner
  selectedColumn: string
  onSaveReport: (
    partnerId: string,
    overlapCount: number,
    organizationId: number
  ) => void
  organizationId: number
}) {
  const dataSourceConnected = partner.dataSourceConnected
  const { name, overlaps } = partner
  const progress = overlaps == null ? 0 : Math.max(0, Math.min(100, overlaps))
  const router = useRouter()

  // State for Request Partner button
  const [buttonText, setButtonText] = useState('Request Partner')
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [notifyLoader, setNotifyLoader] = useState(false)

  const handleCreateReport = () => {
    if (overlaps && overlaps > 0) {
      onSaveReport(partner.id, overlaps, organizationId)
    } else {
      // Navigate immediately if no overlaps to save
      router.push(
        `/partner-mapping/report?type=${selectedColumn}&partner=${partner.id}`
      )
    }
  }

  const handleRequestPartner = async () => {
    setNotifyLoader(true)
    try {
      const senderId = organizationId
      const notifyId = partner.id

      const response = await fetch(
        `/api/persona/notify?senderId=${senderId}&notifyId=${notifyId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Include cookies for authentication
        }
      )

      if (!response.ok) {
        throw new Error('Failed to notify partner')
      }

      const data = await response.json()

      setButtonText('Notified')
      setTimeout(() => {
        setButtonText('Request Partner')
        setButtonDisabled(false)
      }, 5000)

      setButtonDisabled(true)
      showCustomToast('Success', 'Notification sent', 'success', 5000)
    } catch (error) {
      console.error('Error sending reminder:', error)
      showCustomToast('Error', 'Error sending reminder', 'error', 5000)
      setButtonDisabled(false)
    } finally {
      setNotifyLoader(false)
    }
  }
  return (
    <li
      className={`flex flex-col gap-4 border-t px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-0 md:px-6 ${
        !dataSourceConnected ? 'bg-yellow-50' : 'bg-white md:bg-transparent'
      } last:border-b`}
      aria-label={`partner-${partner.id}`}
    >
      {/* Left: Partner info */}
      <div className='flex items-center gap-4 md:w-1/3'>
        <div className='flex w-full items-center gap-3 md:w-auto'>
          {/* Logo placeholder */}
          <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center'>
            {/* svg logo */}
            <Image
              src={partner.logo || GetBeeLogo}
              alt={`${name} logo`}
              className='h-8 w-8 rounded-full object-cover'
              width={32}
              height={32}
            />
          </div>

          <div className='flex flex-col'>
            <span className='text-sm font-medium text-gray-800 md:text-base'>
              {name}
            </span>
            <span className='text-xs text-gray-400 md:hidden'>Partner</span>
          </div>
        </div>
      </div>

      {/* Middle: Overlaps (number + progress). On small screens we show it full width */}
      <div className='md:flex-1 md:px-6'>
        <div className='flex flex-col md:flex-row md:items-center md:gap-6'>
          <div className='hidden w-12 text-center md:block'>
            {!dataSourceConnected ? (
              <span className='text-sm text-gray-400'>N.A.</span>
            ) : (
              <span className='text-sm font-medium text-gray-800'>
                {overlaps ?? 0}
              </span>
            )}
          </div>

          <div className='flex-1'>
            {/* Progress bar container */}
            {/* NOTE: to make the fill 'square' we remove rounded corners on the filled div */}
            {dataSourceConnected && (
              <div
                className={`h-4 w-full overflow-hidden bg-gray-100 ${dataSourceConnected ? 'opacity-50' : ''}`}
              >
                <div
                  className='h-full rounded-none' // <-- square fill (no rounded corners)
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg,#F59E0B,#F97316)'
                  }}
                  role='progressbar'
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                />
              </div>
            )}

            {/* On small screens show numeric to the left of progress */}
            <div className='mt-2 flex items-center justify-between md:hidden'>
              <div className='text-sm text-gray-700'>
                {!dataSourceConnected || overlaps == null ? 'N.A.' : overlaps}
              </div>
              <div className='text-xs text-gray-400'>Overlaps</div>
            </div>

            {/* On md+ show description for N.A. row */}
            {!dataSourceConnected && (
              <div className='hidden rounded bg-yellow-50 p-2 text-sm text-gray-500 md:block'>
                <strong className='block text-gray-700'>
                  Your partner hasn&apos;t connected their data source yet.
                </strong>
                <p className='text-xs'>
                  To view overlap analytics and create reports, your partner
                  needs to connect their data source. Send them a quick request
                  so both of you can unlock insights.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Action button */}
      <div className='flex md:w-40 md:justify-end'>
        {!dataSourceConnected ? (
          <Button
            variant='primary'
            size='sm'
            className='disabled:pointer-events-none disabled:cursor-not-allowed'
            onClick={handleRequestPartner}
            disabled={buttonDisabled || notifyLoader}
          >
            {notifyLoader ? 'Sending...' : buttonText}
          </Button>
        ) : (
          <Button
            variant='primary'
            size='sm'
            className='w-fit disabled:pointer-events-none disabled:cursor-not-allowed'
            disabled={!(Boolean(selectedColumn) && Boolean(partner.id))}
            onClick={handleCreateReport}
          >
            Create Report
          </Button>
        )}
      </div>
    </li>
  )
}

export default function MatrixTable() {
  const leftOpts = [
    { value: 'my_customer', label: 'My Customer' },
    { value: 'my_prospect', label: 'My Prospect' },
    { value: 'my_opportunity', label: 'Open Opportunity' }
  ]

  const rightOpts = [
    { value: 'partner_customer', label: "Partner's Customer" },
    { value: 'partner_prospect', label: "Partner's Prospect" },
    { value: 'partner_opportunity', label: "Partner's Opportunity" }
  ]

  // Set default to customer for both sides
  const [left, setLeft] = useState('my_customer')
  const [right, setRight] = useState('partner_customer')
  const [comparisonType, setComparisonType] = useState<string>('')
  const [shouldFetch, setShouldFetch] = useState(false)
  const [reportCount, setReportCount] = useState(0)

  // Save report mutation
  const saveReportMutation = useSavePartnerMappingReport()

  const [orgId, setOrgId] = useState<number | null>(null)

  // Get organization ID from Redux
  const currentOrgState = useSelector((state: RootState) => state.currentOrg)
  const organization = currentOrgState?.organization
  const currentOrgId = organization?.id

  // Update orgId when currentOrgId is available
  useEffect(() => {
    if (currentOrgId) {
      setOrgId(currentOrgId)
    }
  }, [currentOrgId])

  // Generate comparison type based on selections
  const generateComparisonType = (
    leftValue: string,
    rightValue: string
  ): string => {
    const leftType = leftValue.replace('my_', '').toUpperCase()
    const rightType = rightValue.replace('partner_', '').toUpperCase()
    return `${leftType}_${rightType}`
  }

  const handleCompare = (l: string, r: string) => {
    const type = generateComparisonType(l, r)
    setComparisonType(type)
    setShouldFetch(true)
  }

  const router = useRouter()

  const handleSaveReport = (
    partnerId: string,
    overlapCount: number,
    organizationId: number
  ) => {
    const payload = {
      organization_id: organizationId,
      your_matrix: left,
      partner_matrix: right,
      overlap_count: overlapCount,
      partner_id: parseInt(partnerId),
      report_count: reportCount + 1
    }

    saveReportMutation.mutate(payload, {
      onSuccess: () => {
        setReportCount((prev) => prev + 1)
        console.log('Report saved successfully')
        // Navigate after successful save
        router.push(
          `/partner-mapping/report?type=${comparisonType}&partner=${partnerId}`
        )
      },
      onError: (error) => {
        console.error('Failed to save report:', error)
      }
    })
  }

  // Use the API hook
  const {
    data: comparisonData,
    isLoading,
    error
  } = usePartnerMappingComparison(
    comparisonType,
    shouldFetch && !!comparisonType
  )

  useEffect(() => {
    handleCompare('my_customer', 'partner_customer')
  }, [])

  // Transform API data to rows
  const rows = comparisonData?.my_partners_data
    ? transformApiPartnersToRows(comparisonData.my_partners_data)
    : []
  return (
    <div className='w-full'>
      <div className='w-1/3 pb-6 pt-2'>
        {/* <SearchInput
          searchQuery={searchInput || ''}
          handleInput={(e: any) => setSearchInput(e.target.value)}
        /> */}
        <FilterOption
          leftOptions={leftOpts}
          rightOptions={rightOpts}
          leftValue={left}
          rightValue={right}
          onLeftChange={(v) => setLeft(v)}
          onRightChange={(v) => setRight(v)}
          onCompare={handleCompare}
        />
      </div>
      <div className='overflow-hidden rounded-lg border border-gray-100 bg-white'>
        {/* Header (only visible on md+) */}
        <div className='hidden grid-cols-12 items-center gap-4 border-b bg-gray-50 px-6 py-3 md:grid'>
          <div className='col-span-4 text-sm text-gray-500'>Partner Name</div>
          <div className='col-span-5 text-sm text-gray-500'>Overlaps</div>
          <div className='col-span-3 text-right text-sm text-gray-500'>
            Report
          </div>
        </div>

        {rows.length === 0 ? (
          <div className='flex items-center justify-center py-8'>
            <div className='text-sm text-gray-500'>
              No data available. Click &quot;Compare&quot; to load partner data.
            </div>
          </div>
        ) : (
          <ul className='divide-y'>
            {rows.map((r) => (
              <PartnerRow
                partner={r}
                key={r.id}
                selectedColumn={comparisonType}
                onSaveReport={handleSaveReport}
                organizationId={orgId || 0}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
