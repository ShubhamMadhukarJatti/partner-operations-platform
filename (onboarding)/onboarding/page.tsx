'use client'

import { useEffect, useReducer, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { UTM_PARTNER_ORG_ID_KEY } from '@/lib/constants'
import { useDecrypt } from '@/lib/hooks/useDecrypt'
import { showCustomToast } from '@/components/custom-toast'
import { DummyQuickStart } from '@/app/onboarding-v2.1/components/DummyQuickStart'
import CustomTextField from '@/app/onboarding-v2.1/components/InputField/TextField'
import { SectionHeader } from '@/app/onboarding-v2.1/components/SectionHeader/SectionHeader'
import { Step1 } from '@/app/onboarding-v2.1/steps/Step1/Step1'
import { Step2 } from '@/app/onboarding-v2.1/steps/Step2/Step2'
import { AboutYou } from '@/app/onboarding-v2.1/steps/Step3/AboutYou'
import { PrimaryUseCase } from '@/app/onboarding-v2.1/steps/Step3/PrimaryUseCase'
import { Step3 } from '@/app/onboarding-v2.1/steps/Step3/Step3'
import { Step4 } from '@/app/onboarding-v2.1/steps/Step4/Step4'
import { Step4_2 } from '@/app/onboarding-v2.1/steps/Step4/Step4_2'
import { Step4_3 } from '@/app/onboarding-v2.1/steps/Step4/Step4_3'
import { Step4_4 } from '@/app/onboarding-v2.1/steps/Step4/Step4_4'
import { Step4_5 } from '@/app/onboarding-v2.1/steps/Step4/Step4_5'
import { Step4_6 } from '@/app/onboarding-v2.1/steps/Step4/Step4_6'
import {
  initialState,
  onboardingReducer
} from '@/app/onboarding-v2.1/Util/onboardingReducer'
import { OnboardingWrapper } from '@/app/onboarding-v2.1/wrapper'

import { Button } from '../../../components/ui/button'

const EMAIL_DISALLOWED = /(gmail\.com|outlook\.com)$/i

// const ONBOARDING_PAYLOAD_KEY = 'ONBOARDING_PAYLOAD'

// function buildOnboardingPayload(state: typeof initialState) {
//   const goalsWithSharkdom =
//     typeof state.goalToUseSharkdom === 'string' &&
//     state.goalToUseSharkdom.includes(',')
//       ? state.goalToUseSharkdom
//           .split(',')
//           .map((g: string) => g.trim())
//           .filter(Boolean)
//       : state.goalToUseSharkdom
//         ? [state.goalToUseSharkdom]
//         : []

//   const preferredRegion = Array.isArray(state.reagon)
//     ? state.reagon
//     : state.reagon
//       ? [state.reagon]
//       : []

//   const preferredPartnerships =
//     typeof state.partnershipType === 'string' &&
//     state.partnershipType.includes(',')
//       ? state.partnershipType
//           .split(',')
//           .map((p: string) => p.trim())
//           .filter(Boolean)
//       : state.partnershipType
//         ? [state.partnershipType]
//         : []

//   return {
//     fullName: state.name?.trim() || '',
//     companyURL: state.websiteUrl?.trim() || '',
//     teamParticipation: state.partnershipTeamStrength ? 'YES' : 'NO',
//     marketSegment: state.marketSegment || '',
//     gtmTeamSize: state.partnershipTeamStrength || '',
//     currentPartners: state.currentPartnersCount || '',
//     goalsWithSharkdom,
//     preferredRegion,
//     preferredPartnerships
//   }
// }

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [state, dispatch] = useReducer(onboardingReducer, initialState)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [isHydrated, setIsHydrated] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  console.log(searchParams)
  const { decryptData } = useDecrypt()

  // Load saved state on mount
  useEffect(() => {
    try {
      const savedStep = localStorage.getItem('onboarding_step')
      const savedState = localStorage.getItem('onboarding_state')
      const savedEmail = localStorage.getItem('onboarding_email')

      if (savedStep) setStep(Number(savedStep))
      if (savedState)
        dispatch({ type: 'LOAD_USER_DATA', payload: JSON.parse(savedState) })
      if (savedEmail) setEmail(savedEmail)
    } catch (_) {
      // ignore JSON parse errors
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Persist state to local storage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('onboarding_step', step.toString())
      localStorage.setItem('onboarding_state', JSON.stringify(state))
      localStorage.setItem('onboarding_email', email)
    }
  }, [step, state, email, isHydrated])

  // Decode utm_register and save partner orgId to localStorage (for collaboration after onboarding)
  useEffect(() => {
    const utmRegister = searchParams.get('utm_register')
    if (!utmRegister) return
    try {
      const decrypted = decryptData(utmRegister.replace(/ /g, '+'))
      if (!decrypted) return
      const parts = decrypted.split(':')
      const orgId = parts[1]
      if (orgId && /^\d+$/.test(orgId)) {
        typeof window !== 'undefined' &&
          localStorage.setItem(UTM_PARTNER_ORG_ID_KEY, orgId)
      }
    } catch {
      // Ignore decrypt errors
    }
  }, [searchParams, decryptData])

  const isEmailValid = (e: string) => {
    const trimmed = e?.trim() ?? ''
    if (!trimmed) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) return false
    if (EMAIL_DISALLOWED.test(trimmed)) return false
    return true
  }

  const isStepFilled = (s: number, st: typeof state) => {
    switch (s) {
      case 1:
        return (
          !!st.firstName?.trim() && !!st.lastName?.trim() && isEmailValid(email)
        )
      case 2:
        return !!st.otp?.trim() && st.otp.length === 6
      case 3:
        return !!st.registrationMode?.trim()
      case 4:
        return (
          !!st.name?.trim() &&
          !!st.websiteUrl?.trim() &&
          !!st.currentRole?.trim() &&
          !!st.partnershipTeamStrength?.trim()
        )
      case 5:
        return (
          Array.isArray(st.goalToUseSharkdom) && st.goalToUseSharkdom.length > 0
        )
      default:
        return true
    }
  }

  const nextStep = async () => {
    if (isLoading) return

    if (!isStepFilled(step, state)) {
      switch (step) {
        case 1:
          showCustomToast(
            'Error',
            'Please enter your name and a valid email',
            'error',
            5000
          )
          break
        case 2:
          showCustomToast(
            'Error',
            'Please enter the 6-digit verification code',
            'error',
            5000
          )
          break
        case 3:
          showCustomToast('Error', 'Please select your role', 'error', 5000)
          break
        case 4:
          showCustomToast(
            'Error',
            'Please fill in all company details',
            'error',
            5000
          )
          break
        case 5:
          showCustomToast(
            'Error',
            'Please select your primary use case',
            'error',
            5000
          )
          break
        default:
          showCustomToast(
            'Error',
            'Please fill in the required information',
            'error',
            5000
          )
      }
      return
    }

    // Step 1: Send OTP
    if (step === 1) {
      const trimmedEmail = email?.trim() ?? ''
      if (EMAIL_DISALLOWED.test(trimmedEmail)) {
        showCustomToast(
          'Error',
          'Emails from gmail.com and outlook.com are not allowed',
          'error',
          5000
        )
        return
      }
      setIsLoading(true)
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail })
        })
        const data = await res.json()
        if (!res.ok) {
          showCustomToast(
            'Error',
            data.error || 'Failed to send verification code',
            'error',
            5000
          )
          return
        }
        setStep(2)
      } catch (_) {
        showCustomToast(
          'Error',
          'Failed to send verification code',
          'error',
          5000
        )
      } finally {
        setIsLoading(false)
      }
      return
    }

    // Step 2: Verify OTP
    if (step === 2) {
      setIsLoading(true)
      try {
        const res = await fetch('/api/login-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email?.trim() ?? '', otp: state.otp })
        })
        const data = await res.json()
        if (!res.ok) {
          showCustomToast(
            'Error',
            data.error || 'Invalid verification code',
            'error',
            5000
          )
          return
        }
        // OTP verified successfully! We skip the inner APIs for now per user request.
        setStep(3)
      } catch (_) {
        showCustomToast('Error', 'Failed to verify code', 'error', 5000)
      } finally {
        setIsLoading(false)
      }
      return
    }

    // Step 11: Check website availability + advance to step 12
    if (step === 11) {
      const url = state.websiteUrl?.trim() ?? ''
      const pattern =
        /^(https?:\/\/)([\.\w\-]+\.)+[\w\-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i
      if (!pattern.test(url)) {
        showCustomToast('Error', 'Invalid URL', 'error', 5000)
        return
      }
      setIsLoading(true)
      try {
        const res = await fetch(
          `/api/onboarding/website/check?website=${encodeURIComponent(url)}`
        )
        const json = await res.json()
        if (json.data === true) {
          setStep(12)
        } else {
          showCustomToast(
            'Error',
            json.message || 'Website is already registered',
            'error',
            5000
          )
        }
      } catch (_) {
        showCustomToast('Error', 'Failed to check website', 'error', 5000)
      } finally {
        setIsLoading(false)
      }
      return
    }

    // If step 5 is reached, go to the progressive onboarding dashboard mock (Step 6)
    if (step === 5) {
      setStep(6)
      return
    }

    if (step === 11) {
      // Reached the end of the fake dashboard onboarding sequence.
      // Do nothing for now per user request ('we are not opening the dashboard for noe').
      return
    }

    setStep((prev) => prev + 1)
  }

  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev))

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            firstName={state.firstName || ''}
            lastName={state.lastName || ''}
            email={email}
            onNext={nextStep}
            onChange={(field, value) => {
              if (field === 'firstName')
                dispatch({
                  type: 'UPDATE_WELCOME_FIELD',
                  payload: { field: 'firstName', value }
                })
              if (field === 'lastName')
                dispatch({
                  type: 'UPDATE_WELCOME_FIELD',
                  payload: { field: 'lastName', value }
                })
              if (field === 'email') setEmail(value)
            }}
            onOAuthSuccess={(userEmail, firstName, lastName) => {
              setEmail(userEmail)
              dispatch({
                type: 'UPDATE_WELCOME_FIELD',
                payload: { field: 'firstName', value: firstName }
              })
              dispatch({
                type: 'UPDATE_WELCOME_FIELD',
                payload: { field: 'lastName', value: lastName }
              })
              setStep(3)
            }}
          />
        )
      case 2:
        return (
          <Step2
            email={email}
            otpString={state.otp}
            onChange={(field, value) =>
              dispatch({ type: 'UPDATE_OTP', payload: value })
            }
            onNext={nextStep}
            onBack={prevStep}
            onResendOTP={() => {
              // Trigger send OTP again
              fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email?.trim() ?? '' })
              }).catch(() => {})
            }}
            isValid={state.otp?.length === 6}
            isLoading={isLoading}
          />
        )
      case 3:
        return (
          <Step3
            value={state.registrationMode}
            onChange={(value: string) =>
              dispatch({ type: 'UPDATE_REGISTRATION_MODE', payload: value })
            }
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 4:
        return (
          <AboutYou
            companyName={state.name || ''}
            websiteUrl={state.websiteUrl || ''}
            currentRole={state.currentRole || ''}
            partnershipTeamStrength={state.partnershipTeamStrength || ''}
            onChange={(field, value) => {
              if (field === 'companyName')
                dispatch({ type: 'UPDATE_NAME', payload: { name: value } })
              if (field === 'websiteUrl')
                dispatch({ type: 'UPDATE_URL', payload: { websiteUrl: value } })
              if (field === 'currentRole')
                dispatch({ type: 'UPDATE_ROLE', payload: value })
              if (field === 'partnershipTeamStrength')
                dispatch({
                  type: 'UPDATE_PARTNERSHIP_TEAM_STRENGTH',
                  payload: value
                })
            }}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 5:
        return (
          <PrimaryUseCase
            goal={state.goalToUseSharkdom || []}
            onChange={(value: string[]) =>
              dispatch({ type: 'UPDATE_GOAL_TO_USER_SHARKDOM', payload: value })
            }
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        return (
          <div className='relative z-10 my-auto w-full max-w-[1000px] overflow-hidden rounded-2xl shadow-2xl'>
            <div className='relative w-full'>
              {step === 6 && (
                <Step4
                  firstName={state.firstName || 'John'}
                  lastName={state.lastName || 'Doe'}
                  companyName={state.name || 'Acme corp'}
                  websiteUrl={state.websiteUrl || 'https://www.acmecorp.io'}
                  email={email || 'johndoe@acmecorp.io'}
                  currentRole={state.currentRole || 'Partnership team'}
                  teamSize={state.partnershipTeamStrength || '1-4 people'}
                  marketSegment={state.marketSegment}
                  onChange={(segment) =>
                    dispatch({
                      type: 'UPDATE_MARKET_SEGMENT',
                      payload: segment
                    })
                  }
                  onNext={nextStep}
                />
              )}
              {step === 7 && (
                <Step4_2
                  firstName={state.firstName || 'John'}
                  lastName={state.lastName || 'Doe'}
                  companyName={state.name || 'Acme corp'}
                  websiteUrl={state.websiteUrl || 'https://www.acmecorp.io'}
                  email={email || 'johndoe@acmecorp.io'}
                  currentRole={state.currentRole || 'Partnership team'}
                  teamSize={state.partnershipTeamStrength || '1-4 people'}
                  regions={state.reagon || []}
                  onChange={(value: string[]) =>
                    dispatch({ type: 'UPDATE_REAGON', payload: value })
                  }
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {step === 8 && (
                <Step4_3
                  firstName={state.firstName || 'John'}
                  lastName={state.lastName || 'Doe'}
                  companyName={state.name || 'Acme corp'}
                  websiteUrl={state.websiteUrl || 'https://www.acmecorp.io'}
                  email={email || 'johndoe@acmecorp.io'}
                  currentRole={state.currentRole || 'Partnership team'}
                  teamSize={state.partnershipTeamStrength || '1-4 people'}
                  partnershipTypes={state.partnershipType || []}
                  onChange={(types: string[]) =>
                    dispatch({
                      type: 'UPDATE_PARTNERSHIP_TYPE',
                      payload: types
                    })
                  }
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {step === 9 && (
                <Step4_4
                  firstName={state.firstName || 'John'}
                  lastName={state.lastName || 'Doe'}
                  companyName={state.name || 'Acme corp'}
                  websiteUrl={state.websiteUrl || 'https://www.acmecorp.io'}
                  email={email || 'johndoe@acmecorp.io'}
                  currentRole={state.currentRole || 'Partnership team'}
                  teamSize={state.partnershipTeamStrength || '1-4 people'}
                  primaryCrm={state.primaryCrm || ''}
                  stackTools={state.toolsInStack || []}
                  currentPartnersCount={state.currentPartnersCount || '5'}
                  onPrimaryCrmChange={(crm: string) =>
                    dispatch({ type: 'UPDATE_PRIMARY_CRM', payload: crm })
                  }
                  onStackToolsChange={(tools: string[]) =>
                    dispatch({ type: 'UPDATE_TOOLS_IN_STACK', payload: tools })
                  }
                  onCurrentPartnersCountChange={(count: string) =>
                    dispatch({
                      type: 'UPDATE_CURRENT_PARTNERS_COUNT',
                      payload: count
                    })
                  }
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {step === 10 && (
                <Step4_5
                  firstName={state.firstName || 'John'}
                  lastName={state.lastName || 'Doe'}
                  companyName={state.name || 'Acme corp'}
                  websiteUrl={state.websiteUrl || 'https://www.acmecorp.io'}
                  email={email || 'johndoe@acmecorp.io'}
                  currentRole={state.currentRole || 'Partnership team'}
                  teamSize={state.partnershipTeamStrength || '1-4 people'}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
            </div>
          </div>
        )
      case 11: {
        const submitOnboardingData = async () => {
          let mappedGtmTeamSize = 'ZERO'
          if (state.partnershipTeamStrength === 'Small team (1-4)')
            mappedGtmTeamSize = 'LESS_THAN_5'
          else if (state.partnershipTeamStrength === 'Medium Team (5-20)')
            mappedGtmTeamSize = 'BETWEEN_5_AND_20'
          else if (state.partnershipTeamStrength === 'Large team (20+)')
            mappedGtmTeamSize = 'MORE_THAN_20'

          const preferredPartnershipsArray = Array.isArray(
            state.partnershipType
          )
            ? state.partnershipType
            : typeof state.partnershipType === 'string' && state.partnershipType
              ? state.partnershipType.split(',').map((p: string) => p.trim())
              : []

          const goalsArray = Array.isArray(state.goalToUseSharkdom)
            ? state.goalToUseSharkdom
            : typeof state.goalToUseSharkdom === 'string' &&
                state.goalToUseSharkdom
              ? state.goalToUseSharkdom.split(',').map((p: string) => p.trim())
              : []

          const rawRegions = Array.isArray(state.reagon)
            ? state.reagon
            : typeof state.reagon === 'string' && state.reagon
              ? state.reagon.split(',').map((p: string) => p.trim())
              : []

          const regionsArray = rawRegions.map((r: string) => {
            const upper = r.toUpperCase().replace(/\s+/g, '_')
            return upper
          })

          const payload = {
            fullName: `${state.firstName} ${state.lastName}`.trim(),
            companyURL: state.websiteUrl || '',
            teamParticipation: state.doYouHavePartnershipTeam ? 'Yes' : 'No',
            marketSegment: state.marketSegment || '',
            gtmTeamSize: mappedGtmTeamSize,
            currentPartners: state.currentPartnersCount || '5',
            goalsWithSharkdom: goalsArray,
            preferredRegion: regionsArray,
            preferredPartnerships: preferredPartnershipsArray,
            email: email || ''
          }

          try {
            await fetch('/api/onboarding/start-complete', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            })

            // Save basic info for the UI to use immediately
            localStorage.setItem('user_name', payload.fullName)
            localStorage.setItem('user_email', payload.email)

            // Clear onboarding localStorage so the user doesn't see onboarding again
            localStorage.removeItem('onboarding_step')
            localStorage.removeItem('onboarding_state')
            localStorage.removeItem('onboarding_email')
          } catch (error) {
            console.error('Failed to submit onboarding data:', error)
          }
        }

        return (
          <div
            key='step-11-wrapper'
            className='relative z-10 my-auto flex w-full justify-center'
          >
            <Step4_6
              firstName={state.firstName || 'John'}
              onExplore={async () => {
                await submitOnboardingData()
                window.location.href = '/dweep-ai'
              }}
              onBookDemo={async () => {
                await submitOnboardingData()
                console.log('Book demo clicked')
              }}
              onGoToDashboard={async () => {
                await submitOnboardingData()
                window.location.href = '/offline-partners'
                //  router.push('/dashboard')
              }}
              onPartnerMapping={async () => {
                await submitOnboardingData()
                window.location.href = '/home/partner-program'
              }}
            />
          </div>
        )
      }
      default:
        return null
    }
  }

  const imageStep = step === 11 ? 11 : step + 2

  if (!isHydrated) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-[#3E50F7]'></div>
      </div>
    )
  }

  if (step > 5) {
    return (
      <div className='relative min-h-screen w-full bg-gray-50'>
        {/* Dummy Dashboard Background */}
        <DummyQuickStart />

        {/* Modal Overlay */}
        <div className='fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#6863FB]/15 p-4 backdrop-blur-sm'>
          {renderStep()}
        </div>
      </div>
    )
  }

  return (
    <OnboardingWrapper
      image={`/images/onboarding/onboarding_step${imageStep}.png`}
      alt='onboarding images'
      stepCount={step}
      state={state}
    >
      <div className='relative z-10 flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center'>
        {renderStep()}
      </div>
    </OnboardingWrapper>
  )
}
