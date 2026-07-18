'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { AlertCircle, Check, Clock } from 'lucide-react'
import { useSelector } from 'react-redux'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter
} from '@/components/ui/alert-dialog'
import { Logo } from '@/components/icons/logo'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const GiftStep = () => {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const steps = [0, 5, 7, 9, 10, 17, 28, 45, 63, 80, 90, 92, 93, 99, 99, 99]

  const [step, setStep] = useState(1)
  const isModalVisible = useSelector(
    (state: RootState) => state.modal.isLoadingModalVisible
  )

  useEffect(() => {
    if (step < 4) {
      const timer = setTimeout(() => setStep(step + 1), 5000) // Move to the next step every 5 seconds
      return () => clearTimeout(timer)
    }
  }, [step])

  useEffect(() => {
    let index = 0

    const update = () => {
      if (index < steps.length) {
        setProgress(steps[index])
        index++
        setTimeout(update, 1000) // Adjust speed if needed
      }
    }

    update()
  }, [])

  return (
    <AlertDialog open={isModalVisible}>
      <AlertDialogContent className='h-screen w-screen max-w-none'>
        <div className='flex w-full max-w-full flex-col items-center justify-center'>
          {/* <Logo className='w-[150px]' />
          <h4 className='mt-6 text-center fds-text-lead-semibold text-text-100 '>
            You’ve Been Rewarded!
          </h4>
          <p className='mb-6 mt-2 text-center fds-text text-text-100'>
            Great news! {'You’ve'} received free credits to create AI proposals
            and elevate your business. Now, {"let's"} find the perfect partner
            to maximize this opportunity!
          </p>

          <Image src={'/gift.png'} alt='gift-icon' width={300} height={300} /> */}
          <div className='mx-auto w-[350px] lg:w-[500px]'>
            <Lottie
              animationData={require('@/lib/lottie-json/ventures.json')}
              loop={true}
            />
          </div>
          <p className='text-center'>
            Building your platform space{' '}
            <strong>{progress}%... completed</strong>
          </p>
        </div>
        <div className=''>
          {/* Progress Steps */}
          <div className='flex flex-col items-start justify-center gap-2 lg:flex-row lg:items-center'>
            <div className='flex items-center'>
              <div className='flex h-5 w-5 items-center justify-center rounded-full bg-green-500'>
                <Check className='h-3 w-3 text-white' />
              </div>
              <span className='ml-1 text-xs text-gray-700'>
                Creating Organization
              </span>
            </div>

            <div className='hidden h-0.5 w-4 bg-gray-200 lg:inline-block'>
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
              <span className='ml-1 text-xs text-gray-700'>Mapping User</span>
            </div>

            <div className='hidden h-0.5 w-4 bg-gray-200 lg:inline-block'>
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

            <div className='hidden h-0.5 w-4 bg-gray-200 lg:inline-block'></div>

            <div className='flex items-center'>
              <div className='flex h-5 w-5 items-center justify-center rounded-full bg-gray-200'>
                <span className='text-[10px] text-gray-500'>4</span>
              </div>
              <span className='ml-1 text-xs text-gray-400'>
                Redirect to dashboard
              </span>
            </div>
          </div>
          <p className='text-[#2B2B2B flex w-full justify-center py-6 text-xs'>
            We will redirect you to dashboard once it is done
          </p>
        </div>

        {/* <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => router.push('/getting-started')}
            className='h-12 w-full rounded-lg border bg-transparent fds-text-semibold text-primary-light-blue hover:bg-background-ghost-white hover:text-primary-light-blue'
          >
            Go to dashboard
          </AlertDialogAction>
        </AlertDialogFooter> */}
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default GiftStep
