'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ConfigType } from '@/types'
import { nanoid } from 'nanoid'
import { SubmitHandler, useForm } from 'react-hook-form'

import { createOrganization, createUser } from '@/lib/actions/onboarding'
import { getFirebaseAuth } from '@/lib/firebase/auth/firebase'
import useFormStore, { OnboardingFormData } from '@/lib/stores/useFormStore'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { showCustomToast } from '@/components/custom-toast'
import { Logo } from '@/components/icons/logo'
import StartupDetailsStep from '@/app/(onboarding)/_components/startup-details-form'
import StepperNew from '@/app/(onboarding)/_components/StepperNew'
import UserOnboardingForm from '@/app/(onboarding)/_components/user-onboarding-form'
import YourGoalsStep from '@/app/(onboarding)/_components/your-goals-form'

type OnboardingData = {
  userDetails: { name: string; role: string }
  startupDetails: {
    briefDescription: string
    code: string
    name: string
    sector: string
  }
  goalsStep: {
    sectors: Record<string, string>
    partnerTypes: string[]
  }
}

type Props = {
  sectors: {
    value: string
    label: string
  }[]
}

const OnboardingFlowForm = ({ sectors }: Props) => {
  const {
    step: currentStep,
    formData,
    setFormData,
    nextStep,
    backStep,
    setStep
  } = useFormStore()

  const [loading, setLoading] = useState<boolean>(false)

  const [configuration, setConfiguration] = useState<{
    preferredSectors: ConfigType[]
    preferredPartnerships: ConfigType[]
  }>({ preferredSectors: [], preferredPartnerships: [] })

  const router = useRouter()
  const email = sessionStorage.getItem('email')

  const [onBoardingData, setOnboardingData] = useState<OnboardingData>({
    userDetails: { name: '', role: '' },
    startupDetails: {
      briefDescription: '',
      code: '',
      name: '',
      sector: ''
    },
    goalsStep: {
      sectors: {},
      partnerTypes: []
    }
  })

  const form = useForm<OnboardingFormData>({
    defaultValues: formData
  })

  const { getValues } = form

  const { currentUser } = getFirebaseAuth()

  useEffect(() => {
    const fetchConfiguration = async () => {
      const types = ['PREFERRED_SECTORS', 'PREFERRED_PARTNERSHIPS']

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
          const key =
            type === 'PREFERRED_SECTORS'
              ? 'preferredSectors'
              : 'preferredPartnerships'
          acc[key] = data
          return acc
        }, {})

        setConfiguration(configData)
      } catch (error) {
        console.error('Error fetching configurations:', error)
      }
    }

    fetchConfiguration()
  }, [])

  const renderOrganizationForm = () => {
    switch (currentStep) {
      case 1:
        return <UserOnboardingForm />
      case 2:
        return (
          <StartupDetailsStep
            sectors={sectors}
            onBoardingData={onBoardingData}
            setOnboardingData={setOnboardingData}
          />
        )
      case 3:
        return (
          <>
            <YourGoalsStep
              sectors={sectors}
              onBoardingData={onBoardingData}
              setOnboardingData={setOnboardingData}
              configuration={configuration!}
            />
          </>
        )

      default:
        return null
    }
  }

  const onSubmit: SubmitHandler<OnboardingFormData> = async (data) => {
    setFormData(data)
    setLoading(true)
    if (currentStep < 3) {
      nextStep()
      setLoading(false)
    } else {
      // nextStep()
      setLoading(true)
      const organizationData = {
        primaryEmail: email,
        name: data.step2.legalName,
        roleSpecs: data.step1.roleSpecs,
        about: data.step2.about,
        website: data.step2.website,
        sector: data.step2.sector,
        onboardedPartners: data.step2.onboardedPartners,
        companyType: data.step2.companyType,
        code: `${data.step2?.legalName?.split(' ').join('').toLowerCase()}${nanoid(
          6
        )}`,
        briefDescription: data.step2.briefDescription,

        preferredSectors: data.step3.preferredSectors,
        preferredPartnershipTypes: data.step3.preferredPartnershipTypes
      }

      try {
        createOrganization(organizationData).then((response) => {
          console.log('Organization created successfully')
          setLoading(false)

          router.push('/enterprise-onboarding/onboarding/payment')
        })
      } catch (error) {
        console.log('error->', error)
        showCustomToast('Error', 'Error creating organization', 'error', 5000)
      }
    }
  }

  return (
    <div className='    hide-scrollbar flex h-full w-full max-w-[508px] flex-col  overflow-scroll pb-20 '>
      <div className=''>
        <Logo className='w-[150px]' />
      </div>

      <StepperNew />

      <Form {...form}>
        <form
          className=' flex h-full   w-full flex-col '
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {renderOrganizationForm()}
          <div className=' mt-auto flex justify-between'>
            {/* {currentStep > 1 ? (
              <Button
                className='h-12 w-[170px] rounded-lg border border-text-40 bg-white text-base font-bold text-text-100 hover:bg-shark-blue-50'
                type='button'
                onClick={backStep}
              >
                Back
              </Button>
            ) : (
              <Link href='/'>
                <Button className='h-12 w-[170px] rounded-lg border border-text-40 bg-white text-base font-bold text-text-100 hover:bg-shark-blue-50'>
                  Cancel
                </Button>
              </Link>
            )} */}

            {currentStep === 4 ? (
              <Link href='/getting-started' className='mt-10'>
                <Button className='h-12 w-full rounded-lg border border-text-40 bg-primary-light-blue text-base font-bold text-text-10'>
                  Find a partner
                </Button>
              </Link>
            ) : (
              <Button
                className=' mb-20 mt-10 h-12 w-full rounded-lg border border-text-40 bg-primary-light-blue text-base font-bold text-text-10'
                type='submit'
                loading={loading}
                disabled={loading}
                loadingText='loading...'
              >
                Continue
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}

export default OnboardingFlowForm
