'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle,
  CheckSquare,
  Circle,
  Globe,
  Layers,
  Mail,
  Map,
  Square,
  Target,
  User,
  Users,
  Wrench
} from 'lucide-react'

import { getServerUser } from '@/lib/server'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import Placeholder from '../../../../public/onBoarding-v2.1/drop-off-placholder.svg'

type Card = {
  id: string
  title: string
  subtitle?: string
  selected: boolean
  completed: boolean
}

const buildCards = (onboardingData?: any): Card[] => {
  const titles = [
    'Welcome',
    'Email Verification',
    'Personal Details',
    'Company Website',
    'Your Role',
    'Partnership Context',
    'Team Size',
    'Current Partners',
    'Partnership Goals',
    'Preferred Regions',
    'Partnership Types'
  ]

  return titles.map((t, i) => {
    const stepNumber = i + 1
    let isCompleted = false

    // Only use API response data - no hardcoded completions
    if (onboardingData) {
      // Map step numbers to API response fields
      // Card 1 (Welcome) - show as completed if any step is completed (user has started)
      // Card 2 (Email Verification) - show as completed if any step is completed (user has started)
      // Card 3 (Personal Details) maps to step_one_completed
      // Card 4 (Company Website) maps to step_two_completed
      // etc.

      if (stepNumber === 1 || stepNumber === 2) {
        // Cards 1-2: Show as completed if user has started onboarding (any step completed)
        const hasAnyProgress =
          onboardingData.step_one_completed === true ||
          onboardingData.step_two_completed === true ||
          onboardingData.step_three_completed === true ||
          onboardingData.step_four_completed === true ||
          onboardingData.step_five_completed === true ||
          onboardingData.step_six_completed === true ||
          onboardingData.step_seven_completed === true ||
          onboardingData.step_eight_completed === true ||
          onboardingData.step_nine_completed === true ||
          onboardingData.step_ten_completed === true
        isCompleted = hasAnyProgress
      } else {
        // Cards 3-11: Map to API step fields
        const apiStepNumber = stepNumber - 2

        const stepFieldMap: Record<number, string> = {
          1: 'step_one_completed',
          2: 'step_two_completed',
          3: 'step_three_completed',
          4: 'step_four_completed',
          5: 'step_five_completed',
          6: 'step_six_completed',
          7: 'step_seven_completed',
          8: 'step_eight_completed',
          9: 'step_nine_completed',
          10: 'step_ten_completed',
          11: 'step_eleven_completed'
        }

        const stepField = stepFieldMap[apiStepNumber]
        if (stepField) {
          // Check if the step is completed (handle null, undefined, false, true)
          const stepValue = onboardingData[stepField]
          // Explicitly check for true boolean value (not just truthy)
          isCompleted = stepValue === true
        }
      }
    }

    return {
      id: `step-${stepNumber}`,
      title: t,
      selected: true,
      completed: isCompleted
    }
  })
}

const iconMap: Record<string, JSX.Element> = {
  welcome: <Users className='h-4 w-4' />,
  'personal details': <User className='h-4 w-4' />,
  'your role': <Briefcase className='h-4 w-4' />,
  'team size': <Users className='h-4 w-4' />,
  'email verification': <Mail className='h-4 w-4' />,
  'company website': <Globe className='h-4 w-4' />,
  'partnership context': <Building2 className='h-4 w-4' />,
  'current partners': <Users className='h-4 w-4' />,
  'partnership goals': <Target className='h-4 w-4' />,
  'preferred regions': <Globe className='h-4 w-4' />,
  'partnership types': <Layers className='h-4 w-4' />,
  'review & submit': <CheckCircle className='h-4 w-4' />
}

const IconFor = (title: string) =>
  iconMap[title.trim().toLowerCase()] ?? <Circle className='h-4 w-4' />

// Function to determine the current step from API response
// Returns the card step number based only on API data
const getCurrentStep = (onboardingData: any): number => {
  if (!onboardingData) return 1 // Start from first card if no data

  const steps = [
    'step_one_completed',
    'step_two_completed',
    'step_three_completed',
    'step_four_completed',
    'step_five_completed',
    'step_six_completed',
    'step_seven_completed',
    'step_eight_completed',
    'step_nine_completed',
    'step_ten_completed',
    'step_eleven_completed'
  ]

  // Find the first incomplete API step
  // API step_one_completed maps to card 3, step_two_completed maps to card 4, etc.
  // So: API step (i+1) maps to card step (i+3)
  for (let i = 0; i < steps.length; i++) {
    const stepValue = onboardingData[steps[i]]
    // Check if step is NOT completed (null, undefined, false, or not true)
    if (stepValue !== true) {
      // Return card step number: API step (i+1) maps to card step (i+3)
      console.log(
        `First incomplete step found: ${steps[i]} (value: ${stepValue}), returning card step ${i + 3}`
      )
      return i + 3
    }
  }

  // If all API steps are completed, return the last card step (11, since we have 11 cards)
  console.log('All steps completed, returning card step 11')
  return 11
}

async function fetchOnboardingSteps(userId: string, token: string) {
  try {
    const response = await fetch(`/api/onboarding/steps/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch onboarding steps')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching onboarding steps:', error)
    return null
  }
}

export default function OnboardingStepsPage(): JSX.Element {
  const [onboardingData, setOnboardingData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchOnboardingData = async () => {
      try {
        setLoading(true)
        setError(null)

        const { token, user } = await getServerUser()
        console.log('token', token)
        console.log('user', user)
        if (!user?.uid) {
          throw new Error('User ID not found')
        }

        if (!token) {
          throw new Error('Token not found')
        }

        const data = await fetchOnboardingSteps(user.uid, token)
        console.log('Onboarding data from API:', data)
        setOnboardingData(data)
      } catch (err) {
        console.error('Failed to fetch onboarding data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchOnboardingData()
  }, [])

  const cards = buildCards(onboardingData)
  const TOTAL = cards.length // Use actual number of cards from API response
  const completedCount = cards.filter((c) => c.completed).length
  const currentStep = getCurrentStep(onboardingData)

  // Debug logging
  console.log('Onboarding data:', onboardingData)
  console.log('Cards:', cards)
  console.log('Completed count:', completedCount)
  console.log('Current step:', currentStep)

  const handleContinueSetup = () => {
    // Convert card step number to onboarding step number
    // Card 3 = Onboarding step 1, Card 4 = Onboarding step 2, etc.
    // Cards 1-2 (Welcome, Email Verification) are not part of onboarding flow
    // If currentStep is 1 or 2, start from step 1, otherwise subtract 2
    const onboardingStep = currentStep >= 3 ? currentStep - 2 : 1

    // Ensure onboarding step is at least 1 and at most 10
    const finalStep = Math.max(1, Math.min(10, onboardingStep))

    console.log('Continue Setup clicked:')
    console.log('- Current card step:', currentStep)
    console.log('- Calculated onboarding step:', onboardingStep)
    console.log('- Final onboarding step:', finalStep)
    console.log('- Onboarding data:', onboardingData)

    router.push(`/onboarding-v2.1?step=${finalStep}`)
  }

  if (loading) {
    return (
      <div className='flex h-full min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600'></div>
          <p className='mt-2 text-gray-500'>Loading your progress...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-full min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-red-600'>Error</h2>
          <p className='mt-2 text-gray-500'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-full min-h-screen justify-center'>
      <div className='flex h-screen w-full flex-col bg-white'>
        {/* Fixed Header */}
        <div className='sticky top-0 z-10  bg-white'>
          <div className='flex justify-center p-3'>
            <div className='flex w-full flex-col justify-center text-center md:w-3/4 lg:w-1/2'>
              <div className='flex justify-between pb-4'>
                <Image
                  src={'/icons/logo.png'}
                  alt='sharkdom'
                  height={100}
                  width={100}
                />
                <div className='text-xs text-gray-500 sm:block'>
                  Step {currentStep} of {TOTAL}
                </div>
              </div>
              <div className='mt-1 flex w-full items-center justify-center gap-2'>
                {Array.from({ length: TOTAL }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 max-w-[80px] flex-1 rounded-full transition-colors duration-300 ${
                      index < completedCount
                        ? 'bg-[#3E50F7]'
                        : index === completedCount
                          ? 'bg-[#3E50F7] opacity-50'
                          : 'bg-[#D9D9D9]'
                    }`}
                  />
                ))}
              </div>
              {/* <StepProgressBar totalSteps={10} currentStep={stepCount} /> */}
            </div>
          </div>
          <div className='border-b' />
        </div>

        {/* Scrollable content */}
        <main className='flex justify-center overflow-y-auto px-4 sm:px-6 sm:py-10'>
          <div className='w-full max-w-xl'>
            {' '}
            {/* reduced outer width */}
            {/* Hero */}
            <div className='text-center'>
              <div className='mx-auto -mt-4 flex w-32 items-center justify-center'>
                <Image src={Placeholder} alt='img' height={120} width={120} />
              </div>

              <h2 className='mt-3 text-xl font-semibold sm:text-2xl'>
                Welcome back!
              </h2>
              <p className='mt-2 text-xs text-gray-500 sm:text-sm'>
                We saved your progress. You&apos;re{' '}
                {Math.round((completedCount / TOTAL) * 100)}% done with your
                Sharkdom setup.
              </p>
            </div>
            {/* Progress card with 12 cards */}
            <section className='mx-auto mt-4 w-full rounded-xl border border-[#CED0FE] bg-[#F3F3FE]  p-4 sm:mt-8 sm:p-6'>
              <div className='mb-3 flex items-center justify-between'>
                <div className='text-sm font-semibold'>Your Progress</div>
                <div className='text-sm font-semibold text-[#3E50F7]'>
                  {completedCount}/{TOTAL} Steps
                </div>
              </div>

              {/* Grid: always 2 per row */}
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                {cards.map((card) => {
                  const isCurrent = !card.completed && card.selected

                  const cardBorderClass = card.completed
                    ? 'border-[#3E50F7] bg-[#EBEBFE]'
                    : card.selected
                      ? 'border-indigo-300 bg-white'
                      : 'border-gray-200 bg-white/70'

                  return (
                    <div
                      key={card.id}
                      className={`flex items-center justify-between gap-3 rounded-lg border pr-3 ${cardBorderClass}`}
                    >
                      {/* Left: icon + title */}
                      <div className='flex min-w-0 items-center'>
                        <div
                          className={`flex h-10 w-10 items-center justify-center ${
                            card.completed ? 'text-[#3E50F7]' : 'text-gray-500'
                          }`}
                        >
                          {IconFor(card.title)}
                        </div>

                        <div
                          className={`truncate text-sm font-normal ${card.completed ? 'text-[#3E50F7]' : ''}`}
                        >
                          {card.title}
                        </div>
                      </div>

                      {/* Right: status */}
                      <Checkbox checked={card.completed} />
                    </div>
                  )
                })}
              </div>
            </section>
            {/* CTA area: stack on mobile, inline on desktop */}
            <div className='mt-4 flex flex-col items-stretch gap-3 sm:mt-6 sm:flex-row sm:items-center'>
              <Button
                onClick={handleContinueSetup}
                className='w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white hover:opacity-95 sm:flex-1'
              >
                Continue Setup →
              </Button>

              <Button variant='outline' className='w-full sm:w-auto'>
                Cancel
              </Button>
            </div>
            <div className='mt-3 pb-4 text-center text-xs text-gray-400'>
              Your progress is automatically saved. You can return anytime to
              complete your setup.
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
