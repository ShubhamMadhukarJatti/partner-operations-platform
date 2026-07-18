'use client'

import React from 'react'
import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 }
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig

export const LineChartComponent: React.FC<{
  title: string
  data: any
  variant: 'success' | 'destructive'
  dataKey: string
}> = ({ title, data, variant, dataKey }) => {
  const fill =
    variant === 'success'
      ? '#17B26A'
      : variant === 'destructive'
        ? '#F04438'
        : '#17B26A'
  const gradientId = `gradient-${variant}`

  console.log(dataKey)

  const sumByKey = (arr: any, key: string) => {
    return arr?.reduce((sum: number, obj: any) => sum + (obj[key] || 0), 0)
  }

  return (
    <Card className='rounded-xl border border-[#E9EAEB] p-5 shadow-sm'>
      <CardHeader className='mb-5 flex flex-col gap-2'>
        <p className='text-sm text-[#535862] '>{title ?? ''}</p>
        <p className='text-[30px]/[38px] font-semibold text-[#181D27]'>
          {sumByKey(data, dataKey) ?? '0'}
        </p>
      </CardHeader>
      <CardContent className=''>
        <ChartContainer className='max-h-[60px] w-full' config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 0,
              right: 0
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor={fill} stopOpacity={0.8} />
                <stop offset='100%' stopColor={fill} stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            /> */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <Area
              className=''
              dataKey={dataKey}
              type='natural'
              fill={`url(#${gradientId})`}
              fillOpacity={0.1}
              stroke={fill}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export const AreaChartComponent: React.FC<{
  title: string
  data: any
  dataKey1: string
  dataKey2: string
}> = ({ title, data, dataKey1, dataKey2 }) => {
  const fill = '#079455'

  const sumByKey = (arr: any, key: string) => {
    return arr?.reduce((sum: number, obj: any) => sum + (obj[key] || 0), 0)
  }

  return (
    <Card className='rounded-xl border border-[#E9EAEB] p-5 shadow-sm'>
      <CardHeader className='mb-5 flex flex-col gap-2'>
        <p className='text-sm text-[#535862] '>{title ?? ''}</p>
        <p className='text-[30px]/[38px] font-semibold text-[#181D27]'>
          {sumByKey(data, dataKey1) ?? '0'}
          <span className='text-base'>/{sumByKey(data, dataKey2) ?? '0'}</span>
        </p>
      </CardHeader>
      <CardContent className=''>
        <ChartContainer className='max-h-[60px] w-full' config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 0,
              right: 0
            }}
          >
            {/* <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            /> */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <Area
              className=''
              dataKey={dataKey1}
              type='natural'
              fill={fill}
              // fillOpacity={0.1}
              stroke={fill}
            />
            <Area
              className=''
              dataKey={dataKey2}
              type='natural'
              fill={fill}
              fillOpacity={0.4}
              stroke={fill}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
