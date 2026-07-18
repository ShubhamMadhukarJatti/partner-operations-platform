import React, { useEffect, useState } from 'react'
import { OrganizationType } from '@/types'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { CloseCircle, TickCircle } from 'iconsax-react'
import { random } from 'lodash'
import { Sparkle, Sparkles } from 'lucide-react'
import { Doughnut } from 'react-chartjs-2'

import PartnershipinsightLoader from './placeholders/PartnershipinsightLoader'

type Props = {
  currentOrganization: OrganizationType
  organization: OrganizationType
  prompt: string
}

type PartnershipType = {
  name: string
  color: string
}

type JsonObjectArray = Array<Record<string, any>>

type PartnershipTypes = {
  [key: string]: PartnershipType
}

interface PercentageItem {
  percentage: number
  type: string
}

interface BooleanDataItem {
  [key: string]: boolean
}

type DataItem = PercentageItem | BooleanDataItem

interface SeparatedData {
  percentageData: PercentageItem[]
  booleanData: {
    [key: string]: boolean
  }
}

ChartJS.register(ArcElement, Tooltip, Legend)

// Add showBlur prop
interface PartnershipInsightsChartProps {
  org: any
  currentOrg: any
  prompt: string
  showBlur?: boolean
}

// Updated color mapping from image
const PARTNERSHIP_TYPE_COLORS: { [key: string]: string } = {
  TECHNOLOGY: '#F94144',
  'CO-MARKETING': '#F9C74F',
  STRATEGIC: '#3D31AE',
  COMMUNITY: '#6731AE',
  BRAND_LICENSING: '#F8961E',
  SALES: '#90BE6D',
  SOCIAL: '#43AA8B',
  OTHER: '#5B7BAC'
}

const PartnershipInsightsChart: React.FC<PartnershipInsightsChartProps> = ({
  org,
  currentOrg,
  prompt,
  showBlur = false
}) => {
  const [graphLoading, setGraphLoading] = useState<boolean>(false)
  const [graphData, setGraphData] = useState<any>()
  const [booleanData, setBooleanData] = useState<{ [key: string]: boolean }>()
  const [viewCount, setViewCount] = useState<number>(0)

  const [viewPlans, setViewPlans] = useState<boolean>(true)

  function separateData(data: DataItem[]): SeparatedData {
    const percentageData: PercentageItem[] = []
    const booleanData: { [key: string]: boolean } = {}

    data.forEach((item) => {
      if ('percentage' in item && 'type' in item) {
        percentageData.push(item as PercentageItem)
      } else {
        const [key, value] = Object.entries(item)[0] as [string, boolean]
        booleanData[key] = value
      }
    })

    return { percentageData, booleanData }
  }

  // Use the color mapping for chart background
  const chartData = {
    labels: graphData?.map(
      (item: { percentage: number; type: string }) => item.type
    ),
    datasets: [
      {
        data: graphData?.map(
          (item: { percentage: number; type: string }) => item.percentage
        ),
        backgroundColor: graphData?.map(
          (item: { type: string }) =>
            PARTNERSHIP_TYPE_COLORS[item.type] || '#5B7BAC'
        ),
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 4
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -90,
    circumference: 360,
    cutout: '86%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            )
            const percentage = ((value / total) * 100).toFixed(0)
            return `${label}: ${percentage}%`
          }
        }
      }
    }
  }

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setGraphLoading(true)
        const response = await fetch('/api/compability-graph', {
          method: 'POST',
          headers: {
            'Content-Type': 'applicaton/json'
          },
          body: JSON.stringify({
            prompt
          })
        })

        if (response.ok) {
          const data = await response.json()
          const { percentageData, booleanData } = separateData(data?.data)
          setGraphData(percentageData)
          setBooleanData(booleanData)
        }
      } catch (err: unknown) {
        console.error('Error fetching graph data:', err)
      } finally {
        setGraphLoading(false)
      }
    }

    const storedCount = localStorage.getItem('viewCount')

    const currentCount = storedCount ? parseInt(storedCount, 10) : 0

    if (currentCount < 10) {
      setViewPlans(false)
      localStorage.setItem('viewCount', (currentCount + 1).toString())
      setViewCount(currentCount + 1)
    }

    // Only fetch if prompt is not empty
    if (prompt && prompt.trim() !== '') {
      fetchGraph()
    }
  }, [prompt])

  const partnershipTypes: PartnershipTypes = {
    TECHNOLOGY: { name: 'TECHNOLOGY', color: '#F94144' },
    'CO-MARKETING': { name: 'CO-MARKETING', color: '#F9C74F' },
    STRATEGIC: { name: 'STRATEGIC', color: '#3D31AE' },
    COMMUNITY: { name: 'COMMUNITY', color: '#6731AE' },
    BRAND_LICENSING: { name: 'BRAND LICENSING', color: '#AE31A1' },
    SALES: { name: 'SALES', color: '#90BE6D' },
    SOCIAL: { name: 'SOCIAL', color: '#43AA8B' }
  }

  const renderIcon = (condition: any) => {
    return condition ? (
      <TickCircle size={16} color='#247927' />
    ) : (
      <CloseCircle size={16} color='#DF5555' />
    )
  }

  return graphLoading ? (
    <PartnershipinsightLoader />
  ) : (
    <div className='relative'>
      {/* Blurred chart content */}
      <div className={showBlur ? 'pointer-events-none blur-sm' : ''}>
        <div className='flex flex-wrap justify-between gap-2 p-5'>
          {graphData && chartData && (
            <div className='relative w-full max-w-[200px]'>
              <Doughnut
                key={random()} // 👈 ensures re-render with new data
                data={chartData}
                options={options}
              />
              <div className='absolute left-1/2 top-[40%] flex w-full -translate-x-1/2 flex-col items-center justify-center'>
                <span className='text-shark-xl font-bold text-text-100'>{`100%`}</span>
                <span className='w-full text-center text-shark-xs font-normal text-[#1E1E1E99]'>
                  Partnership Types
                </span>
              </div>
            </div>
          )}

          <div className='grid max-w-[218px] grid-cols-1 gap-1 lg:gap-0'>
            {graphData?.map((item: any, index: number) => (
              <div
                key={index}
                className='flex items-center justify-between gap-2 '
              >
                <div className='flex items-center gap-2'>
                  <span
                    style={{
                      backgroundColor:
                        PARTNERSHIP_TYPE_COLORS[item.type] || '#5B7BAC'
                    }}
                    className='h-2 w-2 rounded-full'
                  ></span>
                  <span className='text-shark-xs font-medium capitalize text-text-60'>
                    {item.type.toLowerCase()}
                  </span>
                </div>

                <span className=' text-shark-xs font-normal text-[#2A3241]'>
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
          <div className='flex w-full flex-col gap-2 sm:w-[200px] xl:w-[300px]'>
            <div className='flex flex-col gap-2 rounded-lg bg-[#FFF6F6] p-3'>
              {booleanData &&
                Object.entries(booleanData)
                  ?.filter(([key, value]) => value === false)
                  .map(([key, value]) => (
                    <p
                      key={key}
                      className='flex items-center gap-2 text-xs  text-text-80 '
                    >
                      {renderIcon(value)}
                      {key
                        .replace(/_/g, ' ')
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </p>
                  ))}
            </div>
            <div className='flex flex-col gap-2 rounded-lg bg-[#F0F8EE] p-3'>
              {booleanData &&
                Object.entries(booleanData)
                  .filter(([key, value]) => value === true)
                  .map(([key, value]) => (
                    <p
                      key={key}
                      className='flex items-center gap-2 text-xs  text-text-80 '
                    >
                      {renderIcon(value)}
                      {key
                        .replace(/_/g, ' ')
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </p>
                  ))}
            </div>
          </div>
        </div>
      </div>
      {/* Sparkles icon overlay, only when showBlur is true */}
      {showBlur && (
        <div className='absolute left-1/2 top-1/2 z-10 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#383bf1] to-[#920086]'>
            <Sparkles size={24} color='white' />
          </div>
          <h3 className='text-black'>Premium Analytics</h3>
          <p className='text-[0.75rem]'>Unlock advanced insights</p>
        </div>
      )}
    </div>
  )
}

export default PartnershipInsightsChart
