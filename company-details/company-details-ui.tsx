import { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function SectionHeader({
  title,
  description
}: {
  title: string
  description: string
}) {
  return (
    <div className='space-y-1'>
      <h1 className='text-[20px] font-bold tracking-[-0.022em] text-[#101828]'>
        {title}
      </h1>
      <p className='text-[16px] text-[#4A5565]'>{description}</p>
    </div>
  )
}

export function SectionCard({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-[20px] border border-[#F3F4F6] bg-white/50 p-6 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  )
}

export function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join('')
}

export function CertificationBadge({
  title,
  logoUrl
}: {
  title: string
  logoUrl?: string
}) {
  if (logoUrl) {
    return (
      <div className='flex h-[58px] w-[92px] shrink-0 items-center justify-center'>
        <div className='flex h-[65px] w-[65px] items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white dark:bg-white/5'>
          <img
            src={logoUrl}
            alt={`${title} logo`}
            className='h-full w-full object-cover'
          />
        </div>
      </div>
    )
  }

  const normalized = title.trim().toLowerCase()

  if (normalized.includes('iso 27001')) {
    return (
      <div className='flex h-[58px] w-[92px] shrink-0 items-center justify-center'>
        <div className='flex h-[56px] w-[56px] flex-col items-center justify-center rounded-full border-[3px] border-[#6AA7FF] bg-white text-[#1D4ED8] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.92)] dark:bg-white/5'>
          <span className='text-[10px] font-semibold uppercase leading-none tracking-[0.16em]'>
            ISO
          </span>
          <span className='mt-1 text-[7px] font-medium leading-none tracking-[0.05em] text-[#3B82F6]'>
            27001:2022
          </span>
        </div>
      </div>
    )
  }

  if (normalized.includes('soc 2')) {
    return (
      <div className='flex h-[58px] w-[92px] shrink-0 items-center justify-center'>
        <div className='flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#4DD2FF_0%,#1593E7_42%,#1756C7_100%)] text-white shadow-[inset_0_0_0_4px_rgba(255,255,255,0.14)]'>
          <div className='flex flex-col items-center leading-none'>
            <span className='text-[7px] font-medium tracking-[0.14em]'>
              AICPA
            </span>
            <span className='mt-1 text-[12px] font-semibold tracking-[0.06em]'>
              SOC
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-[58px] w-[92px] shrink-0 items-center justify-center'>
      <div className='flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-semibold uppercase tracking-[0.08em] text-[#1447E6]'>
        {getInitials(title)}
      </div>
    </div>
  )
}

export function FieldLabel({ label }: { label: string }) {
  return (
    <Label className='text-sm font-medium tracking-[-0.01em] text-[#364153]'>
      {label}
    </Label>
  )
}

export function TextInputField({
  label,
  value,
  onChange,
  className,
  inputClassName,
  type = 'text',
  placeholder
}: {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
  inputClassName?: string
  type?: string
  placeholder?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <FieldLabel label={label} />
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'h-10 rounded-[10px] border-[#D1D5DC] bg-white px-4 text-[16px] text-[#101828] placeholder:text-[#98A2B3] dark:bg-white/5',
          inputClassName
        )}
      />
    </div>
  )
}

export function TextAreaField({
  label,
  value,
  onChange,
  className,
  placeholder,
  textareaClassName,
  rows = 5
}: {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  textareaClassName?: string
  rows?: number
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <FieldLabel label={label} />
      <Textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'rounded-[10px] border-[#D1D5DC] bg-white px-4 py-3 text-[16px] text-[#101828] placeholder:text-[#98A2B3] dark:bg-white/5',
          textareaClassName
        )}
      />
    </div>
  )
}

export function SelectField({
  label,
  value,
  placeholder,
  options,
  onValueChange,
  triggerClassName
}: {
  label: string
  value: string
  placeholder?: string
  options: string[]
  onValueChange: (value: string) => void
  triggerClassName?: string
}) {
  return (
    <div className='space-y-2'>
      <FieldLabel label={label} />
      <Select value={value || undefined} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            'h-10 rounded-[10px] border-[#D1D5DC] bg-white px-4 text-[16px] text-[#101828] dark:bg-white/5',
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
