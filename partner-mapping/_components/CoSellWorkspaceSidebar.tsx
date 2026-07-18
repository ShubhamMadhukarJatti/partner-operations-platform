'use client'

import { useMemo } from 'react'
import { format, isValid, parseISO } from 'date-fns'
import { Award, MessageSquare, Phone, Share2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

import { useCoSellHealth, useDealOwnerDetails } from '../api'

function HealthScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (score / 100) * circumference
  return (
    <div className='relative mx-auto size-[100px]'>
      <svg className='size-full -rotate-90' viewBox='0 0 100 100' aria-hidden>
        <circle
          cx='50'
          cy='50'
          r='42'
          fill='none'
          stroke='#EDE9FE'
          strokeWidth='10'
        />
        <circle
          cx='50'
          cy='50'
          r='42'
          fill='none'
          stroke='#6B4FBB'
          strokeWidth='10'
          strokeLinecap='round'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className='absolute inset-0 flex flex-col items-center justify-center pt-1'>
        <span className='text-2xl font-bold text-[#6B4FBB]'>{score}</span>
        <span className='text-[10px] font-normal text-[#2A3241]'>
          Health Score
        </span>
      </div>
    </div>
  )
}

function WinProbabilityBar({
  directPct,
  cosellPct
}: {
  directPct: number
  cosellPct: number
}) {
  return (
    <div className='space-y-2'>
      <div className='flex justify-between text-[10px] leading-[15px] tracking-[0.12px] text-[#506385]'>
        <span>Direct: {directPct}%</span>
        <span>Co-sell: {cosellPct}%</span>
      </div>
      <div className='relative h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]'>
        <div
          className='absolute left-0 top-0 h-full rounded-full bg-[#D1D5DB]'
          style={{ width: `${directPct}%` }}
        />
        <div
          className='absolute left-0 top-0 h-full rounded-full bg-[#6B4FBB]'
          style={{ width: `${cosellPct}%` }}
        />
      </div>
    </div>
  )
}

function cleanStage(stage?: string): string {
  if (!stage) return 'APPROVED'
  const s = stage.toUpperCase()
  if (s.includes('APPROV')) return 'APPROVED'
  if (s.includes('CLOSE') || s.includes('WON') || s.includes('LOST'))
    return 'CLOSED'
  return s
}

function parseAmount(amt?: string | number): number {
  if (amt == null) return 50000
  if (typeof amt === 'number') return amt
  const cleaned = amt.replace(/[^0-9.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) || parsed <= 0 ? 50000 : parsed
}

type CoSellWorkspaceSidebarProps = {
  /** When set (e.g. on Assets tab), invoked by "Share New Asset". */
  onShareNewAsset?: () => void
  partnerOrgId: number | null
  dealId?: string | null
  vendorOrgId: number | null
}

export function CoSellWorkspaceSidebar({
  onShareNewAsset,
  partnerOrgId,
  dealId,
  vendorOrgId
}: CoSellWorkspaceSidebarProps) {
  const { data: dealDetails, isLoading: isDealLoading } = useDealOwnerDetails(
    vendorOrgId,
    dealId
  )
  const { data: partnerDealDetails, isLoading: isPartnerDealLoading } =
    useDealOwnerDetails(partnerOrgId, dealId)

  const payload = useMemo(() => {
    if (!dealId || !vendorOrgId || !partnerOrgId) return null

    const dealStageVal = cleanStage(dealDetails?.dealStage)
    const partnerStageVal = cleanStage(partnerDealDetails?.dealStage)
    const amountVal = parseAmount(dealDetails?.amountAcv)

    let diffDays = 0
    if (dealDetails?.closeDate && partnerDealDetails?.closeDate) {
      try {
        const dateA = parseISO(dealDetails.closeDate)
        const dateB = parseISO(partnerDealDetails.closeDate)
        if (isValid(dateA) && isValid(dateB)) {
          diffDays = Math.abs(
            Math.round(
              (dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24)
            )
          )
        }
      } catch {}
    }

    let daysToCloseVal = 45
    if (dealDetails?.closeDate) {
      try {
        const targetDate = parseISO(dealDetails.closeDate)
        if (isValid(targetDate)) {
          const today = new Date()
          daysToCloseVal = Math.max(
            0,
            Math.round(
              (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            )
          )
        }
      } catch {}
    }

    return {
      dealStage: dealStageVal,
      dealSize: amountVal,
      icpMatched: true,
      stakeholderContacts: 3,
      championEngaged: true,
      competitiveThreat: false,
      budgetConfirmed: true,
      partnerCloseRateWithCompany: 0.35,
      partnerGeneralCloseRate: 0.28,
      contactCount: 4,
      signedAgreement: true,
      lastUpdateDaysAgo: 1,
      avgResponseHours: 3.5,
      activitiesLast7Days: 2,
      commissionAllocated: true,
      mdfAllocated: false,
      partnerStage: partnerStageVal,
      committeeFormed: true,
      projectedCloseDateDifferenceDays: diffDays,
      daysToClose: daysToCloseVal,
      stakeholderVelocity: 'FAST',
      currentBudgetCycle: true,
      momentum: 'ACCELERATING',
      procurementRisk: 'NOT_REQUIRED',
      competitorMentioned: false,
      legalReviewRequired: false,
      accelerating: true,
      contractFirmCloseDate: true
    }
  }, [dealId, vendorOrgId, partnerOrgId, dealDetails, partnerDealDetails])

  const {
    data: healthData,
    isLoading: isHealthLoading,
    isError: isHealthError
  } = useCoSellHealth(payload)

  const isLoadingData = isDealLoading || isPartnerDealLoading || isHealthLoading
  const showCalculated = !isLoadingData && !isHealthError && healthData

  const finalScore = showCalculated
    ? Math.round(
        healthData.finalScore <= 1
          ? healthData.finalScore * 100
          : healthData.finalScore
      )
    : 72
  const coSellWinProbability = showCalculated
    ? Math.round(
        healthData.coSellWinProbability <= 1
          ? healthData.coSellWinProbability * 100
          : healthData.coSellWinProbability
      )
    : 74
  const directWinProbability = showCalculated
    ? Math.round(
        healthData.directWinProbability <= 1
          ? healthData.directWinProbability * 100
          : healthData.directWinProbability
      )
    : 48

  const partnerResponsiveness = useMemo(() => {
    if (!showCalculated) return 'Excellent'
    const pts = healthData.partnerResponsivenessPoints
    if (pts > 70) return 'Excellent'
    if (pts > 40) return 'Good'
    return 'Low'
  }, [showCalculated, healthData?.partnerResponsivenessPoints])

  const stageAlignment = useMemo(() => {
    if (!showCalculated) return 'Good'
    const pts = healthData.stageAlignmentPoints
    if (pts > 70) return 'Excellent'
    if (pts > 40) return 'Good'
    return 'Low'
  }, [showCalculated, healthData?.stageAlignmentPoints])

  const timelineRisk = useMemo(() => {
    if (!showCalculated) return 'Low'
    const pts = healthData.timelineRiskPoints
    if (pts < 30) return 'Low'
    if (pts < 60) return 'Medium'
    return 'High'
  }, [showCalculated, healthData?.timelineRiskPoints])

  const projectedClose = useMemo(() => {
    const rawDate = healthData?.projectedCloseDate || dealDetails?.closeDate
    if (!rawDate) return 'Not set'
    try {
      const parsed = parseISO(rawDate)
      if (isValid(parsed)) {
        return format(parsed, 'MMM d, yyyy')
      }
    } catch {}
    return rawDate
  }, [healthData?.projectedCloseDate, dealDetails?.closeDate])

  return (
    <aside className='w-full shrink-0 space-y-4 lg:w-[280px]'>
      <section className='rounded-[14px] border border-[#F3F4F6] bg-white px-[21px] pb-5 pt-[21px]'>
        <h2 className='mb-3 text-sm font-semibold tracking-[-0.15px] text-[#1A1A2E]'>
          Co-sell Health
        </h2>
        {isLoadingData ? (
          <div className='flex flex-col items-center justify-center space-y-4 py-4'>
            <Skeleton className='size-[100px] rounded-full' />
            <div className='w-full space-y-2 px-4'>
              <Skeleton className='h-3 w-full' />
              <Skeleton className='h-3 w-5/6' />
              <Skeleton className='h-3 w-4/5' />
            </div>
          </div>
        ) : (
          <>
            <HealthScoreRing score={finalScore} />
            <ul className='mt-3 space-y-1.5'>
              <li className='relative pl-4 text-xs leading-4 text-[#0A0A0A]'>
                <span className='absolute left-0 top-1 size-2 rounded-full bg-[#4D5C78]' />
                Partner responsiveness:{' '}
                <span
                  className={cn(
                    'font-bold',
                    partnerResponsiveness === 'Excellent'
                      ? 'text-[#00A63E]'
                      : partnerResponsiveness === 'Good'
                        ? 'text-[#3E50F7]'
                        : 'text-[#FB2C36]'
                  )}
                >
                  {partnerResponsiveness}
                </span>
              </li>
              <li className='relative pl-4 text-xs leading-4 text-[#0A0A0A]'>
                <span className='absolute left-0 top-1 size-2 rounded-full bg-[#4D5C78]' />
                Stage alignment:{' '}
                <span
                  className={cn(
                    'font-bold',
                    stageAlignment === 'Excellent'
                      ? 'text-[#00A63E]'
                      : stageAlignment === 'Good'
                        ? 'text-[#3E50F7]'
                        : 'text-[#FB2C36]'
                  )}
                >
                  {stageAlignment}
                </span>
              </li>
              <li className='relative pl-4 text-xs leading-4 text-[#0A0A0A]'>
                <span className='absolute left-0 top-1 size-2 rounded-full bg-[#4D5C78]' />
                Timeline risk:{' '}
                <span
                  className={cn(
                    'font-bold',
                    timelineRisk === 'Low'
                      ? 'text-[#00A63E]'
                      : timelineRisk === 'Medium'
                        ? 'text-[#F59E0B]'
                        : 'text-[#FB2C36]'
                  )}
                >
                  {timelineRisk}
                </span>
              </li>
            </ul>
          </>
        )}
      </section>

      <section className='rounded-[14px] bg-[#F8F9FB] px-4 pb-4 pt-4'>
        {isLoadingData ? (
          <div className='space-y-4'>
            <div>
              <Skeleton className='h-3 w-20' />
              <Skeleton className='mt-2 h-6 w-32' />
            </div>
            <div>
              <Skeleton className='h-3 w-40' />
              <Skeleton className='mt-2 h-8 w-16' />
              <Skeleton className='mt-1 h-3 w-32' />
            </div>
          </div>
        ) : (
          <>
            <p className='text-xs leading-4 text-[#6A7282]'>Projected close:</p>
            <p className='mt-1 text-lg font-bold tracking-[-0.44px] text-[#1A1A2E]'>
              {projectedClose}
            </p>
            <p className='mt-4 text-xs leading-4 text-[#354055]'>
              Win probability with co-sell:
            </p>
            <p className='mt-1 text-2xl font-bold tracking-[0.07px] text-[#6B4FBB]'>
              {coSellWinProbability}%
            </p>
            <p className='mt-1 text-[11px] leading-[16.5px] tracking-[0.06px] text-[#404C60]'>
              vs. {directWinProbability}% without partner
            </p>
            <div className='mt-3'>
              <WinProbabilityBar
                directPct={directWinProbability}
                cosellPct={coSellWinProbability}
              />
            </div>
          </>
        )}
      </section>

      <div className='space-y-2'>
        <button
          type='button'
          className='flex h-9 w-full items-center justify-center gap-2 rounded-[10px] bg-[#3E50F7] text-xs font-semibold text-white'
        >
          <Phone className='size-4' aria-hidden />
          Schedule Joint Call
        </button>
        <button
          type='button'
          className='flex h-9 w-full items-center justify-center gap-2 rounded-[10px] border border-[#6B4FBB] bg-white text-xs font-semibold text-[#6B4FBB]'
        >
          <MessageSquare className='size-4' aria-hidden />
          Message Partner AE
        </button>
        <button
          type='button'
          className='flex h-9 w-full items-center justify-center gap-2 rounded-[10px] border border-[#D1D5DC] bg-white text-xs font-semibold text-[#6A7282]'
          onClick={() => onShareNewAsset?.()}
        >
          <Share2 className='size-4' aria-hidden />
          Share New Asset
        </button>
        <button
          type='button'
          className='w-full py-2 text-center text-xs font-medium text-[#FB2C36]'
        >
          Flag Issue
        </button>
      </div>

      <section className='flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-[#6B4FBB] p-5'>
        <div className='flex size-14 items-center justify-center rounded-full bg-[#EDE9FE]'>
          <Award className='size-7 text-[#6B4FBB]' aria-hidden />
        </div>
        <div className='text-center'>
          <p className='text-[15px] font-semibold leading-[19.5px] tracking-[-0.076px] text-[#2A3241]'>
            Attribution Certificate
          </p>
          <p className='mt-1.5 text-xs leading-[19.5px] text-[#2A3241]'>
            Available after deal closes
          </p>
        </div>
        <button
          type='button'
          className='rounded-[25px] bg-[#3E50F7] px-3 py-0.5 text-[11px] font-medium tracking-[0.06px] text-white'
        >
          Generate Preview
        </button>
      </section>
    </aside>
  )
}
