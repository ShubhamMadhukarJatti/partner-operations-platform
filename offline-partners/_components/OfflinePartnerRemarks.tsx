import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  useOfflinePartnerDetails,
  useUpdateOfflinePartner
} from '@/http-hooks/offline-partners'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { Check, Loader2, PenLine } from 'lucide-react'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import DashboardItemWrapper from '../../dashboard/[id]/_components/dashboard-item-wrapper'

type Props = {}

const OfflinePartnerRemarks = (props: Props) => {
  const params = useParams()
  const organizationData = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  const { data } = useOfflinePartnerDetails(Number(params?.id))

  const {
    mutateAsync: updateOfflinePartner,
    isPending: updateOfflinePartnerLoading
  } = useUpdateOfflinePartner()

  const [remarks, setRemarks] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (data) {
      setRemarks(data?.remarks ?? '')
    }
  }, [data])

  const handleSubmitRemark = async () => {
    await updateOfflinePartner({
      organizationId: organizationData?.id,
      email: data?.email,
      partnerName: data?.partnerName,
      remarks
    })
    setIsEditing(false)
  }

  return (
    <DashboardItemWrapper className='p-4 shadow-none'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-shark-lg font-bold text-text-100'>Add Remarks</h3>
        <div className='relative'>
          <Textarea
            placeholder='Add remarks'
            disabled={!isEditing}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className='focus:ouline-none h-[100px] rounded-xl border-none bg-neutral-200 focus:ring-0'
          />
          <div className='absolute bottom-2 right-2'>
            {isEditing ? (
              <Button
                className='border-none p-3'
                onClick={handleSubmitRemark}
                disabled={updateOfflinePartnerLoading}
              >
                {updateOfflinePartnerLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Check className='h-4 w-4 ' />
                )}
              </Button>
            ) : (
              <Button
                variant='primary'
                className='border-none bg-neutral-200 p-2'
                onClick={() => setIsEditing(true)}
              >
                <PenLine className='h-4 w-4 text-primary-blue' />
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardItemWrapper>
  )
}

export default OfflinePartnerRemarks
