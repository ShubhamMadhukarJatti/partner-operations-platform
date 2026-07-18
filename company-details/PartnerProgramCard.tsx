'use client'

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useTransition
} from 'react'
import Link from 'next/link'
import { currentOrgActions } from '@/redux/slices/organization'
import { AppDispatch, RootState } from '@/redux/store'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, RefreshCcw } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { showCustomToast } from '@/components/custom-toast'
import { BetaLoadingState } from '@/app/(app)/_beta-profile/components'

import {
  buildPartnerProgramDraft,
  DEFAULT_PROGRAM_BENEFITS,
  PartnerProgramDraft
} from './company-details-helpers'
import {
  FieldLabel,
  SectionCard,
  SectionHeader,
  TextInputField
} from './company-details-ui'

export interface PartnerProgramCardRef {
  handleSave: () => Promise<void>
}

export const PartnerProgramCard = forwardRef<
  PartnerProgramCardRef,
  { className?: string; setSaving?: (saving: boolean) => void }
>(({ className, setSaving }, ref) => {
  const dispatch = useDispatch<AppDispatch>()
  const currentOrgState = useSelector((state: RootState) => state.currentOrg)
  const currentOrg = currentOrgState.organization?.id
    ? currentOrgState.organization
    : null

  const [programPending, startProgramTransition] = useTransition()
  const [partnerProgram, setPartnerProgram] = useState<PartnerProgramDraft>({
    referralProgram: false,
    programName: '',
    programUrl: '',
    benefits: DEFAULT_PROGRAM_BENEFITS
  })

  useEffect(() => {
    if (setSaving) {
      setSaving(programPending)
    }
  }, [programPending, setSaving])

  const partnerProgramQuery = useQuery({
    queryKey: ['profile-beta-partner-program', currentOrg?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/organization/partner-program/by-org/${currentOrg?.id}`
      )
      if (response.status === 404) {
        return null
      }
      if (!response.ok) {
        throw new Error('Failed to fetch partner program')
      }
      return response.json()
    },
    enabled: Boolean(currentOrg?.id),
    retry: false
  })

  useEffect(() => {
    if (!currentOrg) return

    if (partnerProgramQuery.data) {
      setPartnerProgram(
        buildPartnerProgramDraft(
          partnerProgramQuery.data?.data,
          currentOrg.name
        )
      )
      return
    }

    setPartnerProgram({
      referralProgram: Boolean(currentOrg.referralProgram),
      programName: `${currentOrg.name || 'Your company'} Partner Program`,
      programUrl: '',
      benefits: DEFAULT_PROGRAM_BENEFITS
    })
  }, [currentOrg, partnerProgramQuery.data])

  useImperativeHandle(ref, () => ({
    handleSave: async () => {
      if (!currentOrg) return

      startProgramTransition(async () => {
        try {
          const programName = partnerProgram.programName.trim()
          const programUrl = partnerProgram.programUrl.trim()
          const benefits = partnerProgram.benefits
            .map((item) => item.trim())
            .filter(Boolean)

          if (!programName) {
            throw new Error('Program name is required.')
          }

          const upsertResponse = await fetch(
            '/api/organization/partner-program',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                programName,
                isActive: partnerProgram.referralProgram,
                programUrl,
                benefits
              })
            }
          )

          if (!upsertResponse.ok) {
            const error = await upsertResponse.json().catch(() => null)
            throw new Error(
              error?.details?.message ||
                error?.message ||
                'Failed to save partner program.'
            )
          }

          const previousActive = Boolean(
            partnerProgramQuery.data?.data?.isActive ??
              currentOrg.referralProgram
          )

          if (previousActive !== partnerProgram.referralProgram) {
            const toggleResponse = await fetch(
              `/api/organization/partner-program/status?isActive=${partnerProgram.referralProgram}`,
              { method: 'PATCH' }
            )

            if (!toggleResponse.ok) {
              const error = await toggleResponse.json().catch(() => null)
              throw new Error(
                error?.details?.message ||
                  error?.message ||
                  'Failed to update partner program status.'
              )
            }
          }

          dispatch(
            currentOrgActions.setCurrentOrgFromAuth({
              ...(currentOrgState.organization ?? {}),
              ...currentOrg,
              referralProgram: partnerProgram.referralProgram
            } as any)
          )

          await partnerProgramQuery.refetch()
          showCustomToast(
            'Success',
            'Partner-program settings updated.',
            'success'
          )
        } catch (error: any) {
          showCustomToast(
            'Error',
            error?.message || 'Failed to update partner-program settings.',
            'error'
          )
        }
      })
    }
  }))

  return (
    <div className={cn('w-full space-y-6', className)}>
      {partnerProgramQuery.isLoading ? (
        <SectionCard>
          <BetaLoadingState />
        </SectionCard>
      ) : (
        <SectionCard className='w-full border-0 bg-transparent p-0 shadow-none'>
          <div className='w-full space-y-8 rounded-[20px] border border-[#F3F4F6] bg-white/50 p-6 shadow-sm'>
            <div className='space-y-1'>
              <h2 className='text-[20px] font-bold tracking-tight text-[#101828]'>
                Partner Program
              </h2>
              <p className='text-[14px] text-[#6B7280]'>
                Configure your partner program details
              </p>
            </div>

            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div className='space-y-1'>
                <h3 className='text-[14px] font-semibold text-[#374151]'>
                  Program status
                </h3>
                <p className='text-[12px] text-[#6B7280]'>
                  Sharkdom team will verify within 2-3 business days
                </p>
              </div>

              <Switch
                checked={partnerProgram.referralProgram}
                onCheckedChange={(value) =>
                  setPartnerProgram((current) => ({
                    ...current,
                    referralProgram: value
                  }))
                }
                className='data-[state=checked]:bg-[#6863FB] data-[state=unchecked]:bg-[#D1D5DC]'
              />
            </div>

            <div className='space-y-6'>
              <div className='space-y-3'>
                <label className='text-[14px] font-semibold text-[#374151]'>
                  Program name <span className='text-[#F04438]'>*</span>
                </label>
                <Input
                  value={partnerProgram.programName}
                  placeholder='Acme corp'
                  onChange={(event) =>
                    setPartnerProgram((current) => ({
                      ...current,
                      programName: event.target.value
                    }))
                  }
                  className='h-11 rounded-[8px] border-[#D1D5DC] bg-white px-4 text-[14px] text-[#101828]'
                />
              </div>

              <div className='space-y-3'>
                <label className='text-[14px] font-semibold text-[#374151]'>
                  Key benefits <span className='text-[#F04438]'>*</span>
                </label>
                <div className='space-y-3'>
                  {partnerProgram.benefits.map((benefit, index) => (
                    <Input
                      key={index}
                      value={benefit}
                      placeholder={`Benefit ${index + 1}`}
                      onChange={(event) =>
                        setPartnerProgram((current) => ({
                          ...current,
                          benefits: current.benefits.map((item, itemIndex) =>
                            itemIndex === index ? event.target.value : item
                          ) as [string, string, string]
                        }))
                      }
                      className='h-11 rounded-[8px] border-[#D1D5DC] bg-white px-4 text-[14px] text-[#101828]'
                    />
                  ))}
                </div>
              </div>

              <div className='space-y-3'>
                <label className='text-[14px] font-semibold text-[#374151]'>
                  Program URL{' '}
                  <span className='font-normal text-[#6B7280]'>(optional)</span>
                </label>
                <div className='flex h-11 items-stretch'>
                  <div className='flex items-center rounded-l-[8px] border border-r-0 border-[#D1D5DC] bg-[#F9FAFB] px-4 text-[14px] text-[#6B7280]'>
                    https://
                  </div>
                  <Input
                    value={partnerProgram.programUrl.replace(
                      /^https?:\/\//,
                      ''
                    )}
                    onChange={(e) =>
                      setPartnerProgram((current) => ({
                        ...current,
                        programUrl: `https://${e.target.value}`
                      }))
                    }
                    placeholder='www.youtube.com/demo'
                    className='h-full rounded-l-none rounded-r-[8px] border-[#D1D5DC] bg-white text-[14px] focus:border-[#D1D5DC] focus-visible:ring-0 focus-visible:ring-offset-0'
                  />
                </div>
              </div>
            </div>

            <div className='mt-8 flex flex-col items-start justify-between gap-4 rounded-[12px] border border-[#E9D4FF] bg-[#FAF5FF] p-5 sm:flex-row sm:items-center'>
              <div className='flex items-start gap-3'>
                <RefreshCcw className='mt-1 h-5 w-5 shrink-0 text-[#6863FB]' />
                <div className='space-y-1'>
                  <h3 className='text-[16px] font-bold text-[#101828]'>
                    Don&apos;t have a partner program yet?
                  </h3>
                  <p className='max-w-[500px] text-[13px] text-[#4A5565]'>
                    Create a comprehensive partner program on Sharkdom with
                    tiers, commission structures, and automated onboarding.
                  </p>
                </div>
              </div>

              <Button
                asChild
                className='h-11 w-full shrink-0 rounded-[8px] bg-[#6863FB] px-6 text-[14px] font-semibold text-white hover:bg-[#5b56e5] sm:w-auto'
              >
                <Link href='/partner-programs'>Create partner program</Link>
              </Button>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  )
})
PartnerProgramCard.displayName = 'PartnerProgramCard'
