'use client'

import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Clock,
  Database,
  MessageSquare,
  Minus,
  TrendingUp,
  User,
  X
} from 'lucide-react'

interface HistoryItem {
  value: string
  timestamp: string
  sourceType: string
  sourceId: string
  updatedByUserId?: number
  readableMessage?: string
}

interface DealHistoryData {
  id: string
  properties: {
    amount: string
    closedate: string
    createdate: string
    dealname: string
    dealstage: string
    hs_lastmodifieddate: string
    hs_object_id: string
    pipeline: string
  }
  propertiesWithHistory: {
    amount: HistoryItem[]
    closedate: HistoryItem[]
    dealstage: HistoryItem[]
  }
  createdAt: string
  updatedAt: string
  archived: boolean
  dealerOrgId: number
  vendorOrgId: number
}

/** Portal `/my-deals/:id/history` snapshot — not HubSpot CRM timeline shape */
export interface PortalDealSnapshot {
  dealId?: string
  dealCode?: string
  lastUpdatedTimestamp?: string
  customerAccountName?: string
  website?: string
  headQuarteredLocation?: string
  estimatedAcv?: number
  expectedClosingTime?: number
  currentSolution?: string
  requirements?: string
  dealStage?: string
  source?: string
  isApproved?: boolean
  dealerOrgId?: number
  vendorOrgId?: number
  dealSize?: number
  dealStatus?: string
  lastActivity?: string
  pointOfContact?: string
  dealProtectionPeriod?: number
  isSent?: boolean
  hotspotDealId?: string
  orgName?: string
  customFields?: string
  hubspotDealId?: string
  salesforceDealId?: string
  zohoDealId?: string
}

export type DealHistoryDrawerData = DealHistoryData | PortalDealSnapshot | null

interface DealHistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  historyData: DealHistoryDrawerData
}

function isPortalDealSnapshot(data: unknown): data is PortalDealSnapshot {
  if (!data || typeof data !== 'object') return false
  const o = data as Record<string, unknown>
  return (
    typeof o.dealId === 'string' && typeof o.customerAccountName === 'string'
  )
}

function isDealHistoryData(data: unknown): data is DealHistoryData {
  return (
    typeof data === 'object' && data !== null && 'propertiesWithHistory' in data
  )
}

function hasHubSpotTimeline(data: DealHistoryData): boolean {
  const p = data.propertiesWithHistory
  if (!p) return false
  return (
    (p.dealstage?.length ?? 0) > 0 ||
    (p.amount?.length ?? 0) > 0 ||
    (p.closedate?.length ?? 0) > 0
  )
}

const getSourceTypeIcon = (sourceType: string) => {
  switch (sourceType.toLowerCase()) {
    case 'crm_ui':
      return <User size={16} className='text-blue-600' />
    case 'integration':
      return <Database size={16} className='text-green-600' />
    case 'internal_processing':
      return <TrendingUp size={16} className='text-purple-600' />
    default:
      return <Minus size={16} className='text-gray-600' />
  }
}

const getSourceTypeColor = (sourceType: string) => {
  switch (sourceType.toLowerCase()) {
    case 'crm_ui':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'integration':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'internal_processing':
      return 'bg-purple-50 text-purple-700 border-purple-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

const formatTimestamp = (timestamp: string) => {
  const normalized =
    /^\d{4}-\d{2}-\d{2} \d/.test(timestamp) && !timestamp.includes('T')
      ? timestamp.replace(' ', 'T')
      : timestamp
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) {
    return timestamp
  }
  const now = new Date()
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  )

  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }
}

function SnapshotRow({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  if (
    children === null ||
    children === undefined ||
    children === '' ||
    (typeof children === 'number' && Number.isNaN(children))
  ) {
    return null
  }
  return (
    <div className='border-b border-gray-100 py-3 last:border-0'>
      <dt className='text-xs font-medium uppercase tracking-wide text-gray-500'>
        {label}
      </dt>
      <dd className='mt-1 break-words text-sm text-gray-900'>{children}</dd>
    </div>
  )
}

function formatAcv(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(n)
}

function PortalSnapshotView({ data }: { data: PortalDealSnapshot }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className='space-y-4'
    >
      <div className='flex items-center gap-2'>
        <TrendingUp size={20} className='text-blue-600' />
        <h3 className='text-lg font-semibold text-gray-900'>Deal details</h3>
      </div>
      <dl className='rounded-lg border border-gray-200 bg-gray-50/80 p-4'>
        <SnapshotRow label='Account name'>
          {data.customerAccountName}
        </SnapshotRow>
        <SnapshotRow label='Deal code'>{data.dealCode}</SnapshotRow>
        <SnapshotRow label='Deal ID'>{data.dealId}</SnapshotRow>
        <SnapshotRow label='Organization'>{data.orgName}</SnapshotRow>
        <SnapshotRow label='Website'>
          {data.website ? (
            <a
              href={data.website}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 underline hover:text-blue-800'
            >
              {data.website}
            </a>
          ) : null}
        </SnapshotRow>
        <SnapshotRow label='Headquartered location'>
          {data.headQuarteredLocation}
        </SnapshotRow>
        <SnapshotRow label='Estimated ACV'>
          {data.estimatedAcv != null ? formatAcv(data.estimatedAcv) : null}
        </SnapshotRow>
        <SnapshotRow label='Deal size'>
          {data.dealSize != null && data.dealSize > 0
            ? formatAcv(data.dealSize)
            : undefined}
        </SnapshotRow>
        <SnapshotRow label='Expected closing (days)'>
          {data.expectedClosingTime != null
            ? String(data.expectedClosingTime)
            : null}
        </SnapshotRow>
        <SnapshotRow label='Deal protection period (days)'>
          {data.dealProtectionPeriod != null
            ? String(data.dealProtectionPeriod)
            : null}
        </SnapshotRow>
        <SnapshotRow label='Current solution'>
          {data.currentSolution}
        </SnapshotRow>
        <SnapshotRow label='Requirements'>{data.requirements}</SnapshotRow>
        <SnapshotRow label='Deal stage'>{data.dealStage}</SnapshotRow>
        <SnapshotRow label='Deal status'>{data.dealStatus}</SnapshotRow>
        <SnapshotRow label='Source'>{data.source}</SnapshotRow>
        <SnapshotRow label='Approved'>
          {data.isApproved === undefined
            ? null
            : data.isApproved
              ? 'Yes'
              : 'No'}
        </SnapshotRow>
        <SnapshotRow label='Sent to partner'>
          {data.isSent === undefined ? null : data.isSent ? 'Yes' : 'No'}
        </SnapshotRow>
        <SnapshotRow label='Point of contact'>
          {data.pointOfContact}
        </SnapshotRow>
        <SnapshotRow label='Last activity'>{data.lastActivity}</SnapshotRow>
        <SnapshotRow label='Last updated'>
          {data.lastUpdatedTimestamp
            ? formatTimestamp(data.lastUpdatedTimestamp)
            : null}
        </SnapshotRow>
        <SnapshotRow label='Hotspot deal ID'>{data.hotspotDealId}</SnapshotRow>
        <SnapshotRow label='HubSpot deal ID'>{data.hubspotDealId}</SnapshotRow>
        <SnapshotRow label='Salesforce deal ID'>
          {data.salesforceDealId}
        </SnapshotRow>
        <SnapshotRow label='Zoho deal ID'>{data.zohoDealId}</SnapshotRow>
        <SnapshotRow label='Dealer org ID'>
          {data.dealerOrgId != null ? String(data.dealerOrgId) : null}
        </SnapshotRow>
        <SnapshotRow label='Vendor org ID'>
          {data.vendorOrgId != null ? String(data.vendorOrgId) : null}
        </SnapshotRow>
        <SnapshotRow label='Custom fields'>
          {data.customFields &&
          data.customFields !== '{}' &&
          data.customFields !== 'null'
            ? data.customFields
            : null}
        </SnapshotRow>
      </dl>
    </motion.div>
  )
}

function EmptyHistoryView() {
  return (
    <div className='flex h-full flex-col items-center justify-center text-center'>
      <div className='mb-4 text-gray-400'>
        <Clock size={48} />
      </div>
      <h3 className='mb-2 text-lg font-medium text-gray-900'>
        No History Available
      </h3>
      <p className='text-sm text-gray-500'>
        This deal doesn&apos;t have any history data to display yet.
      </p>
    </div>
  )
}

function HubSpotTimelineView({ data }: { data: DealHistoryData }) {
  const { propertiesWithHistory } = data

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='space-y-6'
    >
      {/* Deal Stage History */}
      {propertiesWithHistory.dealstage?.length ? (
        <motion.div variants={itemVariants} className='space-y-4'>
          <div className='flex items-center gap-2'>
            <TrendingUp size={20} className='text-blue-600' />
            <h3 className='text-lg font-semibold text-gray-900'>
              Deal Stage Changes
            </h3>
          </div>
          <div className='space-y-3'>
            {propertiesWithHistory.dealstage.map((item, index) => (
              <motion.div
                key={`${item.timestamp}-${index}`}
                variants={itemVariants}
                className='relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='mb-2 flex items-center gap-2'>
                      <span className='inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800'>
                        {item.value}
                      </span>
                      {getSourceTypeIcon(item.sourceType)}
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getSourceTypeColor(item.sourceType)}`}
                      >
                        {item.sourceType.replace('_', ' ')}
                      </span>
                    </div>

                    {item.readableMessage && (
                      <div className='mb-2 flex items-start gap-2'>
                        <MessageSquare
                          size={16}
                          className='mt-0.5 flex-shrink-0 text-gray-500'
                        />
                        <p className='text-sm text-gray-700'>
                          {item.readableMessage}
                        </p>
                      </div>
                    )}

                    <div className='flex items-center gap-4 text-xs text-gray-500'>
                      <div className='flex items-center gap-1'>
                        <Clock size={14} />
                        {formatTimestamp(item.timestamp)}
                      </div>
                      {item.updatedByUserId && (
                        <div className='flex items-center gap-1'>
                          <User size={14} />
                          User ID: {item.updatedByUserId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {index < propertiesWithHistory.dealstage.length - 1 && (
                  <div className='absolute left-6 top-full h-4 w-px bg-gray-200' />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : null}

      {/* Amount History */}
      {propertiesWithHistory.amount?.length ? (
        <motion.div variants={itemVariants} className='space-y-4'>
          <div className='flex items-center gap-2'>
            <TrendingUp size={20} className='text-green-600' />
            <h3 className='text-lg font-semibold text-gray-900'>
              Amount Changes
            </h3>
          </div>
          <div className='space-y-3'>
            {propertiesWithHistory.amount.map((item, index) => (
              <motion.div
                key={`${item.timestamp}-${index}`}
                variants={itemVariants}
                className='relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='mb-2 flex items-center gap-2'>
                      <span className='inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800'>
                        ${parseInt(item.value, 10).toLocaleString()}
                      </span>
                      {getSourceTypeIcon(item.sourceType)}
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getSourceTypeColor(item.sourceType)}`}
                      >
                        {item.sourceType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className='flex items-center gap-4 text-xs text-gray-500'>
                      <div className='flex items-center gap-1'>
                        <Clock size={14} />
                        {formatTimestamp(item.timestamp)}
                      </div>
                      {item.updatedByUserId && (
                        <div className='flex items-center gap-1'>
                          <User size={14} />
                          User ID: {item.updatedByUserId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {index < propertiesWithHistory.amount.length - 1 && (
                  <div className='absolute left-6 top-full h-4 w-px bg-gray-200' />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : null}

      {/* Close Date History */}
      {propertiesWithHistory.closedate?.length ? (
        <motion.div variants={itemVariants} className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Clock size={20} className='text-purple-600' />
            <h3 className='text-lg font-semibold text-gray-900'>
              Close Date Changes
            </h3>
          </div>
          <div className='space-y-3'>
            {propertiesWithHistory.closedate.map((item, index) => (
              <motion.div
                key={`${item.timestamp}-${index}`}
                variants={itemVariants}
                className='relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='mb-2 flex items-center gap-2'>
                      <span className='inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800'>
                        {new Date(item.value).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {getSourceTypeIcon(item.sourceType)}
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getSourceTypeColor(item.sourceType)}`}
                      >
                        {item.sourceType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className='flex items-center gap-4 text-xs text-gray-500'>
                      <div className='flex items-center gap-1'>
                        <Clock size={14} />
                        {formatTimestamp(item.timestamp)}
                      </div>
                      {item.updatedByUserId && (
                        <div className='flex items-center gap-1'>
                          <User size={14} />
                          User ID: {item.updatedByUserId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {index < propertiesWithHistory.closedate.length - 1 && (
                  <div className='absolute left-6 top-full h-4 w-px bg-gray-200' />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  )
}

export function DealHistoryDrawer({
  isOpen,
  onClose,
  historyData
}: DealHistoryDrawerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  if (!historyData) return null

  const isPortal = isPortalDealSnapshot(historyData)
  const hubspotData =
    !isPortal && isDealHistoryData(historyData) ? historyData : null
  const hasTimeline = hubspotData ? hasHubSpotTimeline(hubspotData) : false

  const bodyContent = isPortal ? (
    <PortalSnapshotView data={historyData} />
  ) : hasTimeline && hubspotData ? (
    <HubSpotTimelineView data={hubspotData} />
  ) : (
    <EmptyHistoryView />
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200,
              duration: 0.4
            }}
            className='fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-gray-200 bg-white shadow-2xl'
          >
            <div className='flex h-16 items-center justify-between border-b border-gray-200 px-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Deal History
              </h2>
              <button
                type='button'
                onClick={onClose}
                className='rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
              >
                <X size={20} />
              </button>
            </div>

            <div className='h-[calc(100%-4rem)] overflow-y-auto'>
              <div className='p-6'>{bodyContent}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
