'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { getPartnerAlertData, updatePartnerAlert } from '@/lib/db/partner-alert'
import { useAuth } from '@/lib/firebase/auth/context'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { showCustomToast } from '@/components/custom-toast'

type Props = {
  token: any
}

const PartnerAlertTable = ({ token }: Props) => {
  // const { token } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [partnerStats, setPartnerStats] = useState<{
    data: any
    error: null | string
  } | null>(null)

  const fetchPartnerAlertData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getPartnerAlertData(token)

      setPartnerStats({ data: result, error: null })
    } catch (e) {
      showCustomToast(
        'Error',
        'Error while fetching  Partner Alert.',
        'error',
        5000
      )
      setPartnerStats({
        data: null,
        error: 'Error while fetching Partner Alert'
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) {
      fetchPartnerAlertData()
    }
  }, [fetchPartnerAlertData, token])

  const handleDateChange = async (day: string, disabled: boolean) => {
    setIsLoading(false)
    try {
      await updatePartnerAlert(day, disabled) // Update disabled status
      showCustomToast('Success', 'Updated alert for ${day}', 'success', 5000)
      fetchPartnerAlertData() // Refresh data after update
    } catch (error) {
      showCustomToast(
        'Error',
        'Failed to update alert for ${day}',
        'error',
        5000
      )
      console.error('Update Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      {isLoading ? (
        <>loading.....</>
      ) : (
        <div className='w-[500px] rounded-lg border border-gray-300 bg-white p-6 shadow-lg'>
          <strong>Alert Days</strong>
          {partnerStats &&
            partnerStats?.data?.map((day: any, index: number) => (
              <div
                key={index}
                className='my-4 flex items-center justify-between space-x-4'
              >
                {/* <input
                  type='checkbox'
                  className='h-5 w-5 rounded-md border-gray-300 focus:ring focus:ring-blue-400'
                /> */}

                <span className='flex-1 text-gray-700'>{day?.day}</span>

                <Input defaultValue='11:00 AM' className='rounded-md p-1' />

                <Switch
                  checked={day?.disabled}
                  onCheckedChange={(checked) =>
                    handleDateChange(day?.day, checked)
                  }
                />
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default PartnerAlertTable
