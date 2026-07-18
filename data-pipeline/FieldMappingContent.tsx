'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
/**
 * Keep these imports from your old working file.
 * Paths may need to match your project exactly.
 */
import { useCreatePersonaOverlapRecord } from '@/http-hooks/partner-match'
import {
  useHubspotMetadata,
  type HubspotTab,
  type SharkdomField
} from '@/http-hooks/use-hubspot-metadata'
import { useSalesforceMetadata } from '@/http-hooks/use-salesforce-metadata'
import { useZohoMetadata } from '@/http-hooks/use-zoho-metadata'
import type { RootState } from '@/redux/store'
import type { OrganizationType } from '@/types'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent
} from '@dnd-kit/core'
import axios from 'axios'
import { DollarCircle } from 'iconsax-react'
import {
  AlertCircle,
  Building2,
  Check,
  ChevronDown,
  FileSpreadsheet,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Search,
  Table2,
  Trash2,
  User,
  X
} from 'lucide-react'
import { useSelector } from 'react-redux'

import {
  getHubspotContactCompaniesBatch,
  getHubspotDataBasedOnColumns,
  getHubspotDealCompaniesBatch,
  getPipedriveData,
  getSalesforceData,
  getZohoData
} from '@/lib/db/customer-persona'
import { getGoogleSheetIdFromUrl, getUniqueValuesFromObject } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import DataPipelineStepper from './_components/DataPipelineStepper'

function formatFieldName(
  fieldName: string | null | undefined,
  apiName: string | null | undefined
): string {
  if (!fieldName || fieldName.toLowerCase() === 'unknown') {
    if (!apiName || apiName.toLowerCase() === 'unknown') return '—'
    return apiName
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }
  return fieldName
}

export type FieldMappingContentProps = {
  backBasePath?: string
  redirectTo?: string
  returnToPartnerPortal?: string
}

type Tab = 'Contacts' | 'Companies' | 'Deals'

type RowsByTab = Record<Tab, MappingRow[]>

type MappingRecordType = 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'

export interface SharkdomProperty {
  key: string
  label: string
  required?: boolean
}

type MappingRow = {
  id: string
  column: string
  samples: string[]
  mapped: boolean
  fieldName: string | null
  fieldType: string | null
  fieldApiName: string | null
  sharkdomKey: string | null
  required: boolean
  isCustom: boolean
}

const IMPORT_TO_TAB: Record<string, Tab> = {
  contacts: 'Contacts',
  companies: 'Companies',
  deals: 'Deals'
}

const ALL_TABS: { id: Tab; Icon: React.ComponentType<any> }[] = [
  { id: 'Contacts', Icon: User },
  { id: 'Companies', Icon: Building2 },
  { id: 'Deals', Icon: DollarCircle }
]

const SHARKDOM_PROPERTIES_BY_RECORD_TYPE: Record<
  MappingRecordType,
  SharkdomProperty[]
> = {
  CUSTOMER: [
    { key: 'name', label: 'Company Name', required: true },
    { key: 'domain', label: 'Website', required: true },
    { key: 'industry', label: 'Industry', required: true },
    { key: 'companySize', label: 'Company Size', required: true },
    { key: 'countryGeography', label: 'Country Geography', required: true }
  ],
  PROSPECT: [
    { key: 'contactEmail', label: 'Email', required: true },
    { key: 'fullName', label: 'First Name ', required: true },
    { key: 'jobTitle', label: 'Job Title', required: true }
  ],
  OPPORTUNITY: [
    { key: 'dealname', label: 'Deal Name', required: true },
    { key: 'dealStage', label: 'Deal Stage', required: true },
    { key: 'amountAcv', label: 'Amount / ACV', required: true },
    { key: 'closeDate', label: 'Close Date', required: true }
  ]
}

const AUTO_MAP_PATTERNS: Record<string, string[]> = {
  name: ['companyname', 'name', 'organization', 'company'],
  domain: ['website', 'domain', 'site', 'web'],
  industry: ['industry', 'sector', 'vertical'],
  companySize: [
    'companysize',
    'employees',
    'employeecount',
    'size',
    'numberofemployees'
  ],
  countryGeography: [
    'country',
    'region',
    'geography',
    'location',
    'billingcountry'
  ],
  linkedInUrl: [
    'linkedin',
    'linkedinurl',
    'linkedinprofile',
    'linkedincompanypage',
    'linkedin_url__c'
  ],
  annualRevenue: ['annualrevenue', 'revenue', 'arr'],
  description: ['description', 'about', 'notes'],
  phone: ['phone', 'phonenumber', 'mobile', 'contactnumber'],
  city: ['city', 'town', 'billingcity'],
  contactEmail: ['email', 'emailaddress', 'e-mail'],
  fullName: [
    'fullname',
    'firstnamelastname',
    'contactname',
    'name',
    'firstname',
    'lastname'
  ],
  jobTitle: ['jobtitle', 'title', 'designation'],
  leadStatus: ['leadstatus', 'status', 'leadsource'],
  lastActivityDate: ['lastactivitydate', 'lastactivity', 'hsnoteslastactivity'],
  contactOwner: ['contactowner', 'owner', 'recordowner', 'ownerid'],
  dealname: ['dealname', 'dealtitle', 'opportunityname', 'name'],
  dealStage: ['dealstage', 'stage', 'pipelinestage', 'stagename'],
  dealOwner: ['dealowner', 'owner', 'hubspotownerid', 'ownerid'],
  amountAcv: ['amount', 'acv', 'value', 'dealvalue'],
  closeDate: [
    'closedate',
    'expectedclose',
    'closingdate',
    'closing_date',
    'closing date'
  ],
  dealId: ['dealid', 'hubspotdealid', 'hsobjectid', 'id'],
  pipeline: ['pipeline', 'pipelinename', 'recordtype', 'stagename'],
  dealType: ['dealtype', 'opportunitytype', 'type'],
  associatedCompanyId: [
    'associatedcompanyid',
    'companyid',
    'associated_company_id',
    'associated company id',
    'accountid'
  ],
  associatedContactId: [
    'associatedcontactid',
    'contactid',
    'associated_contact_id',
    'associated contact id',
    'opportunitycontactrole'
  ]
}

const CRM_SPARSE_SHARKDOM_TO_BACKEND_FIELD: Record<string, string> = {
  fullName: 'name',
  linkedInUrl: 'contactLinkedinUrl',
  linkedinUrl: 'contactLinkedinUrl',
  phone: 'contactPhone',
  contactPhone: 'contactPhone',
  contactEmail: 'contactEmail',
  jobTitle: 'jobTitle',
  leadStatus: 'leadStatus',
  contactOwner: 'contactOwner',
  domain: 'domain',
  countryGeography: 'country',
  country: 'country',
  website: 'website',
  industry: 'industry',
  companySize: 'companySize',
  annualRevenue: 'annualRevenue',
  city: 'city',
  description: 'description',
  dealname: 'dealName',
  dealStage: 'dealStage',
  dealOwner: 'dealOwner',
  closeDate: 'closeDate',
  amountAcv: 'amountAcv',
  dealId: 'dealId',
  pipeline: 'pipeline',
  dealType: 'dealType',
  lastActivityDate: 'lastActivityDate',
  associatedCompanyId: 'associatedCompanyId',
  associatedContactId: 'associatedContactId'
}

function encodeMappingDataForRoute(mappingData: unknown) {
  if (typeof window === 'undefined') return null
  try {
    return window.btoa(
      encodeURIComponent(JSON.stringify(mappingData)).replace(
        /%([0-9A-F]{2})/g,
        (_, hex) => String.fromCharCode(Number.parseInt(hex, 16))
      )
    )
  } catch (error) {
    console.warn('Failed to encode mapping data for route transport:', error)
    return null
  }
}

function hasUsablePreviewHandoff(encodedMappingData: string | null) {
  if (typeof window === 'undefined') return false
  return Boolean(
    sessionStorage.getItem('fieldMappingData') ||
      (window as any).__sharkdom_fieldMappingData ||
      encodedMappingData
  )
}

function normalizeValue(value?: string | null) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, '')
}

function getFieldSearchTokens(field: SharkdomField) {
  return [
    field.name,
    field.apiName,
    field.description,
    field.groupName,
    field.type,
    field.fieldType
  ]
    .filter(Boolean)
    .map((item) => normalizeValue(item))
}

function findBestFieldMatch(
  property: SharkdomProperty,
  fields: SharkdomField[],
  usedApiNames: Set<string>
) {
  const patterns = AUTO_MAP_PATTERNS[property.key] ?? []
  let bestField: SharkdomField | null = null
  let bestScore = 0

  for (const field of fields) {
    if (usedApiNames.has(field.apiName)) continue

    const tokens = getFieldSearchTokens(field)

    for (const pattern of patterns) {
      const normalizedPattern = normalizeValue(pattern)

      if (tokens.some((token) => token === normalizedPattern)) {
        bestField = field
        bestScore = 100
        break
      }

      if (
        tokens.some(
          (token) =>
            token.includes(normalizedPattern) ||
            normalizedPattern.includes(token)
        )
      ) {
        if (bestScore < 80) {
          bestField = field
          bestScore = 80
        }
      }
    }

    if (bestScore === 100) break
  }

  if (bestField) usedApiNames.add(bestField.apiName)
  return bestField
}

function DraggableField({ field }: { field: SharkdomField }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `field-${field.apiName}`,
    data: { field }
  })

  return (
    <button
      ref={setNodeRef}
      type='button'
      {...listeners}
      {...attributes}
      className={`flex w-full cursor-grab select-none items-center justify-between rounded border border-[rgba(33,35,44,0.12)] bg-white px-4 py-2.5 text-left active:cursor-grabbing dark:border-border dark:bg-card ${
        isDragging ? 'opacity-30' : 'hover:border-[#2563EB40]'
      }`}
    >
      <div className='flex min-w-0 items-center gap-3'>
        <GripVertical className='h-4 w-4 flex-shrink-0 text-[#65686F] dark:text-gray-400' />
        <div className='min-w-0'>
          <p className='truncate text-sm font-semibold text-[#21232C] dark:text-white'>
            {field.name}
          </p>
          <p className='truncate text-[11px] font-medium text-[#65686F] dark:text-gray-400'>
            {field.apiName}
          </p>
          {field.description ? (
            <p className='mt-0.5 line-clamp-2 text-[11px] text-[#65686F] dark:text-gray-400'>
              {field.description}
            </p>
          ) : null}
        </div>
      </div>
      {field.fieldType && field.fieldType.toLowerCase() !== 'unknown' && (
        <span className='ml-3 flex-shrink-0 text-[11px] font-semibold uppercase text-[#65686F] dark:text-gray-400'>
          {field.fieldType}
        </span>
      )}
    </button>
  )
}

function DroppableRowCell({
  rowId,
  isOver,
  row,
  onUnmap
}: {
  rowId: string
  isOver: boolean
  row: MappingRow
  onUnmap: (id: string) => void
}) {
  const { setNodeRef } = useDroppable({
    id: `drop-row-${rowId}`
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[52px] items-center gap-2 px-6 py-2.5 transition-colors ${
        isOver
          ? 'bg-[#EFF6FF] ring-1 ring-inset ring-[#2563EB] dark:bg-blue-900/20'
          : ''
      }`}
    >
      {row.fieldName ? (
        <>
          <User className='h-4 w-4 flex-shrink-0 text-[#65686F] dark:text-gray-400' />
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-semibold text-[#21232C] dark:text-white'>
              {formatFieldName(row.fieldName, row.fieldApiName)}
            </p>
            <p className='truncate text-[11.8px] font-medium text-[#65686F] dark:text-gray-400'>
              {row.fieldType && row.fieldType.toLowerCase() !== 'unknown'
                ? `${row.fieldType}${row.fieldApiName ? ` • ${row.fieldApiName}` : ''}`
                : row.fieldApiName || ''}
            </p>
            {row.samples &&
              row.samples.length > 0 &&
              row.sharkdomKey !== 'dealId' &&
              row.sharkdomKey !== 'associatedCompanyId' && (
                <p className='mt-1 flex items-center gap-1 truncate text-xs font-normal text-green-600'>
                  <span className='font-semibold text-green-700'>Sample:</span>{' '}
                  <span className='italic'>&quot;{row.samples[0]}&quot;</span>
                </p>
              )}
          </div>
          {!row.required || row.isCustom ? (
            <button
              type='button'
              className='flex-shrink-0 text-[rgba(33,35,44,0.72)] hover:opacity-70'
              onClick={() => onUnmap(rowId)}
              aria-label={`Delete ${row.column}`}
            >
              <Trash2 className='h-4 w-4' />
            </button>
          ) : (
            <button
              type='button'
              className='flex-shrink-0 text-[rgba(33,35,44,0.72)] hover:opacity-70'
              onClick={() => onUnmap(rowId)}
              aria-label={`Edit ${row.column}`}
            >
              <Pencil className='h-4 w-4' />
            </button>
          )}
        </>
      ) : (
        <div className='flex flex-1 items-center justify-between gap-2'>
          <span className='text-[13px] font-medium italic text-[#65686F] dark:text-gray-400'>
            Drop a field to map
          </span>
          {(!row.required || row.isCustom) && (
            <button
              type='button'
              className='flex-shrink-0 text-[rgba(33,35,44,0.72)] hover:opacity-70'
              onClick={() => onUnmap(rowId)}
              aria-label={`Delete ${row.column}`}
            >
              <Trash2 className='h-4 w-4' />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function DroppableNewRowZone({ isOver }: { isOver: boolean }) {
  const { setNodeRef } = useDroppable({ id: 'drop-new-row' })

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center justify-center rounded border-2 border-dashed py-3 transition-all ${
        isOver
          ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-900/20'
          : 'border-[rgba(33,35,44,0.12)] text-[#65686F] hover:border-[#2563EB40] dark:border-border dark:text-gray-400'
      }`}
    >
      <span className='text-xs font-medium'>
        {isOver
          ? 'Release to add a new row'
          : 'Drop field here to add a new row'}
      </span>
    </div>
  )
}

export function FieldMappingContent({
  backBasePath = 'my-data',
  redirectTo
}: FieldMappingContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isGoogleSheetsColumnsLoading, setIsGoogleSheetsColumnsLoading] =
    useState(false)
  const [googleSheetsColumnsError, setGoogleSheetsColumnsError] = useState<
    string | null
  >(null)

  const enabledTabs = useMemo<Tab[]>(() => {
    const imports = searchParams.getAll('import')
    if (imports.length === 0) return ['Contacts', 'Companies', 'Deals']

    const tabs = ALL_TABS.map((tab) => tab.id).filter((tabId) =>
      imports.some((item) => IMPORT_TO_TAB[item.toLowerCase()] === tabId)
    )

    return tabs.length > 0 ? tabs : ['Contacts', 'Companies', 'Deals']
  }, [searchParams])

  const dataSource = useMemo<string>(() => {
    return (searchParams.get('source') || 'HUBSPOT').toUpperCase()
  }, [searchParams])

  const org = useSelector(
    (state: RootState) =>
      state.organization?.organizationData as OrganizationType
  )

  const {
    contacts: hubspotContactFields,
    companies: hubspotCompanyFields,
    deals: hubspotDealFields,
    isLoading: isHubspotMetadataLoading,
    error: hubspotMetadataError
  } = useHubspotMetadata(
    dataSource === 'HUBSPOT' ? org?.id : undefined,
    dataSource !== 'HUBSPOT'
  )

  const {
    contacts: sfContactFields,
    companies: sfCompanyFields,
    deals: sfDealFields,
    isLoading: isSfMetadataLoading,
    error: sfMetadataError
  } = useSalesforceMetadata(
    dataSource === 'SALESFORCE' ? org?.id : undefined,
    dataSource !== 'SALESFORCE'
  )

  const {
    contacts: zohoContactFields,
    companies: zohoCompanyFields,
    deals: zohoDealFields,
    isLoading: isZohoMetadataLoading,
    error: zohoMetadataError
  } = useZohoMetadata(
    dataSource === 'ZOHO' ? org?.id : undefined,
    dataSource !== 'ZOHO'
  )

  const contactFields =
    dataSource === 'SALESFORCE'
      ? sfContactFields
      : dataSource === 'ZOHO'
        ? zohoContactFields
        : hubspotContactFields
  const companyFields =
    dataSource === 'SALESFORCE'
      ? sfCompanyFields
      : dataSource === 'ZOHO'
        ? zohoCompanyFields
        : hubspotCompanyFields
  const dealFields =
    dataSource === 'SALESFORCE'
      ? sfDealFields
      : dataSource === 'ZOHO'
        ? zohoDealFields
        : hubspotDealFields
  const isMetadataLoading =
    dataSource === 'SALESFORCE'
      ? isSfMetadataLoading
      : dataSource === 'ZOHO'
        ? isZohoMetadataLoading
        : dataSource === 'GOOGLE_SHEET'
          ? isGoogleSheetsColumnsLoading
          : isHubspotMetadataLoading
  const metadataError =
    dataSource === 'SALESFORCE'
      ? sfMetadataError
      : dataSource === 'ZOHO'
        ? zohoMetadataError
        : dataSource === 'GOOGLE_SHEET'
          ? googleSheetsColumnsError
          : hubspotMetadataError

  const createPersonaOverlapRecord = useCreatePersonaOverlapRecord()

  const [isLoadingValidate, setIsLoadingValidate] = useState(false)
  const [isInitialSamplesFetched, setIsInitialSamplesFetched] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      sessionStorage.getItem('__sharkdom_mapping_samplesFetched') === 'true'
    )
  })
  const [rowsByTab, setRowsByTab] = useState<RowsByTab>(() => {
    if (typeof window === 'undefined')
      return { Contacts: [], Companies: [], Deals: [] }
    try {
      const cached = sessionStorage.getItem('__sharkdom_mapping_rowsByTab')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed.Contacts || parsed.Companies || parsed.Deals) return parsed
      }
    } catch {}
    return { Contacts: [], Companies: [], Deals: [] }
  })
  const [overId, setOverId] = useState<string | null>(null)
  const [activeField, setActiveField] = useState<SharkdomField | null>(null)
  const [fieldsOpen, setFieldsOpen] = useState(true)

  // Persist rowsByTab to sessionStorage whenever it changes (skip empty initial state)
  useEffect(() => {
    const hasRows = Object.values(rowsByTab).some((rows) => rows.length > 0)
    if (!hasRows) return
    try {
      sessionStorage.setItem(
        '__sharkdom_mapping_rowsByTab',
        JSON.stringify(rowsByTab)
      )
    } catch {
      // sessionStorage may be full; non-critical
    }
  }, [rowsByTab])

  // Persist isInitialSamplesFetched flag
  useEffect(() => {
    if (isInitialSamplesFetched) {
      sessionStorage.setItem('__sharkdom_mapping_samplesFetched', 'true')
    }
  }, [isInitialSamplesFetched])

  const recordType = useMemo<MappingRecordType>(() => {
    const type = searchParams.get('recordType')?.toUpperCase()
    if (type === 'CUSTOMER' || type === 'PROSPECT' || type === 'OPPORTUNITY') {
      return type
    }
    return 'PROSPECT'
  }, [searchParams])

  const initialTab = useMemo<Tab>(() => {
    const type = searchParams.get('recordType')?.toUpperCase()
    if (type === 'CUSTOMER') return 'Companies'
    if (type === 'OPPORTUNITY') return 'Deals'
    return 'Contacts'
  }, [searchParams])

  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  useEffect(() => {
    const targetTab =
      recordType === 'PROSPECT'
        ? 'Contacts'
        : recordType === 'CUSTOMER'
          ? 'Companies'
          : 'Deals'
    if (activeTab !== targetTab) {
      setActiveTab(targetTab)
    }
  }, [recordType])

  const [searchQuery, setSearchQuery] = useState('')
  const [salesforceFieldMapping] = useState<Record<string, string>>({})
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])

  const sheetUrl = searchParams.get('sheetUrl') || ''

  const [localCsvData, setLocalCsvData] = useState<any[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const storedData = sessionStorage.getItem('csvData')
      return storedData ? JSON.parse(storedData) : []
    } catch {
      return []
    }
  })

  const [sheetColumnsByTab, setSheetColumnsByTab] = useState<
    Record<Tab, string[]>
  >({
    Contacts: [],
    Companies: [],
    Deals: []
  })

  const getSheetConfigForTab = useCallback(
    (tab: Tab) => {
      const sheetLayout = searchParams.get('sheetLayout') || 'single'
      if (sheetLayout === 'multi-file') {
        if (tab === 'Contacts')
          return {
            url: searchParams.get('sheetUrlContacts') || '',
            tabName: ''
          }
        if (tab === 'Companies')
          return {
            url: searchParams.get('sheetUrlCompanies') || '',
            tabName: ''
          }
        if (tab === 'Deals')
          return { url: searchParams.get('sheetUrlDeals') || '', tabName: '' }
      } else if (sheetLayout === 'multi-tab') {
        const url = searchParams.get('sheetUrl') || ''
        if (tab === 'Contacts')
          return { url, tabName: searchParams.get('sheetTabContacts') || '' }
        if (tab === 'Companies')
          return { url, tabName: searchParams.get('sheetTabCompanies') || '' }
        if (tab === 'Deals')
          return { url, tabName: searchParams.get('sheetTabDeals') || '' }
      }
      return { url: searchParams.get('sheetUrl') || '', tabName: '' }
    },
    [searchParams]
  )

  useEffect(() => {
    if (dataSource === 'GOOGLE_SHEET') {
      const fetchAllSheetColumns = async () => {
        console.group('[DEBUG] Fetch All Sheet Columns Executing')
        const totalStart = performance.now()
        setIsGoogleSheetsColumnsLoading(true)
        setGoogleSheetsColumnsError(null)
        try {
          const resolvedCols: Partial<Record<Tab, string[]>> = {}
          for (const tab of enabledTabs) {
            const { url: tabUrl, tabName } = getSheetConfigForTab(tab)
            if (!tabUrl) {
              console.log(
                `[DEBUG] No tabUrl config found for tab: ${tab}, skipping`
              )
              continue
            }

            console.group(
              `[DEBUG] Google Sheets columns lookup for tab: ${tab}`
            )
            console.log('[DEBUG] Config url:', tabUrl, 'tabName:', tabName)
            console.time(`[DEBUG] Column Resolution - ${tab}`)

            let cols: string[] | null = null
            const cacheStr =
              typeof window !== 'undefined'
                ? sessionStorage.getItem('__sharkdom_gsheet_discover_data')
                : null
            if (cacheStr) {
              try {
                const cache = JSON.parse(cacheStr)
                const spreadsheetId = getGoogleSheetIdFromUrl(tabUrl)
                console.log(
                  '[DEBUG] Cache available. Searching for spreadsheet:',
                  spreadsheetId
                )
                const spreadsheet = cache.spreadsheets?.find(
                  (s: any) => s.id === spreadsheetId
                )
                if (spreadsheet) {
                  console.log(
                    '[DEBUG] Spreadsheet found in cache:',
                    spreadsheet.name
                  )
                  let sheet = null
                  if (tabName) {
                    sheet = spreadsheet.sheets?.find(
                      (sh: any) =>
                        sh.title.toLowerCase() === tabName.toLowerCase()
                    )
                    if (sheet) {
                      console.log(
                        `[DEBUG] Sheet with name "${tabName}" found in cache.`
                      )
                    } else {
                      console.warn(
                        `[DEBUG] Sheet with name "${tabName}" NOT found in cache.`
                      )
                    }
                  }
                  if (!sheet) {
                    sheet = spreadsheet.sheets?.[0]
                    if (sheet) {
                      console.log(
                        '[DEBUG] Falling back to the first sheet in the list:',
                        sheet.title
                      )
                    }
                  }
                  if (sheet) {
                    cols = sheet.columns || sheet.rows?.[0] || []
                    console.log(
                      `[DEBUG] Columns resolved from cache (${cols.length} cols):`,
                      cols
                    )
                  } else {
                    console.warn(
                      '[DEBUG] No sheet could be resolved from cache.'
                    )
                  }
                } else {
                  console.warn(
                    '[DEBUG] Spreadsheet ID not found in discover cache.'
                  )
                }
              } catch (e) {
                console.error(
                  '[DEBUG] Error reading columns from discover cache:',
                  e
                )
              }
            } else {
              console.log(
                '[DEBUG] Discover cache is not present in sessionStorage.'
              )
            }

            if (cols !== null) {
              console.log(`[DEBUG] Column cache hit success for ${tab}.`)
              console.timeEnd(`[DEBUG] Column Resolution - ${tab}`)
              console.groupEnd()
              resolvedCols[tab] = cols
            } else {
              console.log(
                `[DEBUG] Column cache miss for ${tab}. Requesting API fallback...`
              )
              const startApi = performance.now()
              const res = await axios.get(
                `/api/google-sheets/columns?sheetUrl=${tabUrl}${tabName ? `&tabName=${encodeURIComponent(tabName)}` : ''}`,
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              )
              const duration = performance.now() - startApi
              console.log(
                `[DEBUG] API call completed in ${duration.toFixed(2)}ms. Status:`,
                res?.status
              )

              if (res?.status === 200 && Array.isArray(res?.data?.data)) {
                resolvedCols[tab] = res.data.data
                console.log(
                  `[DEBUG] Columns fetched successfully from API (${res.data.data.length} cols):`,
                  res.data.data
                )
              } else {
                console.timeEnd(`[DEBUG] Column Resolution - ${tab}`)
                console.groupEnd()
                throw new Error(
                  res?.data?.error ||
                    `Failed to fetch Google Sheets columns for ${tab}`
                )
              }
              console.timeEnd(`[DEBUG] Column Resolution - ${tab}`)
              console.groupEnd()
            }
          }

          setSheetColumnsByTab((prev) => {
            let changed = false
            const next = { ...prev }
            for (const key of Object.keys(resolvedCols) as Tab[]) {
              const prevVal = prev[key] || []
              const newVal = resolvedCols[key] || []
              if (
                prevVal.length !== newVal.length ||
                !prevVal.every((val, index) => val === newVal[index])
              ) {
                next[key] = newVal
                changed = true
              }
            }
            if (changed) {
              console.log(
                '[DEBUG] Columns state changed, updating sheetColumnsByTab state'
              )
            } else {
              console.log(
                '[DEBUG] Columns state is identical, skipping state update to prevent loop'
              )
            }
            return changed ? next : prev
          })

          console.log(
            `[DEBUG] Finished resolving columns for all tabs. Total elapsed: ${(performance.now() - totalStart).toFixed(2)}ms`
          )
        } catch (err: any) {
          console.error('[DEBUG] Failed to fetch Google Sheets columns:', err)
          setGoogleSheetsColumnsError(
            err?.message || 'Failed to fetch Google Sheets columns'
          )
          showCustomToast(
            'Error',
            err?.message || 'Failed to fetch Google Sheets columns',
            'error',
            5000
          )
        } finally {
          setIsGoogleSheetsColumnsLoading(false)
          console.groupEnd()
        }
      }
      fetchAllSheetColumns()
    }
  }, [dataSource, enabledTabs, getSheetConfigForTab, showCustomToast])

  const sheetFieldsByTab = useMemo<Record<Tab, SharkdomField[]>>(() => {
    const result: Record<Tab, SharkdomField[]> = {
      Contacts: [],
      Companies: [],
      Deals: []
    }
    if (dataSource !== 'GOOGLE_SHEET') return result
    ;(Object.keys(sheetColumnsByTab) as Tab[]).forEach((tab) => {
      const headers = sheetColumnsByTab[tab] || []
      result[tab] = headers.filter(Boolean).map((col) => ({
        name: col,
        apiName: col,
        fieldType: 'string',
        type: 'string',
        groupName: 'Sheet Column',
        description: `Column: ${col}`
      }))
    })
    return result
  }, [dataSource, sheetColumnsByTab])

  const sheetFields = useMemo<SharkdomField[]>(() => {
    return sheetFieldsByTab[activeTab] || []
  }, [sheetFieldsByTab, activeTab])

  const visibleSharkdomProperties = useMemo(() => {
    const properties = SHARKDOM_PROPERTIES_BY_RECORD_TYPE[recordType] ?? []

    // Hide Owner ID and Account ID fields globally from frontend mapping
    return properties.filter(
      (property) =>
        property.key !== 'dealOwner' &&
        property.key !== 'contactOwner' &&
        property.key !== 'ownerId' &&
        property.key !== 'accountId'
    )
  }, [recordType])

  useEffect(() => {
    if (!enabledTabs.includes(activeTab)) {
      setActiveTab(enabledTabs[0] ?? 'Contacts')
    }
  }, [enabledTabs, activeTab])

  const allFieldsForTab = useMemo<SharkdomField[]>(() => {
    // For Google Sheets, all tabs share the same flat sheet column list
    if (dataSource === 'GOOGLE_SHEET') return sheetFields
    switch (activeTab) {
      case 'Contacts':
        return contactFields
      case 'Companies':
        return companyFields
      case 'Deals':
        return dealFields
      default:
        return []
    }
  }, [
    activeTab,
    contactFields,
    companyFields,
    dealFields,
    dataSource,
    sheetFields
  ])

  const rows = useMemo(() => rowsByTab[activeTab] ?? [], [rowsByTab, activeTab])

  const mappedFieldApiNames = useMemo(() => {
    return new Set(
      rows
        .map((row) => row.fieldApiName)
        .filter((apiName): apiName is string => Boolean(apiName))
    )
  }, [rows])

  useEffect(() => {
    const tabFieldsMap: Record<Tab, SharkdomField[]> = {
      Contacts:
        dataSource === 'GOOGLE_SHEET'
          ? sheetFieldsByTab.Contacts
          : contactFields,
      Companies:
        dataSource === 'GOOGLE_SHEET'
          ? sheetFieldsByTab.Companies
          : companyFields,
      Deals: dataSource === 'GOOGLE_SHEET' ? sheetFieldsByTab.Deals : dealFields
    }

    const tabToRecordType: Record<Tab, MappingRecordType> = {
      Contacts: 'PROSPECT',
      Companies: 'CUSTOMER',
      Deals: 'OPPORTUNITY'
    }

    setRowsByTab((prev) => {
      const next: RowsByTab = { ...prev }

      ;(Object.keys(tabFieldsMap) as Tab[]).forEach((tab) => {
        const fields = tabFieldsMap[tab]
        const usedApiNames = new Set<string>()
        const targetRecordType = tabToRecordType[tab]
        const tabProperties =
          SHARKDOM_PROPERTIES_BY_RECORD_TYPE[targetRecordType] ?? []

        const schemaRows: MappingRow[] = tabProperties.map((property) => {
          const matchedField = findBestFieldMatch(
            property,
            fields,
            usedApiNames
          )

          const previousRow = (prev[tab] ?? []).find(
            (row) => row.sharkdomKey === property.key && !row.isCustom
          )

          if (previousRow?.fieldApiName) {
            return previousRow
          }

          return {
            id: `schema-${targetRecordType}-${tab}-${property.key}`,
            column: property.label,
            samples: [],
            mapped: Boolean(matchedField),
            fieldName: matchedField?.name ?? null,
            fieldType: matchedField?.fieldType ?? null,
            fieldApiName: matchedField?.apiName ?? null,
            sharkdomKey: property.key,
            required: Boolean(property.required),
            isCustom: false
          }
        })

        const existingCustomRows = (prev[tab] ?? []).filter(
          (row) => row.isCustom
        )
        next[tab] = [...schemaRows, ...existingCustomRows]
      })

      return next
    })
  }, [contactFields, companyFields, dealFields, sheetFieldsByTab, dataSource])

  useEffect(() => {
    if (
      (dataSource === 'HUBSPOT' || dataSource === 'SALESFORCE') &&
      org?.id &&
      !isMetadataLoading
    ) {
      if (isInitialSamplesFetched) return

      const tabToRecordType: Record<Tab, MappingRecordType> = {
        Contacts: 'PROSPECT',
        Companies: 'CUSTOMER',
        Deals: 'OPPORTUNITY'
      }

      const isRowsPopulated = enabledTabs.every(
        (tab) => (rowsByTab[tab]?.length ?? 0) > 0
      )
      if (!isRowsPopulated) return

      const fetchAllSamples = async () => {
        try {
          const nextRowsByTab = { ...rowsByTab }
          let hasChanges = false

          for (const tab of enabledTabs) {
            const targetRecordType = tabToRecordType[tab]
            const tabRows = rowsByTab[tab] ?? []
            const activeMappedFields = tabRows
              .map((r) => r.fieldApiName)
              .filter(Boolean) as string[]

            if (activeMappedFields.length > 0) {
              try {
                let response
                if (dataSource === 'SALESFORCE') {
                  response = await getSalesforceData(
                    org.id,
                    activeMappedFields.filter(
                      (c) =>
                        c !== 'associatedCompanyId' &&
                        c !== 'associatedContactId'
                    ),
                    targetRecordType
                  )
                } else {
                  response = await getHubspotDataBasedOnColumns(
                    org.id,
                    activeMappedFields.filter(
                      (c) =>
                        c !== 'associatedCompanyId' &&
                        c !== 'associatedContactId'
                    ),
                    targetRecordType
                  )
                }

                const rawRecords = Array.isArray(response?.results)
                  ? response.results
                  : Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response?.records)
                      ? response.records
                      : []

                const nextTabRows = tabRows.map((row) => {
                  if (!row.fieldApiName) return row

                  const samples: string[] = []
                  for (const item of rawRecords) {
                    const sourceObject =
                      item?.properties && typeof item.properties === 'object'
                        ? item.properties
                        : item
                    const val =
                      sourceObject?.[row.fieldApiName] ??
                      item?.[row.fieldApiName]
                    if (
                      val !== undefined &&
                      val !== null &&
                      String(val).trim() !== ''
                    ) {
                      samples.push(String(val).trim())
                      if (samples.length >= 3) break
                    }
                  }
                  return { ...row, samples }
                })

                nextRowsByTab[tab] = nextTabRows
                hasChanges = true
              } catch (err) {
                console.error(`Failed to load samples for ${tab}:`, err)
              }
            }
          }

          if (hasChanges) {
            setRowsByTab(nextRowsByTab)
          }
        } finally {
          setIsInitialSamplesFetched(true)
        }
      }

      fetchAllSamples()
    } else if (dataSource !== 'HUBSPOT' && !isMetadataLoading) {
      setIsInitialSamplesFetched(true)
    }
  }, [
    dataSource,
    org?.id,
    isMetadataLoading,
    isInitialSamplesFetched,
    enabledTabs,
    rowsByTab
  ])

  const normalizedSearch = searchQuery.trim().toLowerCase()

  const filteredFields = useMemo(() => {
    const uniqueFields = allFieldsForTab.filter(
      (field, index, arr) =>
        arr.findIndex((item) => item.apiName === field.apiName) === index
    )

    const EXACT_ALLOWED_SOURCE_FIELDS_BY_TAB: Record<Tab, string[]> = {
      Companies: [
        'name',
        'domain',
        'website', // sf
        'industry',
        'hs_num_employees',
        'numberofemployees', // sf
        'country',
        'billingcountry', // sf
        'linkedin_company_page',
        'linkedin url',
        'linkedin_url__c', // sf
        'annualrevenue',
        'annual revenue',
        'description',
        'phone',
        'city',
        'billingcity' // sf
      ],
      Contacts: [
        'email',
        'firstname',
        'lastname',
        'jobtitle',
        'title', // sf
        'hs_lead_status',
        'lead status',
        'leadsource', // sf
        'status', // sf
        'linkedinbio',
        'hs_linkedin_url',
        'linkedin url',
        'linkedin_url__c', // sf
        'phone',
        'hs_lastactivitydate',
        'notes_last_updated',
        'last activity date',
        'lastactivitydate' // sf
      ],
      Deals: [
        'dealname',
        'deal name',
        'name', // sf
        'dealstage',
        'deal stage',
        'stagename', // sf
        'amount',
        'closedate',
        'close date',
        'pipeline',
        'recordtype', // sf
        'hs_lastactivitydate',
        'notes_last_updated',
        'last activity date',
        'lastactivitydate', // sf
        'dealtype',
        'deal type',
        'type', // sf
        'opportunitycontactrole' // sf
      ]
    }

    const allowedExactMatches = new Set(
      (EXACT_ALLOWED_SOURCE_FIELDS_BY_TAB[activeTab] || []).map((v) =>
        v.toLowerCase()
      )
    )

    const whitelistedFields = uniqueFields.filter((field) => {
      // Google Sheets and Zoho: show all columns, no whitelist filtering
      if (dataSource === 'ZOHO' || dataSource === 'GOOGLE_SHEET') return true

      const normalizedName = field.name.toLowerCase().trim()
      const normalizedApi = field.apiName.toLowerCase().trim()
      return (
        allowedExactMatches.has(normalizedName) ||
        allowedExactMatches.has(normalizedApi)
      )
    })

    const availableFields = whitelistedFields.filter(
      (field) => !mappedFieldApiNames.has(field.apiName)
    )

    if (!normalizedSearch) return availableFields

    return availableFields.filter((field) => {
      const readableApiName = field.apiName.replace(/_/g, ' ').toLowerCase()
      const haystack = [
        field.name,
        field.apiName,
        readableApiName,
        field.type,
        field.fieldType,
        field.groupName,
        field.description
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedSearch)
    })
  }, [allFieldsForTab, mappedFieldApiNames, normalizedSearch])

  const mappedCount = useMemo(
    () => rows.filter((row) => row.mapped && row.fieldName).length,
    [rows]
  )

  const requiredMappingsDone = useMemo(() => {
    return rows
      .filter((row) => row.required)
      .every((row) => Boolean(row.fieldName))
  }, [rows])

  const allRows = useMemo<MappingRow[]>(
    () => Object.values(rowsByTab).flat(),
    [rowsByTab]
  )

  const selectedMapping = useMemo<Record<string, string>>(() => {
    const mapping: Record<string, string> = {}

    allRows.forEach((row) => {
      if (!row.sharkdomKey) return
      if (!row.fieldApiName) return
      mapping[row.sharkdomKey] = row.fieldApiName
    })

    return mapping
  }, [allRows])

  const getSanitizedSelectedMapping = useCallback(() => {
    return Object.entries(selectedMapping).reduce(
      (acc, [key, value]) => {
        if (!value || value === 'dont_import') return acc
        acc[key] = value
        return acc
      },
      {} as Record<string, string>
    )
  }, [selectedMapping])

  const isAllFieldsMapped = useMemo(() => {
    return visibleSharkdomProperties
      .filter((property) => property.required)
      .every((property) => Boolean(selectedMapping[property.key]))
  }, [visibleSharkdomProperties, selectedMapping])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }
    })
  )

  const fetchSampleForField = useCallback(
    async (fieldApiName: string, targetRecordType: MappingRecordType) => {
      if (!org?.id || !fieldApiName || fieldApiName === 'dont_import') return []
      try {
        const response = await getHubspotDataBasedOnColumns(
          org.id,
          [fieldApiName].filter(
            (c) => c !== 'associatedCompanyId' && c !== 'associatedContactId'
          ),
          targetRecordType
        )
        const rawRecords = Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response?.data)
            ? response.data
            : []

        const samples: string[] = []
        for (const item of rawRecords) {
          const sourceObject =
            item?.properties && typeof item.properties === 'object'
              ? item.properties
              : item
          const val = sourceObject?.[fieldApiName] ?? item?.[fieldApiName]
          if (val !== undefined && val !== null && String(val).trim() !== '') {
            samples.push(String(val).trim())
            if (samples.length >= 3) break
          }
        }
        return samples
      } catch (e) {
        console.error('Failed to fetch sample for field:', fieldApiName, e)
        return []
      }
    },
    [org?.id]
  )

  function handleDragStart(event: DragStartEvent) {
    setOverId(null)
    const field = event.active.data.current?.field as SharkdomField | undefined
    setActiveField(field ?? null)
  }

  function handleDragOver(event: DragOverEvent) {
    setOverId(event.over ? String(event.over.id) : null)
  }

  function applyFieldToRow(row: MappingRow, field: SharkdomField): MappingRow {
    return {
      ...row,
      mapped: true,
      fieldName: field.name,
      fieldType: field.fieldType,
      fieldApiName: field.apiName
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setOverId(null)
    const field = event.active.data.current?.field as SharkdomField | undefined
    const over = event.over
    setActiveField(null)

    if (!field || !over) return

    const dropId = String(over.id)

    if (dropId === 'drop-new-row') {
      const customRowId = `custom-${activeTab}-${Date.now()}`
      setRowsByTab((prev) => ({
        ...prev,
        [activeTab]: [
          ...(prev[activeTab] ?? []),
          {
            id: customRowId,
            column: field.name,
            samples: [],
            mapped: true,
            fieldName: field.name,
            fieldType: field.fieldType,
            fieldApiName: field.apiName,
            sharkdomKey: `custom-${field.apiName}`,
            required: false,
            isCustom: true
          }
        ]
      }))

      if (dataSource === 'HUBSPOT') {
        const tabToRecordType: Record<Tab, MappingRecordType> = {
          Contacts: 'PROSPECT',
          Companies: 'CUSTOMER',
          Deals: 'OPPORTUNITY'
        }
        const targetRecordType = tabToRecordType[activeTab]

        fetchSampleForField(field.apiName, targetRecordType).then((samples) => {
          if (samples.length > 0) {
            setRowsByTab((prev) => ({
              ...prev,
              [activeTab]: (prev[activeTab] ?? []).map((row) =>
                row.id === customRowId ? { ...row, samples } : row
              )
            }))
          }
        })
      }
      return
    }

    if (dropId.startsWith('drop-row-')) {
      const targetRowId = dropId.replace('drop-row-', '')
      setRowsByTab((prev) => ({
        ...prev,
        [activeTab]: (prev[activeTab] ?? []).map((row) =>
          row.id === targetRowId ? applyFieldToRow(row, field) : row
        )
      }))

      if (dataSource === 'HUBSPOT') {
        const tabToRecordType: Record<Tab, MappingRecordType> = {
          Contacts: 'PROSPECT',
          Companies: 'CUSTOMER',
          Deals: 'OPPORTUNITY'
        }
        const targetRecordType = tabToRecordType[activeTab]

        fetchSampleForField(field.apiName, targetRecordType).then((samples) => {
          if (samples.length > 0) {
            setRowsByTab((prev) => ({
              ...prev,
              [activeTab]: (prev[activeTab] ?? []).map((row) =>
                row.id === targetRowId ? { ...row, samples } : row
              )
            }))
          }
        })
      }
    }
  }

  function handleUnmap(rowId: string) {
    setRowsByTab((prev) => ({
      ...prev,
      [activeTab]: (prev[activeTab] ?? []).flatMap((row) => {
        if (row.id !== rowId) return row

        if (row.required) {
          return {
            ...row,
            mapped: false,
            fieldName: null,
            fieldType: null,
            fieldApiName: null,
            samples: []
          }
        }

        // If the row is optional (required === false) or custom, delete it completely!
        return []
      })
    }))
  }

  const handleGetHubspotColumnsData = useCallback(
    async (
      targetRecordType = recordType,
      targetSelectedMapping = getSanitizedSelectedMapping()
    ) => {
      let uniqueColumns = getUniqueValuesFromObject(
        targetSelectedMapping
      ).filter((value) => value && value !== 'dont_import') as string[]

      if (targetRecordType === 'PROSPECT' && targetSelectedMapping.fullName) {
        if (!uniqueColumns.includes('firstname'))
          uniqueColumns.push('firstname')
        if (!uniqueColumns.includes('lastname')) uniqueColumns.push('lastname')
        if (!uniqueColumns.includes('hsobjectid'))
          uniqueColumns.push('hsobjectid')
      }

      if (targetRecordType === 'PROSPECT') {
        if (!uniqueColumns.includes('associatedCompanyId')) {
          uniqueColumns.push('associatedCompanyId')
        }
        if (!uniqueColumns.includes('hubspot_owner_id')) {
          uniqueColumns.push('hubspot_owner_id')
        }
      }

      if (targetRecordType === 'OPPORTUNITY') {
        if (!uniqueColumns.includes('associatedCompanyId')) {
          uniqueColumns.push('associatedCompanyId')
        }
        if (!uniqueColumns.includes('associatedContactId')) {
          uniqueColumns.push('associatedContactId')
        }
        if (!uniqueColumns.includes('dealId')) {
          uniqueColumns.push('dealId')
        }
      }

      const response = await getHubspotDataBasedOnColumns(
        org?.id,
        uniqueColumns.filter(
          (c) =>
            c !== 'associatedCompanyId' &&
            c !== 'associatedContactId' &&
            c !== 'dealId'
        ),
        targetRecordType
      )
      const rawRecords = Array.isArray(response?.results)
        ? response.results
        : Array.isArray(response?.data)
          ? response.data
          : []

      const records = rawRecords.map((item: any) =>
        item?.id !== undefined && item?.id !== null
          ? { ...item, contactId: String(item.id) }
          : item
      )

      let associatedCompanyIdsByContactId: Record<string, string> = {}
      if (targetRecordType === 'PROSPECT' && records.length > 0) {
        const contactIds = records
          .map((r: any) => String(r.id || ''))
          .filter(Boolean)
        try {
          const res = await getHubspotContactCompaniesBatch(
            org?.id || 0,
            contactIds
          )
          associatedCompanyIdsByContactId = res || {}
        } catch (e) {
          console.error('Failed to batch fetch contact companies:', e)
          associatedCompanyIdsByContactId = {}
        }
      }

      let associatedCompanyIdsByDealId: Record<string, string> = {}
      if (targetRecordType === 'OPPORTUNITY' && records.length > 0) {
        const dealIds = records
          .map((r: any) => String(r.id || ''))
          .filter(Boolean)
        try {
          const res = await getHubspotDealCompaniesBatch(org?.id || 0, dealIds)
          associatedCompanyIdsByDealId = res || {}
        } catch (e) {
          console.error('Failed to batch fetch deal companies:', e)
          associatedCompanyIdsByDealId = {}
        }
      }

      const data = records.map((item: any) => {
        const sourceObject =
          item?.properties && typeof item.properties === 'object'
            ? item.properties
            : item

        const itemId = String(item.id || '')

        return uniqueColumns.map((k: string) => {
          if (k === 'associatedCompanyId') {
            if (targetRecordType === 'PROSPECT') {
              return associatedCompanyIdsByContactId[itemId] ?? ''
            }
            if (targetRecordType === 'OPPORTUNITY') {
              return associatedCompanyIdsByDealId[itemId] ?? ''
            }
          }
          if (k === 'associatedContactId') {
            return associatedCompanyIdsByDealId[itemId] ?? ''
          }
          if (k === 'dealId') {
            return itemId
          }
          return sourceObject?.[k] ?? item?.[k] ?? ''
        })
      })

      console.log(
        `[MANUAL VERIFICATION] HubSpot Raw Records for ${targetRecordType}:`,
        records
      )
      console.log(`[MANUAL VERIFICATION] Extracted Preview Data:`, data)

      return { data, records, uniqueColumns }
    },
    [getSanitizedSelectedMapping, recordType, org?.id]
  )

  const handleGetPipedriveColumnsData = useCallback(async () => {
    const uniqueColumns = getUniqueValuesFromObject(selectedMapping).filter(
      (value) => value && value !== 'dont_import'
    ) as string[]

    const result = await getPipedriveData(org?.id, uniqueColumns)

    const data = (result?.data ?? []).map((item: any) =>
      uniqueColumns.map(
        (fieldKey: string) =>
          item?.[fieldKey] ?? item?.properties?.[fieldKey] ?? ''
      )
    )

    return { data, uniqueColumns }
  }, [selectedMapping, org?.id])

  const handleGetZohoColumnsData = useCallback(
    async (
      targetRecordType = recordType,
      targetSelectedMapping = getSanitizedSelectedMapping()
    ) => {
      const uniqueColumns = getUniqueValuesFromObject(
        targetSelectedMapping
      ).filter((value) => value && value !== 'dont_import') as string[]

      if (targetRecordType === 'PROSPECT') {
        if (!uniqueColumns.includes('id')) uniqueColumns.push('id')
        if (!uniqueColumns.includes('Owner')) uniqueColumns.push('Owner')
      } else if (targetRecordType === 'OPPORTUNITY') {
        if (!uniqueColumns.includes('id')) uniqueColumns.push('id')
        if (!uniqueColumns.includes('Owner')) uniqueColumns.push('Owner')
      }

      const zohoData = await getZohoData(targetRecordType)

      const data = (zohoData ?? []).map((obj: any) =>
        uniqueColumns.map((k: string) => {
          if (k === 'id') return obj?.id ?? ''
          if (k === 'Owner') {
            const raw = obj?.Owner
            let value = ''
            if (typeof raw === 'object' && raw !== null && raw.id) {
              value = String(raw.id).trim()
            } else if (raw !== null && raw !== undefined) {
              value = String(raw).trim()
            }
            return value
          }
          return obj?.[k] ?? ''
        })
      )

      return { data, uniqueColumns }
    },
    [getSanitizedSelectedMapping, recordType]
  )

  const handleGetSalesforceColumnsData = useCallback(
    async (
      targetRecordType = recordType,
      targetSelectedMapping = getSanitizedSelectedMapping()
    ) => {
      let uniqueColumns = getUniqueValuesFromObject(
        targetSelectedMapping
      ).filter((value) => value && value !== 'dont_import') as string[]

      if (targetRecordType === 'PROSPECT') {
        if (targetSelectedMapping.fullName) {
          if (!uniqueColumns.includes('FirstName'))
            uniqueColumns.push('FirstName')
          if (!uniqueColumns.includes('LastName'))
            uniqueColumns.push('LastName')
        }
        if (!uniqueColumns.includes('Id')) uniqueColumns.push('Id')
        if (!uniqueColumns.includes('OwnerId')) uniqueColumns.push('OwnerId')
        if (!uniqueColumns.includes('AccountId'))
          uniqueColumns.push('AccountId')
      } else if (targetRecordType === 'OPPORTUNITY') {
        if (!uniqueColumns.includes('Id')) uniqueColumns.push('Id')
        if (!uniqueColumns.includes('OwnerId')) uniqueColumns.push('OwnerId')
        if (!uniqueColumns.includes('AccountId'))
          uniqueColumns.push('AccountId')
      }

      const fieldNames = uniqueColumns.map(
        (label) => salesforceFieldMapping[label] || label
      )

      const result = await getSalesforceData(
        org?.id,
        fieldNames,
        targetRecordType
      )
      const records = Array.isArray(result?.records) ? result.records : []

      const data = records.map((record: any) =>
        uniqueColumns.map((label: string) => {
          const fieldName = salesforceFieldMapping[label] || label
          return record?.[fieldName] ?? ''
        })
      )

      return { data, uniqueColumns, records }
    },
    [getSanitizedSelectedMapping, recordType, salesforceFieldMapping, org?.id]
  )

  const handleValidateAndUpload = async () => {
    setIsLoadingValidate(true)

    try {
      const sanitizedSelectedMapping = getSanitizedSelectedMapping()
      let finalCsvData: any[] = Array.isArray(localCsvData) ? localCsvData : []

      if (Object.keys(sanitizedSelectedMapping).length === 0) {
        throw new Error('Please map at least one field before continuing.')
      }

      if (dataSource === 'GOOGLE_SHEET') {
        console.group('[DEBUG] Processing Google Sheet data for import')
        const processingStart = performance.now()
        for (const tab of enabledTabs) {
          const tabRows = rowsByTab[tab] ?? []
          const tabMapping: Record<string, string> = {}
          tabRows.forEach((row) => {
            if (
              row.sharkdomKey &&
              row.fieldApiName &&
              row.fieldApiName !== 'dont_import'
            ) {
              tabMapping[row.sharkdomKey] = row.fieldApiName
            }
          })

          const mappedColumns = Object.values(tabMapping).filter(
            (value) => value && value !== 'dont_import'
          ) as string[]

          if (mappedColumns.length === 0) {
            console.log(`[DEBUG] No columns mapped for tab: ${tab}, skipping`)
            continue
          }

          const { url: tabUrl, tabName } = getSheetConfigForTab(tab)
          if (!tabUrl) {
            console.log(
              `[DEBUG] No tabUrl configured for tab: ${tab}, skipping`
            )
            continue
          }

          const sheetId = getGoogleSheetIdFromUrl(tabUrl)
          if (!sheetId) {
            console.groupEnd()
            throw new Error(`Invalid Google Sheet URL for ${tab}`)
          }

          console.group(`[DEBUG] Row data processing for tab: ${tab}`)
          console.log('[DEBUG] Spreadsheet ID:', sheetId, 'tabName:', tabName)
          console.log('[DEBUG] Mapped columns to extract:', mappedColumns)
          console.time(`[DEBUG] Row Extraction - ${tab}`)

          let rawData: any[] | null = null
          const cacheStr =
            typeof window !== 'undefined'
              ? sessionStorage.getItem('__sharkdom_gsheet_discover_data')
              : null
          if (cacheStr) {
            try {
              const cache = JSON.parse(cacheStr)
              console.log(
                '[DEBUG] Discover cache present. Finding spreadsheet in cache...'
              )
              const spreadsheet = cache.spreadsheets?.find(
                (s: any) => s.id === sheetId
              )
              if (spreadsheet) {
                console.log(
                  '[DEBUG] Spreadsheet found in cache:',
                  spreadsheet.name
                )
                let sheet = null
                if (tabName) {
                  sheet = spreadsheet.sheets?.find(
                    (sh: any) =>
                      sh.title.toLowerCase() === tabName.toLowerCase()
                  )
                  if (sheet) {
                    console.log(
                      `[DEBUG] Sheet with name "${tabName}" found in cache.`
                    )
                  } else {
                    console.warn(
                      `[DEBUG] Sheet with name "${tabName}" NOT found in cache.`
                    )
                  }
                }
                if (!sheet) {
                  sheet = spreadsheet.sheets?.[0]
                  if (sheet) {
                    console.log(
                      '[DEBUG] Falling back to the first sheet in the list:',
                      sheet.title
                    )
                  }
                }
                if (sheet && Array.isArray(sheet.rows)) {
                  const rows = sheet.rows
                  console.log(
                    `[DEBUG] Found ${rows.length} total rows in cache sheet.`
                  )
                  if (rows.length > 0) {
                    const headerRow = rows[0]
                    const selectedIndices = mappedColumns.map((col) =>
                      headerRow.indexOf(col)
                    )
                    console.log('[DEBUG] Column headers in sheet:', headerRow)
                    console.log(
                      '[DEBUG] Calculated column indices for mapped fields:',
                      selectedIndices
                    )

                    if (!selectedIndices.includes(-1)) {
                      rawData = rows
                        .slice(1)
                        .map((row) =>
                          selectedIndices.map((idx) => row[idx] || null)
                        )
                      console.log(
                        `[DEBUG] Successfully extracted ${rawData.length} rows in-memory from cache.`
                      )
                    } else {
                      const missingCols = mappedColumns.filter(
                        (col) => headerRow.indexOf(col) === -1
                      )
                      console.warn(
                        '[DEBUG] One or more mapped columns not found in sheet headers, falling back to API. Missing columns:',
                        missingCols
                      )
                    }
                  } else {
                    console.warn('[DEBUG] Cache sheet rows are empty.')
                  }
                } else {
                  console.warn(
                    '[DEBUG] Sheet could not be resolved or rows are not an array.'
                  )
                }
              } else {
                console.warn(
                  '[DEBUG] Spreadsheet ID not found in discover cache.'
                )
              }
            } catch (e) {
              console.error(
                '[DEBUG] Error reading row data from discover cache:',
                e
              )
            }
          } else {
            console.log(
              '[DEBUG] Discover cache is not present in sessionStorage.'
            )
          }

          if (rawData === null) {
            console.log(
              '[DEBUG] Cache extraction failed or skipped. Falling back to backend API call...'
            )
            const startApi = performance.now()
            const result = await axios.get(
              `/api/google-sheets/${sheetId}?selectedColumns=${mappedColumns.join(',')}${tabName ? `&tabName=${encodeURIComponent(tabName)}` : ''}`,
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )
            const duration = performance.now() - startApi
            console.log(
              `[DEBUG] API call completed in ${duration.toFixed(2)}ms. Status:`,
              result?.status
            )

            if (result?.status !== 200) {
              console.timeEnd(`[DEBUG] Row Extraction - ${tab}`)
              console.groupEnd()
              console.groupEnd()
              throw new Error(
                result?.data?.error ||
                  `Failed to fetch Google Sheets data for ${tab}`
              )
            }

            rawData = result?.data?.data || []
            console.log(`[DEBUG] Fetched ${rawData.length} rows from API.`)
          }

          const tabCsvData = [mappedColumns, ...rawData]
          const tabCsvKey = `__sharkdom_temp_csvData_${tab.toLowerCase()}`

          if (typeof window !== 'undefined') {
            ;(window as any)[tabCsvKey] = tabCsvData
            try {
              sessionStorage.setItem(tabCsvKey, JSON.stringify(tabCsvData))
              console.log(
                `[DEBUG] Saved temp CSV data to sessionStorage key "${tabCsvKey}". Rows count:`,
                tabCsvData.length
              )
            } catch (e) {
              sessionStorage.removeItem(tabCsvKey)
              console.warn(
                `[DEBUG] Failed to save temp CSV data for ${tab}:`,
                e
              )
            }
          }
          console.timeEnd(`[DEBUG] Row Extraction - ${tab}`)
          console.groupEnd()
        }

        // Also prepare the main active tab's finalCsvData for compatibility
        const mainTab =
          recordType === 'PROSPECT'
            ? 'Contacts'
            : recordType === 'CUSTOMER'
              ? 'Companies'
              : 'Deals'
        const mainTabCsvKey = `__sharkdom_temp_csvData_${mainTab.toLowerCase()}`
        if (typeof window !== 'undefined') {
          finalCsvData = (window as any)[mainTabCsvKey] || []
        }
        console.log(
          `[DEBUG] Google Sheet processing finished. Total elapsed: ${(performance.now() - processingStart).toFixed(2)}ms`
        )
        console.groupEnd()
      }

      if (dataSource === 'HUBSPOT') {
        const tabToRecordType: Record<Tab, MappingRecordType> = {
          Contacts: 'PROSPECT',
          Companies: 'CUSTOMER',
          Deals: 'OPPORTUNITY'
        }

        for (const tab of enabledTabs) {
          const targetRecordType = tabToRecordType[tab]
          const tabRows = rowsByTab[tab] ?? []
          const tabMapping: Record<string, string> = {}
          tabRows.forEach((row) => {
            if (
              row.sharkdomKey &&
              row.fieldApiName &&
              row.fieldApiName !== 'dont_import'
            ) {
              tabMapping[row.sharkdomKey] = row.fieldApiName
            }
          })

          try {
            const result: any = await handleGetHubspotColumnsData(
              targetRecordType,
              tabMapping
            )
            const { data, uniqueColumns } = result || {}
            const tabCsvData = [uniqueColumns || [], ...(data || [])]
            const tabCsvKey = `__sharkdom_temp_csvData_${tab.toLowerCase()}`

            if (typeof window !== 'undefined') {
              ;(window as any)[tabCsvKey] = tabCsvData
              try {
                sessionStorage.setItem(tabCsvKey, JSON.stringify(tabCsvData))
              } catch (e) {
                sessionStorage.removeItem(tabCsvKey)
                console.warn(`Failed to save temp CSV data for ${tab}:`, e)
              }
            }
          } catch (err: any) {
            console.error(`Failed to fetch HubSpot data for ${tab}:`, err)
          }
        }

        try {
          const result: any = await handleGetHubspotColumnsData()
          const { data, uniqueColumns } = result || {}
          finalCsvData = [uniqueColumns || [], ...(data || [])]
        } catch (err: any) {
          showCustomToast(
            'Error',
            err?.message || err?.msg || 'Failed to fetch HubSpot data',
            'error',
            5000
          )
          setIsLoadingValidate(false)
          return
        }
      }

      if (dataSource === 'PIPEDRIVE') {
        try {
          const result: any = await handleGetPipedriveColumnsData()
          const { data, uniqueColumns } = result || {}
          finalCsvData = [uniqueColumns || [], ...(data || [])]
        } catch (err: any) {
          showCustomToast(
            'Error',
            err?.message || err?.msg || 'Failed to fetch Pipedrive data',
            'error',
            5000
          )
          setIsLoadingValidate(false)
          return
        }
      }

      if (dataSource === 'ZOHO') {
        const tabToRecordType: Record<Tab, MappingRecordType> = {
          Contacts: 'PROSPECT',
          Companies: 'CUSTOMER',
          Deals: 'OPPORTUNITY'
        }

        for (const tab of enabledTabs) {
          const targetRecordType = tabToRecordType[tab]
          const tabRows = rowsByTab[tab] ?? []
          const tabMapping: Record<string, string> = {}
          tabRows.forEach((row) => {
            if (
              row.sharkdomKey &&
              row.fieldApiName &&
              row.fieldApiName !== 'dont_import'
            ) {
              tabMapping[row.sharkdomKey] = row.fieldApiName
            }
          })

          try {
            const result: any = await handleGetZohoColumnsData(
              targetRecordType,
              tabMapping
            )
            const { data, uniqueColumns } = result || {}
            const tabCsvData = [uniqueColumns || [], ...(data || [])]
            const tabCsvKey = `__sharkdom_temp_csvData_${tab.toLowerCase()}`

            if (typeof window !== 'undefined') {
              ;(window as any)[tabCsvKey] = tabCsvData
              try {
                sessionStorage.setItem(tabCsvKey, JSON.stringify(tabCsvData))
              } catch (e) {
                sessionStorage.removeItem(tabCsvKey)
                console.warn(`Failed to save temp Zoho CSV data for ${tab}:`, e)
              }
            }
          } catch (err: any) {
            console.error(`Failed to fetch Zoho data for ${tab}:`, err)
          }
        }

        try {
          const mainTab =
            recordType === 'PROSPECT'
              ? 'Contacts'
              : recordType === 'CUSTOMER'
                ? 'Companies'
                : 'Deals'
          const mainTabRows = rowsByTab[mainTab] ?? []
          const mainTabMapping: Record<string, string> = {}
          mainTabRows.forEach((row) => {
            if (
              row.sharkdomKey &&
              row.fieldApiName &&
              row.fieldApiName !== 'dont_import'
            ) {
              mainTabMapping[row.sharkdomKey] = row.fieldApiName
            }
          })

          const result: any = await handleGetZohoColumnsData(
            recordType,
            mainTabMapping
          )
          const { data, uniqueColumns } = result || {}
          finalCsvData = [uniqueColumns || [], ...(data || [])]
        } catch (err: any) {
          showCustomToast(
            'Error',
            err?.message || err?.msg || 'Failed to fetch Zoho data',
            'error',
            5000
          )
          setIsLoadingValidate(false)
          return
        }
      }

      if (dataSource === 'SALESFORCE') {
        const tabToRecordType: Record<Tab, MappingRecordType> = {
          Contacts: 'PROSPECT',
          Companies: 'CUSTOMER',
          Deals: 'OPPORTUNITY'
        }

        for (const tab of enabledTabs) {
          const targetRecordType = tabToRecordType[tab]
          const tabRows = rowsByTab[tab] ?? []
          const tabMapping: Record<string, string> = {}
          tabRows.forEach((row) => {
            if (
              row.sharkdomKey &&
              row.fieldApiName &&
              row.fieldApiName !== 'dont_import'
            ) {
              tabMapping[row.sharkdomKey] = row.fieldApiName
            }
          })

          try {
            const result: any = await handleGetSalesforceColumnsData(
              targetRecordType,
              tabMapping
            )
            const { data, uniqueColumns } = result || {}
            const tabCsvData = [uniqueColumns || [], ...(data || [])]
            const tabCsvKey = `__sharkdom_temp_csvData_${tab.toLowerCase()}`

            if (typeof window !== 'undefined') {
              ;(window as any)[tabCsvKey] = tabCsvData
              try {
                sessionStorage.setItem(tabCsvKey, JSON.stringify(tabCsvData))
              } catch (e) {
                sessionStorage.removeItem(tabCsvKey)
                console.warn(`Failed to save temp CSV data for ${tab}:`, e)
              }
            }
          } catch (err: any) {
            console.error(`Failed to fetch Salesforce data for ${tab}:`, err)
          }
        }

        try {
          const mainTab =
            recordType === 'PROSPECT'
              ? 'Contacts'
              : recordType === 'CUSTOMER'
                ? 'Companies'
                : 'Deals'
          const mainTabRows = rowsByTab[mainTab] ?? []
          const mainTabMapping: Record<string, string> = {}
          mainTabRows.forEach((row) => {
            if (
              row.sharkdomKey &&
              row.fieldApiName &&
              row.fieldApiName !== 'dont_import'
            ) {
              mainTabMapping[row.sharkdomKey] = row.fieldApiName
            }
          })

          const result: any = await handleGetSalesforceColumnsData(
            recordType,
            mainTabMapping
          )
          const { data, uniqueColumns } = result || {}
          finalCsvData = [uniqueColumns || [], ...(data || [])]
        } catch (err: any) {
          showCustomToast(
            'Error',
            err?.message || err?.msg || 'Failed to fetch Salesforce data',
            'error',
            5000
          )
          setIsLoadingValidate(false)
          return
        }
      }

      if (!finalCsvData || finalCsvData.length === 0) {
        showCustomToast(
          'Error',
          'No data found. Please ensure your data source contains valid data.',
          'error',
          5000
        )
        setIsLoadingValidate(false)
        return
      }

      const missingRequiredFields = visibleSharkdomProperties
        .filter((property) => property.required)
        .filter(
          (property) =>
            !sanitizedSelectedMapping[property.key] ||
            sanitizedSelectedMapping[property.key] === 'dont_import'
        )

      if (missingRequiredFields.length > 0) {
        showCustomToast(
          'Error',
          `Please map all required fields: ${missingRequiredFields
            .map((field) => field.label)
            .join(', ')}.`,
          'error',
          7000
        )
        setIsLoadingValidate(false)
        return
      }

      const previewSelectedMapping = { ...getSanitizedSelectedMapping() }
      if (dataSource === 'HUBSPOT') {
        previewSelectedMapping.associatedCompanyId = 'associatedCompanyId'
        previewSelectedMapping.associatedContactId = 'associatedContactId'
        previewSelectedMapping.dealId = 'dealId'
        previewSelectedMapping.dealOwner = 'hubspot_owner_id'
        previewSelectedMapping.contactOwner = 'hubspot_owner_id'
      } else if (dataSource === 'ZOHO') {
        if (recordType === 'PROSPECT') {
          previewSelectedMapping.contactId = 'id'
          previewSelectedMapping.contactOwner = 'Owner'
        } else if (recordType === 'OPPORTUNITY') {
          previewSelectedMapping.dealId = 'id'
          previewSelectedMapping.dealOwner = 'Owner'
        }
      } else if (dataSource === 'SALESFORCE') {
        if (recordType === 'PROSPECT') {
          previewSelectedMapping.contactId = 'Id'
          previewSelectedMapping.contactOwner = 'OwnerId'
          previewSelectedMapping.associatedCompanyId = 'AccountId'
        } else if (recordType === 'OPPORTUNITY') {
          previewSelectedMapping.dealId = 'Id'
          previewSelectedMapping.dealOwner = 'OwnerId'
          previewSelectedMapping.associatedCompanyId = 'AccountId'
        }
      }
      const mappedColumns = Object.values(previewSelectedMapping).filter(
        (value) => value && value !== '' && value !== 'dont_import'
      ) as string[]

      if (typeof window !== 'undefined') {
        ;(window as any).__sharkdom_temp_csvData = finalCsvData
        try {
          sessionStorage.setItem(
            '__sharkdom_temp_csvData',
            JSON.stringify(finalCsvData)
          )
        } catch (e) {
          sessionStorage.removeItem('__sharkdom_temp_csvData')
          console.warn('Failed to save temp CSV data to sessionStorage:', e)
        }
      }

      const selectedMappingByTab: Record<string, Record<string, string>> = {}
      Object.keys(rowsByTab).forEach((tabKey) => {
        const tabRows = rowsByTab[tabKey as Tab] || []
        const tabMap: Record<string, string> = {}
        tabRows.forEach((row) => {
          if (
            row.sharkdomKey &&
            row.fieldApiName &&
            row.fieldApiName !== 'dont_import'
          ) {
            tabMap[row.sharkdomKey] = row.fieldApiName
          }
        })

        if (dataSource === 'HUBSPOT') {
          if (tabKey === 'Contacts') {
            tabMap.associatedCompanyId = 'associatedCompanyId'
            tabMap.contactOwner = 'hubspot_owner_id'
          } else if (tabKey === 'Deals') {
            tabMap.associatedCompanyId = 'associatedCompanyId'
            tabMap.associatedContactId = 'associatedContactId'
            tabMap.dealId = 'dealId'
            tabMap.dealOwner = 'hubspot_owner_id'
          }
        } else if (dataSource === 'ZOHO') {
          if (tabKey === 'Contacts') {
            tabMap.contactId = 'id'
            tabMap.contactOwner = 'Owner'
          } else if (tabKey === 'Deals') {
            tabMap.dealId = 'id'
            tabMap.dealOwner = 'Owner'
          }
        } else if (dataSource === 'SALESFORCE') {
          if (tabKey === 'Contacts') {
            tabMap.contactId = 'Id'
            tabMap.contactOwner = 'OwnerId'
            tabMap.associatedCompanyId = 'AccountId'
          } else if (tabKey === 'Deals') {
            tabMap.dealId = 'Id'
            tabMap.dealOwner = 'OwnerId'
            tabMap.associatedCompanyId = 'AccountId'
          }
        }

        selectedMappingByTab[tabKey] = tabMap
      })

      const mappingData = {
        selectedMapping: previewSelectedMapping,
        selectedMappingByTab,
        enabledTabs,
        csvHeaders:
          dataSource === 'HUBSPOT' ||
          dataSource === 'PIPEDRIVE' ||
          dataSource === 'SALESFORCE' ||
          dataSource === 'GOOGLE_SHEET'
            ? mappedColumns
            : csvHeaders,
        dataSource,
        recordType,
        csvData: [],
        sheetUrl: sheetUrl || '',
        ...(dataSource === 'SALESFORCE'
          ? { salesforceFieldMapping: { ...(salesforceFieldMapping || {}) } }
          : {})
      }

      if (typeof window !== 'undefined') {
        ;(window as any).__sharkdom_fieldMappingData = mappingData
      }

      if (!isAllFieldsMapped) {
        showCustomToast(
          'Warning',
          'Some optional fields are not mapped. Please review your mappings.',
          'error',
          5000
        )
      }

      try {
        sessionStorage.setItem('fieldMappingData', JSON.stringify(mappingData))
      } catch {
        sessionStorage.removeItem('fieldMappingData')
        sessionStorage.removeItem('csvData')
        sessionStorage.removeItem('csvFileName')

        try {
          sessionStorage.setItem(
            'fieldMappingData',
            JSON.stringify(mappingData)
          )
        } catch (retryError) {
          console.warn(
            'fieldMappingData could not be persisted to sessionStorage; using in-memory fallback only:',
            retryError
          )
        }
      }

      const returnToPartnerPortal = sessionStorage.getItem(
        'returnToPartnerPortal'
      )
      const encodedMappingData = encodeMappingDataForRoute(mappingData)
      const navigatesToCustomerInsights =
        !redirectTo ||
        (!returnToPartnerPortal && redirectTo.includes('/customer-insights'))

      if (
        navigatesToCustomerInsights &&
        !hasUsablePreviewHandoff(encodedMappingData)
      ) {
        showCustomToast(
          'Error',
          'Unable to prepare your CRM preview. Please try again without reloading the page.',
          'error',
          6000
        )
        setIsLoadingValidate(false)
        return
      }

      if (redirectTo) {
        router.push(redirectTo)
      } else if (returnToPartnerPortal === 'true') {
        sessionStorage.removeItem('returnToPartnerPortal')
        router.push('/partner-portal/partner-mapping')
      } else {
        router.push(`/data-pipeline/preview?${searchParams.toString()}`)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch data'
      showCustomToast('Error', errorMessage, 'error', 5000)
      setIsLoadingValidate(false)
    }
  }

  if (isMetadataLoading || !isInitialSamplesFetched) {
    return (
      <GradientPageBackground className='flex min-h-screen flex-col'>
        <div className='px-6 pt-5'>
          <DataPipelineStepper current={2} />
        </div>
        <div className='flex flex-1 flex-col items-center justify-center px-6 py-12'>
          <div className='flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-[rgba(33,35,44,0.08)] bg-white p-10 text-center shadow-[0_12px_32px_rgba(0,0,0,0.04)] dark:border-border dark:bg-card'>
            <div className='relative flex h-16 w-16 items-center justify-center'>
              <div className='absolute h-full w-full rounded-full border-4 border-slate-100' />
              <div className='absolute h-full w-full animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent' />
              <FileSpreadsheet className='h-6 w-6 text-[#2563EB]' />
            </div>
            <div className='mt-2 space-y-1.5'>
              <h2 className='text-base font-bold text-[#21232C] dark:text-white'>
                Fetching mapping fields
              </h2>
              <p className='text-xs font-medium leading-relaxed text-[#5B5E68] dark:text-gray-400'>
                Analyzing CRM metadata schema to prepare your custom mappings.
                This takes just a moment.
              </p>
            </div>
          </div>
        </div>
      </GradientPageBackground>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <DragOverlay dropAnimation={null}>
        {activeField ? (
          <div className='flex cursor-grabbing items-center justify-between rounded border border-[#2563EB] bg-white px-4 py-2.5 shadow-lg ring-1 ring-[#2563EB30] dark:bg-card'>
            <div className='flex min-w-0 items-center gap-3'>
              <GripVertical className='h-4 w-4 flex-shrink-0 text-[#65686F] dark:text-gray-400' />
              <div className='min-w-0'>
                <p className='truncate text-sm font-semibold text-[#21232C] dark:text-white'>
                  {activeField.name}
                </p>
                <p className='truncate text-[11px] font-medium text-[#65686F] dark:text-gray-400'>
                  {activeField.apiName}
                </p>
              </div>
            </div>
            {activeField.fieldType &&
              activeField.fieldType.toLowerCase() !== 'unknown' && (
                <span className='ml-3 text-[11px] font-semibold uppercase text-[#65686F] dark:text-gray-400'>
                  {activeField.fieldType}
                </span>
              )}
          </div>
        ) : null}
      </DragOverlay>

      <GradientPageBackground
        className={`flex flex-col ${
          isLoadingValidate
            ? 'h-full overflow-hidden'
            : 'min-h-full !overflow-visible'
        }`}
      >
        {isLoadingValidate ? (
          <div className='absolute inset-0 z-[9999] flex flex-col items-center justify-center bg-white backdrop-blur-md transition-all duration-300 dark:bg-card/70'>
            <div className='flex flex-col items-center gap-6 rounded-2xl border border-[rgba(33,35,44,0.08)] bg-white p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:border-border dark:bg-card'>
              <div className='relative flex h-16 w-16 items-center justify-center'>
                <div className='absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-75'></div>
                <div className='absolute inset-0 rounded-full border-4 border-blue-100'></div>
                <div className='absolute inset-0 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent'></div>
                <Loader2 className='h-6 w-6 animate-pulse text-[#2563EB]' />
              </div>
              <div className='flex flex-col items-center gap-2 text-center'>
                <h3 className='text-lg font-bold text-[#21232C] dark:text-white'>
                  Preparing your import
                </h3>
                <p className='max-w-[260px] text-xs font-semibold leading-relaxed text-[#65686F] dark:text-gray-400'>
                  Fetching records and resolving relationships. This might take
                  a few seconds...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className='px-6 pt-5'>
              <DataPipelineStepper current={2} />
            </div>

            <div className='mt-6 flex flex-col items-center gap-1.5 px-6'>
              <h1 className='text-center text-2xl font-semibold leading-[34px] text-[#25224A]'>
                Map your spreadsheet columns to Sharkdom fields
              </h1>
              <p className='text-center text-sm font-normal leading-5 text-text-80'>
                Review required fields and drag fields from the right to map
                them.
              </p>
            </div>

            <div className='mt-6 flex gap-3 p-6'>
              <div className='flex min-w-0 flex-1 flex-col gap-3'>
                <div className='flex items-center overflow-hidden rounded-[10px] bg-white outline outline-1 outline-[rgba(33,35,44,0.12)] dark:bg-card'>
                  <img
                    src='/drag.svg'
                    alt='drag illustration'
                    className='h-[82px] w-20 flex-shrink-0 object-cover p-2'
                  />
                  <div className='flex flex-1 flex-col gap-1 px-4 py-4'>
                    <p className='text-base font-semibold leading-6 text-[#21232C] dark:text-white'>
                      Drag fields from the right side picker to the left side
                      boxes, matching your Sharkdom properties.
                    </p>
                    <p className='text-[13.9px] font-medium leading-[21px] text-[#21232C] dark:text-white'>
                      Required rows must be mapped before continuing.
                    </p>
                  </div>
                  <button
                    type='button'
                    className='mr-4 flex-shrink-0 text-[#21232C] hover:opacity-70 dark:text-white'
                    aria-label='Close helper banner'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>

                <div className='overflow-hidden rounded-[10px] bg-white dark:bg-card'>
                  <div className='mx-4 mt-4 flex items-center gap-2.5 rounded border border-[rgba(33,35,44,0.12)] px-4 py-2 dark:border-border'>
                    <FileSpreadsheet className='h-4 w-4 flex-shrink-0 text-[#65686F] dark:text-gray-400' />
                    <span className='truncate text-sm font-semibold text-[#21232C] dark:text-white'>
                      Mapping Schema
                    </span>
                  </div>

                  <div className='mx-4 mb-4 mt-3 overflow-hidden rounded shadow-[0px_1px_3px_rgba(0,0,0,0.07),0px_1px_2px_-2px_rgba(0,0,0,0.06),0px_0px_1px_1px_rgba(0,0,0,0.05)]'>
                    <div className='grid grid-cols-3 border-b border-[rgba(33,35,44,0.24)] bg-white dark:border-border dark:bg-card'>
                      <div className='flex items-start gap-3 border-r border-[rgba(33,35,44,0.24)] px-6 py-3 dark:border-border'>
                        <Table2 className='mt-0.5 h-5 w-5 flex-shrink-0 text-[#21232C] dark:text-white' />
                        <div>
                          <p className='text-sm font-semibold text-[#21232C] dark:text-white'>
                            Sharkdom property
                          </p>
                          <p className='text-[11.8px] font-medium text-[#21232C] dark:text-white'>
                            Generated from record type
                          </p>
                        </div>
                      </div>

                      <div className='flex flex-col items-center justify-center border-r border-[rgba(33,35,44,0.24)] px-6 py-3 dark:border-border'>
                        <p className='text-sm font-semibold text-[#21232C] dark:text-white'>
                          Mapped
                        </p>
                        <p className='text-xs font-medium text-[#21232C] dark:text-white'>
                          {mappedCount}/{rows.length}
                        </p>
                      </div>

                      <div className='flex items-start gap-3 px-6 py-3'>
                        <User className='mt-0.5 h-5 w-5 flex-shrink-0 text-[#21232C] dark:text-white' />
                        <div>
                          <p className='text-sm font-semibold text-[#21232C] dark:text-white'>
                            Source field
                          </p>
                          <p className='text-[11.8px] font-medium text-[#21232C] dark:text-white'>
                            Drag fields here to map
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='relative'>
                      {rows.map((row, idx) => (
                        <div
                          key={row.id}
                          className={`grid grid-cols-3 bg-white dark:bg-card ${
                            idx < rows.length - 1
                              ? 'border-b border-[rgba(33,35,44,0.12)] dark:border-border'
                              : ''
                          }`}
                        >
                          <div className='border-r border-[rgba(33,35,44,0.12)] px-6 py-2.5 dark:border-border'>
                            <div className='flex items-center gap-2'>
                              <p className='text-sm font-semibold text-[#21232C] dark:text-white'>
                                {row.column}
                              </p>
                              {row.required ? (
                                <span className='rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-600'>
                                  Required
                                </span>
                              ) : (
                                <span className='rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-600'>
                                  Optional
                                </span>
                              )}
                            </div>
                          </div>

                          <div className='flex items-center justify-center border-r border-[rgba(33,35,44,0.12)] px-6 py-2.5 dark:border-border'>
                            {row.mapped && row.fieldName ? (
                              <div className='flex h-5 w-5 items-center justify-center rounded-full bg-[#077838]'>
                                <Check className='h-3 w-3 text-white' />
                              </div>
                            ) : (
                              <div className='flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[11px] font-semibold text-amber-700'>
                                !
                              </div>
                            )}
                          </div>

                          <DroppableRowCell
                            rowId={row.id}
                            isOver={overId === `drop-row-${row.id}`}
                            row={row}
                            onUnmap={handleUnmap}
                          />
                        </div>
                      ))}

                      <div className='p-2'>
                        <DroppableNewRowZone
                          isOver={overId === 'drop-new-row'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex min-h-0 w-[467px] flex-shrink-0 flex-col self-stretch border-l border-[rgba(33,35,44,0.12)] px-3 dark:border-border'>
                <div className='flex items-center justify-between py-3'>
                  <span className='text-base font-semibold text-[#21232C] dark:text-white'>
                    Source fields
                  </span>
                </div>

                <div className='relative mb-3'>
                  <Search className='absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#65686F] dark:text-gray-400' />
                  <Input
                    placeholder='Search by label, API name, type, or group'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-9 text-[13.9px] font-medium placeholder:text-[#65686F] dark:text-gray-400'
                  />
                </div>

                <div className='mb-4 flex gap-2'>
                  {ALL_TABS.filter(({ id }) => enabledTabs.includes(id)).map(
                    ({ id, Icon }) => {
                      const isActive = activeTab === id
                      return (
                        <button
                          key={id}
                          type='button'
                          onClick={() => {
                            setActiveTab(id)
                            setSearchQuery('')

                            const params = new URLSearchParams(
                              searchParams.toString()
                            )
                            const targetRecordType =
                              id === 'Contacts'
                                ? 'PROSPECT'
                                : id === 'Companies'
                                  ? 'CUSTOMER'
                                  : 'OPPORTUNITY'
                            params.set('recordType', targetRecordType)
                            router.replace(
                              `/data-pipeline?${params.toString()}`
                            )
                          }}
                          className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-semibold transition-colors ${
                            isActive
                              ? 'bg-[#EFF6FF] text-[#0D68C5] dark:bg-blue-900/20'
                              : 'text-[rgba(33,35,44,0.72)] hover:bg-gray-50'
                          }`}
                        >
                          <Icon className='h-4 w-4' />
                          {id}
                        </button>
                      )
                    }
                  )}
                </div>

                <div className='overflow-hidden rounded-[10px] border border-[rgba(33,35,44,0.12)] bg-white dark:border-border dark:bg-card'>
                  <button
                    type='button'
                    onClick={() => setFieldsOpen((open) => !open)}
                    className='flex w-full items-center justify-between border-b border-[rgba(33,35,44,0.08)] bg-[#D7D7FF] px-4 py-2 text-left dark:border-border dark:bg-purple-900/40'
                  >
                    <div className='min-w-0'>
                      <p className='text-[11px] font-semibold uppercase tracking-wide text-[#21232C] dark:text-white'>
                        All fields
                      </p>
                      <p className='text-xs font-medium text-[#5B5E68] dark:text-gray-400'>
                        {filteredFields.length} unmapped fields
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 flex-shrink-0 text-[#21232C] transition-transform duration-200 dark:text-white ${
                        fieldsOpen ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                  </button>

                  {fieldsOpen ? (
                    <div className='max-h-[60vh] overflow-y-auto px-3 py-3 pr-2'>
                      <div className='flex flex-col gap-2.5'>
                        {isMetadataLoading ? (
                          <div className='flex items-center justify-center gap-2 rounded-[8px] bg-[#F8FAFC] py-6 text-[#65686F] dark:bg-background dark:text-gray-400'>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            <span className='text-xs font-medium'>
                              Loading fields
                            </span>
                          </div>
                        ) : null}

                        {!isMetadataLoading && metadataError ? (
                          <div className='flex items-start gap-2 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
                            <AlertCircle className='mt-0.5 h-4 w-4 flex-shrink-0' />
                            <p className='text-xs font-medium'>
                              {metadataError}
                            </p>
                          </div>
                        ) : null}

                        {!isMetadataLoading && !metadataError
                          ? filteredFields.map((field) => (
                              <DraggableField
                                key={field.apiName}
                                field={field}
                              />
                            ))
                          : null}

                        {!isMetadataLoading &&
                        !metadataError &&
                        filteredFields.length === 0 ? (
                          <div className='rounded-[8px] bg-[#F8FAFC] px-4 py-6 text-center dark:bg-background'>
                            <p className='text-xs font-medium text-[#65686F] dark:text-gray-400'>
                              All available fields are already mapped.
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className='sticky bottom-0 z-10 flex flex-shrink-0 items-center justify-between border-t border-[#CDD9F2] bg-white px-6 py-4 dark:border-border dark:bg-card'>
              <Button
                variant='outline'
                className='h-8 px-4 text-sm font-semibold text-[#21232C] dark:text-white'
                onClick={() =>
                  router.push(
                    `/data-pipeline/connect?${searchParams.toString()}`
                  )
                }
              >
                Back
              </Button>

              <Button
                className='h-8 bg-[#6863FB] px-6 text-sm font-semibold text-white hover:bg-[#5651D9] disabled:cursor-not-allowed disabled:bg-[#ABBDE7]'
                disabled={!requiredMappingsDone || isLoadingValidate}
                onClick={handleValidateAndUpload}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </GradientPageBackground>
    </DndContext>
  )
}

export default FieldMappingContent
