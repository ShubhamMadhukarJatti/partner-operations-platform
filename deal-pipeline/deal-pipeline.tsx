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

import DealNotPresentPlaceholder from './DealNotPresentPlaceholder'

interface Deal {
  id?: number
  dealId: string
  creationTimestamp?: string
  lastUpdatedTimestamp: string
  customerAccountName: string
  website: string
  headQuarteredLocation: string
  estimatedAcv: number
  expectedClosingTime: number
  currentSolution: string
  requirements: string
  customFields: string
  dealStage: string
  source: string
  isApproved: boolean
  dealerOrgId: number
  vendorOrgId: number
  dealCode: string
  dealSize: number
  dealStatus: string
  lastActivity: string
  dealId?: string
  salesforceDealId?: string
  zohoDealId?: string
  pointOfContact?: string
  dealProtectionPeriod?: number
  isSent?: boolean
  hotspotDealId?: string
  orgName?: string
}

interface DealResponseDto {
  customerAccountName: string
  dealId: string
  dealCode: string
  website: string
  headQuarterLocation: string
  estimatedAcv: number
  expectedClosingTime: number
  currentSolution: string
  requirements: string
  customFields: Record<string, any>
  customFieldsMap: Record<string, any>
  dealStage: string
  source: string
  isApproved: boolean
  dealerOrgId: number
  vendorOrgId: number
  dealProtectionPeriod: number
  isSent: boolean
  dealStatus: string
  dealSize: number
  hotspotDealId: string
  lastUpdatedTimestamp: string
  lastActivity: string
  pointOfContact: string
  salesforceDealId: string
  zohoDealId: string
  orgName: string
}

interface ApiResponse {
  deals_counts: string[]
  receivedDeals:
    | string[]
    | {
        orgName: string
        deals: string[]
        deal_counts?: number
        totalDealSize?: number
      }[]
  sentDeals:
    | string[]
    | {
        orgName: string
        deals: string[]
        deal_counts?: number
        totalDealSize?: number
      }[]
}

interface FormattedDeal {
  dealId: string
  dealCode: string
  customer: string
  poc: string
  stage: string
  source: string
  dealSize: number
  updated: string
  lastSynced: string
  dealerOrgId: number
  dealStatus: string
  lastActivity: string
  pointOfContact: string
}

interface CompanyGroup {
  companyName: string
  dealCount: number
  totalDealSize: number
  deals: FormattedDeal[]
  isExpanded: boolean
}

const STAGE_COLORS: Record<string, string> = {
  Approved: 'bg-green-100 text-green-700',
  'Waiting for approval': 'bg-yellow-100 text-yellow-700',
  Rejected: 'bg-gray-100 text-gray-700',
  Closed: 'bg-[#D1D7FA] text-[#040e78]',
  Expired: 'bg-gray-100 text-gray-700'
}

const DEAL_STATUSES = [
  { label: 'Active', value: 'ACTIVE', color: 'text-green-500' },
  { label: 'Closed', value: 'CLOSED', color: 'text-gray-600' },
  { label: 'Expired', value: 'EXPIRED', color: 'text-orange-600' },
  { label: 'Draft', value: 'DRAFT', color: 'text-blue-600' }
]

const DEAL_STAGES = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Expired', value: 'EXPIRED' }
]

const SENT_RECEIVED_FILTER = [
  { label: 'Sent', value: 'sent' },
  { label: 'Received', value: 'received' }
]

const EMPTY_STATUS_COUNTS: Record<string, number> = {
  ALL: 0,
  PENDING: 0,
  ACTIVE: 0,
  REJECTED: 0,
  CLOSED: 0,
  EXPIRED: 0
}

// Dummy POC names for deals
const POC_NAMES = ['Sahil Sharma', 'Rohit Sharma']

// Parser function to convert string representation to DealResponseDto object
function parseDealString(dealString: string): DealResponseDto {
  // Remove the "DealResponseDto(" prefix and ")" suffix
  const cleanString = dealString
    .replace(/^DealResponseDto\(/, '')
    .replace(/\)$/, '')

  // Split by comma, but be careful with commas inside quoted values
  const parts = []
  let currentPart = ''
  let inQuotes = false
  let quoteChar = ''

  for (let i = 0; i < cleanString.length; i++) {
    const char = cleanString[i]

    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true
      quoteChar = char
      currentPart += char
    } else if (char === quoteChar && inQuotes) {
      inQuotes = false
      quoteChar = ''
      currentPart += char
    } else if (char === ',' && !inQuotes) {
      parts.push(currentPart.trim())
      currentPart = ''
    } else {
      currentPart += char
    }
  }

  if (currentPart.trim()) {
    parts.push(currentPart.trim())
  }

  // Parse each key-value pair
  const deal: any = {}

  for (const part of parts) {
    const equalIndex = part.indexOf('=')
    if (equalIndex === -1) continue

    const key = part.substring(0, equalIndex).trim()
    let value = part.substring(equalIndex + 1).trim()

    // Remove quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    // Convert numeric values
    if (
      [
        'estimatedAcv',
        'expectedClosingTime',
        'dealerOrgId',
        'vendorOrgId',
        'dealProtectionPeriod',
        'dealSize'
      ].includes(key)
    ) {
      // Handle dealSize specifically - it might come as 'string' or actual number
      if (key === 'dealSize') {
        if (value === 'string' || value === '') {
          deal[key] = 0
        } else {
          deal[key] = Number(value) || 0
        }
      } else {
        deal[key] = value === '' ? 0 : Number(value)
      }
    } else if (['isApproved', 'isSent'].includes(key)) {
      deal[key] = value === 'true'
    } else if (key === 'customFields' || key === 'customFieldsMap') {
      try {
        deal[key] = value === '' ? {} : JSON.parse(value)
      } catch {
        deal[key] = {}
      }
    } else {
      deal[key] = value
    }
  }

  return deal as DealResponseDto
}

// Convert DealResponseDto to Deal interface
function convertToDeal(dealDto: DealResponseDto): Deal {
  return {
    dealId: dealDto.dealId,
    lastUpdatedTimestamp: dealDto.lastUpdatedTimestamp,
    customerAccountName: dealDto.customerAccountName,
    website: dealDto.website,
    headQuarteredLocation: dealDto.headQuarterLocation,
    estimatedAcv: dealDto.estimatedAcv,
    expectedClosingTime: dealDto.expectedClosingTime,
    currentSolution: dealDto.currentSolution,
    requirements: dealDto.requirements,
    customFields: JSON.stringify(dealDto.customFields),
    dealStage: dealDto.dealStage,
    source: dealDto.source,
    isApproved: dealDto.isApproved,
    dealerOrgId: dealDto.dealerOrgId,
    vendorOrgId: dealDto.vendorOrgId,
    dealCode: dealDto.dealCode,
    dealSize: dealDto.dealSize,
    dealStatus: dealDto.dealStatus,
    lastActivity: dealDto.lastActivity,
    salesforceDealId: dealDto.salesforceDealId,
    zohoDealId: dealDto.zohoDealId,
    pointOfContact: dealDto.pointOfContact,
    dealProtectionPeriod: dealDto.dealProtectionPeriod,
    isSent: dealDto.isSent,
    hotspotDealId: dealDto.hotspotDealId,
    orgName: dealDto.orgName
  }
}

function getDealStatusColor(source: string) {
  const sourceConfig = DEAL_STATUSES.find(
    (s) => s.value === source.toUpperCase()
  )
  return sourceConfig?.color
}

// Convert deal stage from backend format to display format
function formatDealStage(stage: string): string {
  const stageMap: Record<string, string> = {
    WAITING_FOR_APPROVAL: 'Waiting for approval',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    CLOSED: 'Closed',
    EXPIRED: 'Expired'
  }
  return stageMap[stage] || stage
}

// Convert source from backend format to display format
function formatSource(source: string): string {
  const sourceMap: Record<string, string> = {
    PORTAL: 'Portal',
    SLACK: 'Slack',
    EMAIL: 'Email',
    CRM: 'CRM'
  }
  return sourceMap[source] || source
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Calculate days since last update
function getDaysSinceUpdate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays === 1) return '1 day'
  if (diffDays < 7) return `${diffDays} days`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`
  return `${Math.floor(diffDays / 30)} months`
}

export default function DealPipeline() {
  const router = useRouter()
  const { hideVendorRestrictedDealCtAs } = useSidebarView()
  const SENT_RECEIVED_STORAGE_KEY = 'deal-sent-received'
  const SENT_RECEIVED_MANUAL_KEY = 'deal-sent-received-manual'

  // Get Redux state at the top level
  const currentOrgState = useSelector((state: RootState) => state.currentOrg)
  const organization = currentOrgState?.organization
  const currentOrgId = organization?.id

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('PENDING')
  const [sentReceived, setSentReceived] = useState(() => {
    if (typeof window === 'undefined') return 'sent'
    return localStorage.getItem(SENT_RECEIVED_STORAGE_KEY) || 'sent'
  })
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasRedirected, setHasRedirected] = useState(false)
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
  const [hasUserManuallySelected, setHasUserManuallySelected] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(SENT_RECEIVED_MANUAL_KEY) === 'true'
  })

  const handleSentReceivedChange = (value: string) => {
    console.log('handleSentReceivedChange', value)
    setSentReceived(value)
    setHasUserManuallySelected(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem(SENT_RECEIVED_STORAGE_KEY, value)
      localStorage.setItem(SENT_RECEIVED_MANUAL_KEY, 'true')
    }
  }

  // Fetch deals data
  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Fetching deals with status:', status)
      if (status === 'CLOSED') {
        setDeals([])
        setOrganizationGroups([])
        setLoading(false)
        return
      }
      const response = await fetch(`/api/my-deals?status=${status}`)
      if (!response.ok) {
        throw new Error('Failed to fetch deals')
      }
      const data: ApiResponse = await response.json()
      console.log('fetchDeals', data)

      console.log(fetchDeals, 'fetchdEals')

      // Parse all deals from sentDeals and receivedDeals
      const allDeals: Deal[] = []
      const organizationGroups: Array<{
        orgName: string
        deals: Deal[]
        dealCount: number
        totalDealSize: number
      }> = []

      // Process sent deals
      if (data.sentDeals && data.sentDeals.length > 0) {
        // Check if sentDeals is an array of strings or an array of objects with deals property
        if (typeof data.sentDeals[0] === 'string') {
          // Direct array of deal strings
          const sentDealsArray = data.sentDeals as string[]
          for (const dealString of sentDealsArray) {
            try {
              const dealDto = parseDealString(dealString)
              const deal = convertToDeal(dealDto)
              allDeals.push(deal)
            } catch (error) {
              console.error('Error parsing sent deal:', error, dealString)
            }
          }
        } else {
          // Array of objects with deals property (grouped by organization)
          const sentDealsArray = data.sentDeals as {
            orgName: string
            deals: string[]
            deal_counts?: number
            totalDealSize?: number
          }[]
          for (const sentDealGroup of sentDealsArray) {
            const orgDeals: Deal[] = []
            if (sentDealGroup.deals && Array.isArray(sentDealGroup.deals)) {
              for (const dealString of sentDealGroup.deals) {
                try {
                  const dealDto = parseDealString(dealString)
                  const deal = convertToDeal(dealDto)
                  orgDeals.push(deal)
                  allDeals.push(deal)
                } catch (error) {
                  console.error('Error parsing sent deal:', error, dealString)
                }
              }
            }

            // Store organization group data
            organizationGroups.push({
              orgName: sentDealGroup.orgName,
              deals: orgDeals,
              dealCount: sentDealGroup.deal_counts || orgDeals.length,
              totalDealSize:
                sentDealGroup.totalDealSize ||
                orgDeals.reduce((sum, deal) => sum + deal.dealSize, 0)
            })
          }
        }
      }

      // Process received deals (if any)
      if (data.receivedDeals && data.receivedDeals.length > 0) {
        // Check if receivedDeals is an array of strings or an array of objects with deals property
        if (typeof data.receivedDeals[0] === 'string') {
          // Direct array of deal strings
          const receivedDealsArray = data.receivedDeals as string[]
          for (const dealString of receivedDealsArray) {
            try {
              const dealDto = parseDealString(dealString)
              const deal = convertToDeal(dealDto)
              allDeals.push(deal)
            } catch (error) {
              console.error('Error parsing received deal:', error, dealString)
            }
          }
        } else {
          // Array of objects with deals property (grouped by organization)
          const receivedDealsArray = data.receivedDeals as {
            orgName: string
            deals: string[]
            deal_counts?: number
            totalDealSize?: number
          }[]
          for (const receivedDealGroup of receivedDealsArray) {
            const orgDeals: Deal[] = []
            if (
              receivedDealGroup.deals &&
              Array.isArray(receivedDealGroup.deals)
            ) {
              for (const dealString of receivedDealGroup.deals) {
                try {
                  const dealDto = parseDealString(dealString)
                  const deal = convertToDeal(dealDto)
                  orgDeals.push(deal)
                  allDeals.push(deal)
                } catch (error) {
                  console.error(
                    'Error parsing received deal:',
                    error,
                    dealString
                  )
                }
              }
            }

            // Store organization group data for received deals
            if (orgDeals.length > 0) {
              organizationGroups.push({
                orgName: receivedDealGroup.orgName,
                deals: orgDeals,
                dealCount: receivedDealGroup.deal_counts || orgDeals.length,
                totalDealSize:
                  receivedDealGroup.totalDealSize ||
                  orgDeals.reduce((sum, deal) => sum + deal.dealSize, 0)
              })
            }
          }
        }
      }

      // Merge organization groups with the same name
      const mergedGroups: Record<
        string,
        {
          orgName: string
          deals: Deal[]
          dealCount: number
          totalDealSize: number
        }
      > = {}

      for (const group of organizationGroups) {
        if (mergedGroups[group.orgName]) {
          // Merge with existing group
          mergedGroups[group.orgName].deals.push(...group.deals)
          mergedGroups[group.orgName].dealCount += group.dealCount
          mergedGroups[group.orgName].totalDealSize += group.totalDealSize
        } else {
          // Create new group
          mergedGroups[group.orgName] = { ...group }
        }
      }

      const finalOrganizationGroups = Object.values(mergedGroups)

      setDeals(allDeals)
      setOrganizationGroups(finalOrganizationGroups)
    } catch (error) {
      console.error('Error fetching deals:', error)
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

  // Fetch all deal counts initially
  const fetchAllDealCounts = useCallback(async () => {
    try {
      const statuses = ['PENDING', 'ACTIVE', 'REJECTED', 'EXPIRED']

      const countDeals = (
        dealCollection: ApiResponse['sentDeals'] | ApiResponse['receivedDeals']
      ) => {
        if (!dealCollection || dealCollection.length === 0) return 0

        if (typeof dealCollection[0] === 'string') {
          return (dealCollection as string[]).length
        }

        return (
          dealCollection as {
            orgName: string
            deals: string[]
            deal_counts?: number
            totalDealSize?: number
          }[]
        ).reduce((sum, group) => {
          if (typeof group.deal_counts === 'number')
            return sum + group.deal_counts
          return sum + (Array.isArray(group.deals) ? group.deals.length : 0)
        }, 0)
      }

      const results = await Promise.all(
        statuses.map(async (statusKey) => {
          const response = await fetch(`/api/my-deals?status=${statusKey}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch ${statusKey} deal counts`)
          }
          const data: ApiResponse = await response.json()
          return {
            statusKey,
            sentCount: countDeals(data.sentDeals),
            receivedCount: countDeals(data.receivedDeals)
          }
        })
      )

      const overallCounts: Record<string, number> = {
        ALL: 0,
        PENDING: 0,
        ACTIVE: 0,
        REJECTED: 0,
        CLOSED: 0,
        EXPIRED: 0
      }
      const sentCounts: Record<string, number> = {
        ALL: 0,
        PENDING: 0,
        ACTIVE: 0,
        REJECTED: 0,
        CLOSED: 0,
        EXPIRED: 0
      }
      const receivedCounts: Record<string, number> = {
        ALL: 0,
        PENDING: 0,
        ACTIVE: 0,
        REJECTED: 0,
        CLOSED: 0,
        EXPIRED: 0
      }

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
  // If received deals exist in the tab, prefer "received" as default view.
  useEffect(() => {
    if (hasUserManuallySelected) return
    if (!currentOrgId || !Array.isArray(deals) || deals.length === 0) return

    const receivedDealsCount = deals.filter(
      (deal) => deal.dealerOrgId !== currentOrgId
    ).length
    const sentDealsCount = deals.filter(
      (deal) => deal.dealerOrgId === currentOrgId
    ).length

    if (receivedDealsCount > 0) {
      setSentReceived('received')
      return
    }

    if (sentDealsCount > 0) {
      setSentReceived('sent')
    }
  }, [deals, currentOrgId, hasUserManuallySelected])

  // Transform deals data for display
  const formattedDeals: FormattedDeal[] = useMemo(() => {
    if (!deals || !Array.isArray(deals)) {
      return []
    }
    return deals.map((deal, index) => ({
      dealId: deal.dealId || '',
      dealCode: deal.dealCode || 'XXXXXX',
      customer: deal.customerAccountName || 'Unknown',
      poc: POC_NAMES[index % POC_NAMES.length],
      stage: formatDealStage(deal.dealStage),
      source: formatSource(deal.source),
      dealerOrgId: deal.dealerOrgId,
      dealSize: deal.dealSize || 0,
      updated: formatDate(deal.lastUpdatedTimestamp),
      lastSynced: getDaysSinceUpdate(deal.lastUpdatedTimestamp),
      dealStatus: deal.dealStatus,
      lastActivity: deal.lastActivity || '',
      pointOfContact: deal.pointOfContact || ''
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
    const overallCounts = dealsCounts
    const totalDeals = overallCounts.ALL ?? 0
    const active = overallCounts.ACTIVE ?? 0
    const pending = overallCounts.PENDING ?? 0
    const rejected = overallCounts.REJECTED ?? 0
    const expired = overallCounts.EXPIRED ?? 0

    return [
      {
        label: 'Total Deals',
        value: totalDeals,
        icon: <Handshake size={24} />
      },
      {
        label: 'Pending',
        value: pending,
        icon: <Save size={24} />,
        tooltipText: 'Deals that are pending approval'
      },
      { label: 'Active', value: active, icon: <Activity size={24} /> },
      { label: 'Rejected', value: rejected, icon: <FolderClosed size={24} /> },
      {
        label: 'Expired',
        value: expired,
        icon: <AlertTriangle size={24} />,
        tooltipText: 'Deals expired due to overdue deal protection period'
      }
    ]
  }, [dealsCounts])

  const filteredDeals = useMemo(() => {
    if (!currentOrgId || !formattedDeals || !Array.isArray(formattedDeals)) {
      return []
    }
    return formattedDeals.filter((deal) => {
      const matchesSearch =
        search === '' ||
        deal.customer.toLowerCase().includes(search.toLowerCase()) ||
        deal.stage.toLowerCase().includes(search.toLowerCase()) ||
        deal.dealCode.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = deal.dealStatus === status
      const matchesSentReceived =
        (sentReceived === 'sent' && deal.dealerOrgId === currentOrgId) ||
        (sentReceived === 'received' && deal.dealerOrgId !== currentOrgId)
      return matchesSearch && matchesStatus && matchesSentReceived
    })
  }, [formattedDeals, search, status, sentReceived, currentOrgId])

  // Group deals by company for collaborative view
  const groupedDeals: CompanyGroup[] = useMemo(() => {
    // Return empty array if dependencies are not available
    if (!currentOrgId || !Array.isArray(filteredDeals)) {
      return []
    }

    // If we have organization groups from API, use them
    if (Array.isArray(organizationGroups) && organizationGroups.length > 0) {
      return organizationGroups
        .map((orgGroup) => {
          // Filter deals based on current filters
          const filteredOrgDeals = orgGroup.deals
            .map((deal, index) => ({
              dealId: deal.dealId,
              dealCode: deal.dealCode || 'XXXXXX',
              customer: deal.customerAccountName,
              poc: POC_NAMES[index % POC_NAMES.length],
              stage: formatDealStage(deal.dealStage),
              source: formatSource(deal.source),
              dealerOrgId: deal.dealerOrgId,
              dealSize: deal.dealSize || 0,
              updated: formatDate(deal.lastUpdatedTimestamp),
              lastSynced: getDaysSinceUpdate(deal.lastUpdatedTimestamp),
              dealStatus: deal.dealStatus,
              lastActivity: deal.lastActivity,
              pointOfContact: deal.pointOfContact || ''
            }))
            .filter((deal) => {
              const matchesSearch =
                search === '' ||
                deal.customer.toLowerCase().includes(search.toLowerCase()) ||
                deal.stage.toLowerCase().includes(search.toLowerCase()) ||
                deal.dealCode.toLowerCase().includes(search.toLowerCase())
              const matchesStatus = deal.dealStatus === status
              const matchesSentReceived =
                (sentReceived === 'sent' &&
                  deal.dealerOrgId === currentOrgId) ||
                (sentReceived === 'received' &&
                  deal.dealerOrgId !== currentOrgId)
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
        .filter((group) => group.dealCount > 0) // Only show groups with deals after filtering
    }

    // Fallback to grouping by customer name
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
    sentReceived,
    currentOrgId
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
    if (
      formattedDeals &&
      Array.isArray(formattedDeals) &&
      formattedDeals.length > 0
    ) {
      return true
    }

    // No data found in any tab
    return false
  }, [deals, dealsCounts, formattedDeals])

  // Add error recovery - redirect to start page on critical errors
  useEffect(() => {
    const handleError = () => {
      if (!hasRedirected) {
        console.error('Critical error detected, redirecting to start page')
        setHasRedirected(true)
        router.replace('/deal-pipeline/start')
      }
    }

    // Listen for error recovery events
    if (typeof window !== 'undefined') {
      window.addEventListener('error-recovery', handleError)
      return () => window.removeEventListener('error-recovery', handleError)
    }
  }, [hasRedirected, router])

  console.log(groupedDeals, 'groupedDeals')

  if (loading) {
    return (
      <div className='flex flex-col'>
        <PageHeader
          title='Deal Pipeline'
          description='Manage your partner opportunities and track progress'
          tableDataUI={true}
          actionButtons={
            hideVendorRestrictedDealCtAs ? undefined : (
              <Button
                className='flex gap-2'
                size='sm'
                onClick={() => router.push('/deal-pipeline/register')}
              >
                <Plus size={16} /> Register New Deal
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
        title='Deal Pipeline'
        description='Manage your partner opportunities and track progress'
        tableDataUI={true}
        actionButtons={
          hideVendorRestrictedDealCtAs ? undefined : (
            <Button
              className='flex gap-2'
              size='sm'
              onClick={() => router.push('/deal-pipeline/register')}
            >
              <Plus size={16} /> Register New Deal
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
          {/* SUMMARY GRID (this will scroll away) */}
          <div className='my-6 grid grid-cols-2 gap-4 md:grid-cols-5'>
            {summary.map((item, idx) => (
              <div
                key={item.label}
                className='flex flex-row items-center justify-between rounded-xl border p-4'
              >
                <div className='flex-col'>
                  <div className='flex gap-1 text-sm font-semibold text-gray-700'>
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
                  <div className='text-xl font-bold md:text-2xl'>
                    {item.value}
                  </div>
                </div>
                <div className='text-gray-500'>{item.icon}</div>
              </div>
            ))}
          </div>

          {/* FILTER BAR — sticky to the top of this scroll container */}
          <div className='sticky top-0 z-30 bg-white/95 pb-4 pt-6 backdrop-blur-sm dark:bg-[#090640]/95 '>
            <div className='mb-2 flex flex-col gap-4 rounded-lg md:flex-row'>
              <div className='relative w-full flex-1 md:w-4/6'>
                {/* <Input
                  placeholder='Search deals by customer, stage, or deal ID'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='pl-10'
                /> */}
                {/* <Search
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
                  size={18}
                /> */}
              </div>
              {isDealPresent && (
                <div className='flex gap-2 md:w-1/6'>
                  {/* <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className='w-1/2 rounded-md md:w-full'>
                      <Filter size={15} />
                      <SelectValue placeholder='Pending' />
                    </SelectTrigger>
                    <SelectContent>
                      {DEAL_STAGES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
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
            {/* <div className='flex flex-shrink-0 items-center gap-2 px-4 pb-2 pt-6 text-sm font-semibold text-text-80 md:px-6'>
              <span className='mr-2'>
                Registered Deals ({filteredDeals.length})
              </span>
            </div> */}
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
                    { key: 'CLOSED', label: 'Closed', color: 'text-gray-600' },
                    { key: 'EXPIRED', label: 'Expired', color: 'text-gray-600' }
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
              <div className='custom-scrollbar h-full'>
                {!isDealPresent ? (
                  <DealNotPresentPlaceholder />
                ) : (
                  <div className='space-y-2'>
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

                    {/* Company Groups */}
                    {groupedDeals.map((group) => (
                      <div
                        key={group.companyName}
                        className='border-b border-gray-100'
                      >
                        {/* Company Header */}
                        <div
                          className='flex cursor-pointer items-center gap-4 px-6 py-3 transition-colors hover:bg-gray-50'
                          onClick={() =>
                            toggleCompanyExpansion(group.companyName)
                          }
                        >
                          <div className='flex flex-1 items-center gap-3'>
                            {group.isExpanded ? (
                              <ChevronDown className='h-4 w-4 text-gray-500' />
                            ) : (
                              <ChevronRight className='h-4 w-4 text-gray-500' />
                            )}
                            <span className='font-semibold text-gray-900'>
                              {group.companyName}
                            </span>
                          </div>
                          <div className='flex w-24 items-center text-gray-600'>
                            {group.dealCount}
                          </div>
                          <div className='flex w-32 items-center text-gray-600'>
                            ${group.totalDealSize.toLocaleString()}
                          </div>
                        </div>

                        {/* Individual Deals */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            group.isExpanded
                              ? 'max-h-[1000px] opacity-100'
                              : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className='border-t border-gray-200 bg-gray-50'>
                            {/* Deal Headers */}
                            <div className='flex items-center gap-4 border-b border-gray-200 px-6 py-2 text-xs font-semibold text-gray-600'>
                              <div className='flex flex-1 items-center gap-2'>
                                <span>Deal / Customer</span>
                                <TootipIcon />
                              </div>
                              <div className='flex w-40 items-center gap-2'>
                                <span>Stage</span>
                                <TootipIcon />
                              </div>
                              <div className='flex w-20 items-center gap-2'>
                                <span>Source</span>
                                <TootipIcon />
                              </div>
                              <div className='flex w-24 items-center gap-2'>
                                <span>Size</span>
                                <TootipIcon />
                              </div>
                              <div className='flex w-20 items-center gap-2'>
                                <span>Updated</span>
                                <TootipIcon />
                              </div>
                              <div className='flex w-24 items-center gap-2'>
                                <span>POC</span>
                                <TootipIcon />
                              </div>
                            </div>

                            {/* Deal Rows */}
                            {group.deals.map((deal, idx) => (
                              <div
                                key={`${deal.dealCode}-${idx}`}
                                className='flex cursor-pointer items-center gap-4 border-b border-gray-100 px-6 py-3 transition-colors last:border-b-0 hover:bg-white dark:hover:bg-white/5'
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
                                      `/deal-pipeline/${dealData.dealCode || dealData.id}`
                                    )
                                  }
                                }}
                              >
                                {/* Deal / Customer Column */}
                                <div className='flex min-w-0 flex-1 flex-col'>
                                  <div className='truncate font-semibold text-gray-900'>
                                    {deal.customer}
                                  </div>
                                  <div className='text-xs text-gray-600'>
                                    {deal.dealCode}
                                  </div>
                                  <div className='flex items-center gap-1 text-xs text-orange-500'>
                                    <Image
                                      src='/hubspot-icon.svg'
                                      alt='sync'
                                      width={10}
                                      height={10}
                                    />
                                    {deal.lastActivity}
                                  </div>
                                </div>

                                {/* Deal Stage Column */}
                                <div className='flex w-40 flex-col items-start'>
                                  {/* <div className='mb-1 text-xs text-gray-400'>
                                    Under...
                                  </div> */}
                                  <span
                                    className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold ${STAGE_COLORS[deal.stage] || 'bg-yellow-100 text-yellow-700'}`}
                                  >
                                    {deal.stage}
                                  </span>
                                </div>

                                {/* Source Column */}
                                <div className='flex w-20 items-center'>
                                  <span
                                    className={`text-xs font-medium ${
                                      deal.source === 'Portal'
                                        ? 'text-blue-500'
                                        : deal.source === 'Slack'
                                          ? 'text-purple-500'
                                          : 'text-gray-500'
                                    }`}
                                  >
                                    {deal.source}
                                  </span>
                                </div>

                                {/* Deal Size Column */}
                                <div className='flex w-24 items-center'>
                                  <span className='text-sm font-bold text-gray-900'>
                                    {deal.dealSize === 0
                                      ? '--'
                                      : `$${deal.dealSize.toLocaleString()}`}
                                  </span>
                                </div>

                                {/* Updated Column */}
                                <div className='flex w-20 items-center'>
                                  <span className='text-xs text-gray-600'>
                                    {deal.updated}
                                  </span>
                                </div>

                                {/* POC Column */}
                                <div className='flex w-24 items-center'>
                                  <span className='truncate text-xs text-gray-600'>
                                    {deal.pointOfContact || '--'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
