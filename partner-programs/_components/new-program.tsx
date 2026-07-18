'use client'

import { useEffect } from 'react'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { showCustomToast } from '@/components/custom-toast'

function NewProgram() {
  const organizationData = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  const fetchCampaigns = async () => {
    if (!organizationData || !organizationData?.id) {
      showCustomToast('Error', 'org not found', 'error', 5000)
      return
    }
    try {
      const response = await fetch('/api/get-referral-campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orgId: organizationData.id
        })
      })

      if (!response.ok) {
        console.log('response', response)
        throw new Error('Failed to get campaigns')
      }

      const data = await response.json()
      // showCustomToast('Success', 'Referral link generated successfully', 'success', 5000)
    } catch (error) {
      console.error(error)
      showCustomToast('Error', 'Failed to get campaigns', 'error', 5000)
    }
  }

  useEffect(() => {
    if (organizationData && organizationData?.id) {
      fetchCampaigns()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationData])

  return (
    <Card className='w-max p-8 shadow-sm'>
      <div className='flex flex-col gap-6'>
        <h1 className='text-lg font-medium'>Start a new program</h1>
        <div className='flex gap-6'>
          <Button className='bg-0 text-md hover:bg-0 flex justify-end gap-6 rounded-3xl border-2 border-black px-12 text-[#3662E3] hover:shadow-md'>
            Referral program
          </Button>
          <Button className='text-md hover:bg-0 flex justify-end gap-6 rounded-3xl border px-12 hover:shadow-md'>
            Shoutout campaign
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default NewProgram
