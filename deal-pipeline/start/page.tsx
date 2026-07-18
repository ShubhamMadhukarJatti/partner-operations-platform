'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePricingModal } from '@/contexts/pricing-modal-context'
import {
  IconBrandStorj,
  IconChartPieFilled,
  IconFileTextShield
} from '@tabler/icons-react'
import { FileBadge, HeartHandshake, Sparkles, ZapOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { showCustomToast } from '@/components/custom-toast'

import { updateDealPipelineStatus } from '../actions'

function DealRegistrationStartPage() {
  const { openPricingModal } = usePricingModal()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const isBusy = isLoading || isChecking

  // Reverse logic: if user is already allowed, skip start page
  useEffect(() => {
    let cancelled = false
    let redirected = false

    const checkStatus = async () => {
      try {
        const res = await fetch('/api/deal-pipeline/placeholder-status', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
          headers: {
            accept: 'application/json'
          }
        })

        if (!res.ok) return

        const data = await res.json()

        if (!cancelled && data?.canContinue) {
          // Already eligible; skip start and go directly
          redirected = true
          router.replace('/deal-pipeline')
          return
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Deal pipeline status check failed:', error)
        }
      } finally {
        if (!cancelled && !redirected) {
          setIsChecking(false)
        }
      }
    }

    checkStatus()
    return () => {
      cancelled = true
    }
  }, [router])

  async function updatePlaceholderStatus() {
    if (isBusy) return

    setIsLoading(true)
    try {
      const result = await updateDealPipelineStatus()

      if (result.success && result.data?.is_continue_free_deal) {
        showCustomToast('Success', 'Loading Freemium version', 'success', 5000)

        // Refresh the router cache to get the updated data
        router.refresh()

        // Small delay to ensure refresh completes
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Navigate to the deal pipeline page
        router.push('/deal-pipeline')
      } else {
        showCustomToast(
          'Error',
          'Failed to continue with freemium version.',
          'error',
          5000
        )
        console.log("Couldn't update placeholder page status", { result })
      }
    } catch (error) {
      console.error(error)
      showCustomToast(
        'Error',
        'Failed to continue with freemium version.',
        'error',
        5000
      )
    } finally {
      setIsLoading(false)
    }
  }

  // While checking status, show shimmer loader (same as partner mapping page)
  if (isChecking) {
    return (
      <div className='space-y-4 p-4'>
        {/* Heading + Description Shimmer */}
        <div>
          <Skeleton className='mb-2 h-7 w-48' />
          <Skeleton className='h-4 w-full max-w-2xl' />
          <Skeleton className='mt-2 h-4 w-3/4 max-w-xl' />
        </div>

        {/* Metric Cards Shimmer */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className='rounded-2xl shadow-none'>
              <CardContent className='flex flex-col items-start p-6'>
                <Skeleton className='mb-4 h-4 w-32' />
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-8 w-16' />
                  <Skeleton className='h-3 w-20' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Section Shimmer */}
        <div className='w-full'>
          <div className='border-b'>
            <div className='flex gap-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-10 w-32' />
              ))}
            </div>
          </div>
          <div className='pt-4'>
            <Skeleton className='h-64 w-full' />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='px-4 py-10 text-center md:px-0'>
        <h1 className='text-2xl font-bold md:text-3xl'>Deal Registration</h1>
      </div>
      <div className='grid grid-cols-1 grid-rows-6 gap-6 px-4 py-8 sm:grid-cols-2 sm:grid-rows-3 md:px-10 md:py-16 lg:grid-cols-3 lg:grid-rows-2 lg:px-20'>
        <div className='flex flex-col items-center justify-center p-6 text-center'>
          <IconBrandStorj className='mx-auto my-4 h-10 w-10 text-[#6863FB]' />
          <p className='font-medium'>Centralized Tracking</p>
          <p>
            Register and manage all your deals at one place for complete
            visibility.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center p-6 text-center'>
          <FileBadge className='mx-auto my-4 h-10 w-10 text-[#6863FB]' />
          <p className='font-medium'>Fair Ownership</p>
          <p>
            Ensure Partners get recognition and protection for their deals they
            bring in.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center p-6 text-center'>
          <ZapOff className='mx-auto my-4 h-10 w-10 text-[#6863FB]' />
          <p className='font-medium'>Avoid Conflicts</p>
          <p>
            Prevent multiple partners from claiming the same deal through
            transparent registration.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center p-6 text-center'>
          <HeartHandshake className='mx-auto my-4 h-10 w-10 text-[#6863FB]' />
          <p className='font-medium'>Boost Collaboration</p>
          <p>
            Align sales efforts between you and your partners with clear deal
            information.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center p-6 text-center'>
          <IconChartPieFilled className='mx-auto my-4 h-10 w-10 text-[#6863FB]' />
          <p className='font-medium'>Data-Driven Insights</p>
          <p>
            Track deal status, progress, and outcomes to measure partner
            performance.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center p-6 text-center'>
          <IconFileTextShield className='mx-auto my-4 h-10 w-10 text-[#6863FB]' />
          <p className='font-medium'>Secure Process</p>
          <p>
            Maintain transparency and trust by documenting every registered
            deal.
          </p>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center gap-4 py-8 md:flex-row md:py-14'>
        <Button
          className='w-full rounded-full border-[#6863FB] bg-background text-[#6863FB] hover:bg-[#6863FB] hover:text-white md:w-auto'
          variant='outline'
          onClick={() => updatePlaceholderStatus()}
          disabled={isBusy}
        >
          {isBusy ? 'Loading...' : 'Continue with free version'}
        </Button>
        <Button
          onClick={() => openPricingModal()}
          className='w-full rounded-full bg-[#6863FB] text-white hover:bg-[#6863FB]/90 md:w-auto'
        >
          <Sparkles className='mr-1 h-5 w-5 fill-white text-white' />
          Get Premium Version
        </Button>
      </div>
      <div className='relative h-[350px] md:h-[500px] lg:h-screen'>
        <div className='absolute left-1/2 top-1/2 z-10 h-[250px] w-[90vw] -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-xl bg-gray-100 shadow-md md:h-[400px] md:w-[700px] lg:h-[612px] lg:w-[900px]'>
          <Image
            src='/images/dashboard/deal-pipeline-demo.webp'
            fill
            style={{ objectFit: 'cover' }}
            alt='Deal pipeline demo'
          />
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-1/2 w-full bg-[#7470DD] opacity-25'></div>
      </div>
    </div>
  )
}

export default DealRegistrationStartPage
