'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useSavePartnerMappingReport } from '@/http-hooks/partner-mapping'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { ArrowLeft } from 'lucide-react'
import { Doughnut } from 'react-chartjs-2'

import { getCurrentOrganization } from '@/lib/db/organization'
import { Button } from '@/components/ui/button'

ChartJS.register(ArcElement, Tooltip, Legend)

type ChartRow = {
  id: string
  total: number
  subtitle: string
  labels: string[]
  values: number[]
  colors: string[]
}

type PartnerRecord = {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  name: string
  companyName: string
  contactEmail: string
  domain: string
  dealStage: string | null
  creationDate: string
  closeDate: string
  subscribed: string
  ticketSize: number | null
}

type MatrixData = {
  records: Array<{
    organization_record?: PartnerRecord
    partner_record?: PartnerRecord
  }>
  overlap_count: number
  overlap_customer_count: number
  raw_records_A: number
  raw_records_sum: number
  raw_records_B: number
}

type PartnerDataResponse = {
  organizationName: string
  partnerName?: string
  matrix: {
    A_PROSPECTS: {
      B_CUSTOMERS: MatrixData
      B_PROSPECTS: MatrixData
      B_OPPORTUNITIES: MatrixData
    }
    A_OPPORTUNITIES: {
      B_CUSTOMERS: MatrixData
      B_PROSPECTS: MatrixData
      B_OPPORTUNITIES: MatrixData
    }
    A_CUSTOMERS: {
      B_CUSTOMERS: MatrixData
      B_PROSPECTS: MatrixData
      B_OPPORTUNITIES: MatrixData
    }
  }
}

const mapPartnerDataToCharts = (data: PartnerDataResponse): ChartRow[] => {
  if (!data?.matrix) return []

  const safeValue = (value?: number) => value ?? 0

  const chartMappings: Array<{
    id: string
    subtitle: string
    rows: [
      MatrixData | undefined,
      MatrixData | undefined,
      MatrixData | undefined
    ]
    colors: string[]
  }> = [
    {
      id: 'c1',
      subtitle: 'My Customer',
      rows: [
        data.matrix.A_CUSTOMERS?.B_CUSTOMERS,
        data.matrix.A_CUSTOMERS?.B_OPPORTUNITIES,
        data.matrix.A_CUSTOMERS?.B_PROSPECTS
      ],
      colors: ['#8B0000', '#FF3366', '#FFC0CB']
    },
    {
      id: 'c2',
      subtitle: 'My In Pipeline Customer',
      rows: [
        data.matrix.A_OPPORTUNITIES?.B_CUSTOMERS,
        data.matrix.A_OPPORTUNITIES?.B_OPPORTUNITIES,
        data.matrix.A_OPPORTUNITIES?.B_PROSPECTS
      ],
      colors: ['#4B0082', '#DDA0DD', '#E6A9F7']
    },
    {
      id: 'c3',
      subtitle: 'My Prospect',
      rows: [
        data.matrix.A_PROSPECTS?.B_CUSTOMERS,
        data.matrix.A_PROSPECTS?.B_OPPORTUNITIES,
        data.matrix.A_PROSPECTS?.B_PROSPECTS
      ],
      colors: ['#006400', '#3CB371', '#98FB98']
    }
  ]

  const labels = ["Partner's Customer", 'Open Opportunities', 'Add Prospect']

  return chartMappings.map(({ id, subtitle, rows, colors }) => {
    const values = rows.map((row) => safeValue(row?.overlap_customer_count))
    const total = values.reduce((sum, value) => sum + value, 0)

    return {
      id,
      subtitle,
      labels,
      values,
      colors,
      total
    }
  })
}

/** Build overlap records from matrix: records that have both organization_record and partner_record (normalized to PartnerRecord for table display) */
function buildOverlapRecordsFromMatrix(
  data: PartnerDataResponse
): PartnerRecord[] {
  if (!data?.matrix) return []
  const out: PartnerRecord[] = []
  const matrix = data.matrix as Record<string, Record<string, MatrixData>>
  const seen = new Set<number>()
  for (const aKey of Object.keys(matrix)) {
    const row = matrix[aKey]
    if (!row || typeof row !== 'object') continue
    for (const bKey of Object.keys(row)) {
      const cell = row[bKey]
      if (!cell?.records || !Array.isArray(cell.records)) continue
      for (const rec of cell.records) {
        if (!rec?.organization_record || !rec?.partner_record) continue
        const orgRec = rec.organization_record as PartnerRecord
        if (seen.has(orgRec.id)) continue
        seen.add(orgRec.id)
        out.push(orgRec)
      }
    }
  }
  return out
}

export default function PartnerPortalComparePage() {
  const router = useRouter()
  const params = useParams()
  const vendorOrgId = params?.vendorOrgId as string | undefined
  const partnerMappingBase = vendorOrgId
    ? `/partner-portal/partner-mapping/${vendorOrgId}`
    : '/partner-portal/partner-mapping'
  const [currentOrg, setCurrentOrg] = useState<{
    id: number
    name: string
  } | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [chartData, setChartData] = useState<ChartRow[]>([])
  const [partnerInfo, setPartnerInfo] = useState<{
    organizationName: string
    partnerName: string
  } | null>(null)
  const [reportCount, setReportCount] = useState(0)
  const [fullPartnerData, setFullPartnerData] =
    useState<PartnerDataResponse | null>(null)
  const [overlapRecords, setOverlapRecords] = useState<PartnerRecord[]>([])
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const saveReportMutation = useSavePartnerMappingReport()

  const loadOrgAndUser = useCallback(async () => {
    try {
      let org: { id: number; name?: string } | null = null
      if (vendorOrgId) {
        const orgRes = await fetch(
          `/api/organization/id?id=${encodeURIComponent(vendorOrgId)}`,
          { credentials: 'include' }
        )
        if (orgRes.ok) {
          const orgData = await orgRes.json()
          org =
            orgData?.id != null
              ? { id: orgData.id, name: orgData.name ?? '' }
              : null
        }
      } else {
        org = await getCurrentOrganization()
      }
      const meRes = await fetch('/api/auth/me', { credentials: 'include' })
      const meData = await meRes.json().catch(() => ({}))
      const uid = meData?.user?.uid ?? null
      setCurrentOrg(org ? { id: org.id, name: org.name ?? '' } : null)
      setUserId(uid)
      return { org, userId: uid }
    } catch (e) {
      console.error('Error loading org/user:', e)
      setCurrentOrg(null)
      setUserId(null)
      return { org: null, userId: null }
    }
  }, [vendorOrgId])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setIsLoading(true)
      setError(null)
      const { org, userId: uid } = await loadOrgAndUser()
      if (cancelled || !org?.id || !uid) {
        if (!cancelled) {
          setIsLoading(false)
          if (org?.id && !uid) setError('User session not found')
          else if (!org?.id) setError('Organization not found')
        }
        return
      }

      try {
        const partnerRes = await fetch(
          `/api/persona/partner/data/${encodeURIComponent(uid)}?partnerId=${encodeURIComponent(org.id)}`,
          { credentials: 'include' }
        )

        if (!partnerRes.ok) {
          const errPayload = await partnerRes.json().catch(() => ({}))
          if (!cancelled)
            setError(
              (errPayload?.error as string) ||
                (errPayload?.message as string) ||
                'Failed to load partner data'
            )
          return
        }

        if (cancelled) return

        const partnerData: PartnerDataResponse = await partnerRes.json()
        const chartRows = mapPartnerDataToCharts(partnerData)
        const overlapList = buildOverlapRecordsFromMatrix(partnerData)

        setChartData(chartRows)
        setFullPartnerData(partnerData)
        setOverlapRecords(overlapList)
        setPartnerInfo({
          organizationName: partnerData.organizationName,
          partnerName: partnerData.partnerName ?? partnerData.organizationName
        })
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : 'Failed to load compare data'
          )
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [loadOrgAndUser])

  const getMatrixTypes = (rowId: string, labelIndex: number) => {
    const yourMatrixMap: Record<string, string> = {
      c1: 'my_customer',
      c2: 'my_opportunity',
      c3: 'my_prospect'
    }
    const partnerMatrixMap: Record<number, string> = {
      0: 'partner_customer',
      1: 'partner_opportunity',
      2: 'partner_prospect'
    }
    return {
      yourMatrix: yourMatrixMap[rowId] ?? '',
      partnerMatrix: partnerMatrixMap[labelIndex] ?? ''
    }
  }

  const generateComparisonType = (
    yourMatrix: string,
    partnerMatrix: string
  ) => {
    const leftType = yourMatrix.replace('my_', '').toUpperCase()
    const rightType = partnerMatrix.replace('partner_', '').toUpperCase()
    return `${leftType}_${rightType}`
  }

  const getOverlapCount = (rowId: string, labelIndex: number): number => {
    if (!fullPartnerData?.matrix) return 0
    const { matrix } = fullPartnerData
    const rowMap: Record<string, typeof matrix.A_CUSTOMERS | undefined> = {
      c1: matrix.A_CUSTOMERS,
      c2: matrix.A_OPPORTUNITIES,
      c3: matrix.A_PROSPECTS
    }
    const colMap: Record<number, keyof typeof matrix.A_CUSTOMERS> = {
      0: 'B_CUSTOMERS',
      1: 'B_OPPORTUNITIES',
      2: 'B_PROSPECTS'
    }
    const row = rowMap[rowId]
    const col = colMap[labelIndex]
    if (!row || !col) return 0
    return row[col]?.overlap_customer_count ?? 0
  }

  const handleCreateReport = (rowId: string, labelIndex: number) => {
    if (!currentOrg?.id) return
    const { yourMatrix, partnerMatrix } = getMatrixTypes(rowId, labelIndex)
    if (!yourMatrix || !partnerMatrix) return
    const overlapCount = getOverlapCount(rowId, labelIndex)
    const comparisonType = generateComparisonType(yourMatrix, partnerMatrix)
    const payload = {
      organization_id: currentOrg.id,
      your_matrix: yourMatrix,
      partner_matrix: partnerMatrix,
      overlap_count: overlapCount,
      partner_id: currentOrg.id,
      report_count: reportCount + 1
    }
    const key = `${rowId}-${labelIndex}`
    setSavingKey(key)
    saveReportMutation.mutate(payload, {
      onSuccess: () => {
        setReportCount((prev) => prev + 1)
        router.push(
          `/partner-portal/partner-mapping/report?type=${comparisonType}&partner=${currentOrg.id}`
        )
      },
      onError: (mutationError) => {
        console.error('Failed to save report:', mutationError)
      },
      onSettled: () => {
        setSavingKey(null)
      }
    })
  }

  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-[#F9FAFB]'>
        <div className='text-center'>
          <div className='mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent' />
          <p className='text-gray-600'>Loading compare data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-[#F9FAFB]'>
        <div className='text-center'>
          <p className='mb-2 text-red-600'>Error loading compare data</p>
          <p className='text-sm text-gray-500'>{error}</p>
          <Button
            variant='outline'
            className='mt-4'
            onClick={() => router.push(partnerMappingBase)}
          >
            Back to Partner Mapping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full bg-[#F9FAFB]'>
      <Link href={partnerMappingBase} className='block'>
        <div className='flex items-center gap-2 p-4'>
          <ArrowLeft />
          <span className='font-medium text-gray-800'>
            {partnerInfo?.partnerName || 'Compare'}
          </span>
        </div>
      </Link>

      <div className='mx-4 bg-white px-4 pt-6 md:mx-6 md:px-6'>
        {chartData.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12'>
            <p className='text-sm text-gray-500'>
              No chart data available. Overlap records are shown above.
            </p>
            <Button
              variant='outline'
              className='mt-4'
              onClick={() => router.push(partnerMappingBase)}
            >
              Back to Partner Mapping
            </Button>
          </div>
        ) : (
          chartData.map((row) => (
            <div
              key={row.id}
              className='mb-8 flex flex-col items-stretch gap-6 md:grid md:grid-cols-12 md:items-center'
            >
              <div className='flex justify-center md:col-span-4 lg:col-span-3'>
                <div className='relative h-40 w-40 md:h-48 md:w-48 lg:h-56 lg:w-56'>
                  <Doughnut
                    data={{
                      labels: row.labels,
                      datasets: [
                        {
                          data: row.values,
                          backgroundColor: row.colors,
                          borderWidth: 0
                        }
                      ]
                    }}
                    options={{
                      cutout: '75%',
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: true }
                      },
                      maintainAspectRatio: false
                    }}
                  />
                  <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
                    <div className='text-2xl font-bold'>{row.total}</div>
                    <div className='text-center text-xs text-gray-500'>
                      {row.subtitle}
                    </div>
                  </div>
                </div>
              </div>

              <div className='md:col-span-8 lg:col-span-9'>
                <div className='max-w-xl'>
                  <div className='flex items-center justify-between'>
                    <div />
                    <div className='text-sm text-gray-500'>Overlap</div>
                  </div>

                  <div className='mt-3 flex flex-col gap-3'>
                    {row.labels.map((lbl, idx) => {
                      const key = `${row.id}-${idx}`
                      const isSaving =
                        savingKey === key && saveReportMutation.isPending
                      const overlapCount = row.values[idx] ?? 0
                      const hasData = overlapCount > 0

                      return (
                        <div
                          key={lbl}
                          className='flex items-center justify-between gap-4'
                        >
                          <div className='flex items-center gap-3'>
                            <span
                              style={{
                                width: 12,
                                height: 12,
                                backgroundColor: row.colors[idx],
                                display: 'inline-block',
                                borderRadius: 3
                              }}
                              aria-hidden
                            />
                            <div className='text-sm'>{lbl}</div>
                          </div>

                          <div className='flex items-center gap-6'>
                            <div className='font-medium'>{row.values[idx]}</div>
                            <Button
                              variant='primary'
                              size='sm'
                              className='disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                              onClick={() => handleCreateReport(row.id, idx)}
                              disabled={
                                !currentOrg?.id ||
                                !hasData ||
                                saveReportMutation.isPending ||
                                isSaving
                              }
                            >
                              Create Report
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
