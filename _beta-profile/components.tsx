import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Lock } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

type BetaTabsProps<TValue extends string> = {
  items: ReadonlyArray<{
    value: TValue
    label: string
    icon?: ReactNode
  }>
  activeValue: TValue
  hrefBuilder: (value: TValue) => string
}

export function BetaScreen({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(62,80,247,0.08),_transparent_28%),linear-gradient(180deg,#f7f9fc_0%,#eef2f8_100%)]',
        className
      )}
    >
      <div className='mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 md:px-6 lg:px-8'>
        {children}
      </div>
    </div>
  )
}

export function BetaSurface({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_18px_50px_rgba(20,32,72,0.08)] backdrop-blur-sm md:p-6',
        className
      )}
    >
      {children}
    </section>
  )
}

export function BetaHeading({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
      <div className='max-w-3xl space-y-2'>
        {eyebrow ? (
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-[#3E50F7]'>
            {eyebrow}
          </p>
        ) : null}
        <div className='space-y-1'>
          <h1 className='text-2xl font-semibold tracking-tight text-[#141B34] md:text-3xl'>
            {title}
          </h1>
          {description ? (
            <p className='text-sm leading-6 text-[#59627A]'>{description}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className='shrink-0'>{action}</div> : null}
    </div>
  )
}

export function BetaTabs<TValue extends string>({
  items,
  activeValue,
  hrefBuilder
}: BetaTabsProps<TValue>) {
  return (
    <div className='flex flex-wrap gap-2'>
      {items.map((item) => {
        const active = item.value === activeValue
        return (
          <Link
            key={item.value}
            href={hrefBuilder(item.value)}
            className={cn(
              'inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              active
                ? 'border-[#3E50F7] bg-[#eef1ff] text-[#2330B8]'
                : 'border-[#D9DEEA] bg-white text-[#59627A] hover:border-[#B8C2DD] hover:text-[#141B34]'
            )}
          >
            {item.icon ? (
              <span className='shrink-0 text-current'>{item.icon}</span>
            ) : null}
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}

export function BetaPill({
  children,
  tone = 'neutral'
}: {
  children: ReactNode
  tone?: 'neutral' | 'brand' | 'success' | 'warning'
}) {
  const classes = {
    neutral: 'border-[#D7DEED] bg-[#F5F7FB] text-[#3C4863]',
    brand: 'border-[#C9D1FF] bg-[#EEF1FF] text-[#2534BC]',
    success: 'border-[#C6E9D3] bg-[#ECF9F0] text-[#116E3D]',
    warning: 'border-[#F3DBB6] bg-[#FFF5E7] text-[#9A5A00]'
  }

  return (
    <Badge
      variant='outline'
      className={cn(
        'rounded-full px-3 py-1 text-[11px] font-semibold',
        classes[tone]
      )}
    >
      {children}
    </Badge>
  )
}

export function BetaStatGrid({
  items,
  columns = 3
}: {
  items: Array<{
    label: string
    value: string
    note?: string
  }>
  columns?: 2 | 3 | 4
}) {
  const gridClass =
    columns === 4
      ? 'xl:grid-cols-4'
      : columns === 2
        ? 'md:grid-cols-2'
        : 'md:grid-cols-2 xl:grid-cols-3'

  return (
    <div className={cn('grid gap-3', gridClass)}>
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className='rounded-[22px] border border-[#E7EAF3] bg-[#F9FBFF] p-4'
        >
          <p className='text-xs font-medium uppercase tracking-[0.18em] text-[#7E86A0]'>
            {item.label}
          </p>
          <p className='mt-3 text-lg font-semibold text-[#141B34]'>
            {item.value}
          </p>
          {item.note ? (
            <p className='mt-2 text-sm leading-6 text-[#59627A]'>{item.note}</p>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function BetaEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  readOnly
}: {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  readOnly?: boolean
}) {
  return (
    <BetaSurface className='border-dashed border-[#D6DCEC] bg-[linear-gradient(135deg,rgba(245,247,252,1)_0%,rgba(255,255,255,1)_100%)]'>
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div className='max-w-2xl space-y-2'>
          <div className='flex items-center gap-2'>
            {readOnly ? (
              <BetaPill tone='warning'>
                <Lock className='mr-1 h-3 w-3' />
                Read-only beta
              </BetaPill>
            ) : null}
            <BetaPill tone='neutral'>Fallback state</BetaPill>
          </div>
          <h3 className='text-xl font-semibold text-[#141B34]'>{title}</h3>
          <p className='text-sm leading-6 text-[#59627A]'>{description}</p>
        </div>
        {actionLabel && actionHref ? (
          <Button
            asChild
            variant='outline'
            className='rounded-full border-[#C9D1E5] bg-white'
          >
            <Link href={actionHref}>
              {actionLabel}
              <ArrowUpRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        ) : null}
      </div>
    </BetaSurface>
  )
}

export function BetaKeyValueList({
  items
}: {
  items: Array<{
    label: string
    value: string
  }>
}) {
  return (
    <div className='divide-y divide-[#E7EAF3]'>
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className='grid gap-1 py-3 md:grid-cols-[180px_1fr]'
        >
          <p className='text-sm font-medium text-[#6A738B]'>{item.label}</p>
          <p className='text-sm font-semibold text-[#141B34]'>{item.value}</p>
        </div>
      ))}
    </div>
  )
}

export function BetaUnderlineTabs<TValue extends string>({
  items,
  activeValue,
  hrefBuilder
}: BetaTabsProps<TValue>) {
  return (
    <div className='flex gap-2 border-b border-gray-200'>
      {items.map((item) => {
        const active = item.value === activeValue
        return (
          <Link
            key={item.value}
            href={hrefBuilder(item.value)}
            className={cn(
              'inline-flex items-center gap-2.5 border-b-2 px-4 py-3 text-[15px] font-medium tracking-[-0.3px] transition-colors',
              active
                ? 'border-[#155dfc] text-[#155dfc]'
                : 'border-transparent text-[#4a5565] hover:text-[#101828]'
            )}
          >
            {item.icon ? (
              <span className='flex h-4 w-4 shrink-0 items-center justify-center'>
                {item.icon}
              </span>
            ) : null}
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}

export function BetaLoadingState() {
  return (
    <div className='space-y-6'>
      <BetaSurface>
        <div className='space-y-4'>
          <Skeleton className='h-4 w-28 bg-[#E7EAF3]' />
          <Skeleton className='h-10 w-64 bg-[#E7EAF3]' />
          <Skeleton className='h-5 w-full max-w-2xl bg-[#E7EAF3]' />
        </div>
      </BetaSurface>
      <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
        <BetaSurface className='space-y-4'>
          <Skeleton className='h-32 w-full bg-[#E7EAF3]' />
          <Skeleton className='h-48 w-full bg-[#E7EAF3]' />
        </BetaSurface>
        <BetaSurface className='space-y-3'>
          <Skeleton className='h-6 w-28 bg-[#E7EAF3]' />
          <Skeleton className='h-20 w-full bg-[#E7EAF3]' />
          <Skeleton className='h-20 w-full bg-[#E7EAF3]' />
        </BetaSurface>
      </div>
    </div>
  )
}
