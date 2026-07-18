'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { AlertCircle, Check, Clock } from 'lucide-react'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type Props = {
  estimatedTime?: string
  progress?: number
  timeRemaining?: string
  startedAt?: string
}

const UnderReview = ({
  estimatedTime = '15-20 minutes',
  progress,
  timeRemaining,
  startedAt
}: Props) => {
  const [step, setStep] = useState(1)
  const [elapsedMinutes, setElapsedMinutes] = useState(0)

  useEffect(() => {
    if (step < 4) {
      const timer = setTimeout(() => setStep(step + 1), 5000) // Move to the next step every 5 seconds
      return () => clearTimeout(timer)
    }
  }, [step])

  useEffect(() => {
    if (!startedAt) return

    const updateElapsed = () => {
      const start = new Date(startedAt).getTime()
      if (Number.isNaN(start)) return

      const elapsed = Math.max(
        0,
        Math.floor((Date.now() - start) / (60 * 1000))
      )
      setElapsedMinutes(elapsed)
    }

    updateElapsed()
    const timer = setInterval(updateElapsed, 30000)

    return () => clearInterval(timer)
  }, [startedAt])

  const statusLabel =
    typeof progress === 'number'
      ? `Syncing data (${progress}% complete)`
      : 'Syncing your CRM data'

  const helperLabel = timeRemaining
    ? `${timeRemaining} remaining`
    : elapsedMinutes > 0
      ? `Started ${elapsedMinutes} min${elapsedMinutes === 1 ? '' : 's'} ago`
      : `This usually takes ${estimatedTime}`

  return (
    <div className=''>
      {/* Alert Banner */}
      <div className=' flex items-start gap-3 rounded-lg border border-amber-200 bg-[#FBF5E7] px-5 py-6'>
        <AlertCircle size={20} color='#FCAA3F' />
        <div>
          <h3 className='text-shark-base  font-bold text-text-100'>
            Your request is under review
          </h3>
          <p className='mt-1 text-shark-sm text-text-90'>
            This might take {estimatedTime} to complete. Once completed we will
            notify you through email and on the app under notifications
          </p>
        </div>
      </div>

      {/* Center Image - Will be replaced by user's SVG */}
      <div className='my-12 flex justify-center'>
        <div className=' h-64 w-64 '>
          <Lottie
            animationData={require('@/lib/lottie-json/under-review.json')}
            loop={true}
          />
        </div>
      </div>

      {/* Progress Section */}
      <div className='mt-8'>
        <div className='mb-2 flex justify-center'>
          <p className='text-sm font-medium'>{statusLabel}</p>
        </div>
        <p className='text-center text-xs text-gray-500'>{helperLabel}</p>

        {/* Progress Steps */}
        <div className='mt-4 flex items-center justify-center gap-2'>
          <div className='flex items-center'>
            <div className='flex h-5 w-5 items-center justify-center rounded-full bg-green-500'>
              <Check className='h-3 w-3 text-white' />
            </div>
            <span className='ml-1 text-xs text-gray-700'>Connecting</span>
          </div>

          <div className='h-0.5 w-4 bg-gray-200'>
            <div
              className={`h-full ${step >= 2 ? 'bg-green-500' : 'bg-gray-200'}`}
              style={{ width: '100%' }}
            ></div>
          </div>

          <div className='flex items-center'>
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full ${step >= 2 ? 'bg-green-500' : 'bg-amber-400'}`}
            >
              {step >= 2 ? (
                <Check className='h-3 w-3 text-white' />
              ) : (
                <Clock className='h-3 w-3 text-white' />
              )}
            </div>
            <span className='ml-1 text-xs text-gray-700'>Syncing Data</span>
          </div>

          <div className='h-0.5 w-4 bg-gray-200'>
            <div
              className={`h-full ${step >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}
              style={{ width: '100%' }}
            ></div>
          </div>

          <div className='flex items-center'>
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full ${step >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              {step >= 3 ? (
                <Check className='h-3 w-3 text-white' />
              ) : (
                <span className='text-[10px] text-gray-500'>3</span>
              )}
            </div>
            <span className='ml-1 text-xs text-gray-400'>Verifying</span>
          </div>

          <div className='h-0.5 w-4 bg-gray-200'></div>

          <div className='flex items-center'>
            <div className='flex h-5 w-5 items-center justify-center rounded-full bg-gray-200'>
              <span className='text-[10px] text-gray-500'>4</span>
            </div>
            <span className='ml-1 text-xs text-gray-400'>Completed</span>
          </div>
        </div>
        <p className='flex w-full justify-center py-6 text-xs text-[#2B2B2B]'>
          We will notify you once its done
        </p>
      </div>
    </div>
  )
}

export default UnderReview
