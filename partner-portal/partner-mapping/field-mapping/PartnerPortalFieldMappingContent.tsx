'use client'

/**
 * Partner portal field mapping: uses userId only (no orgId).
 * Integrations: /api/no/auth/organization/integration/{userId}.
 * HubSpot: /api/no/auth/hubspot/fields/{userId} for field list, /api/no/auth/hubspot?userId= &fields= for data.
 * Zoho: /api/no/auth/zoho/fields/{userId}, /api/no/auth/zoho/data/{userId}.
 * Pipedrive/Salesforce: /api/partner-portal/* (unchanged).
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { ArrowLeft, Check, Search, X } from 'lucide-react'

import { INTEGRATION_STATUS, INTEGRATIONS } from '@/lib/constants/integrations'
import { getServerUser } from '@/lib/server'
import { getGoogleSheetIdFromUrl, getUniqueValuesFromObject } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { showCustomToast } from '@/components/custom-toast'

import { usePartnerPortalIntegrations } from './usePartnerPortalIntegrations'

interface PipedriveField {
  id: number
  key: string
  name: string
  [key: string]: unknown
}

interface PipedriveFieldsResponse {
  success: boolean
  data: PipedriveField[]
  error?: string
}

type MappingRecordType = 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'

const PARTNER_MAPPING_BASE = '/partner-portal/partner-mapping'

const SHARKDOM_PROPERTIES = [
  { key: 'domain', label: 'Website' },
  { key: 'name', label: 'Name' },
  { key: 'companyName', label: 'Company Name' },
  { key: 'contactEmail', label: 'Email address' },
  { key: 'dealStage', label: 'Deal Stage' },
  { key: 'creationDate', label: 'Creation Date' },
  { key: 'closeDate', label: 'Close Date' },
  { key: 'subscribed', label: 'Subscribed' },
  { key: 'ticketSize', label: 'Ticket Size' }
]

const AUTO_MAP_PATTERNS: Record<string, string[]> = {
  domain: ['website', 'domain', 'site', 'url', 'web'],
  name: ['name', 'full name', 'fullname', 'contact name', 'contact_name'],
  companyName: [
    'company',
    'company name',
    'company_name',
    'organization',
    'org'
  ],
  contactEmail: ['email', 'e-mail', 'email address', 'email_address'],
  dealStage: [
    'deal stage',
    'deal_stage',
    'stage',
    'pipeline stage',
    'pipeline_stage'
  ],
  creationDate: [
    'created',
    'creation date',
    'creation_date',
    'created date',
    'created_date'
  ],
  closeDate: [
    'close date',
    'close_date',
    'closed date',
    'closed_date',
    'expected close'
  ],
  subscribed: [
    'subscribed',
    'subscription',
    'opt-in',
    'opt_in',
    'marketing consent'
  ],
  ticketSize: [
    'amount',
    'value',
    'deal value',
    'deal_value',
    'ticket size',
    'ticket_size'
  ]
}

function autoMapHeaders(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {}
  SHARKDOM_PROPERTIES.forEach((property) => {
    const patterns = AUTO_MAP_PATTERNS[property.key] || []
    let bestMatch = ''
    let bestScore = 0
    headers.forEach((header) => {
      const headerLower = header.toLowerCase()
      if (patterns.some((p) => headerLower === p)) {
        bestMatch = header
        bestScore = 100
        return
      }
      patterns.forEach((pattern) => {
        if (headerLower.includes(pattern) || pattern.includes(headerLower)) {
          const score =
            (Math.min(headerLower.length, pattern.length) /
              Math.max(headerLower.length, pattern.length)) *
            80
          if (score > bestScore) {
            bestMatch = header
            bestScore = score
          }
        }
      })
    })
    mapping[property.key] = bestScore > 30 ? bestMatch : ''
  })
  return mapping
}

export function PartnerPortalFieldMappingContent({
  backBasePath = PARTNER_MAPPING_BASE,
  redirectTo = PARTNER_MAPPING_BASE
}: {
  backBasePath?: string
  redirectTo?: string
} = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    integrations,
    userId,
    isLoading: integrationsLoading,
    refetch
  } = usePartnerPortalIntegrations()

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingValidate, setIsLoadingValidate] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [selectedMapping, setSelectedMapping] = useState<
    Record<string, string>
  >({})
  const [salesforceFieldMapping, setSalesforceFieldMapping] = useState<
    Record<string, string>
  >({})
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})
  const [hiddenProperties, setHiddenProperties] = useState<Set<string>>(
    new Set()
  )
  const recordType = (searchParams.get('recordType') ||
    'CUSTOMER') as MappingRecordType

  const isHubSpotConnected = integrations?.some(
    (i: any) =>
      i.id === INTEGRATIONS.HUBSPOT_OUTREACH &&
      i.status === INTEGRATION_STATUS.CONNECTED
  )
  const isPipedriveConnected = integrations?.some(
    (i: any) =>
      i.id === INTEGRATIONS.PIPEDRIVE &&
      i.status === INTEGRATION_STATUS.CONNECTED
  )
  const isSalesforceConnected = integrations?.some(
    (i: any) =>
      i.id === INTEGRATIONS.SALESFORCE_CRM &&
      i.status === INTEGRATION_STATUS.CONNECTED
  )

  const urlDataSource = searchParams.get('source')
  const dataSource = useMemo(
    () =>
      urlDataSource ||
      (isHubSpotConnected
        ? 'HUBSPOT'
        : isSalesforceConnected
          ? 'SALESFORCE'
          : 'CSV'),
    [urlDataSource, isHubSpotConnected, isSalesforceConnected]
  )
  const sheetUrl = searchParams.get('sheetUrl') || ''

  const csvData = useMemo(() => {
    if (dataSource.toUpperCase() === 'CSV') {
      const stored = sessionStorage.getItem('csvData')
      return stored ? JSON.parse(stored) : null
    }
    return null
  }, [dataSource])

  useEffect(() => {
    if (
      ['HUBSPOT', 'PIPEDRIVE', 'SALESFORCE', 'ZOHO'].includes(
        dataSource.toUpperCase()
      ) &&
      !userId
    ) {
      return
    }
    if (dataSource.toUpperCase() === 'HUBSPOT' && !isHubSpotConnected) {
      setIsLoading(true)
      setTimeout(() => refetch(), 500)
      return
    }
    if (dataSource.toUpperCase() === 'PIPEDRIVE' && !isPipedriveConnected) {
      setIsLoading(true)
      return
    }
    if (dataSource.toUpperCase() === 'SALESFORCE' && !isSalesforceConnected) {
      setIsLoading(true)
      return
    }

    const fetchColumns = async () => {
      setIsLoading(true)
      setError(null)
      try {
        let headers: string[] = []
        switch (dataSource.toUpperCase()) {
          case 'CSV':
            headers = csvData?.length
              ? csvData[0]
              : [
                  'Website <EMAIL>',
                  'First Name',
                  'Last Name',
                  'Email',
                  'Contact no',
                  'Other 1',
                  'Other 2'
                ]
            break
          case 'HUBSPOT':
            if (!userId)
              throw new Error('User ID not found. Please refresh the page.')
            {
              const res = await fetch(
                `/api/no/auth/hubspot/fields/${encodeURIComponent(userId)}`,
                { credentials: 'include' }
              )
              const data = await res.json()
              if (!res.ok)
                throw new Error(
                  data?.message ||
                    data?.errorMessage ||
                    'Failed to fetch HubSpot columns'
                )
              headers = Array.isArray(data)
                ? data
                : (data?.data ?? data?.fields ?? [])
            }
            break
          case 'PIPEDRIVE':
            if (!userId)
              throw new Error('User ID not found. Please refresh the page.')
            try {
              const { token } = await getServerUser()
              const response = await fetch(
                `/api/partner-portal/pipedrive/fields?userId=${encodeURIComponent(userId)}`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  }
                }
              )
              const result: PipedriveFieldsResponse = await response.json()
              if (!response.ok)
                throw new Error(
                  result.error || 'Failed to fetch Pipedrive fields'
                )
              if (result.success && result.data?.length) {
                const fieldMapping: Record<string, string> = {}
                const displayNames: string[] = []
                result.data.forEach((f: PipedriveField) => {
                  if (f.name && f.key) {
                    fieldMapping[f.name] = f.key
                    displayNames.push(f.name)
                  }
                })
                sessionStorage.setItem(
                  'pipedriveFieldMapping',
                  JSON.stringify(fieldMapping)
                )
                headers = displayNames
              }
            } catch {
              headers = [
                'name',
                'email',
                'phone',
                'company_name',
                'website',
                'deal_title',
                'deal_value',
                'deal_stage',
                'deal_status',
                'created_time',
                'close_time',
                'owner_name',
                'org_name',
                'person_name',
                'deal_currency'
              ]
              showCustomToast(
                'Warning',
                'Using standard Pipedrive properties. Please check your Pipedrive connection.',
                'error',
                5000
              )
            }
            break
          case 'ZOHO': {
            if (!userId)
              throw new Error('User ID not found. Please refresh the page.')
            const res = await fetch(
              `/api/no/auth/zoho/fields/${encodeURIComponent(userId)}`,
              { credentials: 'include' }
            )
            const zohoResult = await res.json()
            if (!res.ok)
              throw new Error(
                zohoResult?.message || 'Failed to fetch Zoho columns'
              )
            headers = Array.isArray(zohoResult)
              ? zohoResult
              : (zohoResult?.data ?? zohoResult?.fields ?? [])
            if (!headers.length) throw new Error('No Zoho columns found')
            break
          }
          case 'SALESFORCE':
            if (!userId)
              throw new Error('User ID not found. Please refresh the page.')
            try {
              const { token } = await getServerUser()
              const salesforceDescribePath =
                recordType === 'CUSTOMER'
                  ? '/api/partner-portal/salesforce/accounts/describe'
                  : recordType === 'OPPORTUNITY'
                    ? '/api/partner-portal/salesforce/opportunities/describe'
                    : '/api/partner-portal/salesforce/contacts/describe'
              const response = await fetch(
                `${salesforceDescribePath}?userId=${encodeURIComponent(userId)}`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  }
                }
              )
              const result = await response.json()
              if (!response.ok)
                throw new Error(
                  result.error || 'Failed to fetch Salesforce fields'
                )
              if (result.fields?.length) {
                headers = result.fields.map((f: any) => f.label)
                const fieldMapping: Record<string, string> = {}
                result.fields.forEach((f: any) => {
                  fieldMapping[f.label] = f.name
                })
                setSalesforceFieldMapping(fieldMapping)
              } else
                throw new Error('Invalid response from Salesforce fields API')
            } catch {
              headers =
                recordType === 'CUSTOMER'
                  ? [
                      'Id',
                      'Name',
                      'Type',
                      'Industry',
                      'Phone',
                      'Website',
                      'BillingCity',
                      'BillingCountry',
                      'CreatedDate',
                      'LastModifiedDate'
                    ]
                  : recordType === 'OPPORTUNITY'
                    ? [
                        'Id',
                        'Name',
                        'StageName',
                        'OwnerId',
                        'Amount',
                        'CloseDate',
                        'Type',
                        'LeadSource',
                        'CreatedDate',
                        'LastModifiedDate'
                      ]
                    : [
                        'Id',
                        'FirstName',
                        'LastName',
                        'Email',
                        'Phone',
                        'Company',
                        'Title',
                        'Department',
                        'Industry',
                        'LeadSource',
                        'CreatedDate',
                        'LastModifiedDate'
                      ]
              showCustomToast(
                'Warning',
                'Using standard Salesforce properties due to API error.',
                'error',
                5000
              )
            }
            break
          case 'GOOGLE_SHEET':
            if (!sheetUrl) throw new Error('Google Sheet URL is required')
            {
              const result = await axios.get(
                `/api/google-sheets/columns?sheetUrl=${sheetUrl}`,
                { headers: { 'Content-Type': 'application/json' } }
              )
              if (result?.status !== 200)
                throw new Error(
                  result?.data?.error || 'Failed to fetch Google Sheets columns'
                )
              const sheetsData = result?.data?.data
              headers = Array.isArray(sheetsData) ? sheetsData : []
              if (!headers.length)
                throw new Error('No Google Sheets columns found')
            }
            break
          default:
            throw new Error(`Unsupported data source: ${dataSource}`)
        }
        const headersArray = Array.isArray(headers) ? headers : []
        setCsvHeaders(headersArray)
        setSelectedMapping(autoMapHeaders(headersArray))
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to fetch columns'
        setError(msg)
        showCustomToast('Error', msg, 'error', 5000)
      } finally {
        setIsLoading(false)
      }
    }
    fetchColumns()
  }, [
    dataSource,
    sheetUrl,
    userId,
    isHubSpotConnected,
    isPipedriveConnected,
    isSalesforceConnected,
    csvData,
    recordType,
    refetch
  ])

  const handleBack = () => {
    const slug =
      dataSource === 'GOOGLE_SHEET' ? 'google-sheets' : dataSource.toLowerCase()
    if (dataSource.toUpperCase() === 'CSV') {
      sessionStorage.removeItem('csvData')
      sessionStorage.removeItem('csvFileName')
      router.push(`${backBasePath}/upload-csv`)
    } else {
      if (dataSource.toUpperCase() === 'PIPEDRIVE')
        sessionStorage.removeItem('pipedriveFieldMapping')
      router.push(`${backBasePath}/connect-service/${slug}`)
    }
  }

  const handleExtractDataFromColumns = (csvHeader: any, zohoData: any) =>
    zohoData.map(({ ...obj }: any) => csvHeader.map((k: any) => obj[k]))

  const handleGetHubspotColumnsData = async () => {
    const uniqueColumns = getUniqueValuesFromObject(selectedMapping).filter(
      (v) => v && v !== '' && v !== 'dont_import'
    )
    if (!userId)
      return Promise.reject({ status: 400, msg: 'User ID not found' })
    const apiRes = await fetch(
      `/api/no/auth/hubspot?userId=${encodeURIComponent(userId)}&fields=${encodeURIComponent(uniqueColumns.join(','))}`,
      { credentials: 'include' }
    )
    const response = await apiRes.json()
    if (!apiRes.ok)
      return Promise.reject({
        status: apiRes.status,
        msg:
          response?.message || response?.desc || 'Failed to fetch HubSpot data'
      })
    const results = response?.results ?? response?.data ?? response
    const data = Array.isArray(results)
      ? results.map((item: any) =>
          uniqueColumns.map((k) => item?.properties?.[k] ?? item?.[k] ?? '')
        )
      : []
    return Promise.resolve({
      status: '200',
      msg: 'Success',
      data,
      uniqueColumns
    })
  }

  const handleGetPipedriveColumnsData = async () => {
    const uniqueColumns = getUniqueValuesFromObject(selectedMapping).filter(
      (v) => v && v !== '' && v !== 'dont_import'
    )
    if (!userId)
      return Promise.reject({ status: 400, msg: 'User ID not found' })
    const { token } = await getServerUser()
    const response = await fetch(
      `/api/partner-portal/pipedrive/data?userId=${encodeURIComponent(userId)}&fields=${encodeURIComponent(uniqueColumns.join(','))}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    const result = await response.json()
    if (!response.ok)
      return Promise.reject({
        status: response.status,
        msg: result.error || 'Failed to fetch Pipedrive data'
      })
    if (!result.success || !result.data)
      return Promise.reject({
        status: 500,
        msg: 'Invalid response from Pipedrive API'
      })
    const fieldMappingStr = sessionStorage.getItem('pipedriveFieldMapping')
    const fieldMapping: Record<string, string> = fieldMappingStr
      ? JSON.parse(fieldMappingStr)
      : {}
    const data = result.data.map((item: any) => {
      const arr: any[] = []
      uniqueColumns.forEach((displayName) => {
        const fieldKey = fieldMapping[displayName] || displayName
        let value = item[fieldKey] ?? item.properties?.[fieldKey] ?? ''
        if (
          fieldKey === 'contactEmail' &&
          Array.isArray(value) &&
          value.length
        ) {
          const primary = value.find((e: any) => e.primary) || value[0]
          value = primary?.value ?? ''
        }
        arr.push(value)
      })
      return arr
    })
    return Promise.resolve({
      status: '200',
      msg: 'Success',
      data,
      uniqueColumns
    })
  }

  const handleGetZohoColumnsData = async () => {
    const uniqueColumns = getUniqueValuesFromObject(selectedMapping).filter(
      (v) => v && v !== '' && v !== 'dont_import'
    )
    if (!userId)
      return Promise.reject({ status: 400, msg: 'User ID not found' })
    const res = await fetch(
      `/api/no/auth/zoho/data/${encodeURIComponent(userId)}?fields=${encodeURIComponent(uniqueColumns.join(','))}`,
      { credentials: 'include' }
    )
    const zohoData = await res.json()
    if (!res.ok)
      return Promise.reject({
        status: res.status,
        msg: zohoData?.message || zohoData?.desc || 'Failed to fetch Zoho data'
      })
    const data = Array.isArray(zohoData)
      ? zohoData.map((row: any) => uniqueColumns.map((k) => row?.[k] ?? ''))
      : handleExtractDataFromColumns(
          uniqueColumns,
          zohoData?.data ?? zohoData ?? []
        )
    return Promise.resolve({
      status: '200',
      msg: 'Success',
      data,
      uniqueColumns
    })
  }

  const handleGetSalesforceColumnsData = async () => {
    const uniqueColumns = getUniqueValuesFromObject(selectedMapping).filter(
      (v) => v && v !== '' && v !== 'dont_import'
    )
    if (!userId)
      return Promise.reject({ status: 400, msg: 'User ID not found' })
    const fieldNames = uniqueColumns.map(
      (label) => salesforceFieldMapping[label] || label
    )
    const fieldsParams = fieldNames.map((n) => `fields=${n}`).join('&')
    const { token } = await getServerUser()
    const salesforceDataPath =
      recordType === 'CUSTOMER'
        ? '/api/partner-portal/salesforce/accounts'
        : recordType === 'OPPORTUNITY'
          ? '/api/partner-portal/salesforce/opportunities'
          : '/api/partner-portal/salesforce/contacts'
    const response = await fetch(
      `${salesforceDataPath}?userId=${encodeURIComponent(userId)}&${fieldsParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    const result = await response.json()
    if (!response.ok)
      return Promise.reject({
        status: response.status,
        msg: result.error || 'Failed to fetch Salesforce data'
      })
    if (!result.records?.length)
      return Promise.reject({
        status: 500,
        msg: 'Invalid response from Salesforce API'
      })
    const data = result.records.map((record: any) =>
      uniqueColumns.map(
        (label) => record[salesforceFieldMapping[label] || label] ?? ''
      )
    )
    return Promise.resolve({
      status: '200',
      msg: 'Success',
      data,
      uniqueColumns
    })
  }

  const handleValidateAndUpload = async () => {
    setIsLoadingValidate(true)
    try {
      let finalCsvData = csvData
      if (dataSource.toUpperCase() === 'GOOGLE_SHEET' && sheetUrl) {
        const mappedColumns = Object.values(selectedMapping).filter(
          (v) => v && v !== '' && v !== 'dont_import'
        ) as string[]
        if (!mappedColumns.length)
          throw new Error('No columns mapped for Google Sheets data')
        const sheetId = getGoogleSheetIdFromUrl(sheetUrl)
        if (!sheetId) throw new Error('Invalid Google Sheet URL')
        const result = await axios.get(
          `/api/google-sheets/${sheetId}?selectedColumns=${mappedColumns.join(',')}`,
          { headers: { 'Content-Type': 'application/json' } }
        )
        if (result?.status !== 200)
          throw new Error(
            result?.data?.error || 'Failed to fetch Google Sheets data'
          )
        const rawData = result?.data?.data || []
        finalCsvData = [mappedColumns, ...rawData]
      }
      if (dataSource.toUpperCase() === 'HUBSPOT') {
        const result: any = await handleGetHubspotColumnsData()
        finalCsvData = [result.uniqueColumns, ...result.data]
      }
      if (dataSource.toUpperCase() === 'PIPEDRIVE') {
        const result: any = await handleGetPipedriveColumnsData()
        finalCsvData = [result.uniqueColumns, ...result.data]
      }
      if (dataSource.toUpperCase() === 'ZOHO') {
        const result: any = await handleGetZohoColumnsData()
        finalCsvData = [result.uniqueColumns, ...result.data]
      }
      if (dataSource.toUpperCase() === 'SALESFORCE') {
        const result: any = await handleGetSalesforceColumnsData()
        finalCsvData = [result.uniqueColumns, ...result.data]
      }
      if (!finalCsvData?.length) {
        showCustomToast(
          'Error',
          'No data found. Please ensure your data source contains valid data.',
          'error',
          5000
        )
        setIsLoadingValidate(false)
        return
      }
      const headers = Array.isArray(finalCsvData[0]) ? finalCsvData[0] : []
      const hasWebsite = headers.some(
        (h: string) => h?.toLowerCase() === 'website'
      )
      if (!hasWebsite) {
        showCustomToast(
          'Error',
          `The 'website' field is required but not found in your ${dataSource} data.`,
          'error',
          7000
        )
        setIsLoadingValidate(false)
        return
      }
      const mappedColumns = Object.values(selectedMapping).filter(
        (v) => v && v !== '' && v !== 'dont_import'
      ) as string[]
      const mappingData = {
        selectedMapping,
        csvHeaders: ['HUBSPOT', 'PIPEDRIVE', 'SALESFORCE'].includes(
          dataSource.toUpperCase()
        )
          ? mappedColumns
          : csvHeaders,
        dataSource,
        csvData: finalCsvData,
        sheetUrl
      }
      sessionStorage.setItem('fieldMappingData', JSON.stringify(mappingData))
      router.push(redirectTo)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch data'
      showCustomToast('Error', msg, 'error', 5000)
    } finally {
      setIsLoadingValidate(false)
    }
  }

  const isAllFieldsMapped = SHARKDOM_PROPERTIES.filter(
    (p) => !hiddenProperties.has(p.key)
  ).every(
    (p) => selectedMapping[p.key] !== '' && selectedMapping[p.key] !== undefined
  )

  if (integrationsLoading || isLoading) {
    return (
      <div className='flex h-[calc(100vh-50px)] items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 text-lg font-semibold'>
            Loading columns from {dataSource.split('_').join(' ')}...
          </div>
          <div className='text-sm text-gray-500'>
            Fetching data from {dataSource}
          </div>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className='flex h-[calc(100vh-50px)] items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 text-lg font-semibold text-red-600'>Error</div>
          <div className='mb-4 text-sm text-gray-500'>{error}</div>
          <Button onClick={handleBack} className='bg-[#3E50F7] text-white'>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-[calc(100vh-50px)] flex-col'>
      <div className='flex flex-1 items-center justify-center'>
        <div className='w-9/12 max-w-4xl'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex flex-col gap-1'>
              <h1 className='text-xl font-semibold text-gray-700'>
                Field mapping
              </h1>
              <p className='text-sm text-gray-500'>
                Upload the CSV file that has access set to open.
              </p>
            </div>
            <div className='text-sm text-gray-500'>Step 3/3</div>
          </div>
          <div className='mb-6 rounded-lg bg-[#FDF3E3] p-4'>
            <h3 className='mb-1 text-base font-bold text-gray-900'>
              Review column properties
            </h3>
            <p className='text-sm text-gray-600'>
              Columns have been automatically mapped where possible. Unmatched
              columns are set to &quot;Don&apos;t Import&quot; by default.
              Review and adjust as needed.
            </p>
          </div>
          <div className='mb-6'>
            <div className='mb-4 grid grid-cols-3 gap-4 border-b border-gray-200 pb-2'>
              <span className='text-sm font-bold text-gray-700'>
                Sharkdom Property
              </span>
              <span className='text-sm font-bold text-gray-700'>
                Columns in your file
              </span>
              <span className='text-center text-sm font-bold text-gray-700'>
                Mapped
              </span>
            </div>
            <div className='space-y-4'>
              {SHARKDOM_PROPERTIES.filter(
                (p) => !hiddenProperties.has(p.key)
              ).map((property) => (
                <div
                  key={property.key}
                  className='grid grid-cols-3 items-center gap-4'
                >
                  <div className='text-sm font-medium text-gray-700'>
                    {property.label}
                  </div>
                  <div className='flex min-w-0 items-center gap-2'>
                    <Select
                      value={selectedMapping[property.key] || ''}
                      onValueChange={(value) =>
                        setSelectedMapping((prev) => ({
                          ...prev,
                          [property.key]: value
                        }))
                      }
                    >
                      <SelectTrigger className='h-10 min-w-0 flex-1 rounded-md border border-gray-300 bg-white'>
                        <SelectValue placeholder='Select column' />
                      </SelectTrigger>
                      <SelectContent className='max-h-60'>
                        <div className='p-2'>
                          <div className='relative'>
                            <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
                            <Input
                              placeholder='Search column'
                              value={searchTerms[property.key] || ''}
                              onChange={(e) =>
                                setSearchTerms((prev) => ({
                                  ...prev,
                                  [property.key]: e.target.value
                                }))
                              }
                              className='h-8 pl-8 text-sm'
                            />
                          </div>
                        </div>
                        <div className='max-h-40 overflow-y-auto'>
                          {csvHeaders
                            .filter(
                              (h) =>
                                !searchTerms[property.key] ||
                                h
                                  .toLowerCase()
                                  .includes(
                                    (
                                      searchTerms[property.key] || ''
                                    ).toLowerCase()
                                  )
                            )
                            .map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                        </div>
                        <div className='sticky bottom-0 border-t border-gray-200 bg-white p-1'>
                          <SelectItem
                            value='dont_import'
                            className='text-red-600'
                          >
                            Don&apos;t Import
                          </SelectItem>
                        </div>
                      </SelectContent>
                    </Select>
                    {property.key !== 'domain' &&
                    property.key !== 'companyName' ? (
                      <button
                        type='button'
                        onClick={() => {
                          setHiddenProperties((prev) =>
                            new Set(prev).add(property.key)
                          )
                          setSelectedMapping((prev) => ({
                            ...prev,
                            [property.key]: ''
                          }))
                          setSearchTerms((prev) => ({
                            ...prev,
                            [property.key]: ''
                          }))
                        }}
                        className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                        title='Remove column mapping'
                      >
                        <X className='h-5 w-5' />
                      </button>
                    ) : (
                      <div className='h-10 w-10 shrink-0' aria-hidden='true' />
                    )}
                  </div>
                  <div className='flex justify-center'>
                    {selectedMapping[property.key] &&
                    selectedMapping[property.key] !== 'dont_import' ? (
                      <Check className='h-5 w-5 rounded-full bg-green-200 p-1 text-green-600' />
                    ) : selectedMapping[property.key] === 'dont_import' ? (
                      <X className='h-5 w-5 rounded-full bg-red-200 p-1 text-red-600' />
                    ) : (
                      <span className='flex h-5 w-5 items-center justify-center rounded-full bg-yellow-200 p-1 text-sm text-yellow-600'>
                        !
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='sticky bottom-0 border-t bg-white px-6 py-4'>
        <div className='flex items-center justify-between'>
          <Button
            variant='ghost'
            onClick={handleBack}
            className='flex items-center gap-2 text-[#3E50F7]'
          >
            <ArrowLeft size={20} /> Back
          </Button>
          <Button
            disabled={!isAllFieldsMapped}
            onClick={handleValidateAndUpload}
            className={
              isAllFieldsMapped
                ? 'bg-[#3E50F7] text-white hover:bg-[#2d3bb3]'
                : 'bg-gray-300 text-gray-500 hover:bg-gray-300'
            }
            loading={isLoadingValidate}
            loadingText='Loading...'
          >
            Validate & Upload
          </Button>
        </div>
      </div>
    </div>
  )
}
