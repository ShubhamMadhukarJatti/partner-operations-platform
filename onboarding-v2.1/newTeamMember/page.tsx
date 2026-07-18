'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  updateOnboardingStep,
  updateUserSubtype
} from '@/lib/actions/onboarding-v2.1'
import { useDecrypt } from '@/lib/hooks/useDecrypt'
import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'

import { OnboardingWrapper } from '../wrapper'

// Function to map user to organization
async function mapUserToOrganization(userId: string, organizationId: string) {
  try {
    const response = await fetch('/api/map-user-to-org', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        organizationId
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to map user to organization')
    }

    return await response.json()
  } catch (error: any) {
    console.error('Error mapping user to organization:', error)
    throw new Error(error.message || 'Failed to map user to organization')
  }
}

async function mapRoleToUser(orgUserMappingId: string, role: string[]) {
  try {
    const response = await fetch('/api/map-role-to-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orgUserMappingId,
        role
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to map role to user')
    }

    return await response.json()
  } catch (error: any) {
    console.error('Error mapping role to user:', error)
    throw new Error(error.message || 'Failed to map role to user')
  }
}

export default function NewTeamMember() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { decryptData } = useDecrypt()
  const [step] = useState(2)
  const [formData, setFormData] = useState({
    name: '',
    role: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [inviteData, setInviteData] = useState<any>(null)
  const utm_register = searchParams?.get('utm_register')

  useEffect(() => {
    if (utm_register) {
      try {
        const decryptedData = decryptData(utm_register?.replace(/ /g, '+'))
        const splitData = decryptedData?.split(':')
        const [userId, orgId, role, email] = splitData
        setInviteData({ userId, orgId, role, email })
        console.log('Invite data:', { userId, orgId, role, email })
      } catch (error) {
        console.error('Error decrypting invite data:', error)
        showCustomToast('Error', 'Invalid invite link', 'error', 5000)
      }
    }
  }, [decryptData, utm_register])

  const isStepValid = (_currentStep: number, _data: any) => {
    return true
  }

  const nextStep = async () => {
    if (isLoading) return

    // Update user subtype (role in partnership function) and map to organization
    if (step === 2) {
      if (!isStepValid(step, formData)) {
        showCustomToast('Error', 'Please select your role', 'error', 5000)
        return
      }

      setIsLoading(true)
      try {
        // Update user subtype first
        await updateUserSubtype(formData.role)

        // Get organization ID from invite data
        const organizationId = inviteData?.orgId

        if (organizationId) {
          // Map user to organization as ADMIN (hardcoded)
          const mapUserToOrganizationResponse = await mapUserToOrganization(
            inviteData?.userId || '', // Use invited userId if available
            organizationId
          )
          console.log(
            'mapUserToOrganizationResponse',
            mapUserToOrganizationResponse
          )
          // Parse and normalize the role array
          let rolesArray: string[] = []

          if (inviteData?.role) {
            const roleValue = inviteData.role

            // Try to parse as JSON first (in case it's a stringified array)
            if (
              typeof roleValue === 'string' &&
              roleValue.trim().startsWith('[')
            ) {
              try {
                const parsed = JSON.parse(roleValue)
                if (Array.isArray(parsed)) {
                  rolesArray = parsed.filter(
                    (r) => typeof r === 'string' && r.trim().length > 0
                  )
                }
              } catch {
                // If JSON parsing fails, treat as comma-separated string
                rolesArray = roleValue
                  .split(',')
                  .map((r: string) => r.trim().replace(/^\[|"|'|]$/g, ''))
                  .filter((r: string) => r.length > 0)
              }
            } else if (typeof roleValue === 'string') {
              // If it's a plain string, split by comma and clean up
              rolesArray = roleValue
                .split(',')
                .map((r: string) => r.trim().replace(/^\[|"|'|]$/g, ''))
                .filter((r: string) => r.length > 0)
            } else if (Array.isArray(roleValue)) {
              // If it's already an array, use it directly
              rolesArray = roleValue.filter(
                (r) => typeof r === 'string' && r.trim().length > 0
              )
            }
          }

          // Ensure we have at least one role
          if (rolesArray.length === 0) {
            console.warn('No valid roles found in invite data')
          } else {
            console.log('Parsed roles array:', rolesArray)
          }

          await mapRoleToUser(
            mapUserToOrganizationResponse?.id || '',
            rolesArray
          )
        } else {
          console.warn('No organization ID found in invite data')
        }

        const displayName =
          formData.name?.trim() || inviteData?.email?.split('@')[0] || 'there'
        showCustomToast('Success', `Welcome ${displayName}`, 'success', 5000)
        await updateOnboardingStep(1)
        await updateOnboardingStep(2)
        await updateOnboardingStep(3)
        await updateOnboardingStep(4)
        await updateOnboardingStep(5)
        await updateOnboardingStep(6)
        await updateOnboardingStep(7)
        await updateOnboardingStep(8)
        await updateOnboardingStep(9)
        await updateOnboardingStep(10)
        await updateOnboardingStep(11)
        // Replace onboarding URL in history so back button doesn't show it
        router.replace('/explore')
      } catch (error: any) {
        showCustomToast(
          'Error',
          error.message || 'Failed to complete setup',
          'error',
          5000
        )
      } finally {
        setIsLoading(false)
      }
      return
    }
  }

  const renderStep = () => (
    <div className='mx-auto w-full max-w-md'>
      <label className='mb-2 block text-left text-sm font-medium text-gray-700'>
        What is your role in the partnership function?
      </label>
      <select
        value={formData.role}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, role: e.target.value }))
        }
        className='block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-[#3E50F7] focus:outline-none focus:ring-[#3E50F7] sm:text-sm'
      >
        <option value='' disabled>
          Select a role
        </option>
        <option value='Partnership Manager'>Partnership Manager</option>
        <option value='VP of Partnerships'>VP of Partnerships</option>
        <option value='Sales / Go-to-Market'>Sales / Go-to-Market</option>
        <option value='Marketing'>Marketing</option>
        <option value='Other'>Other</option>
      </select>
    </div>
  )

  return (
    <OnboardingWrapper
      image='/images/onboarding/onboarding_step4.png'
      alt='onboarding images'
      stepCount={1}
    >
      <div className='relative flex h-full flex-col items-center justify-center text-center'>
        {inviteData && (
          <div className='mb-6 w-full rounded-xl border border-[#3E50F733] bg-[linear-gradient(135deg,#3E50F70D_0%,#3E50F700_100%)] p-4'>
            <p className='mb-3 text-sm font-semibold text-[#0A0A0A]'>
              Welcome to the Team! 🎉
            </p>
            <div className='space-y-2'>
              <div className='flex items-center justify-center gap-2'>
                <span className='text-xs font-medium text-[#717182]'>
                  Email:
                </span>
                <span className='text-sm font-semibold text-[#0A0A0A]'>
                  {inviteData.email}
                </span>
              </div>
              <div className='flex items-center justify-center gap-2'>
                <span className='text-xs font-medium text-[#717182]'>
                  Role:
                </span>
                <span className='rounded-full bg-[#3E50F71A] px-3 py-1 text-xs font-semibold text-[#3E50F7]'>
                  {inviteData.role}
                </span>
              </div>
            </div>
          </div>
        )}
        {renderStep()}
        <div className='absolute bottom-0 mb-[15px] flex w-full justify-end'>
          {/* <Button
            onClick={prevStep}
            variant={'ghost'}
            disabled={step === 1}
            className='disabled:cursor-not-allowed'
          >
            Back
          </Button> */}
          <Button
            onClick={nextStep}
            variant={'default'}
            disabled={!isStepValid(step, formData) || isLoading}
            className='disabled:cursor-not-allowed'
          >
            {isLoading ? 'Updating...' : step === 2 ? 'Complete Setup' : 'Next'}
          </Button>
        </div>
      </div>
    </OnboardingWrapper>
  )
}
