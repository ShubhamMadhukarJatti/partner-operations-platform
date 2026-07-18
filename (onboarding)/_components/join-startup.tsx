'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { OrganizationType } from '@/types'
import { useFormContext } from 'react-hook-form'

import {
  JoinOrganizationWithoutFormData,
  updateUser
} from '@/lib/actions/onboarding'
import { getOrganizationById } from '@/lib/db/organization'
import { getFirebaseAuth } from '@/lib/firebase/auth/firebase'
import { useDecrypt } from '@/lib/hooks/useDecrypt'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showCustomToast } from '@/components/custom-toast'

const JoinStartUp = ({ onBoardingData }: { onBoardingData: any }) => {
  const { control, watch } = useFormContext()
  const formName = watch('step1.name')
  const formRole = watch('step1.roleSpecs')

  const router = useRouter()
  const searchParams = useSearchParams()
  const utm_register = searchParams.get('utm_register')
  const { decryptData } = useDecrypt()
  const { currentUser } = getFirebaseAuth()
  const [data, setData] = useState<any>('')
  const [organizationData, setOrganizationData] = useState<OrganizationType>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (utm_register) {
      const decryptedData = decryptData(utm_register?.replace(/ /g, '+'))
      const splitData = decryptedData?.split(':')
      const [userId, orgId, role] = splitData
      setData({ userId, orgId, role })
    }
  }, [decryptData, utm_register])

  useEffect(() => {
    const getOrgDetails = async () => {
      const orgDetails = await getOrganizationById(data?.orgId)
      console.log(orgDetails, `now api fetches data`)
      setOrganizationData(orgDetails)
    }
    if (data && data?.orgId) {
      getOrgDetails()
    }
  }, [data, data?.orgId])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const dataResponse = await updateUser({
        name: formName,
        role: formRole
      })

      if (dataResponse?.id) {
        const formdata = {
          role: data?.role,
          userId: data?.userId,
          startup: data?.orgId,
          designation: formRole
        }
        const orgUserMapping = await JoinOrganizationWithoutFormData(formdata)
      }
      router.push('/explore')
      setLoading(false)
    } catch (e: any) {
      setLoading(false)
      console.log(e)
      showCustomToast(
        'Error',
        'Something went wrong, contact the owner.',
        'error',
        5000
      )
    }
  }

  return (
    <Card className='w-full max-w-lg border-0 shadow-none sm:border sm:!p-9'>
      <CardHeader className=''>
        <CardTitle className='text-center'>
          Request to join your startup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col-reverse items-center gap-2 lg:flex-row lg:justify-between'>
          <div className='w-full space-y-1'>
            <Label htmlFor='name' className='text-sm'>
              Startup name
            </Label>
            <Input
              disabled={true}
              id='name'
              value={organizationData?.name}
              type='text'
              className='w-full max-w-md flex-1 text-black'
              readOnly
            />
          </div>
        </div>
        <div className='mt-4 flex flex-col-reverse items-center gap-2 lg:flex-row lg:justify-between'>
          <div className='w-full space-y-1'>
            <Label htmlFor='name' className='text-sm'>
              Your designation
            </Label>
            <Input
              disabled={true}
              id='name'
              value={data?.role}
              type='text'
              className='w-full max-w-md flex-1 text-black'
              readOnly
            />
          </div>
        </div>

        <Button
          className=' mt-4 h-[unset] w-full text-lg font-semibold'
          // type='submit'
          type='button'
          loading={loading}
          disabled={loading}
          loadingText='loading...'
          onClick={handleSubmit}
        >
          Continue
        </Button>
        {/* </form> */}
      </CardContent>
    </Card>
  )
}

export default JoinStartUp
