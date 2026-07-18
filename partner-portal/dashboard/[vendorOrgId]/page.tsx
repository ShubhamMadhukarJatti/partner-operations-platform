'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  ChevronDown,
  FileText,
  Folder,
  Grid3x3,
  List,
  Lock,
  LogOut,
  MapPin,
  Plus,
  Shield,
  TrendingUp
} from 'lucide-react'

import { stopTokenRefreshOnLogout } from '@/lib/auth/token-refresh'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { showCustomToast } from '@/components/custom-toast'
import { FullLogo } from '@/components/icons/logo'
import AddDealDetailsModal from '@/app/(app)/(dashboard-pages)/offline-partners/_components/AddDealDetailsModal'

const INTEGRATION_TYPES = [
  { value: 'HUBSPOT', label: 'HubSpot' },
  { value: 'SALESFORCE', label: 'Salesforce' },
  { value: 'PIPEDRIVE', label: 'Pipedrive' },
  { value: 'ZOHO', label: 'Zoho' }
] as const

interface Deal {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  customerAccountName: string
  dealId: string
  dealCode: string
  website: string
  headQuarterLocation: string
  estimatedAcv: number
  expectedClosingTime: string | null
  currentSolution: string
  requirements: string
  customFields: string
  dealStage: string
  source: string
  isApproved: boolean
  dealerOrgId: number
  vendorOrgId: number
  dealProtectionPeriod: number
  isSent: boolean
  dealStatus: string
  dealSize: string
  hotspotDealId: string | null
  lastActivity: string | null
  pointOfContact: string | null
  salesforceDealId: string | null
  zohoDealId: string | null
  provider: string | null
  userId: string
  isExternalPartnerPortalDeal: boolean
  customFieldsMap: Record<string, { value: string; dataType: string }>
}

interface DealsResponse {
  success: boolean
  message: string
  data: {
    content: Deal[]
    pageable: {
      pageNumber: number
      pageSize: number
      sort: {
        sorted: boolean
        empty: boolean
        unsorted: boolean
      }
      offset: number
      paged: boolean
      unpaged: boolean
    }
    last: boolean
    totalElements: number
    totalPages: number
    first: boolean
    size: number
    number: number
    sort: {
      sorted: boolean
      empty: boolean
      unsorted: boolean
    }
    numberOfElements: number
    empty: boolean
  }
}

interface DealCount {
  status: string
  count: number
}

export default function PartnerPortalDashboardWithOrg() {
  const params = useParams()
  const router = useRouter()
  const vendorOrgId = params?.vendorOrgId as string | undefined
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'comments' | 'activities'>(
    'activities'
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dealsCount, setDealsCount] = useState<DealCount[]>([])
  const [userData, setUserData] = useState<{
    name: string | null
    email: string | null
  } | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const [accountPopoverOpen, setAccountPopoverOpen] = useState(false)
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)
  const [dealToApprove, setDealToApprove] = useState<string | null>(null)
  const [approvalIntegrationType, setApprovalIntegrationType] =
    useState<string>('HUBSPOT')
  const [approvalDealProtectionPeriod, setApprovalDealProtectionPeriod] =
    useState<string>('90')
  const [isApproving, setIsApproving] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [dealToReject, setDealToReject] = useState<string | null>(null)
  const [isRejecting, setIsRejecting] = useState(false)
  const [vendorOrg, setVendorOrg] = useState<{
    logoUrl?: string
    name?: string
  } | null>(null)
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const handleLogout = useCallback(async () => {
    setAccountPopoverOpen(false)
    stopTokenRefreshOnLogout()
    queryClient.clear()
    await fetch('/api/logout', { method: 'GET' })
    localStorage.removeItem('dialogShown')
    localStorage.removeItem('FormShown')
    localStorage.removeItem('email')
    window.location.href = '/partner-portal/login'
  }, [queryClient])

  useEffect(() => {
    if (!vendorOrgId) {
      router.replace('/partner-portal/login')
      return
    }
  }, [vendorOrgId, router])

  useEffect(() => {
    async function fetchUserData() {
      try {
        setUserLoading(true)
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            try {
              const userProfileResponse = await fetch(
                `/api/user/${data.user.uid}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              )
              if (userProfileResponse.ok) {
                const userProfile = await userProfileResponse.json()
                setUserData({
                  name:
                    userProfile.name ||
                    userProfile.username ||
                    data.user.displayName ||
                    null,
                  email: userProfile.email || data.user.email || null
                })
              } else {
                setUserData({
                  name: data.user.displayName || null,
                  email: data.user.email || null
                })
              }
            } catch {
              setUserData({
                name: data.user.displayName || null,
                email: data.user.email || null
              })
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err)
      } finally {
        setUserLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const fetchDeals = async () => {
    if (!vendorOrgId || !userData?.email) return
    try {
      setLoading(true)
      setError(null)

      // Get externalPartnerCode from /v2/offline-partner/code
      const codeRes = await fetch(
        `/api/offline-partner/code?email=${encodeURIComponent(userData.email)}`
      )
      const codeData = await codeRes.json().catch(() => ({}))
      if (!codeRes.ok || !codeData?.data) {
        throw new Error(
          codeData?.message ?? 'Failed to get partner code for deals'
        )
      }
      const externalPartnerCode = String(codeData.data)

      const base = `/api/my-deals/external/partner/portal/get/deals`
      const query = (p: Record<string, string>) =>
        new URLSearchParams({
          externalPartnerCode,
          vendorOrgId,
          ...p
        }).toString()

      const [pendingResponse, activeResponse] = await Promise.all([
        fetch(
          `${base}?${query({ status: 'PENDING', page: '0', size: '10' })}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }
        ),
        fetch(`${base}?${query({ status: 'ACTIVE', page: '0', size: '10' })}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
      ])

      if (!pendingResponse.ok || !activeResponse.ok) {
        const errorData = await (
          pendingResponse.ok ? activeResponse : pendingResponse
        )
          .json()
          .catch(() => ({}))
        throw new Error(
          errorData.message ||
            `Failed to fetch deals: ${pendingResponse.statusText || activeResponse.statusText}`
        )
      }

      const pendingData: DealsResponse = await pendingResponse.json()
      const activeData: DealsResponse = await activeResponse.json()

      const allDeals: Deal[] = [
        ...(pendingData.success && pendingData.data?.content
          ? pendingData.data.content
          : []),
        ...(activeData.success && activeData.data?.content
          ? activeData.data.content
          : [])
      ]

      setDeals(allDeals)
      if (allDeals.length > 0 && !selectedDeal) {
        setSelectedDeal(allDeals[0].dealId)
      }
    } catch (err) {
      console.error('Failed to fetch deals:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch deals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (vendorOrgId && userData?.email) fetchDeals()
  }, [vendorOrgId, userData?.email])

  const fetchDealsCount = async () => {
    if (!vendorOrgId || !userData?.email) return
    try {
      const codeRes = await fetch(
        `/api/offline-partner/code?email=${encodeURIComponent(userData.email)}`
      )
      const codeData = await codeRes.json().catch(() => ({}))
      if (!codeRes.ok || !codeData?.data) {
        console.error(
          'Failed to get partner code for deals count:',
          codeData?.message
        )
        return
      }
      const externalPartnerCode = String(codeData.data)
      const response = await fetch(
        `/api/my-deals/external/partner/portal/getDealsCount/${encodeURIComponent(vendorOrgId)}?externalPartnerCode=${encodeURIComponent(externalPartnerCode)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      )
      if (!response.ok) return
      const data: DealCount[] = await response.json()
      setDealsCount(data)
    } catch (err) {
      console.error('Error fetching deals count:', err)
    }
  }

  useEffect(() => {
    if (vendorOrgId && userData?.email) fetchDealsCount()
  }, [vendorOrgId, userData?.email])

  useEffect(() => {
    if (!vendorOrgId) return
    let cancelled = false
    fetch(`/api/organization/id?id=${encodeURIComponent(vendorOrgId)}`, {
      credentials: 'include'
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((org: { logoUrl?: string; name?: string } | null) => {
        if (cancelled) return
        setVendorOrg(org ? { logoUrl: org.logoUrl, name: org.name } : null)
      })
      .catch(() => {
        if (!cancelled) setVendorOrg(null)
      })
    return () => {
      cancelled = true
    }
  }, [vendorOrgId])

  const openApprovalModal = (dealId: string) => {
    setDealToApprove(dealId)
    setApprovalIntegrationType('HUBSPOT')
    setApprovalDealProtectionPeriod('90')
    setIsApprovalModalOpen(true)
  }

  const closeApprovalModal = () => {
    setIsApprovalModalOpen(false)
    setDealToApprove(null)
    setIsApproving(false)
  }

  const handleApproveDeal = async () => {
    if (!dealToApprove) return
    const period = parseInt(approvalDealProtectionPeriod, 10)
    if (Number.isNaN(period) || period < 0) {
      showCustomToast(
        'Error',
        'Please enter a valid deal protection period (number ≥ 0).',
        'error',
        5000
      )
      return
    }
    try {
      setIsApproving(true)
      const res = await fetch(
        `/api/my-deals/external/partner/portal/approve/${encodeURIComponent(dealToApprove)}?isApproved=true&dealProtectionPeriod=${period}&integrationType=${encodeURIComponent(approvalIntegrationType)}`,
        { method: 'PATCH' }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.message ?? 'Failed to approve deal')
      }
      showCustomToast(
        'Success',
        data?.message ?? 'Deal approved successfully.',
        'success',
        5000
      )
      closeApprovalModal()
      fetchDeals()
      fetchDealsCount()
    } catch (err) {
      showCustomToast(
        'Error',
        err instanceof Error ? err.message : 'Failed to approve deal',
        'error',
        5000
      )
    } finally {
      setIsApproving(false)
    }
  }

  const openRejectModal = (dealId: string) => {
    setDealToReject(dealId)
    setIsRejectModalOpen(true)
  }

  const closeRejectModal = () => {
    if (!isRejecting) {
      setIsRejectModalOpen(false)
      setDealToReject(null)
    }
  }

  const handleRejectDealConfirm = async () => {
    if (!dealToReject) return
    try {
      setIsRejecting(true)
      const res = await fetch(
        `/api/my-deals/external/partner/portal/approve/${encodeURIComponent(dealToReject)}?isApproved=false&dealProtectionPeriod=0&integrationType=NONE`,
        { method: 'PATCH' }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.message ?? 'Failed to reject deal')
      }
      showCustomToast(
        'Success',
        data?.message ?? 'Deal rejected.',
        'success',
        5000
      )
      closeRejectModal()
      fetchDeals()
      fetchDealsCount()
    } catch (err) {
      showCustomToast(
        'Error',
        err instanceof Error ? err.message : 'Failed to reject deal',
        'error',
        5000
      )
    } finally {
      setIsRejecting(false)
    }
  }

  const getCountByStatus = (status: string): number => {
    const countData = dealsCount.find((item) => item.status === status)
    return countData?.count ?? 0
  }

  const stats = [
    {
      label: 'Total Deals',
      value: getCountByStatus('ALL').toString(),
      icon: Shield
    },
    {
      label: 'Active',
      value: getCountByStatus('ACTIVE').toString(),
      icon: TrendingUp
    },
    {
      label: 'Pending',
      value: getCountByStatus('PENDING').toString(),
      icon: FileText
    },
    {
      label: 'Rejected',
      value: getCountByStatus('REJECTED').toString(),
      icon: Folder
    },
    {
      label: 'Expired',
      value: getCountByStatus('EXPIRED').toString(),
      icon: AlertTriangle
    }
  ]

  const dashboardPath = `/partner-portal/dashboard/${vendorOrgId}`
  const partnerMappingPath = `/partner-portal/partner-mapping/${vendorOrgId}`

  if (!vendorOrgId) {
    return null
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='border-b border-gray-200 bg-white shadow-sm'>
        <div className='w-full px-0 py-3'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
            {/* Logo - left aligned */}
            <div className='flex min-w-0 flex-shrink-0 items-center justify-start gap-2'>
              <FullLogo className='h-8 w-40 flex-shrink-0 sm:h-9' />
              <span className='hidden truncate text-base font-medium text-gray-600 sm:inline sm:text-lg'>
                Deals Portal
              </span>
            </div>
            {/* Encrypted link banner - centered on desktop */}
            <div className='order-3 min-w-0 flex-1 sm:order-2 sm:flex sm:justify-center sm:px-4'>
              <div className='flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 sm:gap-2.5 sm:px-4 sm:py-2.5'>
                <div className='flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-500 sm:h-5 sm:w-5'>
                  <svg
                    className='h-2.5 w-2.5 text-white sm:h-3 sm:w-3'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <span className='truncate text-xs font-medium text-green-800 sm:text-sm'>
                  <span className='hidden sm:inline'>
                    This is an encrypted link, visible only to verified
                    recipients
                  </span>
                  <span className='sm:hidden'>Encrypted link</span>
                </span>
              </div>
            </div>
            {/* User account - right aligned */}
            <div className='order-2 ml-auto flex flex-shrink-0 items-center sm:order-3'>
              <Popover
                open={accountPopoverOpen}
                onOpenChange={setAccountPopoverOpen}
              >
                <PopoverTrigger asChild className='cursor-pointer'>
                  <div className='flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-gray-100 sm:gap-2 sm:px-3 sm:py-2'>
                    <div className='flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white sm:h-8 sm:w-8 sm:text-sm'>
                      {userLoading ? (
                        <Skeleton className='h-full w-full rounded-full' />
                      ) : (
                        (userData?.name || userData?.email || 'U')
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>
                    <div className='flex hidden flex-col sm:flex'>
                      {userLoading ? (
                        <>
                          <Skeleton className='mb-1 h-4 w-20' />
                          <Skeleton className='h-3 w-32' />
                        </>
                      ) : (
                        <>
                          <span className='text-sm font-medium text-gray-900'>
                            {userData?.name || 'User'}
                          </span>
                          <span className='text-xs text-gray-500'>
                            {userData?.email || 'user@example.com'}
                          </span>
                        </>
                      )}
                    </div>
                    <ChevronDown className='h-3 w-3 text-gray-500 sm:h-4 sm:w-4' />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  align='end'
                  sideOffset={2}
                  className='w-[294px] rounded-xl border border-border p-0 shadow-lg'
                >
                  {/* Header */}
                  <div className='px-4 py-3'>
                    <p className='text-base font-semibold text-text-100'>
                      My Account
                    </p>
                  </div>

                  <div className='h-px bg-border' />

                  {/* Logout */}
                  <div
                    onClick={handleLogout}
                    className='cursor-pointer rounded-b-xl px-4 py-3 text-sm font-medium hover:bg-muted'
                  >
                    <div className='flex items-center gap-2'>
                      <LogOut
                        className='h-5 w-5 text-text-100'
                        strokeWidth={2.5}
                      />
                      <span>Log out</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </header>

      <div className='flex flex-col lg:flex-row'>
        <div className='w-full border-b border-gray-200 bg-white lg:w-52 lg:flex-shrink-0 lg:border-b-0 lg:border-r'>
          <nav className='flex gap-0 lg:flex-col lg:gap-1 lg:p-3'>
            <Link
              href={dashboardPath}
              className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors lg:flex-initial ${
                pathname === dashboardPath
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Grid3x3 className='h-4 w-4 flex-shrink-0' />
              Deals ({dealsCount.find((d) => d.status === 'ALL')?.count ?? 0})
            </Link>
            <Link
              href={partnerMappingPath}
              className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors lg:flex-initial ${
                pathname?.startsWith('/partner-portal/partner-mapping')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <MapPin className='h-4 w-4 flex-shrink-0' />
              Account Mapping
            </Link>
          </nav>
        </div>

        <div className='min-w-0 flex-1'>
          <div className='w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6'>
            <div className='mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 via-gray-50 to-blue-50 px-3 py-2.5 sm:mb-6 sm:gap-3 sm:px-4 sm:py-3'>
              <Lock className='h-4 w-4 flex-shrink-0 text-gray-500 sm:h-5 sm:w-5' />
              <span className='text-xs font-medium text-gray-600 sm:text-sm'>
                Encrypted link
              </span>
            </div>

            <div className='mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
              <div className='flex flex-wrap items-center gap-2 sm:gap-4'>
                <div className='relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 sm:h-12 sm:w-12'>
                  {vendorOrg?.logoUrl ? (
                    <Image
                      src={vendorOrg.logoUrl}
                      alt={vendorOrg.name ?? 'Organization'}
                      width={48}
                      height={48}
                      className='h-full w-full object-cover'
                      unoptimized
                    />
                  ) : (
                    <span className='text-lg font-bold text-gray-600 sm:text-xl'>
                      {(vendorOrg?.name || 'S').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <h1 className='text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl'>
                  Partner Portal
                </h1>
                <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500 sm:h-12 sm:w-12'>
                  <span className='text-base font-bold text-white sm:text-lg'>
                    A
                  </span>
                </div>
              </div>
              <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700 sm:gap-2 sm:px-4 sm:py-2 sm:text-base'
                >
                  <Plus className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                  <span className='hidden sm:inline'>Register new deal</span>
                  <span className='sm:hidden'>New deal</span>
                </button>
              </div>
            </div>

            <div className='mb-6 sm:mb-8'>
              <div className='mb-3 flex items-center gap-2 sm:mb-4'>
                <Grid3x3 className='h-4 w-4 text-gray-600 sm:h-5 sm:w-5' />
                <h2 className='text-lg font-semibold text-gray-900 sm:text-xl'>
                  Overview
                </h2>
              </div>
              {loading && dealsCount.length === 0 ? (
                <div className='space-y-3 sm:space-y-4'>
                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3'>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:p-6'
                      >
                        <Skeleton className='mb-2 h-6 w-6' />
                        <Skeleton className='mb-1 h-8 w-16' />
                        <Skeleton className='h-4 w-20' />
                      </div>
                    ))}
                  </div>
                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3'>
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:p-6'
                      >
                        <Skeleton className='mb-2 h-6 w-6' />
                        <Skeleton className='mb-1 h-8 w-16' />
                        <Skeleton className='h-4 w-20' />
                      </div>
                    ))}
                    <div className='hidden lg:block' />
                  </div>
                </div>
              ) : (
                <div className='space-y-3 sm:space-y-4'>
                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3'>
                    {stats.slice(0, 3).map((stat) => {
                      const Icon = stat.icon
                      return (
                        <div
                          key={stat.label}
                          className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:p-6'
                        >
                          <div className='mb-2 flex items-center justify-between'>
                            <Icon className='h-5 w-5 text-gray-400 sm:h-6 sm:w-6' />
                          </div>
                          <div className='mb-1 text-2xl font-bold text-gray-900 sm:text-3xl'>
                            {stat.value}
                          </div>
                          <div className='text-xs text-gray-500 sm:text-sm'>
                            {stat.label}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3'>
                    {stats.slice(3, 5).map((stat) => {
                      const Icon = stat.icon
                      return (
                        <div
                          key={stat.label}
                          className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:p-6'
                        >
                          <div className='mb-2 flex items-center justify-between'>
                            <Icon className='h-5 w-5 text-gray-400 sm:h-6 sm:w-6' />
                          </div>
                          <div className='mb-1 text-2xl font-bold text-gray-900 sm:text-3xl'>
                            {stat.value}
                          </div>
                          <div className='text-xs text-gray-500 sm:text-sm'>
                            {stat.label}
                          </div>
                        </div>
                      )
                    })}
                    <div className='hidden lg:block' />
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className='mb-3 flex items-center gap-2 sm:mb-4'>
                <List className='h-4 w-4 text-gray-600 sm:h-5 sm:w-5' />
                <h2 className='text-lg font-semibold text-gray-900 sm:text-xl'>
                  All Deals
                </h2>
              </div>
              {loading ? (
                <div className='flex flex-col gap-4 sm:gap-6 lg:flex-row'>
                  <div className='w-full rounded-lg border border-gray-200 bg-white p-3 sm:p-4 lg:w-1/3'>
                    <div className='mb-4'>
                      <Skeleton className='mb-2 h-5 w-24' />
                      <div className='space-y-2'>
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className='h-10 w-full' />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='flex-1 rounded-lg border border-gray-200 bg-white p-4 sm:p-5 md:p-6'>
                    <Skeleton className='mb-2 h-8 w-48' />
                    <Skeleton className='h-6 w-32' />
                  </div>
                </div>
              ) : error ? (
                <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                  <div className='text-sm text-red-600'>{error}</div>
                </div>
              ) : (
                <div className='flex flex-col gap-4 sm:gap-6 lg:flex-row'>
                  <div className='w-full rounded-lg border border-gray-200 bg-white p-3 sm:p-4 lg:w-1/3'>
                    <div className='mb-4'>
                      <h3 className='mb-2 text-sm font-semibold text-gray-900 sm:text-base'>
                        Active (
                        {deals.filter((d) => d.dealStatus === 'ACTIVE').length})
                      </h3>
                      <div className='space-y-1'>
                        {deals
                          .filter((d) => d.dealStatus === 'ACTIVE')
                          .map((deal) => (
                            <button
                              key={deal.dealId}
                              onClick={() => setSelectedDeal(deal.dealId)}
                              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors sm:text-base ${
                                selectedDeal === deal.dealId
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {deal.customerAccountName || deal.dealCode}
                            </button>
                          ))}
                      </div>
                    </div>
                    {deals.filter((d) => d.dealStatus === 'PENDING').length >
                      0 && (
                      <div className='border-t border-gray-200 pt-4'>
                        <h3 className='mb-2 text-sm font-semibold text-gray-900 sm:text-base'>
                          Pending (
                          {
                            deals.filter((d) => d.dealStatus === 'PENDING')
                              .length
                          }
                          )
                        </h3>
                        <div className='space-y-1'>
                          {deals
                            .filter((d) => d.dealStatus === 'PENDING')
                            .map((deal) => (
                              <button
                                key={deal.dealId}
                                onClick={() => setSelectedDeal(deal.dealId)}
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors sm:text-base ${
                                  selectedDeal === deal.dealId
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {deal.customerAccountName || deal.dealCode}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='flex-1 rounded-lg border border-gray-200 bg-white p-4 sm:p-5 md:p-6'>
                    {(() => {
                      const deal = selectedDeal
                        ? deals.find((d) => d.dealId === selectedDeal)
                        : null
                      if (!deal) {
                        return (
                          <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4'>
                            <h3 className='text-xl font-bold text-gray-900 sm:text-2xl'>
                              Select a deal
                            </h3>
                          </div>
                        )
                      }
                      const formatDate = (dateString: string | null) => {
                        if (!dateString) return null
                        return new Date(dateString).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }
                        )
                      }
                      const getStatusLabel = (status: string) => {
                        switch (status) {
                          case 'PENDING':
                            return 'Pending'
                          case 'ACTIVE':
                            return 'Active'
                          case 'WAITING_FOR_APPROVAL':
                            return 'Waiting for Approval'
                          default:
                            return deal.dealStage?.replace(/_/g, ' ') || status
                        }
                      }
                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case 'PENDING':
                          case 'WAITING_FOR_APPROVAL':
                            return 'bg-orange-100 text-orange-700'
                          case 'ACTIVE':
                            return 'bg-green-100 text-green-700'
                          default:
                            return 'bg-orange-100 text-orange-700'
                        }
                      }
                      const createdDate = formatDate(deal.creationTimestamp)
                      const lastUpdatedDate = formatDate(
                        deal.lastUpdatedTimestamp
                      )
                      return (
                        <>
                          <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4'>
                            <h3 className='text-xl font-bold text-gray-900 sm:text-2xl'>
                              {deal.customerAccountName || deal.dealCode}
                            </h3>
                            <div className='flex items-center gap-2 sm:gap-3'>
                              <span
                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium sm:px-3 sm:py-1.5 sm:text-sm ${getStatusColor(deal.dealStatus)}`}
                              >
                                {getStatusLabel(deal.dealStatus)}
                              </span>
                            </div>
                          </div>
                          <div className='mb-4 sm:mb-6'>
                            <div className='mb-3 flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-0'>
                              <span className='text-xs text-gray-600 sm:text-sm'>
                                {createdDate
                                  ? `Started ${createdDate}`
                                  : 'Started date not available'}
                              </span>
                              {lastUpdatedDate && (
                                <span className='rounded bg-orange-100 px-2 py-1 text-xs text-gray-600 sm:text-sm'>
                                  {getStatusLabel(deal.dealStatus)}{' '}
                                  {lastUpdatedDate}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className='mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3'>
                            <div className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-pink-300 sm:h-10 sm:w-10'>
                              <span className='text-xs font-semibold text-pink-700 sm:text-sm'>
                                {(
                                  deal.pointOfContact ||
                                  deal.customerAccountName ||
                                  'D'
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div className='flex-1'>
                              <div className='text-sm font-medium text-gray-900 sm:text-base'>
                                {deal.pointOfContact ||
                                  deal.customerAccountName ||
                                  'Deal contact'}
                              </div>
                            </div>
                          </div>
                          <div className='mb-4 sm:mb-6'>
                            <h4 className='mb-2 text-sm font-semibold text-gray-900 sm:text-base'>
                              Highlights:
                            </h4>
                            <ul className='ml-2 list-inside list-disc space-y-1 text-xs text-gray-700 sm:text-sm'>
                              <li>{deal.currentSolution || 'No details'}</li>
                            </ul>
                          </div>
                          <div className='mb-4 sm:mb-6'>
                            <h4 className='mb-2 text-sm font-semibold text-gray-900 sm:text-base'>
                              Lowlights:
                            </h4>
                            <ul className='ml-2 list-inside list-disc space-y-1 text-xs text-gray-700 sm:text-sm'>
                              <li>{deal.requirements || 'No details'}</li>
                            </ul>
                          </div>
                          {deal.dealStatus === 'PENDING' && (
                            <div className='flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4 sm:gap-3'>
                              <Button
                                type='button'
                                onClick={() => openApprovalModal(deal.dealId)}
                                className='bg-green-600 text-white hover:bg-green-700'
                              >
                                Approve deal
                              </Button>
                              <Button
                                type='button'
                                variant='outline'
                                onClick={() => openRejectModal(deal.dealId)}
                                className='border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800'
                              >
                                Reject deal
                              </Button>
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog
        open={isRejectModalOpen}
        onOpenChange={(open) => {
          setIsRejectModalOpen(open)
          if (!open) setDealToReject(null)
        }}
      >
        <AlertDialogContent className='max-w-md rounded-2xl border-gray-200 bg-white p-6 shadow-xl'>
          <AlertDialogHeader>
            <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
              <AlertTriangle className='h-6 w-6 text-red-600' />
            </div>
            <AlertDialogTitle className='text-center text-xl font-semibold text-gray-900'>
              Reject deal?
            </AlertDialogTitle>
            <AlertDialogDescription className='text-center text-gray-600'>
              Are you sure you want to reject this deal? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='mt-6 flex flex-row justify-center gap-3 sm:justify-center'>
            <AlertDialogCancel
              onClick={closeRejectModal}
              disabled={isRejecting}
              className='mt-0 border-gray-300 bg-white px-5 hover:bg-gray-50'
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleRejectDealConfirm()
              }}
              disabled={isRejecting}
              className='bg-red-600 px-5 text-white hover:bg-red-700 focus:ring-red-500'
            >
              {isRejecting ? 'Rejecting...' : 'Reject deal'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={isApprovalModalOpen}
        onOpenChange={(open) => {
          setIsApprovalModalOpen(open)
          if (!open) {
            setDealToApprove(null)
            setIsApproving(false)
          }
        }}
      >
        <DialogContent className='max-w-md' hideCloseBtn={false}>
          <DialogHeader>
            <DialogTitle>Approve deal</DialogTitle>
          </DialogHeader>
          <p className='text-sm text-gray-600'>
            Choose the integration type and deal protection period for this
            deal.
          </p>
          <div className='space-y-4 py-2'>
            <div>
              <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                Integration type
              </label>
              <Select
                value={approvalIntegrationType}
                onValueChange={setApprovalIntegrationType}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select integration' />
                </SelectTrigger>
                <SelectContent>
                  {INTEGRATION_TYPES.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                Deal protection period (days)
              </label>
              <Input
                type='number'
                min={0}
                value={approvalDealProtectionPeriod}
                onChange={(e) =>
                  setApprovalDealProtectionPeriod(e.target.value)
                }
                placeholder='e.g. 90'
                className='w-full'
              />
            </div>
          </div>
          <DialogFooter className='gap-2 sm:gap-0'>
            <Button
              type='button'
              variant='outline'
              onClick={closeApprovalModal}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              type='button'
              onClick={handleApproveDeal}
              disabled={isApproving}
              className='bg-green-600 text-white hover:bg-green-700'
            >
              {isApproving ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddDealDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isPartnerPortal={true}
        partnerPortalVendorOrgId={
          vendorOrgId ? parseInt(vendorOrgId, 10) : undefined
        }
        partnerEmail={userData?.email ?? undefined}
        onSuccess={() => {
          fetchDeals()
          fetchDealsCount()
        }}
      />
    </div>
  )
}
