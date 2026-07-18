'use client'

/**
 * Field Mapping Page
 *
 * This page handles field mapping between external data sources (CSV, HubSpot, Salesforce, Pipedrive, Zoho, Google Sheets)
 * and Sharkdom properties.
 *
 * For Pipedrive specifically:
 * - Uses 'name' field for display in the UI (user-friendly labels like "Name", "Email", "Phone")
 * - Uses 'key' field for actual data mapping and processing (actual field identifiers like "name", "email", "phone")
 * - Stores the name->key mapping in sessionStorage for data processing
 * - This approach provides better UX while maintaining data integrity
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import { useCreatePersonaOverlapRecord } from '@/http-hooks/partner-match'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import axios from 'axios'
import {
  ArrowLeft,
  CalendarCheck,
  CalendarDays,
  Check,
  Coins,
  Info,
  LayoutGrid,
  Search,
  X
} from 'lucide-react'
import { useSelector } from 'react-redux'

import { INTEGRATION_STATUS, INTEGRATIONS } from '@/lib/constants/integrations'
// Import existing API functions
import {
  getHubspotColumnsListByRecordType,
  getHubspotDataBasedOnColumns,
  getPipedriveData,
  getPipedriveFields,
  getSalesforceData,
  getSalesforceFields,
  getZohoData,
  getZohoDataHeaders
} from '@/lib/db/customer-persona'
import {
  fetchconnectedApps,
  getCurrentOrganization,
  PatchIntegrationData,
  Postintegrationdata
} from '@/lib/db/organization'
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
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

const steps = [
  { label: 'Connect/upload', icon: Coins },
  { label: 'Mapping', icon: LayoutGrid },
  { label: 'Preview', icon: CalendarDays },
  { label: 'Finish', icon: CalendarCheck }
]

const CrmStepper = ({ current }: { current: number }) => (
  <div className='mx-auto flex w-full max-w-[574px]'>
    {steps.map((step, i) => {
      const isActive = i + 1 === current
      const isFirst = i === 0
      const isLast = i === steps.length - 1
      const Icon = step.icon
      return (
        <div
          key={step.label}
          className='flex flex-1 flex-col items-center gap-2.5'
        >
          <div className='flex w-full items-center gap-3'>
            <div
              className={`h-px flex-1 ${!isFirst ? 'bg-[#D1D5DB]' : 'bg-transparent'}`}
            />
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border ${isActive ? 'border-[#2563EB] bg-[#2563EB]' : 'border-[#D1D5DB] bg-white'}`}
            >
              <Icon
                className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#21232C]'}`}
              />
            </div>
            <div
              className={`h-px flex-1 ${!isLast ? 'bg-[#D1D5DB]' : 'bg-transparent'}`}
            />
          </div>
          <span className='text-[13.9px] font-medium leading-[21px] text-[#21232C]'>
            {step.label}
          </span>
        </div>
      )
    })}
  </div>
)

// Type definitions for API responses
interface PipedriveField {
  id: number
  key: string
  name: string
  group_id: number | null
  order_nr: number
  field_type: string
  json_column_flag: boolean
  add_time: string
  update_time: string | null
  last_updated_by_user_id: number | null
  edit_flag: boolean
  details_visible_flag: boolean
  add_visible_flag: boolean
  important_flag: boolean
  bulk_edit_allowed: boolean
  filtering_allowed: boolean
  sortable_flag: boolean
  mandatory_flag: boolean
  searchable_flag: boolean
  description: string | null
  created_by_user_id: number | null
  active_flag: boolean
  use_field?: string
  link?: string
  autocomplete?: string
  display_field?: string
  options?: Array<{
    id: number
    label: string
    color?: string
  }>
}

interface PipedriveFieldsResponse {
  success: boolean
  data: PipedriveField[]
  error?: string
}

type MappingRecordType = 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'

type SharkdomProperty = {
  key: string
  label: string
  required: boolean
}

const SHARKDOM_PROPERTIES_BY_RECORD_TYPE: Record<
  MappingRecordType,
  SharkdomProperty[]
> = {
  // CUSTOMER: HubSpot Company ↔ Salesforce Account (Name, Website, Billing*, etc. — not Contact fields).
  CUSTOMER: [
    { key: 'name', label: 'Company Name', required: true },
    { key: 'domain', label: 'Website', required: true },
    { key: 'industry', label: 'Industry', required: true },
    {
      key: 'companySize',
      label: 'Company Size / Employees',
      required: true
    },
    {
      key: 'countryGeography',
      label: 'Country / Geography',
      required: true
    },
    { key: 'linkedInUrl', label: 'LinkedIn URL', required: false },
    { key: 'annualRevenue', label: 'Annual Revenue', required: false },
    { key: 'description', label: 'Description', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'city', label: 'City', required: false }
  ],
  // PROSPECT: HubSpot Contact ↔ Salesforce Contact (this flow uses Contact, not Lead).
  // SF may have orphan Contacts (null AccountId); HubSpot contacts can also exist without company.
  // Product mapping: `associatedcompanyid` (HS) → `AccountId` (SF) when that row exists in UI.
  PROSPECT: [
    { key: 'contactEmail', label: 'Email', required: true },
    { key: 'fullName', label: 'First Name + Last Name', required: true },
    { key: 'jobTitle', label: 'Job Title', required: true },
    { key: 'linkedInUrl', label: 'LinkedIn URL', required: false },
    { key: 'leadStatus', label: 'Lead Status', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'lastActivityDate', label: 'Last Activity Date', required: false },
    { key: 'contactOwner', label: 'Contact Owner', required: false }
  ],
  // Salesforce: deals map to Opportunity; `AccountId` ties to Account (HubSpot: associated company).
  // Pipeline is RecordType + StageName in SF — UI “Pipeline” may not map 1:1 to a single API field.
  OPPORTUNITY: [
    { key: 'dealname', label: 'Deal Name', required: true },
    { key: 'dealStage', label: 'Deal Stage', required: true },
    { key: 'dealOwner', label: 'Deal Owner', required: true },
    { key: 'amountAcv', label: 'Amount / ACV', required: true },
    { key: 'closeDate', label: 'Close Date', required: true },
    { key: 'dealId', label: 'Deal ID', required: true },
    { key: 'pipeline', label: 'Pipeline', required: false },
    { key: 'lastActivityDate', label: 'Last Activity Date', required: false },
    { key: 'dealType', label: 'Deal Type', required: false }
  ]
}

const HUBSPOT_FALLBACK_HEADERS_BY_RECORD_TYPE: Record<
  MappingRecordType,
  string[]
> = {
  CUSTOMER: [
    'name',
    'domain',
    'industry',
    'numberofemployees',
    'country',
    'linkedin_company_page',
    'annualrevenue',
    'description',
    'phone',
    'city'
  ],
  PROSPECT: [
    'email',
    'firstname',
    'lastname',
    'company',
    'website',
    'phone',
    'jobtitle',
    'industry',
    'city',
    'state',
    'country',
    'createdate',
    'lastmodifieddate',
    'hs_lead_status',
    'lifecyclestage'
  ],
  OPPORTUNITY: [
    'dealname',
    'dealstage',
    'hubspot_owner_id',
    'amount',
    'closedate',
    'hs_object_id',
    'pipeline',
    'hs_notes_last_activity',
    'dealtype'
  ]
}

/**
 * When Salesforce describe fails, these API names seed the mapping UI (`identity` label→name map).
 * Align with HubSpot fallback semantics — same Sharkdom concepts, Salesforce field API names.
 *
 * CUSTOMER = Account:  HS `name`→`Name`, `domain`→`Website`, `country`→`BillingCountry`, etc.
 * PROSPECT = Contact:   HS `email`→`Email`, `firstname`→`FirstName`, `associatedcompanyid`→`AccountId`, …
 * OPPORTUNITY = Opp:  HS `dealname`→`Name`, `dealstage`→`StageName`, `amount`→`Amount`, …
 * `LinkedIn_URL__c` is org-specific custom; omit from query if not defined in the org.
 */
const SALESFORCE_FALLBACK_HEADERS_BY_RECORD_TYPE: Record<
  MappingRecordType,
  string[]
> = {
  CUSTOMER: [
    'Id',
    'Name',
    'Website',
    'Industry',
    'NumberOfEmployees',
    'BillingCountry',
    'LinkedIn_URL__c',
    'AnnualRevenue',
    'Description',
    'Phone',
    'BillingCity'
  ],
  PROSPECT: [
    'Id',
    'Email',
    'FirstName',
    'LastName',
    'Title',
    'AccountId',
    'Linkedin_URL__c',
    'LeadSource',
    'Phone',
    'LastActivityDate',
    'OwnerId'
  ],
  OPPORTUNITY: [
    'Id',
    'Name',
    'StageName',
    'AccountId',
    'OwnerId',
    'Amount',
    'CloseDate',
    'Type',
    'LastActivityDate',
    'Opportunity'
  ]
}

const ZOHO_FALLBACK_HEADERS_BY_RECORD_TYPE: Record<
  MappingRecordType,
  string[]
> = {
  CUSTOMER: [
    'Account_Name',
    'Website',
    'Industry',
    'Employees',
    'Billing_Country',
    'Annual_Revenue',
    'Description',
    'Phone',
    'Billing_City'
  ],
  PROSPECT: [
    'Email',
    'First_Name',
    'Last_Name',
    'Title',
    'Phone',
    'Last_Activity_Time',
    'Owner'
  ],
  OPPORTUNITY: [
    'Deal_Name',
    'Stage',
    'Amount',
    'Closing_Date',
    'Pipeline',
    'Last_Activity_Time'
  ]
}

/**
 * Sharkdom UI keys → backend overlap field names (PROSPECT/OPPORTUNITY sparse CRM import).
 * Keep in sync with customer-insights `handleCreatePersona` / `mapSparseRecord`.
 */
const CRM_SPARSE_SHARKDOM_TO_BACKEND_FIELD: Record<string, string> = {
  fullName: 'name',
  firstName: 'firstName',
  lastName: 'lastName',
  linkedInUrl: 'contactLinkedinUrl',
  linkedinUrl: 'contactLinkedinUrl',
  phone: 'contactPhone',
  contactPhone: 'contactPhone',
  contactEmail: 'contactEmail',
  jobTitle: 'jobTitle',
  leadStatus: 'leadStatus',
  contactOwner: 'contactOwner',
  associatedCompanyId: 'associatedCompanyId',
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
  dealName: 'dealName',
  dealStage: 'dealStage',
  dealOwner: 'dealOwner',
  closeDate: 'closeDate',
  creationDate: 'creationDate',
  amountAcv: 'amountAcv',
  dealId: 'dealId',
  pipeline: 'pipeline',
  dealType: 'dealType',
  associatedContactId: 'associatedContactId',
  ticketSize: 'ticketSize',
  subscribed: 'subscribed',
  lastActivityDate: 'lastActivityDate'
}

/** Dedupe + trim HubSpot property names from describe; keeps custom properties. */
function sanitizeHubspotHeadersByRecordType(
  headers: string[],
  _recordType: MappingRecordType
): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const h of headers) {
    const s = String(h).trim()
    if (!s || seen.has(s)) continue
    seen.add(s)
    out.push(s)
  }
  return out
}

//RecordTypeId => Opportunity

export type FieldMappingContentProps = {
  backBasePath?: string
  redirectTo?: string
}

const encodeMappingDataForRoute = (mappingData: unknown) => {
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

const hasUsablePreviewHandoff = (encodedMappingData: string | null) => {
  if (typeof window === 'undefined') return false

  return Boolean(
    sessionStorage.getItem('fieldMappingData') ||
      (window as any).__sharkdom_fieldMappingData ||
      encodedMappingData
  )
}

/** When describe fails, fallback headers are API names — map label/key → same API name for queries. */
const buildSalesforceIdentityFieldMapping = (
  headerApiNames: string[]
): Record<string, string> => {
  const m: Record<string, string> = {}
  for (const api of headerApiNames) {
    m[api] = api
  }
  return m
}

/** Resolves record type for HubSpot OAuth redirect without relying on in-component `recordType`
 * (that hook is declared after `fetchHubspotCodeApps`, which referenced it and caused TDZ:
 * "Cannot access 'recordType' before initialization"). */
function resolveRecordTypeForHubspotOAuth(searchParams: {
  get: (name: string) => string | null
}): MappingRecordType {
  const fromUrl = searchParams.get('recordType') as MappingRecordType | null
  if (fromUrl) return fromUrl
  if (typeof window !== 'undefined') {
    const fromSession = sessionStorage.getItem(
      'pending_recordType'
    ) as MappingRecordType | null
    if (fromSession) return fromSession
  }
  return 'CUSTOMER'
}

export function FieldMappingContent({
  backBasePath = '/my-data',
  redirectTo
}: FieldMappingContentProps = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingValidate, setIsLoadingValidate] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    integrations,
    refetch,
    isLoading: integrationsLoading
  } = useIntegrationApps()
  // console.log('integrations', integrations)
  const integrationWaitStartedAt = useRef<number | null>(null)

  // Check if HubSpot is connected - it should have CONNECTED status
  const isHubSpotConnected = integrations?.some(
    (integration: any) =>
      integration.id === INTEGRATIONS.HUBSPOT_OUTREACH &&
      integration.status === INTEGRATION_STATUS.CONNECTED
  )

  // Check if Pipedrive is connected
  const isPipedriveConnected = integrations?.some(
    (integration: any) =>
      integration.id === INTEGRATIONS.PIPEDRIVE &&
      integration.status === INTEGRATION_STATUS.CONNECTED
  )

  // Check if Salesforce is connected
  const isSalesforceConnected = integrations?.some(
    (integration: any) =>
      integration.id === INTEGRATIONS.SALESFORCE_CRM &&
      integration.status === INTEGRATION_STATUS.CONNECTED
  )

  // Get data source from URL parameters or auto-detect based on connected integrations
  const urlDataSource = searchParams.get('source')
  const dataSource = useMemo(() => {
    return (
      urlDataSource ||
      (isHubSpotConnected
        ? 'HUBSPOT'
        : isSalesforceConnected
          ? 'SALESFORCE'
          : 'CSV')
    )
  }, [urlDataSource, isHubSpotConnected, isSalesforceConnected])
  const sheetUrl = searchParams.get('sheetUrl') || ''

  console.log('Integration connection status:', {
    dataSource,
    isHubSpotConnected,
    isPipedriveConnected,
    isSalesforceConnected,
    integrations: integrations?.filter(
      (i) =>
        i.id === INTEGRATIONS.HUBSPOT_OUTREACH ||
        i.id === INTEGRATIONS.PIPEDRIVE ||
        i.id === INTEGRATIONS.SALESFORCE_CRM
    )
  })

  // Get CSV data from sessionStorage for CSV source - memoized to prevent recalculation
  const csvData = useMemo(() => {
    if (dataSource.toUpperCase() === 'CSV') {
      const storedData = sessionStorage.getItem('csvData')
      return storedData ? JSON.parse(storedData) : null
    }
    return null
  }, [dataSource])

  const org = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  const createPersonaOverlapRecord = useCreatePersonaOverlapRecord()

  // Get OAuth callback parameters
  const code = searchParams.get('code') as string
  const zohoState = searchParams.get('state') as string
  const hubspotCodeProcessedRef = useRef(false)

  // HubSpot OAuth callback handler - same logic as in integrations page
  const fetchHubspotCodeApps = useCallback(async () => {
    const client_id = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID as string
    const clientSecret = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_SECRET as string
    const redirectUri = process.env
      .NEXT_PUBLIC_HUBSPOT_REDIRECTION_URL as string

    console.log('🚀 Starting HubSpot OAuth flow with code:', code)

    try {
      const payloadData = {
        grant_type: 'authorization_code',
        client_id: client_id,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code
      }

      const response = await fetch('/api/hubapi-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(payloadData).toString()
      })

      const data = await response.json()
      console.log('🚀🚀🚀 HubSpot OAuth response :: ', data)

      if (data.access_token) {
        const { id } = await getCurrentOrganization()

        const updatePayload = {
          organizationId: id,
          refreshToken: data.refresh_token,
          integrationType: 'HUBSPOT'
        }

        const postData = await Postintegrationdata(
          JSON.stringify(updatePayload)
        )

        if (postData?.statusCode === 400) {
          showCustomToast('Info', postData?.message, 'info', 5000)
          console.log('POST DATA:::::', { postData })
          const updatePayload = {
            organizationId: id,
            refreshToken: data?.refresh_token,
            integrationType: 'HUBSPOT'
          }
          console.log('PATCH DATA:::::', { updatePayload })

          const patchData = await PatchIntegrationData(
            JSON.stringify(updatePayload)
          )
          console.log(
            '-----HUBSPOT:::Updated:PatchIntegrationData---',
            patchData
          )

          // Check if this came from my-data flow and redirect accordingly
          if (searchParams?.get('state') === 'my-data-flow') {
            showCustomToast(
              'Success',
              'HubSpot connected successfully!',
              'success',
              5000
            )
            // Restore recordType from sessionStorage if it was saved before OAuth redirect
            const pendingRecordType =
              typeof window !== 'undefined'
                ? sessionStorage.getItem('pending_recordType')
                : null
            // const resolvedRecordType = pendingRecordType || recordType
            // ^ recordType is declared later in this component; using it here caused TDZ ReferenceError.
            const resolvedRecordType =
              pendingRecordType ||
              resolveRecordTypeForHubspotOAuth(searchParams)
            if (pendingRecordType)
              sessionStorage.removeItem('pending_recordType')
            // Strip code/state from URL to prevent callback from running again on reload
            const cleanUrl = `${window.location.pathname}?source=HUBSPOT&recordType=${resolvedRecordType}`
            window.history.replaceState({}, '', cleanUrl)
            window.location.reload()
            return
          }

          return
        }
        console.log('POST DATA:::::', { postData })

        // Check if this came from my-data flow and redirect accordingly
        if (searchParams?.get('state') === 'my-data-flow') {
          showCustomToast(
            'Success',
            'HubSpot connected successfully!',
            'success',
            5000
          )
          // Restore recordType from sessionStorage if it was saved before OAuth redirect
          const pendingRecordType =
            typeof window !== 'undefined'
              ? sessionStorage.getItem('pending_recordType')
              : null
          // const resolvedRecordType = pendingRecordType || recordType
          // ^ recordType is declared later in this component; using it here caused TDZ ReferenceError.
          const resolvedRecordType =
            pendingRecordType || resolveRecordTypeForHubspotOAuth(searchParams)
          sessionStorage.removeItem('pending_recordType')
          // Strip code/state from URL to prevent callback from running again on reload
          const cleanUrl = `${window.location.pathname}?source=HUBSPOT&recordType=${resolvedRecordType}`
          window.history.replaceState({}, '', cleanUrl)
          window.location.reload()
          return
        }
      } else {
        setError(
          `Failed to obtain access token: ${data.message || 'Unknown error'}`
        )
      }
    } catch (e) {
      console.error('Error handling HubSpot integration:', e)
      setError('Error handling HubSpot integration')
      return
    }
  }, [code, searchParams]) // Removed refetch from dependencies to prevent infinite loop

  // Handle OAuth callbacks - same logic as integrations page
  useEffect(() => {
    const state = zohoState === process.env.NEXT_PUBLIC_ZOHO_STATE

    if (state && code) {
      // Handle Zoho OAuth callback
      console.log('Zoho OAuth callback detected')
      showCustomToast(
        'Success',
        'Zoho connected successfully!',
        'success',
        5000
      )
      window.location.reload()
    } else if (code && !hubspotCodeProcessedRef.current) {
      hubspotCodeProcessedRef.current = true
      console.log('HubSpot OAuth callback detected with code:', code)
      fetchHubspotCodeApps()
    }
  }, [code, fetchHubspotCodeApps, router, zohoState])

  // State for CSV headers from the data source
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])

  // Resolve recordType: URL param first, then sessionStorage fallback (set by OtherWaysToConnect / connect-crm).
  // IMPORTANT: Do NOT clear pending_recordType here — the OAuth callback useEffect (fetchHubspotCodeApps)
  // also reads pending_recordType and clears it itself. useMemo runs synchronously before effects,
  // so clearing here would remove it before the OAuth handler can use it.
  const recordType = useMemo(() => {
    const fromUrl = searchParams.get('recordType') as MappingRecordType | null
    if (fromUrl) return fromUrl

    if (typeof window !== 'undefined') {
      const fromSession = sessionStorage.getItem(
        'pending_recordType'
      ) as MappingRecordType | null
      if (fromSession) {
        // Update the URL so the rest of the page logic sees the correct recordType.
        // Do NOT removeItem here — the OAuth callback useEffect clears it after exchange.
        // const url = new URL(window.location.href)
        // url.searchParams.set('recordType', fromSession)
        // window.history.replaceState({}, '', url.toString())
        // ^ replaceState during render triggered React warning: updating HotReload while rendering FieldMappingContent.
        // URL sync moved to useEffect below (syncPendingRecordTypeToUrl).
        return fromSession
      }
    }

    return 'CUSTOMER' as MappingRecordType
  }, [searchParams])

  // Push pending_recordType into the URL after paint (avoids navigation/side effects during render).
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (searchParams.get('recordType')) return
    const fromSession = sessionStorage.getItem(
      'pending_recordType'
    ) as MappingRecordType | null
    if (!fromSession) return
    const url = new URL(window.location.href)
    url.searchParams.set('recordType', fromSession)
    window.history.replaceState({}, '', url.toString())
  }, [searchParams])

  const getSheetConfigForActiveTab = useCallback(() => {
    const sheetLayout =
      searchParams.get('sheetLayout') ||
      (typeof window !== 'undefined'
        ? sessionStorage.getItem('gsheet_layout')
        : null) ||
      'single'
    const tab =
      recordType === 'PROSPECT'
        ? 'Contacts'
        : recordType === 'CUSTOMER'
          ? 'Companies'
          : 'Deals'

    if (sheetLayout === 'multi-file') {
      if (tab === 'Contacts') {
        const url =
          searchParams.get('sheetUrlContacts') ||
          (typeof window !== 'undefined'
            ? sessionStorage.getItem('gsheet_multi_contacts')
            : null) ||
          ''
        return { url, tabName: '' }
      }
      if (tab === 'Companies') {
        const url =
          searchParams.get('sheetUrlCompanies') ||
          (typeof window !== 'undefined'
            ? sessionStorage.getItem('gsheet_multi_companies')
            : null) ||
          ''
        return { url, tabName: '' }
      }
      if (tab === 'Deals') {
        const url =
          searchParams.get('sheetUrlDeals') ||
          (typeof window !== 'undefined'
            ? sessionStorage.getItem('gsheet_multi_deals')
            : null) ||
          ''
        return { url, tabName: '' }
      }
    } else if (sheetLayout === 'multi-tab') {
      const url =
        searchParams.get('sheetUrl') ||
        (typeof window !== 'undefined'
          ? sessionStorage.getItem('gsheet_link')
          : null) ||
        ''
      if (tab === 'Contacts')
        return { url, tabName: searchParams.get('sheetTabContacts') || '' }
      if (tab === 'Companies')
        return { url, tabName: searchParams.get('sheetTabCompanies') || '' }
      if (tab === 'Deals')
        return { url, tabName: searchParams.get('sheetTabDeals') || '' }
    }
    const url =
      searchParams.get('sheetUrl') ||
      (typeof window !== 'undefined'
        ? sessionStorage.getItem('gsheet_link')
        : null) ||
      ''
    return { url, tabName: '' }
  }, [searchParams, recordType])

  const sharkdomProperties = useMemo(() => {
    const properties = SHARKDOM_PROPERTIES_BY_RECORD_TYPE[recordType] ?? []

    // PROSPECT company associations are enriched silently into the final payload.
    // They should never appear as a mappable UI field.
    if (recordType === 'PROSPECT') {
      return properties.filter(
        (property) => property.key !== 'associatedCompanyId'
      )
    }

    return properties
  }, [recordType])

  const visibleSharkdomProperties = useMemo(() => {
    let filtered = sharkdomProperties

    // PROSPECT: hide associatedCompanyId
    if (recordType === 'PROSPECT') {
      filtered = filtered.filter(
        (property) =>
          property.key !== 'associatedCompanyId' &&
          property.key !== 'associatedcompanyid' &&
          property.label !== 'Associated Company ID'
      )
    }

    // OPPORTUNITY: hide dealId
    if (recordType === 'OPPORTUNITY') {
      filtered = filtered.filter((property) => property.key !== 'dealId')
    }

    // Hide Owner ID and Account ID fields globally from frontend mapping
    filtered = filtered.filter(
      (property) =>
        property.key !== 'dealOwner' &&
        property.key !== 'contactOwner' &&
        property.key !== 'ownerId' &&
        property.key !== 'accountId'
    )

    return filtered
  }, [recordType, sharkdomProperties])

  const allowedSharkdomKeys = useMemo(
    () => new Set(visibleSharkdomProperties.map((property) => property.key)),
    [visibleSharkdomProperties]
  )

  useEffect(() => {
    console.log('[FieldMapping] Render state snapshot:', {
      dataSource,
      recordType,
      orgId: org?.id,
      codePresent: Boolean(code),
      integrationsLoading,
      isHubSpotConnected,
      isPipedriveConnected,
      isSalesforceConnected,
      sharkdomPropertyKeys: sharkdomProperties.map((property) => property.key),
      visiblePropertyKeys: visibleSharkdomProperties.map(
        (property) => property.key
      ),
      visiblePropertyLabels: visibleSharkdomProperties.map(
        (property) => property.label
      ),
      sessionPendingRecordType:
        typeof window !== 'undefined'
          ? sessionStorage.getItem('pending_recordType')
          : null,
      sessionFieldMappingDataPresent:
        typeof window !== 'undefined'
          ? Boolean(sessionStorage.getItem('fieldMappingData'))
          : false,
      memoryFieldMappingDataPresent:
        typeof window !== 'undefined'
          ? Boolean((window as any).__sharkdom_fieldMappingData)
          : false
    })
  }, [
    code,
    dataSource,
    integrationsLoading,
    isHubSpotConnected,
    isPipedriveConnected,
    isSalesforceConnected,
    org?.id,
    recordType,
    sharkdomProperties,
    visibleSharkdomProperties
  ])

  // Initialize mapping with empty values
  const [selectedMapping, setSelectedMapping] = useState<
    Record<string, string>
  >({})

  const getSanitizedSelectedMapping = useCallback(() => {
    return Object.entries(selectedMapping).reduce(
      (acc, [key, value]) => {
        if (!allowedSharkdomKeys.has(key)) return acc
        acc[key] = value
        return acc
      },
      {} as Record<string, string>
    )
  }, [allowedSharkdomKeys, selectedMapping])

  // Store Salesforce field mapping (label -> name)
  const [salesforceFieldMapping, setSalesforceFieldMapping] = useState<
    Record<string, string>
  >({})

  // Search state for dropdowns
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})

  // Track hidden properties (rows that should not be displayed)
  const [hiddenProperties, setHiddenProperties] = useState<Set<string>>(
    new Set()
  )

  useEffect(() => {
    if (recordType !== 'PROSPECT') return

    setSelectedMapping((prev) => {
      if (!('associatedCompanyId' in prev)) return prev

      const next = { ...prev }
      delete next.associatedCompanyId
      return next
    })

    setHiddenProperties((prev) => {
      if (!prev.has('associatedCompanyId')) return prev

      const next = new Set(prev)
      next.delete('associatedCompanyId')
      return next
    })
  }, [recordType])

  // Auto-map headers to sharkdom properties
  const autoMapHeaders = useCallback(
    (headers: string[]) => {
      console.log('[FieldMapping] autoMapHeaders invoked:', {
        recordType,
        headerCount: headers.length,
        headers,
        sharkdomProperties: sharkdomProperties.map((property) => ({
          key: property.key,
          label: property.label,
          required: property.required
        })),
        visibleSharkdomProperties: visibleSharkdomProperties.map(
          (property) => ({
            key: property.key,
            label: property.label,
            required: property.required
          })
        )
      })

      const mapping: Record<string, string> = {}

      // Create a mapping of common patterns
      const patterns = {
        domain: ['website', 'domain', 'site', 'url', 'web'],
        name: [
          'company',
          'company name',
          'company_name',
          'organization',
          'org',
          'name',
          'JigsawCompanyId'
        ],
        contactEmail: ['email', 'e-mail', 'email address', 'email_address'],
        industry: ['industry', 'sector', 'vertical'],
        companySize: [
          'company size',
          'company_size',
          'employees',
          'employee count',
          'employee_count',
          'size'
        ],
        countryGeography: [
          'country',
          'geography',
          'country / geography',
          'country_geography',
          'region',
          'location'
        ],
        linkedInUrl: [
          'linkedin',
          'linkedin url',
          'linkedin_url',
          'linkedin profile',
          'linkedin_company_page',
          'LinkedIn_URL__c',
          'Linkedin_URL__c'
        ],
        annualRevenue: ['annual revenue', 'annual_revenue', 'revenue', 'arr'],
        description: ['description', 'about', 'notes'],
        phone: ['phone', 'phone number', 'mobile', 'contact number'],
        city: ['city', 'town', 'billing city'],
        fullName: [
          'firstname', // HubSpot exact column — auto-map selects this; lastname is always fetched too
          'full name',
          'fullname',
          'first name + last name',
          'contact name',
          'name'
        ],
        jobTitle: ['job title', 'job_title', 'title', 'designation'],
        leadStatus: [
          'lead status',
          'lead_status',
          'status',
          'lead source',
          'lead_source'
        ],
        lastActivityDate: [
          'hs_notes_last_activity',
          'hs_lastactivitydate',
          'last activity date',
          'last_activity_date',
          'last activity',
          'last touched'
        ],
        contactOwner: ['contact owner', 'owner', 'record owner'],
        // OPPORTUNITY: exact HubSpot API column names added so auto-map scores 100 (exact match)
        dealname: [
          'dealname',
          'deal name',
          'deal_name',
          'deal title',
          'opportunity name'
        ],
        dealStage: [
          'dealstage',
          'deal stage',
          'deal_stage',
          'stage',
          'pipeline stage',
          'pipeline_stage'
        ],
        dealOwner: [
          'hubspot_owner_id',
          'deal owner',
          'owner',
          'opportunity owner',
          'deal_owner',
          'opportunity',
          'id'
        ],
        amountAcv: ['amount', 'acv', 'deal value', 'value', 'arr'],
        closeDate: [
          'closedate',
          'close date',
          'close_date',
          'closed date',
          'closed_date',
          'expected close',
          'hs_closed_deal_close_date',
          'closing_date',
          'closing date',
          'closingdate'
        ],
        dealId: [
          'hs_object_id',
          'hubspot deal id',
          'deal id',
          'hs deal id',
          'hubspot_id',
          'id'
        ],
        pipeline: ['pipeline', 'pipeline name'],
        dealType: ['dealtype', 'deal type', 'deal_type', 'opportunity type']
      }

      // For each sharkdom property, find the best match
      visibleSharkdomProperties.forEach((property) => {
        const propertyPatterns =
          patterns[property.key as keyof typeof patterns] || []
        let bestMatch = ''
        let bestScore = 0

        headers.forEach((header) => {
          const headerLower = header.toLowerCase()

          // Exact match gets highest score
          if (propertyPatterns.some((pattern) => headerLower === pattern)) {
            bestMatch = header
            bestScore = 100
            return
          }

          // Partial match gets medium score
          propertyPatterns.forEach((pattern) => {
            if (
              headerLower.includes(pattern) ||
              pattern.includes(headerLower)
            ) {
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

        if (bestMatch && bestScore > 30) {
          mapping[property.key] = bestMatch
        } else {
          mapping[property.key] = ''
        }
      })

      console.log('visibleSharkdomProperties', visibleSharkdomProperties)
      console.log('mapping', mapping)
      console.log('[FieldMapping] autoMapHeaders output before cleanup:', {
        recordType,
        mapping
      })
      delete mapping.associatedCompanyId

      return mapping
    },
    [recordType, sharkdomProperties, visibleSharkdomProperties]
  )

  // Debug logging
  // console.log('Field Mapping Debug:', {
  //   dataSource,
  //   sheetUrl,
  //   csvDataLength: csvData?.length,
  //   csvDataFirstRow: csvData?.[0],
  //   csvHeadersState: csvHeaders,
  //   csvHeadersType: typeof csvHeaders,
  //   csvHeadersIsArray: Array.isArray(csvHeaders),
  //   orgId: org?.id,
  //   org: org
  // })

  useEffect(() => {
    // Don't fetch columns if we have OAuth code (processing OAuth first)
    if (code) {
      console.log(
        'Skipping column fetch - OAuth code present, processing OAuth first'
      )
      console.log('[FieldMapping] fetchColumns skipped:', {
        reason: 'oauth_code_present',
        code,
        recordType,
        dataSource
      })
      return
    }

    const waitForIntegration = (
      connected: boolean,
      sourceLabel: string,
      canRetry = false
    ) => {
      if (connected) {
        integrationWaitStartedAt.current = null
        return false
      }

      if (integrationsLoading) {
        setIsLoading(true)
        return true
      }

      if (!integrationWaitStartedAt.current) {
        integrationWaitStartedAt.current = Date.now()
      }

      const waitedMs = Date.now() - integrationWaitStartedAt.current
      if (canRetry && waitedMs < 10000) {
        console.log(`Waiting for ${sourceLabel} integration to be connected`, {
          waitedMs
        })
        setIsLoading(true)
        setTimeout(() => {
          refetch()
        }, 500)
        return true
      }

      setError(
        `${sourceLabel} connection could not be confirmed. Please reconnect ${sourceLabel} and try again.`
      )
      setIsLoading(false)
      return true
    }

    if (
      dataSource.toUpperCase() === 'HUBSPOT' &&
      waitForIntegration(isHubSpotConnected, 'HubSpot', true)
    ) {
      console.log('[FieldMapping] fetchColumns skipped:', {
        reason: 'waiting_for_hubspot_integration',
        recordType,
        dataSource,
        isHubSpotConnected,
        integrationsLoading
      })
      return
    }

    if (
      dataSource.toUpperCase() === 'PIPEDRIVE' &&
      waitForIntegration(isPipedriveConnected, 'Pipedrive')
    ) {
      console.log('[FieldMapping] fetchColumns skipped:', {
        reason: 'waiting_for_pipedrive_integration',
        recordType,
        dataSource,
        isPipedriveConnected,
        integrationsLoading
      })
      return
    }

    if (
      dataSource.toUpperCase() === 'SALESFORCE' &&
      waitForIntegration(isSalesforceConnected, 'Salesforce')
    ) {
      console.log('[FieldMapping] fetchColumns skipped:', {
        reason: 'waiting_for_salesforce_integration',
        recordType,
        dataSource,
        isSalesforceConnected,
        integrationsLoading
      })
      return
    }

    const fetchColumns = async () => {
      console.log(`Starting to fetch columns for data source: ${dataSource}`)
      console.log('[FieldMapping] fetchColumns started:', {
        dataSource,
        recordType,
        orgId: org?.id,
        csvDataLength: csvData?.length,
        integrationsLoading,
        isHubSpotConnected,
        isPipedriveConnected,
        isSalesforceConnected
      })
      setIsLoading(true)
      setError(null)

      try {
        let headers: string[] = []

        switch (dataSource.toUpperCase()) {
          case 'CSV':
            if (csvData && csvData.length > 0) {
              headers = csvData[0] // First row contains headers
            } else {
              // Fallback to sample data if no CSV data provided
              headers = [
                'Website <EMAIL>',
                'First Name',
                'Last Name',
                'Email',
                'Contact no',
                'Other 1',
                'Other 2'
              ]
            }
            console.log('CSV headers loaded:', headers)
            break

          case 'HUBSPOT':
            if (!org?.id) {
              throw new Error('Organization ID not found')
            }

            const hubspotResult = await getHubspotColumnsListByRecordType(
              org.id,
              recordType
            )

            if (!hubspotResult) {
              throw new Error('No response from HubSpot API')
            }

            // Handle error responses
            if (hubspotResult?.statusCode === 500) {
              console.error('HubSpot API 500 error:', hubspotResult)

              // Check if it's the duplicate integration error
              if (
                hubspotResult?.errorMessage?.includes(
                  'Query did not return a unique result'
                )
              ) {
                headers = HUBSPOT_FALLBACK_HEADERS_BY_RECORD_TYPE[recordType]
                showCustomToast(
                  'Warning',
                  'Multiple HubSpot integrations detected. Using standard properties for field mapping.',
                  'error',
                  5000
                )
                break
              } else {
                throw new Error(
                  'HubSpot API error: ' +
                    (hubspotResult?.desc ||
                      hubspotResult?.message ||
                      hubspotResult?.errorMessage ||
                      'Unknown error')
                )
              }
            }

            if (hubspotResult?.statusCode === 400) {
              console.error('HubSpot API 400 error:', hubspotResult)
              throw new Error(
                'HubSpot API error: ' +
                  (hubspotResult?.desc ||
                    hubspotResult?.message ||
                    'Bad request')
              )
            }

            if (hubspotResult?.statusCode === 401) {
              console.error('HubSpot API 401 error:', hubspotResult)
              throw new Error(
                'HubSpot authorization expired. Please reconnect HubSpot.'
              )
            }

            // Use the result directly as it should be an array of field names
            headers = Array.isArray(hubspotResult) ? hubspotResult : []
            headers = sanitizeHubspotHeadersByRecordType(headers, recordType)

            // Only show warning if we got an empty array AND it's not a successful response
            // (successful response with empty array is valid - user might not have any custom properties)
            if (headers.length === 0 && hubspotResult?.statusCode) {
              headers = HUBSPOT_FALLBACK_HEADERS_BY_RECORD_TYPE[recordType]
              headers = sanitizeHubspotHeadersByRecordType(headers, recordType)
              showCustomToast(
                'Warning',
                'Using demo HubSpot properties. Please check your HubSpot connection.',
                'error',
                5000
              )
            } else if (headers.length === 0) {
              // Valid empty response - user has no custom properties, use standard HubSpot properties
              headers = HUBSPOT_FALLBACK_HEADERS_BY_RECORD_TYPE[recordType]
              headers = sanitizeHubspotHeadersByRecordType(headers, recordType)
            }
            // console.log('HubSpot headers loaded:', headers)
            break

          case 'PIPEDRIVE':
            console.log('Fetching Pipedrive columns for org ID:', org?.id)
            if (!org?.id) {
              throw new Error('Organization ID not found')
            }

            // Pipedrive API returns fields with both 'name' (display) and 'key' (identifier)
            // We use 'name' for UI display and 'key' for data processing

            try {
              const result = await getPipedriveFields()

              if (result.success && Array.isArray(result.data)) {
                console.log('Pipedrive fields response:', result.data)

                const fieldMapping: Record<string, string> = {}
                const displayNames: string[] = []

                result.data.forEach((field: { key: string; name: string }) => {
                  if (field.name && field.key) {
                    fieldMapping[field.name] = field.key
                    displayNames.push(field.name)
                  }
                })

                sessionStorage.setItem(
                  'pipedriveFieldMapping',
                  JSON.stringify(fieldMapping)
                )

                headers = displayNames
              } else {
                headers = []
              }

              if (headers.length === 0) {
                console.warn(
                  'No Pipedrive fields found, using fallback properties'
                )
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
            } catch (error) {
              console.error(
                '[FieldMapping] Error fetching Pipedrive fields:',
                error
              )
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
                'Something went wrong loading Pipedrive fields. Using defaults.',
                'error',
                5000
              )
            }
            console.log('Pipedrive headers loaded:', headers)
            break

          case 'ZOHO':
            console.log('Fetching Zoho columns for record type:', recordType)
            try {
              const zohoResult = await getZohoDataHeaders(recordType)
              if (!zohoResult) {
                throw new Error('Failed to fetch Zoho columns')
              }
              // Ensure result is an array
              headers = Array.isArray(zohoResult) ? zohoResult : []
              if (headers.length === 0) {
                throw new Error('No Zoho columns found')
              }
            } catch (error) {
              console.error('[FieldMapping] Error fetching Zoho fields:', error)
              headers = ZOHO_FALLBACK_HEADERS_BY_RECORD_TYPE[recordType]
              showCustomToast(
                'Warning',
                'Something went wrong loading Zoho fields. Using defaults.',
                'error',
                5000
              )
            }
            console.log('Zoho headers loaded:', headers)
            break

          case 'SALESFORCE':
            console.log('Fetching Salesforce columns for org ID:', org?.id)
            if (!org?.id) {
              throw new Error('Organization ID not found')
            }

            try {
              const result = await getSalesforceFields(recordType)
              console.log('Salesforce fields response:', result)

              if (result.fields && result.fields.length > 0) {
                headers = result.fields.map((field: any) => field.label)

                const fieldMapping: Record<string, string> = {}
                result.fields.forEach((field: any) => {
                  fieldMapping[field.label] = field.name
                })
                setSalesforceFieldMapping(fieldMapping)
              } else {
                headers = []
              }

              if (headers.length === 0) {
                console.warn(
                  'No Salesforce fields found, using fallback properties'
                )
                headers = SALESFORCE_FALLBACK_HEADERS_BY_RECORD_TYPE[recordType]
                // SF-7 / HubSpot parity: fallback list is API names — identity map so validate + preview refetch work.
                setSalesforceFieldMapping(
                  buildSalesforceIdentityFieldMapping(headers)
                )
                showCustomToast(
                  'Warning',
                  'Using standard Salesforce properties. Please check your Salesforce connection.',
                  'error',
                  5000
                )
              }
            } catch (error) {
              console.error(
                '[FieldMapping] Error fetching Salesforce fields:',
                error
              )
              headers = SALESFORCE_FALLBACK_HEADERS_BY_RECORD_TYPE[recordType]
              setSalesforceFieldMapping(
                buildSalesforceIdentityFieldMapping(headers)
              )
              showCustomToast(
                'Warning',
                'Something went wrong loading Salesforce fields. Using defaults.',
                'error',
                5000
              )
            }
            console.log('Salesforce headers loaded:', headers)
            break

          case 'GOOGLE_SHEET':
            const { url: activeSheetUrl, tabName: activeTabName } =
              getSheetConfigForActiveTab()
            if (!activeSheetUrl) {
              throw new Error('Google Sheet URL is required')
            }
            console.log(
              'Fetching Google Sheets columns for URL:',
              activeSheetUrl,
              'tab:',
              activeTabName
            )
            const result = await axios.get(
              `/api/google-sheets/columns?sheetUrl=${activeSheetUrl}${activeTabName ? `&tabName=${encodeURIComponent(activeTabName)}` : ''}`,
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )
            if (result?.status !== 200) {
              throw new Error(
                result?.data?.error || 'Failed to fetch Google Sheets columns'
              )
            }
            // Ensure result is an array
            const sheetsData = result?.data?.data
            headers = Array.isArray(sheetsData) ? sheetsData : []
            if (headers.length === 0) {
              throw new Error('No Google Sheets columns found')
            }
            console.log('Google Sheets headers loaded:', headers)
            break

          default:
            throw new Error(`Unsupported data source: ${dataSource}`)
        }

        // Ensure headers is always an array
        const headersArray = Array.isArray(headers) ? headers : []
        setCsvHeaders(headersArray)
        console.log('[FieldMapping] headers prepared for auto-map:', {
          recordType,
          dataSource,
          headersCount: headersArray.length,
          headers: headersArray
        })

        // Auto-map headers to sharkdom properties
        const autoMappedFields = autoMapHeaders(headersArray)
        console.log('[FieldMapping] applying auto-mapped fields:', {
          recordType,
          headersCount: headersArray.length,
          autoMappedFields
        })
        setSelectedMapping(autoMappedFields)

        // Log the mapping for debugging
        if (dataSource.toUpperCase() === 'PIPEDRIVE') {
          const fieldMappingStr = sessionStorage.getItem(
            'pipedriveFieldMapping'
          )
          if (fieldMappingStr) {
            const fieldMapping = JSON.parse(fieldMappingStr)
            console.log(
              'Auto-mapped fields with display names:',
              autoMappedFields
            )
            console.log('Field mapping for data processing:', fieldMapping)
          }
        }

        console.log(
          `Successfully loaded ${headersArray.length} headers for ${dataSource}`
        )
        console.log('Auto-mapped fields:', autoMappedFields)
      } catch (err) {
        console.error('Error fetching columns:', err)
        console.log('[FieldMapping] fetchColumns failed:', {
          dataSource,
          recordType,
          errorMessage: err instanceof Error ? err.message : String(err),
          error: err
        })
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch columns'
        setError(errorMessage)
        showCustomToast('Error', errorMessage, 'error', 5000)
      } finally {
        setIsLoading(false)
      }
    }

    fetchColumns()
  }, [
    dataSource,
    sheetUrl,
    org?.id,
    code,
    recordType,
    isHubSpotConnected,
    isPipedriveConnected,
    isSalesforceConnected,
    csvData,
    autoMapHeaders,
    integrationsLoading,
    refetch,
    getSheetConfigForActiveTab
  ])

  // Cleanup sessionStorage when component unmounts
  useEffect(() => {
    return () => {
      // Only clear if user navigates away without completing the flow
      // We'll keep the data if they're still in the flow
    }
  }, [])

  // Cleanup Pipedrive field mapping when going back
  const handleBack = () => {
    const connectServiceSlug =
      dataSource === 'GOOGLE_SHEET' ? 'google-sheets' : dataSource.toLowerCase()
    if (dataSource.toUpperCase() === 'CSV') {
      sessionStorage.removeItem('csvData')
      sessionStorage.removeItem('csvFileName')
      router.push(`${backBasePath}/upload-csv`)
    } else {
      if (dataSource.toUpperCase() === 'PIPEDRIVE') {
        sessionStorage.removeItem('pipedriveFieldMapping')
      }
      router.push(`${backBasePath}/connect-service/${connectServiceSlug}`)
    }
  }

  // Utility for Zoho data extraction
  const handleExtractDataFromColumns = (csvHeader: any, zohoData: any) => {
    return zohoData.map(({ ...obj }: any) => csvHeader.map((k: any) => obj[k]))
  }

  // HubSpot version
  const handleGetHubspotColumnsData = async () => {
    return new Promise(async (res, rej) => {
      try {
        const sanitizedSelectedMapping = getSanitizedSelectedMapping()
        let uniqueColumns = getUniqueValuesFromObject(
          sanitizedSelectedMapping
        ).filter((value) => value && value !== '' && value !== 'dont_import')
        // PROSPECT: fullName maps to a single column in the UI but we need BOTH
        // 'firstname' and 'lastname' from HubSpot to concatenate them into 'name'.
        // Inject both regardless of which one the user selected in the dropdown.
        if (recordType === 'PROSPECT' && sanitizedSelectedMapping.fullName) {
          if (!uniqueColumns.includes('firstname'))
            uniqueColumns = [...uniqueColumns, 'firstname']
          if (!uniqueColumns.includes('lastname'))
            uniqueColumns = [...uniqueColumns, 'lastname']
        }
        // PROSPECT: always fetch hs_object_id so we have a contactId for
        // the /integration/contact/{id}/companies enrichment step.
        if (recordType === 'PROSPECT') {
          if (!uniqueColumns.includes('hs_object_id'))
            uniqueColumns = [...uniqueColumns, 'hs_object_id']
        }
        const response = await getHubspotDataBasedOnColumns(
          org.id,
          uniqueColumns,
          recordType
        )
        if (response?.statusCode === 500) {
          return rej({ status: response.statusCode, msg: response.desc })
        }

        const rawRecords = Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : []

        // Ensure the top-level `id` field is always accessible directly on each record
        // (HubSpot returns { id, properties: { hs_object_id, ... } } — we need `id`
        // for the /integration/contact/{id}/companies enrichment call)
        const records = rawRecords.map((item: any) => {
          if (item?.id !== undefined && item.id !== null) {
            return { ...item, _contactId: String(item.id) }
          }
          return item
        })

        const data = records.map((item: any) => {
          const sourceObject =
            item?.properties && typeof item.properties === 'object'
              ? item.properties
              : item
          return uniqueColumns.map((k: string) => {
            return sourceObject?.[k] ?? item?.[k] ?? ''
          })
        })

        console.log('handleGetHubspotColumnsData')
        console.log('org', org)
        console.log('records', records)
        console.log('response', response)
        console.log('uniqueColumns', uniqueColumns)
        console.log('data', data)

        return res({
          status: '200',
          msg: 'Success',
          data,
          records,
          uniqueColumns
        })
      } catch (error: any) {
        return rej({
          status: 500,
          msg: error?.message || 'Failed to fetch HubSpot data'
        })
      }
    })
  }

  // Pipedrive version
  const handleGetPipedriveColumnsData = async () => {
    return new Promise(async (res, rej) => {
      try {
        const uniqueColumns = getUniqueValuesFromObject(selectedMapping).filter(
          (value) => value && value !== '' && value !== 'dont_import'
        )

        if (!org?.id) {
          return rej({ status: 400, msg: 'Organization ID not found' })
        }

        const result = await getPipedriveData(org.id, uniqueColumns)

        if (!result) {
          return rej({ status: 500, msg: 'Failed to fetch Pipedrive data' })
        }

        if (result.success && result.data) {
          // Transform Pipedrive data to match expected format
          // First, get the field mapping from sessionStorage to convert display names to field keys
          const fieldMappingStr = sessionStorage.getItem(
            'pipedriveFieldMapping'
          )
          const fieldMapping: Record<string, string> = fieldMappingStr
            ? JSON.parse(fieldMappingStr)
            : {}

          console.log('Using field mapping for data processing:', fieldMapping)
          console.log('Display names from mapping:', uniqueColumns)

          const data = result.data.map((item: any) => {
            const arr: any[] = []
            uniqueColumns.forEach((displayName: string) => {
              // Convert display name to actual field key
              const fieldKey = fieldMapping[displayName] || displayName
              console.log(
                `Processing field: "${displayName}" -> key: "${fieldKey}"`
              )

              // Handle nested properties in Pipedrive data
              let value = item[fieldKey] || item.properties?.[fieldKey] || ''

              // Special handling for contactEmail field - extract just the email value
              if (
                fieldKey === 'contactEmail' &&
                Array.isArray(value) &&
                value.length > 0
              ) {
                // Find the primary email or use the first one
                const primaryEmail =
                  value.find((email: any) => email.primary) || value[0]
                value = primaryEmail?.value || ''
              }

              arr.push(value)
            })
            return arr
          })
          return res({ status: '200', msg: 'Success', data, uniqueColumns })
        } else {
          return rej({
            status: 500,
            msg: 'Invalid response from Pipedrive API'
          })
        }
      } catch (error) {
        console.error('Error fetching Pipedrive data:', error)
        return rej({ status: 500, msg: 'Failed to fetch Pipedrive data' })
      }
    })
  }

  // Zoho version
  const handleGetZohoColumnsData = async (
    targetRecordType = recordType,
    targetSelectedMapping = getSanitizedSelectedMapping()
  ) => {
    return new Promise(async (res, rej) => {
      try {
        const uniqueColumns = getUniqueValuesFromObject(
          targetSelectedMapping
        ).filter(
          (value) => value && value !== '' && value !== 'dont_import'
        ) as string[]

        const zohoData = await getZohoData(targetRecordType)
        if (zohoData?.statusCode === 500)
          return rej({ status: zohoData?.statusCode, msg: zohoData?.desc })

        const data = handleExtractDataFromColumns(uniqueColumns, zohoData)
        return res({
          status: '200',
          msg: 'Success',
          data,
          uniqueColumns,
          records: zohoData
        })
      } catch (error: any) {
        console.error('Error fetching Zoho data:', error)
        return rej({
          status: 500,
          msg: error?.message || 'Failed to fetch Zoho data'
        })
      }
    })
  }

  // Salesforce version
  const handleGetSalesforceColumnsData = async () => {
    return new Promise(async (res, rej) => {
      try {
        let uniqueColumns = getUniqueValuesFromObject(selectedMapping).filter(
          (value) => value && value !== '' && value !== 'dont_import'
        )

        // PROSPECT: parity with HubSpot — fullName in UI may map to one column but we need
        // both standard Contact name parts for fetch + shortcut mapping.
        if (recordType === 'PROSPECT' && selectedMapping.fullName) {
          const labelForApi = (apiName: string) =>
            Object.keys(salesforceFieldMapping).find(
              (lbl) => salesforceFieldMapping[lbl] === apiName
            )
          const firstLabel = labelForApi('FirstName')
          const lastLabel = labelForApi('LastName')
          if (firstLabel && !uniqueColumns.includes(firstLabel)) {
            uniqueColumns = [...uniqueColumns, firstLabel]
          }
          if (lastLabel && !uniqueColumns.includes(lastLabel)) {
            uniqueColumns = [...uniqueColumns, lastLabel]
          }
          // If describe/fallback never mapped these, request standard API names directly.
          if (!firstLabel && !uniqueColumns.includes('FirstName')) {
            uniqueColumns = [...uniqueColumns, 'FirstName']
          }
          if (!lastLabel && !uniqueColumns.includes('LastName')) {
            uniqueColumns = [...uniqueColumns, 'LastName']
          }
        }

        if (!org?.id) {
          return rej({ status: 400, msg: 'Organization ID not found' })
        }

        // Convert labels to field names for Salesforce API
        const fieldNames = uniqueColumns.map(
          (label) => salesforceFieldMapping[label] || label
        )
        console.log('Converting labels to field names:', {
          uniqueColumns,
          fieldNames
        })

        const result = await getSalesforceData(org.id, fieldNames, recordType)
        if (!result) {
          return rej({ status: 500, msg: 'Failed to fetch Salesforce data' })
        }

        // Previously: only length > 0 succeeded; empty CRM rejected with "Invalid response".
        // That was stricter than HubSpot (which allows zero rows). Reject only bad shape.
        // if (result.records && result.records?.length > 0) {
        //   const data = result.records.map(...)
        //   return res({ status: '200', msg: 'Success', data, uniqueColumns })
        // } else {
        //   return rej({ status: 500, msg: 'Invalid response from Salesforce API' })
        // }

        if (!Array.isArray(result.records)) {
          return rej({
            status: 500,
            msg: 'Invalid response from Salesforce API'
          })
        }

        const records = result.records
        const data = records.map((record: any) => {
          const arr: any[] = []
          uniqueColumns.forEach((label: string) => {
            const fieldName = salesforceFieldMapping[label] || label
            const value = record[fieldName] || ''
            arr.push(value)
          })
          return arr
        })

        // `records` mirrors HubSpot helper — used by PROSPECT/OPPORTUNITY shortcut (raw objects).
        return res({
          status: '200',
          msg: 'Success',
          data,
          uniqueColumns,
          records
        })
      } catch (error) {
        console.error('Error fetching Salesforce data:', error)
        const msg =
          error instanceof Error && error.message
            ? error.message
            : 'Failed to fetch Salesforce data'
        return rej({ status: 500, msg })
      }
    })
  }

  const handleValidateAndUpload = async () => {
    setIsLoadingValidate(true)
    console.log('handleValidateAndUpload', csvData)
    try {
      const sanitizedSelectedMapping = getSanitizedSelectedMapping()
      let finalCsvData = csvData
      const { url: activeSheetUrl, tabName: activeTabName } =
        dataSource.toUpperCase() === 'GOOGLE_SHEET'
          ? getSheetConfigForActiveTab()
          : { url: '', tabName: '' }

      // For Google Sheets, fetch the actual data before proceeding
      if (dataSource.toUpperCase() === 'GOOGLE_SHEET') {
        console.log('Fetching Google Sheets data for field mapping...')
        if (!activeSheetUrl) {
          throw new Error('Google Sheet URL is required')
        }

        // Get the mapped columns from selectedMapping (filter out empty and 'dont_import' values)
        const mappedColumns = Object.values(sanitizedSelectedMapping).filter(
          (value) => value && value !== '' && value !== 'dont_import'
        ) as string[]

        if (mappedColumns.length === 0) {
          throw new Error('No columns mapped for Google Sheets data')
        }

        // Extract sheet ID from URL
        const sheetId = getGoogleSheetIdFromUrl(activeSheetUrl)
        if (!sheetId) {
          throw new Error('Invalid Google Sheet URL')
        }

        // Fetch the actual data from Google Sheets
        const result = await axios.get(
          `/api/google-sheets/${sheetId}?selectedColumns=${mappedColumns.join(',')}${activeTabName ? `&tabName=${encodeURIComponent(activeTabName)}` : ''}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (result?.status !== 200) {
          throw new Error(
            result?.data?.error || 'Failed to fetch Google Sheets data'
          )
        }

        const rawData = result?.data?.data || []

        // For Google Sheets, we need to format the data correctly for transformCsvData
        // The API returns selected columns as arrays, but transformCsvData expects [headers, ...dataRows]
        // So we need to reconstruct the data with headers and data rows
        const selectedColumns = Object.values(sanitizedSelectedMapping).filter(
          (value) => value && value !== '' && value !== 'dont_import'
        ) as string[]

        // Create the properly formatted data: [headers, ...dataRows]
        finalCsvData = [selectedColumns, ...rawData]

        console.log('Google Sheets data formatted successfully:', finalCsvData)
      }

      if (dataSource.toUpperCase() === 'HUBSPOT') {
        // Use the new handleGetHubspotColumnsData function
        try {
          const result: any = await handleGetHubspotColumnsData()
          const { data, records: hubspotRecords, uniqueColumns } = result

          finalCsvData = [uniqueColumns, ...data]
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

      if (dataSource.toUpperCase() === 'PIPEDRIVE') {
        // Use the new handleGetPipedriveColumnsData function
        try {
          const result: any = await handleGetPipedriveColumnsData()
          const { data, uniqueColumns } = result
          finalCsvData = [uniqueColumns, ...data]
        } catch (err: any) {
          showCustomToast(
            'Error',
            err?.msg || 'Failed to fetch Pipedrive data',
            'error',
            5000
          )
          return
        }
      }

      if (dataSource.toUpperCase() === 'ZOHO') {
        try {
          const result: any = await handleGetZohoColumnsData()
          const { data, uniqueColumns, records: zohoRecords } = result

          // --- SHORTCUT for PROSPECT / OPPORTUNITY (parity with HubSpot/Salesforce) ---
          if (recordType === 'PROSPECT' || recordType === 'OPPORTUNITY') {
            const zohoShortcutMapping = {
              ...(selectedMapping as Record<string, string>)
            }

            // Force inject missing identifiers for backend mapping
            if (recordType === 'PROSPECT') {
              zohoShortcutMapping.contactId = 'id'
              zohoShortcutMapping.contactOwner = 'Owner'
            } else if (recordType === 'OPPORTUNITY') {
              zohoShortcutMapping.dealId = 'id'
              zohoShortcutMapping.dealOwner = 'Owner'
            }

            const mappedFields = (zohoRecords ?? []).map((record: any) => {
              const flat: Record<string, string> = {}
              for (const [sharkdomKey, zohoLabel] of Object.entries(
                zohoShortcutMapping
              )) {
                // Special handle for Contacts name concatenation if fullName is mapped
                if (sharkdomKey === 'fullName' && recordType === 'PROSPECT') {
                  const first = String(
                    record.First_Name ?? record.first_name ?? ''
                  ).trim()
                  const last = String(
                    record.Last_Name ?? record.last_name ?? ''
                  ).trim()
                  const explicit = String(record?.[zohoLabel] ?? '').trim()
                  flat['name'] =
                    [first, last].filter(Boolean).join(' ') || explicit
                  continue
                }

                const raw = record[zohoLabel]
                if (raw === null || raw === undefined) continue

                // Handle object types (like Owner: {id: '...', name: '...'})
                let value = ''
                if (typeof raw === 'object' && raw !== null && raw.id) {
                  value = String(raw.id).trim()
                } else {
                  value = String(raw).trim()
                }

                if (!value) continue

                // Map to the required backend key
                const backendField =
                  CRM_SPARSE_SHARKDOM_TO_BACKEND_FIELD[sharkdomKey] ||
                  sharkdomKey
                flat[backendField] = value
              }
              return flat
            })

            const filteredFieldToColumnMapping = Object.entries(
              zohoShortcutMapping
            ).reduce(
              (acc, [key, value]) => {
                if (value && value !== 'dont_import') {
                  acc[key] = value
                }
                return acc
              },
              {} as Record<string, string>
            )

            const recordPayload = {
              organizationId: org?.id || 0,
              recordType,
              fileName: `${recordType.toLowerCase()}-import`,
              source: dataSource,
              frequency: 'WEEKLY',
              fields: mappedFields,
              fieldToColumnMapping: filteredFieldToColumnMapping
            }

            console.log(
              `[FieldMapping] Saving ${recordType} (Zoho) directly:`,
              recordPayload
            )

            await createPersonaOverlapRecord.mutateAsync(recordPayload)

            sessionStorage.removeItem('fieldMappingData')
            sessionStorage.removeItem('pending_recordType')
            if (typeof window !== 'undefined') {
              delete (window as any).__sharkdom_fieldMappingData
              delete (window as any).__sharkdom_temp_csvData
            }

            showCustomToast(
              'Success',
              `${recordType === 'PROSPECT' ? 'Prospects' : 'Opportunities'} imported successfully from Zoho.`,
              'success',
              5000
            )
            setIsLoadingValidate(false)
            router.push('/my-data')
            return
          }
          // --- END Zoho SHORTCUT ---

          finalCsvData = [uniqueColumns, ...data]
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

      if (dataSource.toUpperCase() === 'SALESFORCE') {
        // Use the new handleGetSalesforceColumnsData function
        try {
          const result: any = await handleGetSalesforceColumnsData()
          const { data, uniqueColumns, records: salesforceRecords } = result

          // --- SHORTCUT for PROSPECT / OPPORTUNITY (parity with HubSpot) ---
          // Skips customer-insights preview: map raw Salesforce rows → overlap payload, then /my-data.
          // CUSTOMER still goes through customer-insights, which refetches via `/api/salesforce-data` for preview.
          if (recordType === 'PROSPECT' || recordType === 'OPPORTUNITY') {
            const mappedFields = (salesforceRecords ?? []).map(
              (record: any) => {
                const flat: Record<string, string> = {}
                for (const [sharkdomKey, sfLabel] of Object.entries(
                  selectedMapping as Record<string, string>
                )) {
                  if (!sfLabel || sfLabel === 'dont_import') continue

                  if (sharkdomKey === 'fullName') {
                    const first = String(
                      record.FirstName ?? record.firstname ?? ''
                    ).trim()
                    const last = String(
                      record.LastName ?? record.lastname ?? ''
                    ).trim()
                    const apiName = salesforceFieldMapping[sfLabel] || sfLabel
                    const explicit = String(record?.[apiName] ?? '').trim()
                    flat['name'] =
                      [first, last].filter(Boolean).join(' ') || explicit
                    continue
                  }

                  const apiName = salesforceFieldMapping[sfLabel] || sfLabel
                  const raw = record[apiName]
                  if (raw === null || raw === undefined) continue

                  const value = String(raw).trim()
                  if (!value) continue

                  const backendField =
                    CRM_SPARSE_SHARKDOM_TO_BACKEND_FIELD[sharkdomKey] ??
                    sharkdomKey
                  flat[backendField] = value
                }
                return flat
              }
            )

            if (mappedFields.length === 0) {
              showCustomToast(
                'Error',
                'No records found to import.',
                'error',
                5000
              )
              setIsLoadingValidate(false)
              return
            }

            const filteredFieldToColumnMapping = Object.entries(
              selectedMapping
            ).reduce(
              (acc, [key, value]) => {
                if (
                  typeof value === 'string' &&
                  value !== '' &&
                  value !== 'dont_import'
                ) {
                  acc[key] = value
                }
                return acc
              },
              {} as Record<string, string>
            )

            const recordPayload = {
              organizationId: org.id,
              recordType: recordType as 'PROSPECT' | 'OPPORTUNITY',
              fileName: `${recordType.toLowerCase()}-import`,
              source: dataSource,
              frequency: 'WEEKLY' as const,
              googleSheetLink: '',
              fields: mappedFields,
              fieldToColumnMapping: filteredFieldToColumnMapping
            }

            console.log(
              `[FieldMapping] Saving ${recordType} (Salesforce) directly:`,
              recordPayload
            )

            await createPersonaOverlapRecord.mutateAsync(recordPayload)

            sessionStorage.removeItem('fieldMappingData')
            sessionStorage.removeItem('pending_recordType')
            if (typeof window !== 'undefined') {
              delete (window as any).__sharkdom_fieldMappingData
              delete (window as any).__sharkdom_temp_csvData
            }

            showCustomToast(
              'Success',
              `${recordType === 'PROSPECT' ? 'Prospects' : 'Opportunities'} imported successfully`,
              'success',
              3000
            )
            setIsLoadingValidate(false)
            router.push('/my-data')
            return
          }
          // --- END Salesforce SHORTCUT ---

          finalCsvData = [uniqueColumns, ...data]
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
            !selectedMapping[property.key] ||
            selectedMapping[property.key] === 'dont_import'
        )

      if (missingRequiredFields.length > 0) {
        showCustomToast(
          'Error',
          `Please map all required fields: ${missingRequiredFields.map((field) => field.label).join(', ')}.`,
          'error',
          7000
        )
        setIsLoadingValidate(false)
        return
      }

      const previewSelectedMapping = getSanitizedSelectedMapping()
      const mappedColumns = Object.values(previewSelectedMapping).filter(
        (value) => value && value !== '' && value !== 'dont_import'
      ) as string[]
      console.log('Mapped columns:', mappedColumns)

      // Store large data in memory to avoid sessionStorage QuotaExceededError
      if (typeof window !== 'undefined') {
        ;(window as any).__sharkdom_temp_csvData = finalCsvData
      }

      // Store mapping data in sessionStorage to avoid URL length issues
      const mappingData = {
        selectedMapping: previewSelectedMapping,
        csvHeaders:
          dataSource.toUpperCase() === 'HUBSPOT' ||
          dataSource.toUpperCase() === 'PIPEDRIVE' ||
          dataSource.toUpperCase() === 'SALESFORCE'
            ? mappedColumns
            : csvHeaders,
        dataSource,
        recordType,
        csvData: [], // Replaced with empty array to avoid 5MB quota; actual data passed via window.__sharkdom_temp_csvData
        sheetUrl: activeSheetUrl || sheetUrl,
        // HubSpot parity: preview refetch on customer-insights needs label→API name for SOQL (see `/api/salesforce-data`).
        ...(dataSource.toUpperCase() === 'SALESFORCE'
          ? { salesforceFieldMapping: { ...salesforceFieldMapping } }
          : {})
      }

      console.log('Storing field mapping data:', mappingData)
      console.log('Field mapping validation status:', isAllFieldsMapped)

      if (typeof window !== 'undefined') {
        ;(window as any).__sharkdom_fieldMappingData = mappingData
      }

      if (!isAllFieldsMapped) {
        console.warn('Not all fields are mapped, but proceeding anyway')
        showCustomToast(
          'Warning',
          'Some fields are not mapped. Please review your mappings.',
          'error',
          5000
        )
      }

      try {
        sessionStorage.setItem('fieldMappingData', JSON.stringify(mappingData))
        console.log('fieldMappingData saved to sessionStorage successfully')
        console.log(
          'fieldMappingData verification read:',
          sessionStorage.getItem('fieldMappingData')
        )
      } catch (storageError) {
        console.warn(
          'Saving fieldMappingData to sessionStorage failed, retrying after cleanup:',
          storageError
        )

        sessionStorage.removeItem('fieldMappingData')
        sessionStorage.removeItem('csvData')
        sessionStorage.removeItem('csvFileName')

        try {
          sessionStorage.setItem(
            'fieldMappingData',
            JSON.stringify(mappingData)
          )
          console.log(
            'fieldMappingData saved to sessionStorage successfully after cleanup'
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

      // Navigate: use redirectTo prop if provided, else check returnToPartnerPortal, else customer-insights
      if (redirectTo) {
        sessionStorage.setItem('show_insights_loader', 'true')
        router.push(redirectTo)
      } else {
        if (returnToPartnerPortal === 'true') {
          sessionStorage.removeItem('returnToPartnerPortal')
          router.push('/partner-portal/partner-mapping')
        } else {
          sessionStorage.setItem('show_insights_loader', 'true')
          router.push(
            encodedMappingData
              ? `/my-data/customer-insights?previewData=${encodeURIComponent(encodedMappingData)}`
              : '/my-data/customer-insights'
          )
        }
      }
      setIsLoadingValidate(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch data'
      showCustomToast('Error', errorMessage, 'error', 5000)
      setIsLoadingValidate(false)
    }
  }

  // Check if all REQUIRED mapping properties have valid (non-empty, non-dont_import) values.
  // Optional fields that are visible but set to "Don't Import" are perfectly fine.
  const isAllFieldsMapped = visibleSharkdomProperties
    .filter((property) => property.required)
    .every(
      (property) =>
        selectedMapping[property.key] !== '' &&
        selectedMapping[property.key] !== undefined &&
        selectedMapping[property.key] !== 'dont_import'
    )

  // Debug logging for field mapping validation
  console.log('Field mapping validation:', {
    selectedMapping,
    isAllFieldsMapped,
    sharkdomProperties: visibleSharkdomProperties.map((p) => ({
      key: p.key,
      value: selectedMapping[p.key],
      isMapped:
        selectedMapping[p.key] !== '' && selectedMapping[p.key] !== undefined
    }))
  })

  // Filter properties based on search term for a specific header

  if (isLoading) {
    // Determine which service is being connected based on the state parameter
    let connectingService = 'the service'
    if (code) {
      const isZohoState = zohoState === process.env.NEXT_PUBLIC_ZOHO_STATE
      if (isZohoState) {
        connectingService = 'Zoho'
      } else {
        // For HubSpot or any other service (including my-data-flow state)
        connectingService = 'HubSpot'
      }
    }

    const loadingMessage = code
      ? `Connecting to ${connectingService}...`
      : `Loading columns from ${dataSource ? dataSource.split('_').join(' ') : null}...`

    return (
      <div className='flex h-[calc(100vh-50px)] items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 text-lg font-semibold'>{loadingMessage}</div>
          <div className='text-sm text-gray-500'>
            {code
              ? 'Please wait while we set up your integration'
              : `Fetching data from ${dataSource}`}
          </div>
          {code && (
            <div className='mt-4'>
              <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#3E50F7]'></div>
            </div>
          )}
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
    <GradientPageBackground className='relative flex min-h-[calc(100vh-56px)] flex-col'>
      {/* Scrollable content */}
      <div className='flex-1 overflow-y-auto px-4 pb-6 pt-12'>
        <div className='mx-auto flex w-full max-w-5xl flex-col'>
          <CrmStepper current={2} />

          {/* Centered header */}
          <div className='mb-7 mt-8 flex flex-col items-center gap-2 text-center'>
            <h1 className='text-[24px] font-semibold leading-[34px] text-[#25224A]'>
              Field Mapping
            </h1>
            <p className='text-sm text-[#4D5C78]'>
              Map your data columns to Sharkdom properties.
            </p>
          </div>

          <div className='mx-auto w-full max-w-4xl'>
            {/* Review Column Properties Section */}
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

            {/* Mapping Table */}
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
                {sharkdomProperties
                  .filter(
                    (property: SharkdomProperty) =>
                      !hiddenProperties.has(property.key)
                  )
                  .map((property: SharkdomProperty) => (
                    <div
                      key={property.key}
                      className='grid grid-cols-3 items-center gap-4'
                    >
                      <div className='text-sm font-medium text-gray-700'>
                        {property.label}
                        {property.required && (
                          <span className='ml-1 text-red-500'>*</span>
                        )}
                      </div>

                      <div className='flex min-w-0 items-center gap-2'>
                        <div className='min-w-0 flex-1'>
                          <Select
                            value={selectedMapping[property.key] || ''}
                            onValueChange={(value) =>
                              setSelectedMapping({
                                ...selectedMapping,
                                [property.key]: value
                              })
                            }
                          >
                            <SelectTrigger className='h-10 w-full min-w-0 rounded-md border border-gray-300 bg-white'>
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
                                      setSearchTerms({
                                        ...searchTerms,
                                        [property.key]: e.target.value
                                      })
                                    }
                                    className='h-8 pl-8 text-sm'
                                  />
                                </div>
                              </div>

                              <div className='max-h-40 overflow-y-auto'>
                                {csvHeaders
                                  .filter((header) => {
                                    const searchTerm =
                                      searchTerms[property.key] || ''
                                    return (
                                      searchTerm === '' ||
                                      header
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase())
                                    )
                                  })
                                  .map((header) => (
                                    <SelectItem key={header} value={header}>
                                      {header}
                                    </SelectItem>
                                  ))}
                              </div>

                              {!property.required && (
                                <div className='sticky bottom-0 border-t border-gray-200 bg-white p-1'>
                                  <SelectItem
                                    value='dont_import'
                                    className='text-red-600'
                                  >
                                    Don&apos;t Import
                                  </SelectItem>
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {!property.required && (
                          <button
                            type='button'
                            onClick={() => {
                              setHiddenProperties((prev) => {
                                const newSet = new Set(prev)
                                newSet.add(property.key)
                                return newSet
                              })
                              setSelectedMapping({
                                ...selectedMapping,
                                [property.key]: ''
                              })
                              setSearchTerms({
                                ...searchTerms,
                                [property.key]: ''
                              })
                            }}
                            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                            title='Remove column mapping'
                          >
                            <X className='h-5 w-5' />
                          </button>
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
      </div>

      {/* Bottom navigation */}
      <div className='border-t border-[#CDD9F2] bg-white'>
        <div className='flex w-full items-center justify-between px-6 py-4'>
          <button
            onClick={handleBack}
            className='flex h-8 items-center rounded-[4px] bg-white px-4 text-sm font-semibold text-[#21232C] shadow-[0px_1px_2px_rgba(42,54,71,0.05)] outline outline-1 outline-[rgba(33,35,44,0.24)]'
          >
            Back
          </button>
          <Button
            disabled={!isAllFieldsMapped}
            onClick={handleValidateAndUpload}
            loading={isLoadingValidate}
            loadingText='Loading...'
            className='flex h-8 items-center rounded-[4px] px-4 text-sm font-semibold text-white shadow-[0px_1px_2px_rgba(42,54,71,0.05)] disabled:cursor-not-allowed'
            style={{
              backgroundColor: isAllFieldsMapped ? '#2563EB' : '#ABBDE7'
            }}
          >
            Validate & Upload
          </Button>
        </div>
      </div>
    </GradientPageBackground>
  )
}
