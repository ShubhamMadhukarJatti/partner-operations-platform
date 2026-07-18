'use client'

import React, { Suspense, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { User } from 'iconsax-react'
import { ArrowLeft } from 'lucide-react'
import { CSVLink } from 'react-csv'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

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
] as const

type ReportType = (typeof validType)[number]

function isValidReportType(t: string | null): t is ReportType {
  return t != null && (validType as readonly string[]).includes(t)
}

type MatrixRowKey = 'A_CUSTOMERS' | 'A_OPPORTUNITIES' | 'A_PROSPECTS'
type MatrixColKey = 'B_CUSTOMERS' | 'B_OPPORTUNITIES' | 'B_PROSPECTS'

const typeToMatrixKeys = (
  type: string
): { a: MatrixRowKey; b: MatrixColKey } | null => {
  const parts = type.split('_')
  if (parts.length !== 2) return null
  const aMap: Record<string, MatrixRowKey> = {
    CUSTOMER: 'A_CUSTOMERS',
    OPPORTUNITY: 'A_OPPORTUNITIES',
    PROSPECT: 'A_PROSPECTS'
  }
  const bMap: Record<string, MatrixColKey> = {
    CUSTOMER: 'B_CUSTOMERS',
    OPPORTUNITY: 'B_OPPORTUNITIES',
    PROSPECT: 'B_PROSPECTS'
  }
  const a = aMap[parts[0]]
  const b = bMap[parts[1]]
  if (!a || !b) return null
  return { a, b }
}

const getNameCellClass = (
  index: number,
  total: number,
  type: number
): string => {
  let groupSize: number
  if (total <= 2) groupSize = 1
  else if (total <= 4) groupSize = 2
  else if (total <= 6) groupSize = 2
  else groupSize = Math.floor(total / 2)
  const group = Math.floor(index / groupSize)
  if (type === 1) {
    return group % 2 === 0
      ? 'bg-[#BAF5C8] text-[#153022]'
      : 'bg-[#FCE8AD] text-[#372D17]'
  }
  return group % 2 === 0
    ? 'bg-[#FCE1E1] text-[#1E1E1E]'
    : 'bg-[#F2E7FF] text-[#1E1E1E]'
}

type ReportRecord = {
  organization_record?: {
    id: number
    name: string
    companyName: string
    contactEmail: string
    domain: string
    creationDate: string
    [key: string]: unknown
  }
  partner_record?: {
    id: number
    name: string
    companyName: string
    contactEmail: string
    domain: string
    creationDate: string
    [key: string]: unknown
  }
}

function PartnerPortalReportInner() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') as string | null
  const partnerId = searchParams.get('partner')
  const router = useRouter()

  const [userId, setUserId] = useState<string | null>(null)
  const [organizationName, setOrganizationName] = useState<string>('')
  const [partnerName, setPartnerName] = useState<string>('')
  const [records, setRecords] = useState<ReportRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [csvData, setCsvData] = useState<string[][]>([])

  const partnerMappingBase = partnerId
    ? `/partner-portal/partner-mapping/${partnerId}`
    : '/partner-portal/partner-mapping'

  const loadReport = useCallback(async () => {
    if (!type || !partnerId || !isValidReportType(type)) {
      setError('Invalid report type or partner')
      setIsLoading(false)
      return
    }

    try {
      const meRes = await fetch('/api/auth/me', { credentials: 'include' })
      const meData = await meRes.json().catch(() => ({}))
      const uid = meData?.user?.uid ?? null
      if (!uid) {
        setError('User session not found')
        setIsLoading(false)
        return
      }

      setUserId(uid)

      const res = await fetch(
        `/api/persona/partner/data/${encodeURIComponent(uid)}?partnerId=${encodeURIComponent(partnerId)}`,
        { credentials: 'include' }
      )

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setError(
          (err?.error as string) ||
            (err?.message as string) ||
            'Failed to load report'
        )
        setIsLoading(false)
        return
      }

      const data = await res.json()
      const keys = typeToMatrixKeys(type)
      if (!keys || !data?.matrix?.[keys.a]?.[keys.b]) {
        setRecords([])
        setOrganizationName(data?.organizationName ?? 'Yours')
        setPartnerName(data?.partnerName ?? data?.organizationName ?? 'Partner')
        setIsLoading(false)
        return
      }

      const cell = data.matrix[keys.a][keys.b]
      const list = Array.isArray(cell?.records) ? cell.records : []
      setRecords(list)
      setOrganizationName(data?.organizationName ?? 'Yours')
      setPartnerName(data?.partnerName ?? data?.organizationName ?? 'Partner')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load report')
    } finally {
      setIsLoading(false)
    }
  }, [type, partnerId])

  useEffect(() => {
    loadReport()
  }, [loadReport])

  const handleExport = useCallback(() => {
    const headers = [
      'Account Name',
      'Account Website',
      `${organizationName}_Name`,
      `${partnerName}_Name`,
      `${organizationName}_Email`,
      `${partnerName}_Email`
    ]
    const rows = records
      .filter((record) =>
        selectedRows.includes(
          record?.organization_record?.id ?? record?.partner_record?.id ?? -1
        )
      )
      .map((record) => [
        record?.organization_record?.companyName ??
          record?.partner_record?.companyName ??
          '',
        record?.organization_record?.domain ??
          record?.partner_record?.domain ??
          '',
        record?.organization_record?.name ?? '',
        record?.partner_record?.name ?? '',
        record?.organization_record?.contactEmail ?? '',
        record?.partner_record?.contactEmail ?? ''
      ])
    return [headers, ...rows]
  }, [records, selectedRows, organizationName, partnerName])

  useEffect(() => {
    setCsvData(handleExport())
  }, [handleExport, selectedRows])

  const toggleCheckbox = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedRows.length === records.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(
        records.map(
          (r) => r?.organization_record?.id ?? r?.partner_record?.id ?? -1
        )
      )
    }
  }

  if (!type || !partnerId || !isValidReportType(type)) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#F9FAFB]'>
        <div className='text-center'>
          <p className='mb-2 text-red-600'>Invalid report</p>
          <Button
            variant='outline'
            onClick={() => router.push(partnerMappingBase)}
          >
            Back to Partner Mapping
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#F9FAFB]'>
        <div className='text-center'>
          <div className='mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent' />
          <p className='text-gray-600'>Loading report...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#F9FAFB]'>
        <div className='text-center'>
          <p className='mb-2 text-red-600'>{error}</p>
          <Button
            variant='outline'
            onClick={() => router.push(partnerMappingBase)}
          >
            Back to Partner Mapping
          </Button>
        </div>
      </div>
    )
  }

  const typeLabel =
    type === 'CUSTOMER_CUSTOMER'
      ? 'Customers'
      : type === 'CUSTOMER_PROSPECT'
        ? 'Customers vs. Prospects'
        : type === 'CUSTOMER_OPPORTUNITY'
          ? 'Customers vs. Opportunities'
          : type === 'PROSPECT_CUSTOMER'
            ? 'Prospects vs. Customers'
            : type === 'PROSPECT_PROSPECT'
              ? 'Prospects'
              : type === 'PROSPECT_OPPORTUNITY'
                ? 'Prospects vs. Opportunities'
                : type === 'OPPORTUNITY_CUSTOMER'
                  ? 'Opportunities vs. Customers'
                  : type === 'OPPORTUNITY_PROSPECT'
                    ? 'Opportunities vs. Prospects'
                    : type === 'OPPORTUNITY_OPPORTUNITY'
                      ? 'Opportunities'
                      : 'Records'

  return (
    <div className='min-h-screen bg-[#F9FAFB]'>
      <div className='flex items-center justify-between border-b border-gray-200 bg-white p-4'>
        <div className='flex items-center gap-2'>
          <Link href={partnerMappingBase}>
            <Button variant='primary' size='icon' aria-label='Go back'>
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className='text-xl font-bold text-[#1A202C]'>
            {organizationName} {typeLabel} vs. {partnerName} {typeLabel}
          </h1>
        </div>
        <CSVLink data={csvData} filename='overlap_report.csv'>
          <Button variant='primary' className='h-auto p-2'>
            Export
          </Button>
        </CSVLink>
      </div>
      <div className='p-4 md:p-6'>
        <div className='overflow-x-auto rounded-md border border-gray-200 bg-white'>
          <table className='w-full table-auto border-collapse text-left text-sm'>
            <thead>
              <tr className='bg-[#F4F4F4]'>
                <th className='border border-gray-200 px-3 py-2' />
                <th className='border border-gray-200 px-3 py-2' />
                <th className='border border-gray-200 px-3 py-2' />
                <th className='border border-gray-200 px-3 py-2' />
                <th className='border border-gray-200 px-3 py-2 text-center'>
                  <div className='flex items-center justify-center gap-2'>
                    <div className='h-3 w-3 rounded-[4px] bg-blue-600' /> Yours
                  </div>
                </th>
                <th className='border border-gray-200 px-3 py-2 text-center'>
                  <div className='flex items-center justify-center gap-2'>
                    <div className='h-3 w-3 rounded-[4px] bg-black' />{' '}
                    {partnerName}
                  </div>
                </th>
                <th className='border border-gray-200 px-3 py-2 text-center'>
                  <div className='flex items-center justify-center gap-2'>
                    <div className='h-3 w-3 rounded-[4px] bg-blue-600' /> Yours
                  </div>
                </th>
                <th className='border border-gray-200 px-3 py-2 text-center'>
                  <div className='flex items-center justify-center gap-2'>
                    <div className='h-3 w-3 rounded-[4px] bg-black' />{' '}
                    {partnerName}
                  </div>
                </th>
              </tr>
              <tr className='bg-[#F4F4F4]'>
                <th className='border border-gray-200 px-3 py-2'>
                  <Checkbox
                    checked={
                      records.length === 0
                        ? false
                        : selectedRows.length === records.length
                          ? true
                          : 'indeterminate'
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className='border border-gray-200 px-3 py-2'>Sno</th>
                <th className='border border-gray-200 px-3 py-2'>
                  Account name
                </th>
                <th className='border border-gray-200 px-3 py-2'>
                  Account website
                </th>
                <th className='border border-gray-200 px-3 py-2'>
                  Account owner
                </th>
                <th className='border border-gray-200 px-3 py-2'>
                  Account owner
                </th>
                <th className='border border-gray-200 px-3 py-2'>
                  Customer since
                </th>
                <th className='border border-gray-200 px-3 py-2'>
                  Customer since
                </th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className='border border-gray-200 px-3 py-6 text-center text-gray-500'
                  >
                    No records for this comparison.
                  </td>
                </tr>
              ) : (
                records.map((item, index) => {
                  const orgRec = item?.organization_record
                  const partnerRec = item?.partner_record
                  const rowId = orgRec?.id ?? partnerRec?.id ?? index
                  const accountName =
                    orgRec?.companyName ?? partnerRec?.companyName ?? '—'
                  const accountWebsite =
                    orgRec?.domain ?? partnerRec?.domain ?? '—'
                  return (
                    <tr
                      key={`${rowId}-${index}`}
                      className='border-t border-gray-200'
                    >
                      <td className='border border-gray-200 px-3 py-2 text-center'>
                        <Checkbox
                          checked={selectedRows.includes(rowId)}
                          onCheckedChange={() => toggleCheckbox(rowId)}
                        />
                      </td>
                      <td className='border border-gray-200 px-3 py-2 text-center'>
                        {index + 1}
                      </td>
                      <td className='border border-gray-200 px-3 py-2'>
                        {accountName}
                      </td>
                      <td className='border border-gray-200 px-3 py-2'>
                        {accountWebsite !== '—' ? (
                          <a
                            href={accountWebsite}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-primary-blue hover:underline'
                          >
                            {accountWebsite}
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className='border border-gray-200 px-3 py-2'>
                        <Badge
                          className={cn(
                            'inline-flex w-fit items-center gap-1 rounded-md',
                            getNameCellClass(index + 1, records.length, 1)
                          )}
                        >
                          <User size={12} /> {orgRec?.name ?? '—'}
                        </Badge>
                      </td>
                      <td className='border border-gray-200 px-3 py-2'>
                        <Badge
                          className={cn(
                            'inline-flex w-fit items-center gap-1 rounded-md',
                            getNameCellClass(index + 1, records.length, 2)
                          )}
                        >
                          <User size={12} /> {partnerRec?.name ?? '—'}
                        </Badge>
                      </td>
                      <td className='border border-gray-200 px-3 py-2 text-center'>
                        {orgRec?.creationDate
                          ? new Date(orgRec.creationDate).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className='border border-gray-200 px-3 py-2 text-center'>
                        {partnerRec?.creationDate
                          ? new Date(
                              partnerRec.creationDate
                            ).toLocaleDateString()
                          : '—'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function PartnerPortalReportPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-[#F9FAFB]'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent' />
        </div>
      }
    >
      <PartnerPortalReportInner />
    </Suspense>
  )
}
