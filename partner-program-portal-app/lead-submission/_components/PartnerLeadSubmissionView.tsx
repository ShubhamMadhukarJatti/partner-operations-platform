'use client'

import * as React from 'react'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  getPartnerSessionAction,
  submitPartnerLeadAction
} from '@/app/(partner-application)/set-password/_components/actions'
import { PartnerProgramPortalScaffold } from '@/app/partner-program-portal-app/_components/PartnerProgramPortalScaffold'
import { usePartnerSession } from '@/app/partner-program-portal-app/_components/PartnerSessionContext'

const INPUT_ROW_TALL =
  'h-[43px] rounded-lg border-[#E5E7EB] bg-[#F9FAFB] dark:bg-muted text-sm text-[#0A0A0A] placeholder:text-[rgba(10,10,10,0.5)] dark:placeholder:text-white focus-visible:ring-[#6863FB]'
const INPUT_ROW_SHORT =
  'h-[41px] rounded-lg border-[#E5E7EB] bg-[#F9FAFB] dark:bg-muted text-sm text-[#0A0A0A] placeholder:text-[rgba(10,10,10,0.5)] dark:placeholder:text-white focus-visible:ring-[#6863FB]'
const TEXTAREA_CLASS =
  'min-h-[96px] rounded-lg border-[#E5E7EB] bg-[#F9FAFB] dark:bg-muted text-sm text-[#0A0A0A] placeholder:text-[rgba(10,10,10,0.5)] dark:placeholder:text-white focus-visible:ring-[#6863FB]'

type Warmth = 'hot' | 'warm' | 'cold'

type InvolvementTier = 'champion' | 'referral'

type CompanyFields = {
  companyName: string
  companyWebsite: string
  industry: string
  companySize: string
  geography: string
  estimatedAcv: string
}

type ContactFields = {
  contactName: string
  contactTitle: string
  contactEmail: string
  contactLinkedin: string
  buyingIntent: string
  warmth: Warmth
}

type InvolvementFields = {
  tier: InvolvementTier
  meetingFormat: string
  messageToTeam: string
}

function parseAcv(raw: string): number {
  const cleaned = raw.replace(/[^\d.]/g, '')
  const n = parseFloat(cleaned)
  if (Number.isFinite(n) && n > 0) return n
  return 25_000
}

function formatUsd(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  })
}

function commissionRange(acv: number, tier: InvolvementTier): string {
  if (tier === 'champion') {
    return `${formatUsd(acv * 0.15)} - ${formatUsd(acv * 0.2)}`
  }
  return `${formatUsd(acv * 0.08)} - ${formatUsd(acv * 0.1)}`
}

function FormField({
  label,
  children,
  className
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className='text-sm font-medium leading-[21px] text-[#364153]'>
        {label}
      </span>
      {children}
    </div>
  )
}

function StepPillCompleted({ children }: { children: React.ReactNode }) {
  return (
    <div className='inline-flex h-8 items-center gap-1 rounded-full border border-[#CEDCFB] bg-white px-3 py-1.5 dark:bg-card'>
      <CheckCircle2
        className='size-5 shrink-0 text-[#16A34A]'
        aria-hidden
        strokeWidth={2}
      />
      <span className='whitespace-nowrap text-[13px] font-semibold leading-5 text-[#4D5C78] dark:text-white dark:focus:!text-white'>
        {children}
      </span>
    </div>
  )
}

function StepPillInactive({ children }: { children: React.ReactNode }) {
  return (
    <div className='inline-flex h-8 items-center rounded-full border border-[#CEDCFB] bg-white px-3 py-1.5 dark:bg-card'>
      <span className='whitespace-nowrap text-[13px] font-semibold leading-5 text-[#4D5C78] dark:text-white dark:focus:!text-white'>
        {children}
      </span>
    </div>
  )
}

function StepPillActive({
  children,
  wide
}: {
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <div
      className={cn(
        'inline-flex h-[31.5px] items-center justify-center rounded-full bg-[#6863FB] px-4',
        wide && 'min-w-[127px]'
      )}
    >
      <span className='whitespace-nowrap text-[13px] font-bold leading-5 text-white'>
        {children}
      </span>
    </div>
  )
}

interface LeadApiResponse {
  companyName?: string
  companyWebsite?: string
  industry?: string
  companySize?: string
  geography?: string
  estimatedAcv?: number
  contactName?: string
  contactTitle?: string
  contactEmail?: string
  contactLinkedIn?: string
  buyingIntentSignal?: string
  leadTemperature?: string
  involvementLevel?: string
  preferredMeetingFormat?: string
  messageToSharkdomTeam?: string
}

export function PartnerLeadSubmissionView() {
  const { user, token, profile } = usePartnerSession()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [company, setCompany] = useState<CompanyFields>({
    companyName: '',
    companyWebsite: '',
    industry: '',
    companySize: '',
    geography: '',
    estimatedAcv: ''
  })
  const [contact, setContact] = useState<ContactFields>({
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactLinkedin: '',
    buyingIntent: '',
    warmth: 'warm'
  })
  const [involvement, setInvolvement] = useState<InvolvementFields>({
    tier: 'champion',
    meetingFormat: '',
    messageToTeam: ''
  })

  // Fetch leads to pre-populate the form
  React.useEffect(() => {
    async function fetchLeads() {
      if (!token) return

      try {
        const res = await fetch('/api/partner-leads?page=0&size=1', {
          headers: {
            Accept: 'application/hal+json',
            Authorization: `Bearer ${token}`
          }
        })
        if (!res.ok) return

        const json = await res.json()
        if (json.success && json.data?.content?.length > 0) {
          const lead = json.data.content[0] as LeadApiResponse

          setCompany({
            companyName: lead.companyName || '',
            companyWebsite: lead.companyWebsite || '',
            industry: lead.industry || '',
            companySize: lead.companySize || '',
            geography: lead.geography || '',
            estimatedAcv: lead.estimatedAcv ? String(lead.estimatedAcv) : ''
          })

          setContact({
            contactName: lead.contactName || '',
            contactTitle: lead.contactTitle || '',
            contactEmail: lead.contactEmail || '',
            contactLinkedin: lead.contactLinkedIn || '',
            buyingIntent: lead.buyingIntentSignal || '',
            warmth:
              lead.leadTemperature === 'HOT'
                ? 'hot'
                : lead.leadTemperature === 'COLD'
                  ? 'cold'
                  : 'warm'
          })

          setInvolvement({
            tier:
              lead.involvementLevel === 'CHAMPION_PARTNER'
                ? 'champion'
                : 'referral',
            meetingFormat: lead.preferredMeetingFormat || '',
            messageToTeam: lead.messageToSharkdomTeam || ''
          })
        }
      } catch (err) {
        console.error('Failed to fetch leads for pre-population:', err)
      }
    }

    fetchLeads()
  }, [user?.uid, token])

  const parsedAcv = useMemo(
    () => parseAcv(company.estimatedAcv),
    [company.estimatedAcv]
  )

  function validateStep0() {
    if (!company.companyName.trim()) {
      toast.error('Company Name is required')
      return false
    }
    if (!company.companyWebsite.trim()) {
      toast.error('Company Website is required')
      return false
    }
    if (!company.industry.trim()) {
      toast.error('Industry is required')
      return false
    }
    if (!company.companySize.trim()) {
      toast.error('Company Size is required')
      return false
    }
    if (!company.geography.trim()) {
      toast.error('Geography is required')
      return false
    }
    if (!company.estimatedAcv.trim()) {
      toast.error('Estimated ACV is required')
      return false
    }
    if (isNaN(parsedAcv) || parsedAcv <= 0) {
      toast.error('Please enter a valid Estimated ACV (number greater than 0)')
      return false
    }
    return true
  }

  function validateStep1() {
    if (!contact.contactName.trim()) {
      toast.error('Contact Name is required')
      return false
    }
    if (!contact.contactTitle.trim()) {
      toast.error('Contact Title / Role is required')
      return false
    }
    if (!contact.contactEmail.trim()) {
      toast.error('Contact Email is required')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contact.contactEmail.trim())) {
      toast.error('Please enter a valid Contact Email')
      return false
    }
    if (!contact.contactLinkedin.trim()) {
      toast.error('Contact LinkedIn is required')
      return false
    }
    if (!contact.buyingIntent.trim()) {
      toast.error('Buying Intent Signal is required')
      return false
    }
    if (!contact.warmth) {
      toast.error('Lead Temperature is required')
      return false
    }
    return true
  }

  function renderStepper() {
    if (step === 0) {
      return (
        <div className='flex flex-wrap items-center gap-2'>
          <StepPillActive>1. Company Info</StepPillActive>
          <StepPillInactive>2. Contact Info</StepPillInactive>
          <StepPillInactive>3. Your Involvement</StepPillInactive>
        </div>
      )
    }
    if (step === 1) {
      return (
        <div className='flex flex-wrap items-center gap-2'>
          <StepPillCompleted>1. Company Info</StepPillCompleted>
          <StepPillActive wide>2. Contact Info</StepPillActive>
          <StepPillInactive>3. Your Involvement</StepPillInactive>
        </div>
      )
    }
    return (
      <div className='flex flex-wrap items-center gap-2'>
        <StepPillCompleted>1. Company Info</StepPillCompleted>
        <StepPillCompleted>2. Contact Info</StepPillCompleted>
        <StepPillActive wide>3. Your Involvement</StepPillActive>
      </div>
    )
  }

  async function handleSubmit() {
    setIsSubmitting(true)

    try {
      const session = await getPartnerSessionAction()
      const activeToken = session.token || token

      if (!activeToken) {
        toast.error('You must be logged in to submit a lead.')
        setIsSubmitting(false)
        return
      }

      const payload = {
        companyName: company.companyName,
        companyWebsite: company.companyWebsite,
        industry: company.industry,
        companySize: company.companySize,
        geography: company.geography,
        estimatedAcv: parsedAcv,
        contactName: contact.contactName,
        contactTitle: contact.contactTitle,
        contactEmail: contact.contactEmail,
        contactLinkedIn: contact.contactLinkedin,
        buyingIntentSignal: contact.buyingIntent,
        leadTemperature: contact.warmth.toUpperCase(),
        preferredMeetingFormat: involvement.meetingFormat,
        messageToSharkdomTeam: involvement.messageToTeam
      }

      const formattedToken = activeToken.startsWith('Bearer ')
        ? activeToken
        : `Bearer ${activeToken}`
      const res = await fetch('/api/partner-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/hal+json',
          Authorization: formattedToken
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error('Failed to submit lead')
      }

      const json = await res.json()
      if (!json.success) {
        throw new Error(json.message || 'Failed to submit lead')
      }

      toast.success('Lead submitted successfully!')

      // Reset form
      setStep(0)
      setCompany({
        companyName: '',
        companyWebsite: '',
        industry: '',
        companySize: '',
        geography: '',
        estimatedAcv: ''
      })
      setContact({
        contactName: '',
        contactTitle: '',
        contactEmail: '',
        contactLinkedin: '',
        buyingIntent: '',
        warmth: 'warm'
      })
      setInvolvement({
        tier: 'champion',
        meetingFormat: '',
        messageToTeam: ''
      })
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to submit lead. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const warmthOptions: {
    key: Warmth
    title: string
    hint: string
  }[] = [
    { key: 'hot', title: '🔥 Hot', hint: 'Actively evaluating' },
    { key: 'warm', title: '🌡️ Warm', hint: 'Interested, not urgent' },
    { key: 'cold', title: '❄️ Cold', hint: 'Early signal only' }
  ]

  return (
    <PartnerProgramPortalScaffold mainClassName='flex-1 overflow-y-auto px-4 pb-28 pt-6 sm:px-6 lg:px-8'>
      <div className='mx-auto w-full max-w-[768px]'>
        <h1 className='text-2xl font-bold leading-9 text-[#1A1A2E]'>
          Submit a Lead
        </h1>
        <div className='mt-4'>{renderStepper()}</div>

        <div
          className={cn(
            'mt-6 overflow-hidden rounded-[14px] border border-[#F3F4F6] bg-white px-8 pb-8 pt-8 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] dark:bg-card'
          )}
        >
          {step === 0 && (
            <>
              <div className='grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2'>
                <FormField label='Company Name *'>
                  <Input
                    value={company.companyName}
                    onChange={(e) =>
                      setCompany((c) => ({ ...c, companyName: e.target.value }))
                    }
                    className={INPUT_ROW_TALL}
                    autoComplete='organization'
                  />
                </FormField>
                <FormField label='Company Website *'>
                  <Input
                    value={company.companyWebsite}
                    onChange={(e) =>
                      setCompany((c) => ({
                        ...c,
                        companyWebsite: e.target.value
                      }))
                    }
                    className={INPUT_ROW_TALL}
                    placeholder='https://'
                    inputMode='url'
                  />
                </FormField>
                <FormField label='Industry *'>
                  <Input
                    value={company.industry}
                    onChange={(e) =>
                      setCompany((c) => ({ ...c, industry: e.target.value }))
                    }
                    className={INPUT_ROW_SHORT}
                  />
                </FormField>
                <FormField label='Company Size *'>
                  <Input
                    value={company.companySize}
                    onChange={(e) =>
                      setCompany((c) => ({ ...c, companySize: e.target.value }))
                    }
                    className={INPUT_ROW_SHORT}
                  />
                </FormField>
                <FormField label='Geography *'>
                  <Input
                    value={company.geography}
                    onChange={(e) =>
                      setCompany((c) => ({ ...c, geography: e.target.value }))
                    }
                    className={INPUT_ROW_SHORT}
                  />
                </FormField>
                <FormField label='Estimated ACV *'>
                  <Input
                    value={company.estimatedAcv}
                    onChange={(e) =>
                      setCompany((c) => ({
                        ...c,
                        estimatedAcv: e.target.value
                      }))
                    }
                    className={INPUT_ROW_SHORT}
                    placeholder='e.g. 25000'
                  />
                </FormField>
              </div>
              <div className='mt-8 flex justify-end border-t border-[#F3F4F6] pt-6'>
                <button
                  type='button'
                  onClick={() => {
                    if (validateStep0()) setStep(1)
                  }}
                  className='rounded-[10px] bg-[#6863FB] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6863FB]/90'
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className='grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2'>
                <FormField label='Contact Name *'>
                  <Input
                    value={contact.contactName}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, contactName: e.target.value }))
                    }
                    className={INPUT_ROW_TALL}
                    placeholder='Full name'
                  />
                </FormField>
                <FormField label='Contact Title / Role *'>
                  <Input
                    value={contact.contactTitle}
                    onChange={(e) =>
                      setContact((c) => ({
                        ...c,
                        contactTitle: e.target.value
                      }))
                    }
                    className={INPUT_ROW_TALL}
                    placeholder='e.g. VP Partnerships'
                  />
                </FormField>
                <FormField label='Contact Email *'>
                  <Input
                    value={contact.contactEmail}
                    onChange={(e) =>
                      setContact((c) => ({
                        ...c,
                        contactEmail: e.target.value
                      }))
                    }
                    className={INPUT_ROW_TALL}
                    placeholder='Email address'
                    type='email'
                  />
                </FormField>
                <FormField label='Contact LinkedIn *'>
                  <Input
                    value={contact.contactLinkedin}
                    onChange={(e) =>
                      setContact((c) => ({
                        ...c,
                        contactLinkedin: e.target.value
                      }))
                    }
                    className={INPUT_ROW_TALL}
                    placeholder='LinkedIn profile URL'
                  />
                </FormField>
              </div>
              <div className='mt-2'>
                <FormField label='Buying Intent Signal *'>
                  <Textarea
                    value={contact.buyingIntent}
                    maxLength={280}
                    onChange={(e) =>
                      setContact((c) => ({
                        ...c,
                        buyingIntent: e.target.value
                      }))
                    }
                    className={TEXTAREA_CLASS}
                    placeholder='Why do you think they need Sharkdom right now?'
                  />
                </FormField>
                <p className='mt-1.5 text-xs leading-[18px] text-[#99A1AF]'>
                  {contact.buyingIntent.length}/280
                </p>
              </div>
              <div className='mt-6'>
                <p className='text-sm font-medium leading-[21px] text-[#364153]'>
                  How warm is this lead? *
                </p>
                <div className='mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3'>
                  {warmthOptions.map((opt) => {
                    const selected = contact.warmth === opt.key
                    return (
                      <button
                        key={opt.key}
                        type='button'
                        onClick={() =>
                          setContact((c) => ({
                            ...c,
                            warmth: opt.key
                          }))
                        }
                        className={cn(
                          'flex min-h-[66px] flex-col items-center justify-center rounded-[10px] border-2 px-2 py-2 text-center transition-colors',
                          selected
                            ? 'border-[#6863FB] bg-[rgba(107,79,187,0.05)]'
                            : 'border-[#E5E7EB] bg-white dark:bg-card'
                        )}
                      >
                        <span
                          className={cn(
                            'text-[13px] text-[#0A0A0A]',
                            selected ? 'font-bold' : 'font-normal'
                          )}
                        >
                          {opt.title}
                        </span>
                        <span
                          className={cn(
                            'mt-1 text-[11px] leading-4 text-[#99A1AF]',
                            selected && 'font-bold'
                          )}
                        >
                          {opt.hint}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className='mt-8 flex items-center justify-between border-t border-[#F3F4F6] pt-6'>
                <button
                  type='button'
                  onClick={() => setStep(0)}
                  className='h-[43px] w-[75px] rounded-[10px] border border-[#D1D5DC] text-sm font-bold text-[#4A5565] hover:bg-[#F9FAFB] dark:bg-muted'
                >
                  Back
                </button>
                <button
                  type='button'
                  onClick={() => {
                    if (validateStep1()) setStep(2)
                  }}
                  className='rounded-[10px] bg-[#6863FB] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6863FB]/90'
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className='rounded-[10px] bg-[rgba(107,79,187,0.05)] p-4'>
                <FormField label='Preferred meeting format'>
                  <Input
                    value={involvement.meetingFormat}
                    onChange={(e) =>
                      setInvolvement((i) => ({
                        ...i,
                        meetingFormat: e.target.value
                      }))
                    }
                    className={INPUT_ROW_SHORT}
                  />
                </FormField>
                <div className='mt-4'>
                  <FormField label='Message to Sharkdom team'>
                    <Textarea
                      value={involvement.messageToTeam}
                      onChange={(e) =>
                        setInvolvement((i) => ({
                          ...i,
                          messageToTeam: e.target.value
                        }))
                      }
                      className={cn(TEXTAREA_CLASS, 'min-h-[80px]')}
                      placeholder='Context about the company'
                    />
                  </FormField>
                </div>
              </div>

              <div className='mt-6 rounded-[10px] bg-[rgba(26,122,74,0.05)] p-5'>
                <p className='text-xs font-bold uppercase leading-[18px] text-[#6A7282]'>
                  Based on your inputs
                </p>
                <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3'>
                  <div>
                    <p className='text-[11px] leading-4 text-[#99A1AF]'>
                      Estimated ACV
                    </p>
                    <p className='mt-0.5 text-base font-bold text-[#0A0A0A]'>
                      {formatUsd(parsedAcv)}
                    </p>
                  </div>
                  <div>
                    <p className='text-[11px] leading-4 text-[#99A1AF]'>
                      Your tier
                    </p>
                    <p className='mt-0.5 text-base font-bold text-[#0A0A0A]'>
                      {profile?.partnershipTier === 'CHAMPION_PARTNER'
                        ? 'Champion'
                        : 'Referral'}
                    </p>
                  </div>
                  <div className='sm:col-span-1'>
                    <p className='text-[11px] leading-4 text-[#99A1AF]'>
                      Estimated commission
                    </p>
                    <p className='mt-0.5 text-xl font-extrabold leading-[30px] text-[#1A7A4A]'>
                      {commissionRange(
                        parsedAcv,
                        profile?.partnershipTier === 'CHAMPION_PARTNER'
                          ? 'champion'
                          : 'referral'
                      )}
                    </p>
                  </div>
                </div>
                <p className='mt-4 text-[11px] italic leading-[16.5px] text-[#99A1AF]'>
                  This is an estimate. Final amount confirmed after deal closes.
                </p>
              </div>

              <div className='mt-8 flex items-center justify-between border-t border-[#F3F4F6] pt-6'>
                <button
                  type='button'
                  onClick={() => setStep(1)}
                  className='h-[43px] w-[75px] rounded-[10px] border border-[#D1D5DC] text-sm font-bold text-[#4A5565] hover:bg-[#F9FAFB] dark:bg-muted'
                >
                  Back
                </button>
                <button
                  type='button'
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className='rounded-[10px] bg-[#6863FB] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6863FB]/90 disabled:opacity-50'
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Lead →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </PartnerProgramPortalScaffold>
  )
}
