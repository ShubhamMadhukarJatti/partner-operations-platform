'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Clock, Info } from 'lucide-react'

import { getAllPlanConfigurations } from '@/lib/db/configuration'
import { getCurrentOrganization } from '@/lib/db/organization'
import { createStripeCustomerCheckout } from '@/lib/db/payment'
import { getServerUser } from '@/lib/server'
import { getStripe } from '@/lib/stripe'
import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'

const plans = [
  {
    id: 1,
    name: 'Partnership Starter',
    price: '₹0',
    period: 'per month',
    details: 'For partner onboarding pack',
    stripePlanInr: 'STANDARD_MONTHLY_INR',
    stripePlanUs: 'STANDARD_MONTHLY_US',
    features: [
      {
        heading: 'Partner Directory',
        subheading: '(Import CSV / HubSpot import)'
      },
      {
        heading: 'Basic Deal Registration',
        subheading: '(manual mapping flow)'
      },
      {
        heading: 'Partner Emails: 1:1 sends',
        subheading: '(3 templates, basic send limits)'
      },
      {
        heading: 'Basic IPP search',
        subheading: '(Ideal Partner profile)'
      },
      { heading: 'Best for upto 4 partners' },
      { heading: 'Basic Persona overlap' },
      { heading: 'Access to 5+ integrations' }
    ],
    trial: 'Trial ends on ',
    cancle: 'Cancel anytime during trial period',
    button: 'Start Free Trial'
  },
  {
    id: 2,
    name: 'Partnership Accelerator',
    price: '₹20',
    period: 'per month',
    details: 'For partner onboarding and management',
    stripePlanInr: 'PREMIUM_MONTHLY_INR',
    stripePlanUs: 'PREMIUM_MONTHLY_US',
    features: [
      { heading: 'Unlimited Deal Registration' },
      {
        heading: 'Unlimited IPP search',
        subheading: '(Ideal Partner profile)'
      },
      { heading: 'Deliverability & Activity tracking' },
      { heading: 'Access to Account Mapping' },
      { heading: 'Advanced analytics & weekly reports' },
      { heading: 'Best for upto 10 partners' },
      { heading: 'Access to 15+ integrations' },
      { heading: '24×7 support' }
    ],

    trial: 'Trial ends on ',
    cancle: 'Cancel anytime during trial period',
    button: 'Start Free Trial'
  },
  {
    id: 3,
    name: 'Partnership Enterprise',
    price: '₹40',
    period: 'per month',
    details: 'Perfect for All in ONE Solution',
    stripePlanInr: 'ENTERPRISE_MONTHLY_INR',
    stripePlanUs: 'ENTERPRISE_MONTHLY_US',
    features: [
      {
        heading: 'Unlimited Deal Registration',
        subheading: '(AI scoring & auto-approval flow)'
      },
      { heading: 'Unlimited IPP search' },
      { heading: 'Access to Account Mapping & Tier creation' },
      { heading: 'Access to Partner-Intent signals' },
      { heading: 'Access to predictive partner-match scoring' },
      { heading: 'Best for over 10 partners' },
      { heading: 'Access to 24+ integrations' },
      { heading: 'Priority 24×7 support' }
    ],

    trial: 'Trial ends on ',
    cancle: 'Cancel anytime during trial period',
    button: 'Start Free Trial'
  }
]

const Pricing = () => {
  const [selected, setSelected] = useState<number>(2) // Default: 2nd plan selected
  const [country, setCountry] = useState('IN')
  const [dynamicPriceData, setDynamicPriceData] = useState<any[]>([])
  const [isLoadingPricing, setIsLoadingPricing] = useState(true)
  const [loading, setLoading] = useState<{
    planType: string
    loading: boolean
  }>({
    planType: '',
    loading: false
  })
  const router = useRouter()
  const stripePromise = getStripe()

  // Fetch pricing data and country
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pricing data
        const pricing = await getAllPlanConfigurations()
        setDynamicPriceData(pricing)
        setIsLoadingPricing(false)

        // Fetch country data - only if token is configured
        const ipinfoToken = process.env.NEXT_PUBLIC_IPINFO_TOKEN
        if (ipinfoToken) {
          try {
            const res = await fetch(
              `https://ipinfo.io/json?token=${ipinfoToken}`
            )
            if (res.ok) {
              const data = await res.json()
              setCountry(data.country)
            } else {
              console.warn('Failed to fetch country data from ipinfo.io')
            }
          } catch (error) {
            console.warn('Error fetching country data:', error)
            // Continue without country data - not critical
          }
        } else {
          // Token not configured - skip country detection
          console.warn(
            'IPINFO_TOKEN not configured, skipping country detection'
          )
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoadingPricing(false)
      }
    }
    fetchData()
  }, [])

  // Helper functions to get dynamic prices
  const getDynamicPrice = (planType: string, region: string) => {
    const regionSuffix = region === 'IN' ? 'INR' : 'US'
    const fullPlanType = `${planType}_${regionSuffix}`

    const planData = dynamicPriceData?.find(
      (item: any) => item.planType === fullPlanType
    )

    return planData?.amount || 0
  }

  const formatPrice = (amount: number, region: string) => {
    const currency = region === 'IN' ? '₹' : '$'
    return `${currency}${amount}`
  }

  // Create dynamic plans based on API data
  const getDynamicPlans = () => {
    if (isLoadingPricing || !dynamicPriceData.length) {
      return plans // Fallback to hardcoded plans
    }

    return [
      {
        id: 1,
        name: 'Partnership Starter',
        price: formatPrice(
          getDynamicPrice('STANDARD_MONTHLY', country),
          country
        ),
        period: 'per month',
        details: 'For partner onboarding pack',
        stripePlanInr: 'STANDARD_MONTHLY_INR',
        stripePlanUs: 'STANDARD_MONTHLY_US',
        features: [
          {
            heading: 'Partner Directory',
            subheading: '(Import CSV / HubSpot import)'
          },
          {
            heading: 'Basic Deal Registration',
            subheading: '(manual mapping flow)'
          },
          {
            heading: 'Partner Emails: 1:1 sends',
            subheading: '(3 templates, basic send limits)'
          },
          {
            heading: 'Basic IPP search',
            subheading: '(Ideal Partner profile)'
          },
          { heading: 'Best for upto 4 partners' },
          { heading: 'Basic Persona overlap' },
          { heading: 'Access to 5+ integrations' }
        ],
        trial: 'Trial ends on ',
        cancle: 'Cancel anytime during trial period',
        button: 'Start Free Trial'
      },
      {
        id: 2,
        name: 'Partnership Accelerator',
        price: formatPrice(
          getDynamicPrice('PREMIUM_MONTHLY', country),
          country
        ),
        period: 'per month',
        details: 'For partner onboarding and management',
        stripePlanInr: 'PREMIUM_MONTHLY_INR',
        stripePlanUs: 'PREMIUM_MONTHLY_US',
        features: [
          { heading: 'Unlimited Deal Registration' },
          {
            heading: 'Unlimited IPP search',
            subheading: '(Ideal Partner profile)'
          },
          { heading: 'Deliverability & Activity tracking' },
          { heading: 'Access to Account Mapping' },
          { heading: 'Advanced analytics & weekly reports' },
          { heading: 'Best for upto 10 partners' },
          { heading: 'Access to 15+ integrations' },
          { heading: '24×7 support' }
        ],
        trial: 'Trial ends on ',
        cancle: 'Cancel anytime during trial period',
        button: 'Start Free Trial'
      },
      {
        id: 3,
        name: 'Partnership Enterprise',
        price: formatPrice(
          getDynamicPrice('ENTERPRISE_MONTHLY', country),
          country
        ),
        period: 'per month',
        details: 'Perfect for All in ONE Solution',
        stripePlanInr: 'ENTERPRISE_MONTHLY_INR',
        stripePlanUs: 'ENTERPRISE_MONTHLY_US',
        features: [
          {
            heading: 'Unlimited Deal Registration',
            subheading: '(AI scoring & auto-approval flow)'
          },
          { heading: 'Unlimited IPP search' },
          { heading: 'Access to Account Mapping & Tier creation' },
          { heading: 'Access to Partner-Intent signals' },
          { heading: 'Access to predictive partner-match scoring' },
          { heading: 'Best for over 10 partners' },
          { heading: 'Access to 24+ integrations' },
          { heading: 'Priority 24×7 support' }
        ],
        trial: 'Trial ends on ',
        cancle: 'Cancel anytime during trial period',
        button: 'Start Free Trial'
      }
    ]
  }

  const handleStripeUpgradePlan = async (planType: string) => {
    setLoading({ planType: planType, loading: true })
    const { user } = await getServerUser()
    const currentOrganization = await getCurrentOrganization()
    const stripe = await stripePromise

    if (!stripe) {
      setLoading({ planType: planType, loading: false })
      throw new Error('Stripe initialization failed.')
    }

    try {
      // Make an API call to create a checkout session
      const session = await createStripeCustomerCheckout({
        userId: user?.uid,
        planType,
        mode: 'SUBSCRIPTION',
        trailDays: 14,
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/explore`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/free-trial/onboarding/payment`,
        couponCode: ''
      })

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
        showCustomToast(
          'Error',
          'Stripe Checkout Error: ${error.message}',
          'error',
          5000
        )
        setLoading({ planType: planType, loading: false })
      } else {
        showCustomToast('Success', 'Payment successful!', 'success', 5000)
        router.push('/getting-started')
        setLoading({ planType: planType, loading: false })
      }
    } catch (error) {
      setLoading({ planType: planType, loading: false })
      showCustomToast(
        'Error',
        'An error occurred while processing payment',
        'error',
        5000
      )
    }
  }

  return (
    <div className='flex justify-center bg-gray-50 bg-white px-4 py-10'>
      {isLoadingPricing ? (
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
            <p className='text-gray-600'>Loading pricing...</p>
          </div>
        </div>
      ) : (
        <div className='grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3'>
          {getDynamicPlans().map((plan) => {
            const isSelected = selected === plan.id

            return (
              <div
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`relative flex cursor-pointer flex-col rounded-2xl border p-4 transition-all duration-300 ${
                  isSelected
                    ? 'scale-102 border-[#3E50F7] bg-[#F2F2FD] '
                    : 'border-gray-200 '
                }`}
              >
                {isSelected && (
                  <span className='absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white'>
                    Selected
                  </span>
                )}
                <div
                  className={`flex flex-col justify-center border-b pb-6 text-center transition-colors ${
                    isSelected ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <h3 className='text-lg font-semibold'>{plan.name}</h3>
                  <p className='flex min-h-[40px] items-center justify-center pt-1 text-sm text-[#717182]'>
                    {plan?.details}
                  </p>
                  <p className='pt-6 text-3xl font-bold'>
                    {plan.price}
                    <span className='text-sm font-normal text-[#717182]'>
                      /{plan.period}
                    </span>
                  </p>
                </div>

                <ul className='mt-4 flex-1 space-y-3'>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className='flex items-start gap-2 text-sm'>
                      <span className='mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500'>
                        <Check className='h-3 w-3 text-white' />
                      </span>
                      <div className='pt-2'>
                        <p className='text-sm font-medium'>
                          {feature?.heading}
                        </p>
                        <p className='text-sm text-[#717182]'>
                          {feature?.subheading}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className='m-2 flex flex-col items-center gap-2 rounded-lg bg-[#F0F2F2] py-4 text-center'>
                  <p className='flex items-center gap-2 text-xs text-gray-500'>
                    <Info className='h-4 w-4 text-gray-500' />
                    {plan.trial}
                    {new Date(
                      new Date().setDate(new Date().getDate() + 14)
                    ).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className='flex items-center gap-2 text-xs text-gray-500'>
                    <Clock className='h-4 w-4 text-gray-600' />
                    {plan.cancle}
                  </p>
                </div>

                <Button
                  variant={isSelected ? undefined : 'outline'}
                  className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isSelected
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : ' border-blue-700 bg-white text-blue-600'
                  }`}
                  loading={
                    (loading.planType === plan.stripePlanInr ||
                      loading.planType === plan.stripePlanUs) &&
                    loading.loading
                  }
                  onClick={() => {
                    const planType =
                      country === 'IN' ? plan.stripePlanInr : plan.stripePlanUs
                    handleStripeUpgradePlan(planType)
                  }}
                >
                  {plan.button}
                  <ArrowRight
                    className={`h-4 w-4 transition ${
                      isSelected ? 'text-white' : 'text-blue-600'
                    }`}
                  />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Pricing
