'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Calculator,
  CircleHelp,
  FileText,
  Mail,
  Play
} from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'
import { PartnerProgramPortalScaffold } from '@/app/partner-program-portal-app/_components/PartnerProgramPortalScaffold'
import { usePartnerSession } from '@/app/partner-program-portal-app/_components/PartnerSessionContext'

export interface ResourceApiRecord {
  id: number
  title: string
  description: string
  link: string
  created: string
  updated: string
}

function getIconForResource(title: string) {
  const t = title.toLowerCase()
  if (t.includes('video') || t.includes('demo')) return Play
  if (t.includes('email') || t.includes('template')) return Mail
  if (t.includes('case study')) return BookOpen
  if (t.includes('faq') || t.includes('help')) return CircleHelp
  return FileText
}

function formatUsd(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  })
}

function commissionRangeLabel(
  acv: number,
  tier: 'champion' | 'referral'
): string {
  if (tier === 'champion') {
    return `${formatUsd(acv * 0.15)} - ${formatUsd(acv * 0.2)}`
  }
  return `${formatUsd(acv * 0.08)} - ${formatUsd(acv * 0.1)}`
}

function ResourceCard({
  item,
  tall
}: {
  item: ResourceApiRecord
  tall: boolean
}) {
  const Icon = getIconForResource(item.title)

  function handleAction() {
    if (item.link) {
      window.open(item.link, '_blank')
    } else {
      toast.error('No link available for this resource.')
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col rounded-[14px] border border-[#F3F4F6] bg-white p-[21px] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-card',
        tall ? 'min-h-[322px]' : 'min-h-[218px]'
      )}
    >
      <div className='flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(107,79,187,0.1)]'>
        <Icon
          className='size-5 text-[#6863FB]'
          strokeWidth={1.67}
          aria-hidden
        />
      </div>
      <h3 className='mt-3 text-base font-bold leading-6 text-[#1A1A2E]'>
        {item.title}
      </h3>
      <p className='mt-1 text-[13px] leading-5 text-[#6A7282]'>
        {item.description}
      </p>
      <p className='mt-2 text-[11px] leading-4 text-[#99A1AF]'>
        Updated{' '}
        {new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(new Date(item.updated))}
      </p>
      <div className='mt-auto pt-4'>
        <button
          type='button'
          onClick={handleAction}
          className='h-10 rounded-[10px] border border-[#D1D5DC] px-5 text-xs font-bold text-[#4A5565] hover:bg-[#F9FAFB] dark:bg-muted'
        >
          View Resource
        </button>
      </div>
    </div>
  )
}

function CommissionCalculatorCard() {
  const [acv, setAcv] = useState(25_000)
  const [tier, setTier] = useState<'champion' | 'referral'>('champion')

  const rangeLabel = useMemo(() => commissionRangeLabel(acv, tier), [acv, tier])

  return (
    <div className='flex min-h-[322px] flex-col rounded-[14px] border border-[#F3F4F6] bg-white p-[21px] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-card'>
      <div className='flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(26,122,74,0.1)]'>
        <Calculator
          className='size-5 text-[#1A7A4A]'
          strokeWidth={1.67}
          aria-hidden
        />
      </div>
      <h3 className='mt-3 text-base font-bold leading-6 text-[#1A1A2E]'>
        Commission Calculator
      </h3>

      <label className='mt-6 text-[13px] font-medium leading-5 text-[#6A7282]'>
        Estimated ACV: <span className='text-[#1A1A2E]'>{formatUsd(acv)}</span>
      </label>
      <div className='mt-2'>
        <Slider
          value={[acv]}
          min={5000}
          max={100_000}
          step={500}
          onValueChange={(v) => setAcv(v[0] ?? 25_000)}
          className='w-full'
          aria-label='Estimated ACV'
        />
      </div>

      <div className='mt-5 flex gap-2'>
        <button
          type='button'
          onClick={() => setTier('champion')}
          className={cn(
            'h-8 flex-1 rounded-[10px] text-xs font-bold transition-colors',
            tier === 'champion'
              ? 'border border-[#6863FB] bg-[#6863FB] text-white'
              : 'border border-[#E5E7EB] bg-white text-[#6A7282] hover:bg-[#F9FAFB] dark:bg-card dark:bg-muted'
          )}
        >
          Champion
        </button>
        <button
          type='button'
          onClick={() => setTier('referral')}
          className={cn(
            'h-8 flex-1 rounded-[10px] text-xs font-bold transition-colors',
            tier === 'referral'
              ? 'border border-[#6863FB] bg-[#6863FB] text-white'
              : 'border border-[#E5E7EB] bg-white text-[#6A7282] hover:bg-[#F9FAFB] dark:bg-card dark:bg-muted'
          )}
        >
          Referral
        </button>
      </div>

      <div className='mt-5 rounded-[10px] bg-[rgba(26,122,74,0.05)] px-3 py-3'>
        <p className='text-xs font-normal leading-[18px] text-[#6A7282]'>
          Your estimated commission
        </p>
        <p className='text-2xl font-extrabold leading-9 text-[#1A7A4A]'>
          {rangeLabel}
        </p>
      </div>
    </div>
  )
}

export function PartnerResourcesView() {
  const { user, token } = usePartnerSession()
  const [resources, setResources] = useState<ResourceApiRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchResources() {
      if (!user?.uid || !token) {
        setIsLoading(false)
        return
      }

      try {
        const res = await fetch('/api/api/v1/partner/resources', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            setResources(json.data || [])
          }
        }
      } catch (err) {
        console.error('Failed to fetch resources:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchResources()
  }, [user?.uid, token])

  return (
    <PartnerProgramPortalScaffold mainClassName='flex-1 overflow-y-auto p-6 pb-28'>
      <div className='mx-auto w-full max-w-[1283px]'>
        <h1 className='text-2xl font-bold leading-9 text-[#1A1A2E]'>
          Resources
        </h1>
        <p className='mt-1 text-sm leading-[21px] text-[#6A7282]'>
          Sales enablement materials to help you pitch Sharkdom.
        </p>

        <div
          className={`mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 ${isLoading ? 'opacity-70 transition-opacity' : ''}`}
        >
          {resources.slice(0, 3).map((item) => (
            <ResourceCard key={item.id} item={item} tall={false} />
          ))}
          {resources.slice(3).map((item) => (
            <ResourceCard key={item.id} item={item} tall />
          ))}
          <CommissionCalculatorCard />
        </div>
      </div>
    </PartnerProgramPortalScaffold>
  )
}
