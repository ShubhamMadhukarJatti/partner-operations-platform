'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { getServerUser, publicFetcher } from '@/lib/server'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { showCustomToast } from '@/components/custom-toast'
import { NewFullLogo } from '@/components/icons/logo'
import {
  partnerProgramCtaArrowClassNames,
  partnerProgramCtaClassNames
} from '@/components/marketing/PartnerProgramApplyLink'

import {
  buildUnifiedPayload,
  LINKEDIN_URL_REGEX,
  type PartnerApplicationFormValues,
  type PartnershipTier
} from './build-payload'
import {
  DRAFT_STORAGE_KEY,
  GTM_FOCUS_OPTIONS,
  normalizeTierParam,
  PARTNER_APPLY_EMAIL_SESSION_KEY,
  SUBMIT_SUCCESS_SESSION_KEY,
  SUBMIT_SUCCESS_SESSION_VALUE,
  type PartnerApplicationDraft
} from './constants'

const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  linkedinProfileUrl: z
    .string()
    .min(1, 'LinkedIn URL is required')
    .refine((v) => LINKEDIN_URL_REGEX.test(v.trim()), {
      message: 'Enter a valid LinkedIn profile URL'
    }),
  companyPractice: z.string(),
  geography: z.string(),
  companiesAdvise: z.string(),
  gtmFocus: z.array(z.string()),
  hearAbout: z.string(),
  tier: z.enum(['CHAMPION', 'REFERRAL']),
  networkNotes: z.string().max(200, 'Maximum 200 characters'),
  agreeToTerms: z.boolean().refine((v) => v === true, {
    message: 'You must agree to the Partner Program terms to continue'
  })
})

type FormValues = z.infer<typeof formSchema>

const defaultFormValues = (tier: PartnershipTier): FormValues => ({
  fullName: '',
  email: '',
  linkedinProfileUrl: '',
  companyPractice: '',
  geography: '',
  companiesAdvise: '',
  gtmFocus: [],
  hearAbout: '',
  tier,
  networkNotes: '',
  agreeToTerms: false
})

function TierSidebar({
  tier,
  className
}: {
  tier: PartnershipTier
  className?: string
}) {
  const isChampion = tier === 'CHAMPION'
  return (
    <aside
      className={cn('w-full min-w-0 shrink-0 lg:sticky lg:top-6', className)}
    >
      {/*
        Figma: ApplicationForm tier card — padding 25px, gap 20px, border #F3F4F6,
        shadow 0 1px 3px / 0 1px 2px -1px, radius 14px
      */}
      <div className='flex flex-col gap-5 rounded-[14px] border border-[#F3F4F6] bg-white p-4 pb-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-card sm:p-6 sm:pb-6 md:p-[25px] md:pb-6'>
        <div
          className='flex flex-col gap-1 rounded-[5px] px-4 pb-3 pt-3'
          style={{
            background:
              'linear-gradient(90deg, rgba(185, 207, 255, 0.5) 0%, rgba(222, 176, 255, 0.5) 100%)'
          }}
        >
          <p className='text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
            Your selected tier
          </p>
          <p className='text-lg font-bold leading-7 text-[#1A1A2E] sm:text-xl sm:leading-[30px]'>
            {isChampion ? 'Champion Partner' : 'Referral Partner'}
          </p>
        </div>

        <div>
          <p className='text-xs font-bold uppercase leading-[18px] text-[#6A7282]'>
            Commission rate
          </p>
          <p className='mt-[5px] text-2xl font-extrabold leading-9 text-[#1A7A4A]'>
            {isChampion ? '15–20%' : '8–10%'}
          </p>
          <p className='mt-1 text-xs font-normal leading-[18px] text-[#99A1AF]'>
            first year ACV
          </p>
        </div>

        <div className='flex flex-col gap-2 border-t border-[#F3F4F6] pt-[21px]'>
          <p className='text-xs font-bold uppercase leading-[18px] text-[#6A7282]'>
            What this means
          </p>
          <p className='text-sm font-normal leading-[23px] text-[#4A5565]'>
            {isChampion
              ? "You set up a meeting between your client and Sharkdom's sales team. If they onboard, you earn commission on their first year's contract value."
              : 'You share leads and introductions; Sharkdom runs the sales process. A lighter time commitment with competitive commission on influenced revenue.'}
          </p>
        </div>
      </div>
    </aside>
  )
}

function PartnerProgramApplicationFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [networkLen, setNetworkLen] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: authData } = useQuery<any>({
    queryKey: ['auth-data'],
    queryFn: async () => {
      const { user } = await getServerUser()
      return { user }
    }
  })
  const currentUserId = (authData?.user as { uid?: string })?.uid || ''

  const initialTier = useMemo((): PartnershipTier => {
    const fromUrl = normalizeTierParam(searchParams.get('tier'))
    if (fromUrl) return fromUrl
    if (typeof window === 'undefined') return 'CHAMPION'
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (!raw) return 'CHAMPION'
      const draft = JSON.parse(raw) as PartnerApplicationDraft
      if (draft.tier === 'CHAMPION' || draft.tier === 'REFERRAL')
        return draft.tier
    } catch {
      /* ignore */
    }
    return 'CHAMPION'
  }, [searchParams])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues(initialTier)
  })

  const { watch, setValue, reset, handleSubmit, control } = form
  const tier = watch('tier')
  const networkNotes = watch('networkNotes')
  const agreeToTerms = watch('agreeToTerms')

  useEffect(() => {
    setNetworkLen(networkNotes?.length ?? 0)
  }, [networkNotes])

  useEffect(() => {
    const fromUrl = normalizeTierParam(searchParams.get('tier'))
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (!raw) {
        reset(defaultFormValues(fromUrl ?? 'CHAMPION'))
        return
      }
      const draft = JSON.parse(raw) as PartnerApplicationDraft
      const tierToUse = fromUrl ?? draft.tier ?? 'CHAMPION'
      reset({
        fullName: draft.fullName ?? '',
        email: draft.email ?? '',
        linkedinProfileUrl: draft.linkedinProfileUrl ?? '',
        companyPractice: draft.companyPractice ?? '',
        geography: draft.geography ?? '',
        companiesAdvise: draft.companiesAdvise ?? '',
        gtmFocus: Array.isArray(draft.gtmFocus) ? draft.gtmFocus : [],
        hearAbout: draft.hearAbout ?? '',
        tier: tierToUse,
        networkNotes: draft.networkNotes ?? '',
        agreeToTerms: false
      })
    } catch {
      reset(defaultFormValues(fromUrl ?? 'CHAMPION'))
    }
  }, [searchParams, reset])

  const toggleGtm = (label: string) => {
    const cur = form.getValues('gtmFocus')
    if (cur.includes(label)) {
      setValue(
        'gtmFocus',
        cur.filter((x) => x !== label),
        { shouldValidate: true }
      )
    } else {
      setValue('gtmFocus', [...cur, label], { shouldValidate: true })
    }
  }

  const saveDraft = () => {
    const v = form.getValues()
    const draft: PartnerApplicationDraft = {
      fullName: v.fullName,
      email: v.email,
      linkedinProfileUrl: v.linkedinProfileUrl,
      companyPractice: v.companyPractice,
      geography: v.geography,
      companiesAdvise: v.companiesAdvise,
      gtmFocus: v.gtmFocus,
      hearAbout: v.hearAbout,
      tier: v.tier,
      networkNotes: v.networkNotes,
      savedAt: new Date().toISOString()
    }
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
      showCustomToast(
        'Saved',
        'Your application draft was saved on this device.',
        'success',
        4000
      )
    } catch {
      showCustomToast(
        'Error',
        'Could not save draft. Check browser storage settings.',
        'error',
        5000
      )
    }
  }

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    const payloadValues: PartnerApplicationFormValues = {
      fullName: values.fullName,
      email: values.email,
      linkedinProfileUrl: values.linkedinProfileUrl,
      companyPractice: values.companyPractice,
      geography: values.geography,
      companiesAdvise: values.companiesAdvise,
      gtmFocus: values.gtmFocus,
      hearAbout: values.hearAbout,
      tier: values.tier,
      networkNotes: values.networkNotes
    }

    try {
      const payload = buildUnifiedPayload(payloadValues, currentUserId)
      const data = await publicFetcher<any>('/api/v1/partner/application', {
        method: 'POST',
        data: payload
      })

      if (data?.success === false) {
        throw new Error(data.message || 'Request failed')
      }

      localStorage.removeItem(DRAFT_STORAGE_KEY)
      sessionStorage.setItem(
        SUBMIT_SUCCESS_SESSION_KEY,
        SUBMIT_SUCCESS_SESSION_VALUE
      )
      sessionStorage.setItem(
        PARTNER_APPLY_EMAIL_SESSION_KEY,
        values.email.trim()
      )
      router.push('/apply-to-partner-program/submitted')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      showCustomToast('Error', msg, 'error', 6000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className='relative min-h-screen overflow-x-hidden font-sans text-[#0A0A0A]'
      style={{
        backgroundColor: '#F9FAFB',
        backgroundImage: `
          radial-gradient(ellipse 90% 70% at 50% -15%, rgba(199, 182, 255, 0.38) 0%, rgba(147, 197, 253, 0.18) 38%, transparent 62%),
          radial-gradient(ellipse 95% 75% at 0% 0%, rgba(147, 197, 253, 0.42) 0%, rgba(147, 197, 253, 0.1) 40%, transparent 68%),
          radial-gradient(ellipse 90% 72% at 100% 0%, rgba(196, 181, 253, 0.4) 0%, rgba(186, 170, 255, 0.12) 42%, transparent 68%),
          radial-gradient(ellipse 55% 45% at 100% 100%, rgba(165, 243, 252, 0.26) 0%, transparent 55%)
        `
      }}
    >
      {/*
        Figma OverlayShape + Purple_accent: large blurred ellipses — nudged to overlap
        top-center so the band behind the cards isn’t dead white.
      */}
      <div
        className='pointer-events-none absolute -left-[8%] -top-[30%] h-[min(920px,115vw)] w-[min(920px,115vw)] rounded-[300px] blur-[92px]'
        style={{
          background:
            'linear-gradient(82.58deg, rgba(74, 164, 217, 0.24) 18.53%, rgba(30, 85, 202, 0.14) 40.84%, rgba(93, 68, 205, 0.16) 60.49%, rgba(84, 66, 194, 0.08) 92.66%, rgba(33, 55, 129, 0) 150.53%)'
        }}
        aria-hidden
      />
      <div
        className='pointer-events-none absolute -right-[5%] -top-[8%] left-[25%] h-[min(820px,100vw)] w-[min(820px,100vw)] rounded-[240px] mix-blend-hard-light blur-[72px]'
        style={{
          background:
            'linear-gradient(228.36deg, rgba(199, 182, 255, 0.34) 10%, rgba(167, 139, 250, 0.22) 32%, rgba(103, 230, 255, 0.16) 52%, rgba(82, 178, 197, 0) 72%)'
        }}
        aria-hidden
      />
      {/*
        Extra top-center bloom — fills the gap where corner blobs used to read as white
      */}
      <div
        className='pointer-events-none absolute left-1/2 top-0 h-[min(480px,52vh)] w-[min(1100px,92vw)] -translate-x-1/2 -translate-y-[18%] rounded-[50%] blur-[100px]'
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 45%, rgba(210, 195, 255, 0.45) 0%, rgba(165, 210, 255, 0.22) 48%, transparent 72%)'
        }}
        aria-hidden
      />
      <div
        className='pointer-events-none absolute bottom-0 right-0 h-[45vh] w-[55vw] max-w-[720px] rounded-[50%] blur-[80px]'
        style={{
          background:
            'radial-gradient(closest-side, rgba(186, 230, 253, 0.32), transparent 72%)'
        }}
        aria-hidden
      />

      {/*
        Figma Navigation: padding 16px 192px 0, container 1152×36, gap 12px,
        logo 160×28, “/ Partner Application” 14px/21px #383E49
      */}
      {/*
        Figma: nav uses horizontal inset 192px on the 1536 frame; row is left-aligned
        inside max 1152px — avoid mx-auto so logo isn’t centered on wide viewports.
      */}
      <header className='relative z-10 border-b border-[#F3F4F6] bg-white dark:bg-card'>
        <div className='w-full px-4 pb-4 pt-4 sm:px-6 md:px-8 lg:px-12 xl:px-[192px]'>
          <div className='flex min-h-[36px] max-w-[1152px] flex-wrap items-center gap-x-3 gap-y-1'>
            <Link href='/' className='shrink-0' aria-label='Sharkdom home'>
              <NewFullLogo className='h-7 w-[160px]' />
            </Link>
            <span className='text-xs font-normal leading-[18px] text-[#383E49] sm:text-sm sm:leading-[21px]'>
              / Partner Application
            </span>
          </div>
        </div>
      </header>

      <main className='relative z-10 w-full px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 md:px-8 lg:px-12 xl:px-[192px]'>
        <div className='flex w-full max-w-[1152px] flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'>
          {/*
            Mobile: tier summary first, then form (full width each).
            lg+: Figma — form ~650px max, tier card ~422px max; form left, tier right.
          */}
          <TierSidebar
            tier={tier}
            className='order-1 lg:order-2 lg:max-w-[422px]'
          />
          {/*
            Figma form container: ~650×1013, padding 33px, border #F3F4F6,
            shadow per spec, radius 14px
          */}
          <div className='order-2 w-full min-w-0 max-w-[650px] flex-1 overflow-hidden rounded-[14px] border border-[#F3F4F6] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-card lg:order-1'>
            <div className='p-4 sm:p-6 md:p-[33px]'>
              <h1 className='text-xl font-bold leading-8 text-[#1A1A2E] sm:text-2xl sm:leading-9'>
                Partner Application
              </h1>
              <p className='mt-1 text-xs font-normal leading-[18px] text-[#6A7282] sm:text-sm sm:leading-[21px]'>
                Join Sharkdom&apos;s referral partner program
              </p>

              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='mt-8 space-y-5'
                >
                  <div className='grid gap-5 sm:grid-cols-2'>
                    <FormField
                      control={control}
                      name='fullName'
                      render={({ field }) => (
                        <FormItem className='space-y-1.5'>
                          <FormLabel className='text-sm font-medium leading-[21px] text-[#364153]'>
                            Full Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Your full name'
                              className='h-[43px] rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-[14px] py-[10px] text-sm font-normal leading-[21px] placeholder:text-[rgba(10,10,10,0.5)] dark:bg-muted dark:placeholder:text-white'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name='email'
                      render={({ field }) => (
                        <FormItem className='space-y-1.5'>
                          <FormLabel className='text-sm font-medium leading-[21px] text-[#364153]'>
                            Email *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type='email'
                              placeholder='work@company.com'
                              className='h-[43px] rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-[14px] py-[10px] text-sm font-normal leading-[21px] placeholder:text-[rgba(10,10,10,0.5)] dark:bg-muted dark:placeholder:text-white'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid gap-5 sm:grid-cols-2'>
                    <FormField
                      control={control}
                      name='linkedinProfileUrl'
                      render={({ field }) => (
                        <FormItem className='space-y-1.5'>
                          <FormLabel className='text-sm font-medium leading-[21px] text-[#364153]'>
                            LinkedIn Profile URL *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='https://linkedin.com/in/...'
                              className='h-[43px] rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-[14px] py-[10px] text-sm font-normal leading-[21px] placeholder:text-[rgba(10,10,10,0.5)] dark:bg-muted dark:placeholder:text-white'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name='companyPractice'
                      render={({ field }) => (
                        <FormItem className='space-y-1.5'>
                          <FormLabel className='text-sm font-medium leading-[21px] text-[#364153]'>
                            Company / Practice Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Optional'
                              className='h-[43px] rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-[14px] py-[10px] text-sm font-normal leading-[21px] placeholder:text-[rgba(10,10,10,0.5)] dark:bg-muted dark:placeholder:text-white'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid gap-5 sm:grid-cols-2'>
                    <FormField
                      control={control}
                      name='geography'
                      render={({ field }) => (
                        <FormItem className='space-y-1.5'>
                          <FormLabel className='text-sm font-medium leading-[21px] text-[#364153]'>
                            Geography
                          </FormLabel>
                          <FormControl>
                            <Input
                              className='h-[41px] rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-[14px] py-[10px] text-sm font-normal leading-[21px] dark:bg-muted'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name='companiesAdvise'
                      render={({ field }) => (
                        <FormItem className='space-y-1.5'>
                          <FormLabel className='text-sm font-medium leading-[21px] text-[#364153]'>
                            Companies you advise
                          </FormLabel>
                          <FormControl>
                            <Input
                              className='h-[41px] rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-[14px] py-[10px] text-sm font-normal leading-[21px] dark:bg-muted'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormItem className='space-y-2'>
                    <FormLabel className='text-sm font-medium leading-[21px] text-[#364153]'>
                      Primary GTM Focus
                    </FormLabel>
                    {/*
                      Figma pills: h ~33.5, white bg, 1px #E5E7EB, full radius,
                      13px/20px medium #4A5565, horizontal padding ~16px
                    */}
                    <div className='flex flex-wrap gap-2'>
                      {GTM_FOCUS_OPTIONS.map((label) => {
                        const selected = watch('gtmFocus').includes(label)
                        return (
                          <button
                            key={label}
                            type='button'
                            onClick={() => toggleGtm(label)}
                            className={cn(
                              'box-border min-h-[34px] rounded-full border px-4 py-[7px] text-[13px] font-medium leading-5 transition-colors',
                              selected
                                ? 'border-[#6863FB] bg-[rgba(107,79,187,0.05)] text-[#4A5565]'
                                : 'border border-[#E5E7EB] bg-white text-[#4A5565] dark:bg-card'
                            )}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </FormItem>

                  <FormField
                    control={control}
                    name='hearAbout'
                    render={({ field }) => (
                      <FormItem className='space-y-1.5'>
                        <FormLabel className='text-sm font-medium leading-[21px] text-[#364153]'>
                          How did you hear about this program?
                        </FormLabel>
                        <FormControl>
                          <Input
                            className='h-[41px] rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-[14px] py-[10px] text-sm font-normal leading-[21px] dark:bg-muted'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem className='space-y-3'>
                    <FormLabel className='text-sm font-medium leading-[21px] text-[#364153]'>
                      Partnership Tier
                    </FormLabel>
                    {/*
                      Figma: row gap 12px, cards 285.8×79, padding 18px 18px 2px, gap 4px;
                      selected: bg rgba(107,79,187,0.05), border 2px #6863FB;
                      unselected: border 2px #E5E7EB
                    */}
                    <div className='grid gap-3 sm:grid-cols-2'>
                      {(
                        [
                          {
                            id: 'CHAMPION' as const,
                            title: 'Tier 1: Champion Partner',
                            sub: '15-20% ACV — Set up meetings'
                          },
                          {
                            id: 'REFERRAL' as const,
                            title: 'Tier 2: Referral Partner',
                            sub: '8-10% ACV — Share leads'
                          }
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type='button'
                          onClick={() =>
                            setValue('tier', opt.id, { shouldValidate: true })
                          }
                          className={cn(
                            'flex min-h-[79px] flex-col gap-1 rounded-[14px] border-2 border-[#E5E7EB] bg-white px-[18px] pb-0.5 pt-[18px] text-left transition-colors dark:bg-card',
                            tier === opt.id
                              ? 'border-[#6863FB] bg-[rgba(107,79,187,0.05)]'
                              : 'border-[#E5E7EB]'
                          )}
                        >
                          <span className='text-sm font-bold leading-[21px] text-[#0A0A0A]'>
                            {opt.title}
                          </span>
                          <span className='text-xs font-medium leading-[18px] text-[#6A7282]'>
                            {opt.sub}
                          </span>
                        </button>
                      ))}
                    </div>
                  </FormItem>

                  <FormField
                    control={control}
                    name='networkNotes'
                    render={({ field }) => (
                      <FormItem className='space-y-1.5'>
                        <FormLabel className='text-sm font-medium leading-[21px] text-[#364153]'>
                          Tell us briefly about your network
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Optional but recommended (200 chars)'
                            className='min-h-[96px] resize-y rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-[14px] py-[10px] text-sm font-normal leading-[21px] placeholder:text-[rgba(10,10,10,0.5)] dark:bg-muted dark:placeholder:text-white'
                            maxLength={200}
                            {...field}
                          />
                        </FormControl>
                        <p className='text-xs font-normal leading-[18px] text-[#99A1AF]'>
                          {networkLen}/200
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name='agreeToTerms'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-start gap-3 space-y-0 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 dark:bg-muted'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                            className='mt-0.5 border-[#364153]'
                          />
                        </FormControl>
                        <div className='space-y-1 leading-snug'>
                          <FormLabel className='cursor-pointer text-sm font-medium text-[#364153]'>
                            I agree to the{' '}
                            <Link
                              href='/terms-and-conditions'
                              className='font-semibold text-[#5B76FF] underline underline-offset-2'
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              Terms &amp; Conditions
                            </Link>{' '}
                            and Partner Program participation terms.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className='flex w-full flex-col gap-3 pt-2 lg:flex-row lg:flex-wrap lg:items-stretch lg:gap-4'>
                    <button
                      type='submit'
                      disabled={isSubmitting || !agreeToTerms}
                      className={partnerProgramCtaClassNames(
                        'primary',
                        'form',
                        'justify-center'
                      )}
                    >
                      {isSubmitting ? (
                        'Submitting…'
                      ) : (
                        <>
                          Submit Application
                          <ArrowRight
                            className={partnerProgramCtaArrowClassNames(
                              'primary'
                            )}
                            aria-hidden
                          />
                        </>
                      )}
                    </button>
                    <button
                      type='button'
                      onClick={saveDraft}
                      className={partnerProgramCtaClassNames(
                        'outline',
                        'form',
                        'justify-center'
                      )}
                    >
                      Save &amp; Continue Later
                      <ArrowRight
                        className={partnerProgramCtaArrowClassNames('outline')}
                        aria-hidden
                      />
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PartnerProgramApplicationFormInner
