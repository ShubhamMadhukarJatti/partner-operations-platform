'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { showModal } from '@/redux/slices/registerModal'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import {
  createOrganization,
  // createUser,
  updateUser
} from '@/lib/actions/onboarding'
import useFormStore, { OnboardingFormData } from '@/lib/stores/useFormStore'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { showCustomToast } from '@/components/custom-toast'
import { Logo } from '@/components/icons/logo'

// import GiftStep from './gift-step'
import NewOnboardingForm from './NewOnboardingForm'

interface Props {
  // sectors: {
  //   value: string
  //   label: string
  // }[]

  demo?: boolean
  isPaid?: boolean
}

type OnboardingData = {
  userDetails: { name: string; role: string }
  startupDetails: {
    briefDescription: string
    code: string
    name: string
    sector: string
    visibility: boolean
  }
  goalsStep: {
    sectors: Record<string, string>
    partnerTypes: string[]
  }
}

export const CreateOrganizationForm = ({
  demo,
  isPaid
  // token,
}: Props) => {
  const {
    step: currentStep,
    formData,
    setFormData
    // nextStep,
    // backStep,
    // setStep
  } = useFormStore()

  const router = useRouter()
  const dispatch = useDispatch()
  const [websiteExistedError, setWebsiteExistedError] = useState(false)

  // const [payment, setPayment] = useState(isPaid)

  // const [configuration, setConfiguration] = useState<{
  //   preferredSectors: ConfigType[]
  //   preferredPartnerships: ConfigType[]
  // }>({ preferredSectors: [], preferredPartnerships: [] })

  const [loading, setLoading] = useState<boolean>(false)

  // const [openGift, setOpenGift] = useState<boolean>(false)

  // const [onBoardingData, setOnboardingData] = useState<OnboardingData>({
  //   userDetails: { name: '', role: '' },
  //   startupDetails: {
  //     briefDescription: '',
  //     code: '',
  //     name: '',
  //     sector: '',
  //     visibility: true
  //   },
  //   goalsStep: {
  //     sectors: {},
  //     partnerTypes: []
  //   }
  // })

  const searchParams = useSearchParams()

  const utm_register = searchParams.get('utm_register')

  const form = useForm<OnboardingFormData>({
    defaultValues: formData
  })

  const email = sessionStorage.getItem('email')

  const [country, setCountry] = useState('IN')

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await fetch(
          `https://ipinfo.io/json?token=${process.env.NEXT_PUBLIC_IPINFO_TOKEN}`
        )
        const data = await res.json()

        setCountry(data.country)
        // setCountry('USA')
      } catch (error) {
        console.error('Error fetching IP info:', error)
      }
    }

    fetchCountry()
  }, [])

  // useEffect(() => {
  //   const fetchConfiguration = async () => {
  //     const types = ['PREFERRED_SECTORS', 'PREFERRED_PARTNERSHIPS']

  //     try {
  //       const fetchPromises = types.map((type) =>
  //         fetch(`/api/configuration-by-type?type=${type}`).then((response) => {
  //           if (!response.ok) {
  //             throw new Error(
  //               `Failed to fetch configuration for type ${type}: ${response.statusText}`
  //             )
  //           }
  //           return response.json().then((data) => ({ type, data }))
  //         })
  //       )

  //       const results = await Promise.all(fetchPromises)
  //       console.log(results)
  //       const configData = results.reduce((acc: any, { type, data }) => {
  //         const key =
  //           type === 'PREFERRED_SECTORS'
  //             ? 'preferredSectors'
  //             : 'preferredPartnerships'
  //         acc[key] = data
  //         return acc
  //       }, {})

  //       setConfiguration(configData)
  //     } catch (error) {
  //       console.error('Error fetching configurations:', error)
  //     }
  //   }

  //   fetchConfiguration()
  // }, [])

  const onSubmit: SubmitHandler<OnboardingFormData> = async (data) => {
    setFormData(data)
    setLoading(true)
    const organizationData = {
      primaryEmail: email,
      roleSpecs: data.step1.roleSpecs,
      website: data.step2.website,
      status: data.step2.visibility ? 1 : 0
      // code: `${data.step2?.legalName?.split(' ').join('').toLowerCase()}${nanoid(
      //   6
      // )}`,
      // briefDescription: data.step2.briefDescription,

      // preferredSectors: data.step3.preferredSectors,
      // preferredPartnershipTypes: data.step3.preferredPartnershipTypes
    }

    const userData = {
      name: data.step1.name,
      role: data.step1.roleSpecs
    }

    try {
      updateUser(userData).then((res) => {
        createOrganization(organizationData)
          .then((response) => {
            showCustomToast(
              'Success',
              'Organization created successfully',
              'success',
              5000
            )
            setLoading(false)
            dispatch(showModal())
            router.push('/explore')
          })
          .catch((error) => {
            // console.log(error)

            console.log(String(error))

            switch (String(error)) {
              case 'Error: Error: An organization with this website domain already exists':
                setWebsiteExistedError(true)
            }
            showCustomToast('Error', error, 'error', 5000)
          })
      })
    } catch (error) {
      console.log('error->', error)
      showCustomToast('Error', 'Error creating organization', 'error', 5000)
    } finally {
      setLoading(false)
    }
  }

  // const renderOrganizationForm = () => {
  //   switch (currentStep) {
  //     case 1:
  //       return <UserOnboardingForm />
  //     case 2:
  //       if (utm_register) {
  //         return <JoinStartUp onBoardingData={onBoardingData} />
  //       }
  //       return (
  //         <StartupDetailsStep
  //           sectors={sectors}
  //           onBoardingData={onBoardingData}
  //           setOnboardingData={setOnboardingData}
  //           setPayment={setPayment}
  //         />
  //       )
  //     case 3:
  //       return (
  //         <>
  //           <YourGoalsStep
  //             sectors={sectors}
  //             onBoardingData={onBoardingData}
  //             setOnboardingData={setOnboardingData}
  //             configuration={configuration!}
  //           />
  //         </>
  //       )

  //     default:
  //       return null
  //   }
  // }

  return (
    <div className='    hide-scrollbar flex h-full w-full max-w-[508px] flex-col  overflow-scroll pb-20 '>
      <div className='mb-6'>
        <Logo className='w-[240px]' />
      </div>

      {/* <StepperNew /> */}
      {/* <GiftStep  /> */}
      <Form {...form}>
        <form
          className=' flex h-full w-full flex-col '
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* {renderOrganizationForm()} */}
          <NewOnboardingForm websiteExistedError={websiteExistedError} />
          {((utm_register && currentStep <= 1) || !utm_register) && (
            <>
              <div className=' mt-auto flex justify-between'>
                {currentStep === 4 ? (
                  <Link href='/getting-started'>
                    <Button className='h-12 w-full rounded-lg border border-text-40 bg-primary-light-blue text-base font-bold text-text-10'>
                      Find a partner
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className='h-12 w-full rounded-lg border border-text-40 bg-primary-light-blue text-base font-bold text-text-10'
                    type='submit'
                    loading={loading}
                    disabled={loading}
                    loadingText='loading...'
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  )
}
