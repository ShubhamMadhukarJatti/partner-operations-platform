'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { IconBolt, IconPlus } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { showCustomToast } from '@/components/custom-toast'

import AddDealDetailsModal from './AddDealDetailsModal'
import LinkGenerationModal from './LinkGenerationModal'

/** Deal shape from internal/sent/deals and internal/received/deals */
interface InternalDeal {
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
  [key: string]: unknown
}

const INTEGRATION_TYPES = [
  { value: 'HUBSPOT', label: 'HubSpot' },
  { value: 'SALESFORCE', label: 'Salesforce' },
  { value: 'PIPEDRIVE', label: 'Pipedrive' },
  { value: 'ZOHO', label: 'Zoho' }
] as const

// Mock deals data for dummy flow (no API calls)
const DEALS_DATA: any[] = [
  {
    id: 1,
    deal: {
      title: 'Enterprise Partnership Deal',
      companyId: 'TechCorp Solutions Inc.',
      lastSynced: '2024-01-20T14:30:00Z'
    },
    dealStage: 'Discovery',
    dealSize: 50000,
    status: 'ACTIVE',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 2,
    deal: {
      title: 'Integration Services Contract',
      companyId: 'TechCorp Solutions Inc.',
      lastSynced: '2024-01-18T11:15:00Z'
    },
    dealStage: 'Qualification',
    dealSize: 25000,
    status: 'ACTIVE',
    updatedAt: '2024-01-18T11:15:00Z'
  },
  {
    id: 3,
    deal: {
      title: 'API Partnership Agreement',
      companyId: 'TechCorp Solutions Inc.',
      lastSynced: '2024-01-19T13:45:00Z'
    },
    dealStage: 'Proposal',
    dealSize: 75000,
    status: 'ACTIVE',
    updatedAt: '2024-01-19T13:45:00Z'
  }
]

const getDealStageTag = (stage: string) => {
  const baseClasses = 'px-2 py-0.5 border rounded-[20px] text-xs font-medium'

  switch (stage) {
    case 'Discovery':
      return (
        <span
          className={`${baseClasses}`}
          style={{
            backgroundColor: '#E8F4FD',
            borderColor: '#B3D9F2',
            color: '#1E40AF'
          }}
        >
          {stage}
        </span>
      )
    case 'Qualification':
      return (
        <span
          className={`${baseClasses}`}
          style={{
            backgroundColor: '#FEF3C7',
            borderColor: '#F3EEA9',
            color: '#92400E'
          }}
        >
          {stage}
        </span>
      )
    case 'Proposal':
      return (
        <span
          className={`${baseClasses}`}
          style={{
            backgroundColor: '#FAF7D1',
            borderColor: '#F3EEA9',
            color: '#854D0E'
          }}
        >
          {stage}
        </span>
      )
    case 'Negotiation':
      return (
        <span
          className={`${baseClasses}`}
          style={{
            backgroundColor: '#FEE2E2',
            borderColor: '#FECACA',
            color: '#DC2626'
          }}
        >
          {stage}
        </span>
      )
    case 'Closed Won':
      return (
        <span
          className={`${baseClasses}`}
          style={{
            backgroundColor: '#D1FAE5',
            borderColor: '#A7F3D0',
            color: '#065F46'
          }}
        >
          {stage}
        </span>
      )
    default:
      return (
        <span
          className={`${baseClasses}`}
          style={{
            backgroundColor: '#F3F4F6',
            borderColor: '#D1D5DB',
            color: '#374151'
          }}
        >
          {stage}
        </span>
      )
  }
}

const getStatusTag = (status: string) => {
  const baseClasses = 'px-2 py-0.5 border rounded-[20px] text-xs font-medium'

  switch (status) {
    case 'Active':
      return (
        <span
          className={`${baseClasses}`}
          style={{
            backgroundColor: '#D1FAE5',
            borderColor: '#A7F3D0',
            color: '#065F46'
          }}
        >
          {status}
        </span>
      )
    case 'Completed':
      return (
        <span
          className={`${baseClasses}`}
          style={{
            backgroundColor: '#E0E7FF',
            borderColor: '#C7D2FE',
            color: '#3730A3'
          }}
        >
          {status}
        </span>
      )
    case 'On Hold':
      return (
        <span
          className={`${baseClasses}`}
          style={{
            backgroundColor: '#FEF3C7',
            borderColor: '#F3EEA9',
            color: '#92400E'
          }}
        >
          {status}
        </span>
      )
    default:
      return (
        <span
          className={`${baseClasses}`}
          style={{
            backgroundColor: '#F3F4F6',
            borderColor: '#D1D5DB',
            color: '#374151'
          }}
        >
          {status}
        </span>
      )
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

interface DealsTableProps {
  inDummyFlow?: boolean
  /** When provided, auto-fills and disables Partner Name in AddDealDetailsModal (e.g. from PartnerHeader). */
  initialPartnerName?: string | null
  /** When provided, used for externalPartnerCode in AddDealDetailsModal (e.g. PartnerHeader data.email). */
  initialPartnerEmail?: string | null
  /** When provided, skips the code-from-email lookup and uses this directly. */
  initialPartnerCode?: string | null
}

/** Fetch partner code from email */
const fetchPartnerCode = async (email: string): Promise<string> => {
  const res = await fetch(
    `/api/offline-partner/code?email=${encodeURIComponent(email.trim())}`
  )
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data?.data) {
    throw new Error(data?.message ?? 'Failed to get partner code for deals')
  }
  return String(data.data)
}

/** Fetch sent and received deals for a partner code */
const fetchDeals = async (
  code: string
): Promise<{ sent: InternalDeal[]; received: InternalDeal[] }> => {
  const [sentRes, receivedRes] = await Promise.all([
    fetch(
      `/api/my-deals/internal/sent/deals?externalPartnerCode=${encodeURIComponent(code)}&page=0&size=50`,
      { credentials: 'include' }
    ),
    fetch(
      `/api/my-deals/internal/received/deals?externalPartnerCode=${encodeURIComponent(code)}&page=0&size=50`,
      { credentials: 'include' }
    )
  ])
  const sentJson = await sentRes.json().catch(() => ({}))
  const receivedJson = await receivedRes.json().catch(() => ({}))
  return {
    sent: Array.isArray(sentJson?.content) ? sentJson.content : [],
    received: Array.isArray(receivedJson?.content) ? receivedJson.content : []
  }
}

const DealsTable: React.FC<DealsTableProps> = ({
  inDummyFlow = false,
  initialPartnerName,
  initialPartnerEmail,
  initialPartnerCode
}) => {
  const queryClient = useQueryClient()

  const handleDummyAction = () => {
    showCustomToast(
      'Info',
      'No edit access for this dummy account',
      'info',
      5000
    )
  }
  const [selectedDeals, setSelectedDeals] = useState<string[]>([])
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent')
  const [approveModalDealId, setApproveModalDealId] = useState<string | null>(
    null
  )
  const [approvalIntegrationType, setApprovalIntegrationType] =
    useState<string>('HUBSPOT')
  const [approvalDealProtectionPeriod, setApprovalDealProtectionPeriod] =
    useState('90')

  // Step 1: Resolve partner code (skip fetch if initialPartnerCode is provided)
  const needsCodeLookup =
    !inDummyFlow && !initialPartnerCode && !!initialPartnerEmail?.trim()

  const { data: fetchedPartnerCode } = useQuery({
    queryKey: ['partner-code', initialPartnerEmail],
    queryFn: () => fetchPartnerCode(initialPartnerEmail!),
    enabled: needsCodeLookup,
    staleTime: 1000 * 60 * 10,
    retry: 2
  })

  const partnerCode = initialPartnerCode || fetchedPartnerCode || ''

  // Step 2: Fetch sent + received deals using the partner code
  const {
    data: dealsData,
    isLoading: dealsLoading,
    refetch: refetchDeals
  } = useQuery({
    queryKey: ['partner-deals', partnerCode],
    queryFn: () => fetchDeals(partnerCode),
    enabled: !inDummyFlow && !!partnerCode,
    staleTime: 1000 * 60 * 5,
    retry: 2
  })

  const sentDeals = dealsData?.sent ?? []
  const receivedDeals = dealsData?.received ?? []

  // Step 3: Approve deal mutation
  const approveMutation = useMutation({
    mutationFn: async ({
      dealId,
      period,
      integrationType
    }: {
      dealId: string
      period: number
      integrationType: string
    }) => {
      const res = await fetch(
        `/api/my-deals/internal/partner/portal/approve/${encodeURIComponent(dealId)}?isApproved=true&dealProtectionPeriod=${period}&integrationType=${encodeURIComponent(integrationType)}`,
        { method: 'PATCH', credentials: 'include' }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.message ?? 'Failed to approve deal')
      }
      return data
    },
    onSuccess: (data) => {
      showCustomToast(
        'Success',
        data?.message ?? 'Deal approved successfully.',
        'success',
        5000
      )
      setApproveModalDealId(null)
      queryClient.invalidateQueries({
        queryKey: ['partner-deals', partnerCode]
      })
    },
    onError: (err) => {
      showCustomToast(
        'Error',
        err instanceof Error ? err.message : 'Failed to approve deal',
        'error',
        5000
      )
    }
  })

  const handleDealSelect = (dealId: string) => {
    setSelectedDeals((prev) =>
      prev.includes(dealId)
        ? prev.filter((id) => id !== dealId)
        : [...prev, dealId]
    )
  }

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedDeals([])
      setIsAllSelected(false)
    } else {
      setSelectedDeals(DEALS_DATA.map((deal) => deal.id))
      setIsAllSelected(true)
    }
  }

  React.useEffect(() => {
    if (inDummyFlow) {
      setIsAllSelected(
        selectedDeals.length === DEALS_DATA.length && DEALS_DATA.length > 0
      )
    }
  }, [selectedDeals, inDummyFlow])

  const openApprovalModal = (dealId: string) => {
    setApproveModalDealId(dealId)
    setApprovalIntegrationType('HUBSPOT')
    setApprovalDealProtectionPeriod('90')
  }

  const closeApprovalModal = () => {
    if (!approveMutation.isPending) {
      setApproveModalDealId(null)
    }
  }

  const handleApproveDeal = () => {
    if (!approveModalDealId) return
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
    approveMutation.mutate({
      dealId: approveModalDealId,
      period,
      integrationType: approvalIntegrationType
    })
  }

  const handleDealCreated = () => {
    queryClient.invalidateQueries({
      queryKey: ['partner-deals', partnerCode]
    })
  }

  const hasRealDeals =
    !inDummyFlow &&
    !!partnerCode &&
    !dealsLoading &&
    (sentDeals.length > 0 || receivedDeals.length > 0)
  const showEmptyState = inDummyFlow
    ? DEALS_DATA.length === 0
    : !partnerCode && !initialPartnerEmail?.trim()
      ? true
      : !dealsLoading && sentDeals.length === 0 && receivedDeals.length === 0

  const currentDeals =
    hasRealDeals && activeTab === 'received'
      ? receivedDeals
      : hasRealDeals
        ? sentDeals
        : DEALS_DATA

  // Show empty state when there are no deals
  if (showEmptyState) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center bg-white px-4 py-16'>
        {/* Robot Illustration */}
        <div className='mb-6 flex justify-center'>
          <Image
            src='/assets/no-content-empty-state.svg'
            alt='No deals illustration'
            width={200}
            height={200}
            className='mx-auto'
            priority
          />
        </div>

        {/* Heading */}
        <h2 className='mb-3 text-center text-xl font-bold text-gray-900'>
          There are no deals yet
        </h2>

        {/* Description */}
        <p className='mb-8 max-w-md text-center text-sm font-normal text-gray-600'>
          Create your first deal to kickstart a great partnership journey
        </p>

        {/* Action Buttons */}
        <div className='flex gap-3'>
          <Button
            variant='primary'
            className='text-white [&_svg]:stroke-white [&_svg]:text-white'
            onClick={() => {
              if (inDummyFlow) {
                handleDummyAction()
                return
              }
              setIsLinkModalOpen(true)
            }}
          >
            <IconBolt size={16} />
            Generate Deal Snapshot Link
          </Button>
          <Button
            variant='primary'
            className='gap-2 border-text-30 px-3 py-2 text-sm font-bold text-white hover:text-white'
            onClick={() => {
              if (inDummyFlow) {
                handleDummyAction()
                return
              }
              setIsAddDealModalOpen(true)
            }}
          >
            <IconPlus size={16} />
            New Deal
          </Button>
        </div>

        <AddDealDetailsModal
          isOpen={isAddDealModalOpen}
          onClose={() => setIsAddDealModalOpen(false)}
          inDummyFlow={inDummyFlow}
          initialPartnerName={initialPartnerName}
          initialPartnerEmail={initialPartnerEmail}
          onSuccess={handleDealCreated}
        />

        <LinkGenerationModal
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
          selectedDeals={selectedDeals}
        />
      </div>
    )
  }

  return (
    <div className='flex flex-col overflow-x-auto bg-white'>
      <div className='w-full min-w-[880px]'>
        {/* Filters and Actions Section */}
        <div className='flex items-center justify-between border-b border-gray-200 px-4 py-3'>
          <div className='flex items-center gap-4'>
            {hasRealDeals && (
              <div className='flex gap-2 rounded-lg border border-gray-200 p-1'>
                <Button
                  variant={activeTab === 'sent' ? 'primary' : 'ghost'}
                  size='sm'
                  className={
                    activeTab === 'sent'
                      ? 'bg-primary-blue text-white'
                      : 'text-gray-600'
                  }
                  onClick={() => setActiveTab('sent')}
                >
                  Sent ({sentDeals.length})
                </Button>
                <Button
                  variant={activeTab === 'received' ? 'primary' : 'ghost'}
                  size='sm'
                  className={
                    activeTab === 'received'
                      ? 'bg-primary-blue text-white'
                      : 'text-gray-600'
                  }
                  onClick={() => setActiveTab('received')}
                >
                  Received ({receivedDeals.length})
                </Button>
              </div>
            )}
            {!hasRealDeals && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='primary'
                    className='flex items-center gap-2 border-gray-300 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50'
                  >
                    All
                    <ChevronDown className='h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-48 p-3' align='start'>
                  <div className='space-y-2'>
                    <div className='text-sm font-medium text-gray-900'>
                      Filter by stage
                    </div>
                    <div className='space-y-1'>
                      {[
                        'Discovery',
                        'Qualification',
                        'Proposal',
                        'Negotiation',
                        'Closed Won'
                      ].map((stage) => (
                        <label
                          key={stage}
                          className='flex cursor-pointer items-center gap-2 text-sm text-gray-700'
                        >
                          <Input
                            type='checkbox'
                            className='h-4 w-4 rounded border-gray-300'
                          />
                          {stage}
                        </label>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3'>
            <Button
              variant='primary'
              className='gap-2 px-3 py-2 text-sm font-bold text-white [&_svg]:stroke-white [&_svg]:text-white'
              onClick={() => {
                if (inDummyFlow) {
                  handleDummyAction()
                  return
                }
                setIsLinkModalOpen(true)
              }}
            >
              <IconBolt size={16} />
              Generate Deal Snapshot Link
            </Button>
            <Button
              variant='primary'
              className='gap-2 border-text-30 px-3 py-2 text-sm font-bold text-white hover:text-white'
              onClick={() => {
                if (inDummyFlow) {
                  handleDummyAction()
                  return
                }
                setIsAddDealModalOpen(true)
              }}
            >
              <IconPlus size={16} />
              New Deal
            </Button>
          </div>
        </div>

        {/* Table */}
        <div>
          {!inDummyFlow && partnerCode && dealsLoading ? (
            <div className='my-8 text-center text-sm text-gray-500'>
              Loading deals...
            </div>
          ) : (
            <div className='overflow-hidden border-t border-gray-200'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    {!hasRealDeals && (
                      <th className='px-6 py-3 text-left'>
                        <Checkbox
                          className='h-4 w-4 rounded border-gray-300'
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                    )}
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Deal
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Deal Stage
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Deal Size
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Updated
                    </th>
                    {hasRealDeals && activeTab === 'received' && (
                      <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {hasRealDeals
                    ? (currentDeals as InternalDeal[]).map((deal) => (
                        <tr
                          key={deal.id}
                          className='transition-colors duration-150 hover:bg-gray-50'
                        >
                          <td className='px-6 py-4'>
                            <div className='flex flex-col gap-2'>
                              <div className='text-base font-medium text-text-100'>
                                {deal.customerAccountName}
                              </div>
                              <div className='text-sm font-medium text-text-90'>
                                {deal.website}
                              </div>
                              {deal.dealCode && (
                                <div className='text-xs text-text-60'>
                                  Code: {deal.dealCode}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            {getDealStageTag(deal.dealStage)}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            {getStatusTag(deal.dealStatus)}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            <div className='text-xs font-medium text-gray-900'>
                              {formatCurrency(deal.estimatedAcv ?? 0)}
                            </div>
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            <div className='text-xs font-medium text-text-60'>
                              {formatDate(
                                deal.lastUpdatedTimestamp ??
                                  deal.creationTimestamp ??
                                  ''
                              )}
                            </div>
                          </td>
                          {activeTab === 'received' && (
                            <td className='whitespace-nowrap px-6 py-4 text-right'>
                              {!deal.isApproved &&
                                deal.dealStatus === 'PENDING' && (
                                  <Button
                                    size='sm'
                                    variant='primary'
                                    className='text-white'
                                    onClick={() =>
                                      openApprovalModal(
                                        deal.dealId ?? String(deal.id)
                                      )
                                    }
                                  >
                                    Approve
                                  </Button>
                                )}
                            </td>
                          )}
                        </tr>
                      ))
                    : DEALS_DATA.map((deal) => (
                        <tr
                          key={deal.id}
                          className='transition-colors duration-150 hover:bg-gray-50'
                        >
                          <td className='whitespace-nowrap px-6 py-4'>
                            <Checkbox
                              className='h-4 w-4 rounded border-gray-300'
                              checked={selectedDeals.includes(deal.id)}
                              onCheckedChange={() => handleDealSelect(deal.id)}
                            />
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex flex-col gap-2'>
                              <div className='text-base font-medium text-text-100'>
                                {deal.deal.title}
                              </div>
                              <div className='text-sm font-medium text-text-90'>
                                {deal.deal.companyId}
                              </div>
                              <div className='flex items-center gap-2'>
                                <Image
                                  src='/icons/hubspot-icon.svg'
                                  alt='HubSpot'
                                  width={12}
                                  height={12}
                                />
                                <span className='text-xs text-text-60'>
                                  last synced {deal.deal.lastSynced}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            {getDealStageTag(deal.dealStage)}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            {getStatusTag(deal.status)}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            <div className='text-xs font-medium text-gray-900'>
                              {formatCurrency(deal.dealSize)}
                            </div>
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            <div className='text-xs font-medium text-text-60'>
                              {formatDate(deal.updatedAt)}
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Approve deal modal (internal partner portal) */}
      <Dialog
        open={!!approveModalDealId}
        onOpenChange={(open) => !open && closeApprovalModal()}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Approve Deal</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <label className='text-sm font-medium text-gray-700'>
                Integration Type
              </label>
              <Select
                value={approvalIntegrationType}
                onValueChange={setApprovalIntegrationType}
              >
                <SelectTrigger>
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
            <div className='grid gap-2'>
              <label className='text-sm font-medium text-gray-700'>
                Deal Protection Period (days)
              </label>
              <Input
                type='number'
                min={0}
                value={approvalDealProtectionPeriod}
                onChange={(e) =>
                  setApprovalDealProtectionPeriod(e.target.value)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={closeApprovalModal}
              disabled={approveMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              className='text-white'
              onClick={handleApproveDeal}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LinkGenerationModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        selectedDeals={selectedDeals}
      />

      <AddDealDetailsModal
        isOpen={isAddDealModalOpen}
        onClose={() => setIsAddDealModalOpen(false)}
        inDummyFlow={inDummyFlow}
        initialPartnerName={initialPartnerName}
        initialPartnerEmail={initialPartnerEmail}
        onSuccess={handleDealCreated}
      />
    </div>
  )
}

export default DealsTable
