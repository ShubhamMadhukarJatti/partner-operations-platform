'use client'

import * as React from 'react'
import { useCompletion } from 'ai/react'
import { Check } from 'lucide-react'

// import { Bar, BarChart, ResponsiveContainer } from 'recharts'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import LoadingIcon from '@/components/ui/loading-icon'

import BarChart from './bar-chart'

export function CheckCompability({ prompt }: { prompt: string }) {
  const [chartData, setChartData] = React.useState<any>([])
  const [data, setData] = React.useState<any>()

  const { complete, isLoading } = useCompletion({
    api: `/api/check-compability`
  })

  const generate = React.useCallback(async () => {
    // const credits = await getCredits()
    const completion = await complete(prompt)

    if (!completion) throw new Error('Failed to generate proposal')
    const res = JSON.parse(completion)

    setChartData(mapPartnershipTypesToValuesArray(res))

    setData(extractBooleanValues(res))
  }, [complete])

  function mapPartnershipTypesToValuesArray(data: any) {
    const result = Array(7).fill(null)

    data.forEach((item: any) => {
      if (item.type !== undefined && item.percentage !== undefined) {
        result[item.type] = item.percentage
      }
    })

    return result
  }

  const extractBooleanValues = (data: any) => {
    const booleanValues = {
      is_potential_lead_customer: false,
      can_be_marketing_ally: false,
      can_help_in_improving_our_brands_image: false,
      can_be_used_to_onboard_new_users: false,
      can_help_my_customers: false
    }

    data.forEach((item: any) => {
      if (item.hasOwnProperty('is_potential_lead_customer')) {
        booleanValues.is_potential_lead_customer =
          item.is_potential_lead_customer
      }

      if (item.hasOwnProperty('can_be_marketing_ally')) {
        booleanValues.can_be_marketing_ally = item.can_be_marketing_ally
      }
      if (item.hasOwnProperty('can_help_in_improving_our_brands_image')) {
        booleanValues.can_help_in_improving_our_brands_image =
          item.can_help_in_improving_our_brands_image
      }
      if (item.hasOwnProperty('can_be_used_to_onboard_new_users')) {
        booleanValues.can_be_used_to_onboard_new_users =
          item.can_be_used_to_onboard_new_users
      }
      if (item.hasOwnProperty('can_help_my_customers')) {
        booleanValues.can_help_my_customers = item.can_help_my_customers
      }
    })

    return booleanValues
  }

  const renderIcon = (condition: any) => {
    return condition ? (
      <Check className='size-5 font-medium text-green-400' />
    ) : (
      '❌'
    )
  }

  const partnershipTypes = {
    0: { name: 'TECHNOLOGY', color: '#31AE90' },
    1: { name: 'CO-MARKETING', color: '#3178AE' },
    2: { name: 'STRATEGIC', color: '#3D31AE' },
    3: { name: 'COMMUNITY', color: '#6731AE' },
    4: { name: 'BRAND LICENSING', color: '#AE31A1' },
    5: { name: 'SALES', color: '#AE3139' },
    6: { name: 'SOCIAL', color: '#AE3139' }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='link' onClick={generate}>
          Check Compability
        </Button>
      </DrawerTrigger>
      <DrawerContent className=' right-0   top-0 mt-0'>
        <div className='mx-auto flex h-full w-full  max-w-md  flex-col'>
          <DrawerHeader>
            <DrawerTitle className='text-xl'>Check Compability</DrawerTitle>
            {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
          </DrawerHeader>
          {isLoading ? (
            <div className='flex h-full w-full items-center justify-center'>
              <LoadingIcon className='size-16 border-[6px] border-t-muted text-primary' />
            </div>
          ) : (
            <div className=' p-6 pb-0'>
              <BarChart data={chartData} />

              <div className='mt-8 grid grid-cols-2 gap-x-4'>
                {Object.entries(partnershipTypes).map(([key, value]) => (
                  <div
                    key={key}
                    className='flex items-center justify-between gap-2  p-1'
                  >
                    <div className='flex items-center gap-2'>
                      <span
                        style={{ backgroundColor: value.color }}
                        className='h-4 w-4 '
                      ></span>
                      <span className='text-sm font-medium capitalize'>
                        {value.name.toLocaleLowerCase()}
                      </span>
                    </div>

                    <span className='text-sm font-medium'>
                      {chartData[key]}%
                    </span>
                  </div>
                ))}
              </div>

              <div className='mt-8'>
                {data && (
                  <>
                    <div>
                      <h4 className='mb-4 text-base font-medium leading-4'>
                        Recommendations
                      </h4>
                      <p className='flex items-center gap-1 font-medium text-muted-foreground'>
                        Potential Lead Customer:{' '}
                        {renderIcon(data.is_potential_lead_customer)}
                      </p>
                      <p className='flex items-center gap-1 font-medium text-muted-foreground'>
                        Can Be Marketing Ally:{' '}
                        {renderIcon(data.can_be_marketing_ally)}
                      </p>
                      <p className='flex items-center gap-1 font-medium text-muted-foreground'>
                        Can Be Used to Onboard New Users:{' '}
                        {renderIcon(data.can_be_used_to_onboard_new_users)}
                      </p>
                      <p className='flex items-center gap-1 font-medium text-muted-foreground'>
                        Can Help in Improving Our Brand&apos;s Image:{' '}
                        {renderIcon(
                          data.can_help_in_improving_our_brands_image
                        )}
                      </p>
                      <p className='flex items-center gap-1 font-medium text-muted-foreground'>
                        Can Help My Customers:{' '}
                        {renderIcon(data.can_help_my_customers)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          <DrawerFooter className='w-full justify-end'>
            {/* <Button>Send</Button> */}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
