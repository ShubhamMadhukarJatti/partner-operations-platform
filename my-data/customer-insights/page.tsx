'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import {
  useAddOverlapColumn,
  useOverlapTable,
  useRemoveOverlapColumn,
  useRenameOverlapColumn,
  useUpdateOverlapColumnOrder,
  useUpdateOverlapRowValues
} from '@/http-hooks/overlap-table'
import {
  useCreatePersonaOverlap,
  useCreatePersonaOverlapCustomer,
  useCreatePersonaOverlapRecord,
  useDisconnectPersonaCrm,
  useGetPersona,
  useGetPersonaPreview
} from '@/http-hooks/partner-match'
import {
  getLatestOverlapVersionId,
  sortOverlapVersionsNewestFirst,
  useOverlapRecordVersions,
  usePersonaDetailsByVersion,
  usePersonaVersionData,
  usePersonaVersions,
  useVersionedOverlapRecords
} from '@/http-hooks/persona-versions'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  ArrowLeft,
  ArrowLeftRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Code,
  Copy,
  Database,
  Eye,
  Factory,
  HeartPulse,
  History,
  Landmark,
  Laptop,
  Link as LinkIcon,
  Loader2,
  Newspaper,
  Play,
  ReceiptText,
  RefreshCcw,
  Rows4,
  SlidersHorizontal,
  Unplug,
  Webhook
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { z } from 'zod'

import { INTEGRATION_STATUS, INTEGRATIONS } from '@/lib/constants/integrations'
import {
  getHubspotContactCompanies,
  getHubspotContactCompaniesBatch,
  getHubspotDataBasedOnColumns,
  getHubspotDealCompanies,
  getHubspotDealCompaniesBatch,
  getZohoData,
  getZohoDataHeaders
} from '@/lib/db/customer-persona'
import { cn, getUniqueValuesFromObject } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { showCustomToast } from '@/components/custom-toast'
import { OpenDealIcon } from '@/components/icons/icons'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'
import IndustryDistribution from '@/app/(app)/(dashboard-pages)/data-pipeline/_components/IndustryDistribution'
import PartnershipMatrix from '@/app/(app)/(dashboard-pages)/data-pipeline/_components/PartnershipMatrix'
import SummaryWidget from '@/app/(app)/(dashboard-pages)/data-pipeline/_components/SummaryWidget'

import PreviewTable from '../_components/PreviewTable'
import { recordType } from '../_components/Segment'
import {
  getZohoWebhookValidation,
  testZohoWebhook
} from '../../partner-mapping/api.server'
import DataMatrix from './_components/DataMatrix'
import DetailsCard from './_components/DetailsCard'
import PartnermatchAnalytics from './_components/parntermatch-analytics'
import PartnerMatchProcessModal from './_components/partnermatch-process-modal'
import PartnermatchSourceModal from './_components/partnermatch-source-modal'
import UnderReview from './_components/under-review'

const clearPersonaFrontendState = () => {
  if (typeof window === 'undefined') return

  // Clear sessionStorage entries
  sessionStorage.removeItem('fieldMappingData')
  sessionStorage.removeItem('csvData')
  sessionStorage.removeItem('csvFileName')
  sessionStorage.removeItem('recordType')
  sessionStorage.removeItem('returnToPartnerPortal')
  sessionStorage.removeItem('crm_cleanup_triggered')

  // Clear in-memory window caches
  delete (window as any).__sharkdom_temp_csvData
  delete (window as any).__sharkdom_fieldMappingData
}

const sanitizePreviewSelectedMapping = (
  selectedMapping: Record<string, string>,
  recordType: 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'
) => {
  if (recordType !== 'PROSPECT') return selectedMapping

  return Object.entries(selectedMapping).reduce(
    (acc, [key, value]) => {
      if (
        key === 'associatedCompanyId' ||
        key === 'associatedcompanyid' ||
        key === 'associatedIDForCompany'
      ) {
        return acc
      }

      acc[key] = value
      return acc
    },
    {} as Record<string, string>
  )
}

const OVERLAP_DESCRIPTION_MAX_LENGTH = 255

const sanitizeOverlapFieldsForBackend = (fields: Record<string, any>[]) => {
  return fields.map((field) => {
    if (typeof field?.description !== 'string') return field

    const normalizedDescription = field.description.trim()
    if (normalizedDescription.length <= OVERLAP_DESCRIPTION_MAX_LENGTH) {
      return {
        ...field,
        description: normalizedDescription
      }
    }

    return {
      ...field,
      description: normalizedDescription.slice(
        0,
        OVERLAP_DESCRIPTION_MAX_LENGTH
      )
    }
  })
}

type Props = {}

export type DataSource =
  | 'CSV'
  | 'HUBSPOT'
  | 'GOOGLE_SHEET'
  | 'ZOHO'
  | 'PIPEDRIVE'
  | 'SALESFORCE'

export interface PersonaResponse {
  id?: number
  mode: string
  personaStatus: string
  creationTimestamp: string
  personaDetails: {
    content: Array<{
      id: number
      creationTimestamp: string
      lastUpdatedTimestamp: string
      companySector: string
      companySize: string
      isPartnershipProgram: string
      marketSegment: string
      organizationId: number
    }>
    // other pagination properties
    totalElements: number
  }
  category: {
    companySector: Array<{ key: string; percentage: number }>
    companySize: Array<{ key: string; percentage: number }>
    marketSegment: Array<{ key: string; percentage: number }>
    isPartnershipProgram: Array<{ key: string; percentage: number }>
  }
  topIndustry: string
  topIndustryPercentage: string
  topMarketSegment: string
  topMarketSegmentPercentage: string
}

const Badge: React.FC<{ value: string; color: string }> = ({
  value,
  color
}) => (
  <span
    className='rounded-full px-3 py-1 text-[0.75rem]'
    style={{ backgroundColor: color }}
  >
    {value}
  </span>
)

const Container: React.FC<{
  children: React.ReactElement
  className?: string
}> = ({ children, className }) => (
  <div className={cn('rounded-xl border border-[#E4E7EE] bg-white', className)}>
    {children}
  </div>
)

// Loading Skeleton Component
const CustomerInsightsSkeleton = () => {
  return (
    <div className='space-y-6'>
      {/* Summary Cards Skeleton */}
      <div className='grid grid-cols-3 gap-4'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='flex flex-col gap-2 rounded-xl border px-4 py-3'
          >
            <Skeleton className='h-4 w-24' />
            <div className='flex items-center gap-3'>
              <Skeleton className='h-8 w-16' />
              <Skeleton className='h-6 w-12 rounded-full' />
            </div>
          </div>
        ))}
      </div>

      {/* Data Matrix Skeleton */}
      <div className='rounded-xl border border-[#E4E7EE] bg-white p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <Skeleton className='mb-2 h-6 w-64' />
            <Skeleton className='h-4 w-80' />
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>

        <div className='grid grid-cols-3 gap-6'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='space-y-4'>
              <Skeleton className='h-5 w-24' />
              <div className='space-y-3'>
                {[1, 2, 3].map((j) => (
                  <div key={j} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <Skeleton className='h-4 w-16' />
                      <Skeleton className='h-4 w-12' />
                    </div>
                    <Skeleton className='h-2 w-full rounded-full' />
                    <Skeleton className='h-3 w-8' />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Match Score Skeleton */}
        <div className='mt-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <Skeleton className='mb-2 h-5 w-32' />
              <Skeleton className='h-4 w-64' />
            </div>
            <div className='text-right'>
              <Skeleton className='mb-1 h-8 w-16' />
              <Skeleton className='h-3 w-40' />
            </div>
          </div>
        </div>
      </div>

      {/* Industry Distribution Skeleton */}
      <div className='rounded-xl border border-[#E4E7EE] bg-white p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <Skeleton className='h-6 w-48' />
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>

        <div className='flex gap-8'>
          {/* Donut Chart Skeleton */}
          <div className='flex w-1/3 justify-center'>
            <Skeleton className='h-60 w-60 rounded-full' />
          </div>

          {/* Industry List Skeleton */}
          <div className='w-2/3'>
            <div className='space-y-3'>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
                >
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-8 w-8 rounded-lg' />
                    <div>
                      <Skeleton className='mb-1 h-4 w-20' />
                      <Skeleton className='h-3 w-24' />
                    </div>
                  </div>
                  <div className='text-right'>
                    <Skeleton className='mb-1 h-4 w-8' />
                    <Skeleton className='h-3 w-16' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section Skeleton */}
      <div className='rounded-xl border border-[#E4E7EE] bg-white p-6'>
        <Skeleton className='mb-4 h-5 w-48' />
        <Skeleton className='mb-4 h-4 w-64' />
        <div className='flex gap-3'>
          <Skeleton className='h-10 w-32 rounded-lg' />
          <Skeleton className='h-10 w-32 rounded-lg' />
        </div>
      </div>

      {/* Data Source Update Section Skeleton */}
      <div className='rounded-xl border border-[#E4E7EE] bg-white p-6'>
        <Skeleton className='mb-4 h-5 w-56' />
        <div className='flex gap-3'>
          <Skeleton className='h-10 w-40 rounded-lg' />
          <Skeleton className='h-10 w-32 rounded-lg' />
        </div>
      </div>
    </div>
  )
}

// Custom tooltip component for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className='rounded-lg border bg-white px-3 py-2 shadow-lg'>
        <p className='font-medium text-gray-900'>
          {`${data.name} ${Math.ceil(data.value)}%`}
        </p>
      </div>
    )
  }
  return null
}

// Industry configuration with icons, background colors, and chart colors
const INDUSTRY_CONFIG = {
  tech: {
    icon: Code,
    bgColor: '#6563A4'
  },
  technology: {
    icon: Code,
    bgColor: '#6563A4'
  },
  finance: {
    icon: Landmark,
    bgColor: '#DC2626'
  },
  healthcare: {
    icon: HeartPulse,
    bgColor: '#059669'
  },
  manufacturing: {
    icon: Factory,
    bgColor: '#D97706'
  },
  retail: {
    icon: ReceiptText,
    bgColor: '#9333EA'
  },
  education: {
    icon: BookOpen,
    bgColor: '#F1D199'
  },
  media: {
    icon: Newspaper,
    bgColor: '#DC8181'
  },
  software: {
    icon: Laptop,
    bgColor: '#82B68C'
  },
  others: {
    icon: Rows4,
    bgColor: '#838FA2'
  }
}

// Transform CSV data function from existing component
const transformCsvData = (
  csvData: Record<string, string>[] | null | undefined,
  selectedMapping: Record<string, string>
) => {
  // Handle case where csvData is null/undefined (like for HubSpot)
  if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
    // For HubSpot and other integrations without CSV data, create empty data structure
    return []
  }

  const headers = csvData[0] as any // first row is headers
  const dataRows = csvData.slice(1) // the rest are data rows

  // 1. Create a map of sharkdom properties to header index
  const columnIndices: Record<string, number> = {}

  Object.entries(selectedMapping).forEach(([sharkdomProperty, fileColumn]) => {
    if (fileColumn && fileColumn !== 'dont_import') {
      const index = headers.indexOf(fileColumn)
      if (index !== -1) {
        columnIndices[sharkdomProperty] = index
      }
    }
  })

  // 2. Generate the final array of objects using those indices
  const finalData = dataRows.map((row) => {
    const obj: Record<string, string> = {}

    Object.entries(columnIndices).forEach(([sharkdomProperty, index]) => {
      let value = row[index] ?? ''

      // Special handling for contactEmail field - extract just the email value
      if (
        sharkdomProperty === 'contactEmail' &&
        Array.isArray(value) &&
        value.length > 0
      ) {
        // Find the primary email or use the first one
        const primaryEmail =
          value.find((email: any) => email.primary) || value[0]
        value = primaryEmail?.value || ''
      }

      // Special handling for companyName field - extract name if it's an object
      if (
        sharkdomProperty === 'companyName' &&
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // Extract the 'name' property from the company object (e.g., from Pipedrive)
        value = (value as any).name || ''
      }

      obj[sharkdomProperty] = value
    })

    return obj
  })

  return finalData
}

const formSchema = z.object({
  name: z.string().min(1, 'Enter name for your import')
})

const VersionDropdownItem = ({
  v,
  isActive,
  onClick
}: {
  v: any
  isActive: boolean
  onClick: () => void
}) => {
  const { data: details } = usePersonaDetailsByVersion(v.versionId, true)
  const rawDate =
    v.creationTimestamp || v.creationDate || details?.creationTimestamp
  const formattedDate = rawDate
    ? format(new Date(rawDate), 'h:mm a, d MMM')
    : ''

  return (
    <DropdownMenuItem
      onClick={onClick}
      className='flex cursor-pointer flex-col items-start gap-0.5 rounded-lg px-2 py-2 hover:bg-gray-50 focus:bg-gray-50'
    >
      <div className='flex w-full items-center justify-between'>
        <span
          className={`text-[14px] font-medium ${isActive ? 'text-[#6863FB]' : 'text-[#4A5565]'}`}
        >
          Version {v.version}
        </span>
        {isActive && <Check className='h-4 w-4 text-[#6863FB]' />}
      </div>
      {formattedDate ? (
        <span className='text-[12px] text-[#6B7280]'>{formattedDate}</span>
      ) : (
        <Skeleton className='mt-1 h-3 w-24 bg-gray-200' />
      )}
    </DropdownMenuItem>
  )
}

const ZOHO_WEBHOOK_TEST_PAYLOAD = {
  account: {
    data: [
      {
        Account_Name: 'Sharkdom Test Account',
        Website: 'https://www.sharkdom.com/',
        Industry: 'Technology',
        Billing_Country: 'United States'
      }
    ]
  },
  deal: {
    data: [
      {
        Deal_Name: 'Sharkdom Test Deal',
        Stage: 'Qualification',
        Amount: 50000,
        Closing_Date: '2026-12-31'
      }
    ]
  },
  contacts: {
    data: [
      {
        First_Name: 'John',
        Last_Name: 'Doe',
        Email: 'john.doe@sharkdom.com',
        Title: 'Product Manager'
      }
    ]
  }
}

const CustomerInsights = (props: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [activeDataSource, setActiveDataSource] = useState<DataSource | null>(
    null
  )
  const [createButtonClicked, setCreateButtonClicked] = useState(false)
  const [showDataPreview, setShowDataPreview] = useState(false)
  const [fieldMappingData, setFieldMappingData] = useState<any>(null)
  const [frequency, setFrequency] = useState('1 Week')
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Prevent duplicate persona-creation requests if the submit handler fires twice.
  const isSubmittingRef = useRef(false)
  const [hubspotData, setHubspotData] = useState<any[]>([])
  const [isLoadingHubspotData, setIsLoadingHubspotData] = useState(false)
  // Salesforce — same role as hubspotData for preview counts + CUSTOMER submit (HubSpot parity).
  const [salesforceData, setSalesforceData] = useState<any[]>([])
  const [isLoadingSalesforceData, setIsLoadingSalesforceData] = useState(false)
  const [isLoadingZohoData, setIsLoadingZohoData] = useState(false)
  const [recordType, setRecordType] = useState<string | null>(null)
  const [hasCheckedPreviewHandoffState, setHasCheckedPreviewHandoffState] =
    useState(false)
  const [openPreview, setOpenPreview] = useState(false)
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  const [showOneTimeLoader, setShowOneTimeLoader] = useState(false)
  const [refreshFrequency, setRefreshFrequency] = useState('1 week')
  const [showCustomFrequencyModal, setShowCustomFrequencyModal] =
    useState(false)
  const [copied, setCopied] = useState(false)
  const [isTestingWebhook, setIsTestingWebhook] = useState(false)
  const [webhookRandomNumber, setWebhookRandomNumber] = useState<number>(() =>
    Math.floor(100000 + Math.random() * 900000)
  )
  const organizationData = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  useEffect(() => {
    if (showCustomFrequencyModal) {
      setWebhookRandomNumber(Math.floor(100000 + Math.random() * 900000))
    }
  }, [showCustomFrequencyModal])

  const handleCopyPayload = () => {
    const dynamicPayload = {
      ...ZOHO_WEBHOOK_TEST_PAYLOAD,
      account: {
        ...ZOHO_WEBHOOK_TEST_PAYLOAD.account,
        data: ZOHO_WEBHOOK_TEST_PAYLOAD.account.data.map((item) => ({
          ...item,
          Account_Name: `${item.Account_Name}_${webhookRandomNumber}`
        }))
      },
      deal: {
        ...ZOHO_WEBHOOK_TEST_PAYLOAD.deal,
        data: ZOHO_WEBHOOK_TEST_PAYLOAD.deal.data.map((item) => ({
          ...item,
          Deal_Name: `${item.Deal_Name}_${webhookRandomNumber}`
        }))
      },
      contacts: {
        ...ZOHO_WEBHOOK_TEST_PAYLOAD.contacts,
        data: ZOHO_WEBHOOK_TEST_PAYLOAD.contacts.data.map((item) => {
          const [localPart, domainPart] = item.Email.split('@')
          return {
            ...item,
            Last_Name: `${item.Last_Name}_${webhookRandomNumber}`,
            Email: `${localPart}_${webhookRandomNumber}@${domainPart}`
          }
        })
      }
    }
    navigator.clipboard.writeText(JSON.stringify(dynamicPayload, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true)
    try {
      const dynamicPayload = {
        ...ZOHO_WEBHOOK_TEST_PAYLOAD,
        account: {
          ...ZOHO_WEBHOOK_TEST_PAYLOAD.account,
          data: ZOHO_WEBHOOK_TEST_PAYLOAD.account.data.map((item) => ({
            ...item,
            Account_Name: `${item.Account_Name}_${webhookRandomNumber}`
          }))
        },
        deal: {
          ...ZOHO_WEBHOOK_TEST_PAYLOAD.deal,
          data: ZOHO_WEBHOOK_TEST_PAYLOAD.deal.data.map((item) => ({
            ...item,
            Deal_Name: `${item.Deal_Name}_${webhookRandomNumber}`
          }))
        },
        contacts: {
          ...ZOHO_WEBHOOK_TEST_PAYLOAD.contacts,
          data: ZOHO_WEBHOOK_TEST_PAYLOAD.contacts.data.map((item) => {
            const [localPart, domainPart] = item.Email.split('@')
            return {
              ...item,
              Last_Name: `${item.Last_Name}_${webhookRandomNumber}`,
              Email: `${localPart}_${webhookRandomNumber}@${domainPart}`
            }
          })
        }
      }

      const initiateResponse = await testZohoWebhook(dynamicPayload)

      if (!initiateResponse.ok) {
        showCustomToast('Error', 'Test initiation failed', 'error')
        setIsTestingWebhook(false)
        return
      }

      showCustomToast('Success', 'Test Initiated', 'success')

      // Start polling after 4 seconds for 5 times at max
      let pollCount = 0
      const maxPolls = 5

      const pollValidation = () => {
        setTimeout(async () => {
          try {
            const valResponse = await getZohoWebhookValidation(
              organizationData.id
            )
            pollCount++

            if (valResponse.ok && valResponse.data) {
              const data = valResponse.data
              if (data.complete) {
                const matchModuleFields = (
                  payloadData: any,
                  receivedFields: string[]
                ) => {
                  // ignore ids
                  const payloadKeys = Object.keys(payloadData).filter(
                    (k) =>
                      !k.toLowerCase().endsWith('id') &&
                      !k.toLowerCase().includes('id')
                  )

                  return payloadKeys.every((k) => {
                    const normalizedK = k.toLowerCase()
                    const aliases = [normalizedK]
                    if (normalizedK === 'billing_country') {
                      aliases.push('country_geography', 'country', 'geography')
                    }
                    if (normalizedK === 'title') {
                      aliases.push('job_title')
                    }
                    return receivedFields.some((rf) =>
                      aliases.includes(rf.toLowerCase())
                    )
                  })
                }

                const accountsMatch = matchModuleFields(
                  dynamicPayload.account.data[0],
                  data.modules?.accounts?.receivedFields || []
                )
                const dealsMatch = matchModuleFields(
                  dynamicPayload.deal.data[0],
                  data.modules?.deals?.receivedFields || []
                )
                const contactsMatch = matchModuleFields(
                  dynamicPayload.contacts.data[0],
                  data.modules?.contacts?.receivedFields || []
                )

                const payloadDetailsMatch =
                  accountsMatch && dealsMatch && contactsMatch

                if (data.valid && payloadDetailsMatch) {
                  showCustomToast('Success', 'Test successful', 'success')
                  setShowCustomFrequencyModal(false)
                  setIsTestingWebhook(false)
                  return
                } else {
                  showCustomToast(
                    'Error',
                    'Test Failed. Please check Workflows configuration',
                    'error'
                  )
                  setIsTestingWebhook(false)
                  return
                }
              }
            }

            if (pollCount < maxPolls) {
              pollValidation()
            } else {
              showCustomToast(
                'Error',
                'Test Failed. Please check Workflows configuration',
                'error'
              )
              setIsTestingWebhook(false)
            }
          } catch (pollError) {
            console.error('Error polling validation status:', pollError)
            pollCount++
            if (pollCount < maxPolls) {
              pollValidation()
            } else {
              showCustomToast(
                'Error',
                'Test Failed. Please check Workflows configuration',
                'error'
              )
              setIsTestingWebhook(false)
            }
          }
        }, 4000)
      }

      pollValidation()
    } catch (error: any) {
      showCustomToast('Error', 'Test initiation failed', 'error')
      setIsTestingWebhook(false)
    } finally {
      setWebhookRandomNumber(Math.floor(100000 + Math.random() * 900000))
    }
  }
  // Tracks whether we're waiting for a COMPLETED signal to show the success toast
  const [isWaitingForSync, setIsWaitingForSync] = useState(false)
  const hasFiredCompletedToastRef = useRef(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('show_insights_loader') === 'true') {
        setShowOneTimeLoader(true)
        sessionStorage.removeItem('show_insights_loader')

        const timer = setTimeout(() => {
          setShowOneTimeLoader(false)
        }, 8000)

        return () => clearTimeout(timer)
      }
    }
  }, [])

  const { data, isLoading, isFetching, refetch } = useGetPersona() as {
    data: PersonaResponse | null
    isLoading: boolean
    isFetching: boolean
    refetch: () => void
  }

  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const isHubSpot = data?.mode === 'HUBSPOT' || data?.mode === 'HubSpot'

  // Derived from the recordType state — used for both versions and preview-table hooks.
  const activeRecordType =
    (recordType as 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY') ?? 'CUSTOMER'

  // Fetch versions for active record type only to avoid multi-api bottlenecks
  const {
    data: versionsRes,
    isLoading: isLoadingOverlapVersions,
    refetch: refetchVersions
  } = useOverlapRecordVersions(
    organization?.id,
    !!organization?.id,
    activeRecordType
  )

  const overlapVersionsData = useMemo(() => {
    const list = versionsRes?.data || []
    const merged = sortOverlapVersionsNewestFirst(list)
    return { success: true, data: merged }
  }, [versionsRes])

  const resolvedVersionId = selectedVersion ?? data?.id

  // Selected version's persona details (pie chart + summary cards on the main page)
  // When syncing, poll every 15s to check if personaStatus has changed to COMPLETED.
  const {
    data: versionedPersonaDetails,
    isLoading: isLoadingVersionedDetails,
    refetch: refetchVersionedDetails
  } = usePersonaDetailsByVersion(resolvedVersionId, resolvedVersionId != null)

  // Version-specific preview-table records (for the Preview Data modal)
  const { data: versionedPreviewData, isLoading: isLoadingVersionedPreview } =
    useVersionedOverlapRecords(
      activeRecordType,
      resolvedVersionId,
      resolvedVersionId != null && openPreview
    )

  // Legacy HubSpot-specific version hooks (keep for backward compat)
  const { data: versionsData, isLoading: isLoadingVersions } =
    usePersonaVersions('HUBSPOT', isHubSpot && openPreview)
  const { data: versionData, isLoading: isLoadingVersionData } =
    usePersonaVersionData(
      organization?.id,
      'HUBSPOT',
      selectedVersion,
      isHubSpot && openPreview && selectedVersion != null && selectedVersion > 0
    )

  // Auto-select the newest version from the global merged list as soon as versions arrive
  useEffect(() => {
    const allVersions = overlapVersionsData?.data || []
    if (!allVersions.length || selectedVersion != null) return
    const latestId = getLatestOverlapVersionId(allVersions)
    if (latestId != null) setSelectedVersion(latestId)
  }, [overlapVersionsData, selectedVersion])

  // Step 4: Poll the persona details API every 10s while syncing.
  useEffect(() => {
    const status = versionedPersonaDetails?.personaStatus
    if (
      resolvedVersionId == null ||
      (status !== 'INITIATED' && status !== 'PENDING')
    )
      return

    const interval = setInterval(() => {
      refetchVersionedDetails()
    }, 10000)

    return () => clearInterval(interval)
  }, [
    versionedPersonaDetails?.personaStatus,
    resolvedVersionId,
    refetchVersionedDetails
  ])

  // Step 5: Fire the success toast only once, after sync is COMPLETED
  useEffect(() => {
    const status = versionedPersonaDetails?.personaStatus
    if (
      isWaitingForSync &&
      status === 'COMPLETED' &&
      !hasFiredCompletedToastRef.current
    ) {
      hasFiredCompletedToastRef.current = true
      setIsWaitingForSync(false)
      showCustomToast(
        'Success',
        'Data imported and processed successfully',
        'success',
        4000
      )
    }
    // Reset the ref if we start a new import cycle
    if (!isWaitingForSync) {
      hasFiredCompletedToastRef.current = false
    }
  }, [versionedPersonaDetails?.personaStatus, isWaitingForSync])

  const addOverlapColumn = useAddOverlapColumn()
  const renameOverlapColumn = useRenameOverlapColumn()
  const updateOverlapColumnOrder = useUpdateOverlapColumnOrder()
  const removeOverlapColumn = useRemoveOverlapColumn()
  const updateOverlapRowValues = useUpdateOverlapRowValues()

  const mutate = useDisconnectPersonaCrm()

  const handleDeletePersona = () => {
    console.log('deleting...')

    const resolvedRecordType = (
      recordType === 'CUSTOMER' ||
      recordType === 'PROSPECT' ||
      recordType === 'OPPORTUNITY'
        ? recordType
        : 'CUSTOMER'
    ) as 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'

    // For v2 imports, data.mode may be null — fall back to 'NONE' so the API still fires
    const integrationType = disconnectIntegrationType ?? 'NONE'

    mutate.mutate(
      {
        integrationType,
        recordType: resolvedRecordType
      },
      {
        onSuccess: () => {
          // Single, explicit toast for user-initiated disconnect only
          showCustomToast(
            'Success',
            'CRM disconnected successfully',
            'success',
            4000
          )
          // Signal to ConnectYourCRM / OtherWaysToConnect that the user explicitly
          // disconnected. Even if old versions still exist in the DB, the user
          // should see "Connect CRM" again until they complete a fresh import.
          localStorage.setItem('crm_force_reconnect', 'true')
          clearPersonaFrontendState()
          router.push('/my-data')
        },
        onError: (err) => {
          console.error('Failed to delete persona on backend:', err)
          clearPersonaFrontendState()
          router.push('/my-data')
        }
      }
    )
  }

  const { integrations, error: fetchError } = useIntegrationApps()
  const createPersona = useCreatePersonaOverlap()
  const createPersonaOverlapCustomer = useCreatePersonaOverlapCustomer()
  const createPersonaOverlapRecord = useCreatePersonaOverlapRecord()

  // Prefer the legacy persona mode field; if that's missing (v2 imports don't set it),
  // fall back to whichever integration is currently CONNECTED in the integrations list.
  const disconnectIntegrationType = useMemo(() => {
    if (data?.mode && data.mode !== 'CSV') {
      return String(data.mode).trim().toUpperCase().replace(/\s+/g, '_')
    }
    const connected = integrations?.find(
      (app: any) => app.status === INTEGRATION_STATUS.CONNECTED
    )
    return connected?.id
      ? String(connected.id).trim().toUpperCase().replace(/\s+/g, '_')
      : null
  }, [data?.mode, integrations])

  // Strict check: if the user loads customer-insights but their CRM refresh token has been deleted
  useEffect(() => {
    const hasRoutePreview = Boolean(searchParams.get('previewData'))
    const hasSessionPreview =
      typeof window !== 'undefined' &&
      Boolean(
        sessionStorage.getItem('fieldMappingData') ||
          (window as any).__sharkdom_fieldMappingData
      )

    // Never auto-disconnect while user is in the import/preview handoff flow.
    if (
      hasRoutePreview ||
      hasSessionPreview ||
      showDataPreview ||
      fieldMappingData
    )
      return

    if (!data?.mode || data.mode === 'CSV' || !integrations.length) return

    const activeIntegration = integrations.find(
      (app: any) => app.id === data.mode
    )

    if (
      activeIntegration &&
      activeIntegration.status !== INTEGRATION_STATUS.CONNECTED
    ) {
      if (!sessionStorage.getItem('crm_cleanup_triggered')) {
        sessionStorage.setItem('crm_cleanup_triggered', 'true')

        const backendIntegrationType = String(data.mode)
          .trim()
          .toUpperCase()
          .replace(/\s+/g, '_')

        // Use the raw service promise to avoid the noisy 'CRM disconnected' toast from the hook
        const silentRecordType = (
          recordType === 'CUSTOMER' ||
          recordType === 'PROSPECT' ||
          recordType === 'OPPORTUNITY'
            ? recordType
            : 'CUSTOMER'
        ) as 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'

        import('@/services/partner-match').then(({ disconnectPersonaCrm }) => {
          disconnectPersonaCrm(backendIntegrationType, silentRecordType)
            .then(() => {
              clearPersonaFrontendState()
              router.push('/my-data')
            })
            .catch((err) => {
              console.error('Silent cleanup failed', err)
              clearPersonaFrontendState()
              router.push('/my-data')
            })
        })
      }
    }
  }, [
    data?.mode,
    integrations,
    router,
    searchParams,
    showDataPreview,
    fieldMappingData,
    recordType
  ])

  // Prevent users from sitting on an "empty" page if they have no active persona AND no active upload mapping session
  useEffect(() => {
    if (!hasCheckedPreviewHandoffState) return

    // Still waiting on either the legacy persona or the v2 versions — do not redirect yet.
    if (isLoading || isLoadingOverlapVersions) return

    // If v2 versions exist for CUSTOMER, the user has data — let them stay.
    if (overlapVersionsData?.data && overlapVersionsData.data.length > 0) return

    if (!data?.personaStatus || data.personaStatus === 'NONE') {
      const fieldData = sessionStorage.getItem('fieldMappingData')
      const inMemoryFieldData =
        typeof window !== 'undefined'
          ? (window as any).__sharkdom_fieldMappingData
          : null
      const routePreview = searchParams.get('previewData')

      if (!fieldData && !inMemoryFieldData && !routePreview) {
        // User has absolutely no reason to be on this page right now.
        const connectedCrm = integrations.find(
          (app: any) =>
            app.status === INTEGRATION_STATUS.CONNECTED &&
            [
              INTEGRATIONS.HUBSPOT_OUTREACH,
              INTEGRATIONS.ZOHO_CRM,
              INTEGRATIONS.SALESFORCE_CRM,
              INTEGRATIONS.PIPEDRIVE,
              INTEGRATIONS.CLOSE_CRM
            ].includes(app.id)
        )
        if (connectedCrm) {
          const slug =
            connectedCrm.id === INTEGRATIONS.HUBSPOT_OUTREACH
              ? 'hubspot'
              : connectedCrm.id === INTEGRATIONS.SALESFORCE_CRM
                ? 'salesforce'
                : connectedCrm.id === INTEGRATIONS.ZOHO_CRM
                  ? 'zoho'
                  : connectedCrm.id === INTEGRATIONS.PIPEDRIVE
                    ? 'pipedrive'
                    : connectedCrm.id.toLowerCase()
          router.push(`/my-data/connect-service/${slug}?recordType=CUSTOMER`)
        } else {
          router.push('/my-data')
        }
      }
    }
  }, [
    isLoading,
    isLoadingOverlapVersions,
    overlapVersionsData,
    data?.personaStatus,
    router,
    searchParams,
    hasCheckedPreviewHandoffState,
    integrations
  ])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'CustomersList-converted'
    }
  })

  const getLogoForMode = (mode?: string) => {
    if (!mode) return '/icons/sharkdom-meet-rounded-logo.svg'

    const m = String(mode).toLowerCase()

    if (m.includes('hubspot')) return '/icons/hubspot-rounded-logo.svg'
    if (m.includes('zoho')) return '/icons/zoho-rounded-logo.svg'
    if (m.includes('salesforce')) return '/icons/salesforce.svg'
    if (m.includes('mailchimp')) return '/icons/mailchimp-rounded-logo.svg'
    if (m.includes('slack')) return '/icons/slack.svg'
    if (m.includes('zoom')) return '/icons/sharkdom-meet-rounded-logo.svg'
    if (m.includes('pipedrive')) return '/icons/pipedrive-rounded-logo.svg'
    return '/icons/sharkdom-meet-rounded-logo.svg'
  }

  // Check for field mapping data in sessionStorage on component mount
  useEffect(() => {
    const storedData = sessionStorage.getItem('fieldMappingData')
    const inMemoryFieldMappingData =
      typeof window !== 'undefined'
        ? (window as any).__sharkdom_fieldMappingData
        : null
    const previewDataFromRoute = searchParams.get('previewData')
    // URL param takes priority (e.g. ?recordType=CUSTOMER from "View data source").
    // Falls back to sessionStorage from the import pipeline.
    const recordTypeFromUrl = searchParams.get('recordType') as
      | 'CUSTOMER'
      | 'PROSPECT'
      | 'OPPORTUNITY'
      | null
    const recordType = recordTypeFromUrl || sessionStorage.getItem('recordType')
    setRecordType(recordType)

    const applyFieldMappingData = (parsedData: any) => {
      const resolvedRecordType =
        parsedData?.recordType || sessionStorage.getItem('recordType')
      const normalizedRecordType = (
        resolvedRecordType === 'PROSPECT' ||
        resolvedRecordType === 'OPPORTUNITY' ||
        resolvedRecordType === 'CUSTOMER'
          ? resolvedRecordType
          : 'CUSTOMER'
      ) as 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'

      if (
        (!parsedData.csvData || parsedData.csvData.length === 0) &&
        typeof window !== 'undefined' &&
        (window as any).__sharkdom_temp_csvData
      ) {
        parsedData.csvData = (window as any).__sharkdom_temp_csvData
      }

      parsedData.selectedMapping = sanitizePreviewSelectedMapping(
        parsedData.selectedMapping || {},
        normalizedRecordType
      )

      setRecordType(normalizedRecordType)
      setFieldMappingData(parsedData)
      setShowDataPreview(true)
      form.setValue(
        'name',
        `${parsedData.dataSource}-${new Date().toISOString().split('T')[0]}`
      )
    }

    const decodeRoutePreviewData = (encodedData: string) => {
      if (typeof window === 'undefined') return null

      try {
        const decoded = decodeURIComponent(
          Array.from(window.atob(encodedData))
            .map(
              (char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`
            )
            .join('')
        )
        return JSON.parse(decoded)
      } catch (error) {
        console.error('Failed to decode route preview data:', error)
        return null
      }
    }

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        applyFieldMappingData(parsedData)
      } catch (error) {
        console.error('Error parsing field mapping data:', error)
        sessionStorage.removeItem('fieldMappingData') // Clean up corrupted data
      }
    } else if (inMemoryFieldMappingData) {
      applyFieldMappingData(inMemoryFieldMappingData)
    } else if (previewDataFromRoute) {
      const parsedRouteData = decodeRoutePreviewData(previewDataFromRoute)
      if (parsedRouteData) {
        applyFieldMappingData(parsedRouteData)
      } else {
        console.log('No usable field mapping data found in route preview data')
      }
    } else {
      console.log('No field mapping data found in sessionStorage')
    }

    setHasCheckedPreviewHandoffState(true)
  }, [form, searchParams])

  // Legacy auto-refresh removed — syncing is now handled by the v2 version-based
  // polling logic above (Steps 3 & 4).

  // Fetch HubSpot data for marketing data preview
  useEffect(() => {
    const fetchHubspotData = async () => {
      const previewRecordType =
        fieldMappingData?.recordType || recordType || 'CUSTOMER'

      if (
        showDataPreview &&
        fieldMappingData?.dataSource === 'HUBSPOT' &&
        organization?.id
      ) {
        setIsLoadingHubspotData(true)
        try {
          // Get the mapped columns from selectedMapping (filter out empty and 'dont_import' values)
          let mappedColumns = Object.values(
            sanitizePreviewSelectedMapping(
              fieldMappingData.selectedMapping || {},
              previewRecordType as 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'
            )
          ).filter(
            (value) => value && value !== '' && value !== 'dont_import'
          ) as string[]

          if (previewRecordType === 'PROSPECT') {
            if (!mappedColumns.includes('firstname')) {
              mappedColumns = [...mappedColumns, 'firstname']
            }
            if (!mappedColumns.includes('lastname')) {
              mappedColumns = [...mappedColumns, 'lastname']
            }
            if (!mappedColumns.includes('hs_object_id')) {
              mappedColumns = [...mappedColumns, 'hs_object_id']
            }
          }

          if (mappedColumns.length === 0) {
            console.log('No mapped columns found for HubSpot data')
            setHubspotData([])
            return
          }

          const response = await fetch(
            `/api/hubspot-data?organizationId=${organization.id}&recordType=${previewRecordType}&fields=${mappedColumns.join(',')}`
          )
          const data = await response.json()

          if (data.success && data.data) {
            setHubspotData(data.data)
          } else {
            console.error('Failed to fetch HubSpot data:', data)
            setHubspotData([])
          }
        } catch (error) {
          console.error('Error fetching HubSpot data:', error)
          setHubspotData([])
        } finally {
          setIsLoadingHubspotData(false)
        }
      } else {
        console.log('Conditions not met for fetching HubSpot data')
      }
    }

    fetchHubspotData()
  }, [showDataPreview, fieldMappingData, organization?.id, recordType])

  // Fetch Salesforce data for marketing data preview (mirrors `/api/hubspot-data` flow).
  useEffect(() => {
    const fetchSalesforceData = async () => {
      const previewRecordType =
        fieldMappingData?.recordType || recordType || 'CUSTOMER'

      if (
        showDataPreview &&
        fieldMappingData?.dataSource === 'SALESFORCE' &&
        organization?.id
      ) {
        setIsLoadingSalesforceData(true)
        try {
          const mappedColumns = Object.values(
            fieldMappingData.selectedMapping
          ).filter(
            (value) => value && value !== '' && value !== 'dont_import'
          ) as string[]

          if (mappedColumns.length === 0) {
            setSalesforceData([])
            return
          }

          const sfMap = (fieldMappingData.salesforceFieldMapping ??
            {}) as Record<string, string>
          const apiFields = mappedColumns.map((col) => sfMap[col] || col)

          const response = await fetch(
            `/api/salesforce-data?organizationId=${organization.id}&recordType=${previewRecordType}&fields=${apiFields.join(',')}`
          )
          const data = await response.json()

          if (data.success && Array.isArray(data.data)) {
            setSalesforceData(data.data)
          } else {
            console.error('Failed to fetch Salesforce data:', data)
            setSalesforceData([])
          }
        } catch (error) {
          console.error('Error fetching Salesforce data:', error)
          setSalesforceData([])
        } finally {
          setIsLoadingSalesforceData(false)
        }
      } else {
        setSalesforceData([])
      }
    }

    fetchSalesforceData()
  }, [showDataPreview, fieldMappingData, organization?.id, recordType])

  // Fetch Zoho data on reload if csvData is empty
  useEffect(() => {
    const fetchZohoDataOnReload = async () => {
      const previewRecordType =
        fieldMappingData?.recordType || recordType || 'CUSTOMER'

      if (
        showDataPreview &&
        fieldMappingData?.dataSource === 'ZOHO' &&
        (!fieldMappingData?.csvData || fieldMappingData.csvData.length === 0)
      ) {
        setIsLoadingZohoData(true)
        try {
          const response = await fetch(
            `/api/zoho-data?recordType=${previewRecordType}`
          )
          const resJson = await response.json()

          if (resJson.success && Array.isArray(resJson.data)) {
            const uniqueColumns = Object.values(
              fieldMappingData.selectedMapping || {}
            ).filter(
              (value) => value && value !== '' && value !== 'dont_import'
            ) as string[]

            const dataRows = resJson.data.map((record: any) =>
              uniqueColumns.map((k) => record?.[k] ?? '')
            )
            const reconstructedCsvData = [uniqueColumns, ...dataRows]

            setFieldMappingData((prev: any) =>
              prev ? { ...prev, csvData: reconstructedCsvData } : prev
            )
            if (typeof window !== 'undefined') {
              ;(window as any).__sharkdom_temp_csvData = reconstructedCsvData
            }
          } else {
            console.error('Failed to fetch Zoho reload data:', resJson)
          }
        } catch (error) {
          console.error('Error fetching Zoho reload data:', error)
        } finally {
          setIsLoadingZohoData(false)
        }
      }
    }

    fetchZohoDataOnReload()
  }, [showDataPreview, fieldMappingData, recordType])

  // Map UI frequency options to API frequency options
  const frequencyMapping: Record<
    string,
    'WEEKLY' | 'FIFTEEN_DAYS' | 'THIRTY_DAYS' | 'NINETY_DAYS'
  > = {
    '1 Week': 'WEEKLY',
    '15 days': 'FIFTEEN_DAYS',
    '30 days': 'THIRTY_DAYS',
    '90 days': 'NINETY_DAYS'
  }

  const frequencies = ['1 Week', '15 days', '30 days', '90 days']

  // Function to open modal with specific data source
  // const openModalWithSource = (source: DataSource) => {
  //   setActiveDataSource(source)
  //   setIsOpen(true)
  // }

  // const handleCreateButtonClicked = () => {
  //   setCreateButtonClicked(true)
  // }

  const handleBackToHome = () => {
    // Clear sessionStorage data
    sessionStorage.removeItem('fieldMappingData')
    sessionStorage.removeItem('csvData')
    sessionStorage.removeItem('csvFileName')
    setShowDataPreview(false)
    setFieldMappingData(null)
    router.push('/my-data')
  }

  const handleCreatePersona = async (data: z.infer<typeof formSchema>) => {
    if (!fieldMappingData) {
      console.error(
        '[handleCreatePersona] No field mapping data found in state'
      )
      showCustomToast(
        'Error',
        'Something went wrong. Please try again.',
        'error',
        5000
      )
      return
    }
    if (isSubmittingRef.current || isSubmitting || createPersona.isPending)
      return
    isSubmittingRef.current = true
    setIsSubmitting(true)

    try {
      const { selectedMapping, csvHeaders, dataSource, csvData } =
        fieldMappingData

      // Filter out empty, undefined, or removed mappings from fieldToColumnMapping
      const resolvedRecordType = (recordType || 'CUSTOMER') as
        | 'CUSTOMER'
        | 'PROSPECT'
        | 'OPPORTUNITY'

      const sanitizedSelectedMapping = sanitizePreviewSelectedMapping(
        selectedMapping || {},
        resolvedRecordType
      )

      const filteredFieldToColumnMapping = Object.entries(
        sanitizedSelectedMapping
      ).reduce(
        (acc, [key, value]) => {
          // Only include mappings that have valid string values (not empty string, not undefined, not 'dont_import')
          if (
            typeof value === 'string' &&
            value !== '' &&
            value !== undefined &&
            value !== 'dont_import'
          ) {
            acc[key] = value
          }
          return acc
        },
        {} as Record<string, string>
      )

      // Transform CSV data using the filtered mapping to ensure removed fields are excluded
      const fields = transformCsvData(csvData, filteredFieldToColumnMapping)
      const stringifiedFields = JSON.stringify(fields)

      // Get the mapped frequency with a type-safe fallback
      const value = data.name
      const mappedFrequency = frequencyMapping[frequency] || ('WEEKLY' as const)

      if (!(value && value.trim())) {
        showCustomToast(
          'Error',
          'Please enter a valid name for your import',
          'error',
          5000
        )
        return
      }

      const parsedFields = JSON.parse(stringifiedFields)

      // Filter out unwanted fields (creationDate and subscribed) and ensure only mapped fields are included
      const filteredFields = parsedFields.map((item: any) => {
        const filteredItem: Record<string, any> = {}
        // Only include fields that are in the filtered mapping
        Object.keys(filteredFieldToColumnMapping).forEach((key) => {
          if (item[key] !== undefined) {
            filteredItem[key] = item[key]
          }
        })
        // Remove creationDate and subscribed if they exist
        const { creationDate, subscribed, ...finalItem } = filteredItem
        // For CUSTOMER: company name ('name' field) should also populate 'companyName'
        if (finalItem.name && !finalItem.companyName) {
          finalItem.companyName = finalItem.name
        }
        return finalItem
      })

      // Create payload
      const payload = {
        organizationId: organization?.id || 0,
        recordType: recordType
          ? (recordType as recordType)
          : ('CUSTOMER' as recordType),
        googleSheetLink:
          dataSource === 'GOOGLE_SHEET' ? fieldMappingData.sheetUrl || '' : '',
        frequency: mappedFrequency,
        personaName: value || 'Marketing Data Import',
        source: dataSource,
        fields: dataSource === 'ZOHO' ? filteredFields : parsedFields,
        fieldToColumnMapping: filteredFieldToColumnMapping
      }

      // Persist the raw CRM records to the versioned overlap store for all record types.
      // All 3 backend endpoints share the same flat field schema, so one mapper handles all.
      // selectedMapping = { sharkdomKey: hubspotColumnName }
      // hubspotData items = { hubspotColumnName: value }
      // We translate sharkdomKey → backend field name using the rename table below.
      if (resolvedRecordType !== 'CUSTOMER') {
        const sharkdomKeyToBackendFieldPO: Record<string, string> = {
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

        const mapSparseRecord = (record: any) => {
          const flat: Record<string, string> = {}
          const src: Record<string, any> =
            record?.properties && typeof record.properties === 'object'
              ? record.properties
              : record

          for (const [sharkdomKey, hubspotColumn] of Object.entries(
            sanitizedSelectedMapping
          )) {
            if (!hubspotColumn || hubspotColumn === 'dont_import') continue

            if (sharkdomKey === 'fullName') {
              const first = String(src.firstname ?? src.firstName ?? '').trim()
              const last = String(src.lastname ?? src.lastName ?? '').trim()
              const explicitFullName = String(
                record?.[sharkdomKey] ?? src?.[sharkdomKey] ?? ''
              ).trim()
              const fullName =
                [first, last].filter(Boolean).join(' ') || explicitFullName
              if (fullName) flat.name = fullName
              continue
            }

            const rawValue =
              src[hubspotColumn] ??
              record?.[hubspotColumn] ??
              record?.fields?.[hubspotColumn] ??
              record?.[sharkdomKey]

            if (rawValue === null || rawValue === undefined) continue

            const value = String(rawValue).trim()
            if (!value) continue

            const backendField =
              sharkdomKeyToBackendFieldPO[sharkdomKey] ?? sharkdomKey
            flat[backendField] = value
          }

          return flat
        }

        const sfMapForSparse = (fieldMappingData.salesforceFieldMapping ??
          {}) as Record<string, string>

        const mapSalesforceSparseRecord = (record: any) => {
          const flat: Record<string, string> = {}
          const src: Record<string, any> =
            record?.properties && typeof record.properties === 'object'
              ? record.properties
              : record

          for (const [sharkdomKey, sfLabel] of Object.entries(
            sanitizedSelectedMapping
          )) {
            if (!sfLabel || sfLabel === 'dont_import') continue

            if (sharkdomKey === 'fullName') {
              const first = String(
                src.FirstName ?? src.firstname ?? src.firstName ?? ''
              ).trim()
              const last = String(
                src.LastName ?? src.lastname ?? src.lastName ?? ''
              ).trim()
              const apiName = sfMapForSparse[sfLabel] ?? sfLabel
              const explicitFullName = String(
                record?.[apiName] ?? src?.[apiName] ?? ''
              ).trim()
              const fullName =
                [first, last].filter(Boolean).join(' ') || explicitFullName
              if (fullName) flat.name = fullName
              continue
            }

            const apiName = sfMapForSparse[sfLabel] ?? sfLabel
            const rawValue =
              src[apiName] ??
              record?.[apiName] ??
              record?.fields?.[apiName] ??
              record?.[sharkdomKey]

            if (rawValue === null || rawValue === undefined) continue

            const value = String(rawValue).trim()
            if (!value) continue

            const backendField =
              sharkdomKeyToBackendFieldPO[sharkdomKey] ?? sharkdomKey
            flat[backendField] = value
          }

          return flat
        }

        let directFields =
          dataSource === 'HUBSPOT' && hubspotData.length > 0
            ? hubspotData.map((record: any) => mapSparseRecord(record))
            : dataSource === 'SALESFORCE' && salesforceData.length > 0
              ? salesforceData.map((record: any) =>
                  mapSalesforceSparseRecord(record)
                )
              : filteredFields.map((record: any) => mapSparseRecord(record))

        if (resolvedRecordType === 'PROSPECT' && hubspotData.length > 0) {
          const contactIds = hubspotData
            .map((record: any) =>
              String(
                record?._contactId ??
                  record?.id ??
                  record?.properties?.hs_object_id ??
                  record?.hs_object_id ??
                  ''
              )
            )
            .filter(Boolean)

          const associatedCompanyIdsByContactId =
            await getHubspotContactCompaniesBatch(
              organization?.id || 0,
              contactIds
            )

          directFields = directFields.map((field: any, idx: number) => {
            const sourceRecord = hubspotData[idx]
            const contactId = String(
              sourceRecord?._contactId ??
                sourceRecord?.id ??
                sourceRecord?.properties?.hs_object_id ??
                sourceRecord?.hs_object_id ??
                ''
            )

            return {
              ...field,
              associatedCompanyId: contactId
                ? (associatedCompanyIdsByContactId[contactId] ?? '')
                : ''
            }
          })
        }

        if (resolvedRecordType === 'OPPORTUNITY' && hubspotData.length > 0) {
          const dealIds = hubspotData
            .map((record: any) =>
              String(
                record?.id ??
                  record?.properties?.hs_object_id ??
                  record?.hs_object_id ??
                  record?.dealId ??
                  ''
              )
            )
            .filter(Boolean)

          const associatedContactIdsByDealId =
            await getHubspotDealCompaniesBatch(organization?.id || 0, dealIds)

          directFields = directFields.map((field: any, idx: number) => {
            const sourceRecord = hubspotData[idx]
            const dealId = String(
              sourceRecord?.id ??
                sourceRecord?.properties?.hs_object_id ??
                sourceRecord?.hs_object_id ??
                sourceRecord?.dealId ??
                ''
            )

            return {
              ...field,
              dealId,
              associatedContactId: dealId
                ? (associatedContactIdsByDealId[dealId] ?? '')
                : ''
            }
          })
        }

        const directPayload = {
          organizationId: organization?.id || 0,
          recordType: resolvedRecordType,
          fileName: value || `${resolvedRecordType.toLowerCase()}-import`,
          source: dataSource,
          frequency: mappedFrequency,
          googleSheetLink:
            dataSource === 'GOOGLE_SHEET'
              ? fieldMappingData.sheetUrl || ''
              : '',
          fields: sanitizeOverlapFieldsForBackend(directFields),
          fieldToColumnMapping: filteredFieldToColumnMapping
        }
        await createPersonaOverlapRecord.mutateAsync(directPayload)
        // New import completed — clear the force-reconnect flag
        localStorage.removeItem('crm_force_reconnect')
        clearPersonaFrontendState()
        // Eagerly refetch (not just invalidate) so my-data renders with fresh Pending Actions immediately.
        // `type: 'all'` is required — without it, React Query skips queries that are inactive
        // (i.e. not mounted on the current page), so the my-data queries would be ignored.
        await queryClient.refetchQueries({
          queryKey: ['get-persona-preview'],
          type: 'all'
        })
        await queryClient.refetchQueries({
          queryKey: ['overlap-record-versions'],
          type: 'all'
        })
        showCustomToast(
          'Success',
          `${resolvedRecordType === 'PROSPECT' ? 'Prospects' : 'Opportunities'} imported successfully`,
          'success',
          3000
        )
        router.push('/my-data')
        return
      }
      // ── END shortcut ─────────────────────────────────────────────────────────

      if (dataSource === 'HUBSPOT' && hubspotData.length > 0) {
        // Full null template matching every backend schema field.
        // The backend only writes recognised field keys — unknown keys are silently dropped.
        // Starting with this template guarantees every DB column receives an explicit value.
        const emptyField: Record<string, string | null> = {
          name: null,
          companyName: null,
          contactEmail: null,
          domain: null,
          dealStage: null,
          creationDate: null,
          closeDate: null,
          subscribed: null,
          ticketSize: null,
          dealName: null,
          dealOwner: null,
          amountAcv: null,
          dealId: null,
          pipeline: null,
          dealType: null,
          associatedContactId: null,
          website: null,
          industry: null,
          companySize: null,
          country: null,
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
          associatedCompanyId: null
        }

        // Sharkdom UI key → exact backend schema field name.
        // Keys must exactly match the Java entity @JsonProperty names or the DB write is silently ignored.
        const sharkdomKeyToBackendField: Record<string, string> = {
          fullName: 'name', // PROSPECT full name → name
          name: 'name', // CUSTOMER company name → name (+ companyName via dual-write below)
          linkedInUrl: 'linkedinUrl', // CUSTOMER: company LinkedIn → linkedinUrl (lowercase 'i')
          phone: 'companyPhone', // CUSTOMER: company phone → companyPhone (NOT contactPhone)
          domain: 'website', // company domain/website URL → website
          countryGeography: 'country', // sharkdom 'countryGeography' → backend 'country'
          annualRevenue: 'annualRevenue',
          companySize: 'companySize',
          city: 'city',
          industry: 'industry',
          description: 'description'
        }

        const mappedFields = hubspotData.map((record: any) => {
          // Start with the full null template so every DB column has an explicit value
          const flat: Record<string, string | null> = { ...emptyField }

          for (const [sharkdomKey, hubspotColumn] of Object.entries(
            selectedMapping as Record<string, string>
          )) {
            if (!hubspotColumn || hubspotColumn === 'dont_import') continue

            // Read value from HubSpot record (.properties is where company fields live)
            const rawValue =
              record.properties?.[hubspotColumn] ??
              record[hubspotColumn] ??
              record[sharkdomKey] ??
              null

            const value =
              rawValue !== null && rawValue !== undefined
                ? String(rawValue)
                : null

            // Map to the exact backend field name
            const backendField =
              sharkdomKeyToBackendField[sharkdomKey] ?? sharkdomKey

            // Only write if this key is in our template (i.e. the backend recognises it)
            if (backendField in flat) {
              flat[backendField] = value
            }

            // CUSTOMER: company name must populate BOTH 'name' and 'companyName'
            if (
              backendField === 'name' &&
              resolvedRecordType === 'CUSTOMER' &&
              value
            ) {
              flat['companyName'] = value
            }
          }

          return flat
        })

        if (mappedFields.length > 0) {
          const recordPayload = {
            organizationId: organization?.id || 0,
            recordType: resolvedRecordType,
            fileName: value || `${resolvedRecordType.toLowerCase()}-import`,
            source: dataSource,
            frequency: mappedFrequency,
            googleSheetLink:
              dataSource === 'GOOGLE_SHEET'
                ? fieldMappingData.sheetUrl || ''
                : '',
            fields: sanitizeOverlapFieldsForBackend(mappedFields),
            fieldToColumnMapping: filteredFieldToColumnMapping
          }

          await createPersonaOverlapRecord.mutateAsync(recordPayload)

          // New import completed — clear the force-reconnect flag
          localStorage.removeItem('crm_force_reconnect')
          clearPersonaFrontendState()
          setShowDataPreview(false)
          setFieldMappingData(null)
          // Toast deferred — fires only after personaStatus === 'COMPLETED'
          setIsWaitingForSync(true)
          // Refetch versions so the newest version is picked up and auto-selected
          setIsSyncingPersona(true)
          setSelectedVersion(null)
          await refetchVersions()
          router.replace('/my-data/customer-insights')
          return
        }
      }

      // Salesforce CUSTOMER — same template + mapping contract as HubSpot block above (flat CRM rows).
      if (dataSource === 'SALESFORCE' && salesforceData.length > 0) {
        const emptyField: Record<string, string | null> = {
          name: null,
          companyName: null,
          contactEmail: null,
          domain: null,
          dealStage: null,
          creationDate: null,
          closeDate: null,
          subscribed: null,
          ticketSize: null,
          dealName: null,
          dealOwner: null,
          amountAcv: null,
          dealId: null,
          pipeline: null,
          dealType: null,
          associatedContactId: null,
          website: null,
          industry: null,
          companySize: null,
          country: null,
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
          associatedCompanyId: null
        }

        const sharkdomKeyToBackendField: Record<string, string> = {
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
          description: 'description'
        }

        const sfMap = (fieldMappingData.salesforceFieldMapping ?? {}) as Record<
          string,
          string
        >

        const mappedFields = salesforceData.map((record: any) => {
          const flat: Record<string, string | null> = { ...emptyField }

          for (const [sharkdomKey, sfLabel] of Object.entries(
            selectedMapping as Record<string, string>
          )) {
            if (!sfLabel || sfLabel === 'dont_import') continue

            const apiName = sfMap[sfLabel] ?? sfLabel
            const rawValue = record[apiName] ?? null

            const value =
              rawValue !== null && rawValue !== undefined
                ? String(rawValue)
                : null

            const backendField =
              sharkdomKeyToBackendField[sharkdomKey] ?? sharkdomKey

            if (backendField in flat) {
              flat[backendField] = value
            }

            if (
              backendField === 'name' &&
              resolvedRecordType === 'CUSTOMER' &&
              value
            ) {
              flat['companyName'] = value
            }
          }

          return flat
        })

        if (mappedFields.length > 0) {
          const recordPayload = {
            organizationId: organization?.id || 0,
            recordType: resolvedRecordType,
            fileName: value || `${resolvedRecordType.toLowerCase()}-import`,
            source: dataSource,
            frequency: mappedFrequency,
            googleSheetLink:
              dataSource === 'GOOGLE_SHEET'
                ? fieldMappingData.sheetUrl || ''
                : '',
            fields: mappedFields,
            fieldToColumnMapping: filteredFieldToColumnMapping
          }

          await createPersonaOverlapRecord.mutateAsync(recordPayload)

          localStorage.removeItem('crm_force_reconnect')
          clearPersonaFrontendState()
          setShowDataPreview(false)
          setFieldMappingData(null)
          // Toast deferred — fires only after personaStatus === 'COMPLETED'
          setIsWaitingForSync(true)
          setIsSyncingPersona(true)
          setSelectedVersion(null)
          await refetchVersions()
          sessionStorage.setItem('show_insights_loader', 'true')
          router.replace('/my-data/customer-insights')
          return
        }
      }

      // Call the versioned overlap record endpoint for CUSTOMER (CSV / Google Sheet / other sources).
      // This uses the same payload contract as the HubSpot path above.
      const customerRecordPayload = {
        organizationId: organization?.id || 0,
        recordType: 'CUSTOMER' as const,
        fileName: value || 'customer-import',
        source: dataSource,
        frequency: mappedFrequency,
        googleSheetLink:
          dataSource === 'GOOGLE_SHEET' ? fieldMappingData.sheetUrl || '' : '',
        // Use filteredFields (only mapped keys, no nulls) for CSV/Sheet sources
        fields: filteredFields,
        fieldToColumnMapping: filteredFieldToColumnMapping
      }
      await createPersonaOverlapRecord.mutateAsync(customerRecordPayload)

      // New CUSTOMER import completed (CSV/Sheet) — clear the force-reconnect flag
      localStorage.removeItem('crm_force_reconnect')

      // Clear preview/import handoff state on success so the page returns
      // to the persisted customer-insights view instead of the import UI.
      clearPersonaFrontendState()

      setShowDataPreview(false)
      setFieldMappingData(null)

      // Toast deferred — fires only after personaStatus === 'COMPLETED'
      setIsWaitingForSync(true)

      // Trigger the v2 syncing flow: refetch versions, auto-select newest, poll for COMPLETED
      setIsSyncingPersona(true)
      setSelectedVersion(null)
      await refetchVersions()
      sessionStorage.setItem('show_insights_loader', 'true')
      router.replace('/my-data/customer-insights')
    } catch (error) {
      console.error('[handleCreatePersona] Error creating persona:', error)
      showCustomToast(
        'Error',
        'Something went wrong. Please try again.',
        'error',
        5000
      )
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  // If showing data preview, render the marketing data preview screen
  if (showDataPreview && fieldMappingData) {
    const { selectedMapping, csvHeaders, dataSource, csvData } =
      fieldMappingData

    // Sharkdom properties mapping for display labels
    const sharkdomPropertyLabels = {
      domain: 'Website',
      name: 'Name',
      companyName: 'Company Name',
      contactEmail: 'Email Address',
      dealStage: 'Deal Stage',
      creationDate: 'Creation Date',
      closeDate: 'Close Date',
      subscribed: 'Subscribed',
      ticketSize: 'Ticket Size',
      city: 'City',
      countryGeography: 'Country',
      annualRevenue: 'Annual Revenue',
      industry: 'Industry',
      companySize: 'Company Size',
      linkedInUrl: 'LinkedIn URL',
      phone: 'Phone',
      description: 'Description',
      state: 'State',
      website: 'Website'
    }

    return (
      <div className='flex h-[calc(100vh-50px)] flex-col'>
        {/* Main Content */}
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-9/12 max-w-4xl'>
            {/* Back Button */}
            <Button
              variant='ghost'
              onClick={handleBackToHome}
              className='mb-6 flex items-center gap-2 px-0 text-sm font-semibold text-brandPrimary'
            >
              <ArrowLeft size={16} />
              Back to Home
            </Button>

            {/* Title and Description */}
            <div className='mb-6'>
              <h1 className='text-xl font-semibold text-gray-700'>
                Marketing Data preview
              </h1>
              <p className='text-sm text-gray-500'>
                Details from the connected sourcee
              </p>
            </div>

            <hr className='mb-6 border-gray-200' />

            {/* Data Overview Grid */}
            <div className='mb-6 grid grid-cols-3 gap-0 rounded-lg border border-gray-200 bg-gray-50'>
              {Object.entries(selectedMapping).map(
                ([sharkdomProperty, fileColumn], index) => (
                  <div
                    key={sharkdomProperty}
                    className={`flex flex-col gap-1 p-4 ${
                      index % 3 !== 2 ? 'border-r' : ''
                    } ${index < 3 ? 'border-b' : ''} border-gray-200`}
                  >
                    <span className='text-xl font-bold leading-6 text-gray-900'>
                      {(() => {
                        if (!fileColumn || fileColumn === 'dont_import') {
                          return '0'
                        }

                        // console.log(
                        //   'Counting HubSpot data for property:',
                        //   sharkdomProperty,
                        //   'Column:',
                        //   fileColumn,
                        //   'Data:',
                        //   hubspotData
                        // )

                        if (dataSource === 'HUBSPOT') {
                          // For HubSpot, count from the fetched data
                          if (isLoadingHubspotData) {
                            return '...'
                          }

                          // If no data fetched, show a fallback count
                          if (!hubspotData || hubspotData.length === 0) {
                            console.log(
                              'No HubSpot data available, showing fallback'
                            )
                            return 'N/A'
                          }

                          const count = hubspotData.filter((contact: any) => {
                            // Check if the contact has the mapped property
                            // HubSpot data structure: contact.properties[fieldName]
                            const fieldName = String(fileColumn)
                            const propertyValue =
                              contact?.properties?.[fieldName] ||
                              contact?.[fieldName]
                            return (
                              propertyValue &&
                              String(propertyValue).trim() !== ''
                            )
                          }).length
                          // console.log('Count for', sharkdomProperty, ':', count)
                          return count
                        } else if (dataSource === 'SALESFORCE') {
                          if (isLoadingSalesforceData) {
                            return '...'
                          }
                          if (!salesforceData || salesforceData.length === 0) {
                            return 'N/A'
                          }
                          const sfMap =
                            (fieldMappingData?.salesforceFieldMapping ??
                              {}) as Record<string, string>
                          const apiName =
                            sfMap[String(fileColumn)] ?? String(fileColumn)
                          const count = salesforceData.filter((row: any) => {
                            const v = row?.[apiName]
                            return (
                              v !== null &&
                              v !== undefined &&
                              String(v).trim() !== ''
                            )
                          }).length
                          return count
                        } else if (dataSource === 'PIPEDRIVE') {
                          // For Pipedrive, count from the transformed data
                          if (
                            !csvData ||
                            !Array.isArray(csvData) ||
                            csvData.length === 0
                          ) {
                            return 0
                          }

                          // Get the headers (first row) and find the column index
                          const headers = csvData[0]
                          const columnIndex = headers.indexOf(fileColumn)
                          if (columnIndex === -1) return 0

                          // Count data rows (skip header row)
                          const dataRows = csvData.slice(1)
                          const values = dataRows
                            .map((data: any) => data[columnIndex])
                            .filter((value) => {
                              // Handle both string and object values
                              if (value === null || value === undefined)
                                return false
                              if (typeof value === 'object') {
                                // For object values like contactEmail arrays, check if it has meaningful data
                                if (Array.isArray(value) && value.length > 0) {
                                  // For contactEmail arrays, check if any email has a value
                                  return value.some(
                                    (email: any) =>
                                      email?.value &&
                                      String(email.value).trim() !== ''
                                  )
                                }
                                return Object.keys(value).length > 0
                              }
                              return String(value).trim() !== ''
                            })
                          return values.length
                        } else {
                          // For CSV/Google Sheets/ZOHO, use the existing logic
                          if (dataSource === 'ZOHO') {
                            if (isLoadingZohoData) {
                              return '...'
                            }
                            // For ZOHO, the csvData structure is [headers, ...dataRows]
                            // where headers are the mapped columns only
                            if (
                              !csvData ||
                              !Array.isArray(csvData) ||
                              csvData.length === 0
                            ) {
                              return 0
                            }

                            // Get the headers (first row) and find the column index
                            const headers = csvData[0]
                            const columnIndex = headers.indexOf(fileColumn)
                            if (columnIndex === -1) return 0

                            // Count data rows (skip header row)
                            const dataRows = csvData.slice(1)
                            const values = dataRows
                              .map((data: any) => data[columnIndex])
                              .filter((value) => {
                                // Handle both string and object values
                                if (value === null || value === undefined)
                                  return false
                                if (typeof value === 'object') {
                                  // For object values like Created_By, check if it has meaningful data
                                  return Object.keys(value).length > 0
                                }
                                return String(value).trim() !== ''
                              })
                            return values.length
                          } else {
                            // For CSV/Google Sheets, use the existing logic
                            const columnIndex = csvHeaders.indexOf(fileColumn)
                            if (columnIndex === -1) return 0

                            // Exclude header row (first row) when counting data
                            const dataRows =
                              csvData && Array.isArray(csvData)
                                ? csvData.slice(1)
                                : []
                            const values = dataRows
                              .map((data: any) => data[columnIndex])
                              .filter(Boolean)
                            return values.length
                          }
                        }
                      })()}
                    </span>
                    <span className='text-sm leading-4 text-gray-600'>
                      {sharkdomPropertyLabels[
                        sharkdomProperty as keyof typeof sharkdomPropertyLabels
                      ] || sharkdomProperty}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreatePersona)}
                className='space-y-6'
              >
                {/* Name Your Import */}
                <div>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <label className='mb-2 block text-sm font-medium text-gray-700'>
                          Name your Import
                        </label>
                        <FormControl>
                          <Input
                            placeholder='Marketing Data - Aug 20XX'
                            className='h-12 w-full'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-xs' />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Data Refresh Frequency - Only show for non-CSV sources */}
                {dataSource !== 'CSV' && (
                  <div className='rounded-lg bg-gray-100 p-4'>
                    <div className='space-y-4'>
                      <h3 className='text-sm font-medium text-gray-900'>
                        How frequently do you want your data to be refreshed?
                      </h3>
                      <ToggleGroup
                        type='single'
                        value={frequency}
                        onValueChange={(value) => {
                          if (value) setFrequency(value)
                        }}
                        className='grid grid-cols-4 gap-2 bg-white'
                      >
                        {frequencies.map((option) => (
                          <ToggleGroupItem
                            key={option}
                            value={option}
                            className='h-10 rounded-md data-[state=on]:border data-[state=on]:border-gray-300 data-[state=on]:bg-white data-[state=on]:shadow-sm'
                          >
                            {option}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type='submit'
                  disabled={isSubmitting || createPersona.isPending}
                  className='w-[218px] rounded-md bg-brandPrimary py-2 text-base font-bold text-white transition-colors hover:bg-brandPrimary-hover disabled:opacity-50'
                >
                  {isSubmitting || createPersona.isPending
                    ? 'Creating...'
                    : 'Confirm & Import'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    )
  }

  // Default customer insights page

  const isProcessingData =
    isLoadingVersionedDetails ||
    versionedPersonaDetails?.personaStatus === 'INITIATED' ||
    versionedPersonaDetails?.personaStatus === 'PENDING'

  return (
    <GradientPageBackground className='flex min-h-screen flex-col'>
      {(showOneTimeLoader || isProcessingData) &&
        !showDataPreview &&
        !fieldMappingData && (
          <div className='absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md transition-all duration-300'>
            <div className='flex flex-col items-center gap-6 rounded-2xl border border-[rgba(33,35,44,0.08)] bg-white p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)]'>
              <div className='relative flex h-16 w-16 items-center justify-center'>
                <div className='absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-75'></div>
                <div className='absolute inset-0 rounded-full border-4 border-blue-100'></div>
                <div className='absolute inset-0 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent'></div>
                <Loader2 className='h-6 w-6 animate-pulse text-[#2563EB]' />
              </div>
              <div className='flex flex-col items-center gap-2 text-center'>
                <h3 className='text-lg font-bold text-[#21232C]'>
                  Preparing your import
                </h3>
                <p className='max-w-[260px] text-xs font-semibold leading-relaxed text-[#65686F]'>
                  Fetching records and resolving relationships. This might take
                  a few seconds...
                </p>
              </div>
            </div>
          </div>
        )}
      {/* Page header */}
      <div className='flex w-full items-start justify-between px-8 pt-7'>
        <div className='flex flex-col items-start justify-start gap-2'>
          <h1 className='text-[24px] font-bold leading-normal text-[#101828]'>
            Customer Insights
          </h1>
          <p className='text-[16px] font-normal leading-[12.8px] text-[#6A7282]'>
            Generated based on your customer data
          </p>
        </div>

        <div className='flex items-center justify-start gap-3'>
          {/* Data Refresh Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='flex h-[40px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-[#F3F4F6] bg-white transition-colors hover:bg-gray-50'>
                <div className='flex items-center justify-start gap-2 px-3 py-2'>
                  <div className='relative flex h-4 w-4 items-center justify-center text-[#637381]'>
                    <RefreshCcw className='h-4 w-4' />
                  </div>
                  <span className='text-[14px] font-medium leading-[20px] text-[#4A5565]'>
                    Data refresh
                  </span>
                </div>
                <div className='h-[40px] w-[1px] bg-[#F3F4F6]'></div>
                <div className='flex items-center justify-start gap-2 px-3 py-2'>
                  <span className='text-[14px] font-medium leading-[20px] text-[#4A5565]'>
                    {refreshFrequency === 'Custom'
                      ? 'Custom'
                      : refreshFrequency}
                  </span>
                  <div className='relative flex h-3 w-3 items-center justify-center text-[#637381]'>
                    <ChevronDown className='h-3 w-3' />
                  </div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='flex w-[180px] flex-col gap-1 rounded-xl border border-gray-100 bg-white p-1 shadow-lg'
              align='end'
            >
              {['1 week', '15 days', '30 days', '90 days'].map((freq) => (
                <DropdownMenuItem
                  key={freq}
                  onClick={() => setRefreshFrequency(freq)}
                  className='flex cursor-pointer items-center justify-between rounded-lg px-2 py-3 hover:bg-gray-50 focus:bg-gray-50'
                >
                  <span
                    className={
                      refreshFrequency === freq
                        ? 'text-[14px] font-medium text-[#6863FB]'
                        : 'text-[14px] font-medium text-[#4A5565]'
                    }
                  >
                    {freq}
                  </span>
                  {refreshFrequency === freq && (
                    <Check className='h-4 w-4 text-[#6863FB]' />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => setRefreshFrequency('Custom')}
                className='mt-1 flex cursor-pointer items-center justify-between rounded-lg bg-[#F3F4F6] px-2 py-3 hover:bg-gray-200 focus:bg-gray-200'
              >
                <span className='text-[14px] font-medium text-[#4A5565]'>
                  Custom
                </span>
                {refreshFrequency === 'Custom' ? (
                  <Check className='h-4 w-4 text-[#6863FB]' />
                ) : (
                  <SlidersHorizontal className='h-4 w-4 text-[#4A5565]' />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Connected Data Source Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='flex cursor-pointer items-center justify-between rounded-xl border border-[#F3F4F6] bg-white p-1 transition-colors hover:bg-gray-50'>
                <div className='flex items-center justify-start gap-2 px-3'>
                  <div className='h-2 w-2 rounded-full bg-[#05C168]'></div>
                  <span className='text-[15px] font-medium leading-[20px] text-[#05C168]'>
                    Connected
                  </span>
                </div>
                <div className='flex items-center justify-start gap-2 rounded-lg bg-[#F3F4F6] px-3 py-1.5'>
                  <LinkIcon className='h-4 w-4 text-[#185DDC]' />
                  <span className='text-[15px] font-medium text-[#4A5565]'>
                    {data?.mode ?? 'Data Source'}
                  </span>
                  <ChevronDown className='h-4 w-4 text-[#637381]' />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='flex w-[260px] flex-col gap-1 rounded-xl border border-gray-100 bg-white p-1 shadow-lg'
              align='end'
            >
              <div className='px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#10B981]'>
                • Connected Data Source
              </div>
              <DropdownMenuItem className='flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 hover:bg-gray-50 focus:bg-gray-50'>
                <LinkIcon className='h-4 w-4 text-[#4A5565]' />
                <span className='text-[14px] font-medium text-[#4A5565]'>
                  {data?.mode ?? 'Data Source'}
                </span>
              </DropdownMenuItem>
              {data?.mode?.toUpperCase() === 'ZOHO' && (
                <DropdownMenuItem
                  onClick={() => {
                    setRefreshFrequency('Custom')
                    setShowCustomFrequencyModal(true)
                  }}
                  className='flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 hover:bg-gray-50 focus:bg-gray-50'
                >
                  <Webhook className='h-4 w-4 text-[#4A5565]' />
                  <span className='text-[14px] font-medium text-[#4A5565]'>
                    Webhook
                  </span>
                </DropdownMenuItem>
              )}

              <div className='my-1 h-[1px] bg-gray-100'></div>

              <div className='px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]'>
                Version history
              </div>
              {sortOverlapVersionsNewestFirst(overlapVersionsData?.data)
                .slice(0, 3)
                .map((v: any) => (
                  <VersionDropdownItem
                    key={v.versionId}
                    v={v}
                    isActive={resolvedVersionId === v.versionId}
                    onClick={() =>
                      router.push(
                        `/data-pipeline/insights/version-history?tab=CUSTOMER&version=${v.version}`
                      )
                    }
                  />
                ))}

              <div className='my-1 h-[1px] bg-gray-100'></div>

              <DropdownMenuItem
                onClick={() => setShowConfirmDisconnect(true)}
                className='flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-red-600 hover:bg-red-50 focus:bg-red-50'
              >
                <Unplug className='h-4 w-4 text-red-600' />
                <span className='text-[14px] font-medium text-red-600'>
                  Disconnect
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='mx-8 my-5 h-px bg-[#E4E7EE]'></div>

      <Dialog
        open={showConfirmDisconnect}
        onOpenChange={setShowConfirmDisconnect}
      >
        <DialogContent className='max-w-md'>
          <div className='p-4'>
            <DialogTitle className='text-lg font-semibold'>
              Confirm disconnect
            </DialogTitle>
            <DialogDescription asChild>
              <p className='mt-2 text-sm text-gray-600'>
                Are you sure you want to disconnect this customer data? This
                action cannot be undone.
              </p>
            </DialogDescription>
            <div className='mt-4 flex justify-end gap-2'>
              <Button
                variant='ghost'
                onClick={() => setShowConfirmDisconnect(false)}
              >
                Cancel
              </Button>
              <Button
                variant='destructiveSolid'
                onClick={() => {
                  handleDeletePersona()
                  setShowConfirmDisconnect(false)
                }}
                disabled={mutate.isPending}
              >
                {mutate.isPending ? 'Disconnecting...' : 'Disconnect'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Frequency Modal */}
      <Dialog
        open={showCustomFrequencyModal}
        onOpenChange={setShowCustomFrequencyModal}
      >
        <DialogContent className='flex max-h-[90vh] max-w-[550px] flex-col gap-0 overflow-hidden rounded-2xl border-none bg-white p-0 shadow-2xl'>
          <div className='flex flex-col gap-6 overflow-y-auto p-6'>
            <div className='flex items-start justify-between'>
              <div className='flex flex-col gap-1.5'>
                <DialogTitle className='text-[20px] font-bold leading-7 tracking-tight text-[#101828]'>
                  Test Webhook Connection
                </DialogTitle>
                <DialogDescription className='text-[14px] leading-relaxed text-[#4A5565]'>
                  This sample payload will be sent to your CRM to test the
                  webhook connection.
                </DialogDescription>
              </div>
            </div>

            <div className='relative overflow-hidden rounded-xl border border-[#E9EAEB] shadow-sm'>
              <button
                onClick={handleCopyPayload}
                className='absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-[#E9EAEB] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#3B82F6] shadow-sm transition-all duration-200 hover:bg-blue-50 active:bg-blue-100'
                title='Copy to clipboard'
              >
                {copied ? (
                  <>
                    <Check className='h-4 w-4 text-emerald-500 duration-200 animate-in fade-in zoom-in-75' />
                    <span className='font-medium text-emerald-500'>
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className='h-4 w-4 text-[#3B82F6] transition-transform duration-200 hover:scale-110' />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <div className='relative max-h-[320px] select-all overflow-x-auto rounded-xl bg-[#F8FAFC] p-4 pr-24 font-mono text-[13px] leading-relaxed text-[#334155] shadow-inner'>
                <pre className='whitespace-pre-wrap break-all text-left text-[#334155]'>
                  <code className='block text-left text-[#334155]'>
                    {`{`}
                    <br />
                    {`  `}
                    <span className='font-semibold text-[#4F46E5]'>
                      "account"
                    </span>
                    : {`{`}
                    <br />
                    {`    `}
                    <span className='font-semibold text-[#4F46E5]'>"data"</span>
                    : [
                    <br />
                    {`      {`}
                    <br />
                    {`        `}
                    <span className='text-[#0D9488]'>"Account_Name"</span>:{' '}
                    <span className='text-[#EA580C]'>{`"Sharkdom Test Account_${webhookRandomNumber}"`}</span>
                    ,
                    <br />
                    {`        `}
                    <span className='text-[#0D9488]'>"Website"</span>:{' '}
                    <span className='text-[#EA580C]'>
                      "https://www.sharkdom.com/"
                    </span>
                    ,
                    <br />
                    {`        `}
                    <span className='text-[#0D9488]'>"Industry"</span>:{' '}
                    <span className='text-[#EA580C]'>"Technology"</span>,
                    <br />
                    {`        `}
                    <span className='text-[#0D9488]'>
                      "Billing_Country"
                    </span>:{' '}
                    <span className='text-[#EA580C]'>"United States"</span>
                    <br />
                    {`      }`}
                    <br />
                    {`    ]`}
                    <br />
                    {`  },`}
                    <br />
                    {`  `}
                    <span className='font-semibold text-[#4F46E5]'>"deal"</span>
                    : {`{`}
                    <br />
                    {`    `}
                    <span className='font-semibold text-[#4F46E5]'>"data"</span>
                    : [
                    <br />
                    {`      {`}
                    <br />
                    {`        `}
                    <span className='text-[#0D9488]'>"Deal_Name"</span>:{' '}
                    <span className='text-[#EA580C]'>{`"Sharkdom Test Deal_${webhookRandomNumber}"`}</span>
                    ,
                    <br />
                    {`        `}
                    <span className='text-[#0D9488]'>"Stage"</span>:{' '}
                    <span className='text-[#EA580C]'>"Qualification"</span>,
                    <br />
                    {`        `}
                    <span className='text-[#0D9488]'>"Amount"</span>:{' '}
                    <span className='text-[#C026D3]'>50000</span>,
                    <br />
                    {`        `}
                    <span className='text-[#0D9488]'>"Closing_Date"</span>:{' '}
                    <span className='text-[#EA580C]'>"2026-12-31"</span>
                    <br />
                    {`      }`}
                    <br />
                    {`    ]`}
                    <br />
                    {`  },`}
                    <br />
                    {`  `}
                    <span className='font-semibold text-[#4F46E5]'>
                      "contacts"
                    </span>
                    : {`{`}
                    <br />
                    {`    `}
                    <span className='font-semibold text-[#4F46E5]'>"data"</span>
                    : [
                    <br />
                    {`      {`}
                    <br />
                    {`        `}
                    <span className='text-[#0D9488]'>"First_Name"</span>:{' '}
                    <span className='text-[#EA580C]'>"John"</span>,
                    <br />
                    {`        `}
                    <span className='text-[#0D9488]'>"Last_Name"</span>:{' '}
                    <span className='text-[#EA580C]'>{`"Doe_${webhookRandomNumber}"`}</span>
                    ,
                    <br />
                    {`        `}
                    <span className='text-[#0D9488]'>"Email"</span>:{' '}
                    <span className='text-[#EA580C]'>{`"john.doe_${webhookRandomNumber}@sharkdom.com"`}</span>
                    ,
                    <br />
                    {`        `}
                    <span className='text-[#0D9488]'>"Title"</span>:{' '}
                    <span className='text-[#EA580C]'>"Product Manager"</span>
                    <br />
                    {`      }`}
                    <br />
                    {`    ]`}
                    <br />
                    {`  }`}
                    <br />
                    {`}`}
                  </code>
                </pre>
              </div>
            </div>

            <div className='flex items-center justify-between border-t border-[#F3F4F6] pt-2'>
              <button
                onClick={() => setShowCustomFrequencyModal(false)}
                disabled={isTestingWebhook}
                className='rounded-lg border border-[#CCCCCC] bg-white px-4 py-2 text-[14px] font-semibold text-[#1A1A1A] shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                onClick={handleTestWebhook}
                disabled={isTestingWebhook}
                className='flex items-center justify-center rounded-lg border border-[#6863FB] bg-[#6863FB] px-6 py-2 text-[14px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50'
              >
                {isTestingWebhook ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Testing...
                  </>
                ) : (
                  'Test Webhook'
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className='mx-8 py-4'>
        {/* EXCLUSIVE rendering — exactly one block renders at a time */}

        {/* 1. Loading: fetching versions */}
        {isLoadingOverlapVersions ? (
          <CustomerInsightsSkeleton />
        ) : resolvedVersionId != null ? (
          /* 3. Completed: show real data */
          (() => {
            const displayData = versionedPersonaDetails
            if (!displayData) return null

            return (
              <div className='my-6'>
                <div className='flex flex-col gap-[22px] py-4'>
                  {/* Top stats row */}
                  <div className='flex w-full'>
                    <SummaryWidget
                      totalRecords={(
                        displayData?.personaDetails?.totalElements ?? 0
                      ).toLocaleString()}
                      topIndustry={
                        !displayData?.topIndustry ||
                        displayData.topIndustry.toLowerCase() === 'unknown' ||
                        displayData.topIndustry.trim() === ''
                          ? 'Other'
                          : displayData.topIndustry.charAt(0).toUpperCase() +
                            displayData.topIndustry.slice(1).toLowerCase()
                      }
                      topIndustryPercentage={Math.ceil(
                        Number(displayData?.topIndustryPercentage ?? 50)
                      )}
                      topSegment={displayData?.topMarketSegment ?? 'B2B'}
                      topSegmentPercentage={Math.ceil(
                        Number(displayData?.topMarketSegmentPercentage ?? 20)
                      )}
                    />
                  </div>

                  {/* Data matrix card */}
                  <PartnershipMatrix
                    data={displayData?.category}
                    totalRecords={
                      displayData?.personaDetails?.totalElements ?? 0
                    }
                  />

                  {/* Industry distribution card */}
                  <IndustryDistribution
                    data={displayData?.category?.companySector}
                    totalRecords={
                      displayData?.personaDetails?.totalElements ?? 0
                    }
                  />
                </div>
              </div>
            )
          })()
        ) : null}
      </div>

      {/* {activeDataSource && (
        <PartnerMatchProcessModal
          recordType='CUSTOMER'
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          dataSource={activeDataSource}
        />
      )} */}
    </GradientPageBackground>
  )
}

export default CustomerInsights
