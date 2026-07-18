'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  Code,
  Eye,
  Factory,
  HeartPulse,
  Landmark,
  Laptop,
  Newspaper,
  ReceiptText,
  Rows4
} from 'lucide-react'

type Industry = {
  name: string
  partners: string
  pct: number
  growth: string
  color: string
  iconBg: string
  lucideIcon: React.ReactNode
}

const INDUSTRY_ICONS = {
  Technology: <Code className='h-4 w-4 text-white' />,
  Finance: <Landmark className='h-4 w-4 text-white' />,
  Healthcare: <HeartPulse className='h-4 w-4 text-white' />,
  Manufacturing: <Factory className='h-4 w-4 text-white' />,
  Retail: <ReceiptText className='h-4 w-4 text-white' />,
  Education: <BookOpen className='h-4 w-4 text-white' />,
  Media: <Newspaper className='h-4 w-4 text-white' />,
  Software: <Laptop className='h-4 w-4 text-white' />,
  Others: <Rows4 className='h-4 w-4 text-white' />
}

const INDUSTRY_COLORS = [
  '#6573F9',
  '#A8C3FF',
  '#7D69D7',
  '#AEABFF',
  '#64738D',
  '#CBD2DE'
]

// SVG donut chart helpers
const SVG_SIZE = 232
const CX = SVG_SIZE / 2
const CY = SVG_SIZE / 2
const OUTER_R = 108
const INNER_R = 84
const HOVER_OUTER_R = 116 // expands outward on hover

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  }
}

function donutArcPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
): string {
  // Clamp to avoid full-circle edge case
  const clampedEnd = Math.min(endAngle, startAngle + 359.999)
  const largeArc = clampedEnd - startAngle > 180 ? 1 : 0

  const os = polarToCartesian(cx, cy, outerR, startAngle)
  const oe = polarToCartesian(cx, cy, outerR, clampedEnd)
  const ie = polarToCartesian(cx, cy, innerR, clampedEnd)
  const is_ = polarToCartesian(cx, cy, innerR, startAngle)

  return [
    `M ${os.x} ${os.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${oe.x} ${oe.y}`,
    `L ${ie.x} ${ie.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${is_.x} ${is_.y}`,
    'Z'
  ].join(' ')
}

// Build arc segments with cumulative angles
function buildSegments(industries: Industry[]) {
  const total = industries.reduce((s, i) => s + i.pct, 0) || 100
  let cumAngle = 0
  return industries.map((ind) => {
    const sweep = (ind.pct / total) * 360
    const start = cumAngle
    const end = cumAngle + sweep
    cumAngle = end
    return { ...ind, startAngle: start, endAngle: end }
  })
}

// SVG Donut Chart component
function DonutChart({
  industries,
  hoveredName,
  onHover
}: {
  industries: Industry[]
  hoveredName: string | null
  onHover: (name: string | null) => void
}) {
  const segments = buildSegments(industries)
  const hoveredInd = industries.find((i) => i.name === hoveredName)

  return (
    <div
      className='relative shrink-0'
      style={{ width: SVG_SIZE, height: SVG_SIZE }}
    >
      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        style={{ display: 'block' }}
      >
        {segments.map((seg) => {
          const isHovered = hoveredName === seg.name
          const isDimmed = hoveredName !== null && !isHovered
          const outerR = isHovered ? HOVER_OUTER_R : OUTER_R
          const path = donutArcPath(
            CX,
            CY,
            outerR,
            INNER_R,
            seg.startAngle,
            seg.endAngle
          )

          return (
            <path
              key={seg.name}
              d={path}
              fill={seg.color}
              opacity={isDimmed ? 0.3 : 1}
              stroke='white'
              strokeWidth={2}
              style={{
                cursor: 'pointer',
                transition: 'opacity 0.2s ease, d 0.2s ease',
                filter: isHovered
                  ? `drop-shadow(0 0 6px ${seg.color}99)`
                  : 'none'
              }}
              onMouseEnter={() => onHover(seg.name)}
              onMouseLeave={() => onHover(null)}
            />
          )
        })}
      </svg>

      {/* Center label — always visible, changes on hover */}
      <div
        className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'
        style={{
          // inset to match the inner hole area
          margin: `${SVG_SIZE / 2 - INNER_R}px`
        }}
      >
        {hoveredInd ? (
          <div className='flex flex-col items-center gap-0.5 text-center'>
            <span
              className='text-2xl font-bold leading-none'
              style={{ color: hoveredInd.color }}
            >
              {hoveredInd.pct}%
            </span>
            <span className='mt-1 max-w-[80px] text-center text-[10px] font-semibold leading-tight text-[#64738D]'>
              {hoveredInd.name}
            </span>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-0.5 text-center'>
            <span className='text-[11px] font-medium text-[#B0B8C8]'>
              Hover slice
            </span>
            <span className='text-[10px] text-[#C8D0DC]'>to see %</span>
          </div>
        )}
      </div>
    </div>
  )
}

function IndustryRow({
  industry,
  isHovered,
  isDimmed,
  onMouseEnter,
  onMouseLeave
}: {
  industry: Industry
  isHovered: boolean
  isDimmed: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  return (
    <div
      className='flex cursor-pointer items-center justify-between rounded-xl p-2.5 transition-all duration-200'
      style={{
        backgroundColor: isHovered ? `${industry.color}18` : '#F9FAFB',
        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: isHovered
          ? `0 4px 12px ${industry.color}30`
          : '0 0 0 transparent',
        opacity: isDimmed ? 0.45 : 1,
        outline: isHovered ? `1.5px solid ${industry.color}55` : 'none'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className='flex items-center gap-2.5'>
        <div
          className='flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded transition-transform duration-200'
          style={{
            backgroundColor: industry.iconBg,
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          {industry.lucideIcon}
        </div>
        <div className='flex flex-col gap-0.5'>
          <span
            className='text-base font-semibold transition-colors duration-200'
            style={{ color: isHovered ? industry.color : '#1B2331' }}
          >
            {industry.name}
          </span>
          <span className='text-xs font-semibold text-[#838995]'>
            {industry.partners}
          </span>
        </div>
      </div>
      <div className='flex flex-col items-end gap-0.5'>
        <span
          className='text-base font-bold transition-colors duration-200'
          style={{ color: isHovered ? industry.color : '#1B2331' }}
        >
          {industry.pct}%
        </span>
        {industry.growth && (
          <span className='text-xs font-semibold text-[#25A37B]'>
            {industry.growth}
          </span>
        )}
      </div>
    </div>
  )
}

export default function IndustryDistribution({
  data,
  totalRecords = 0
}: {
  data?: any[]
  totalRecords?: number
}) {
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null)

  let industries: Industry[] = []

  if (data && Array.isArray(data) && data.length > 0) {
    industries = data.map((sector: any, idx: number) => {
      let name = sector.key
      if (!name || name.toLowerCase() === 'unknown' || name.trim() === '')
        name = 'Other'
      if (name.toLowerCase() === 'tech') name = 'Technology'
      name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

      const pct = Math.ceil(sector.percentage)
      const countVal = Math.round((sector.percentage / 100) * totalRecords)
      const color = INDUSTRY_COLORS[idx % INDUSTRY_COLORS.length]
      const icon =
        INDUSTRY_ICONS[name as keyof typeof INDUSTRY_ICONS] ||
        INDUSTRY_ICONS.Others

      return {
        name,
        partners: `${countVal.toLocaleString()} records`,
        pct,
        growth: '',
        color,
        iconBg: color,
        lucideIcon: icon
      }
    })
  }

  const leftCol = industries.slice(0, Math.ceil(industries.length / 2))
  const rightCol = industries.slice(Math.ceil(industries.length / 2))

  return (
    <div className='overflow-hidden rounded-xl bg-white p-6 outline outline-1 outline-[#E4E7EE]'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-[#E3E5FF]'>
            <Factory className='h-5 w-5 text-[#3E50F7]' />
          </div>
          <span className='text-xl font-bold text-[#2A3241]'>
            Industry Distribution
          </span>
        </div>
        <div className='flex items-center gap-2 text-sm text-[#2A3241]'>
          <Eye className='h-5 w-5' />
          <span>Visible to potential partners</span>
        </div>
      </div>

      {/* Content: donut + industry grid */}
      {industries.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-10 text-sm italic text-gray-400'>
          No industry distribution data available
        </div>
      ) : (
        <div className='mt-10 flex items-center gap-6'>
          {/* SVG Donut chart — every slice is individually hoverable */}
          <DonutChart
            industries={industries}
            hoveredName={hoveredIndustry}
            onHover={setHoveredIndustry}
          />

          {/* Industry rows — 2 columns */}
          <div className='grid flex-1 grid-cols-2 gap-3'>
            {leftCol.map((ind) => (
              <IndustryRow
                key={ind.name}
                industry={ind}
                isHovered={hoveredIndustry === ind.name}
                isDimmed={
                  hoveredIndustry !== null && hoveredIndustry !== ind.name
                }
                onMouseEnter={() => setHoveredIndustry(ind.name)}
                onMouseLeave={() => setHoveredIndustry(null)}
              />
            ))}
            {rightCol.map((ind) => (
              <IndustryRow
                key={ind.name}
                industry={ind}
                isHovered={hoveredIndustry === ind.name}
                isDimmed={
                  hoveredIndustry !== null && hoveredIndustry !== ind.name
                }
                onMouseEnter={() => setHoveredIndustry(ind.name)}
                onMouseLeave={() => setHoveredIndustry(null)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
