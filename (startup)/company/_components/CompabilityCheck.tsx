'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { OrganizationType } from '@/types'
import { CloseCircle, TickCircle } from 'iconsax-react'
import { CircleAlert, CircleCheck } from 'lucide-react'

import BarChart from '@/app/(app)/(dashboard-pages)/_components/bar-chart'

import { CompabilityLoader } from './compability-loader'

type Props = {
  currentOrganization: OrganizationType
  organization: OrganizationType
  prompt: string
}
type JsonObjectArray = Array<Record<string, any>>

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
const CompabilityCheck = ({
  currentOrganization,
  organization,
  prompt
}: Props) => {
  const [graphLoading, setGraphLoading] = useState<boolean>(false)
  const [graphData, setGraphData] = useState<JsonObjectArray>()
  const [booleanData, setBooleanData] = useState<{ [key: string]: boolean }>()
  const [viewCount, setViewCount] = useState<number>(0)
  console.log({ prompt })

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
        console.log(err)
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
      fetchGraph()
    }
  }, [])

  type PartnershipType = {
    name: string
    color: string
  }

  type PartnershipTypes = {
    [key: string]: PartnershipType
  }

  const partnershipTypes: PartnershipTypes = {
    TECHNOLOGY: { name: 'TECHNOLOGY', color: '#31AE90' },
    'CO-MARKETING': { name: 'CO-MARKETING', color: '#3178AE' },
    STRATEGIC: { name: 'STRATEGIC', color: '#3D31AE' },
    COMMUNITY: { name: 'COMMUNITY', color: '#6731AE' },
    BRAND_LICENSING: { name: 'BRAND LICENSING', color: '#AE31A1' },
    SALES: { name: 'SALES', color: '#AE3139' },
    SOCIAL: { name: 'SOCIAL', color: '#AE3139' }
  }

  const renderIcon = (condition: any) => {
    return condition ? (
      <TickCircle size={16} color='#247927' />
    ) : (
      <CloseCircle size={16} color='#DF5555' />
    )
  }

  return (
    <>
      {viewPlans ? (
        <section className='flex w-[344px] lg:justify-self-end'>
          <div className='flex w-full flex-col pb-0'>
            <Image src={'/locked-graph.png'} width={367} height={500} alt='' />

            <div className='mt-4 flex flex-col gap-2'>
              <div className='flex items-center gap-2 rounded-lg bg-[#FFF6F6] p-3'>
                <CircleAlert color='#DF5555' size={16} />
                <span className='text-shark-xs text-[#4D5C78]'>
                  Is potential lead customer
                </span>
              </div>

              <div className='flex flex-col gap-2 rounded-lg bg-[#F0F8EE] p-3'>
                {[
                  'Can be marketing ally',
                  'Can be used to onboard new users',
                  'Can help in improving our brands image',
                  'Can help my customers'
                ].map((item: string, index: number) => (
                  <div key={index} className='flex items-center gap-2'>
                    <CircleCheck color='#247927' size={16} />
                    <span className='text-shark-xs text-[#4D5C78]'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className='w-[344px] rounded-xl border border-[#E9EAEB] bg-white'>
          <div className='border-b border-[#EBEBEB] p-4'>
            <h2 className='text-base font-bold text-[#2A3241]  '>
              Partnership Insights
            </h2>
          </div>
          {graphLoading ? (
            <CompabilityLoader orgName={organization?.name} />
          ) : (
            <section className='flex w-full p-4 pb-6 lg:justify-self-end'>
              <div className='mt-2 flex w-full flex-col gap-[48px] pb-0'>
                <BarChart data={graphData} />
                <div className='flex flex-col gap-2'>
                  <div className='flex flex-col gap-2 rounded-lg bg-[#FFF6F6] p-3'>
                    {booleanData &&
                      Object.entries(booleanData)
                        ?.filter(([key, value]) => value === false)
                        .map(([key, value]) => (
                          <p
                            key={key}
                            className='flex items-center gap-2 text-xs text-text-80 '
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
                <div className='grid w-full grid-cols-1 gap-4 '>
                  {graphData?.map((item, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between gap-2 '
                    >
                      <div className='flex items-center gap-2'>
                        <span
                          style={{
                            backgroundColor: partnershipTypes[item.type]?.color
                          }}
                          className='h-4 w-4 rounded-full'
                        ></span>
                        <span className='text-shark-sm font-medium capitalize text-text-60'>
                          {item.type.toLowerCase()}
                        </span>
                      </div>

                      <span className='text-tex-100 text-shark-sm font-bold '>
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </section>
      )}
    </>
  )
}

export default CompabilityCheck
