import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PopoverClose } from '@radix-ui/react-popover'
import { ChevronDown, ExternalLink, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  CheckedIcon,
  FilledCheckedIcon,
  RocketIcon
} from '@/components/icons/icons'

const Steps: React.FC<{
  step: any
  index: number
  steps: any
  setSteps: any
}> = ({ step, index, steps, setSteps }) => {
  const [isOpen, setIsOpen] = React.useState(true)
  const isVisited = step.isVisited
  const isActive = step.isActive

  const updateSteps = () => {
    const isLastStep = index === steps.length - 1

    const updatedSteps = steps.map((s: any, idx: number) => {
      if (idx === index) {
        return { ...s, isActive: false, isVisited: true }
      }
      if (!isLastStep && idx === index + 1) {
        return { ...s, isActive: true }
      }
      return s
    })

    if (isLastStep) {
      localStorage.setItem('hasCompletedTheTour', 'true')
    }

    setSteps(updatedSteps)
    localStorage.setItem('userTourSteps', JSON.stringify(updatedSteps))
  }

  const openStep = () => {
    const updatedSteps = steps.map((s: any, idx: number) => {
      if (idx === index && s.isVisited) return { ...s, isActive: !isActive }
      return s
    })
    // localStorage.setItem('userTourSteps', JSON.stringify(updatedSteps))
    setSteps(updatedSteps)
  }

  const handleRemindLater = () => {
    updateSteps()
  }

  const handleClick = () => {
    if (step.onClick) step.onClick()
    updateSteps()
  }

  return (
    <Card className='p-4 shadow-md'>
      <CardContent className='p-0'>
        <Collapsible
          open={isActive}
          onOpenChange={() => openStep()}
          className='p-0'
        >
          <CollapsibleTrigger asChild>
            <div className='flex cursor-pointer items-center justify-between'>
              <div className='flex gap-2'>
                {isVisited ? <FilledCheckedIcon /> : <CheckedIcon />}
                <h4
                  className={cn(
                    'text-base font-semibold',
                    step.isVisited ? 'text-text-60' : ''
                  )}
                >
                  {step.title}
                </h4>
              </div>
              <Button className='h-auto p-2' variant='ghost' size='sm'>
                <ChevronDown className='h-4 w-4' />
                <span className='sr-only'>Toggle</span>
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className='mt-2 p-0'>
            <p className='mb-6 text-sm font-normal text-[#181D27]'>
              {step.description}
            </p>
            <div>
              <Button onClick={() => handleClick()}>
                {step.id === 'step-1' ? (
                  <span className='flex items-center gap-1'>
                    View more <ExternalLink size={16} />{' '}
                  </span>
                ) : (
                  'Try it'
                )}
              </Button>
              <Button variant='link' onClick={handleRemindLater}>
                Remind later
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

const StepIndicator = ({ steps }: { steps: any }) => {
  return (
    <div className='flex w-full gap-1'>
      {steps.map((step: any, idx: any) => (
        <div
          key={step.id}
          className={cn(
            'h-2 w-full border bg-[#E5EFFE33]',
            idx === 0 ? 'rounded-l-md' : '',
            idx === steps.length - 1 ? 'rounded-r-md' : '',
            step.isVisited || step.isActive ? 'bg-[#3E50F7]' : ''
          )}
        />
      ))}
    </div>
  )
}

const InsideTour: React.FC<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ open, setOpen }) => {
  const router = useRouter()
  const defaultSteps = [
    {
      id: 'step-1',
      step: 1,
      title: 'My data',
      description:
        'Identify the right opportunity, partners and enhance relationships by checking customer segment overlaps.',
      stepCompleted: false,
      isVisited: false,
      isActive: false,
      onClick: () => router.push('/my-data')
    },
    {
      id: 'step-2',
      step: 2,
      title: 'Partnership enquiry',
      description:
        'Send partnership enquiries to over 1k+ tech companies, open for partnership 24x7, use overlaps to find your IPP faster.',
      stepCompleted: false,
      isVisited: false,
      isActive: false,
      onClick: () =>
        window.open(
          'https://help.sharkdom.com/feature-suite/introduction-to-partner-discovery'
        )
    },
    // {
    //   id: 'step-3',
    //   step: 3,
    //   title: 'Partner mapping',
    //   description:
    //     'Compare which of your partners have similar overlaps and start with joint email marketing program.',
    //   stepCompleted: false,
    //   isVisited: false,
    //   isActive: false,
    //   onClick: () => router.push('/partner-mapping')
    // },
    {
      id: 'step-4',
      step: 4,
      title: 'Offline partner',
      description:
        'Manage your partners which are not part of sharkdom’s ecosystem with or without inviting them.',
      stepCompleted: false,
      isVisited: false,
      isActive: false,
      onClick: () => router.push('/offline-partners')
    },
    {
      id: 'step-5',
      step: 5,
      title: 'Ai search',
      description:
        'Give your partnership journey a milestone to achieve using our AI search, breaking your search.',
      stepCompleted: false,
      isVisited: false,
      isActive: false,
      onClick: () => router.push('/explore')
    }
  ]

  const [steps, setSteps] = useState<any>([])

  // This effect runs only once on component mount
  useEffect(() => {
    const initializeSteps = () => {
      const savedStepsJSON = localStorage.getItem('userTourSteps')

      if (savedStepsJSON) {
        try {
          // Parse the saved steps
          const savedSteps = JSON.parse(savedStepsJSON)

          // Ensure we have the correct number of steps
          if (savedSteps.length === defaultSteps.length) {
            // Merge saved state with default onClick handlers
            const restoredSteps = savedSteps.map(
              (savedStep: any, i: number) => ({
                ...savedStep,
                onClick: defaultSteps[i].onClick // Preserve the onClick handlers
              })
            )

            // If no step is active, find the next unvisited step and make it active
            const hasActiveStep = restoredSteps.some(
              (step: any) => step.isActive
            )
            if (!hasActiveStep) {
              const nextIndex = restoredSteps.findIndex(
                (step: any) => !step.isVisited
              )
              if (nextIndex !== -1) {
                restoredSteps[nextIndex].isActive = true
              }
            }

            setSteps(restoredSteps)
            return
          }
        } catch (error) {
          console.error('Error parsing saved steps:', error)
          // Continue to initialize with default steps
        }
      }

      // If no valid saved steps, initialize with defaults
      const initialSteps = defaultSteps.map((step, i) => ({
        ...step,
        isActive: i === 0 // Make first step active
      }))

      setSteps(initialSteps)
      localStorage.setItem('userTourSteps', JSON.stringify(initialSteps))
    }

    initializeSteps()
  }, [])

  // Save to localStorage whenever steps change (but not on initial mount)
  useEffect(() => {
    if (steps.length > 0) {
      localStorage.setItem('userTourSteps', JSON.stringify(steps))
    }
  }, [steps])

  const visitedCount = steps.filter((s: any) => s.isVisited).length

  // Don't render until steps are initialized
  if (steps.length === 0) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className='gap-2 bg-gradient-to-br from-[#0062F1] to-[#00398B] p-4 text-sm font-bold text-white'>
          <RocketIcon /> Getting Started <span>{visitedCount}/5</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-screen p-0 lg:w-[416px]'>
        <div className='p-4'>
          {/* Header */}
          <div className='relative flex flex-col gap-2'>
            <div>
              <p className='text-base font-normal text-[#181D27]'>
                Explore and setup your profile
              </p>
              <p className='text-base font-semibold text-[#181D27]'>
                Getting started!
              </p>
            </div>
            <PopoverClose className='absolute right-0 top-0'>
              <X size={14} />
            </PopoverClose>

            <StepIndicator steps={steps} />
          </div>

          {/* Body */}
          <div className='pt-4'>
            <p className='text-base font-semibold text-[#2E0B34]'>Intro</p>

            <div className='mt-2 space-y-2'>
              {steps.map((step: any, index: number) => (
                <Steps
                  key={step.id}
                  step={step}
                  index={index}
                  steps={steps}
                  setSteps={setSteps}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default InsideTour
