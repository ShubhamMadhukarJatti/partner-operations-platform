import React from 'react'
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  Building2,
  Code,
  Database,
  Eye,
  Factory,
  Handshake,
  HeartPulse,
  Landmark,
  Laptop,
  LucideTarget,
  Newspaper,
  ReceiptText,
  Rows4,
  Target,
  TrendingUp
} from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

// Define colors for each category - matching the design exactly
const MARKET_SEGMENT_COLORS = {
  B2B: '#A855F7',
  B2C: '#EE5FA6',
  B2B2C: '#FB8431'
}

const COMPANY_SIZE_COLORS = {
  Large: '#52CBA2',
  Mid: '#24BFD9',
  Medium: '#24BFD9',
  Small: '#92D331'
}

const PARTNERSHIP_STATUS_COLORS = {
  Active: '#089328',
  Pending: '#FC9F53',
  Inactive: '#768499'
}

// Industry configuration with icons, background colors, and chart colors
const INDUSTRY_CONFIG = {
  tech: {
    icon: Code,
    bgColor: '#6563A4'
  },
  finance: {
    icon: Landmark,
    bgColor: '#DC2626'
  },
  healthcare: {
    icon: HeartPulse,
    bgColor: '#059669'
  },
  manufacturing: {
    icon: Factory,
    bgColor: '#D97706'
  },
  retail: {
    icon: ReceiptText,
    bgColor: '#9333EA'
  },
  education: {
    icon: BookOpen,
    bgColor: '#F1D199'
  },
  media: {
    icon: Newspaper,
    bgColor: '#DC8181'
  },
  software: {
    icon: Laptop,
    bgColor: '#82B68C'
  },
  others: {
    icon: Rows4,
    bgColor: '#838FA2'
  }
}

// Custom tooltip component for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className='rounded-lg border bg-white px-3 py-2 shadow-lg'>
        <p className='font-medium text-gray-900'>
          {`${data.name} ${Math.ceil(data.value)}%`}
        </p>
      </div>
    )
  }
  return null
}

export default function DataMatrix({ data }: { data: any }) {
  // Prepare donut chart data for industries with proper key mapping
  const industryChartData =
    data?.companySector && Array.isArray(data.companySector)
      ? data.companySector.map((sector: any) => {
          // Normalize key - use "Technology" for both "Technology" and "Tech" keys
          let normalizedKey = sector.key
          if (sector.key === 'Tech' || sector.key === 'tech') {
            normalizedKey = 'Technology'
          }
          // Treat null, empty, or "Unknown" values as "Other"
          if (
            !normalizedKey ||
            normalizedKey.toLowerCase() === 'unknown' ||
            normalizedKey.trim() === ''
          ) {
            normalizedKey = 'Other'
          }

          // Get configuration for this industry
          const config =
            INDUSTRY_CONFIG[
              normalizedKey.toLowerCase() as keyof typeof INDUSTRY_CONFIG
            ] || INDUSTRY_CONFIG.others

          return {
            name: normalizedKey
              ? normalizedKey.charAt(0).toUpperCase() +
                normalizedKey.slice(1).toLowerCase()
              : 'Other',
            value: Math.ceil(sector.percentage),
            color: config.bgColor
          }
        })
      : []

  return (
    <div className='my-10 space-y-6'>
      {/* Company and Partnership Data Matrix */}
      <div className='rounded-lg border bg-white shadow-sm'>
        {/* Header */}
        <div className='flex items-center justify-between p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#7358EE] to-[#423288]'>
              <BrainCircuit className='h-6 w-6 text-white' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-gray-900'>
                Company and Partnership Data Matrix
              </h2>
              <p className='text-sm text-gray-600'>
                This data appears in your profile and powers our partner
                matching algorithm
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Eye className='h-5 w-5' />
            <span>Visible to potential partners</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className='p-6'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Market Segments */}
            <div className='space-y-4 rounded-lg border border-gray-200 px-4 py-6'>
              <div className='flex items-center gap-2'>
                <Target className='h-6 w-6 text-gray-600' />
                <h3 className='text-2xl font-medium text-gray-900'>
                  Market Segments
                </h3>
              </div>
              <div className='space-y-3'>
                {data.marketSegment && Array.isArray(data.marketSegment)
                  ? data.marketSegment.map((segment: any, index: number) => (
                      <div key={index} className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium text-gray-700'>
                            {segment.key}
                          </span>
                          <span className='text-sm font-bold text-gray-900'>
                            {Math.ceil(segment.percentage)}%
                          </span>
                        </div>
                        <div className='h-3 w-full rounded-full bg-gray-200'>
                          <div
                            className='h-3 rounded-full'
                            style={{
                              width: `${segment.percentage}%`,
                              backgroundColor:
                                MARKET_SEGMENT_COLORS[
                                  segment.key as keyof typeof MARKET_SEGMENT_COLORS
                                ] || '#6366f1'
                            }}
                          />
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            </div>

            {/* Company Size */}
            <div className='space-y-4 rounded-lg border border-gray-200 px-4 py-6'>
              <div className='flex items-center gap-2'>
                <Building2 className='h-6 w-6 text-gray-600' />
                <h3 className='text-2xl font-medium text-gray-900'>
                  Company Size
                </h3>
              </div>
              <div className='space-y-3'>
                {data.companySize && Array.isArray(data.companySize)
                  ? data.companySize.map((size: any, index: number) => (
                      <div key={index} className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium text-gray-700'>
                            {!size.key ||
                            size.key.toLowerCase() === 'unknown' ||
                            size.key.trim() === ''
                              ? 'Other'
                              : size.key}
                          </span>
                          <span className='text-sm font-bold text-gray-900'>
                            {Math.ceil(size.percentage)}%
                          </span>
                        </div>
                        <div className='h-3 w-full rounded-full bg-gray-200'>
                          <div
                            className='h-3 rounded-full'
                            style={{
                              width: `${size.percentage}%`,
                              backgroundColor: (() => {
                                const key = Object.keys(
                                  COMPANY_SIZE_COLORS
                                ).find((colorKey) =>
                                  size.key
                                    .toLowerCase()
                                    .includes(colorKey.toLowerCase())
                                )
                                return key
                                  ? COMPANY_SIZE_COLORS[
                                      key as keyof typeof COMPANY_SIZE_COLORS
                                    ]
                                  : '#10b981'
                              })()
                            }}
                          />
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            </div>

            {/* Partnership Status */}
            <div className='space-y-4 rounded-lg border border-gray-200 px-4 py-6'>
              <div className='flex items-center gap-2'>
                <Handshake className='h-6 w-6 text-gray-600' />
                <h3 className='text-2xl font-medium text-gray-900'>
                  Partnership Status
                </h3>
              </div>
              <div className='space-y-3'>
                {data.isPartnershipProgram &&
                Array.isArray(data.isPartnershipProgram)
                  ? data.isPartnershipProgram.map(
                      (program: any, index: number) => (
                        <div key={index} className='space-y-2'>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium text-gray-700'>
                              {program.key === 'false' ? 'Inactive' : 'Active'}
                            </span>
                            <span className='text-sm font-bold text-gray-900'>
                              {Math.ceil(program.percentage)}%
                            </span>
                          </div>
                          <div className='h-3 w-full rounded-full bg-gray-200'>
                            <div
                              className='h-3 rounded-full'
                              style={{
                                width: `${program.percentage}%`,
                                backgroundColor:
                                  PARTNERSHIP_STATUS_COLORS[
                                    program.key === 'false'
                                      ? 'Inactive'
                                      : ('Active' as keyof typeof PARTNERSHIP_STATUS_COLORS)
                                  ] || '#22c55e'
                              }}
                            />
                          </div>
                        </div>
                      )
                    )
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Distribution */}
      <div className='rounded-lg border bg-white shadow-sm'>
        {/* Header */}
        <div className='flex items-center justify-between p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#7358EE] to-[#423288]'>
              <Factory className='h-6 w-6 text-white' />
            </div>
            <h2 className='text-xl font-bold text-gray-900'>
              Industry Distribution
            </h2>
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Eye className='h-5 w-5' />
            <span>Visible to potential partners</span>
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          <div className='flex flex-wrap items-center gap-8'>
            {/* Donut Chart - min width to prevent overlap */}
            <div className='flex min-w-[200px] shrink-0 justify-center'>
              <div className='relative h-48 w-48 sm:h-56 sm:w-56 lg:h-60 lg:w-60'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={industryChartData}
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey='value'
                    >
                      {industryChartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Industry List - flex-1, min-width for proper wrap; single column on small to prevent overlap */}
            <div className='min-w-[280px] flex-1'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {/* First Column - First 3 items */}
                <div className='space-y-4'>
                  {data?.companySector && Array.isArray(data.companySector)
                    ? data.companySector
                        .slice(0, 3)
                        .map((sector: any, index: number) => {
                          let normalizedKey = sector.key
                          // Treat null, empty, or "Unknown" values as "Other"
                          if (
                            !normalizedKey ||
                            normalizedKey.toLowerCase() === 'unknown' ||
                            normalizedKey.trim() === ''
                          ) {
                            normalizedKey = 'Other'
                          }

                          // Get configuration for this industry
                          const config =
                            INDUSTRY_CONFIG[
                              normalizedKey.toLowerCase() as keyof typeof INDUSTRY_CONFIG
                            ] || INDUSTRY_CONFIG.others
                          const IconComponent = config.icon

                          return (
                            <div
                              key={index}
                              className='flex min-w-0 items-center justify-between gap-2 rounded-lg bg-[#F9FAFB] p-4'
                            >
                              <div className='flex min-w-0 shrink items-center gap-3'>
                                <div
                                  className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm'
                                  style={{ backgroundColor: config.bgColor }}
                                >
                                  <IconComponent className='h-4 w-4 text-black' />
                                </div>
                                <div className='min-w-0'>
                                  <h4 className='truncate text-2xl font-medium text-gray-900'>
                                    {normalizedKey
                                      ? normalizedKey.charAt(0).toUpperCase() +
                                        normalizedKey.slice(1).toLowerCase()
                                      : 'Other'}
                                  </h4>
                                </div>
                              </div>
                              <div className='shrink-0 text-right'>
                                <h4 className='text-2xl font-semibold text-gray-900'>
                                  {Math.ceil(sector.percentage)}%
                                </h4>
                              </div>
                            </div>
                          )
                        })
                    : null}
                </div>

                {/* Second Column - Remaining items */}
                <div className='space-y-4'>
                  {data?.companySector && Array.isArray(data.companySector)
                    ? data.companySector
                        .slice(3)
                        .map((sector: any, index: number) => {
                          let normalizedKey = sector.key
                          // Treat null, empty, or "Unknown" values as "Other"
                          if (
                            !normalizedKey ||
                            normalizedKey.toLowerCase() === 'unknown' ||
                            normalizedKey.trim() === ''
                          ) {
                            normalizedKey = 'Other'
                          }

                          // Get configuration for this industry
                          const config =
                            INDUSTRY_CONFIG[
                              normalizedKey.toLowerCase() as keyof typeof INDUSTRY_CONFIG
                            ] || INDUSTRY_CONFIG.others
                          const IconComponent = config.icon

                          return (
                            <div
                              key={index + 3}
                              className='flex min-w-0 items-center justify-between gap-2 rounded-lg bg-[#F9FAFB] p-4'
                            >
                              <div className='flex min-w-0 shrink items-center gap-3'>
                                <div
                                  className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm'
                                  style={{ backgroundColor: config.bgColor }}
                                >
                                  <IconComponent className='h-4 w-4 text-black' />
                                </div>
                                <div className='min-w-0'>
                                  <h4 className='truncate text-2xl font-medium text-gray-900'>
                                    {normalizedKey
                                      ? normalizedKey.charAt(0).toUpperCase() +
                                        normalizedKey.slice(1).toLowerCase()
                                      : 'Other'}
                                  </h4>
                                </div>
                              </div>
                              <div className='shrink-0 text-right'>
                                <h4 className='text-2xl font-semibold text-gray-900'>
                                  {Math.ceil(sector.percentage)}%
                                </h4>
                              </div>
                            </div>
                          )
                        })
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
