import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { showCustomToast } from '@/components/custom-toast'
import { RetryIcon } from '@/components/icons/icons'

import { AreaChartComponent, LineChartComponent } from './LineChart'

const GraphTabs = () => {
  const params: { code: string } = useParams()
  const [activeTab, setActiveTab] = useState('today')
  const [data, setData] = useState()
  const [from, setFrom] = useState(new Date().toISOString().split('T')[0])
  const to = new Date().toISOString().split('T')[0]
  // const { data, refetch } = useFetchGraphData(params.code, from, to);

  const fetchGraphData = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/get-graph-data?referralCode=${params?.code}&from=${from}&to=${to}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Error fetching Referral Campaign Details`)
      }

      const data = await response.json()
      setData(data)
      console.log('REFERRAL ANALYTICS DATA:::', { data })
    } catch (error: any) {
      console.log(`ERROR fetchAnalyticsData`, error)
      showCustomToast(
        'Error',
        'Error fetching Referral Analytics Details',
        'error',
        5000
      )
    }
  }, [from])

  console.log(params.code, from, to)

  useEffect(() => {
    fetchGraphData()
  }, [from])

  console.log(data)

  const getFormattedDate = (daysAgo: number) => {
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    return date.toISOString().split('T')[0] // Extracts YYYY-MM-DD
  }

  return (
    <div className=''>
      <Tabs defaultValue='today' value={activeTab} className='p-0'>
        <TabsList className='mb-4 flex justify-start gap-4  bg-white '>
          <div className='h-auto w-fit overflow-hidden  rounded-lg border border-[#D5D7DA] p-0'>
            <TabsTrigger
              className='rounded-none border-r border-[#D5D7DA] px-4 py-2 text-sm font-semibold text-[#414651] data-[state=active]:bg-[#D5D7DA]'
              value='today'
              onClick={() => {
                ;(setFrom(getFormattedDate(0)), setActiveTab('today'))
              }}
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              onClick={() => {
                ;(setFrom(getFormattedDate(7)), setActiveTab('7days'))
              }}
              className='rounded-none border-r border-[#D5D7DA] px-4 py-2 text-sm font-semibold text-[#414651] data-[state=active]:bg-[#D5D7DA]'
              value='7days'
            >
              7 Days
            </TabsTrigger>
            <TabsTrigger
              onClick={() => {
                ;(setFrom(getFormattedDate(30)), setActiveTab('30days'))
              }}
              className='rounded-none border-r border-[#D5D7DA] px-4 py-2 text-sm font-semibold text-[#414651] data-[state=active]:bg-[#D5D7DA]'
              value='30days'
            >
              30 Days
            </TabsTrigger>
            <TabsTrigger
              onClick={() => {
                ;(setFrom(getFormattedDate(90)), setActiveTab('3months'))
              }}
              className='rounded-none px-4 py-2 text-sm font-semibold text-[#414651] data-[state=active]:bg-[#D5D7DA]'
              value='3months'
            >
              3 months
            </TabsTrigger>
          </div>
          <button
            onClick={() => {
              ;(setFrom(getFormattedDate(0)), setActiveTab('today'))
            }}
            className='text-sm font-semibold text-[#414651] shadow-sm'
          >
            Today
          </button>
          <button
            onClick={() => fetchGraphData()}
            className='rounded-lg border border-[#D5D7DA] bg-white p-2.5'
          >
            <RetryIcon />{' '}
          </button>
        </TabsList>
        <TabsContent className='grid grid-cols-2 gap-4' value='today'>
          <LineChartComponent
            data={data}
            dataKey={'leadsCount'}
            variant={'success'}
            title={'Total Leads'}
          />
          <LineChartComponent
            data={data}
            dataKey={'uniqueImpressions'}
            variant={'destructive'}
            title={'Unique Impressions'}
          />
          <AreaChartComponent
            data={data}
            dataKey1={'uniqueImpressions'}
            dataKey2={'totalImpressions'}
            title={'Unique Vs Total Impressions'}
          />
          <LineChartComponent
            data={data}
            dataKey={'totalImpressions'}
            variant={'destructive'}
            title={'Total Impressions'}
          />
        </TabsContent>
        <TabsContent className='grid grid-cols-2 gap-4' value='7days'>
          <LineChartComponent
            data={data}
            dataKey={'leadsCount'}
            variant={'success'}
            title={'Total Leads'}
          />
          <LineChartComponent
            data={data}
            dataKey={'uniqueImpressions'}
            variant={'destructive'}
            title={'Unique Impressions'}
          />
          <AreaChartComponent
            data={data}
            dataKey1={'uniqueImpressions'}
            dataKey2={'totalImpressions'}
            title={'Unique Vs Total Impressions'}
          />
          <LineChartComponent
            data={data}
            dataKey={'totalImpressions'}
            variant={'destructive'}
            title={'Total Impressions'}
          />
        </TabsContent>
        <TabsContent className='grid grid-cols-2 gap-4' value='30days'>
          <LineChartComponent
            data={data}
            dataKey={'leadsCount'}
            variant={'success'}
            title={'Total Leads'}
          />
          <LineChartComponent
            data={data}
            dataKey={'uniqueImpressions'}
            variant={'destructive'}
            title={'Unique Impressions'}
          />
          <AreaChartComponent
            data={data}
            dataKey1={'uniqueImpressions'}
            dataKey2={'totalImpressions'}
            title={'Unique Vs Total Impressions'}
          />
          <LineChartComponent
            data={data}
            dataKey={'totalImpressions'}
            variant={'destructive'}
            title={'Total Impressions'}
          />
        </TabsContent>
        <TabsContent className='grid grid-cols-2 gap-4' value='3months'>
          <LineChartComponent
            data={data}
            dataKey={'leadsCount'}
            variant={'success'}
            title={'Total Leads'}
          />
          <LineChartComponent
            data={data}
            dataKey={'uniqueImpressions'}
            variant={'destructive'}
            title={'Unique Impressions'}
          />
          <AreaChartComponent
            data={data}
            dataKey1={'uniqueImpressions'}
            dataKey2={'totalImpressions'}
            title={'Unique Vs Total Impressions'}
          />
          <LineChartComponent
            data={data}
            dataKey={'totalImpressions'}
            variant={'destructive'}
            title={'Total Impressions'}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default GraphTabs
