'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import DatePicker from 'react-datepicker'

import { getDemoData } from '@/lib/db/demo'
import { EmailStatsArgs } from '@/lib/db/email'
import { showCustomToast } from '@/components/custom-toast'

type Props = {
  token: any
}

const DEFAULT_STATS_PARAMS = {
  eventType: 'Open',
  env: 'DEV',
  page: 0,
  size: 20,
  sentAt: format(new Date(), 'yyyy-MM-dd')
  // templateCode: 'NOT_MIGRATED'
} as EmailStatsArgs

const DemoDetails = ({ token }: Props) => {
  // const { token } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [date, setDate] = useState(new Date())
  const [date2, setDate2] = useState(new Date())
  const [statsParams, setStatsParams] =
    useState<EmailStatsArgs>(DEFAULT_STATS_PARAMS)
  const [demoStats, setDemoStats] = useState<{
    data: any
    error: null | string
  } | null>(null)

  const fetchDemoData = useCallback(async () => {
    console.log(`run`)

    setIsLoading(true)
    try {
      const result = await getDemoData({ date, date2 }, token)
      setDemoStats({ data: result, error: null })
    } catch (e) {
      showCustomToast(
        'Error',
        'Error while fetching Demo Statistics.',
        'error',
        5000
      )
      setDemoStats({
        data: null,
        error: 'Error while fetching Demo Statistics.'
      })
    } finally {
      setIsLoading(false)
    }
  }, [date, date2])

  useEffect(() => {
    if (token) {
      fetchDemoData()
    }
  }, [fetchDemoData, token, date, date2])

  return (
    <div className='m-8 flex min-h-screen flex-col'>
      {isLoading ? (
        <>loading.....</>
      ) : (
        <>
          <div className='m-5 flex space-x-4'>
            <div className='flex items-center gap-1'>
              <p>
                <strong>Date Range for responses:</strong>
              </p>
              <span className='border-2 border-solid border-[#0062F1]'>
                <DatePicker
                  dateFormat='dd-MM-YYYY'
                  selected={date}
                  onChange={(date: any) => {
                    setStatsParams({
                      ...statsParams,
                      sentAt: format(new Date(date), 'yyyy-MM-dd')
                    })
                    setDate(date)
                  }}
                />
              </span>
              <span className='border-2 border-solid border-[#0062F1]'>
                <DatePicker
                  dateFormat='dd-MM-YYYY'
                  selected={date2}
                  onChange={(date: any) => {
                    setStatsParams({
                      ...statsParams,
                      sentAt: format(new Date(date), 'yyyy-MM-dd')
                    })
                    setDate2(date)
                  }}
                />
              </span>
            </div>

            {/* <button
      onClick={fetchEmailStatistics}
      className='button-style h-fit cursor-pointer self-center rounded-[81px] border-2 border-solid border-[#0062F1] px-4 py-2 text-sm text-primary'
    >
      Search
    </button> */}
          </div>

          <div className=''>
            <div className='flex flex-col'>
              <div className='-m-1.5 overflow-x-auto'>
                <div className='inline-block min-w-full p-1.5 align-middle'>
                  <div className='overflow-hidden'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead>
                        <tr>
                          <th
                            scope='col'
                            className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                          >
                            clicked at
                          </th>

                          <th
                            scope='col'
                            className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                          >
                            First Name
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                          >
                            Last Name
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                          >
                            Email
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                          >
                            Startup Name
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                          >
                            Purpose
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                          >
                            Phone No.
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200'>
                        {Array.isArray(demoStats?.data) &&
                          demoStats?.data?.map((demo: any, index: number) => (
                            <tr key={index}>
                              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                                {format(
                                  new Date(demo?.creationTimestamp),
                                  'dd-MM-yyyy'
                                )}
                              </td>
                              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                                {demo?.firstName}
                              </td>
                              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                                {demo?.lastName}
                              </td>
                              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                                {demo?.businessEmail}
                              </td>
                              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                                {demo.startupName}
                              </td>
                              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                                {demo.purpose}
                              </td>
                              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                                {demo.phoneNumber}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {demoStats?.data?.length === 0 && (
              <div className='col-span-4 flex h-56  items-center justify-center'>
                <h3 className='text-2xl font-bold  text-secondary-foreground '>
                  No Booking Found
                </h3>
              </div>
            )}

            {demoStats === null && (
              <div className='col-span-4 flex h-56  items-center justify-center'>
                <h3 className='text-2xl font-bold  text-secondary-foreground '>
                  Loading...
                </h3>
              </div>
            )}

            {demoStats?.error !== null && (
              <div className='col-span-4 flex h-56  items-center justify-center'>
                <h3 className='text-2xl font-bold  text-secondary-foreground '>
                  {demoStats?.error}
                </h3>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default DemoDetails
