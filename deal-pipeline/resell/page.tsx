'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSidebarView } from '@/contexts/sidebar-view-context'
import { RootState } from '@/redux/store'
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  FolderClosed,
  Handshake,
  Plus,
  Save,
  Search
} from 'lucide-react'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { TootipIcon } from '@/components/icons/icons'
import PageHeader from '@/components/shared/page-header'

import ResellDealNotPresentPlaceholder from './ResellDealNotPresentPlaceholder'

interface ResellerDeal {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  resellerOrgId: number
  vendorOrgId: number
  partnerName: string
  expectedReleaseTime: number
  expectedReleaseDate: string
  resellerMode: string
  productPlanRequired: string
  numberOfLicences: number
  calculatedPartnerTier: string | null
  billingModel: string
  actualPrice: number
  buyPrice: number
  resellerDealStag: string
  resellerDealStatus: string
  resellerDealSource: string
  poc: string
  website: string | null
}

interface ResellerDealsResponse {
  success: boolean
  message: string
  data: {
    createdDeals: ResellerDeal[]
    receivedDeals: ResellerDeal[]
  }
}

interface DealCountResponse {
  success: boolean
  message: string
  data: Array<{
    status: string
    count: number
  }>
}

interface Deal {
  id: number
  dealId: string
  creationTimestamp: string
  lastUpdatedTimestamp: string
  customerAccountName: string
  website: string | null
  partnerName: string
  resellerOrgId: number
  vendorOrgId: number
  dealCode: string
  dealSize: number
  dealStatus: string
  dealStage: string
  source: string
  pointOfContact: string
  expectedReleaseTime: number
  expectedReleaseDate: string
  productPlanRequired: string
  numberOfLicences: number
  calculatedPartnerTier: string | null
  billingModel: string
  actualPrice: number
  buyPrice: number
  isCreated: boolean // true for createdDeals, false for receivedDeals
}

interface FormattedDeal {
  dealId: string
  dealCode: string
  customer: string
  poc: string
  stage: string
  source: string
  dealerOrgId: number
  dealSize: number
  updated: string
  lastSynced: string
  dealStatus: string
  lastActivity: string
  pointOfContact: string
  isCreated?: boolean
}

interface CompanyGroup {
  companyName: string
  dealCount: number
  totalDealSize: number
  deals: FormattedDeal[]
  isExpanded: boolean
}

const SENT_RECEIVED_FILTER = [
  { value: 'sent', label: 'Sent' },
  { value: 'received', label: 'Received' }
]

const EMPTY_STATUS_COUNTS: Record<string, number> = {
  ALL: 0,
  PENDING: 0,
  ACTIVE: 0,
  REJECTED: 0,
  CLOSED: 0,
  EXPIRED: 0
}

function formatDealStage(stage: string): string {
  const stageMap: Record<string, string> = {
    REQUESTED: 'In Pipeline',
    WAITING_FOR_APPROVAL: 'Waiting for approval',
    APPROVED: 'Active',
    REJECTED: 'Rejected',
    CLOSED: 'Closed',
    EXPIRED: 'Expired'
  }
  return stageMap[stage] || stage
}

function formatSource(source: string): string {
  const sourceMap: Record<string, string> = {
    PORTAL: 'Portal',
    SLACK: 'Slack',
    EMAIL: 'Email',
    API: 'API'
  }
  return sourceMap[source] || source
}

function formatDate(dateString: string): string {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  } catch {
    return 'N/A'
  }
}

function getDaysSinceUpdate(dateString: string): string {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) return 'Today'
    if (diffDays === 1) return '1 day'
    if (diffDays < 30) return `${diffDays} days`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`

    return `${Math.floor(diffDays / 30)} months`
  } catch {
    return 'N/A'
  }
}

export default function ResellDealPipeline() {
  const SENT_RECEIVED_STORAGE_KEY = 'deal-sent-received'
  const SENT_RECEIVED_MANUAL_KEY = 'deal-sent-received-manual'

  const router = useRouter()
  const { hideVendorRestrictedDealCtAs } = useSidebarView()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('PENDING')
  const [sentReceived, setSentReceived] = useState(() => {
    if (typeof window === 'undefined') return 'sent'
    return localStorage.getItem(SENT_RECEIVED_STORAGE_KEY) || 'sent'
  })
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<any>([])
  const [dealsCounts, setDealsCounts] = useState<Record<string, number>>({})
  const [dealCountsByDirection, setDealCountsByDirection] = useState<{
    sent: Record<string, number>
    received: Record<string, number>
  }>({
    sent: { ...EMPTY_STATUS_COUNTS },
    received: { ...EMPTY_STATUS_COUNTS }
  })
  const [companyGroups, setCompanyGroups] = useState<CompanyGroup[]>([])
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(
    new Set()
  )
  const [organizationGroups, setOrganizationGroups] = useState<
    Array<{
      orgName: string
      deals: Deal[]
      dealCount: number
      totalDealSize: number
    }>
  >([])
  const [activeTab, setActiveTab] = useState('PENDING')
  const [mainTab, setMainTab] = useState('deals-pipeline')
  const [hasUserManuallySelected, setHasUserManuallySelected] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(SENT_RECEIVED_MANUAL_KEY) === 'true'
  })

  const handleSentReceivedChange = (value: string) => {
    setHasUserManuallySelected(true)
    setSentReceived(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem(SENT_RECEIVED_STORAGE_KEY, value)
      localStorage.setItem(SENT_RECEIVED_MANUAL_KEY, 'true')
    }
  }

  // Convert ResellerDeal to Deal
  function convertResellerDealToDeal(
    resellerDeal: ResellerDeal,
    isCreated: boolean
  ): Deal {
    return {
      id: resellerDeal.id,
      dealId: `${resellerDeal.id}`,
      creationTimestamp: resellerDeal.creationTimestamp,
      lastUpdatedTimestamp: resellerDeal.lastUpdatedTimestamp,
      customerAccountName: resellerDeal.partnerName || 'N/A',
      website: resellerDeal.website,
      partnerName: resellerDeal.partnerName,
      resellerOrgId: resellerDeal.resellerOrgId,
      vendorOrgId: resellerDeal.vendorOrgId,
      dealCode: `${resellerDeal.id}`,
      dealSize: resellerDeal.actualPrice || 0,
      dealStatus: resellerDeal.resellerDealStatus,
      dealStage: resellerDeal.resellerDealStag,
      source: resellerDeal.resellerDealSource,
      pointOfContact: resellerDeal.poc,
      expectedReleaseTime: resellerDeal.expectedReleaseTime,
      expectedReleaseDate: resellerDeal.expectedReleaseDate,
      productPlanRequired: resellerDeal.productPlanRequired,
      numberOfLicences: resellerDeal.numberOfLicences,
      calculatedPartnerTier: resellerDeal.calculatedPartnerTier,
      billingModel: resellerDeal.billingModel,
      actualPrice: resellerDeal.actualPrice,
      buyPrice: resellerDeal.buyPrice,
      isCreated
    }
  }

  // Fetch deals data from reseller deals API
  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Fetching resell deals with status:', status)
      if (status === 'CLOSED') {
        setDeals([])
        setOrganizationGroups([])
        setLoading(false)
        return
      }

      const response = await fetch(`/api/reseller/deals/stage?status=${status}`)
      if (!response.ok) {
        throw new Error('Failed to fetch deals')
      }
      const data: ResellerDealsResponse = await response.json()

      if (!data.success || !data.data) {
        throw new Error(data.message || 'Failed to fetch deals')
      }

      // Convert createdDeals and receivedDeals to Deal format
      const allDeals: Deal[] = []

      // Process created deals (sent deals)
      if (data.data.createdDeals && data.data.createdDeals.length > 0) {
        for (const resellerDeal of data.data.createdDeals) {
          const deal = convertResellerDealToDeal(resellerDeal, true)
          allDeals.push(deal)
        }
      }

      // Process received deals
      if (data.data.receivedDeals && data.data.receivedDeals.length > 0) {
        for (const resellerDeal of data.data.receivedDeals) {
          const deal = convertResellerDealToDeal(resellerDeal, false)
          allDeals.push(deal)
        }
      }

      // Group deals by partner name
      const organizationGroups: Array<{
        orgName: string
        deals: Deal[]
        dealCount: number
        totalDealSize: number
      }> = []

      const groupedByPartner: Record<string, Deal[]> = {}
      allDeals.forEach((deal) => {
        const partnerName = deal.partnerName || 'Unknown Partner'
        if (!groupedByPartner[partnerName]) {
          groupedByPartner[partnerName] = []
        }
        groupedByPartner[partnerName].push(deal)
      })

      // Convert grouped deals to organization groups
      Object.entries(groupedByPartner).forEach(([partnerName, deals]) => {
        organizationGroups.push({
          orgName: partnerName,
          deals,
          dealCount: deals.length,
          totalDealSize: deals.reduce((sum, deal) => sum + deal.dealSize, 0)
        })
      })

      setDeals(allDeals)
      setOrganizationGroups(organizationGroups)
    } catch (error) {
      console.error('Error fetching resell deals:', error)
      setError('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }, [status])

  // Handle tab change
  const handleTabChange = (newStatus: string) => {
    setActiveTab(newStatus)
    setStatus(newStatus)
  }

  // Fetch all deal counts
  const fetchAllDealCounts = useCallback(async () => {
    try {
      const statuses = ['PENDING', 'ACTIVE', 'REJECTED', 'EXPIRED']

      const results = await Promise.all(
        statuses.map(async (statusKey) => {
          const response = await fetch(
            `/api/reseller/deals/stage?status=${statusKey}`
          )
          if (!response.ok) {
            throw new Error(`Failed to fetch ${statusKey} deal counts`)
          }

          const data: ResellerDealsResponse = await response.json()
          if (!data.success || !data.data) {
            throw new Error(
              data.message || `Failed to fetch ${statusKey} deals`
            )
          }

          return {
            statusKey,
            sentCount: data.data.createdDeals?.length || 0,
            receivedCount: data.data.receivedDeals?.length || 0
          }
        })
      )

      const overallCounts: Record<string, number> = { ...EMPTY_STATUS_COUNTS }
      const sentCounts: Record<string, number> = { ...EMPTY_STATUS_COUNTS }
      const receivedCounts: Record<string, number> = { ...EMPTY_STATUS_COUNTS }

      results.forEach(({ statusKey, sentCount, receivedCount }) => {
        const total = sentCount + receivedCount
        overallCounts[statusKey] = total
        sentCounts[statusKey] = sentCount
        receivedCounts[statusKey] = receivedCount
        overallCounts.ALL += total
        sentCounts.ALL += sentCount
        receivedCounts.ALL += receivedCount
      })

      setDealsCounts(overallCounts)
      setDealCountsByDirection({
        sent: sentCounts,
        received: receivedCounts
      })
    } catch (error) {
      console.error('Error fetching deal counts:', error)
    }
  }, [])

  useEffect(() => {
    fetchDeals()
  }, [fetchDeals])

  useEffect(() => {
    fetchAllDealCounts()
  }, [fetchAllDealCounts])

  // Auto-select Sent/Received per active status tab.
  // Prefer "received" if data exists; run only once on first load.
  useEffect(() => {
    if (hasUserManuallySelected) return
    if (!Array.isArray(deals) || deals.length === 0) return

    const hasReceivedDeals = deals.some((deal) => deal.isCreated === false)
    const hasSentDeals = deals.some((deal) => deal.isCreated === true)

    if (hasReceivedDeals) {
      setSentReceived('received')
      setHasUserManuallySelected(true)
      return
    }

    if (hasSentDeals) {
      setSentReceived('sent')
      setHasUserManuallySelected(true)
    }
  }, [deals])

  const currentOrgState = useSelector((state: RootState) => state.currentOrg)
  const organization = currentOrgState?.organization
  const currentOrgId = organization?.id

  // Transform deals data for display
  const formattedDeals: FormattedDeal[] = useMemo(() => {
    return deals.map((deal) => ({
      dealId: deal.dealId,
      dealCode: deal.dealCode,
      customer: deal.customerAccountName || deal.partnerName || 'N/A',
      poc: deal.pointOfContact || 'N/A',
      stage: formatDealStage(deal.dealStage),
      source: formatSource(deal.source),
      dealerOrgId: deal.resellerOrgId,
      dealSize: deal.dealSize || 0,
      updated: formatDate(deal.lastUpdatedTimestamp),
      lastSynced: getDaysSinceUpdate(deal.lastUpdatedTimestamp),
      dealStatus: deal.dealStatus,
      lastActivity: getDaysSinceUpdate(deal.lastUpdatedTimestamp),
      pointOfContact: deal.pointOfContact || 'N/A',
      isCreated: deal.isCreated
    }))
  }, [deals])

  // Toggle company expansion
  const toggleCompanyExpansion = (companyName: string) => {
    setExpandedCompanies((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(companyName)) {
        newSet.delete(companyName)
      } else {
        newSet.add(companyName)
      }
      return newSet
    })
  }

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalDeals = dealsCounts.ALL || 0
    const active = dealsCounts.ACTIVE || 0
    const pending = dealsCounts.PENDING || 0
    const rejected = dealsCounts.REJECTED || 0
    const expired = dealsCounts.EXPIRED || 0
    const closed = dealsCounts.CLOSED || 0

    return [
      {
        label: 'Total Deals',
        value: totalDeals,
        icon: <Handshake size={24} />,
        tooltipText: undefined
      },
      {
        label: 'Drafts',
        value: 0,
        icon: <Save size={24} />,
        tooltipText: undefined
      },
      {
        label: 'Active',
        value: active,
        icon: <Activity size={24} />,
        tooltipText: undefined
      },
      {
        label: 'Closed',
        value: closed,
        icon: <FolderClosed size={24} />,
        tooltipText: undefined
      },
      {
        label: 'Expired',
        value: expired,
        icon: <AlertTriangle size={24} />,
        tooltipText: 'Deals expired due to overdue deal protection period'
      }
    ]
  }, [dealsCounts])

  const filteredDeals = useMemo(() => {
    return formattedDeals.filter((deal) => {
      const matchesSearch =
        search === '' ||
        deal.customer.toLowerCase().includes(search.toLowerCase()) ||
        deal.stage.toLowerCase().includes(search.toLowerCase()) ||
        deal.dealCode.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = deal.dealStatus === status
      const matchesSentReceived =
        (sentReceived === 'sent' && deal.isCreated === true) ||
        (sentReceived === 'received' && deal.isCreated === false)
      return matchesSearch && matchesStatus && matchesSentReceived
    })
  }, [formattedDeals, search, status, sentReceived])

  // Group deals by company for collaborative view
  const groupedDeals: CompanyGroup[] = useMemo(() => {
    if (organizationGroups.length > 0) {
      return organizationGroups
        .map((orgGroup) => {
          const filteredOrgDeals = orgGroup.deals
            .map((deal) => ({
              dealId: deal.dealId,
              dealCode: deal.dealCode,
              customer: deal.customerAccountName || deal.partnerName || 'N/A',
              poc: deal.pointOfContact || 'N/A',
              stage: formatDealStage(deal.dealStage),
              source: formatSource(deal.source),
              dealerOrgId: deal.resellerOrgId,
              dealSize: deal.dealSize || 0,
              updated: formatDate(deal.lastUpdatedTimestamp),
              lastSynced: getDaysSinceUpdate(deal.lastUpdatedTimestamp),
              dealStatus: deal.dealStatus,
              lastActivity: getDaysSinceUpdate(deal.lastUpdatedTimestamp),
              pointOfContact: deal.pointOfContact || 'N/A',
              isCreated: deal.isCreated
            }))
            .filter((deal) => {
              const matchesSearch =
                search === '' ||
                deal.customer.toLowerCase().includes(search.toLowerCase()) ||
                deal.stage.toLowerCase().includes(search.toLowerCase()) ||
                deal.dealCode.toLowerCase().includes(search.toLowerCase())
              const matchesStatus = deal.dealStatus === status
              const matchesSentReceived =
                (sentReceived === 'sent' && deal.isCreated) ||
                (sentReceived === 'received' && !deal.isCreated)
              return matchesSearch && matchesStatus && matchesSentReceived
            })

          return {
            companyName: orgGroup.orgName,
            dealCount: filteredOrgDeals.length,
            totalDealSize: filteredOrgDeals.reduce(
              (sum, deal) => sum + deal.dealSize,
              0
            ),
            deals: filteredOrgDeals,
            isExpanded: expandedCompanies.has(orgGroup.orgName)
          }
        })
        .filter((group) => group.dealCount > 0)
    }

    const groups: Record<string, FormattedDeal[]> = {}

    filteredDeals.forEach((deal) => {
      const companyName = deal.customer
      if (!groups[companyName]) {
        groups[companyName] = []
      }
      groups[companyName].push(deal)
    })

    return Object.entries(groups).map(([companyName, deals]) => ({
      companyName,
      dealCount: deals.length,
      totalDealSize: deals.reduce((sum, deal) => sum + deal.dealSize, 0),
      deals,
      isExpanded: expandedCompanies.has(companyName)
    }))
  }, [
    organizationGroups,
    filteredDeals,
    expandedCompanies,
    search,
    status,
    sentReceived
  ])

  // Check if there's data in ANY tab (PENDING, ACTIVE, REJECTED, CLOSED, EXPIRED)
  // Don't show placeholder if ANY tab has data
  const isDealPresent = useMemo(() => {
    // First check: if we have any deals in the raw deals array
    if (deals && Array.isArray(deals) && deals.length > 0) {
      return true
    }

    // Second check: if any tab has counts > 0
    const tabKeys = ['PENDING', 'ACTIVE', 'REJECTED', 'CLOSED', 'EXPIRED']
    if (dealsCounts && typeof dealsCounts === 'object') {
      const hasAnyData = tabKeys.some((key) => {
        const count = dealsCounts[key]
        return count && count > 0
      })
      if (hasAnyData) {
        return true
      }
    }

    // Third check: check formattedDeals (all deals regardless of status)
    if (formattedDeals && formattedDeals.length > 0) {
      return true
    }

    // Fourth check: check groupedDeals
    if (groupedDeals && groupedDeals.length > 0) {
      return true
    }

    return false
  }, [deals, dealsCounts, formattedDeals, groupedDeals])

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className='flex flex-col'>
      <PageHeader
        title='Deals Pipeline'
        description='Manage your reseller partner opportunities and track progress'
        tableDataUI={true}
        tabs={[
          {
            label: 'Deals Pipeline',
            value: 'deals-pipeline',
            count: undefined
          }
        ]}
        currentTab={mainTab}
        onTabChange={setMainTab}
        actionButtons={
          hideVendorRestrictedDealCtAs ? undefined : (
            <Button
              className='flex gap-2'
              size='sm'
              onClick={() => router.push('/deal-pipeline/resell/register')}
            >
              Request License
            </Button>
          )
        }
      />
      <div className='flex-1 overflow-hidden p-4 md:p-6'>
        <div className='my-6 grid grid-cols-2 gap-4 md:grid-cols-5'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className='flex flex-row items-center justify-between rounded-xl border p-4'
            >
              <div className='flex-col'>
                <div className='mb-2 h-4 w-20 animate-pulse rounded bg-gray-200'></div>
                <div className='h-8 w-12 animate-pulse rounded bg-gray-200'></div>
              </div>
              <div className='h-6 w-6 animate-pulse rounded bg-gray-200'></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-lg text-red-600'>{error}</div>
      </div>
    )
  }

  return (
    <div className='flex flex-col md:h-screen'>
      <PageHeader
        title='Deals Pipeline'
        description='Manage your reseller partner opportunities and track progress'
        tableDataUI={true}
        tabs={[
          {
            label: 'Deals Pipeline',
            value: 'deals-pipeline',
            count: undefined
          }
        ]}
        currentTab={mainTab}
        onTabChange={setMainTab}
        actionButtons={
          hideVendorRestrictedDealCtAs ? undefined : (
            <Button
              className='flex gap-2'
              size='sm'
              onClick={() => router.push('/deal-pipeline/resell/register')}
            >
              Request License
            </Button>
          )
        }
      />
      <div
        className='custom-scrollbar h-full overflow-y-auto'
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#d1d5db transparent'
        }}
      >
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #d1d5db;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #9ca3af;
          }
        `}</style>

        <div className='min-h-0 p-6'>
          {mainTab === 'deals-pipeline' && (
            <>
              {/* SUMMARY GRID */}
              <div className='my-6 grid grid-cols-2 gap-4 md:grid-cols-5'>
                {summary.map((item, idx) => (
                  <div
                    key={item.label}
                    className='flex flex-row items-center justify-between rounded-xl border border-[#E4E7EE] p-4 shadow-[0px_2px_6px_rgba(12,12,13,0.05)]'
                  >
                    <div className='flex-col'>
                      <div className='flex gap-1 text-sm font-medium text-[#666666]'>
                        {item.label}{' '}
                        {item.tooltipText && (
                          <div className='flex pl-1'>
                            <Tooltip>
                              <TooltipTrigger>
                                <TootipIcon />
                              </TooltipTrigger>
                              <TooltipContent
                                side='top'
                                className='max-w-[220px] whitespace-normal break-words text-center text-sm font-normal leading-snug'
                              >
                                {item.tooltipText}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                      <div className='pt-1 text-xl font-bold'>{item.value}</div>
                    </div>
                    <div className='text-gray-500'>{item.icon}</div>
                  </div>
                ))}
              </div>

              {/* FILTER BAR */}
              <div className='sticky top-0 z-30 bg-white/95 pb-4 pt-6 backdrop-blur-sm dark:bg-[#090640]/95 '>
                <div className='mb-2 flex flex-col gap-4 rounded-lg md:flex-row'>
                  <div className='relative w-full flex-1 md:w-4/6'>
                    {/* <Input
                      placeholder='Search deals by customer, stage, or deal ID'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className='pl-10'
                    />
                    <Search
                      className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
                      size={18}
                    /> */}
                  </div>
                  {isDealPresent && (
                    <div className='flex gap-2 md:w-1/6'>
                      <Select
                        value={sentReceived}
                        onValueChange={handleSentReceivedChange}
                      >
                        <SelectTrigger className='w-1/2 rounded-md md:w-full'>
                          <SelectValue placeholder='Sent/Received' />
                        </SelectTrigger>
                        <SelectContent>
                          {SENT_RECEIVED_FILTER.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* COLLABORATIVE VIEW */}
              <div className='mt-2 flex flex-col rounded-xl bg-white pb-10 dark:bg-transparent'>
                {/* TAB VIEW */}
                <div className='sticky top-0 z-30 bg-white/95 pb-4 pt-6 backdrop-blur-sm dark:bg-[#090640]/95'>
                  {isDealPresent && (
                    <div className='mb-4 flex space-x-8 border-b border-gray-200'>
                      {[
                        {
                          key: 'PENDING',
                          label: 'Waiting for approval',
                          color: 'text-gray-600'
                        },
                        {
                          key: 'ACTIVE',
                          label: 'Approved',
                          color: 'text-gray-600'
                        },
                        {
                          key: 'REJECTED',
                          label: 'Rejected',
                          color: 'text-gray-600'
                        },
                        {
                          key: 'CLOSED',
                          label: 'Closed',
                          color: 'text-gray-600'
                        },
                        {
                          key: 'EXPIRED',
                          label: 'Expired',
                          color: 'text-gray-600'
                        }
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => handleTabChange(tab.key)}
                          className={`relative flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors ${
                            activeTab === tab.key
                              ? 'font-semibold text-gray-900'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span className={`text-xs ${tab.color}`}>
                            (
                            {sentReceived === 'received'
                              ? (dealCountsByDirection.received[tab.key] ?? 0)
                              : (dealCountsByDirection.sent[tab.key] ?? 0)}
                            )
                          </span>
                          <div className='ml-1'>
                            <TootipIcon />
                          </div>
                          {activeTab === tab.key && (
                            <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900'></div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className='flex-1 overflow-hidden'>
                  <div className='custom-scrollbar h-full overflow-x-auto'>
                    {!isDealPresent ? (
                      <ResellDealNotPresentPlaceholder />
                    ) : (
                      <div className='min-w-[800px] space-y-2'>
                        {/* Company Groups Header */}
                        <div className='sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-white/10 dark:bg-transparent'>
                          <div className='flex items-center gap-4 px-6 py-3 text-sm font-semibold text-gray-600'>
                            <div className='flex flex-1 items-center gap-2'>
                              <span>Company</span>
                              <TootipIcon />
                            </div>
                            <div className='flex w-24 items-center gap-2'>
                              <span>Deals</span>
                              <TootipIcon />
                            </div>
                            <div className='flex w-32 items-center gap-2'>
                              <span>Total Size</span>
                              <TootipIcon />
                            </div>
                          </div>
                        </div>

                        {groupedDeals.map((group) => (
                          <div
                            key={group.companyName}
                            className='border-b border-gray-100 bg-white dark:border-white/10 dark:bg-transparent'
                          >
                            {/* Company Header Row */}
                            <div
                              className='flex cursor-pointer items-center gap-4 border-b border-gray-100 px-6 py-4 transition-colors hover:bg-gray-50'
                              onClick={() =>
                                toggleCompanyExpansion(group.companyName)
                              }
                            >
                              <div className='flex flex-1 items-center gap-2'>
                                {group.isExpanded ? (
                                  <ChevronDown
                                    size={20}
                                    className='text-gray-400'
                                  />
                                ) : (
                                  <ChevronRight
                                    size={20}
                                    className='text-gray-400'
                                  />
                                )}
                                <span className='font-medium text-gray-900'>
                                  {group.companyName}
                                </span>
                              </div>
                              <div className='w-24 text-sm text-gray-600'>
                                {group.dealCount}
                              </div>
                              <div className='w-32 text-sm font-medium text-gray-900'>
                                ${group.totalDealSize.toLocaleString()}
                              </div>
                            </div>

                            {/* Deal Rows - using grid to prevent column overlap */}
                            {group.isExpanded &&
                              group.deals.map((deal, idx) => (
                                <div
                                  key={`${deal.dealCode}-${idx}`}
                                  className='grid cursor-pointer grid-cols-[minmax(180px,1fr)_170px_90px_100px_100px_120px] items-center gap-4 border-b border-gray-100 px-6 py-3 transition-colors last:border-b-0 hover:bg-white dark:hover:bg-white/5'
                                  onClick={() => {
                                    const dealData = deals.find(
                                      (d) => d.dealCode === deal.dealCode
                                    )
                                    if (dealData) {
                                      localStorage.setItem(
                                        'selectedDeal',
                                        JSON.stringify(dealData)
                                      )
                                      router.push(
                                        `/deal-pipeline/resell/${dealData.dealCode || dealData.id}`
                                      )
                                    }
                                  }}
                                >
                                  {/* Deal / Customer Column */}
                                  <div className='min-w-0'>
                                    <div className='mb-1 truncate font-medium text-gray-900'>
                                      {deal.customer}
                                    </div>
                                    <div className='mb-1 text-xs text-gray-500'>
                                      ID: {deal.dealCode}
                                    </div>
                                    <div className='text-xs text-gray-400'>
                                      Last synced: {deal.lastSynced}
                                    </div>
                                  </div>

                                  {/* Deal Stage Column - fixed width to prevent overlap */}
                                  <div className='flex items-center overflow-hidden'>
                                    <span
                                      className={`inline-flex max-w-full items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                        deal.stage === 'Active'
                                          ? 'bg-green-100 text-green-800'
                                          : deal.stage === 'In Pipeline' ||
                                              deal.stage ===
                                                'Waiting for approval'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : deal.stage === 'Rejected'
                                              ? 'bg-red-100 text-red-800'
                                              : deal.stage === 'Closed'
                                                ? 'bg-gray-100 text-gray-800'
                                                : 'bg-gray-100 text-gray-800'
                                      }`}
                                      title={deal.stage}
                                    >
                                      {deal.stage}
                                    </span>
                                  </div>

                                  {/* Source Column */}
                                  <div
                                    className='truncate text-sm text-gray-600'
                                    title={deal.source}
                                  >
                                    {deal.source}
                                  </div>

                                  {/* Deal Size Column */}
                                  <div className='text-sm font-medium text-gray-900'>
                                    ${deal.dealSize.toLocaleString()}
                                  </div>

                                  {/* Updated Column */}
                                  <div className='text-sm text-gray-600'>
                                    {deal.updated}
                                  </div>

                                  {/* POC Column */}
                                  <div
                                    className='truncate text-sm text-gray-600'
                                    title={deal.pointOfContact || deal.poc}
                                  >
                                    {deal.pointOfContact || deal.poc}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {mainTab === 'insights' && (
            <div className='flex h-96 items-center justify-center text-gray-500'>
              <div className='text-center'>
                <p className='text-lg font-medium'>Insights Coming Soon</p>
                <p className='mt-2 text-sm text-gray-400'>
                  Analytics and insights for your resell deals will be available
                  here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
