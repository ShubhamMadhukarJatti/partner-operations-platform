'use client'

import React, { useEffect, useState } from 'react'

import { showCustomToast } from '@/components/custom-toast'

interface SchedulerMethod {
  className: string
  methodName: string
  cron: string | null
  fixedDelay: number | null
  fixedRate: number | null
}

const SchedulerTable = () => {
  const [schedulerData, setSchedulerData] = useState<SchedulerMethod[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getSchedulerData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin-portal/scheduler', {
        headers: {
          Authorization: `Bearer ${'token'}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch scheduler data')
      }

      const data = await response.json()
      setSchedulerData(data)
    } catch (error: any) {
      showCustomToast(
        'Error',
        error?.message || 'Something went wrong, please try again.',
        'error',
        5000
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSchedulerData()
  }, [])

  const formatSchedule = (method: SchedulerMethod) => {
    if (method.cron) {
      return `Cron: ${method.cron}`
    } else if (method.fixedRate) {
      return `Every ${method.fixedRate / 1000} seconds`
    } else if (method.fixedDelay) {
      return `After ${method.fixedDelay / 1000} seconds delay`
    }
    return 'Not scheduled'
  }

  return (
    <div className='mx-auto my-4 max-w-6xl overflow-hidden rounded-lg border bg-white shadow-sm'>
      <div className='flex flex-col'>
        <div className='-m-1.5 overflow-x-auto'>
          <div className='inline-block min-w-full p-1.5 align-middle'>
            <div className='overflow-hidden'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-muted py-2'>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                    >
                      Class Name
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                    >
                      Method Name
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                    >
                      Schedule
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {schedulerData.map((item, index) => (
                    <tr key={index} className='hover:bg-gray-50'>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                        <div className='font-medium'>{item.className}</div>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                        <div className='font-medium'>{item.methodName}</div>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                        <div className='inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700'>
                          {formatSchedule(item)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {schedulerData.length === 0 && !loading && (
        <div className='col-span-4 flex h-56 items-center justify-center'>
          <h3 className='text-2xl font-bold text-secondary-foreground'>
            No Scheduled Methods Found
          </h3>
        </div>
      )}

      {loading && (
        <div className='col-span-4 flex h-56 items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
        </div>
      )}
    </div>
  )
}

export default SchedulerTable
