'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { RootState } from '@/redux/store'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Zap
} from 'lucide-react'
import { useSelector } from 'react-redux'

import {
  useCreateSharedAsset,
  useDealOwnerDetails,
  useIntroTracker,
  useSharedAssets
} from '../api'
import type { SharedAccount, SharedAccountsApiResponse } from '../api'
import { AddToPipelineDrawer } from './AddToPipelineDrawer'
import { RequestIntroDrawer } from './RequestIntroDrawer'
import { StartCoSellDrawer } from './StartCoSellDrawer'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const OVERLAP_CONFIG: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  HOT: { bg: '#FFEAE4', color: '#DB6548', label: 'Hot Overlap' },
  COSELL_READY: { bg: '#F0EBFF', color: '#6B4FBB', label: 'Co-sell ready' },
  MONITOR: { bg: '#FFF6DC', color: '#D09500', label: 'Monitor' },
  LOW_PRIORITY: { bg: '#F6F6F6', color: '#4D4D4D', label: 'Low Priority' },
  WARM: { bg: '#F3F4F6', color: '#6B7280', label: 'Warm' }
}

const ACTION_LABEL: Record<string, string> = {
  START_COSELL: 'Start Co-sell',
  REQUEST_INTRO: 'Request Intro',
  ADD_TO_PIPELINE: 'Add to Pipeline',
  ESCALATE_TO_DEAL: 'Escalate to Deal',
  MONITOR: 'Monitor'
}

/** Fixed Action column width so every row button matches (longest label + arrow). */
const ACTION_COL_PX = 168

/**
 * Compact column metrics so the grid fits common content widths (~900px) without
 * horizontal scrolling beside the app sidebar.
 */
const T = {
  padX: 16,
  gap: 8,
  /** Logo + two lines of text; keep tight to avoid a dead zone before Overlap. */
  account: 168,
  /** Fits longest overlap pill ("Co-sell ready") without joining the flex-grow group. */
  overlap: 112,
  score: 54,
  stage: 104,
  acv: 78
} as const

function formatACV(value: number) {
  return `$${value.toLocaleString('en-US')}`
}

function formatStage(stage: string) {
  return stage
    .split('_')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ')
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AccountCell({
  name,
  domain,
  nameSize = 12
}: {
  name: string
  domain: string
  /** Figma expanded header uses 16px; table rows use 12px. */
  nameSize?: 12 | 16
}) {
  return (
    <div className='flex items-center gap-2'>
      <div className='relative shrink-0' style={{ width: 28, height: 28 }}>
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={name}
          className='h-full w-full rounded object-contain'
          onError={(e) => {
            const target = e.currentTarget
            target.style.display = 'none'
            const fallback = target.nextElementSibling as HTMLElement | null
            if (fallback) fallback.style.display = 'flex'
          }}
        />
        <div
          className='absolute inset-0 hidden items-center justify-center rounded text-xs font-bold text-white'
          style={{ background: '#1C9093' }}
        >
          {name.charAt(0)}
        </div>
      </div>
      <div className='flex min-w-0 flex-col'>
        <span
          style={{
            color: '#1A1A2E',
            fontSize: nameSize,
            fontWeight: 700,
            lineHeight: nameSize === 16 ? '24px' : '16px',
            letterSpacing: nameSize === 16 ? '-0.31px' : undefined
          }}
        >
          {name}
        </span>
        <span
          style={{
            color: nameSize === 16 ? '#4B5568' : '#99A1AF',
            fontSize: 11,
            fontWeight: 400,
            lineHeight: '16.5px',
            letterSpacing: '0.06px'
          }}
        >
          {domain}
        </span>
      </div>
    </div>
  )
}

function OverlapBadge({
  type,
  overrideBg,
  overrideColor
}: {
  type: string
  overrideBg?: string
  overrideColor?: string
}) {
  const cfg = OVERLAP_CONFIG[type] ?? {
    bg: '#F6F6F6',
    color: '#4D4D4D',
    label: type
  }
  return (
    <span
      className='block max-w-full truncate'
      style={{
        background: overrideBg || cfg.bg,
        color: overrideColor || cfg.color,
        borderRadius: 4,
        padding: '4px 8px',
        fontSize: 11,
        fontWeight: 700,
        lineHeight: '16.5px',
        letterSpacing: '0.06px'
      }}
    >
      {cfg.label}
    </span>
  )
}

function ScoreBar({ score }: { score: number }) {
  const trackW = 50
  const fillPx = Math.max(3, Math.round((score / 100) * trackW))
  return (
    <div className='flex flex-col gap-1'>
      <span
        style={{
          color: '#64748B',
          fontSize: 16,
          fontWeight: 700,
          lineHeight: '24px',
          letterSpacing: '-0.44px'
        }}
      >
        {score}
      </span>
      <div
        style={{
          width: trackW,
          height: 4,
          background: '#E5E7EB',
          borderRadius: 9999,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: fillPx,
            height: 4,
            background: '#6B4FBB',
            borderRadius: 9999
          }}
        />
      </div>
    </div>
  )
}

function StageBadge({
  stage,
  variant
}: {
  stage: string
  variant: 'your' | 'partner'
}) {
  const isYour = variant === 'your'
  return (
    <span
      className='max-w-full truncate'
      style={{
        background: isYour ? '#DDE8FF' : '#EBE4FF',
        color: isYour ? '#1D4AAE' : '#402885',
        borderRadius: 4,
        padding: variant === 'partner' ? '4px 8px' : '4px 8px',
        fontSize: 11,
        fontWeight: 500,
        lineHeight: '16.5px',
        letterSpacing: '0.06px',
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: variant === 'partner' ? 25 : undefined,
        verticalAlign: 'middle'
      }}
    >
      {formatStage(stage)}
    </span>
  )
}

function ActionButton({
  action,
  label,
  onClick,
  overrideStyle
}: {
  action: string
  label?: string
  onClick?: (e: React.MouseEvent) => void
  overrideStyle?: React.CSSProperties
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex items-center justify-center gap-1.5 transition-opacity hover:opacity-80'
      style={{
        width: ACTION_COL_PX,
        minWidth: ACTION_COL_PX,
        outline: '1px #A6ACE4 solid',
        outlineOffset: '-1px',
        borderRadius: 7,
        padding: '4px 10px',
        background: 'transparent',
        ...overrideStyle
      }}
    >
      <span
        className='min-w-0 truncate'
        style={{
          color: '#3E50F7',
          fontSize: 13,
          fontWeight: 600,
          lineHeight: '19.5px'
        }}
      >
        {(label || ACTION_LABEL[action]) ?? action}
      </span>
      <ArrowRight
        className='h-3.5 w-3.5 shrink-0'
        style={{ color: '#3E50F7' }}
      />
    </button>
  )
}

// ─── Header cell helper ───────────────────────────────────────────────────────

function Th({
  label,
  width,
  dot,
  sortable = false,
  fill = false
}: {
  label: string
  width?: number
  dot?: string
  sortable?: boolean
  /** When true, span full width of the parent cell (use inside flexible columns). */
  fill?: boolean
}) {
  return (
    <div
      className='flex min-w-0 items-center gap-1'
      style={{ width: fill ? '100%' : width }}
    >
      {dot && (
        <div
          className='h-4 w-4 shrink-0 rounded-[3px] border border-white shadow-sm'
          style={{ background: dot }}
        />
      )}
      <span
        className='min-w-0 truncate'
        style={{
          color: '#4A5565',
          fontSize: 11,
          fontWeight: 600,
          lineHeight: '16px'
        }}
      >
        {label}
      </span>
      {sortable && (
        <ArrowUpDown
          className='h-3 w-3 shrink-0'
          style={{ color: '#4A5565' }}
        />
      )}
    </div>
  )
}

function buildPageList(
  current: number,
  total: number
): Array<number | 'ellipsis'> {
  if (total <= 0) return []
  if (total <= 9) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const set = new Set<number>()
  set.add(1)
  set.add(total)
  for (let i = current - 2; i <= current + 2; i++) {
    if (i > 1 && i < total) set.add(i)
  }
  const sorted = [...set].sort((a, b) => a - b)
  const out: Array<number | 'ellipsis'> = []
  let prev = 0
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push('ellipsis')
    out.push(p)
    prev = p
  }
  return out
}

type PaginationBarProps = {
  page: number
  totalPages: number
  totalElements: number
  pageSize: number
  onPageChange: (p: number) => void
  onPageSizeChange: (s: number) => void
}

function SharedAccountsPaginationBar({
  page,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange
}: PaginationBarProps) {
  const [goToValue, setGoToValue] = useState('')
  const pages = buildPageList(page, totalPages)

  function submitGoTo() {
    const n = parseInt(goToValue, 10)
    if (!Number.isFinite(n) || n < 1) return
    onPageChange(Math.min(n, totalPages))
    setGoToValue('')
  }

  return (
    <div
      className='flex flex-col gap-4 px-4 pb-5 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between'
      style={{ borderTop: '1px solid #C5D4F0' }}
    >
      <p className='text-sm text-black/85'>Total {totalElements} items</p>

      <div className='flex flex-wrap items-center gap-3'>
        <div className='flex flex-wrap items-center gap-1'>
          <button
            type='button'
            aria-label='Previous page'
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className='flex h-8 items-center justify-center rounded border border-[#D9D9D9] bg-white px-2.5 disabled:opacity-40'
          >
            <ChevronLeft className='h-3 w-3' />
          </button>
          {pages.map((p, idx) =>
            p === 'ellipsis' ? (
              <span
                key={`e-${idx}`}
                className='flex h-8 w-8 items-center justify-center text-sm tracking-widest text-black/25'
              >
                •••
              </span>
            ) : (
              <button
                key={p}
                type='button'
                onClick={() => onPageChange(p)}
                className={`flex h-8 min-w-[2rem] items-center justify-center rounded border px-2 text-sm ${
                  p === page
                    ? 'border-[#3E50F7] font-medium text-[#3E50F7]'
                    : 'border-[#D9D9D9] bg-white text-black/85'
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            type='button'
            aria-label='Next page'
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className='flex h-8 items-center justify-center rounded border border-[#D9D9D9] bg-white px-2.5 disabled:opacity-40'
          >
            <ChevronRight className='h-3 w-3' />
          </button>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <label className='sr-only' htmlFor='shared-acct-page-size'>
            Rows per page
          </label>
          <select
            id='shared-acct-page-size'
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className='h-8 rounded border border-[#D9D9D9] bg-white px-3 text-sm text-black/85'
          >
            {[10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
          <div className='flex items-center gap-2 text-sm text-black/85'>
            <span>Go to</span>
            <input
              type='text'
              inputMode='numeric'
              placeholder=''
              value={goToValue}
              onChange={(e) => setGoToValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitGoTo()
              }}
              className='h-8 w-12 rounded border border-[#D9D9D9] bg-white px-2 text-center text-sm outline-none focus:border-[#3E50F7]'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Expanded Row Panel ───────────────────────────────────────────────────────

function ExpandedRowPanel({
  row,
  reportPartnerName,
  cosellPartnerOrgId,
  cosellReportType,
  onClose,
  onCoSell,
  onRequestIntro,
  onAddToPipeline
}: {
  row: SharedAccount
  reportPartnerName?: string
  cosellPartnerOrgId?: string | null
  cosellReportType?: string
  onClose: () => void
  onCoSell: () => void
  onRequestIntro: () => void
  onAddToPipeline: () => void
}) {
  const router = useRouter()
  const org = useSelector((s: RootState) => s.currentOrg?.organization)
  const myOrgName = org?.name || 'Your'
  const partnerOrgName = reportPartnerName || 'Partner'

  const { data: authData } = useQuery<any>({
    queryKey: ['auth-data'],
    enabled: false
  })
  const userProfile = authData?.userProfile
  const registeredUserName =
    userProfile?.name || authData?.user?.displayName || 'Your'
  const orgId = org?.id
  const dealId = row.currentPartnerDealId || row.targetPartnerDealId

  const { data: details, isLoading: detailsLoading } = useDealOwnerDetails(
    orgId ? Number(orgId) : null,
    dealId
  )

  const { data: partnerDetails, isLoading: partnerDetailsLoading } =
    useDealOwnerDetails(
      cosellPartnerOrgId ? Number(cosellPartnerOrgId) : null,
      dealId
    )

  const isCoSellReady =
    row.overlapType === 'COSELL_READY' || row.overlapType === 'HOT'

  // Prioritize API details, fallback to row data
  const yourStageLabel = details?.dealStage || formatStage(row.yourStage)
  const partnerStageLabel = formatStage(row.partnerStage)
  const acvLabel = details?.amountAcv
    ? `$${details.amountAcv}`
    : formatACV(row.estimatedACV)
  const ownerName = details?.dealOwner || org?.name || 'Your team'
  const partnerOwnerName = partnerDetails?.dealOwner || 'Partner AE'
  const lastTouchDate = details?.lastActivityDate || '2 days ago' // Fallback

  const partnerPipelineTitle = partnerDetails?.dealOwner
    ? `${partnerDetails.dealOwner.toUpperCase()}'S PIPELINE`
    : `${partnerOrgName.toUpperCase()} PIPELINE`

  const whyActNow = [
    `Partner has 3 contacts at ${row.name} not in your CRM`,
    `Partner closed a similar account (${row.name}) last quarter`,
    `Co-sell deals close 38% faster than direct on accounts at ${yourStageLabel} stage`
  ]

  const isClosed =
    row.yourStage === 'CLOSED_CUSTOMER' &&
    row.partnerStage === 'CLOSED_CUSTOMER'

  const isStarted =
    (typeof window !== 'undefined' &&
      localStorage.getItem(`cosell_started_${row.accountId}`) === 'true') ||
    row.recommendedAction === 'VIEW'

  const primaryLabel = isStarted
    ? 'View Workspace'
    : row.recommendedAction === 'START_COSELL' || isClosed
      ? 'Start Co-sell'
      : (ACTION_LABEL[row.recommendedAction] ?? row.recommendedAction)

  function handleAction() {
    onClose()
    if (isStarted) {
      const pId = cosellPartnerOrgId
      const dId = row.currentPartnerDealId || row.targetPartnerDealId || ''
      const type = cosellReportType || 'CUSTOMER_CUSTOMER'
      if (pId && dId) {
        router.push(
          `/partner-mapping/cosell-workspace/${pId}?dealId=${dId}&type=${type}`
        )
      } else {
        onCoSell()
      }
    } else {
      const isClosed =
        row.yourStage === 'CLOSED_CUSTOMER' &&
        row.partnerStage === 'CLOSED_CUSTOMER'

      if (row.recommendedAction === 'START_COSELL' || isClosed) {
        onCoSell()
      } else if (row.recommendedAction === 'REQUEST_INTRO') {
        onRequestIntro()
      } else if (
        row.recommendedAction === 'ADD_TO_PIPELINE' ||
        row.recommendedAction === 'ESCALATE_TO_DEAL'
      ) {
        onAddToPipeline()
      }
    }
  }

  return (
    <div
      style={{
        background: '#F8F8FF',
        borderTop: '2px #AA9DD0 solid',
        borderBottom: '1px #AA9DD0 solid',
        paddingTop: 26,
        paddingBottom: 16,
        paddingLeft: 28,
        paddingRight: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12
        }}
      >
        <AccountCell name={row.name} domain={row.domain} nameSize={16} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isCoSellReady && (
            <span
              style={{
                background: '#F0EBFF',
                color: '#6B4FBB',
                borderRadius: 4,
                padding: '6px 11px',
                fontSize: 11,
                fontWeight: 700,
                lineHeight: '16.5px',
                letterSpacing: '0.06px'
              }}
            >
              Co-sell ready
            </span>
          )}
          <span
            style={{
              background: '#FF5A1F',
              color: 'white',
              borderRadius: 4,
              padding: '6px 11px',
              fontSize: 12,
              fontWeight: 700,
              lineHeight: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            Opp. Score: {row.opportunityScore}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
        <div
          style={{
            flex: 1,
            background: '#E5EFFE',
            borderRadius: 10,
            border: '1px solid #3E50F7',
            padding: '14px 15px 15px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            minHeight: 140,
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 8
            }}
          >
            <span
              style={{
                color: '#4D5C78',
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: '15px',
                letterSpacing: '1.12px'
              }}
            >
              {registeredUserName.toUpperCase()}'S PIPELINE
            </span>
            <span
              style={{
                color: '#4B5568',
                fontSize: 11,
                fontWeight: 400,
                lineHeight: '16.5px',
                textAlign: 'right',
                whiteSpace: 'nowrap'
              }}
            >
              {myOrgName} AE: {registeredUserName}
            </span>
          </div>
          <span
            style={{
              background: '#F1F2FF',
              color: '#3E50F7',
              borderRadius: 4,
              padding: '4px 8px',
              fontSize: 12,
              fontWeight: 700,
              lineHeight: '16px',
              alignSelf: 'flex-start'
            }}
          >
            {yourStageLabel}
          </span>
          <span
            style={{
              color: '#1A1A2E',
              fontSize: 16,
              fontWeight: 700,
              lineHeight: '19.5px'
            }}
          >
            Est. ACV: {acvLabel}
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 'auto',
              paddingTop: 4
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#00C950',
                flexShrink: 0
              }}
            />
            <span
              style={{
                color: '#99A1AF',
                fontSize: 11,
                fontWeight: 400,
                lineHeight: '16.5px'
              }}
            >
              Last touch: {lastTouchDate}
            </span>
          </div>
        </div>

        <div
          style={{
            width: 69,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              background: '#E4DAFF',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#674AB8',
              fontSize: 12,
              fontWeight: 600
            }}
          >
            +
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <span
              style={{
                color: '#6B4FBB',
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: '13.5px',
                letterSpacing: '0.17px'
              }}
            >
              JOINT
            </span>
            <span
              style={{
                color: '#6B4FBB',
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: '13.5px',
                letterSpacing: '0.17px'
              }}
            >
              OPPORTUNITY
            </span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            background: '#F2EDFF',
            borderRadius: 10,
            border: '1px solid #6B4FBB',
            padding: '14px 15px 15px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            minHeight: 140,
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 8
            }}
          >
            <span
              style={{
                color: '#4D5C78',
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: '15px',
                letterSpacing: '1.12px'
              }}
            >
              {partnerPipelineTitle}
            </span>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  color: '#4B5568',
                  fontSize: 11,
                  fontStyle: 'italic',
                  fontWeight: 400,
                  lineHeight: '16.5px'
                }}
              >
                {partnerOrgName} AE: {partnerOwnerName}
              </div>
              <div
                style={{
                  color: '#4D5C78',
                  fontSize: 10,
                  fontWeight: 500,
                  lineHeight: '15px',
                  letterSpacing: '0.12px',
                  marginTop: 4
                }}
              >
                Will be revealed after co-sell initiation
              </div>
            </div>
          </div>
          <span
            style={{
              background: '#F3F3F3',
              color: '#2A3241',
              borderRadius: 4,
              padding: '4px 8px',
              fontSize: 12,
              fontWeight: 700,
              lineHeight: '16px',
              alignSelf: 'flex-start'
            }}
          >
            {partnerStageLabel}
          </span>
          <span
            style={{
              color: '#1A1A2E',
              fontSize: 16,
              fontWeight: 700,
              lineHeight: '19.5px'
            }}
          >
            Est. ACV: Unknown
          </span>
          <span
            style={{
              position: 'absolute',
              right: 15,
              bottom: 14,
              color: '#6A7282',
              fontSize: 11,
              fontWeight: 400,
              lineHeight: '16.5px'
            }}
          >
            HubSpot Partner
          </span>
        </div>
      </div>

      <div
        style={{
          background: 'linear-gradient(90deg, #DADDFF 0%, #F5EFFF 100%)',
          borderRadius: 10,
          border: '1px solid #B2C4E7',
          padding: '14px'
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Lightbulb
            className='mt-0.5 h-4 w-4 shrink-0'
            style={{ color: '#6B4FBB' }}
            aria-hidden
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span
              style={{
                color: '#19212F',
                fontSize: 12,
                fontWeight: 600,
                lineHeight: '16.5px',
                letterSpacing: '0.06px'
              }}
            >
              Why act now:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {whyActNow.map((item, i) => (
                <span
                  key={i}
                  style={{
                    color: '#19212F',
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: '19.5px'
                  }}
                >
                  → {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap'
        }}
      >
        <button
          type='button'
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#4A5565',
            fontSize: 13,
            fontWeight: 500,
            lineHeight: '19.5px',
            cursor: 'pointer',
            padding: 0
          }}
        >
          Cancel
        </button>

        <button
          type='button'
          onClick={handleAction}
          style={{
            background: '#3E50F7',
            borderRadius: 10,
            border: 'none',
            padding: '10px 18px',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            lineHeight: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {primaryLabel}
          <ArrowRight className='h-4 w-4' />
        </button>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Props = {
  data?: SharedAccountsApiResponse
  isLoading?: boolean
  isError?: boolean
  /** Client-side filter on name/domain (current page). */
  searchQuery?: string
  page?: number
  totalElements?: number
  totalPages?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  /** Partner org id for co-sell workspace navigation (report context). */
  cosellPartnerOrgId?: string | null
  cosellReportType?: string | null
  cosellWorkspaceSubtitle?: string
  /** Partner display name from compare report (drawer copy). */
  reportPartnerName?: string
}

type ViewProps = Props & {
  onOpenCoSell: (row: SharedAccount) => void
  onOpenRequestIntro: () => void
  onOpenAddToPipeline: (row: SharedAccount) => void
  pipelineOwnerLabel: string
  introRequestedAccountIds: string[]
}

/** Table + row UI; drawer state lives in the parent so no stray `coSellOpen` closures. */
function SharedAccountsTableView({
  data,
  isLoading = false,
  isError = false,
  searchQuery = '',
  page = 1,
  totalElements = 0,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onOpenCoSell,
  onOpenRequestIntro,
  onOpenAddToPipeline,
  pipelineOwnerLabel,
  reportPartnerName,
  cosellPartnerOrgId,
  cosellReportType,
  introRequestedAccountIds
}: ViewProps) {
  const router = useRouter()
  const [startedAccountIds, setStartedAccountIds] = useState<string[]>([])

  useEffect(() => {
    const updateStarted = () => {
      const started: string[] = []
      if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith('cosell_started_')) {
            started.push(key.replace('cosell_started_', ''))
          }
        }
      }
      setStartedAccountIds(started)
    }

    updateStarted()
    window.addEventListener('cosell_started', updateStarted)
    window.addEventListener('storage', updateStarted)
    return () => {
      window.removeEventListener('cosell_started', updateStarted)
      window.removeEventListener('storage', updateStarted)
    }
  }, [])

  const org = useSelector((s: RootState) => s.currentOrg?.organization)
  const myOrgName = org?.name || 'Your'
  const partnerOrgName = reportPartnerName || 'Partner'

  const { data: authData } = useQuery<any>({
    queryKey: ['auth-data'],
    enabled: false
  })
  const userProfile = authData?.userProfile
  const registeredUserName =
    userProfile?.name || authData?.user?.displayName || 'Your'
  const yourHeaderLabel =
    registeredUserName === 'Your'
      ? 'Your Stage'
      : `${registeredUserName}'s Stage`
  const rawRows = data?.data?.content ?? []
  const rows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return rawRows
    return rawRows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) || r.domain.toLowerCase().includes(q)
    )
  }, [rawRows, searchQuery])
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)

  const showPagination =
    onPageChange != null &&
    onPageSizeChange != null &&
    totalElements > 0 &&
    totalPages > 0

  function toggleRow(row: SharedAccount) {
    const isCoSellAction = row.recommendedAction === 'START_COSELL'
    const isClosed =
      row.yourStage === 'CLOSED_CUSTOMER' &&
      row.partnerStage === 'CLOSED_CUSTOMER'

    // Allow expansion ONLY for Co-sell actions OR for already closed customers
    if (!isCoSellAction && !isClosed) return

    setExpandedRowId((prev) => (prev === row.accountId ? null : row.accountId))
  }

  return (
    <div
      className='w-full overflow-hidden bg-white shadow-sm'
      style={{
        borderRadius: 8,
        paddingTop: 17,
        paddingBottom: showPagination ? 0 : 17
      }}
    >
      <div className='w-full min-w-0'>
        {/* ── Header ── */}
        <div
          className='flex h-[45px] min-w-0 items-center'
          style={{
            borderBottom: '1px #C5D4F0 solid',
            paddingLeft: T.padX,
            paddingRight: T.padX,
            paddingBottom: 17,
            gap: T.gap
          }}
        >
          <div
            className='flex shrink-0 items-center gap-1'
            style={{ width: T.account }}
          >
            <span
              className='min-w-0 truncate'
              style={{
                color: '#4A5565',
                fontSize: 11,
                fontWeight: 600,
                lineHeight: '16px'
              }}
            >
              Account Name
            </span>
            <ArrowUpDown
              className='h-3 w-3 shrink-0'
              style={{ color: '#4A5565' }}
            />
          </div>
          <div
            className='flex min-w-0 shrink-0 items-center'
            style={{ width: T.overlap }}
          >
            <Th label='Overlap Type' fill sortable />
          </div>
          <div
            className='flex min-w-0 flex-1 items-center'
            style={{ gap: T.gap }}
          >
            <div
              className='min-w-0 flex-1 basis-0'
              style={{ minWidth: T.score }}
            >
              <Th label='Opp. Score' fill sortable />
            </div>
            <div
              className='min-w-0 flex-1 basis-0'
              style={{ minWidth: T.stage }}
            >
              <Th label={yourHeaderLabel} fill dot='#3E50F7' />
            </div>
            <div
              className='min-w-0 flex-1 basis-0'
              style={{ minWidth: T.stage }}
            >
              <Th label={`${partnerOrgName} Stage`} fill dot='#6B4FBB' />
            </div>
          </div>
          <div className='flex shrink-0 items-center' style={{ width: T.acv }}>
            <Th label='Est. ACV' fill sortable />
          </div>
          <div
            className='flex shrink-0 items-center justify-center gap-1'
            style={{ width: ACTION_COL_PX }}
          >
            <Zap
              className='h-3.5 w-3.5 shrink-0'
              style={{ color: '#4A5565' }}
            />
            <span
              style={{
                color: '#4A5565',
                fontSize: 12,
                fontWeight: 600,
                lineHeight: '16px',
                whiteSpace: 'nowrap'
              }}
            >
              Action
            </span>
          </div>
        </div>

        {/* ── Error ── */}
        {isError && (
          <div
            className='py-10 text-center text-sm'
            style={{ color: '#DB6548' }}
          >
            Failed to load shared accounts. Please try again.
          </div>
        )}

        {!isLoading && !isError && rawRows.length === 0 && (
          <div
            className='py-10 text-center text-sm'
            style={{ color: '#99A1AF' }}
          >
            No shared accounts found.
          </div>
        )}

        {!isLoading && !isError && rawRows.length > 0 && rows.length === 0 && (
          <div
            className='py-10 text-center text-sm'
            style={{ color: '#99A1AF' }}
          >
            No accounts match your search.
          </div>
        )}

        {/* ── Rows ── */}
        {rows.map((row) => {
          const isExpanded = expandedRowId === row.accountId
          return (
            <div key={row.accountId}>
              <div
                className='flex min-h-[49px] min-w-0 cursor-pointer items-center transition-colors hover:bg-[#F5F7FF]'
                style={{
                  borderBottom: isExpanded ? 'none' : '1px #C5D4F0 solid',
                  paddingLeft: T.padX,
                  paddingRight: T.padX,
                  gap: T.gap
                }}
                onClick={() => toggleRow(row)}
              >
                <div className='min-w-0 shrink-0' style={{ width: T.account }}>
                  <AccountCell name={row.name} domain={row.domain} />
                </div>
                <div className='min-w-0 shrink-0' style={{ width: T.overlap }}>
                  {introRequestedAccountIds.includes(row.accountId) ||
                  row.recommendedAction === 'INTRO_REQUESTED' ? (
                    <OverlapBadge
                      type='Intro Pending'
                      overrideBg='#bdfad7'
                      overrideColor='#28a745'
                    />
                  ) : (
                    <OverlapBadge type={row.overlapType} />
                  )}
                </div>
                <div className='flex min-w-0 flex-1' style={{ gap: T.gap }}>
                  <div
                    className='min-w-0 flex-1 basis-0'
                    style={{ minWidth: T.score }}
                  >
                    <ScoreBar score={row.opportunityScore} />
                  </div>
                  <div
                    className='min-w-0 flex-1 basis-0'
                    style={{ minWidth: T.stage }}
                  >
                    <StageBadge stage={row.yourStage} variant='your' />
                  </div>
                  <div
                    className='min-w-0 flex-1 basis-0'
                    style={{ minWidth: T.stage }}
                  >
                    <StageBadge stage={row.partnerStage} variant='partner' />
                  </div>
                </div>
                <div className='shrink-0' style={{ width: T.acv }}>
                  <span
                    style={{
                      color: '#4D5C78',
                      fontSize: 15,
                      fontWeight: 700,
                      lineHeight: '20px'
                    }}
                  >
                    {formatACV(row.estimatedACV)}
                  </span>
                </div>
                <div
                  className='flex shrink-0 justify-center'
                  style={{ width: ACTION_COL_PX }}
                >
                  {startedAccountIds.includes(row.accountId) ||
                  row.recommendedAction === 'VIEW' ? (
                    <ActionButton
                      action='VIEW'
                      label='View'
                      onClick={(e) => {
                        e.stopPropagation()
                        const pId = cosellPartnerOrgId
                        const dId =
                          row.currentPartnerDealId ||
                          row.targetPartnerDealId ||
                          ''
                        const type = cosellReportType || 'CUSTOMER_CUSTOMER'
                        if (pId && dId) {
                          router.push(
                            `/partner-mapping/cosell-workspace/${pId}?dealId=${dId}&type=${type}`
                          )
                        } else {
                          onOpenCoSell(row)
                        }
                      }}
                    />
                  ) : introRequestedAccountIds.includes(row.accountId) ||
                    row.recommendedAction === 'INTRO_REQUESTED' ? (
                    <ActionButton
                      action='INTRO_REQUESTED'
                      label='Intro Requested'
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleRow(row)
                      }}
                      overrideStyle={{
                        background: '#ffffff',
                        border: '1px solid #6B4FBB',
                        color: '#6B4FBB'
                      }}
                    />
                  ) : (
                    <ActionButton
                      action={row.recommendedAction}
                      onClick={(e) => {
                        e.stopPropagation()
                        const a = row.recommendedAction
                        const isClosed =
                          row.yourStage === 'CLOSED_CUSTOMER' &&
                          row.partnerStage === 'CLOSED_CUSTOMER'

                        if (a === 'START_COSELL' || isClosed) {
                          onOpenCoSell(row)
                        } else if (a === 'REQUEST_INTRO') {
                          onOpenRequestIntro(row)
                        } else if (
                          a === 'ADD_TO_PIPELINE' ||
                          a === 'ESCALATE_TO_DEAL'
                        ) {
                          onOpenAddToPipeline(row)
                        } else {
                          toggleRow(row)
                        }
                      }}
                    />
                  )}
                </div>
              </div>

              {isExpanded &&
              (introRequestedAccountIds.includes(row.accountId) ||
                row.recommendedAction === 'INTRO_REQUESTED') ? (
                <IntroTrackerRowPanel
                  row={row}
                  partnerId={
                    cosellPartnerOrgId ? Number(cosellPartnerOrgId) : undefined
                  }
                  dealId={
                    row.currentPartnerDealId ||
                    row.targetPartnerDealId ||
                    undefined
                  }
                />
              ) : isExpanded ? (
                <ExpandedRowPanel
                  row={row}
                  reportPartnerName={reportPartnerName}
                  cosellPartnerOrgId={cosellPartnerOrgId}
                  cosellReportType={cosellReportType || undefined}
                  onClose={() => setExpandedRowId(null)}
                  onCoSell={() => onOpenCoSell(row)}
                  onRequestIntro={() => onOpenRequestIntro(row)}
                  onAddToPipeline={() => onOpenAddToPipeline(row)}
                />
              ) : null}
            </div>
          )
        })}
      </div>
      {showPagination && (
        <SharedAccountsPaginationBar
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={onPageChange!}
          onPageSizeChange={onPageSizeChange!}
        />
      )}
    </div>
  )
}

export default function SharedAccountsTable({
  data,
  isLoading = false,
  isError = false,
  searchQuery,
  page,
  totalElements,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  cosellPartnerOrgId,
  cosellReportType,
  cosellWorkspaceSubtitle,
  reportPartnerName
}: Props) {
  const org = useSelector((s: RootState) => s.currentOrg?.organization)
  const pipelineOwnerLabel =
    org?.name || org?.legalName || org?.primaryEmail || 'Your team'

  const [coSellOpen, setCoSellOpen] = useState(false)
  const [coSellAccount, setCoSellAccount] = useState<SharedAccount | null>(null)
  const [requestIntroOpen, setRequestIntroOpen] = useState(false)
  const [addToPipelineOpen, setAddToPipelineOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<SharedAccount | null>(null)
  const [introRequestedAccountIds, setIntroRequestedAccountIds] = useState<
    string[]
  >([])

  return (
    <>
      <StartCoSellDrawer
        open={coSellOpen}
        onOpenChange={setCoSellOpen}
        partnerOrgId={cosellPartnerOrgId}
        reportType={cosellReportType}
        workspaceSubtitle={cosellWorkspaceSubtitle}
        accountId={coSellAccount?.accountId}
        accountName={coSellAccount?.name}
        accountDomain={coSellAccount?.domain}
        partnerName={reportPartnerName}
        estimatedACV={coSellAccount?.estimatedACV}
        opportunityScore={coSellAccount?.opportunityScore}
        yourStage={coSellAccount?.yourStage}
        partnerStage={coSellAccount?.partnerStage}
        targetPartnerDealId={coSellAccount?.targetPartnerDealId}
        currentPartnerDealId={coSellAccount?.currentPartnerDealId}
      />
      <RequestIntroDrawer
        open={requestIntroOpen}
        onOpenChange={setRequestIntroOpen}
        organizationId={org?.id ? Number(org.id) : undefined}
        dealId={
          selectedRow?.currentPartnerDealId ||
          selectedRow?.targetPartnerDealId ||
          undefined
        }
        accountName={selectedRow?.name}
        onSuccess={() => {
          if (selectedRow?.accountId) {
            setIntroRequestedAccountIds((prev) => [
              ...prev,
              selectedRow.accountId
            ])
          }
        }}
      />
      <AddToPipelineDrawer
        open={addToPipelineOpen}
        onOpenChange={setAddToPipelineOpen}
        accountName={selectedRow?.name}
        estimatedACV={selectedRow?.estimatedACV}
        opportunityScore={selectedRow?.opportunityScore}
      />
      <SharedAccountsTableView
        data={data}
        isLoading={isLoading}
        isError={isError}
        searchQuery={searchQuery}
        page={page}
        totalElements={totalElements}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pipelineOwnerLabel={pipelineOwnerLabel}
        reportPartnerName={reportPartnerName}
        cosellPartnerOrgId={cosellPartnerOrgId}
        introRequestedAccountIds={introRequestedAccountIds}
        onOpenCoSell={(row) => {
          setCoSellAccount(row)
          setCoSellOpen(true)
        }}
        onOpenRequestIntro={(row) => {
          setSelectedRow(row)
          setRequestIntroOpen(true)
        }}
        onOpenAddToPipeline={(row) => {
          setSelectedRow(row)
          setAddToPipelineOpen(true)
        }}
      />
    </>
  )
}

function IntroTrackerRowPanel({
  row,
  partnerId,
  dealId
}: {
  row: SharedAccount
  partnerId?: number
  dealId?: string
}) {
  const { data, isLoading, isError } = useIntroTracker(partnerId, dealId)

  if (isLoading) {
    return (
      <div className='flex h-[300px] w-full items-center justify-center bg-[#F9FAFB] text-sm text-[#6B7280]'>
        Loading tracker details...
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className='flex h-[300px] w-full items-center justify-center bg-[#F9FAFB] text-sm text-[#EF4444]'>
        Failed to load tracker details.
      </div>
    )
  }

  const stages = data.stages || []
  const monitor = data.responseMonitor || {}

  return (
    <div
      style={{
        background: '#F8F9FA',
        borderTop: '2px #AA9DD0 solid',
        borderBottom: '1px #AA9DD0 solid',
        padding: '30px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24
      }}
    >
      {/* Tracker Progress Bar */}
      <div className='relative flex w-full items-center justify-between px-10'>
        {/* Line behind steps */}
        <div className='absolute left-10 right-10 top-1/2 h-0.5 -translate-y-1/2 bg-[#00A96B]'></div>
        {stages.map((stage, idx) => {
          const isCompleted = stage.completed
          const isActive = stage.active
          const isLast = idx === stages.length - 1

          let circleBg = '#9CA3AF'
          let Icon = null
          if (isCompleted) {
            circleBg = '#00A96B'
            Icon = <Check className='h-4 w-4 text-white' />
          } else if (isActive) {
            circleBg = '#FF6B4A'
          }

          return (
            <div
              key={idx}
              className='relative z-10 flex flex-col items-center gap-2'
            >
              <div
                className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-sm'
                style={{ backgroundColor: circleBg }}
              >
                {Icon}
              </div>
              <div
                className='absolute top-8 text-center text-xs'
                style={{
                  color: isCompleted
                    ? '#00A96B'
                    : isActive
                      ? '#FF6B4A'
                      : '#10B981',
                  fontWeight: isActive || isCompleted ? 600 : 500,
                  width: 120,
                  marginLeft: -60,
                  left: '50%'
                }}
              >
                {stage.stageName}
              </div>
            </div>
          )
        })}
      </div>

      {/* Response Monitor Block */}
      <div className='mt-10 rounded-xl border border-[#D5C2FF] bg-[#F5F3FF] p-6 shadow-sm'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Lightbulb className='h-4 w-4 text-[#1F2937]' />
            <span className='text-[15px] font-bold text-[#1F2937]'>
              Response Monitor
            </span>
          </div>
          {monitor.lastChecked && (
            <span className='text-xs font-medium text-[#6B7280]'>
              Last Checked : {monitor.lastChecked}
            </span>
          )}
        </div>

        <div className='grid grid-cols-3 gap-8'>
          <div className='flex flex-col gap-3'>
            <span className='text-[13px] font-medium text-[#1F2937]'>
              Partner intro email
            </span>
            <div className='flex items-center gap-2'>
              {monitor.emailDelivered ? (
                <Check className='h-4 w-4 text-[#00A96B]' strokeWidth={3} />
              ) : (
                <div className='h-4 w-4' />
              )}
              <span className='text-[13px] text-[#1F2937]'>
                Email delivered
              </span>
            </div>
            <div className='flex items-center gap-2'>
              {monitor.replyReceived ? (
                <Check className='h-4 w-4 text-[#00A96B]' strokeWidth={3} />
              ) : (
                <div className='h-4 w-4' />
              )}
              <span className='text-[13px] text-[#1F2937]'>Reply received</span>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center'>
            <div className='flex h-12 w-12 items-center justify-center rounded-bl-[20px] rounded-br-[20px] rounded-tl-[20px] bg-[#1F2937] text-xl font-bold text-[#00A96B] shadow-md'>
              S
            </div>
          </div>

          <div className='flex flex-col justify-center gap-3'>
            <div className='flex items-center gap-2'>
              {monitor.emailOpened ? (
                <Check className='h-4 w-4 text-[#00A96B]' strokeWidth={3} />
              ) : (
                <div className='h-4 w-4' />
              )}
              <span className='text-[13px] text-[#1F2937]'>
                Email opened{' '}
                {monitor.emailOpenedAt ? `(Yes, ${monitor.emailOpenedAt})` : ''}
              </span>
            </div>
            {monitor.responseDeadline && (
              <div className='flex items-center gap-2'>
                <Check className='h-4 w-4 text-[#00A96B]' strokeWidth={3} />
                <span className='text-[13px] text-[#1F2937]'>
                  Response Deadline : {monitor.responseDeadline}
                </span>
              </div>
            )}
          </div>
        </div>

        {monitor.timeRemaining && (
          <div className='mt-8 flex flex-col gap-2'>
            <span className='text-xs font-semibold text-[#4B5563]'>
              Time remaining for response
            </span>
            <div className='h-3.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]'>
              <div className='h-full w-[85%] rounded-full bg-[#FF6B4A]'></div>
            </div>
            <span className='self-end text-xs font-semibold text-[#FF6B4A]'>
              {monitor.timeRemaining}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
