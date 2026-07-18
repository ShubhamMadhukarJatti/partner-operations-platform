'use client'

// 5 minutes
import React, { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useGetPartnerReport } from '@/http-hooks/partner-report'
import { ArrowLeft, Search } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import { LoadingOverlay } from '../_components/LoadingOverlay'
import SharedAccountsTable from '../_components/SharedAccountsTable'
import { useGetSharedAccounts } from '../api'

export const maxDuration = 300

function firstNonEmptyString(
  ...candidates: Array<unknown>
): string | undefined {
  for (const c of candidates) {
    if (c == null) continue
    const s = String(c).trim()
    if (s !== '' && s !== 'undefined' && s !== 'null') return s
  }
  return undefined
}

function partnerOrgIdFromRecord(
  obj: unknown,
  keys: string[]
): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined
  const rec = obj as Record<string, unknown>
  for (const k of keys) {
    const v = rec[k]
    const s = firstNonEmptyString(v)
    if (s) return s
  }
  return undefined
}

const validType = [
  'CUSTOMER_CUSTOMER',
  'CUSTOMER_PROSPECT',
  'CUSTOMER_OPPORTUNITY',
  'PROSPECT_CUSTOMER',
  'PROSPECT_PROSPECT',
  'PROSPECT_OPPORTUNITY',
  'OPPORTUNITY_CUSTOMER',
  'OPPORTUNITY_PROSPECT',
  'OPPORTUNITY_OPPORTUNITY'
]

const ReportPageInner = () => {
  const params = useSearchParams()
  const type = params.get('type') as string
  const router = useRouter()

  const partnerFromSearch = useMemo(() => {
    for (const key of ['partner', 'partnerId', 'partnerOrgId'] as const) {
      const v = params.get(key)?.trim()
      if (v) return v
    }
    return undefined
  }, [params])

  const partnerIdForPersona = useMemo(() => {
    if (!partnerFromSearch) return null
    const n = Number(partnerFromSearch)
    return Number.isFinite(n) ? n : null
  }, [partnerFromSearch])

  const { data } = useGetPartnerReport(partnerIdForPersona, type) as {
    data: any
  }

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (type && !validType.includes(type)) {
      router.replace('/partner-mapping')
    }
  }, [type, router])

  useEffect(() => {
    setPage(1)
  }, [partnerFromSearch, pageSize])

  const partnerOrgIdForSharedQuery = useMemo(() => {
    if (partnerFromSearch) return partnerFromSearch
    return partnerOrgIdFromRecord(data, [
      'partnerOrganizationId',
      'partnerId',
      'partnerOrgId'
    ])
  }, [partnerFromSearch, data])

  const {
    data: sharedAccountData,
    isLoading,
    isError
  } = useGetSharedAccounts({
    page,
    size: pageSize,
    partnerOrgId: partnerOrgIdForSharedQuery
  })

  const cosellPartnerOrgId = useMemo(() => {
    const fromUrlOrPersona = firstNonEmptyString(
      partnerFromSearch,
      partnerOrgIdFromRecord(data, [
        'partnerOrganizationId',
        'partnerId',
        'partnerOrgId'
      ])
    )
    if (fromUrlOrPersona) return fromUrlOrPersona
    return partnerOrgIdFromRecord(sharedAccountData?.data, [
      'partnerOrganizationId',
      'partnerOrgId',
      'partnerId'
    ])
  }, [partnerFromSearch, data, sharedAccountData])

  const meta = sharedAccountData?.data
  const totalElements = meta?.totalElements ?? 0
  const totalPages = Math.max(1, meta?.totalPages ?? 1)

  if (!type || !validType.includes(type)) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#F9FAFB]'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-[#3E50F7] border-t-transparent' />
      </div>
    )
  }

  return (
    <GradientPageBackground className='min-h-screen'>
      <div className='relative z-[1] px-5 pb-10 pt-6 md:px-6'>
        <header className='mb-6 flex flex-col gap-2'>
          <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4'>
            <div className='flex min-w-0 flex-1 items-center gap-3'>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-9 w-9 shrink-0 text-[#4D5C78] hover:bg-[#F3F4F6] hover:text-[#2A3241]'
                onClick={() => router.back()}
                aria-label='Go back'
              >
                <ArrowLeft className='h-5 w-5' aria-hidden />
              </Button>
              <Breadcrumb className='min-w-0'>
                <BreadcrumbList className='flex-nowrap items-center gap-1.5 sm:gap-2'>
                  <BreadcrumbItem className='shrink-0'>
                    <BreadcrumbLink asChild>
                      <Link
                        href='/partner-mapping'
                        className='text-[13px] font-medium text-[#7688A8] transition-colors hover:text-[#3E50F7] sm:text-sm'
                      >
                        Partner Mapping
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className='shrink-0 text-[#C5D4F0] [&>svg]:text-[#C5D4F0]' />
                  <BreadcrumbItem className='min-w-0'>
                    <BreadcrumbPage className='truncate text-[13px] font-semibold text-[#2A3241] sm:text-sm'>
                      Shared Accounts - Prioritised
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className='flex min-w-0 items-center md:ml-auto md:shrink-0 md:justify-end'>
              <label className='sr-only' htmlFor='shared-accounts-search'>
                Search accounts
              </label>
              <div
                className='flex h-10 w-full min-w-0 items-center gap-2.5 rounded-md border border-[#E4E7EE] bg-white pl-4 pr-3 md:w-[min(360px,100%)]'
                style={{ boxShadow: '0 1px 2px rgba(0, 20, 40, 0.04)' }}
              >
                <Search
                  className='h-5 w-5 shrink-0 text-[#4D5C78]'
                  aria-hidden
                />
                <input
                  id='shared-accounts-search'
                  type='search'
                  placeholder='Search overlaps'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-[#2A3241] outline-none placeholder:text-[#4D5C78]'
                />
              </div>
            </div>
          </div>
          <p className='pl-12 text-sm leading-snug text-[#4D5C78]'>
            {data?.organizationName} Deals vs. {data?.partnerName} Deals
          </p>
        </header>

        <div className='relative flex min-h-[400px] items-center justify-center'>
          {isLoading ? (
            <LoadingOverlay />
          ) : (
            <SharedAccountsTable
              data={sharedAccountData}
              isLoading={isLoading}
              isError={isError}
              searchQuery={searchQuery}
              page={page}
              totalElements={totalElements}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              cosellPartnerOrgId={cosellPartnerOrgId}
              cosellReportType={type}
              cosellWorkspaceSubtitle={
                data?.organizationName || data?.partnerName
                  ? `${data?.organizationName ?? 'Your organization'} — ${data?.partnerName ?? 'Partner'} Co-sell`
                  : undefined
              }
              reportPartnerName={data?.partnerName}
            />
          )}
        </div>
      </div>
    </GradientPageBackground>
  )
}

const ReportPage = () => {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent' />
        </div>
      }
    >
      <ReportPageInner />
    </Suspense>
  )
}

export default ReportPage
