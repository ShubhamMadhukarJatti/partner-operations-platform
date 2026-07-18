'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useOverlapMyRecordsByOrgId,
  useReportCountByOrgId,
  useReportHistoryByOrgId
} from '@/http-hooks/partner-mapping-no-auth-org'
import { Info } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AccountMappingEmptyState from '@/app/partner-portal/_components/AccountMappingEmptyState'

const PARTNER_MAPPING_BASE = '/partner-portal/partner-mapping'

/**
 * Partner portal partner-mapping v2: orgId-based no/auth APIs.
 * Same UI as partner-portal/partner-mapping (header, metrics, tabs, table form).
 */
export default function PartnerPortalPartnerMappingV2Page() {
  const router = useRouter()
  const [activeSubTab, setActiveSubTab] = useState('overview')
  const [orgId, setOrgId] = useState<string | null>(null)

  const { data: overlapData, isLoading: overlapLoading } =
    useOverlapMyRecordsByOrgId(orgId)
  const { data: reportCountData, isLoading: reportCountLoading } =
    useReportCountByOrgId(orgId)
  const { data: reportHistoryData, isLoading: reportHistoryLoading } =
    useReportHistoryByOrgId(orgId)

  useEffect(() => {
    let cancelled = false
    const loadOrgId = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        const data = await res.json().catch(() => ({}))
        const uid = data?.user?.uid
        if (!cancelled && uid) setOrgId(uid)
      } catch {
        if (!cancelled) setOrgId(null)
      }
    }
    loadOrgId()
    return () => {
      cancelled = true
    }
  }, [])

  // Overlap my/records API returns array of { id, userId, source, fields: [...] }
  const overlapRecordsArray = Array.isArray(overlapData) ? overlapData : []
  const allFieldsFromRecords = overlapRecordsArray.flatMap(
    (r: any) => r?.fields ?? []
  )
  const totalRecordsCount = allFieldsFromRecords.length
  const hasOverlapRecords = overlapRecordsArray.length > 0

  const activePartners =
    overlapData != null &&
    typeof overlapData === 'object' &&
    !Array.isArray(overlapData) &&
    'active_partners' in overlapData
      ? String((overlapData as any).active_partners ?? 'N.A.')
      : hasOverlapRecords
        ? String(overlapRecordsArray.length)
        : 'N.A.'
  const reportCount =
    reportCountData?.data != null
      ? String(reportCountData.data)
      : reportCountData?.count != null
        ? String(reportCountData.count)
        : 'N.A.'
  const totalOverlaps =
    overlapData != null &&
    typeof overlapData === 'object' &&
    !Array.isArray(overlapData) &&
    'total_overlaps' in overlapData
      ? String((overlapData as any).total_overlaps ?? 'N.A.')
      : hasOverlapRecords
        ? String(totalRecordsCount)
        : 'N.A.'
  const totalOverlapsRate =
    overlapData != null &&
    typeof overlapData === 'object' &&
    !Array.isArray(overlapData) &&
    'total_overlaps_rate' in overlapData
      ? (overlapData as any).total_overlaps_rate != null
        ? `${(overlapData as any).total_overlaps_rate}%`
        : 'N.A.'
      : 'N.A.'

  const metrics = [
    { title: 'Active Partners', value: activePartners },
    { title: 'Total Overlaps', value: totalOverlaps },
    { title: 'Avg. Overlap Rate', value: totalOverlapsRate },
    { title: 'Reports Generated', value: reportCount }
  ]

  const navTabs = [
    { name: 'Overview', value: 'overview' },
    { name: 'Matrix Comparison', value: 'matrix' },
    { name: 'Reports History', value: 'history' }
  ]

  const myPartners =
    overlapData != null &&
    typeof overlapData === 'object' &&
    !Array.isArray(overlapData) &&
    Array.isArray((overlapData as any).my_partners)
      ? (overlapData as any).my_partners
      : []
  const hasOverlapData =
    hasOverlapRecords ||
    (overlapData != null &&
      typeof overlapData === 'object' &&
      !Array.isArray(overlapData) &&
      (myPartners.length > 0 || (overlapData as any).total_overlaps != null))

  const isLoading = overlapLoading || reportCountLoading || reportHistoryLoading

  if (!orgId && !isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='rounded-xl border border-gray-200 bg-white p-8 text-center'>
          <p className='text-sm text-gray-600'>
            Session not found. Please log in to the partner portal.
          </p>
          <Button
            className='mt-4'
            variant='outline'
            onClick={() => router.push('/partner-portal/login')}
          >
            Go to login
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='flex h-[50vh] items-center justify-center bg-gray-50'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='border-b border-gray-200 bg-white px-4 py-3'>
        <div className='mx-auto flex max-w-6xl items-center justify-between'>
          <Link
            href='/partner-portal/dashboard'
            className='text-sm font-medium text-[#3E50F7] hover:underline'
          >
            ← Back to Partner Portal
          </Link>
          <span className='text-sm font-medium text-gray-600'>
            Account Mapping
          </span>
        </div>
      </header>

      <div className='mx-auto max-w-6xl space-y-4 p-4'>
        <p className='text-sm text-gray-500'>
          Submit and measure deals at one place
        </p>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {metrics.map((m, i) => (
            <Card key={i} className='rounded-2xl shadow-none'>
              <CardContent className='flex flex-col items-start p-4'>
                <div className='mb-1 flex items-center gap-1'>
                  <p className='text-sm text-gray-500'>{m.title}</p>
                  <Info className='h-3.5 w-3.5 text-gray-400' />
                </div>
                <div className='flex items-center gap-2'>
                  <p
                    className={`text-2xl font-semibold ${
                      m.value === 'N.A.' ? 'text-[#ADB5BD]' : 'text-gray-900'
                    }`}
                  >
                    {m.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='w-full'>
          <Tabs
            value={activeSubTab}
            onValueChange={setActiveSubTab}
            className='w-full'
          >
            <TabsList className='flex w-full justify-start rounded-none border-b border-gray-200 bg-white'>
              {navTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className='rounded-lg px-4 text-sm font-semibold text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-[#3E50F7] data-[state=active]:text-[#3E50F7]'
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className='w-full pt-4'>
              <TabsContent value='overview' className='mt-0'>
                <div className='rounded-xl border border-gray-200 bg-white p-6'>
                  {hasOverlapRecords ? (
                    <>
                      <p className='mb-4 text-sm text-gray-600'>
                        Your data source is connected. My records (
                        {totalRecordsCount} contacts).
                      </p>
                      <div className='overflow-hidden rounded-lg border border-gray-100'>
                        <div className='grid grid-cols-12 gap-4 border-b bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600'>
                          <div className='col-span-2'>Name</div>
                          <div className='col-span-2'>Company</div>
                          <div className='col-span-3'>Email</div>
                          <div className='col-span-2'>Domain</div>
                          <div className='col-span-3'>Creation Date</div>
                        </div>
                        {allFieldsFromRecords.map((row: any, idx: number) => (
                          <div
                            key={row?.id ?? idx}
                            className='grid grid-cols-12 items-center gap-4 border-b border-gray-100 px-4 py-3 text-sm last:border-b-0'
                          >
                            <div className='col-span-2 truncate text-gray-800'>
                              {row?.name ?? '-'}
                            </div>
                            <div className='col-span-2 truncate text-gray-600'>
                              {row?.companyName ?? '-'}
                            </div>
                            <div className='col-span-3 truncate text-gray-600'>
                              {row?.contactEmail ?? '-'}
                            </div>
                            <div className='col-span-2 truncate text-gray-600'>
                              {row?.domain ?? '-'}
                            </div>
                            <div className='col-span-3 text-gray-600'>
                              {row?.creationDate
                                ? new Date(
                                    row.creationDate
                                  ).toLocaleDateString()
                                : '-'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : hasOverlapData && myPartners.length > 0 ? (
                    <>
                      <p className='mb-4 text-sm text-gray-600'>
                        Your data source is connected. Partners and overlap
                        overview.
                      </p>
                      <div className='overflow-hidden rounded-lg border border-gray-100 bg-white'>
                        <div className='grid grid-cols-12 gap-4 border-b bg-gray-50 px-6 py-3 text-sm text-gray-500'>
                          <div className='col-span-4'>Partner Name</div>
                          <div className='col-span-2'>Overlap Rate</div>
                          <div className='col-span-2'>Customer Overlap</div>
                          <div className='col-span-2'>Opportunity Overlap</div>
                          <div className='col-span-2'>Prospect Overlap</div>
                        </div>
                        {myPartners.map((partner: any) => (
                          <div
                            key={
                              partner.partnerOrganizationId ??
                              partner.organizationName
                            }
                            className='grid grid-cols-12 items-center gap-4 border-b bg-white px-6 py-4 text-sm last:border-b-0'
                          >
                            <div className='col-span-4 flex items-center gap-3'>
                              {partner.logoUrl ? (
                                <img
                                  src={partner.logoUrl}
                                  alt=''
                                  className='h-8 w-8 rounded-full object-cover'
                                />
                              ) : (
                                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500'>
                                  {(partner.organizationName ?? 'P').charAt(0)}
                                </div>
                              )}
                              <span className='font-medium text-gray-800'>
                                {partner.organizationName ?? 'Partner'}
                              </span>
                            </div>
                            <div className='col-span-2'>
                              {partner.overlapRate != null
                                ? `${partner.overlapRate}%`
                                : 'N.A.'}
                            </div>
                            <div className='col-span-2'>
                              {partner.aCustomerOverlapCount ?? 0}
                            </div>
                            <div className='col-span-2'>
                              {partner.aOpportunityOverlapCount ?? 0}
                            </div>
                            <div className='col-span-2'>
                              {partner.aProspectOverlapCount ?? 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className='text-sm text-gray-600'>
                        Your data source is connected. Use Connect CRM or other
                        ways to add more data.
                      </p>
                      <AccountMappingEmptyState
                        onCreateDataSource={() =>
                          router.push(`${PARTNER_MAPPING_BASE}/connect-crm`)
                        }
                      />
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value='matrix' className='mt-0'>
                <div className='rounded-xl border border-gray-200 bg-white p-6'>
                  <p className='text-sm text-gray-500'>
                    Matrix comparison will be available after connecting your
                    data source.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value='history' className='mt-0'>
                <div className='rounded-xl border border-gray-200 bg-white p-6'>
                  <p className='mb-4 text-sm font-medium text-gray-700'>
                    Reports history
                  </p>
                  {reportHistoryLoading ? (
                    <p className='text-sm text-gray-500'>
                      Loading report history...
                    </p>
                  ) : reportHistoryData?.data?.length ? (
                    <>
                      <div className='hidden md:block'>
                        <div className='overflow-hidden rounded-lg border border-gray-100'>
                          <div className='grid grid-cols-12 gap-4 border-b bg-gray-50 px-6 py-3 text-sm text-gray-500'>
                            <div className='col-span-3'>Partner Name</div>
                            <div className='col-span-2'>Created on</div>
                            <div className='col-span-2'>Your Matrix</div>
                            <div className='col-span-2'>
                              Partner&apos;s Matrix
                            </div>
                            <div className='col-span-1'>Overlap</div>
                            <div className='col-span-2 pl-4'>Report</div>
                          </div>
                          {reportHistoryData.data.map((item: any) => (
                            <div
                              key={item.id}
                              className='grid grid-cols-12 items-center gap-4 border-b bg-white px-6 py-4 text-sm last:border-b-0'
                            >
                              <div className='col-span-3 flex items-center gap-3'>
                                {item.partnerOrganization?.partnerLogoUrl ? (
                                  <img
                                    src={
                                      item.partnerOrganization.partnerLogoUrl
                                    }
                                    alt=''
                                    className='h-8 w-8 rounded-full object-cover'
                                  />
                                ) : (
                                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500'>
                                    {(
                                      item.partnerOrganization?.partnerName ??
                                      'P'
                                    ).charAt(0)}
                                  </div>
                                )}
                                <span className='font-medium text-gray-800'>
                                  {item.partnerOrganization?.partnerName ??
                                    'Partner'}
                                </span>
                              </div>
                              <div className='col-span-2'>-</div>
                              <div className='col-span-2'>
                                {item.yourMatrix ?? '-'}
                              </div>
                              <div className='col-span-2'>
                                {item.partnerMatrix ?? '-'}
                              </div>
                              <div className='col-span-1 pl-2'>
                                {item.overlapCount ?? 0}
                              </div>
                              <div className='col-span-2 pl-4'>
                                {item.reportCount ?? 0}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className='space-y-3 md:hidden'>
                        {reportHistoryData.data.map((item: any) => (
                          <div
                            key={item.id}
                            className='rounded-lg border border-gray-100 bg-white p-4 shadow-sm'
                          >
                            <div className='font-medium text-gray-800'>
                              {item.partnerOrganization?.partnerName ??
                                'Partner'}
                            </div>
                            <div className='mt-1 text-xs text-gray-500'>
                              Your Matrix:{' '}
                              <span className='text-gray-700'>
                                {item.yourMatrix ?? '-'}
                              </span>
                            </div>
                            <div className='mt-1 text-xs text-gray-500'>
                              Partner&apos;s Matrix:{' '}
                              <span className='text-gray-700'>
                                {item.partnerMatrix ?? '-'}
                              </span>
                            </div>
                            <div className='mt-1 text-xs text-gray-500'>
                              Overlap:{' '}
                              <span className='text-gray-700'>
                                {item.overlapCount ?? 0}
                              </span>
                            </div>
                            <div className='mt-1 text-xs text-gray-500'>
                              Report:{' '}
                              <span className='text-gray-700'>
                                {item.reportCount ?? 0}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className='text-sm text-gray-500'>
                      No report history yet. Connect your data source to
                      generate reports.
                    </p>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
