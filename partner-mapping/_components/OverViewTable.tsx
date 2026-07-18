// OverViewTable.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'

import GetBeeLogo from '../../../../../../public/getbe-icon.svg'
import SearchInput from './SearchInput'

type PartnerRow = {
  id: string
  name: string
  logoUrl?: string
  overlapRate?: number | null // percent (0-100) or null when N.A.
  context: string
  status?: 'connected' | 'not_connected' | 'requested'
  requestSentAt?: string // ISO date when status === 'requested'
  details?: string
}

type ApiPartner = {
  organizationName: string
  aCustomerOverlapCount: number
  overlapRate: number
  aOpportunityOverlapCount: number
  partnerOrganizationId: number
  logoUrl: string
  aProspectOverlapCount: number
  dataSourceConnected?: boolean // true = partner has connected their CRM
}

interface OverViewTableProps {
  partners?: ApiPartner[]
}

function formatOverlap(rate?: number | null) {
  if (rate === null || rate === undefined) return 'N.A.'
  return `${Math.round(rate)}%`
}

function formatRequestLabel(row: PartnerRow) {
  if (row.status === 'requested' && row.requestSentAt) {
    const d = new Date(row.requestSentAt)
    // simple date format: 12 Sep 2025 | 00:00 Hrs
    const opts: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
    const date = d.toLocaleDateString(undefined, opts)
    const time = d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    return `Request Sent\n${date} | ${time}`
  }
  return 'Request Partner'
}

/** Default overlap report when opening Compare from the overview (matches matrix: my customer vs partner customer). */
const DEFAULT_COMPARE_REPORT_TYPE = 'CUSTOMER_CUSTOMER'

function compareReportHref(partnerOrgId: string) {
  const q = new URLSearchParams({
    type: DEFAULT_COMPARE_REPORT_TYPE,
    partner: partnerOrgId
  })
  return `/partner-mapping/report?${q.toString()}`
}

function transformApiPartnersToRows(partners: ApiPartner[]): PartnerRow[] {
  return partners.map((partner) => {
    // Use the explicit dataSourceConnected flag from the API.
    // IMPORTANT: do NOT infer connection status from overlap counts —
    // zero overlaps does NOT mean the partner hasn't connected their CRM.
    const isConnected = partner.dataSourceConnected === true

    const hasOverlap =
      partner.aCustomerOverlapCount > 0 ||
      partner.aOpportunityOverlapCount > 0 ||
      partner.aProspectOverlapCount > 0

    const status: 'connected' | 'not_connected' | 'requested' = isConnected
      ? 'connected'
      : 'not_connected'

    let context = ''
    let details: string | undefined

    if (!isConnected) {
      context = "Your partner hasn't connected their data source yet."
      details =
        'To view overlap analytics and create reports, your partner needs to connect their data source.'
    } else if (hasOverlap) {
      const totalOverlaps =
        partner.aCustomerOverlapCount +
        partner.aOpportunityOverlapCount +
        partner.aProspectOverlapCount
      context = `${partner.organizationName} has ${totalOverlaps} overlapping records with you. This could unlock co-selling opportunities.`
    } else {
      // Both connected but no overlapping records found
      context = `Both you and ${partner.organizationName} have connected your data sources, but no overlapping records were found yet.`
    }

    return {
      id: partner.partnerOrganizationId.toString(),
      name: partner.organizationName,
      logoUrl: partner.logoUrl,
      overlapRate: partner.overlapRate ?? null,
      context,
      status,
      details
    }
  })
}

export default function OverViewTable({ partners = [] }: OverViewTableProps) {
  const [searchInput, setSearchInput] = useState<string | undefined>(undefined)
  const [organizationId, setOrganizationId] = useState<number | null>(null)
  const [requestStates, setRequestStates] = useState<
    Record<
      string,
      {
        text: string
        disabled: boolean
        loading: boolean
      }
    >
  >({})
  const rows = transformApiPartnersToRows(partners)

  // Get org id from Redux (avoids server-only calls)
  const currentOrgState = useSelector((state: RootState) => state.currentOrg)
  const organization = currentOrgState?.organization

  useEffect(() => {
    setOrganizationId(organization?.id ?? null)
  }, [organization])

  const createDefaultState = () => ({
    text: 'Request Partner',
    disabled: false,
    loading: false
  })

  const handleRequestPartner = async (partnerId: string) => {
    if (!organizationId) {
      showCustomToast(
        'Error',
        'Unable to determine your organization',
        'error',
        5000
      )
      return
    }

    setRequestStates((prev) => ({
      ...prev,
      [partnerId]: {
        ...(prev[partnerId] ?? createDefaultState()),
        disabled: true,
        loading: true
      }
    }))

    try {
      const response = await fetch(
        `/api/persona/notify?senderId=${organizationId}&notifyId=${partnerId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to notify partner')
      }

      setRequestStates((prev) => ({
        ...prev,
        [partnerId]: {
          text: 'Notified',
          disabled: true,
          loading: false
        }
      }))

      showCustomToast('Success', 'Notification sent', 'success', 5000)

      setTimeout(() => {
        setRequestStates((prev) => ({
          ...prev,
          [partnerId]: createDefaultState()
        }))
      }, 5000)
    } catch (error) {
      console.error('Error sending reminder:', error)
      showCustomToast('Error', 'Error sending reminder', 'error', 5000)
      setRequestStates((prev) => ({
        ...prev,
        [partnerId]: createDefaultState()
      }))
    }
  }

  const getRequestState = (partnerId: string) =>
    requestStates[partnerId] ?? createDefaultState()

  return (
    <div className='w-full'>
      <div className='w-1/3 pb-6 pt-2'>
        <SearchInput
          searchQuery={searchInput || ''}
          handleInput={(e: any) => setSearchInput(e.target.value)}
        />
      </div>
      {/* Desktop Table */}
      <div className='hidden md:block'>
        <div className='overflow-hidden rounded-lg border border-gray-100 bg-white'>
          <div className='grid grid-cols-12 gap-4 border-b bg-gray-50 px-6 py-3 text-sm text-gray-500'>
            <div className='col-span-3'>Partner Name</div>
            <div className='col-span-2'>Overlap Rate</div>
            <div className='col-span-5'>Context</div>
            <div className='col-span-2 pl-4'>Action</div>
          </div>

          {rows.map((r) => {
            const requestState = getRequestState(r.id)

            return (
              <div
                key={r.id}
                className={`grid grid-cols-12 items-center gap-4 border-b px-6 py-4 text-sm ${
                  r.overlapRate !== null
                    ? 'bg-white'
                    : 'bg-[#FEFCF5]' /* subtle zebra as screenshot */
                }`}
              >
                {/* Partner */}
                <div className='col-span-3 flex items-center gap-4'>
                  {/* Logo */}
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center'>
                    <Image
                      src={r.logoUrl || GetBeeLogo}
                      alt={`${r.name} logo`}
                      className='h-8 w-8 rounded-full object-cover'
                      width={32}
                      height={32}
                    />
                  </div>

                  <div className='flex flex-col'>
                    <span className='font-medium text-gray-800'>{r.name}</span>
                  </div>
                </div>

                {/* Overlap */}
                <div className='col-span-2'>{formatOverlap(r.overlapRate)}</div>

                {/* Context */}
                <div className='col-span-5'>
                  <p className='text-sm leading-relaxed'>{r.context}</p>
                  {r.overlapRate === null && (
                    <p className='text-sm leading-relaxed text-gray-500'>
                      {r.details}
                    </p>
                  )}
                </div>

                {/* Action */}
                <div className='col-span-2 flex pl-4'>
                  {r.status === 'connected' ? (
                    <Button
                      variant='primary'
                      size='sm'
                      asChild
                      aria-label={`Compare ${r.name}`}
                    >
                      <Link href={compareReportHref(r.id)}>Compare</Link>
                    </Button>
                  ) : r.status === 'requested' ? (
                    <div className='flex flex-col items-start gap-1'>
                      <div>Request Sent</div>
                      {r.requestSentAt && (
                        <span className='whitespace-pre text-xs text-gray-400'>
                          {r.requestSentAt}
                        </span>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant='primary'
                      size='sm'
                      className='disabled:pointer-events-none disabled:cursor-not-allowed'
                      aria-label={`Request partner ${r.name}`}
                      onClick={() => handleRequestPartner(r.id)}
                      disabled={requestState.disabled || requestState.loading}
                    >
                      {requestState.loading ? 'Sending...' : requestState.text}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile / Small screens: stacked rows */}
      <div className='space-y-3 md:hidden'>
        {rows.map((r) => {
          const requestState = getRequestState(r.id)

          return (
            <div
              key={r.id}
              className='rounded-lg border border-gray-100 bg-white p-4 shadow-sm'
            >
              <div className='flex items-start gap-3'>
                <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100'>
                  <Image
                    src={r.logoUrl || GetBeeLogo}
                    alt={`${r.name} logo`}
                    className='h-8 w-8 rounded-full object-cover'
                    width={32}
                    height={32}
                  />
                </div>

                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='font-medium text-gray-800'>{r.name}</div>
                      <div className='text-xs text-gray-400'>
                        Overlap Rate:{' '}
                        <span className='ml-1 text-gray-700'>
                          {formatOverlap(r.overlapRate)}
                        </span>
                      </div>
                    </div>

                    <div className='flex-shrink-0'>
                      {r.status === 'connected' ? (
                        <Button
                          variant='primary'
                          size='sm'
                          asChild
                          aria-label={`Compare ${r.name}`}
                        >
                          <Link href={compareReportHref(r.id)}>Compare</Link>
                        </Button>
                      ) : r.status === 'requested' ? (
                        <div className='text-right'>
                          <Button
                            variant='primary'
                            size='sm'
                            disabled
                            className='disabled:pointer-events-none disabled:cursor-not-allowed'
                          >
                            Request Sent
                          </Button>
                          {r.requestSentAt && (
                            <div className='mt-1 text-xs text-gray-400'>
                              {r.requestSentAt}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant='primary'
                          size='sm'
                          className='disabled:pointer-events-none disabled:cursor-not-allowed'
                          onClick={() => handleRequestPartner(r.id)}
                          disabled={
                            requestState.disabled || requestState.loading
                          }
                        >
                          {requestState.loading
                            ? 'Sending...'
                            : requestState.text}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className='mt-3 text-sm text-gray-600'>
                    <p>{r.context}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
