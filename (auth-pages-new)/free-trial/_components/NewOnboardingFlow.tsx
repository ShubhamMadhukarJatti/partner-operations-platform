'use client'

import { useEffect, useState } from 'react'

import useFormStore from '@/lib/stores/useFormStore'
import AuthLeft from '@/app/(auth)/_components/auth-left-container'

import OnboardingFlowForm from './OnboardingFlowForm'
import OnboardingRight from './OnboardingRight'

type Props = {}

const NewOnboardingFlow = (props: Props) => {
  const [configuration, setConfiguration] = useState<{
    sectors: {
      value: string
      label: string
    }[]
  }>({ sectors: [] })

  // const {
  //   step: currentStep,
  //   formData,
  //   setFormData,
  //   nextStep,
  //   backStep,
  //   setStep
  // } = useFormStore()

  const { step, setStep } = useFormStore()

  const steps = [
    {
      heading: 'Still using spreadsheets to manage partnerships?',
      description:
        'Here is how Sharkdom helps you manage partnerships < add copy>',
      imageSrc: '/onboarding-image-2.png',
      imgWidth: 309,
      imgHeight: 216
    },
    {
      heading: 'Bring your Offline partners Online',
      description:
        'Bring your offline partners online! Our platform streamlines Partner management and 3X your success rate.',
      imageSrc: '/onboarding-image-3.png',
      imgWidth: 276,
      imgHeight: 246
    },
    {
      heading: 'Quick customer persona’s',
      description:
        'Companies creating persona have 356% more chances of finding their Ideal Partner',
      imageSrc: '/onboarding-image-4.png',
      imgWidth: 334,
      imgHeight: 306
    }
  ]

  useEffect(() => {
    const fetchConfiguration = async () => {
      const types = ['PREFERRED_SECTORS']

      try {
        const fetchPromises = types.map((type) =>
          fetch(`/api/configuration-by-type?type=${type}`).then((response) => {
            if (!response.ok) {
              throw new Error(
                `Failed to fetch configuration for type ${type}: ${response.statusText}`
              )
            }
            return response.json().then((data) => ({ type, data }))
          })
        )

        const results = await Promise.all(fetchPromises)
        const configData = results.reduce((acc: any, { type, data }) => {
          // const key = type === 'PREFERRED_SECTORS' ? 'sectors'
          acc['sectors'] = data.map((item: any) => ({
            value: item.value,
            label: item.key
          }))
          return acc
        }, {})

        setConfiguration(configData)
      } catch (error) {
        console.error('Error fetching configurations:', error)
      }
    }

    fetchConfiguration()
  }, [])

  return (
    <div className='flex'>
      <div className=' flex w-full flex-1 justify-start overflow-hidden'>
        <div className=' hidden min-h-screen items-center justify-center overflow-hidden lg:flex'>
          {/* <AuthNewSlider /> */}
          <AuthLeft title='data-drive approach for partnerships' />
        </div>
        <div className='flex h-full max-h-screen max-w-[780px] flex-1 items-start justify-center px-12 pt-20 lg:px-0'>
          <OnboardingFlowForm sectors={configuration.sectors} />
        </div>
      </div>
    </div>
  )
}

export default NewOnboardingFlow
