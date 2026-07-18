import React from 'react'
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart
} from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

const PieChartComponent: React.FC<{ value: number }> = ({ value }) => {
  function getColor(value: number) {
    if (value <= 10) return '#F94144'
    else if (value <= 49) return '#F9C74F'
    else if (value <= 70) return '#90BE6D'
    else if (value <= 100) return '#43AA8B'
    else return '#577590'
  }

  const chartData = [
    { browser: 'safari', visitors: 230, fill: getColor(value) }
  ]

  const chartConfig = {
    visitors: {
      label: 'Visitors'
    },
    safari: {
      label: 'Safari',
      color: '#E5EDF8'
    }
  } satisfies ChartConfig

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])

  return (
    <div className='w-full'>
      <ChartContainer
        config={chartConfig}
        className='mx-auto aspect-square max-h-[150px]'
      >
        <RadialBarChart
          data={chartData}
          startAngle={0}
          endAngle={(value / 100) * 360}
          innerRadius={60}
          outerRadius={80}
        >
          <PolarGrid
            gridType='circle'
            radialLines={false}
            stroke='#E5EDF8'
            className='first:fill-[#E5EDF8] last:fill-background'
            polarRadius={[64, 56]}
          />
          <RadialBar dataKey='visitors' background cornerRadius={10} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor='middle'
                      dominantBaseline='middle'
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className='fill-foreground text-xl font-bold'
                      >
                        {value.toLocaleString()}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className='fill-muted-foreground'
                      >
                        match
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  )
}

export default PieChartComponent
