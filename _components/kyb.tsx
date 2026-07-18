'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'

export const KYB = ({
  organizationId,
  className
}: {
  organizationId: number
  className?: string
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handler = (HyperKycResult: any) => {
    switch (HyperKycResult.status) {
      // ----Incomplete workflow-----
      case 'user_cancelled':
        showCustomToast(
          'Error',
          'KYC process cancelled. Please try again.',
          'error',
          5000
        )
        break
      case 'error':
        showCustomToast(
          'Error',
          'Something went wrong. Please try again.',
          'error',
          5000
        )
        break

      // ----Complete workflow-----
      case 'auto_approved':
        showCustomToast(
          'Success',
          'KYC process completed successfully.',
          'success',
          5000
        )
        router.push('/explore')
        break
      case 'auto_declined':
        showCustomToast(
          'Error',
          'Verification failed. Please try again.',
          'error',
          5000
        )
        break
      case 'needs_review':
        showCustomToast(
          'Warning',
          'Your application is under review. We will notify you once it is approved.',
          'error',
          5000
        )
        router.push('/explore')
        break
    }
  }

  const getAccessToken = async () => {
    const res = await fetch('/api/hyperverge')
    const response = await res.json()
    return response.data.result.token as string
  }

  const startKYC = async () => {
    try {
      setIsLoading(true)
      const accessToken = await getAccessToken()
      const hyperKycConfig = new window.HyperKycConfig(
        accessToken,
        'SharkdomVerification',
        `hv_kyb_${organizationId}_${Date.now()}`
      )

      new window.HyperKYCModule.launch(hyperKycConfig, handler)
    } catch (error) {
      showCustomToast(
        'Error',
        'Something went wrong. Please try again.',
        'error',
        5000
      )
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={startKYC}
      loading={isLoading}
      className={cn('', className)}
      variant='default'
    >
      Verify
    </Button>
  )
}
