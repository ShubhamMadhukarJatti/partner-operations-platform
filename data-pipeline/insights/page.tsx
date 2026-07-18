'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useDisconnectPersonaCrm,
  useGetPersona
} from '@/http-hooks/partner-match'
import {
  sortOverlapVersionsNewestFirst,
  useOverlapRecordVersions,
  usePersonaDetailsByVersion,
  usePersonaVersions
} from '@/http-hooks/persona-versions'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { format } from 'date-fns'
import {
  AlertCircle,
  ArrowLeftRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  History,
  Link as LinkIcon,
  Loader2,
  Play,
  RefreshCcw,
  SlidersHorizontal,
  Unplug,
  Webhook
} from 'lucide-react'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import {
  Dialog,
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
import { Skeleton } from '@/components/ui/skeleton'
import { showCustomToast } from '@/components/custom-toast'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import IndustryDistribution from '../_components/IndustryDistribution'
import PartnershipMatrix from '../_components/PartnershipMatrix'
import SummaryWidget from '../_components/SummaryWidget'
import UnderReview from '../../my-data/customer-insights/_components/under-review'
import {
  getZohoWebhookValidation,
  testZohoWebhook
} from '../../partner-mapping/api.server'

// Helper: Get latest versionId
function getLatestOverlapVersionId(versions: any[] | undefined) {
  if (!versions || versions.length === 0) return null
  const sorted = [...versions].sort((a, b) => {
    const vA = parseFloat(a.version) || 0
    const vB = parseFloat(b.version) || 0
    if (vB !== vA) return vB - vA
    return b.versionId - a.versionId
  })
  return sorted[0].versionId
}

// Local Loading Skeleton
const CustomerInsightsSkeleton = () => {
  return (
    <div className='space-y-6 px-8 py-6'>
      <div className='grid grid-cols-3 gap-4'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='flex flex-col gap-2 rounded-xl border bg-white p-4 shadow-[0px_1px_2px_rgba(10,13,18,0.05)] outline outline-1 outline-[#E9EAEB]'
          >
            <Skeleton className='h-4 w-24' />
            <div className='flex items-end gap-3'>
              <Skeleton className='h-9 w-16' />
              <Skeleton className='h-6 w-12 rounded-full' />
            </div>
          </div>
        ))}
      </div>
      <div className='rounded-xl border border-[#E4E7EE] bg-white p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-10 w-10 rounded-lg' />
            <div className='space-y-2'>
              <Skeleton className='h-5 w-48' />
              <Skeleton className='h-4 w-96' />
            </div>
          </div>
        </div>
        <div className='grid grid-cols-3 gap-6'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-48 w-full rounded-lg' />
          ))}
        </div>
      </div>
    </div>
  )
}

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

export default function CustomerInsightsPage() {
  const router = useRouter()
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  const [showOneTimeLoader, setShowOneTimeLoader] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [syncStep, setSyncStep] = useState(0)
  const syncTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
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
                    'Test Failed. Confirm Workflows configuration',
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
                'Test Failed. Confirm Workflows configuration',
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
                'Test Failed. Confirm Workflows configuration',
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

  const saved = useSelector((state: RootState) => state.currentOrg)
  const organization = saved?.organization

  const { data: personaData, isLoading: isLoadingPersona } =
    useGetPersona() as {
      data: any
      isLoading: boolean
    }

  // Fetch overlap record versions (CUSTOMER)
  const {
    data: overlapVersionsData,
    isLoading: isLoadingOverlapVersions,
    refetch: refetchVersions
  } = useOverlapRecordVersions(organization?.id, !!organization?.id, 'CUSTOMER')

  // Auto-select latest version
  useEffect(() => {
    const versions = overlapVersionsData?.data
    if (!versions?.length || selectedVersion != null) return
    const latestId = getLatestOverlapVersionId(versions)
    if (latestId != null) setSelectedVersion(latestId)
  }, [overlapVersionsData, selectedVersion])

  const resolvedVersionId = selectedVersion ?? personaData?.id

  const activeVersionInfo = overlapVersionsData?.data?.find(
    (v: any) => v.versionId === resolvedVersionId
  )

  // Fetch versioned persona details
  const {
    data: versionedDetails,
    isLoading: isLoadingVersionedDetails,
    refetch: refetchVersionedDetails
  } = usePersonaDetailsByVersion(resolvedVersionId, resolvedVersionId != null)

  // Poll details API while syncing
  useEffect(() => {
    const status = versionedDetails?.personaStatus
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
    versionedDetails?.personaStatus,
    resolvedVersionId,
    refetchVersionedDetails
  ])

  // Disconnect handler
  const disconnectMutation = useDisconnectPersonaCrm()

  const disconnectIntegrationType = useMemo(() => {
    if (personaData?.mode && personaData.mode !== 'CSV') {
      return String(personaData.mode).trim().toUpperCase().replace(/\s+/g, '_')
    }
    return 'NONE'
  }, [personaData?.mode])

  const handleDeletePersona = () => {
    disconnectMutation.mutate(
      {
        integrationType: disconnectIntegrationType,
        recordType: 'CUSTOMER'
      },
      {
        onSuccess: () => {
          showCustomToast(
            'Success',
            'CRM disconnected successfully',
            'success',
            4000
          )
          router.push('/my-data')
        }
      }
    )
  }

  // Navigation handlers
  const handleRedirectToConnect = () => {
    router.push('/my-data')
  }

  const isPageLoading =
    isLoadingPersona ||
    isLoadingOverlapVersions ||
    (resolvedVersionId != null && isLoadingVersionedDetails)

  const isProcessingData =
    isLoadingVersionedDetails ||
    versionedDetails?.personaStatus === 'INITIATED' ||
    versionedDetails?.personaStatus === 'PENDING'
  // Animate the syncing-style overlay progress — only for the one-time post-sync loader
  useEffect(() => {
    if (!showOneTimeLoader) {
      // Reset for next time
      setSyncProgress(0)
      setSyncStep(0)
      syncTimersRef.current.forEach(clearTimeout)
      syncTimersRef.current = []
      return
    }

    // Clear any existing timers
    syncTimersRef.current.forEach(clearTimeout)
    syncTimersRef.current = []

    setSyncProgress(10)
    setSyncStep(0)

    const t1 = setTimeout(() => {
      setSyncProgress(45)
      setSyncStep(1)
    }, 1200)
    const t2 = setTimeout(() => {
      setSyncProgress(85)
      setSyncStep(2)
    }, 3500)
    const t3 = setTimeout(() => {
      setSyncProgress(100)
      setSyncStep(3)
    }, 6500)

    syncTimersRef.current = [t1, t2, t3]
    return () => syncTimersRef.current.forEach(clearTimeout)
  }, [showOneTimeLoader])
  return (
    <GradientPageBackground className='flex min-h-screen flex-col'>
      {showOneTimeLoader &&
        (() => {
          const syncSteps = [
            { label: 'Connecting', done: syncStep > 0 },
            { label: 'Syncing Data', done: syncStep > 1 },
            { label: 'Verifying', done: syncStep > 2 },
            { label: 'Completed', done: syncStep > 3 }
          ]
          const statusText =
            syncStep === 0
              ? 'Connecting to source...'
              : syncStep === 1
                ? 'Syncing Data (45%… 2 mins remaining)'
                : syncStep === 2
                  ? 'Verifying synced records...'
                  : 'Completed!'
          return (
            <div className='absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md transition-all duration-300'>
              <style>{`
              @keyframes stripe-march-insights {
                from { transform: translateX(0); }
                to   { transform: translateX(-40px); }
              }
            `}</style>
              <div className='flex w-full max-w-2xl flex-col items-center gap-8 px-6'>
                {/* Title */}
                <div className='flex flex-col items-center gap-2 text-center'>
                  <h1 className='text-2xl font-semibold leading-[34px] text-[#25224A]'>
                    Wait for the action
                  </h1>
                  <p className='text-sm font-normal leading-5 text-[#4D5C78]'>
                    Details from the connected source
                  </p>
                </div>

                {/* Progress + status */}
                <div className='flex w-full flex-col items-center gap-4'>
                  {/* Progress bar */}
                  <div className='relative h-3.5 w-full overflow-hidden rounded-full border border-[#CBD5E1] bg-[#E2E8F0] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]'>
                    <div
                      className='h-full rounded-full transition-all duration-500 ease-out'
                      style={{
                        width: `${syncProgress}%`,
                        background:
                          'repeating-linear-gradient(45deg, #2563EB 0px, #2563EB 14px, #60A5FA 14px, #60A5FA 28px)',
                        backgroundSize: '40px 40px',
                        animation: 'stripe-march-insights 0.8s linear infinite'
                      }}
                    />
                  </div>

                  {/* Progress label */}
                  <span className='text-sm font-semibold text-[#2C2B2B]'>
                    {statusText}
                  </span>

                  {/* Step indicators */}
                  <div className='flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-3.5 text-sm text-[#2A3241] shadow-[0_4px_12px_rgba(0,0,0,0.02)]'>
                    {syncSteps.map((step, i) => (
                      <div key={step.label} className='flex items-center gap-3'>
                        {i > 0 && (
                          <span className='font-medium text-[#CBD5E1]'>→</span>
                        )}
                        <div className='flex items-center gap-2'>
                          {step.done ? (
                            <CheckCircle2
                              className='h-5 w-5 text-[#10B981]'
                              fill='#10B981'
                              strokeWidth={0}
                            />
                          ) : syncStep === i ? (
                            <Loader2 className='h-5 w-5 animate-spin text-[#2563EB]' />
                          ) : (
                            <div className='h-5 w-5 rounded-full border-2 border-[#CBD5E1] bg-white' />
                          )}
                          <span
                            className={
                              syncStep === i
                                ? 'font-bold text-[#1E293B]'
                                : 'text-[#64748B]'
                            }
                          >
                            {step.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer note */}
                <p className='text-xs font-medium text-[#64748B]'>
                  We will notify you once its done
                </p>
              </div>
            </div>
          )
        })()}
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
                    {personaData?.mode ?? 'Data Source'}
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
                  {personaData?.mode ?? 'Data Source'}
                </span>
              </DropdownMenuItem>
              {personaData?.mode?.toUpperCase() === 'ZOHO' && (
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

      {/* Disconnect dialog */}
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
                disabled={disconnectMutation.isPending}
              >
                {disconnectMutation.isPending
                  ? 'Disconnecting...'
                  : 'Disconnect'}
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

      {/* Content wrapper */}
      <div className='flex-1 overflow-y-auto'>
        {isPageLoading ? (
          <CustomerInsightsSkeleton />
        ) : (
          <div className='flex flex-col gap-[22px] px-8 py-6'>
            {/* Top stats row */}
            <div className='flex w-full'>
              <SummaryWidget
                totalRecords={(
                  versionedDetails?.personaDetails?.totalElements ?? 0
                ).toLocaleString()}
                topIndustry={
                  !versionedDetails?.topIndustry ||
                  versionedDetails.topIndustry.toLowerCase() === 'unknown' ||
                  versionedDetails.topIndustry.trim() === ''
                    ? 'Other'
                    : versionedDetails.topIndustry.charAt(0).toUpperCase() +
                      versionedDetails.topIndustry.slice(1).toLowerCase()
                }
                topIndustryPercentage={Math.ceil(
                  Number(versionedDetails?.topIndustryPercentage ?? 50)
                )}
                topSegment={versionedDetails?.topMarketSegment ?? 'B2B'}
                topSegmentPercentage={Math.ceil(
                  Number(versionedDetails?.topMarketSegmentPercentage ?? 20)
                )}
              />
            </div>

            {/* Data matrix card */}
            <PartnershipMatrix
              data={versionedDetails?.category}
              totalRecords={
                versionedDetails?.personaDetails?.totalElements ?? 58034
              }
            />

            <IndustryDistribution
              data={versionedDetails?.category?.companySector}
              totalRecords={
                versionedDetails?.personaDetails?.totalElements ?? 58034
              }
            />
          </div>
        )}
      </div>
    </GradientPageBackground>
  )
}
