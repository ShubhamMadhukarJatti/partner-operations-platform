'use client'

import { useState } from 'react'
import { BrainCircuit, Building2, Eye, Handshake, Target } from 'lucide-react'

type BarItem = {
  label: string
  count: string
  pct: number
  color: string
}

type SubCardProps = {
  title: string
  icon: React.ReactNode
  items: BarItem[]
}

function BarRow({ item }: { item: BarItem }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className='flex cursor-pointer flex-col gap-1.5 rounded-lg px-2 py-1.5 transition-all duration-200'
      style={{
        backgroundColor: hovered ? `${item.color}12` : 'transparent',
        transform: hovered ? 'translateX(2px)' : 'translateX(0)'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-1.5'>
          <span
            className='text-base font-semibold transition-colors duration-200'
            style={{ color: hovered ? item.color : '#000000' }}
          >
            {item.label}
          </span>
          <span
            className='text-xs font-semibold transition-colors duration-200'
            style={{ color: hovered ? item.color : '#000000', opacity: 0.6 }}
          >
            {item.count}
          </span>
        </div>
        <span
          className='text-base font-bold transition-colors duration-200'
          style={{ color: hovered ? item.color : '#000000' }}
        >
          {item.pct}%
        </span>
      </div>
      <div className='h-2 overflow-hidden rounded-full bg-[#E5E7EB]'>
        <div
          className='h-full rounded-full transition-all duration-300'
          style={{
            width: `${item.pct}%`,
            backgroundColor: item.color,
            transform: hovered ? 'scaleY(1.4)' : 'scaleY(1)',
            transformOrigin: 'left center',
            boxShadow: hovered ? `0 0 8px ${item.color}80` : 'none'
          }}
        />
      </div>
    </div>
  )
}

function SubCard({ title, icon, items }: SubCardProps) {
  return (
    <div className='flex flex-1 flex-col gap-4 overflow-hidden rounded-xl bg-white p-4 outline outline-1 outline-[#E4E7EE]'>
      <div className='flex items-center gap-2'>
        {icon}
        <span className='text-base font-semibold text-[#1C2432]'>{title}</span>
      </div>
      <div className='flex flex-col gap-1'>
        {items.map((item) => (
          <BarRow key={item.label} item={item} />
        ))}
        {items.length === 0 && (
          <div className='flex flex-col items-center justify-center py-6 text-sm italic text-gray-400'>
            No data available
          </div>
        )}
      </div>
    </div>
  )
}

export default function PartnershipMatrix({
  data,
  totalRecords = 0
}: {
  data?: any
  totalRecords?: number
}) {
  // 1. Market Segments
  let marketSegments: BarItem[] = []
  if (data?.marketSegment && Array.isArray(data.marketSegment)) {
    const colors = ['#6573F9', '#A8C3FF', '#BEBCFF']
    marketSegments = data.marketSegment.map((s: any, idx: number) => {
      const pct = Math.ceil(s.percentage)
      const countVal = Math.round((s.percentage / 100) * totalRecords)
      const rawKey = s.key
      const label =
        !rawKey || rawKey.toLowerCase() === 'unknown' || rawKey.trim() === ''
          ? 'Other'
          : rawKey
      return {
        label,
        count: countVal.toLocaleString(),
        pct,
        color: colors[idx % colors.length]
      }
    })
  }

  // 2. Company Size
  let companySizes: BarItem[] = []
  if (data?.companySize && Array.isArray(data.companySize)) {
    const colors = ['#7D69D7', '#BEBCFF', '#A8C3FF']
    companySizes = data.companySize.map((s: any, idx: number) => {
      const pct = Math.ceil(s.percentage)
      const countVal = Math.round((s.percentage / 100) * totalRecords)
      const rawKey = s.key
      const isUnknown =
        !rawKey || rawKey.toLowerCase() === 'unknown' || rawKey.trim() === ''
      return {
        label: isUnknown
          ? 'Other'
          : rawKey === 'Large'
            ? 'Enterprise'
            : rawKey === 'Medium' || rawKey === 'Mid'
              ? 'Mid-Market'
              : rawKey === 'Small'
                ? 'Small Business'
                : rawKey,
        count: countVal.toLocaleString(),
        pct,
        color: colors[idx % colors.length]
      }
    })
  }

  // 3. Partnership Status
  let partnershipStatus: BarItem[] = []
  if (data?.isPartnershipProgram && Array.isArray(data.isPartnershipProgram)) {
    const colors = ['#64738D', '#AEABFF', '#8BA2CA']
    partnershipStatus = data.isPartnershipProgram.map((s: any, idx: number) => {
      const pct = Math.ceil(s.percentage)
      const countVal = Math.round((s.percentage / 100) * totalRecords)
      const rawKey = s.key
      const isUnknown =
        !rawKey || rawKey.toLowerCase() === 'unknown' || rawKey.trim() === ''
      return {
        label: isUnknown
          ? 'Other'
          : rawKey === 'false'
            ? 'Inactive'
            : rawKey === 'true'
              ? 'Active'
              : rawKey,
        count: countVal.toLocaleString(),
        pct,
        color: colors[idx % colors.length]
      }
    })
  }

  const cards: SubCardProps[] = [
    {
      title: 'Market Segments',
      icon: <Target className='h-5 w-5 text-black' />,
      items: marketSegments
    },
    {
      title: 'Company Size',
      icon: <Building2 className='h-5 w-5 text-black' />,
      items: companySizes
    },
    {
      title: 'Partnership Status',
      icon: <Handshake className='h-5 w-5 text-black' />,
      items: partnershipStatus
    }
  ]

  return (
    <div className='flex flex-col gap-6 overflow-hidden rounded-xl bg-white p-6 outline outline-1 outline-[#E4E7EE]'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-[#E3E5FF]'>
            <BrainCircuit className='h-5 w-5 text-[#3E50F7]' />
          </div>
          <div className='flex flex-col gap-0.5'>
            <span className='text-xl font-bold text-[#2A3241]'>
              Company and Partnership Data Matrix
            </span>
            <span className='text-sm font-normal text-[#2A3241]'>
              This data appears in your profile and powers our partner matching
              algorithm
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2 text-sm text-[#2A3241]'>
          <Eye className='h-5 w-5' />
          <span>Visible to potential partners</span>
        </div>
      </div>

      {/* Sub-cards */}
      <div className='mt-10 flex gap-4'>
        {cards.map((card) => (
          <SubCard key={card.title} {...card} />
        ))}
      </div>

      {/* AI match score banner */}
    </div>
  )
}
