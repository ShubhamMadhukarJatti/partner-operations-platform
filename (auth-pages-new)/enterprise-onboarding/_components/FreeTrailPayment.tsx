'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, Phone } from 'lucide-react'

import { getConfigByType } from '@/lib/db/configuration'
import { getCurrentOrganization } from '@/lib/db/organization'
import {
  createStripeCheckout,
  createStripeCustomerCheckout,
  createUserSubscription,
  verifyPayment
} from '@/lib/db/payment'
import { useAuth } from '@/lib/firebase/auth/context'
import { getServerUser } from '@/lib/server'
import { getStripe } from '@/lib/stripe'
import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'
import { FullLogo } from '@/components/icons/logo'

export default function FreeTrailPayment() {
  const router = useRouter()
  const [country, setCountry] = useState('IN')
  const user = useAuth()
  const [standardPricing, setStandardPricing] = useState<string>('')
  const [premiumPricing, setPremiumPricing] = useState<string>('')
  const [standardDiscount, setStandardDiscount] = useState<string>('0')
  const [premiumDiscount, setPremiumDiscount] = useState<string>('0')
  const [loading, setLoading] = useState({
    planType: '',
    loading: false
  })

  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect')

  const stripePromise = getStripe()

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
    console.log({ premiumPricing })

    const getPricingData = async () => {
      const trialPricing = await getConfigByType('NEW_PRICING')

      // console.log(trialPricing.find((plan) => plan.key === 'ENTEPRISE_PRO')?.value)

      setPremiumPricing(
        trialPricing.find((plan) => plan.key === 'ENTEPRISE_PRO')?.value ?? ''
      )
      // setPremiumPricing(
      //   trialPricing.find((plan) => plan.key === 'PREMIUM_TRIAL')?.value ?? ''
      // )
      setPremiumDiscount(
        trialPricing.find((plan) => plan.key === 'PREMIUM_TRIAL_PER')?.value ??
          ''
      )
      setStandardPricing(
        trialPricing.find((plan) => plan.key === 'STANDARD_TRIAL')?.value ?? ''
      )
      setStandardDiscount(
        trialPricing.find((plan) => plan.key === 'STANDARD_TRIAL_PER')?.value ??
          ''
      )
    }

    fetchCountry()
    getPricingData()
  }, [])

  const handleStripeUpgradePlan = async (planType: string) => {
    const { user } = await getServerUser()
    setLoading({ planType: planType, loading: true })
    const currentOrganization = await getCurrentOrganization()

    const stripe = await stripePromise

    if (!stripe) {
      setLoading({ planType: planType, loading: false })
      throw new Error('Stripe initialization failed.')
    }

    // Make an API call to create a checkout session
    const session = await createStripeCustomerCheckout({
      userId: user?.uid,
      planType,
      mode: 'SUBSCRIPTION',
      trailDays: 0,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/explore`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/enterprise-onboarding/onboarding/payment`,
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
      showCustomToast(
        'Error',
        'Stripe Checkout Error: ${error.message}',
        'error',
        5000
      )
      setLoading({ planType: planType, loading: false })
    } else {
      showCustomToast('Success', 'Payment successful!', 'success', 5000)
      // router.push('/getting-started')
      setLoading({ planType: planType, loading: false })
    }
  }

  const handleUpgradePlan = async (planType: string) => {
    try {
      const currentOrganization = await getCurrentOrganization()

      const result = await createUserSubscription({
        organizationId: currentOrganization?.id,
        planType,
        referralCode: '',
        email: currentOrganization?.primaryEmail,
        contactNumber: ''
      })

      console.log(result)

      if (!result?.subscriptionId) {
        showCustomToast('Error', 'Subscription ID not found!', 'error', 5000)
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY,
        order_id: result.subscriptionId,
        name: 'Sharkdom',
        description: `Subscription`,
        handler: async function (response: any) {
          const paymentResult = await verifyPayment(response)
          if (paymentResult) {
            showCustomToast('Success', 'Payment successful!', 'success', 5000)

            router.push('/getting-started')
          } else {
            showCustomToast(
              'Error',
              'Payment failed. Please try again.',
              'error',
              5000
            )
          }
        },
        prefill: {
          email: currentOrganization?.primaryEmail,
          contact: '+91 9000000001'
        },
        readonly: { email: true, contact: true },
        theme: {
          color: '#3399cc'
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()

      paymentObject.on('payment.failed', function () {
        alert('Payment failed. Please try again. Contact support for help')
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        showCustomToast('Error', error.message, 'error', 5000)
      } else {
        showCustomToast('Error', 'An unknown error occurred', 'error', 5000)
      }
    }
  }

  const findWithoutDiscountValue = (price: string, discount: string) => {
    return Math.ceil((Number(price) * 100) / (100 - Number(discount)))
  }

  return (
    <div className='flex w-full flex-col items-center justify-center lg:h-screen'>
      <div className='mt-10 flex w-full justify-between px-[10%]'>
        <p className='fds-text-lead-semibold flex items-center'>
          <FullLogo className='h-6 w-full sm:h-8' />
        </p>

        <div className='flex items-center gap-4'>
          <p className='fds-text-sm flex items-center'>Facing issues?</p>

          <a
            href='mailto: office@sharkdom.com'
            className='fds-text-sm flex cursor-pointer items-center gap-1 text-[#3E50F7] hover:underline'
          >
            <Phone color='#3E50F7' size={16} />
            Contact us
          </a>
        </div>
      </div>

      <p className='fds-text-lead-semibold mt-10 w-full px-[10%] text-left'>
        Select a plan to get started
      </p>
      <div className='mt-10 flex w-full px-[10%]'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 '>
          {/* <div className='flex flex-col gap-6 lg:flex-row'> */}
          {/* Free Trial Section */}

          {/* Premium Trial Section */}
          <div className='flex h-full w-full flex-col justify-between rounded-[20px] border border-[#CCE0FC] bg-[#F8FBFF] text-black shadow-lg  lg:col-span-2 lg:w-[450px]'>
            <div>
              <div
                style={{
                  background: 'linear-gradient(90deg, #E5EFFE 0%, #FFFFFF 100%)'
                }}
                className='flex flex-col justify-between gap-2 rounded-tl-[20px] rounded-tr-[20px] p-6 text-left'
              >
                <div className='flex gap-4'>
                  <h3 className='fds-heading text-text-100'>Enterprise Pro</h3>
                  {/* <p className='w-fit rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#2A3241]'>
                    POPULAR
                  </p> */}
                </div>
                <span className='text-shark-sm text-text-100'>
                  for Mid stage and Enterprises
                </span>
                <div className='mt-6 flex items-center gap-3'>
                  {/* <span className='text-2xl font-normal text-[#5E7193] line-through decoration-slate-500'>
                    {country === 'IN' ? '₹' : '$'}
                    {findWithoutDiscountValue(premiumPricing, premiumDiscount)}
                  </span> */}

                  <p className='flex items-center gap-4 text-2xl font-bold text-text-100'>
                    <span>
                      {country === 'IN' ? '₹' : '$'}
                      {premiumPricing ?? ''}

                      <span className='text-sm font-medium text-[#252424]'>
                        /month
                      </span>
                    </span>
                    {/* <p className='flex items-baseline fds-text-semibold text-[#488D12]'>
                      {premiumDiscount}% off
                    </p> */}
                  </p>
                </div>
              </div>

              <ul className='my-12 px-8 text-left '>
                <li className='flex items-center gap-2 text-base font-normal'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>Upto Five AI proposal generator</span>
                </li>
                <li className='flex items-center gap-2 text-base font-normal'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>Personalized recommendation</span>
                </li>
                {/* <li className='flex items-center gap-2'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>24×7 email support</span>
                </li> */}
                <li className='flex items-center gap-2 text-base font-normal'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>Unrestricted access to Partner Valve Room</span>
                </li>
                <li className='flex items-center gap-2 text-base font-normal'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>Complete Access to meet scheduling tools</span>
                </li>
                <li className='flex items-center gap-2 text-base font-normal'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>Unlimited Access to Integration portal tools</span>
                </li>
              </ul>
            </div>

            <div className='flex justify-start px-6 pb-6'>
              <Button
                loading={
                  loading.planType === 'ENTERPRISE_PRO' && loading.loading
                }
                className=' fds-text-semibold w-full rounded-lg border border-[#ADB7CB] bg-[#3E50F7] text-white '
                // onClick={() => handleUpgradePlan('PREMIUM')}
                onClick={() => {
                  handleStripeUpgradePlan('ENTERPRISE_PRO')
                }}
              >
                PROCEED
              </Button>
            </div>
          </div>

          {/* <section className='col-span-1 flex w-full flex-col items-center justify-center rounded-2xl border-[1.5px] border-[#E4E7EE] bg-white '>
          <div className='space-y-6'>
            <div className='space-y-4 bg-[#F2F5FD] text-center'>
              <h2 className='text-2xl font-bold'>Standard</h2>
              <p className='text-muted-foreground'>Small Companies</p>
              <div className='flex items-center space-y-1'>
                <p className='text-muted-foreground line-through'>₹849</p>
                <p className='text-4xl font-bold'>₹466.95</p>
              </div>
              <p className='text-sm text-muted-foreground'>
                upto 4 users per month
              </p>
              <p className='text-sm text-muted-foreground'>
                Good to get you started with Sharkdom Ecosystem.
              </p>
            </div>

            <div className='space-y-4'>
              <h3 className='font-medium'>Core features:</h3>
              <ul className='space-y-3'>
                <li className='flex items-center gap-2'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>Upto Two AI proposal generator</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>Personalized recommendation</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>24×7 email support</span>
                </li>
              </ul>
            </div>

            <div className='space-y-4 pt-4'>
              <p className='text-center'>Experience the tool free of cost</p>
              <Button
                className='w-full bg-blue-600 text-white hover:bg-blue-700'
                onClick={() => handleUpgradePlan('STANDARD_TRIAL')}
              >
                Continue with Free Trial
              </Button>
            </div>
          </div>
        </section> */}

          {/* Subscribe Section */}
          {/*<section className='col-span-2 flex w-full flex-col items-center justify-center rounded-2xl border-[1.5px] border-[#E4E7EE] bg-slate-50 p-6'>
          <div className='space-y-6'>
            <div className='space-y-4 text-center'>
              <h2 className='text-2xl font-bold'>Premium</h2>
              <p className='text-muted-foreground'>Mid stage Companies</p>
              <div className='flex items-center space-y-1'>
                <p className='text-muted-foreground line-through'>₹2999</p>
                <p className='text-4xl font-bold'>₹1649/month</p>
              </div>
               <p className='text-sm text-muted-foreground'>
                upto 2 users per month
              </p>
              <p className='text-sm text-muted-foreground'>
                Work faster with increased automation and collaboration tools.
              </p>
            </div>

            <div className='space-y-4'>
              <h3 className='font-medium'>All Startup features, plus:</h3>
              <ul className='space-y-3'>
                <li className='flex items-center gap-2'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>Upto Five AI proposal generator</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>Personalized recommendation</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>24×7 email support</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>Unrestricted access to Partner Valve Room</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>Complete Access to meet scheduling tools</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='h-5 w-5 text-blue-600' />
                  <span>Unlimited Access to Integration portal tools</span>
                </li>
              </ul>
            </div>

            <div className='space-y-4 pt-4'>
              <p className='text-center'>
                Subscribe and empower the business now
              </p>
              <Button
                className='w-full bg-blue-600 text-white hover:bg-blue-700'
                onClick={() => handleUpgradePlan('PREMIUM')}
              >
                Subscribe Now
              </Button>
            </div>
          </div>
        </section> */}
        </div>
      </div>
    </div>
  )
}
