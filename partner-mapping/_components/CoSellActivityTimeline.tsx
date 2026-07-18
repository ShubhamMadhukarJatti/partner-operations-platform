'use client'

import { useEffect } from 'react'
import {
  useCreatePartnerActivity,
  usePartnerActivityTimeline
} from '@/http-hooks/partner-activities'
import { RootState } from '@/redux/store'
import type { PartnerActivityItem } from '@/services/account-mapping-activities'
import { addDays, format, isValid, parseISO } from 'date-fns'
import {
  Activity,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Edit2,
  FileUp,
  Mail,
  PlusCircle,
  Rocket,
  Target,
  Trash2
} from 'lucide-react'
import { useSelector } from 'react-redux'

import { formatDate } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { showCustomToast } from '@/components/custom-toast'

type Props = {
  partnerOrgId: number | null
  dealId?: string | null
}

/** Backend `type` strings may evolve; extend mapping when enums are documented. */
type ActivityVisualVariant =
  | 'completed'
  | 'in_progress'
  | 'scheduled'
  | 'email_sent'
  | 'asset_uploaded'
  | 'pitch_saved'
  | 'next_step_created'
  | 'next_step_modified'
  | 'next_step_deleted'
  | 'workspace_initiated'
  | 'default'

function normalizeActivityVariant(
  type: string,
  title: string
): ActivityVisualVariant {
  const t = type?.toLowerCase?.() ?? ''
  const titleLower = title?.toLowerCase?.() ?? ''

  if (
    t.includes('initiated') ||
    t.includes('workspace_initiated') ||
    titleLower.includes('initiated') ||
    titleLower.includes('established')
  ) {
    return 'workspace_initiated'
  }

  if (
    t.includes('email') ||
    t.includes('notification') ||
    titleLower.includes('email') ||
    titleLower.includes('notification') ||
    titleLower.includes('message')
  ) {
    return 'email_sent'
  }

  if (
    t.includes('asset') ||
    titleLower.includes('asset') ||
    titleLower.includes('file') ||
    titleLower.includes('document')
  ) {
    return 'asset_uploaded'
  }

  if (
    t.includes('pitch') ||
    titleLower.includes('pitch') ||
    titleLower.includes('joint value')
  ) {
    return 'pitch_saved'
  }

  if (titleLower.includes('deleted') || titleLower.includes('removed')) {
    return 'next_step_deleted'
  }
  if (
    titleLower.includes('modified') ||
    titleLower.includes('updated') ||
    titleLower.includes('edited')
  ) {
    return 'next_step_modified'
  }
  if (titleLower.includes('created') || titleLower.includes('added')) {
    return 'next_step_created'
  }
  if (
    titleLower.includes('completed') ||
    titleLower.includes('toggled') ||
    titleLower.includes('checked') ||
    titleLower.includes('done') ||
    t.includes('complete') ||
    t.includes('success')
  ) {
    return 'completed'
  }

  if (
    titleLower.includes('scheduled') ||
    t.includes('scheduled') ||
    t.includes('upcoming')
  ) {
    return 'scheduled'
  }

  if (
    t.includes('progress') ||
    t.includes('pending') ||
    t.includes('in_progress')
  ) {
    return 'in_progress'
  }

  return 'default'
}

function formatActivityDate(dateStr: string): string {
  if (!dateStr?.trim()) return ''
  try {
    return formatDate(dateStr.trim(), 'MMM d, y')
  } catch {
    try {
      const d = parseISO(dateStr.trim())
      if (isValid(d)) return format(d, 'MMM d, y')
    } catch {
      /* fall through */
    }
    return dateStr.trim()
  }
}

/** Google Calendar all-day template: end date is exclusive (next day). */
function buildGoogleCalendarUrl(item: PartnerActivityItem): string | null {
  const text = encodeURIComponent(item.title || 'Event')
  let d: Date | null = null
  try {
    const parsed = parseISO(item.date.trim())
    if (isValid(parsed)) d = parsed
    else {
      const fallback = new Date(item.date)
      if (isValid(fallback)) d = fallback
    }
  } catch {
    return null
  }
  if (!d) return null
  const start = format(d, 'yyyyMMdd')
  const end = format(addDays(d, 1), 'yyyyMMdd')
  const dates = `${start}/${end}`
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}`
}

const SKELETON_ROWS = 5

function ActivityTimelineSkeleton() {
  return (
    <div className='space-y-0 px-[21px] pb-5 pt-[21px]' aria-hidden>
      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
        <div
          key={i}
          className={cn('flex gap-3', i < SKELETON_ROWS - 1 && 'pb-5')}
        >
          <div className='flex w-9 shrink-0 flex-col items-center'>
            <Skeleton className='size-9 rounded-full bg-[#EEF1F6]' />
            {i < SKELETON_ROWS - 1 ? (
              <div
                className='my-2 min-h-[18px] w-px flex-1 bg-[#E5E7EB]/80'
                aria-hidden
              />
            ) : null}
          </div>
          <div className='min-w-0 flex-1 space-y-2 pb-2 pt-1'>
            <Skeleton className='h-4 w-[72%] max-w-md rounded-sm bg-[#EEF1F6]' />
            <Skeleton className='h-3 w-[40%] max-w-xs rounded-sm bg-[#EEF1F6]' />
          </div>
        </div>
      ))}
    </div>
  )
}

function TimelineIcon({ variant }: { variant: ActivityVisualVariant }) {
  switch (variant) {
    case 'workspace_initiated':
      return (
        <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-[#C7D2FE] bg-[#EEF2FF] text-[#6366F1]'>
          <Rocket
            className='size-5 text-[#6366F1]'
            strokeWidth={2}
            aria-hidden
          />
        </div>
      )
    case 'email_sent':
      return (
        <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-[#BFDBFE] bg-[#EFF6FF] text-[#3B82F6]'>
          <Mail className='size-5 text-[#3B82F6]' strokeWidth={2} aria-hidden />
        </div>
      )
    case 'asset_uploaded':
      return (
        <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-[#CCFBF1] bg-[#F0FDF4] text-[#0D9488]'>
          <FileUp
            className='size-5 text-[#0D9488]'
            strokeWidth={2}
            aria-hidden
          />
        </div>
      )
    case 'pitch_saved':
      return (
        <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-[#FFE4E6] bg-[#FFF1F2] text-[#E11D48]'>
          <Target
            className='size-5 text-[#E11D48]'
            strokeWidth={2}
            aria-hidden
          />
        </div>
      )
    case 'next_step_created':
      return (
        <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-[#F3E8FF] bg-[#FAF5FF] text-[#8B5CF6]'>
          <PlusCircle
            className='size-5 text-[#8B5CF6]'
            strokeWidth={2}
            aria-hidden
          />
        </div>
      )
    case 'next_step_modified':
      return (
        <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-[#FEF3C7] bg-[#FFFBEB] text-[#D97706]'>
          <Edit2
            className='size-4 text-[#D97706]'
            strokeWidth={2}
            aria-hidden
          />
        </div>
      )
    case 'next_step_deleted':
      return (
        <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-[#FEE2E2] bg-[#FEF2F2] text-[#EF4444]'>
          <Trash2
            className='size-4 text-[#EF4444]'
            strokeWidth={2}
            aria-hidden
          />
        </div>
      )
    case 'completed':
      return (
        <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-[#D1FAE5] bg-[#ECFDF5] text-[#10B981]'>
          <CheckCircle2
            className='size-5 text-[#10B981]'
            strokeWidth={2}
            aria-hidden
          />
        </div>
      )
    case 'in_progress':
      return (
        <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-[#E0F2FE] bg-[#F0F9FF] text-[#0284C7]'>
          <Clock
            className='size-5 text-[#0284C7]'
            strokeWidth={2}
            aria-hidden
          />
        </div>
      )
    case 'scheduled':
      return (
        <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-[#C7D2FE] bg-[#EEF2FF] text-[#4F46E5]'>
          <Rocket
            className='size-5 text-[#4F46E5]'
            strokeWidth={2}
            aria-hidden
          />
        </div>
      )
    default:
      return (
        <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-[#F1F5F9] bg-[#F8FAFC] text-[#475569]'>
          <Activity
            className='size-5 text-[#475569]'
            strokeWidth={2}
            aria-hidden
          />
        </div>
      )
  }
}

export function CoSellActivityTimeline({ partnerOrgId, dealId }: Props) {
  const { data, isLoading, isError, error, refetch } =
    usePartnerActivityTimeline(partnerOrgId, dealId)

  const org = useSelector((s: RootState) => s.currentOrg?.organization)
  const createActivityMutation = useCreatePartnerActivity(partnerOrgId, dealId)

  useEffect(() => {
    if (isError && error?.message) {
      showCustomToast('Error', error.message, 'error', 5000)
    }
  }, [isError, error])

  useEffect(() => {
    if (
      !isLoading &&
      !isError &&
      data &&
      Array.isArray(data) &&
      data.length === 0 &&
      partnerOrgId &&
      dealId
    ) {
      createActivityMutation.mutate({
        partnerOrgId: partnerOrgId,
        title: 'Co-sell Workspace Initiated',
        description:
          'Collaborative selling workspace successfully established.',
        activityType: 'workspace_initiated',
        userName: org?.name || 'Your team',
        dealId: dealId
      })
    }
  }, [data, isLoading, isError, partnerOrgId, dealId, org?.name])

  const items = Array.isArray(data) ? data : []

  return (
    <section className='rounded-[14px] border border-[#F3F4F6] bg-white'>
      {isError && (
        <p className='border-b border-[#F3F4F6] px-[21px] py-4 text-xs text-[#A91B22]'>
          {error?.message ?? 'Could not load activity.'}{' '}
          <button
            type='button'
            className='font-medium text-[#6B4FBB] underline'
            onClick={() => refetch()}
          >
            Retry
          </button>
        </p>
      )}

      {isLoading && <ActivityTimelineSkeleton />}

      {!isLoading && !isError && items.length === 0 && (
        <p className='px-[21px] py-12 text-center text-xs text-[#5F6F8D]'>
          No activity yet for this partner workspace.
        </p>
      )}

      {!isLoading && items.length > 0 && (
        <ul className='list-none px-[21px] pb-5 pt-[21px]'>
          {items.map((item, index) => {
            const variant = normalizeActivityVariant(item.type, item.title)
            const calUrl =
              variant === 'scheduled' ? buildGoogleCalendarUrl(item) : null
            const isLast = index === items.length - 1
            const metaDate = formatActivityDate(item.date)
            const key = `${item.title}-${item.date}-${item.actor}-${index}`

            return (
              <li key={key} className={cn('flex gap-3', !isLast && 'pb-5')}>
                <div className='flex w-9 shrink-0 flex-col items-center'>
                  <TimelineIcon variant={variant} />
                  {!isLast ? (
                    <div
                      className='my-1 min-h-[18px] w-px flex-1 bg-[#E5E7EB]'
                      aria-hidden
                    />
                  ) : null}
                </div>
                <div className='min-w-0 flex-1 pt-0.5'>
                  <p className='text-[13px] font-semibold leading-[19.5px] tracking-[-0.076px] text-[#1A1A2E]'>
                    {item.title}
                  </p>
                  {item.description?.trim() ? (
                    <p className='mt-1 text-xs leading-4 text-[#5F6F8D]'>
                      {item.description.trim()}
                    </p>
                  ) : null}
                  <p className='mt-1 text-[11px] leading-[16.5px] tracking-[0.06px] text-[#5F6F8D]'>
                    {metaDate}
                    {item.actor?.trim() ? ` — ${item.actor.trim()}` : ''}
                  </p>
                  {calUrl ? (
                    <a
                      href={calUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#3E50F7] hover:underline'
                    >
                      <CalendarPlus className='size-3.5 shrink-0' aria-hidden />
                      Add to calendar
                    </a>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
