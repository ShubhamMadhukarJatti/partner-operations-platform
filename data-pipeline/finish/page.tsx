'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCreatePersonaOverlapRecord } from '@/http-hooks/partner-match'
import type { RootState } from '@/redux/store'
import type { OrganizationType } from '@/types'
import {
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Coins,
  Globe,
  Loader2,
  Mail,
  Pencil,
  Phone,
  User
} from 'lucide-react'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import DataPipelineStepper from '../_components/DataPipelineStepper'
import RefreshFrequency, {
  type FrequencyOption
} from '../_components/RefreshFrequency'

// Frequency string mapping from UI selection to Backend Enum
const FREQUENCY_MAPPING: Record<
  FrequencyOption,
  'WEEKLY' | 'FIFTEEN_DAYS' | 'THIRTY_DAYS' | 'NINETY_DAYS'
> = {
  '1 Week': 'WEEKLY',
  '15 days': 'FIFTEEN_DAYS',
  '30 days': 'THIRTY_DAYS',
  '90 days': 'NINETY_DAYS'
}

// Flat schema fields mapping template
const EMPTY_FIELD_TEMPLATE = {
  name: null,
  companyName: null,
  website: null,
  country: null,
  industry: null,
  companySize: null,
  linkedinUrl: null,
  annualRevenue: null,
  description: null,
  companyPhone: null,
  city: null,
  firstName: null,
  lastName: null,
  jobTitle: null,
  contactLinkedinUrl: null,
  leadStatus: null,
  contactPhone: null,
  lastActivityDate: null,
  contactOwner: null,
  contactId: null,
  associatedCompanyId: null,
  associatedContactId: null,
  dealName: null,
  dealStage: null,
  dealOwner: null,
  amountAcv: null,
  closeDate: null,
  dealId: null,
  pipeline: null,
  dealType: null
}

const SHARKDOM_KEY_TO_BACKEND_FIELD: Record<string, string> = {
  fullName: 'name',
  name: 'name',
  linkedInUrl: 'linkedinUrl',
  phone: 'companyPhone',
  domain: 'website',
  countryGeography: 'country',
  annualRevenue: 'annualRevenue',
  companySize: 'companySize',
  city: 'city',
  industry: 'industry',
  description: 'description',
  dealname: 'dealName',
  dealStage: 'dealStage',
  dealOwner: 'dealOwner',
  amountAcv: 'amountAcv',
  closeDate: 'closeDate',
  dealId: 'dealId',
  pipeline: 'pipeline',
  dealType: 'dealType',
  lastActivityDate: 'lastActivityDate',
  associatedCompanyId: 'associatedCompanyId',
  associatedContactId: 'associatedContactId',
  contactId: 'contactId'
}

export default function DataPipelineFinishPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const createPersonaOverlapRecord = useCreatePersonaOverlapRecord()

  // Select active organization from Redux state
  const organization = useSelector(
    (state: RootState) =>
      state.organization?.organizationData as OrganizationType
  )

  const inputRef = useRef<HTMLInputElement>(null)
  const [importName, setImportName] = useState('CustomersList-converted')
  const [frequency, setFrequency] = useState<FrequencyOption>('1 Week')

  // Mapped data parsing states
  const [mappingData, setMappingData] = useState<any>(null)
  const [contactsCsv, setContactsCsv] = useState<any[] | null>(null)
  const [companiesCsv, setCompaniesCsv] = useState<any[] | null>(null)
  const [dealsCsv, setDealsCsv] = useState<any[] | null>(null)

  // Accordion open section state
  const [openSection, setOpenSection] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const storedMapping = sessionStorage.getItem('fieldMappingData')
      const inMemoryMapping = (window as any).__sharkdom_fieldMappingData
      // Prioritize inMemoryMapping to ensure we don't load stale storage data
      const parsedMapping =
        inMemoryMapping || (storedMapping ? JSON.parse(storedMapping) : null)

      if (parsedMapping) {
        setMappingData(parsedMapping)
      }

      const storedContacts = sessionStorage.getItem(
        '__sharkdom_temp_csvData_contacts'
      )
      const storedCompanies = sessionStorage.getItem(
        '__sharkdom_temp_csvData_companies'
      )
      const storedDeals = sessionStorage.getItem(
        '__sharkdom_temp_csvData_deals'
      )

      const inMemoryContacts = (window as any).__sharkdom_temp_csvData_contacts
      const inMemoryCompanies = (window as any)
        .__sharkdom_temp_csvData_companies
      const inMemoryDeals = (window as any).__sharkdom_temp_csvData_deals

      const storedCsv =
        sessionStorage.getItem('__sharkdom_temp_csvData') ||
        sessionStorage.getItem('csvData')
      const inMemoryCsv = (window as any).__sharkdom_temp_csvData

      const finalContacts =
        inMemoryContacts || (storedContacts ? JSON.parse(storedContacts) : null)
      const finalCompanies =
        inMemoryCompanies ||
        (storedCompanies ? JSON.parse(storedCompanies) : null)
      const finalDeals =
        inMemoryDeals || (storedDeals ? JSON.parse(storedDeals) : null)

      // Fallback fallback mappings
      const mainCsv = storedCsv ? JSON.parse(storedCsv) : inMemoryCsv

      if (finalContacts) setContactsCsv(finalContacts)
      else if (mainCsv && Array.isArray(mainCsv)) setContactsCsv(mainCsv)

      if (finalCompanies) setCompaniesCsv(finalCompanies)
      else if (mainCsv && Array.isArray(mainCsv)) setCompaniesCsv(mainCsv)

      if (finalDeals) setDealsCsv(finalDeals)
      else if (mainCsv && Array.isArray(mainCsv)) setDealsCsv(mainCsv)
    } catch (e) {
      console.error('Failed to load mapping or csv data:', e)
    }
  }, [])

  const selectedMapping = useMemo(
    () => mappingData?.selectedMapping || {},
    [mappingData]
  )

  const getMappedPropertiesForTab = useCallback(
    (tabName: 'contacts' | 'companies' | 'deals') => {
      const tabNameCapitalized = (tabName.charAt(0).toUpperCase() +
        tabName.slice(1)) as 'Contacts' | 'Companies' | 'Deals'
      const tabMapping =
        mappingData?.selectedMappingByTab?.[tabNameCapitalized] ||
        selectedMapping ||
        {}

      const standardProps = {
        contacts: [
          'fullName',
          'contactEmail',
          'jobTitle',
          'contactOwner',
          'leadStatus',
          'linkedInUrl',
          'phone',
          'lastActivityDate',
          'associatedCompanyId'
        ],
        companies: [
          'name',
          'domain',
          'industry',
          'companySize',
          'countryGeography',
          'linkedInUrl',
          'annualRevenue',
          'description',
          'phone',
          'city'
        ],
        deals: [
          'dealname',
          'dealStage',
          'associatedCompanyId',
          'dealOwner',
          'amountAcv',
          'closeDate',
          'dealId',
          'pipeline',
          'lastActivityDate',
          'dealType',
          'associatedContactId'
        ]
      }

      const HIDDEN_FINISH_KEYS = new Set([
        'dealId',
        'associatedCompanyId',
        'associatedContactId',
        'dealOwner',
        'contactOwner',
        'id',
        'Id',
        'hs_object_id',
        'contactId',
        'companyId',
        'contactid',
        'companyid'
      ])

      // Helper: returns true for any key that looks like an ID field
      const isIdKey = (key: string) => {
        const lower = key.toLowerCase()
        return (
          lower === 'id' ||
          lower.endsWith('id') ||
          lower.endsWith('_id') ||
          lower.startsWith('hs_object') ||
          HIDDEN_FINISH_KEYS.has(key)
        )
      }

      const standardKeys = standardProps[tabName]
      const tabKeys = new Set(standardKeys)
      const otherTabsKeys = new Set(
        Object.entries(standardProps)
          .filter(([t]) => t !== tabName)
          .flatMap(([_, keys]) => keys)
      )

      const mapped: { key: string; label: string }[] = []

      // 1. Add standard mapped keys
      standardKeys.forEach((k) => {
        if (isIdKey(k)) return
        const val = tabMapping[k]
        if (val && val !== 'dont_import') {
          let label = k
          if (k === 'fullName') label = 'Name'
          else if (k === 'contactEmail') label = 'Email'
          else if (k === 'jobTitle') label = 'Job Title'
          else if (k === 'contactOwner') label = 'Contact Owner'
          else if (k === 'leadStatus') label = 'Lead Status'
          else if (k === 'linkedInUrl') label = 'LinkedIn URL'
          else if (k === 'phone') label = 'Phone'
          else if (k === 'lastActivityDate') label = 'Last Activity'
          else if (k === 'name') label = 'name'
          else if (k === 'domain') label = 'Website'
          else if (k === 'industry') label = 'Industry'
          else if (k === 'companySize') label = 'Company Size'
          else if (k === 'countryGeography') label = 'Country Geography'
          else if (k === 'annualRevenue') label = 'Annual Revenue'
          else if (k === 'description') label = 'Description'
          else if (k === 'city') label = 'City'
          else if (k === 'dealname') label = 'number'
          else if (k === 'dealStage') label = 'Deal Stage'
          else if (k === 'amountAcv') label = 'Amount'
          else if (k === 'pipeline') label = 'Pipeline'
          else if (k === 'dealType') label = 'Deal Type'

          mapped.push({ key: k, label })
        }
      })

      // 2. Add custom mapped keys (drag & drop) — skip any ID-like keys
      Object.entries(tabMapping).forEach(([sharkdomKey, fileCol]) => {
        if (!fileCol || fileCol === 'dont_import') return
        if (isIdKey(sharkdomKey)) return
        if (tabKeys.has(sharkdomKey)) return
        if (otherTabsKeys.has(sharkdomKey)) return

        const label = sharkdomKey
          .replace(/^custom-/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())

        mapped.push({ key: sharkdomKey, label })
      })

      return mapped
    },
    [selectedMapping, mappingData]
  )

  // Dynamically calculate stats for each card
  const contactsStats = useMemo(() => {
    const mappedProps = getMappedPropertiesForTab('contacts')
    const mappedCount = mappedProps.length

    let emailPct = 100
    if (contactsCsv && contactsCsv.length > 1) {
      const headers = contactsCsv[0]
      const rows = contactsCsv.slice(1)
      const emailCol = selectedMapping['contactEmail']
      if (emailCol && emailCol !== 'dont_import') {
        const colIdx = headers.indexOf(emailCol)
        if (colIdx !== -1) {
          const withEmail = rows.filter((r) => r[colIdx]?.trim()).length
          emailPct = Math.round((withEmail / rows.length) * 100) || 100
        }
      }
    }

    const pills = mappedProps.map((p) => p.label)

    return {
      count: contactsCsv ? contactsCsv.length - 1 : 105,
      mappedCount,
      extraText: `${emailPct}% emails`,
      pills: pills.length > 0 ? pills : ['Email', 'Email', 'Email', 'Email']
    }
  }, [contactsCsv, selectedMapping, getMappedPropertiesForTab])

  const companiesStats = useMemo(() => {
    const mappedProps = getMappedPropertiesForTab('companies')
    const mappedCount = mappedProps.length

    let phoneVal = 90
    if (companiesCsv && companiesCsv.length > 1) {
      const headers = companiesCsv[0]
      const rows = companiesCsv.slice(1)
      const phoneCol = selectedMapping['phone']
      if (phoneCol && phoneCol !== 'dont_import') {
        const colIdx = headers.indexOf(phoneCol)
        if (colIdx !== -1) {
          const withPhone = rows.filter((r) => r[colIdx]?.trim()).length
          phoneVal = withPhone
        }
      }
    }

    const pills = mappedProps.map((p) => p.label)

    return {
      count: companiesCsv ? companiesCsv.length - 1 : 105,
      mappedCount,
      extraText: `${phoneVal} has phone numbers`,
      pills: pills.length > 0 ? pills : ['name', 'Email', 'Email', 'Email']
    }
  }, [companiesCsv, selectedMapping, getMappedPropertiesForTab])

  const dealsStats = useMemo(() => {
    const mappedProps = getMappedPropertiesForTab('deals')
    const mappedCount = mappedProps.length

    let totalValueText = '$1.5k total value'
    if (dealsCsv && dealsCsv.length > 1) {
      const headers = dealsCsv[0]
      const rows = dealsCsv.slice(1)
      const amountCol = selectedMapping['amountAcv']
      if (amountCol && amountCol !== 'dont_import') {
        const colIdx = headers.indexOf(amountCol)
        if (colIdx !== -1) {
          const sum = rows.reduce(
            (acc, r) => acc + (parseFloat(r[colIdx]) || 0),
            0
          )
          if (sum >= 1000) {
            totalValueText = `$${(sum / 1000).toFixed(1)}k total value`
          } else {
            totalValueText = `$${sum} total value`
          }
        }
      }
    }

    const pills = mappedProps.map((p) => p.label)

    return {
      count: dealsCsv ? dealsCsv.length - 1 : 105,
      mappedCount,
      extraText: totalValueText,
      pills: pills.length > 0 ? pills : ['number', 'Email', 'Email', 'Email']
    }
  }, [dealsCsv, selectedMapping, getMappedPropertiesForTab])

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Final submission of import
  const handleFinalizeImport = async () => {
    if (!importName.trim()) {
      showCustomToast(
        'Error',
        'Please enter a valid import name.',
        'error',
        3000
      )
      return
    }

    const orgId = organization?.id || 0
    const recordType = mappingData?.recordType || 'PROSPECT'
    const dataSource = mappingData?.dataSource || 'CSV'
    const sheetUrl = mappingData?.sheetUrl || ''

    const buildPayloadForTab = (
      tabName: 'contacts' | 'companies' | 'deals',
      csvRows: any[] | null
    ) => {
      if (!csvRows || csvRows.length <= 1) return null

      const tabNameCapitalized = (tabName.charAt(0).toUpperCase() +
        tabName.slice(1)) as 'Contacts' | 'Companies' | 'Deals'

      const tabRecordType: Record<
        string,
        'PROSPECT' | 'CUSTOMER' | 'OPPORTUNITY'
      > = {
        contacts: 'PROSPECT',
        companies: 'CUSTOMER',
        deals: 'OPPORTUNITY'
      }

      const tabMapping =
        mappingData?.selectedMappingByTab?.[tabNameCapitalized] ||
        selectedMapping ||
        {}

      const headers = csvRows[0]
      const rows = csvRows.slice(1)

      const fields = rows.map((row) => {
        const flat: Record<string, string | null> = { ...EMPTY_FIELD_TEMPLATE }

        Object.entries(tabMapping).forEach(([sharkdomKey, fileCol]) => {
          if (!fileCol || fileCol === 'dont_import') return

          const colIdx = headers.indexOf(fileCol as string)
          if (colIdx === -1) return

          const rawVal = row[colIdx]
          const value =
            rawVal !== null && rawVal !== undefined
              ? String(rawVal).trim()
              : null

          const backendField =
            SHARKDOM_KEY_TO_BACKEND_FIELD[sharkdomKey] ?? sharkdomKey
          if (backendField in flat) {
            flat[backendField] = value
          }

          if (
            backendField === 'name' &&
            tabRecordType[tabName] === 'CUSTOMER' &&
            value
          ) {
            flat['companyName'] = value
          }
        })

        return flat
      })

      return {
        organizationId: orgId,
        recordType: tabRecordType[tabName],
        googleSheetLink: dataSource === 'GOOGLE_SHEET' ? sheetUrl : '',
        frequency: FREQUENCY_MAPPING[frequency] || 'WEEKLY',
        fileName: `${importName}-${tabName}`,
        source: dataSource,
        fields,
        fieldToColumnMapping: tabMapping
      }
    }

    const payloads: any[] = []

    if (
      dataSource === 'HUBSPOT' ||
      dataSource === 'PIPEDRIVE' ||
      dataSource === 'SALESFORCE' ||
      dataSource === 'ZOHO' ||
      dataSource === 'GOOGLE_SHEET'
    ) {
      const contactsPayload = buildPayloadForTab('contacts', contactsCsv)
      const companiesPayload = buildPayloadForTab('companies', companiesCsv)
      const dealsPayload = buildPayloadForTab('deals', dealsCsv)

      if (contactsPayload) payloads.push(contactsPayload)
      if (companiesPayload) payloads.push(companiesPayload)
      if (dealsPayload) payloads.push(dealsPayload)
    } else {
      // Fallback CSV / Single import
      const storedCsv =
        sessionStorage.getItem('__sharkdom_temp_csvData') ||
        sessionStorage.getItem('csvData')
      const inMemoryCsv = (window as any).__sharkdom_temp_csvData
      const activeCsv = storedCsv ? JSON.parse(storedCsv) : inMemoryCsv

      const singlePayload = buildPayloadForTab(
        recordType === 'PROSPECT'
          ? 'contacts'
          : recordType === 'CUSTOMER'
            ? 'companies'
            : 'deals',
        activeCsv
      )
      if (singlePayload) payloads.push(singlePayload)
    }

    if (payloads.length === 0) {
      showCustomToast(
        'Error',
        'No data found. Please ensure your data source contains valid data.',
        'error',
        5000
      )
      return
    }

    setIsSubmitting(true)
    try {
      console.log(
        '[DEBUG] Final Payload being submitted to API:',
        JSON.parse(JSON.stringify(payloads))
      )

      await Promise.all(
        payloads.map((p) => createPersonaOverlapRecord.mutateAsync(p))
      )

      // Navigate to syncing page to show the success animation
      router.push(`/data-pipeline/syncing?${searchParams.toString()}`)
    } catch (err: any) {
      console.error('Failed to submit import:', err)
      const msg =
        err?.message || 'Something went wrong during import submission'
      showCustomToast('Submission Failed', msg, 'error', 4000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <GradientPageBackground className='flex min-h-screen flex-col'>
      {/* Stepper */}
      <div className='px-6 pt-5'>
        <DataPipelineStepper current={4} />
      </div>

      {/* Heading */}
      <div className='mt-8 flex flex-col items-center gap-2 px-6'>
        <div className='flex items-center justify-center gap-3'>
          <h1 className='text-center text-2xl font-bold leading-[34px] text-[#303030]'>
            Marketing data preview
          </h1>
        </div>
        <p className='text-center text-sm font-semibold leading-5 text-[#909CC0]'>
          Details from the connected source
        </p>
      </div>

      {/* Main content */}
      <div className='mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 px-6 pb-0 lg:grid-cols-2'>
        {/* Accordions */}
        <div
          className='flex flex-col rounded-2xl border border-[#F3F4F6] p-6'
          style={{ background: 'rgba(255,255,255,0.30)' }}
        >
          {/* Contacts Row */}
          <div className='pb-1 transition-all '>
            <div
              className='flex cursor-pointer items-center justify-between'
              onClick={() => toggleSection('contacts')}
            >
              <div className='flex items-center gap-3'>
                <User className='h-6 w-6 text-[#0C90E4]' />
                <div className='flex flex-col'>
                  <h4 className='text-[15px] font-bold text-[#303030]'>
                    {contactsStats.count} contacts
                  </h4>
                  <p className='mt-0.5 text-xs text-[#6A7282]'>
                    {contactsStats.mappedCount} fields mapped
                  </p>
                </div>
              </div>
              <button type='button' className='text-[#B4C0CC]'>
                {openSection === 'contacts' ? (
                  <ChevronUp className='h-5 w-5' />
                ) : (
                  <ChevronDown className='h-5 w-5' />
                )}
              </button>
            </div>

            {/* Pills section */}
            <div className='ml-9 mt-1 flex flex-wrap gap-2'>
              {contactsStats.pills.map((pill, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#F9FAFB',
                    border: '1px solid #F3F4F6',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#303030',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <svg
                    width='10'
                    height='10'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#6863FB'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                  {pill}
                </span>
              ))}
            </div>

            {/* Expandable details */}
            {openSection === 'contacts' && (
              <div className='ml-9 mt-4 grid grid-cols-2 gap-3 border-t border-dashed border-gray-100 pt-4 text-xs'>
                {getMappedPropertiesForTab('contacts').map(({ key, label }) => {
                  const val = selectedMapping[key]
                  if (!val || val === 'dont_import') return null
                  return (
                    <div
                      key={key}
                      className='flex justify-between border-b border-[#E4F0FC] px-2 pb-1.5'
                    >
                      <span className='font-semibold text-[#909CC0]'>
                        {label}
                      </span>
                      <span className='font-bold text-[#303030]'>{val}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className='mb-5 h-[1px] w-full bg-[#E4F0FC]' />

          {/* Companies Row */}
          <div className='pb-1 transition-all'>
            <div
              className='flex cursor-pointer items-center justify-between'
              onClick={() => toggleSection('companies')}
            >
              <div className='flex items-center gap-3'>
                <Building2 className='h-6 w-6 text-[#0C90E4]' />
                <div className='flex flex-col'>
                  <h4 className='text-[15px] font-bold text-[#303030]'>
                    {companiesStats.count} companies
                  </h4>
                  <p className='mt-0.5 text-xs text-[#6A7282]'>
                    {companiesStats.mappedCount} fields mapped
                  </p>
                </div>
              </div>
              <button type='button' className='text-[#B4C0CC]'>
                {openSection === 'companies' ? (
                  <ChevronUp className='h-5 w-5' />
                ) : (
                  <ChevronDown className='h-5 w-5' />
                )}
              </button>
            </div>

            {/* Pills section */}
            <div className='ml-9 mt-1 flex flex-wrap gap-2'>
              {companiesStats.pills.map((pill, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#F9FAFB',
                    border: '1px solid #F3F4F6',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#303030',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <svg
                    width='10'
                    height='10'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#6863FB'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                  {pill}
                </span>
              ))}
            </div>

            {/* Expandable details */}
            {openSection === 'companies' && (
              <div className='ml-9 mt-4 grid grid-cols-2 gap-3 border-t border-dashed border-gray-100 pt-4 text-xs'>
                {getMappedPropertiesForTab('companies').map(
                  ({ key, label }) => {
                    const val = selectedMapping[key]
                    if (!val || val === 'dont_import') return null
                    return (
                      <div
                        key={key}
                        className='flex justify-between border-b border-[#E4F0FC] px-2 pb-1.5'
                      >
                        <span className='font-semibold text-[#909CC0]'>
                          {label}
                        </span>
                        <span className='font-bold text-[#303030]'>{val}</span>
                      </div>
                    )
                  }
                )}
              </div>
            )}
          </div>

          <div className='mb-1 h-[1px] w-full bg-[#E4F0FC]' />

          {/* Deals Row */}
          <div className='transition-all'>
            <div
              className='flex cursor-pointer items-center justify-between'
              onClick={() => toggleSection('deals')}
            >
              <div className='flex items-center gap-3'>
                <Coins className='h-6 w-6 text-[#0C90E4]' />
                <div className='flex flex-col'>
                  <h4 className='text-[15px] font-bold text-[#303030]'>
                    {dealsStats.count} deals
                  </h4>
                  <p className='mt-0.5 text-xs text-[#6A7282]'>
                    {dealsStats.mappedCount} fields mapped
                  </p>
                </div>
              </div>
              <button type='button' className='text-[#B4C0CC]'>
                {openSection === 'deals' ? (
                  <ChevronUp className='h-5 w-5' />
                ) : (
                  <ChevronDown className='h-5 w-5' />
                )}
              </button>
            </div>

            {/* Pills section */}
            <div className='ml-9 mt-1 flex flex-wrap gap-2'>
              {dealsStats.pills.map((pill, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#F9FAFB',
                    border: '1px solid #F3F4F6',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#303030',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <svg
                    width='10'
                    height='10'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#6863FB'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                  {pill}
                </span>
              ))}
            </div>

            {/* Expandable details */}
            {openSection === 'deals' && (
              <div className='ml-9 mt-4 grid grid-cols-2 gap-3 border-t border-dashed border-gray-100 pt-4 text-xs'>
                {getMappedPropertiesForTab('deals').map(({ key, label }) => {
                  const val = selectedMapping[key]
                  if (!val || val === 'dont_import') return null
                  return (
                    <div
                      key={key}
                      className='flex justify-between border-b border-[#E4F0FC] px-2 pb-1.5'
                    >
                      <span className='font-semibold text-[#909CC0]'>
                        {label}
                      </span>
                      <span className='font-bold text-[#303030]'>{val}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div
          className='flex flex-col gap-6 rounded-2xl border border-[#F3F4F6] p-6'
          style={{ background: 'rgba(255,255,255,0.30)' }}
        >
          {/* Import name input with floating label */}
          <div className='relative mt-2'>
            <div className='relative flex items-center rounded-lg border border-[#E4F0FC] bg-white px-3 py-1.5 transition-colors focus-within:border-[#0C90E4]'>
              <label className='absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold uppercase tracking-wider text-[#909CC0]'>
                Name your Import
              </label>
              <Input
                ref={inputRef}
                value={importName}
                onChange={(e) => setImportName(e.target.value)}
                disabled={createPersonaOverlapRecord.isPending}
                placeholder='e.g. HubSpot Contact Import'
                className='h-8 w-full border-0 bg-transparent p-0 pr-8 text-sm font-semibold text-[#303030] placeholder:text-[#B4C0CC] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-75'
              />
              <button
                type='button'
                onClick={() => inputRef.current?.focus()}
                className='absolute right-3 transition-all hover:opacity-80 focus:outline-none active:scale-95'
                aria-label='Edit import name'
              >
                <Pencil className='h-3.5 w-3.5 text-[#909CC0]' />
              </button>
            </div>
          </div>

          {/* Refresh frequency selector */}
          <div>
            <RefreshFrequency value={frequency} onChange={setFrequency} />
          </div>

          {/* Private Data Banner */}
          <div className='rounded-xl border border-[#B4A8C0] bg-[#EEF6FF] p-5'>
            <p className='mb-1.5 text-sm font-medium text-[#1447E6]'>
              Your data stays private
            </p>
            <p className='text-xs font-normal leading-relaxed text-[#1447E6]'>
              Partners only see account overlap, never your contact details or
              pipeline values. You control what&apos;s revealed before any data
              is shared.
            </p>
          </div>
        </div>
      </div>
      {/* Footer bar */}
      <div className='mt-auto flex items-center justify-between border-t border-[#B4C0CC] bg-white px-6 py-4'>
        <Button
          variant='outline'
          onClick={() =>
            router.push(`/data-pipeline/preview?${searchParams.toString()}`)
          }
          disabled={createPersonaOverlapRecord.isPending}
          className='h-9 rounded-lg border border-[#E4F0FC] px-5 text-xs font-bold text-[#909CC0] hover:bg-[#E4F0FC]'
        >
          Back
        </Button>
        <Button
          onClick={handleFinalizeImport}
          disabled={isSubmitting}
          className='h-9 min-w-[120px] rounded-lg bg-[#2563EB] px-6 text-xs font-bold text-white shadow-sm hover:bg-[#1D4ED8] disabled:opacity-60'
        >
          {isSubmitting ? (
            <div className='flex items-center justify-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span>Importing...</span>
            </div>
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </GradientPageBackground>
  )
}
