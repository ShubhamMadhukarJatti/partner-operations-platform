'use client'

import React, { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  getLatestOverlapVersionId,
  sortOverlapVersionsNewestFirst,
  useOverlapRecordVersions,
  usePersonaDetailsByVersion,
  useVersionedOverlapRecords
} from '@/http-hooks/persona-versions'
import { RootState } from '@/redux/store'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Building,
  CalendarDays,
  Clock,
  History,
  Pencil,
  RefreshCw,
  Trash2,
  TrendingUp,
  User
} from 'lucide-react'
import { useSelector } from 'react-redux'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { showCustomToast } from '@/components/custom-toast'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

const standardLabels: Record<string, string> = {
  firstName: 'First Name',
  lastName: 'Last Name',
  fullName: 'Full Name',
  companyName: 'Company Name',
  name: 'Name',
  contactEmail: 'Email',
  domain: 'Website',
  website: 'Website',
  dealStage: 'Deal Stage',
  dealName: 'Deal Name',
  dealname: 'Deal Name',
  creationDate: 'Creation Date',
  closeDate: 'Close Date',
  subscribed: 'Subscribed',
  ticketSize: 'Ticket Size',
  industry: 'Industry',
  companySize: 'Company Size',
  country: 'Country',
  countryGeography: 'Country',
  linkedinUrl: 'LinkedIn URL',
  contactLinkedinUrl: 'Contact LinkedIn URL',
  annualRevenue: 'Annual Revenue',
  description: 'Description',
  companyPhone: 'Company Phone',
  contactPhone: 'Contact Phone',
  phone: 'Phone',
  city: 'City',
  jobTitle: 'Job Title',
  leadStatus: 'Lead Status',
  lastActivityDate: 'Last Activity Date',
  contactOwner: 'Contact Owner',
  dealOwner: 'Deal Owner',
  amountAcv: 'Amount / ACV',
  pipeline: 'Pipeline',
  dealType: 'Deal Type',
  updatedAt: 'Last Modified',
  updatedBy: 'Modified By'
}

function getColumnLabel(key: string, mapping?: Record<string, string> | null) {
  if (standardLabels[key]) return standardLabels[key]
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}

const VersionSelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SelectItem> & { v: any }
>(({ v, ...props }, ref) => {
  const { data: details } = usePersonaDetailsByVersion(v.versionId, true)
  const rawDate =
    v.creationTimestamp || v.creationDate || details?.creationTimestamp
  const formattedDate = rawDate
    ? format(new Date(rawDate), 'h:mm a, d MMM')
    : ''

  return (
    <SelectItem ref={ref} {...props}>
      <div className='flex flex-col text-left'>
        <span>
          Version {v.version}{' '}
          {v.name
            ? `: ${v.name}`
            : `: ${String(v.versionId || '')
                .substring(0, 8)
                .toUpperCase()}`}
        </span>
        {formattedDate ? (
          <span className='text-[12px] font-normal text-[#6B7280]'>
            {formattedDate}
          </span>
        ) : (
          <Skeleton className='mt-1 h-3 w-20 bg-gray-200' />
        )}
      </div>
    </SelectItem>
  )
})
VersionSelectItem.displayName = 'VersionSelectItem'

function VersionHistoryContent() {
  const searchParams = useSearchParams()
  const initialTab =
    (searchParams.get('tab') as 'PROSPECT' | 'CUSTOMER' | 'OPPORTUNITY') ||
    'PROSPECT'
  const initialVersion = searchParams.get('version') || ''

  const organization = useSelector(
    (state: RootState) => state.currentOrg?.organization
  )
  const [activeTab, setActiveTab] = useState<
    'PROSPECT' | 'CUSTOMER' | 'OPPORTUNITY'
  >(initialTab)

  // Per-tab selected version state
  const [prospectVersionNum, setProspectVersionNum] = useState<string>(
    initialTab === 'PROSPECT' ? initialVersion : ''
  )
  const [customerVersionNum, setCustomerVersionNum] = useState<string>(
    initialTab === 'CUSTOMER' ? initialVersion : ''
  )
  const [opportunityVersionNum, setOpportunityVersionNum] = useState<string>(
    initialTab === 'OPPORTUNITY' ? initialVersion : ''
  )

  // Fetch versions independently for each record type
  const { data: prospectVersionsRes, isLoading: isLoadingProspectVersions } =
    useOverlapRecordVersions(organization?.id, !!organization?.id, 'PROSPECT')
  const { data: customerVersionsRes, isLoading: isLoadingCustomerVersions } =
    useOverlapRecordVersions(organization?.id, !!organization?.id, 'CUSTOMER')
  const {
    data: opportunityVersionsRes,
    isLoading: isLoadingOpportunityVersions
  } = useOverlapRecordVersions(
    organization?.id,
    !!organization?.id,
    'OPPORTUNITY'
  )

  // Sorted version lists per tab
  const prospectVersions = useMemo(
    () => sortOverlapVersionsNewestFirst(prospectVersionsRes?.data || []),
    [prospectVersionsRes]
  )
  const customerVersions = useMemo(
    () => sortOverlapVersionsNewestFirst(customerVersionsRes?.data || []),
    [customerVersionsRes]
  )
  const opportunityVersions = useMemo(
    () => sortOverlapVersionsNewestFirst(opportunityVersionsRes?.data || []),
    [opportunityVersionsRes]
  )

  // Auto-select the latest version for each tab independently
  useEffect(() => {
    if (prospectVersions.length > 0 && !prospectVersionNum) {
      setProspectVersionNum(prospectVersions[0].version.toString())
    }
  }, [prospectVersions])

  useEffect(() => {
    if (customerVersions.length > 0 && !customerVersionNum) {
      setCustomerVersionNum(customerVersions[0].version.toString())
    }
  }, [customerVersions])

  useEffect(() => {
    if (opportunityVersions.length > 0 && !opportunityVersionNum) {
      setOpportunityVersionNum(opportunityVersions[0].version.toString())
    }
  }, [opportunityVersions])

  // Derive the active version selector / versions list based on the active tab
  const activeVersionNum =
    activeTab === 'PROSPECT'
      ? prospectVersionNum
      : activeTab === 'CUSTOMER'
        ? customerVersionNum
        : opportunityVersionNum

  const setActiveVersionNum = (val: string) => {
    if (activeTab === 'PROSPECT') setProspectVersionNum(val)
    else if (activeTab === 'CUSTOMER') setCustomerVersionNum(val)
    else setOpportunityVersionNum(val)
  }

  const activeTabVersions =
    activeTab === 'PROSPECT'
      ? prospectVersions
      : activeTab === 'CUSTOMER'
        ? customerVersions
        : opportunityVersions

  // Resolve versionId for the selected version in the active tab
  const activeVersionId = useMemo(() => {
    if (!activeVersionNum) return null
    const verNum = Number(activeVersionNum)
    const match = activeTabVersions.find((v) => v.version === verNum)
    return match ? match.versionId : null
  }, [activeVersionNum, activeTabVersions])

  // Fetch detailed info for the selected version (specifically to get creationTimestamp)
  const { data: versionDetails } = usePersonaDetailsByVersion(
    activeVersionId,
    activeVersionId != null
  )

  // Fetch table data based on active tab and resolved active version ID
  const { data: recordsData, isLoading: isLoadingRecords } =
    useVersionedOverlapRecords(
      activeTab,
      activeVersionId,
      activeVersionId != null
    )

  // Normalize backend response records (handles array wrapper, nested data fields, and field arrays)
  const displayRecords = useMemo(() => {
    const raw = recordsData as any
    if (!raw) return []

    let items: any[] = []
    if (Array.isArray(raw)) {
      items = raw
    } else if (Array.isArray(raw?.data)) {
      items = raw.data
    }

    const rows: any[] = []
    for (const item of items) {
      if (item && Array.isArray(item.fields)) {
        rows.push(...item.fields)
      } else if (item) {
        rows.push(item)
      }
    }
    return rows
  }, [recordsData])

  // Get currently logged-in user profile from cached react-query data
  const { data: authData } = useQuery<any>({
    queryKey: ['auth-data'],
    staleTime: Infinity
  })

  const userName = useMemo(() => {
    const profile = authData?.userProfile
    if (profile?.firstName) {
      return `${profile.firstName} ${profile.lastName || ''}`.trim()
    }
    return '—'
  }, [authData])

  const versionDate = useMemo(() => {
    const match = activeTabVersions.find((v) => v.versionId === activeVersionId)
    const timestamp =
      match?.creationTimestamp ||
      match?.creationDate ||
      versionDetails?.creationTimestamp
    if (!timestamp) return '—'
    try {
      return format(new Date(timestamp), 'dd MMM, yyyy')
    } catch {
      return '—'
    }
  }, [versionDetails, activeTabVersions, activeVersionId])

  const versionTime = useMemo(() => {
    const match = activeTabVersions.find((v) => v.versionId === activeVersionId)
    const timestamp =
      match?.creationTimestamp ||
      match?.creationDate ||
      versionDetails?.creationTimestamp
    if (!timestamp) return '—'
    try {
      return format(new Date(timestamp), 'hh:mm a')
    } catch {
      return '—'
    }
  }, [versionDetails, activeTabVersions, activeVersionId])

  const fieldToColumnMapping = useMemo(() => {
    const raw = recordsData as any
    if (Array.isArray(raw) && raw[0]?.fieldToColumnMapping) {
      return raw[0].fieldToColumnMapping
    }
    if (
      raw?.data &&
      Array.isArray(raw.data) &&
      raw.data[0]?.fieldToColumnMapping
    ) {
      return raw.data[0].fieldToColumnMapping
    }
    return null
  }, [recordsData])

  // Dynamic columns definition based on record properties (change logs vs standard preview records)
  const columns = useMemo(() => {
    const firstRow = displayRecords[0]
    const isChangeLog =
      firstRow &&
      ('oldValue' in firstRow || 'newValue' in firstRow || 'field' in firstRow)

    if (isChangeLog) {
      return [
        {
          key: 'field',
          label: 'Record Changed',
          isBadge: true,
          badgeBg: 'bg-[#E5EDFF]'
        },
        {
          key: 'oldValue',
          label: 'From',
          isBadge: true,
          badgeBg: 'bg-[#E5EDFF]'
        },
        {
          key: 'newValue',
          label: 'To',
          isBadge: true,
          badgeBg: 'bg-[#FFEACC]'
        },
        { key: 'updatedAt', label: 'Last Modified', isDate: true },
        { key: 'updatedBy', label: 'Modified By' }
      ]
    }

    if (displayRecords.length === 0) {
      return []
    }

    const META_KEYS = new Set([
      'id',
      'creationTimestamp',
      'lastUpdatedTimestamp',
      'version',
      'versionId',
      'organizationId',
      'recordType',
      'source',
      'frequency',
      'googleSheetLink',
      'fileName',
      'fieldToColumnMapping'
    ])

    const keySet = new Set<string>()
    for (const row of displayRecords) {
      for (const [k, v] of Object.entries(row)) {
        if (
          !META_KEYS.has(k) &&
          v !== null &&
          v !== undefined &&
          v !== '' &&
          v !== 'NONE' &&
          v !== 'dont_import'
        ) {
          keySet.add(k)
        }
      }
    }

    return Array.from(keySet).map((key) => ({
      key,
      label: getColumnLabel(key, fieldToColumnMapping)
    }))
  }, [displayRecords, fieldToColumnMapping, activeTab])

  // Custom renderer for cell contents supporting badges, dates, and dynamic user fallbacks
  const renderCell = (record: any, col: any) => {
    let val = record[col.key]
    if (
      val &&
      typeof val === 'string' &&
      val.toLowerCase().trim() === 'unknown'
    ) {
      val = null
    }

    if (col.isDate) {
      const dateVal =
        val || record.creationTimestamp || versionDetails?.creationTimestamp
      if (!dateVal) return `${versionDate} | ${versionTime}`
      try {
        return format(new Date(dateVal), 'dd MMM, yyyy | hh:mm a')
      } catch {
        return `${versionDate} | ${versionTime}`
      }
    }

    if (col.key === 'updatedBy') {
      return val || userName
    }

    if (col.isBadge) {
      return (
        <span
          className={`inline-flex items-center justify-center rounded-full px-3.5 py-1 text-xs font-medium text-[#4D5C78] ${col.badgeBg}`}
        >
          {val || '—'}
        </span>
      )
    }

    return (
      <span className='text-xs font-medium text-[#2A3241]'>
        {val !== null && val !== undefined ? String(val) : '—'}
      </span>
    )
  }

  return (
    <GradientPageBackground className='flex min-h-screen flex-col'>
      {/* Header Layout */}
      <div className='flex flex-col px-8 pt-7'>
        <div className='z-10 flex flex-col gap-1.5'>
          <Link
            href='/data-pipeline/insights'
            className='mb-2 flex w-fit items-center gap-1.5 text-sm font-bold text-[#4D5C78]'
          >
            <ArrowLeft className='h-[18px] w-[18px]' />
            Back
          </Link>
          <h1 className='text-2xl font-semibold leading-[34px] text-[#25224A]'>
            Version History
          </h1>
          <p className='text-sm font-normal leading-5 text-[#4D5C78]'>
            Generated based on your customer data
          </p>
        </div>

        {/* Version selector — left side */}
        <div className='mt-6 flex flex-col items-start gap-1'>
          <span className='text-[11px] font-bold uppercase tracking-wider text-[#4D5C78]'>
            SELECT THE VERSION
          </span>
          <Select value={activeVersionNum} onValueChange={setActiveVersionNum}>
            <SelectTrigger className='h-10 w-[300px] rounded-lg border-[#E4E7EE] bg-white font-medium text-[#2A3241] shadow-sm'>
              <div className='flex items-center gap-2'>
                <History className='h-4 w-4 text-[#64748B]' />
                <SelectValue placeholder='Select a version' />
              </div>
            </SelectTrigger>
            <SelectContent>
              {activeTabVersions.map((v) => (
                <VersionSelectItem
                  key={v.version}
                  value={v.version.toString()}
                  v={v}
                />
              ))}
              {activeTabVersions.length === 0 && (
                <SelectItem value='placeholder' disabled>
                  No versions yet
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Card */}
      <div className='mx-8 mb-12 mt-6 flex-1 rounded-xl border border-[#E4E7EE] bg-white p-6 shadow-sm'>
        {/* Card Header (Title + Unified Date/Time Pill) */}
        <div className='mb-6 flex flex-col gap-4'>
          <h2 className='text-2xl font-bold text-[#25224A]'>
            Version {activeVersionNum || '...'}{' '}
            {activeVersionNum &&
              (() => {
                const match = activeTabVersions.find(
                  (v) => v.version.toString() === activeVersionNum
                )
                return match
                  ? match.name
                    ? `: ${match.name}`
                    : `: ${String(match.versionId || '')
                        .substring(0, 8)
                        .toUpperCase()}`
                  : ''
              })()}
            {activeVersionId ? (
              <span className='ml-3 text-sm font-normal text-[#64748B]'>
                ID: {activeVersionId}
              </span>
            ) : null}
          </h2>

          <div className='flex w-fit items-center gap-4 rounded-full bg-[#EEF2FF] px-4 py-2 text-sm font-semibold text-[#4D5C78]'>
            <div className='flex items-center gap-1.5'>
              <CalendarDays className='h-[15px] w-[15px] text-[#4D5C78]' />
              <span>{versionDate}</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <Clock className='h-[15px] w-[15px] text-[#4D5C78]' />
              <span>{versionTime}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setActiveTab('PROSPECT')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition-all ${
              activeTab === 'PROSPECT'
                ? 'bg-[#25224A] text-white'
                : 'border border-[#E4E7EE] bg-white text-[#64748B] hover:bg-gray-50'
            }`}
          >
            <User className='h-[16px] w-[16px]' />
            Contacts
          </button>
          <button
            onClick={() => setActiveTab('CUSTOMER')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition-all ${
              activeTab === 'CUSTOMER'
                ? 'bg-[#25224A] text-white'
                : 'border border-[#E4E7EE] bg-white text-[#64748B] hover:bg-gray-50'
            }`}
          >
            <Building className='h-[16px] w-[16px]' />
            Companies
          </button>
          <button
            onClick={() => setActiveTab('OPPORTUNITY')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition-all ${
              activeTab === 'OPPORTUNITY'
                ? 'bg-[#25224A] text-white'
                : 'border border-[#E4E7EE] bg-white text-[#64748B] hover:bg-gray-50'
            }`}
          >
            <TrendingUp className='h-[16px] w-[16px]' />
            Deals
          </button>
        </div>

        {/* Table */}
        <div className='mt-6 overflow-hidden rounded-xl border border-[#E5E7EB]'>
          <table className='w-full text-left text-sm text-[#374151]'>
            <thead className='bg-[#EEF2FF] text-xs font-semibold text-[#374151]'>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className='px-6 py-3 uppercase tracking-wider'
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-[#F3F4F6] bg-white'>
              {displayRecords.length > 0 ? (
                displayRecords.map((record: any, idx: number) => (
                  <tr key={idx} className='transition-colors hover:bg-gray-50'>
                    {columns.map((col) => (
                      <td key={col.key} className='px-6 py-4'>
                        {renderCell(record, col)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className='px-6 py-12 text-center'
                  >
                    {isLoadingRecords ? (
                      <div className='flex flex-col gap-2'>
                        <Skeleton className='mx-auto h-4 w-48' />
                        <Skeleton className='mx-auto h-4 w-32' />
                      </div>
                    ) : (
                      <span className='text-sm text-[#64748B]'>
                        No records found for this version.
                      </span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </GradientPageBackground>
  )
}

export default function VersionHistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VersionHistoryContent />
    </Suspense>
  )
}
