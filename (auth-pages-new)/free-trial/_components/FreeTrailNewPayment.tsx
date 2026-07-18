'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { load } from '@amcharts/amcharts5/.internal/core/util/Net'
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group'
import { useQuery } from '@tanstack/react-query'
import {
  Check,
  CheckCircle2,
  DollarSign,
  IndianRupee,
  Minus,
  MinusCircle,
  Phone,
  Plus
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { Label } from 'recharts'

import {
  integrationsData,
  pricingData as pricingTableData
} from '@/config/data'
import { getConfigByType } from '@/lib/db/configuration'
import { getCurrentOrganization } from '@/lib/db/organization'
import {
  createStripeCheckout,
  createStripeCustomerCheckout,
  createUserSubscription,
  upgradeUserSubscription,
  verifyPayment
} from '@/lib/db/payment'
import { getSubscription } from '@/lib/db/subscription'
import { useAuth } from '@/lib/firebase/auth/context'
import { getServerUser } from '@/lib/server'
import { getStripe } from '@/lib/stripe'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { showCustomToast } from '@/components/custom-toast'
import { FullLogo } from '@/components/icons/logo'
import {
  getCompareCurrencySymbol,
  getElitePrice,
  getFreePrice,
  getPremiumPrice,
  getStandardPrice
} from '@/app/(marketing)/pricing/_components/PricingSection'

// Types
type Region = 'India' | 'US'

type PricingData = {
  id: number
  key: string
  value: string
  active: boolean
}

type PlanFeatures = {
  [key: string]: {
    title: string
    subtitle: string
    features: string[]
    userCount: string
  }
}

// Constants

const numberToWordMap = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR']

const PLAN_FEATURES: PlanFeatures = {
  FREE_TRIAL: {
    title: 'FREE',
    subtitle: 'Startups',
    features: ['Up to One AI proposal generator'],
    userCount: '1 user/month'
  },
  STANDARD: {
    title: 'STANDARD',
    subtitle: 'Small Companies',
    features: [
      'Up to Two AI proposal generators',
      'Personalized recommendations',
      '24×7 email support'
    ],
    userCount: '2 users/month'
  },
  PREMIUM: {
    title: 'PREMIUM',
    subtitle: 'Mid Stage Companies',
    features: [
      'Up to Five AI proposal generator',
      'Personalized recommendations',
      '24×7 email support',
      'Unrestricted access to Partner Valve Room',
      'Complete Access to meet scheduling tools',
      'Unlimited Access to Integration portal tools'
    ],
    userCount: '5 users/month'
  },
  ELITE: {
    title: 'Enterprise',
    subtitle: 'Big Companies',
    features: [
      'Unlimited AI proposal generator',
      'All Premium features',
      'Quarterly Check-ins',
      'Priority Support',
      'Custom Integration Support'
    ],
    userCount: '9 users/month'
  }
}

type Props = {
  subscription?: any
}

const TrialPricingPage = () => {
  const {
    data: subscription,
    isLoading: subscriptionLoading,
    error
  } = useQuery<any>({
    queryKey: ['get-subscription-data'],
    queryFn: () => getSubscription()
  })

  console.log('subscription132', subscription)

  // const addOnUserCost = 300;
  const [addOnUserCost, setaddOnUserCost] = useState<any>(0)
  console.log('addOnUserCost', addOnUserCost)
  const [isYearly, setIsYearly] = useState(true)
  const [country, setCountry] = useState('IN')
  const router = useRouter()
  const [userCount, setUserCountRaw] = useState(0)

  const [currentPricing, setCurrentPricing] = useState<any>('')
  const [updatedPrice, setUpdatedPrice] = useState<any>(null)
  console.log('currentPricing', currentPricing)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [finalCost, setFinalCost] = useState<any>(null)
  const [targetPlan, setTargetPlan] = useState<any>(null)
  const [allPlans, setAllPlans] = useState<any>(null)
  console.log('selectedPlan', selectedPlan)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const saved = useSelector((state: RootState) => state.currentOrg)
  const stripePromise = getStripe()
  // const { user } = useAuth()
  const [loading, setLoading] = useState({
    planType: '',
    loading: false
  })

  console.log('this will be loading', loading)
  // Fetch pricing data using React Query
  const { data: pricingData } = useQuery({
    queryKey: ['pricing'],
    queryFn: async () => {
      const res = await fetch('/api/configuration/allByType?type=NEW_PRICING')
      console.log(res.json())
      return res.json()
    }
  })

  useEffect(() => {
    const fetchPricing = async () => {
      const trialPricing = await getConfigByType('NEW_PRICING')
      // Do something with trialPricing here
      console.log('1222222', trialPricing)
      setAllPlans(trialPricing)
    }

    fetchPricing()
  }, [])

  // Fetch country data using React Query
  const { data: countryData } = useQuery({
    queryKey: ['country'],
    queryFn: async () => {
      const res = await fetch(
        `https://ipinfo.io/json?token=${process.env.NEXT_PUBLIC_IPINFO_TOKEN}`
      )
      const data = await res.json()
      setCountry(data.country)
      return data
    }
  })

  const getUserPlanValue = (currentCount: any) => {
    const userWord = numberToWordMap[currentCount]
    const planParts = targetPlan.split('_')

    const planKeyBase = planParts.slice(0, -1).join('_') // e.g., STANDARD_YEARLY
    const dynamicKey = `${planKeyBase}_${userWord}` // e.g., STANDARD_YEARLY_TWO
    const staticKey = `STANDARD_YEARLY_FOUR`

    const planToUse = allPlans.filter((item: any) => item.key == dynamicKey)

    if (planToUse[0]) {
      setaddOnUserCost(Number(planToUse[0]?.value))
    }
    // return String(planToUse.value)
  }

  const setUserCount = (newCount: any) => {
    if (newCount >= 1 && newCount <= 4) {
      setUserCountRaw(newCount)
    }
  }
  const addOnTotal = userCount * addOnUserCost
  console.log('addOnTotal', addOnTotal)

  const getPlanPrice = (planKey: string) => {
    if (!pricingData) return '0'
    const plan = pricingData.find(
      (item: PricingData) =>
        item.key === (isYearly ? `${planKey}_YEARLY` : planKey)
    )
    return plan?.value || '0'
  }

  // const handleUpgrade = async (planType: string) => {
  //   try {
  //     if (country !== 'IN') {
  //       await handleStripeUpgrade(planType)
  //       return
  //     }

  //     const currentOrganization = await getCurrentOrganization()
  //     const result = await createUserSubscription({
  //       organizationId: currentOrganization?.id,
  //       planType,
  //       referralCode: 'string',
  //       email: 'string',
  //       contactNumber: 'string'
  //     })

  //     if (!result?.subscriptionId) {
  //       showCustomToast('Error', 'Subscription ID not found!', 'error', 5000)
  //       return
  //     }

  //     const options = {
  //       key: process.env.NEXT_PUBLIC_RAZORPAY,
  //       order_id: result.subscriptionId,
  //       name: 'Sharkdom',
  //       description: `${planType} Subscription`,
  //       handler: async (response: any) => {
  //         const paymentResult = await verifyPayment(response)
  //         if (paymentResult) {
  //           showCustomToast('Success', 'Payment successful!', 'success', 5000)
  //         } else {
  //           showCustomToast('Error', 'Payment failed. Please try again.', 'error', 5000)
  //         }
  //       },
  //       prefill: {
  //         email: currentOrganization?.primaryEmail,
  //         contact: '+91 9000000001'
  //       },
  //       readonly: { email: true, contact: true },
  //       theme: { color: '#3399cc' }
  //     }

  //     const paymentObject = new window.Razorpay(options)
  //     paymentObject.open()
  //   } catch (error) {
  //     showCustomToast('Error',
  //       error instanceof Error ? error.message : 'An unknown error occurred'
  //     , 'error', 5000)
  //   }
  // }

  // const handleStripeUpgrade = async (planType: string) => {
  //   const stripe = await stripePromise
  //   if (!stripe) throw new Error('Stripe initialization failed.')

  //   const currentOrganization = await getCurrentOrganization()
  //   const session = await createStripeCheckout({
  //     organizationId: currentOrganization?.id,
  //     planType,
  //     currency: 'USD',
  //     amount: getPlanPrice(planType)
  //   })

  //   if (!session.sessionId) {
  //     showCustomToast('Error', 'Failed to create Stripe Checkout session.', 'error', 5000)
  //     return
  //   }

  //   const { error } = await stripe.redirectToCheckout({
  //     sessionId: session.sessionId
  //   })

  //   if (error) showCustomToast('Error', 'Stripe Checkout Error: ${error.message}', 'error', 5000)
  // }

  const handleUpgrade = async (currentPlan: string, planType: string) => {
    setLoading({ planType: planType, loading: true })

    try {
      const session = await upgradeUserSubscription({
        subscriptionId: String(subscription[0].subscriptionId),
        planType,
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/plans`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/plans`
      })

      console.log('this is session', session)

      if (session?.url) {
        setLoading({ planType: planType, loading: false })
        router.push(`${session?.url}`)
      } else {
        setLoading({ planType: planType, loading: false })
        showCustomToast(
          'Error',
          'Failed to create Stripe Checkout session.',
          'error',
          5000
        )
      }
    } catch (error) {
      setLoading({ planType: planType, loading: false })
      showCustomToast(
        'Error',
        error instanceof Error ? error.message : 'An unknown error occurred',
        'error',
        5000
      )
    }
  }

  const handleStartTrialClick = (plan: any, cost: any) => {
    setFinalCost(cost)
    setSelectedPlan(plan)
    setShowConfirmation(true)
  }

  const handleStripeUpgradePlan = async (planType: string) => {
    const currentOrganization = await getCurrentOrganization()
    const { user } = await getServerUser()
    setLoading({ planType: planType, loading: true })
    const stripe = await stripePromise

    if (!stripe) {
      setLoading({ planType: planType, loading: false })
      throw new Error('Stripe initialization failed.')
    }

    // Make an API call to create a checkout session
    const session = await createStripeCustomerCheckout({
      userId: user?.uid,
      planType,
      trailDays: 0,
      mode: 'SUBSCRIPTION',
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/explore`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/plans`,
      couponCode: ''
    })

    console.log({ session })

    if (!session.sessionId) {
      setLoading({ planType: planType, loading: false })
      showCustomToast(
        'Error',
        'Failed to create Stripe Checkout session.',
        'error',
        5000
      )
      return
    }

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.sessionId
    })

    if (error) {
      setLoading({ planType: planType, loading: false })
      showCustomToast(
        'Error',
        'Stripe Checkout Error: ${error.message}',
        'error',
        5000
      )
    } else {
      setLoading({ planType: planType, loading: false })
      showCustomToast('Success', 'Payment successful!', 'success', 5000)
      router.push('/getting-started')
    }
  }
  const renderPlanCard = (
    planKey: string,
    isPopular = false,
    getPlanFunction: (
      region: Region | null,
      isYearly: boolean
    ) => number | undefined
  ) => {
    const plan = PLAN_FEATURES[planKey]
    const price = getPlanPrice(planKey)
    const currentPlanType = subscription[0]?.price.planType

    const rawPlan = currentPlanType?.split('_')[0]
    const currentPlan = rawPlan === 'ENTERPRISE' ? 'ELITE' : rawPlan

    const isNoPlan = !currentPlanType
    const isCurrentPlan = currentPlan === planKey

    const planKeys = Object.keys(PLAN_FEATURES)
    const currentPlanIndex = planKeys.indexOf(currentPlan)
    const thisPlanIndex = planKeys.indexOf(planKey)
    const isHigherPlan = thisPlanIndex > currentPlanIndex
    const isLowerPlan = thisPlanIndex < currentPlanIndex

    return (
      <>
        <div
          key={planKey}
          className={`relative flex w-full max-w-[300px] flex-col rounded-lg border ${
            isPopular
              ? 'rounded-t-none border-[2px] border-primary-light-blue bg-[#2563EB] shadow-lg'
              : 'border border-text-30'
          }`}
        >
          {isPopular && (
            <div
              style={{ border: '2px solid #2563EB', color: 'black' }}
              className='absolute -left-[2px] -right-[2px] -top-[30px] rounded-t-lg bg-white px-2 py-1.5 text-center text-shark-sm font-bold text-white'
            >
              Most Popular
            </div>
          )}
          <div className='flex h-full flex-col justify-between p-6'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col gap-8'>
                <div className='flex flex-col gap-1'>
                  <h3
                    style={{ color: isPopular ? '#F5E4E4' : '' }}
                    className='text-shark-xl font-bold text-[#18181B]'
                  >
                    {plan.title}
                  </h3>
                  <p
                    style={{ color: isPopular ? '#F5E4E4' : '' }}
                    className='text-shark-sm text-[#18181B]'
                  >
                    {plan.subtitle}
                  </p>
                </div>
                <div
                  style={{ color: isPopular ? '#F5E4E4' : '' }}
                  className='flex flex-col gap-1'
                >
                  <span
                    style={{ color: isPopular ? '#F5E4E4' : '' }}
                    className='inline-flex items-baseline text-shark-3xl/9 font-bold text-text-100'
                  >
                    {country === 'IN' ? '₹' : '$'}
                    {getPlanFunction(
                      country === 'IN' ? 'India' : 'US',
                      isYearly
                    )}{' '}
                    <span className='text-shark-sm'>/month</span>
                  </span>
                  <span
                    style={{ color: isPopular ? '#F5E4E4' : '' }}
                    className='text-shark-xs font-normal text-text-90'
                  >
                    upto{' '}
                    {planKey === 'FREE_TRIAL' || planKey === 'STANDARD'
                      ? '1'
                      : '2'}{' '}
                    users per month
                  </span>
                </div>
              </div>
              <ul className='space-y-3'>
                <p
                  style={{ color: isPopular ? '#F5E4E4' : '' }}
                  className='text-shark-sm font-semibold'
                >
                  {planKey === 'STANDARD'
                    ? 'All free features, plus:'
                    : planKey === 'PREMIUM'
                      ? 'All Standard features, plus:'
                      : planKey === 'ELITE'
                        ? 'All Premium features, plus:'
                        : ''}
                </p>
                {plan.features.map((feature) => (
                  <li key={feature} className='flex items-center gap-4'>
                    <Check
                      style={{ color: isPopular ? '#F5E4E4' : '' }}
                      className='h-6 w-6 shrink-0 text-primary'
                    />
                    <span
                      style={{ color: isPopular ? '#F5E4E4' : '' }}
                      className='text-shark-sm font-normal text-[#18181B]'
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Button rendering logic */}

            {showConfirmation &&
            selectedPlan &&
            subscription &&
            planKey == selectedPlan ? (
              <div>
                {!isLowerPlan && (
                  <div className='mt-6'>
                    <Button
                      className={cn(
                        'mt-6 w-full font-bold',
                        isNoPlan
                          ? 'text-primary-light-blue hover:bg-primary-light-blue hover:text-white'
                          : isCurrentPlan
                            ? 'text-text-50'
                            : 'text-primary-light-blue hover:bg-primary-light-blue hover:text-white'
                      )}
                      variant='outline'
                      disabled={!isNoPlan && isCurrentPlan}
                      loading={
                        country === 'US'
                          ? loading.planType ===
                              `${planKey === 'ELITE' ? 'ENTERPRISE' : planKey}_${
                                isYearly ? 'YEARLY_US' : 'MONTHLY_US'
                              }` && loading.loading
                          : loading.planType ===
                              `${planKey === 'ELITE' ? 'ENTERPRISE' : planKey}_${
                                isYearly ? 'YEARLY_INR' : 'MONTHLY_INR'
                              }` && loading.loading
                      }
                      onClick={() => {
                        setCurrentPricing(
                          getPlanFunction(
                            country === 'IN' ? 'India' : 'US',
                            isYearly
                          )
                        )
                        handleStartTrialClick(
                          planKey === 'ELITE' ? 'ENTERPRISE' : planKey,
                          getPlanFunction(
                            country === 'IN' ? 'India' : 'US',
                            isYearly
                          )
                        )
                        const targetPlanType = `${
                          planKey === 'ELITE' ? 'ENTERPRISE' : planKey
                        }_${
                          isYearly
                            ? country === 'US'
                              ? 'YEARLY_US'
                              : 'YEARLY_INR'
                            : country === 'US'
                              ? 'MONTHLY_US'
                              : 'MONTHLY_INR'
                        }`

                        setTargetPlan(targetPlanType)
                        handleStripeUpgradePlan(targetPlan)

                        // if (isNoPlan || isLowerPlan || isCurrentPlan) {
                        //     handleStripeUpgradePlan(targetPlanType)
                        // } else {
                        //     handleUpgrade(currentPlan, targetPlanType)
                        // }
                      }}
                    >
                      Continue to pay
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {!isLowerPlan && (
                  <div className='mt-6'>
                    <Button
                      className={cn(
                        'mt-6 w-full font-bold',
                        isNoPlan
                          ? 'text-primary-light-blue hover:bg-primary-light-blue hover:text-white'
                          : isCurrentPlan
                            ? 'text-text-50'
                            : 'text-primary-light-blue hover:bg-primary-light-blue hover:text-white'
                      )}
                      variant='outline'
                      disabled={!isNoPlan && isCurrentPlan}
                      loading={
                        country === 'US'
                          ? loading.planType ===
                              `${planKey === 'ELITE' ? 'ENTERPRISE' : planKey}_${
                                isYearly ? 'YEARLY_US' : 'MONTHLY_US'
                              }` && loading.loading
                          : loading.planType ===
                              `${planKey === 'ELITE' ? 'ENTERPRISE' : planKey}_${
                                isYearly ? 'YEARLY_INR' : 'MONTHLY_INR'
                              }` && loading.loading
                      }
                      onClick={() => {
                        setCurrentPricing(
                          getPlanFunction(
                            country === 'IN' ? 'India' : 'US',
                            isYearly
                          )
                        )
                        handleStartTrialClick(
                          planKey === 'ELITE' ? 'ENTERPRISE' : planKey,
                          getPlanFunction(
                            country === 'IN' ? 'India' : 'US',
                            isYearly
                          )
                        )
                        const targetPlanType = `${
                          planKey === 'ELITE' ? 'ENTERPRISE' : planKey
                        }_${
                          isYearly
                            ? country === 'US'
                              ? 'YEARLY_US'
                              : 'YEARLY_INR'
                            : country === 'US'
                              ? 'MONTHLY_US'
                              : 'MONTHLY_INR'
                        }`

                        setTargetPlan(targetPlanType)

                        // if (isNoPlan || isLowerPlan || isCurrentPlan) {
                        //     handleStripeUpgradePlan(targetPlanType)
                        // } else {
                        //     handleUpgrade(currentPlan, targetPlanType)
                        // }
                      }}
                    >
                      {isNoPlan
                        ? 'Get Started'
                        : isCurrentPlan
                          ? 'Current Plan'
                          : 'Upgrade'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <div className='py-12'>
      <div className='mt-10 flex w-full justify-between px-[10%]'>
        <p className='flex items-center text-xl font-semibold'>
          <FullLogo className='h-6 w-full sm:h-8' />
        </p>

        <div className='flex items-center gap-4'>
          <p className='flex items-center text-sm font-bold'>Facing issues?</p>

          <a
            href='mailto: office@sharkdom.com'
            className='flex cursor-pointer items-center gap-1 text-sm font-semibold text-[#3E50F7] hover:underline'
          >
            <Phone color='#3E50F7' size={16} />
            Contact us
          </a>
        </div>
      </div>
      <div className='mb-8 flex justify-center gap-4 p-7'>
        <span className={cn('text-sm', !isYearly && 'text-primary')}>
          Monthly
        </span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className={cn('text-sm', isYearly && 'text-primary')}>
          Yearly
        </span>
      </div>

      <div className='mb-8 flex justify-center gap-4 p-7'>
        {subscription && (
          <div
            className={
              showConfirmation && selectedPlan
                ? 'relative mx-auto grid max-w-screen-xl gap-2 md:grid-cols-2 lg:grid-cols-4'
                : 'relative mx-auto grid max-w-screen-xl gap-10 md:grid-cols-2 lg:grid-cols-3'
            }
          >
            {/* {renderPlanCard('FREE_TRIAL', false, getFreePrice)} */}
            {renderPlanCard('STANDARD', false, getStandardPrice)}
            {renderPlanCard('PREMIUM', true, getPremiumPrice)}
            {renderPlanCard('ELITE', false, getElitePrice)}
            {showConfirmation && selectedPlan && subscription && (
              <div
                style={{ border: '2px solid #3E50F7' }}
                className='w-80 rounded-2xl border  p-6'
              >
                <h2
                  style={{ fontSize: '20px' }}
                  className='mb-4 text-lg font-semibold'
                >
                  Summary
                </h2>

                {/* Premium Plan */}
                <div className='mb-4'>
                  <h3
                    style={{ color: '#696969', fontSize: '20px' }}
                    className='text-md font-semibold'
                  >
                    {selectedPlan} Plan
                  </h3>
                  <div className='mt-1 flex justify-between text-sm text-gray-600'>
                    <span>Cost/user/month</span>
                    <span>₹{finalCost}</span>
                  </div>
                  <div className='mt-1 flex justify-between text-sm text-gray-600'>
                    <span>Discount</span>
                    <span>- ₹{Number(finalCost) - Number(currentPricing)}</span>
                  </div>
                </div>

                <hr className='my-4' />

                {/* Add-on Users */}
                <div className='mb-4'>
                  <h3
                    style={{ color: '#696969', fontSize: '18px' }}
                    className='text-md mb-1 font-semibold'
                  >
                    Add-on users
                  </h3>
                  <div className='flex items-center justify-between text-sm text-gray-700'>
                    <div className='flex items-center gap-2'>
                      <span>₹{addOnUserCost.toFixed(2)} X</span>
                      <div className='flex items-center gap-2 px-2 py-1'>
                        <button
                          onClick={() => {
                            getUserPlanValue(userCount - 1)
                            setUserCount(userCount - 1)
                          }}
                          className='text-gray-600 hover:text-black'
                          style={{
                            border: '1px solid #696969',
                            borderRadius: '4px',
                            color: '#1D4ED8',
                            padding: '2px'
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{userCount}</span>
                        <button
                          onClick={() => {
                            getUserPlanValue(userCount + 1)
                            setUserCount(userCount + 1)
                          }}
                          className='text-gray-600 hover:text-black'
                          style={{
                            border: '1px solid #696969',
                            borderRadius: '4px',
                            color: '#1D4ED8',
                            padding: '2px'
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <span>₹{addOnTotal.toFixed(2)}</span>
                  </div>
                </div>

                <hr className='my-4' />

                {/* Pricing Breakdown */}
                <div className='space-y-2 text-sm text-gray-700'>
                  <div className='flex justify-between font-medium font-semibold'>
                    <span style={{ color: '#696969', fontSize: '18px' }}>
                      Subtotal
                    </span>
                    <span>₹{Number(currentPricing) + Number(addOnTotal)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>GST</span>
                    <span>
                      ₹
                      {(
                        (Number(currentPricing) + Number(addOnTotal)) *
                        0.18
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className='mt-1 flex justify-between text-base font-semibold text-green-600'>
                    <span style={{ color: '#696969', fontSize: '18px' }}>
                      Total
                    </span>
                    <span>
                      ₹
                      {(
                        Number(currentPricing) +
                        Number(addOnTotal) +
                        (Number(currentPricing) + Number(addOnTotal)) * 0.18
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    // if (selectedPlan === 'Standard') {
                    //     handleStripeUpgradePlan(
                    //         country === 'IN'
                    //             ? 'STANDARD_MONTHLY_INR'
                    //             : 'STANDARD_MONTHLY_US'
                    //     )
                    // } else if (selectedPlan === 'Premium') {
                    //     handleStripeUpgradePlan(
                    //         country === 'IN'
                    //             ? 'PREMIUM_MONTHLY_INR'
                    //             : 'PREMIUM_MONTHLY_US'
                    //     )
                    // }

                    handleStripeUpgradePlan(targetPlan)
                  }}
                  className='mt-6 w-full rounded-lg bg-primary py-2 font-semibold text-white hover:bg-primary'
                >
                  Continue to pay
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Accordion
        type='single'
        collapsible
        defaultValue='item-0'
        className='w-full rounded-lg border-2 border-gray-200 px-6 py-1'
        style={{ border: '1px solid #0062ff' }}
      >
        <AccordionItem
          value='item-0'
          className='rounded-2xl bg-white hover:no-underline'
        >
          <AccordionTrigger className='flex  w-full text-xl font-semibold text-black hover:no-underline'>
            {/* <div className='flex flex-row items-center justify-between'> */}
            <div className='flex w-full justify-center '>
              <span
                style={{ color: '#0062ff' }}
                className='flex justify-center text-xl font-medium hover:no-underline'
              >
                Click to know more about plans!
              </span>
            </div>
            {/* </div> */}
          </AccordionTrigger>
          <AccordionContent className='text-lg font-medium'>
            <section className='mt-6 flex items-center justify-between rounded-xl bg-[#E6E2FC] px-6 py-4'>
              <div className='flex flex-col gap-1'>
                <h3 className='text-shark-xl font-bold '>
                  Make partnership process more efficient
                </h3>
                <p className='text-shark-sm font-medium'>
                  Choose the plan that’s right for your business. Prior
                  expertise on how the process works needed.
                </p>
              </div>
              <Link
                className='text-shark-sm font-bold text-primary-light-blue'
                href=''
              >
                Learn more
              </Link>
            </section>

            <section className='my-6 mb-10 w-full overflow-hidden rounded-3xl border border-text-30'>
              <table className='w-full table-auto'>
                <thead className='sticky top-[60px] bg-white px-4 py-2.5 lg:relative lg:top-0'>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <th className='w-full self-center px-6 py-3 text-left text-lg font-bold lg:w-1/4'>
                      Core Features (PRM)
                    </th>
                    {pricingTableData.map((plan, index) => (
                      <th
                        key={index}
                        className='flex w-1/4 flex-col items-center justify-between gap-3 py-5 lg:w-[18%] '
                      >
                        <div className='text-shark-base font-bold md:text-shark-lg '>
                          {plan.plan}
                        </div>
                        <div className='flex items-center text-shark-xs font-bold lg:text-shark-sm'>
                          {getCompareCurrencySymbol(
                            country === 'IN' ? 'India' : 'US'
                          )}
                          {plan.plan === 'Free'
                            ? getFreePrice(
                                country === 'IN' ? 'India' : 'US',
                                isYearly
                              )
                            : plan.plan === 'Startup'
                              ? `${getStandardPrice(
                                  country === 'IN' ? 'India' : 'US',
                                  isYearly
                                )}/team`
                              : plan.plan === 'Mid Stage Company'
                                ? `${getPremiumPrice(
                                    country === 'IN' ? 'India' : 'US',
                                    isYearly
                                  )}/team`
                                : `${getElitePrice(
                                    country === 'IN' ? 'India' : 'US',
                                    isYearly
                                  )}/team`}
                        </div>
                        <Link
                          href={'/register'}
                          className='inline-block w-fit rounded-lg bg-[#3E50F7] px-4 py-3 text-shark-sm font-bold text-white'
                        >
                          Get Started
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Active Partners
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.activePartners}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Connected Search
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.connectedSearch ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Offline Partners
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.offlinePartners}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Playground Proposal
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.playgroundProposal}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Reporting
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%] '
                      >
                        {plan.features.reporting ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      AI Copilot
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%] '
                      >
                        {plan.features.aiCopilot ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Partner Alert
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 p-2 text-center lg:w-[18%] lg:px-0 lg:py-3'
                      >
                        {plan.features.partnerAlert ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Automated Proposals
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 p-2 text-center lg:w-[18%] lg:px-0 lg:py-3'
                      >
                        {plan.features.seats ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Seats
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%] '
                      >
                        {plan.features.seats}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Customer Persona
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.customerPersona}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Customer Support
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.customerSupport || (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Referral Program
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.referralProgram}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Partner Enablement
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.partnerEnablement ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Partner Timeline
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%] '
                      >
                        {plan.features.partnerTimeline ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Discoverable
                    </td>
                    {pricingTableData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%] '
                      >
                        {plan.features.discoverable ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </section>

            <section className='my-6 overflow-hidden rounded-3xl border border-text-30'>
              <table className='w-full table-auto'>
                <thead className='sticky top-[60px] bg-white px-4 py-2.5 lg:relative lg:top-0'>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9]'>
                    <th className='w-full self-center px-6 py-3 text-left text-lg font-bold lg:w-1/4'>
                      Integrations
                    </th>
                    {integrationsData.map((plan, index) => (
                      <th
                        key={index}
                        className='flex w-1/4 flex-col items-center justify-between gap-3 py-5 lg:w-[18%]'
                      >
                        <div className='text-shark-base md:text-shark-lg'>
                          {plan.plan}
                        </div>
                        <div className='flex items-center text-shark-xs lg:text-shark-sm'>
                          {getCompareCurrencySymbol(
                            country === 'IN' ? 'India' : 'US'
                          )}
                          {plan.plan === 'Free'
                            ? getFreePrice(
                                country === 'IN' ? 'India' : 'US',
                                isYearly
                              )
                            : plan.plan === 'Startup'
                              ? `${getStandardPrice(
                                  country === 'IN' ? 'India' : 'US',
                                  isYearly
                                )}/team`
                              : plan.plan === 'Mid Stage Company'
                                ? `${getPremiumPrice(
                                    country === 'IN' ? 'India' : 'US',
                                    isYearly
                                  )}/team`
                                : `${getElitePrice(
                                    country === 'IN' ? 'India' : 'US',
                                    isYearly
                                  )}/team`}
                        </div>
                        <Link
                          href={'/register'}
                          className='inline-block w-fit rounded-lg bg-[#3E50F7] px-4 py-3 text-shark-sm font-bold text-white'
                        >
                          Get Started
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className='flex flex-wrap border-b border-text-30 '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      8+ Native Integrations
                    </td>
                    {integrationsData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.nativeIntegrations}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Docusign
                    </td>
                    {integrationsData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.docusign ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Mailchimp
                    </td>
                    {integrationsData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.mailchimp ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Google Meet
                    </td>
                    {integrationsData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.googleMeet ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Zoho CRM
                    </td>
                    {integrationsData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%] '
                      >
                        {plan.features.zohoCRM ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Panda Doc
                    </td>
                    {integrationsData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.pandaDoc ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Google Sheet
                    </td>
                    {integrationsData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.googleSheet ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Calendar Sync
                    </td>
                    {integrationsData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.calendarSync ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Meeting Reminders
                    </td>
                    {integrationsData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.meetingReminders ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      AI Lead Summaries
                    </td>
                    {integrationsData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.aiLeadSummaries ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Mobile App
                    </td>
                    {integrationsData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.mobileApp ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Custom Fields
                    </td>
                    {integrationsData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%] '
                      >
                        {plan.features.customFields ? (
                          <CheckCircle2
                            className='w-full text-center'
                            fill='#1463FF'
                            color='#fff'
                          />
                        ) : (
                          <MinusCircle
                            className='w-full text-center'
                            fill='#BDBDBD'
                            color='#fff'
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='flex flex-wrap border-b border-b-[#D9D9D9] '>
                    <td className='w-full border-r border-text-30 px-4 py-3 font-semibold lg:w-1/4'>
                      Custom Activity Types
                    </td>
                    {integrationsData.map((plan, index) => (
                      <td
                        key={index}
                        className='w-1/4 px-4 py-3 text-center lg:w-[18%]'
                      >
                        {plan.features.customActivityTypes}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </section>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default TrialPricingPage
