'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePricingModal } from '@/contexts/pricing-modal-context'
import {
  IconBrandSpeedtest,
  IconBulb,
  IconBusinessplan,
  IconChartPieFilled,
  IconTargetArrow
} from '@tabler/icons-react'
import { Gem, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { showCustomToast } from '@/components/custom-toast'

import { updatePartnerMappingStatus } from '../actions'

function PartnerMappingStartPage() {
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
        const res = await fetch('/api/partner-mapping/placeholder-status', {
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
          router.replace('/partner-mapping')
          return
        }
      } catch (error) {
        // swallow; we keep user on start page
        if (process.env.NODE_ENV === 'development') {
          console.error('Partner mapping status check failed:', error)
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
    if (isLoading) return

    setIsLoading(true)
    try {
      const result = await updatePartnerMappingStatus()

      if (result.success && result.data?.is_continue_free_partner_mapping) {
        showCustomToast('Success', 'Loading Freemium version', 'success', 5000)

        // Refresh the router cache to get the updated data
        router.refresh()

        // Small delay to ensure refresh completes
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Navigate to the partner mapping page
        router.push('/partner-mapping')
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

  // While checking status, show the same shimmer as the main page
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
      {isChecking && (
        <div className='w-full bg-gray-50 px-4 py-3 text-center text-sm text-gray-600'>
          Checking your partner mapping setup...
        </div>
      )}
      <div className='px-4 py-10 text-center md:px-0'>
        <h1 className='text-2xl font-bold md:text-3xl'>Partner Mapping</h1>
      </div>
      <div className='grid grid-cols-1 grid-rows-6 gap-6 px-4 py-8 sm:grid-cols-2 sm:grid-rows-3 md:px-10 md:py-16 lg:grid-cols-3 lg:grid-rows-2 lg:px-20'>
        <div className='flex flex-col items-center justify-center p-6 text-center'>
          <Gem className='mx-auto my-4 h-10 w-10 text-[#6863FB]' />
          <p>
            <span className='font-medium'>
              Understand and maximize partnership value
            </span>{' '}
            with a clear view of shared customers, overlapping opportunities,
            and ecosystem gaps.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center p-6 text-center'>
          <IconChartPieFilled className='mx-auto my-4 h-10 w-10 text-[#6863FB]' />
          <p>
            <span className='font-medium'>Simplify complex data</span> into
            clear, comparable metrics.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center p-6 text-center'>
          <IconTargetArrow className='mx-auto my-4 h-10 w-10 text-[#6863FB]' />
          <p>
            <span className='font-medium'>Align on mutual goals</span> to
            strengthen coordination and trust.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center p-6 text-center'>
          <IconBulb className='mx-auto my-4 h-10 w-10 text-[#6863FB]' />
          <p>
            <span className='font-medium'>Connect data sources</span> to unlock
            actionable insights across partners.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center p-6 text-center'>
          <IconBrandSpeedtest className='mx-auto my-4 h-10 w-10 text-[#6863FB]' />
          <p>
            <span className='font-medium'>Measure partner performance</span> and
            individual contribution effectively.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center p-6 text-center'>
          <IconBusinessplan className='mx-auto my-4 h-10 w-10 text-[#6863FB]' />
          <p>
            <span className='font-medium'>Drive revenue growth</span> by
            building more meaningful, data-driven partnerships.
          </p>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center gap-4 px-2 py-8 md:flex-row'>
        <Button
          variant='primary'
          className='w-full rounded-full disabled:pointer-events-none disabled:cursor-not-allowed md:w-auto'
          onClick={() => updatePlaceholderStatus()}
          disabled={isBusy}
        >
          {isBusy ? 'Loading...' : 'Continue with free version'}
        </Button>
        <Button
          variant='primary'
          className='w-full rounded-full md:w-auto'
          onClick={() => openPricingModal()}
        >
          <Sparkles className='mr-1 h-5 w-5 fill-white text-white' />
          Get Premium Version
        </Button>
      </div>
      <div className='relative h-[350px] md:h-[500px] lg:h-screen'>
        <div className='absolute left-1/2 top-1/2 z-10 h-[250px] w-[90vw] -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-xl bg-gray-100 shadow-md md:h-[400px] md:w-[700px] lg:h-[612px] lg:w-[900px]'>
          <Image
            src='/images/dashboard/partner-mapping-demo.webp'
            fill
            style={{ objectFit: 'cover' }}
            alt='Partner mapping demo'
          />
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-1/2 w-full bg-[#7470DD] opacity-25'></div>
      </div>
    </div>
  )
}

export default PartnerMappingStartPage
