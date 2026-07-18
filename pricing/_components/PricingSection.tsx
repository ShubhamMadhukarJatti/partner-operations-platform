'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Call, ProfileCircle } from 'iconsax-react'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Euro,
  IndianRupee,
  MessageCircleMore,
  Minus,
  MinusCircle,
  Play,
  Puzzle,
  Sparkles
} from 'lucide-react'

import {
  CORE_FEATURES_LIST,
  INTEGRATIONS_FEATURES_LIST,
  integrationsData,
  pricingData
} from '@/config/data'
import {
  DEFAULT_PRICING_REGION,
  type PricingRegion
} from '@/lib/pricing-region'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import FooterCta from '../../_components/home-v2/FooterCta'
import CustomizeBundle from './CustomizeBundle'
import FAQSection from './FAQSection'
import PricingComparisonTable from './PricingComparisonTable'
import PurchaseCardsSection from './PurchaseCardsSection'
import SavingsCalculator from './SavingsCalculator'
import SharkdomSavings from './SharkdomSavings'
import TestimonialsSlider from './TestimonialsSlider'

type Region = PricingRegion
type PlanType = 'standard' | 'premium' | 'elite'

const ACHIEVEMENTS = [
  {
    imgSrc: '/assets/most-implementable-summer-2024.png',
    altText: 'most-implementable-summer-2024',
    width: 200,
    height: 200
  },
  {
    imgSrc: '/assets/top-10-partnership-solution-2024.png',
    altText: 'top-10-partnership-solution-2024',
    width: 200,
    height: 200
  },
  {
    imgSrc: '/assets/best-results-summer-2024.png',
    altText: 'best-results-summer-2024',
    width: 200,
    height: 200
  },
  {
    imgSrc: '/assets/leader-summer-2024.png',
    altText: 'leader-summer-2024',
    width: 200,
    height: 200
  }
]

const getCurrencySymbol = (region: Region | null) => {
  // India: show INR; any other country: show USD only
  if (region === 'India') return <IndianRupee strokeWidth={3} size={20} />
  return <DollarSign strokeWidth={3} size={20} />
}

export const getCompareCurrencySymbol = (region: Region | null) => {
  // India: INR; any other country: USD only
  if (region === 'India') return <IndianRupee size={12} />
  return <DollarSign size={12} />
}

export const getFreePrice = (region: Region | null, _isYearly: boolean) => {
  if (!region) return 0
  return 0 // Free tier is 0 for both India and other countries (USD)
}

export const getStandardPrice = (region: Region | null, isYearly: boolean) => {
  if (!region) return 0
  // India: INR prices; any other country: USD only
  if (!isYearly) {
    return region === 'India' ? 3499 : 49
  }
  return region === 'India' ? 2834 : 40
}

export const getPremiumPrice = (region: Region | null, isYearly: boolean) => {
  if (!region) return 0
  // India: INR prices; any other country: USD only
  if (!isYearly) {
    return region === 'India' ? 7499 : 99
  }
  return region === 'India' ? 6074 : 81
}

export const getElitePrice = (region: Region | null, isYearly: boolean) => {
  if (!region) return 0
  // India: INR prices; any other country: USD only
  if (!isYearly) {
    return region === 'India' ? 14999 : 169
  }
  return region === 'India' ? 12149 : 137
}

export const getAdditionalUserPrice = (
  plan: PlanType,
  region: Region | null
): string => {
  if (!region) return ''
  // India: INR; any other country: USD only
  const usdPrices: Record<PlanType, string> = {
    standard: '$23.99',
    premium: '$43.99',
    elite: '$99.99'
  }
  const inrPrices: Record<PlanType, string> = {
    standard: '₹1,999',
    premium: '₹3,499',
    elite: '₹7,999'
  }
  return region === 'India' ? inrPrices[plan] : usdPrices[plan]
}

type PricingSectionProps = {
  forcedRegion?: Region
  initialRegion?: Region | null
  shouldRefineRegion?: boolean
}

const getBrowserFallbackRegion = (): Region => {
  if (typeof window === 'undefined') {
    return DEFAULT_PRICING_REGION
  }

  const browserHints = [
    ...(window.navigator.languages ?? []),
    window.navigator.language,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  ].filter(Boolean)

  const hasIndiaHint = browserHints.some((hint) => {
    const normalizedHint = hint.toLowerCase()
    return (
      normalizedHint === 'asia/kolkata' || /(?:^|[-_])in(?:$|[-_])/i.test(hint)
    )
  })

  return hasIndiaHint ? 'India' : DEFAULT_PRICING_REGION
}

const PricingSection = ({
  forcedRegion,
  initialRegion,
  shouldRefineRegion = false
}: PricingSectionProps) => {
  const resolvedInitialRegion =
    forcedRegion ?? initialRegion ?? DEFAULT_PRICING_REGION
  const [region, setRegion] = useState<Region | null>(resolvedInitialRegion)
  const [isYearly, setIsYearly] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  const [isRegionLoading, setIsRegionLoading] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  const handleRegionChange = (selectedRegion: Region) => {
    setRegion(selectedRegion)
    // setCurrency('')
  }

  const handleGetStarted = async (plan: PlanType) => {
    setIsLoading(true)
    try {
      // Add analytics tracking
      console.log('Starting registration for plan:', plan)
      window.location.href = `/register?plan=${plan.toLowerCase()}`
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    const fetchRegion = async () => {
      if (forcedRegion) {
        setRegion(forcedRegion)
        setIsRegionLoading(false)
        return
      }

      setRegion(initialRegion ?? DEFAULT_PRICING_REGION)

      if (!shouldRefineRegion) {
        setIsRegionLoading(false)
        return
      }

      try {
        const res = await fetch('/api/pricing/region', {
          cache: 'no-store'
        })
        if (!res.ok) throw new Error('pricing region request failed')
        const data = await res.json()
        if (!cancelled) {
          const detectedRegion =
            data.region === 'India'
              ? 'India'
              : data.region === 'US'
                ? 'US'
                : getBrowserFallbackRegion()
          setRegion(detectedRegion)
        }
      } catch (error) {
        console.warn(
          'Region detection failed, using default pricing region:',
          error
        )
        if (!cancelled) {
          setRegion(getBrowserFallbackRegion())
        }
      } finally {
        if (!cancelled) setIsRegionLoading(false)
      }
    }

    fetchRegion()
    return () => {
      cancelled = true
    }
  }, [forcedRegion, initialRegion, shouldRefineRegion])

  return (
    <div>
      <div>
        <section className='py-6 text-white sm:py-10 lg:py-16'>
          <div className='container mx-auto flex flex-col items-center px-4 text-center sm:px-6'>
            <div className='mb-12 flex flex-col items-center text-center'>
              <h1 className='text-4xl font-bold leading-[66px] text-black sm:text-[60px]'>
                Simple, <span className='text-[#6863FB]'>Flexible</span>,
                Pricing
              </h1>
              <p className='mt-4 max-w-3xl text-[16px] text-[#7688A8]'>
                Only Pay for the Partner Ops You Actually Need, Sharkdom lets
                you assemble your Partner Stack like Lego blocks.
              </p>
              <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
                <button className='flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-4 text-base font-semibold text-black transition hover:bg-gray-50'>
                  <ProfileCircle size={24} color='#000' />
                  Talk to Experts
                </button>
                <button className='flex items-center justify-center gap-2 rounded-full bg-[#6863FB] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#5853d6]'>
                  Buy Base Pack
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {/* Mobile-first responsive header controls */}
            <div className='mb-8 flex flex-col items-center gap-4 sm:mb-12 sm:flex-row sm:gap-8'>
              {/* Country Selector */}
              <button className='flex w-full items-center justify-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-2 shadow-sm transition hover:bg-blue-50 sm:w-auto sm:justify-start sm:px-4'>
                {isRegionLoading ? (
                  <>
                    <div className='h-4 w-6 animate-pulse rounded bg-gray-200'></div>
                    <span className='text-sm font-medium text-gray-400 sm:text-base'>
                      Loading...
                    </span>
                  </>
                ) : (
                  <>
                    <span className='text-xl'>
                      <Image
                        src={region === 'US' ? '/usa.svg' : '/india.svg'}
                        alt='Country Flag'
                        width={24}
                        height={16}
                      />
                    </span>
                    <span className='text-sm font-medium text-blue-600 sm:text-base'>
                      {region === 'US' ? 'United States' : 'India'}
                    </span>
                  </>
                )}
              </button>

              {/* Toggle */}
              <div className='flex items-center gap-2'>
                <span
                  className={`text-xs font-medium sm:text-sm ${!isYearly ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  Monthly
                </span>
                <button
                  onClick={() => setIsYearly(!isYearly)}
                  className={`relative flex h-6 w-12 items-center rounded-full border transition-colors duration-200
                    ${isYearly ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-gray-100'}`}
                >
                  <span
                    className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200
                      ${isYearly ? 'translate-x-6' : 'translate-x-0'}`}
                  />
                </button>
                <span
                  className={`text-xs font-medium sm:text-sm ${isYearly ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  Yearly
                </span>
              </div>
            </div>

            {/* <div className='mb-8 flex items-center justify-center space-x-4'>
              <span
                className={`${isAnnual ? 'text-yellow-400' : 'text-gray-400'} font-medium`}
              >
                Save up to 17% with annual billing!
              </span>
              <div className='flex items-center space-x-2'>
                <span>Annual Billing</span>
                <Switch
                  // onCheckedChange={() => {}}
                  checked={true}
                />
                <span>Monthly Billing</span>
              </div>
            </div> */}

            {/* Responsive grid for plans */}
            <div className='grid w-full max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:items-end lg:gap-0 lg:px-0'>
              {/* Standard Plan */}
              <div className='relative flex h-full flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 text-black shadow-md sm:p-8 lg:h-[650px]'>
                <div>
                  <div className='flex flex-col gap-2 text-left'>
                    <h3 className='text-xl font-bold sm:text-2xl'>Standard</h3>
                    <span className='text-xs text-slate-400 sm:text-sm'>
                      Small Companies
                    </span>
                    <p className='mt-2 flex items-baseline text-3xl font-bold sm:text-5xl'>
                      {isRegionLoading ? (
                        <span
                          aria-hidden='true'
                          className='inline-block h-8 w-24 animate-pulse rounded bg-gray-200 sm:h-12 sm:w-32'
                        ></span>
                      ) : (
                        <>
                          {getCurrencySymbol(region)}
                          {getStandardPrice(region, isYearly)}
                          <span className='ml-1 text-base font-normal text-gray-500 sm:text-lg'>
                            /mo
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <p className='mb-4 mt-2 text-left text-sm text-gray-500 sm:text-base'>
                    up to 1 user per month
                  </p>
                  <button
                    onClick={() => handleGetStarted('standard')}
                    disabled={isLoading}
                    className='mb-4 mt-2 w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 sm:py-2 sm:text-base'
                  >
                    {isLoading ? 'Loading...' : 'Get Started'}
                  </button>
                  <p className='mb-2 text-left text-xs text-gray-600 sm:text-sm'>
                    Don&apos;t let deals slip through the cracks. Organize and
                    find opportunities, and manage all your communication within
                    Sharkdom.
                  </p>
                  <ul className='my-4 space-y-2 text-left'>
                    <li className='pb-2 text-sm font-semibold sm:text-base'>
                      Core features:
                    </li>
                    <li className='flex items-start gap-2 pb-2 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#1463FF'
                        color='#fff'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>Up to Two AI proposal generators</span>
                    </li>
                    <li className='flex items-start gap-2 pb-2 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#1463FF'
                        color='#fff'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>Personalized Recommendations</span>
                    </li>
                    <li className='flex items-start gap-2 pb-2 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#1463FF'
                        color='#fff'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>24x7 email support</span>
                    </li>
                    <li className='flex items-start gap-2 pb-2 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#1463FF'
                        color='#fff'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>
                        1 user,{' '}
                        <span className='font-semibold'>
                          {isRegionLoading ? (
                            <span className='inline-block h-4 w-16 animate-pulse rounded bg-gray-200'></span>
                          ) : (
                            getAdditionalUserPrice('standard', region)
                          )}{' '}
                          per Additional user
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Premium Plan (Highlighted) */}
              <div className='relative z-10 flex h-full flex-col justify-between rounded-3xl border-2 border-blue-600 bg-blue-600 p-6 text-white shadow-2xl sm:p-8 lg:h-[700px] lg:scale-105'>
                <div className='absolute right-4 top-4 sm:right-6 sm:top-6'>
                  <span className='rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-600 shadow sm:px-4'>
                    Most Popular
                  </span>
                </div>
                <div>
                  <div className='flex flex-col gap-2 text-left'>
                    <h3 className='text-xl font-bold sm:text-2xl'>Premium</h3>
                    <span className='text-xs text-blue-100 sm:text-sm'>
                      Mid Stage Companies
                    </span>
                    <p className='mt-2 flex items-baseline text-3xl font-bold sm:text-5xl'>
                      {isRegionLoading ? (
                        <span
                          aria-hidden='true'
                          className='inline-block h-8 w-24 animate-pulse rounded bg-blue-200 sm:h-12 sm:w-32'
                        ></span>
                      ) : (
                        <>
                          {getCurrencySymbol(region)}
                          {getPremiumPrice(region, isYearly)}
                          <span className='ml-1 text-base font-normal text-blue-100 sm:text-lg'>
                            /mo
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <p className='mb-4 mt-2 text-left text-sm text-blue-100 sm:text-base'>
                    up to 1 users per month
                  </p>
                  <button
                    onClick={() => handleGetStarted('premium')}
                    disabled={isLoading}
                    className='mb-4 mt-2 w-full rounded-full bg-white py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-50 sm:py-2 sm:text-base'
                  >
                    {isLoading ? 'Loading...' : 'Get Started'}
                  </button>
                  <p className='mb-2 text-left text-xs text-blue-100 sm:text-sm'>
                    Work faster with increased automation and collaboration
                    tools.
                  </p>
                  <ul className='my-4 space-y-2 text-left'>
                    <li className='pb-2 text-sm font-semibold sm:text-base'>
                      All Startup features, plus:
                    </li>
                    <li className='flex items-start gap-2 pb-2 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#fff'
                        color='#1463FF'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>Up to Five AI proposal generators</span>
                    </li>
                    <li className='flex items-start gap-2 pb-2 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#fff'
                        color='#1463FF'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>Personalized Recommendation</span>
                    </li>
                    <li className='flex items-start gap-2 pb-2 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#fff'
                        color='#1463FF'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>24x7 email support</span>
                    </li>
                    <li className='flex items-start gap-2 pb-2 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#fff'
                        color='#1463FF'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>Unrestricted access to Partner Valve Room</span>
                    </li>
                    <li className='flex items-start gap-2 pb-2 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#fff'
                        color='#1463FF'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>Complete Access to meeting scheduling tools</span>
                    </li>
                    <li className='flex items-start gap-2 pb-2 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#fff'
                        color='#1463FF'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>Unlimited Access to integration portal tools</span>
                    </li>
                    <li className='flex items-start gap-2 pb-2 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#fff'
                        color='#1463FF'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>
                        1 user,{' '}
                        <span className='font-semibold'>
                          {isRegionLoading ? (
                            <span className='inline-block h-4 w-16 animate-pulse rounded bg-blue-200'></span>
                          ) : (
                            getAdditionalUserPrice('premium', region)
                          )}{' '}
                          per Additional user
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Elite Plan */}
              <div className='relative flex h-full flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 text-black shadow-md sm:p-8 lg:h-[650px]'>
                <div>
                  <div className='flex flex-col gap-2 text-left'>
                    <h3 className='text-xl font-bold sm:text-2xl'>Elite</h3>
                    <span className='text-xs text-slate-400 sm:text-sm'>
                      Enterprises
                    </span>
                    <p className='mt-2 flex items-baseline text-3xl font-bold sm:text-5xl'>
                      {isRegionLoading ? (
                        <span
                          aria-hidden='true'
                          className='inline-block h-8 w-24 animate-pulse rounded bg-gray-200 sm:h-12 sm:w-32'
                        ></span>
                      ) : (
                        <>
                          {getCurrencySymbol(region)}
                          {getElitePrice(region, isYearly)}
                          <span className='ml-1 text-base font-normal text-gray-500 sm:text-lg'>
                            /mo
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <p className='mb-4 mt-2 text-left text-sm text-gray-500 sm:text-base'>
                    up to 1 users per month
                  </p>
                  <button
                    onClick={() => handleGetStarted('elite')}
                    disabled={isLoading}
                    className='mb-4 mt-2 w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 sm:py-2 sm:text-base'
                  >
                    {isLoading ? 'Loading..' : 'Get Started'}
                  </button>
                  <p className='mb-2 text-left text-xs text-gray-600 sm:text-sm'>
                    Built for fast-growing teams looking for enhanced
                    customization and collaboration tools.
                  </p>
                  <ul className='my-4 space-y-2 text-left'>
                    <li className='pb-2 text-sm font-semibold sm:text-base'>
                      All Professional features, plus:
                    </li>
                    <li className='flex items-start gap-2 pb-1 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#1463FF'
                        color='#fff'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>Unlimited AI proposal generators</span>
                    </li>
                    <li className='flex items-start gap-2 pb-1 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#1463FF'
                        color='#fff'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>Personalized Recommendation</span>
                    </li>
                    <li className='flex items-start gap-2 pb-1 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#1463FF'
                        color='#fff'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>24x7 email support</span>
                    </li>
                    <li className='flex items-start gap-2 pb-1 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#1463FF'
                        color='#fff'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>Unrestricted access to Partner Valve Room</span>
                    </li>
                    <li className='flex items-start gap-2 pb-1 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#1463FF'
                        color='#fff'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>Complete Access to meeting scheduling tools</span>
                    </li>
                    <li className='flex items-start gap-2 pb-1 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#1463FF'
                        color='#fff'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>Unlimited Access to integration portal tools</span>
                    </li>
                    <li className='flex items-start gap-2 pb-1 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#1463FF'
                        color='#fff'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>Quarterly check-in</span>
                    </li>
                    <li className='flex items-start gap-2 pb-1 text-xs sm:text-sm'>
                      <CheckCircle2
                        fill='#1463FF'
                        color='#fff'
                        size={16}
                        className='mt-0.5 flex-shrink-0 sm:h-5 sm:w-5'
                      />
                      <span>
                        1 user,{' '}
                        <span className='font-semibold'>
                          {isRegionLoading ? (
                            <span className='inline-block h-4 w-16 animate-pulse rounded bg-gray-200'></span>
                          ) : (
                            getAdditionalUserPrice('elite', region)
                          )}{' '}
                          per Additional user
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className='mt-4 grid grid-cols-1 items-center gap-6 px-4 py-6 sm:px-6 sm:py-10'>
              <div className='col-span-2'>
                <p className='px-2 text-center text-lg text-[#2A3241] sm:text-[20px]'>
                  All Sharkdom plans include built-in meeting and communication
                  functionality.
                </p>
                <p className='mt-2 text-center text-xs text-[#657795] text-slate-300 sm:text-sm'>
                  Call and SMS usage are charged separately.{' '}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className='bg-[#F9F9FB] px-4 py-4 sm:px-6 sm:py-6'>
          <div className='mx-auto max-w-5xl'>
            <div className='mb-8 flex w-full justify-center'>
              <button
                onClick={() => setShowComparison((prev) => !prev)}
                className='flex w-full items-center justify-center gap-2 rounded-[12px] rounded-t-2xl border border-solid border-[#E4E7EE] bg-white bg-white py-4 text-[16px] font-bold text-[#6863FB] transition-colors'
              >
                <Puzzle size={24} />
                <span>Show Plan Comparison</span>
                {showComparison ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>
            </div>
            {showComparison && (
              <>
                <PricingComparisonTable
                  title='Core Features (PRM)'
                  plans={pricingData}
                  features={CORE_FEATURES_LIST}
                />

                {/* Integrations Table */}
                <PricingComparisonTable
                  title='Integrations'
                  plans={integrationsData}
                  features={INTEGRATIONS_FEATURES_LIST}
                  className='mt-6 sm:mt-8'
                />

                <div className='mb-8 mt-8 flex w-full justify-center'>
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className='flex w-full items-center justify-center gap-2 rounded-[12px] rounded-t-2xl border border-solid border-[#E4E7EE] bg-white bg-white py-4 text-[16px] font-bold text-[#6863FB] transition-colors'
                  >
                    <Puzzle size={24} />
                    <span>Show Plan Comparison</span>
                    {showComparison ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        <CustomizeBundle />

        <PurchaseCardsSection region={region ?? DEFAULT_PRICING_REGION} />

        {/* <SavingsCalculator /> */}
        {/* <SharkdomSavings /> */}
        {/* <TestimonialsSlider /> */}
        <FAQSection />
        {/* <FooterCta /> */}
      </div>
    </div>
  )
}

export default PricingSection
