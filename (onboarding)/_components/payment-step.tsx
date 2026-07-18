'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, IndianRupee } from 'lucide-react'

import { getCurrentOrganization } from '@/lib/db/organization'
import { createUserSubscription, verifyPayment } from '@/lib/db/payment'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'

type Props = {}

const OnboardingPayment = (props: Props) => {
  const router = useRouter()

  const handleUpgradePlan = async (planType: string) => {
    try {
      const currentOrganization = await getCurrentOrganization()

      const result = await createUserSubscription({
        organizationId: currentOrganization?.id,
        planType,
        referralCode: 'string',
        email: 'string',
        contactNumber: 'string'
      })

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

  return (
    <section className=' bottom-0  flex w-full  justify-center bg-background-ghost-white  lg:fixed      '>
      <div className='mt-12 w-fit'>
        <div className='flex  w-full flex-wrap items-center  gap-10 lg:flex-row lg:items-end  lg:gap-0'>
          {/* Standard Plan */}
          <div className=' flex h-full w-full max-w-md flex-col justify-between rounded-3xl border border-[#E4E7EE] bg-white p-6 text-black shadow-lg lg:max-w-[300px]  lg:rounded-b-none lg:rounded-tl-3xl lg:rounded-tr-none '>
            <div>
              <div className='flex flex-col justify-between gap-2 text-left'>
                <h3 className='fds-heading text-text-100'>STANDARD</h3>
                <span className='text-shark-sm text-text-100'>
                  Small Companies
                </span>
                <span className='fds-text-lead-semibold text-gray-400 line-through decoration-slate-500'>
                  ₹1599
                </span>
                <p className='flex items-baseline text-5xl font-bold text-text-100'>
                  <IndianRupee strokeWidth={3} size={20} />
                  849
                </p>
              </div>
              <p className='mb-4 mt-2 text-left text-shark-sm text-text-100'>
                upto 2 users per month
              </p>
              <p className='py-2 text-left text-shark-xs text-text-80'>
                Don’t let deals slip through the cracks. Organize and find
                opportunities, and manage all your communication within
                Sharkdom.
              </p>
              <ul className='my-4 text-left'>
                <li className='fds-text-sm pb-2 text-text-100'>
                  Core features:
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  Up to Two AI proposal generators
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  Personalized recommendations
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  24×7 email support
                </li>
              </ul>
            </div>

            <div className='flex justify-center'>
              <Button
                variant={'ghost'}
                className={cn(
                  'fds-text-lead-semibold w-fit rounded-xl bg-[#0062F1] px-16 py-2 text-white '
                )}
                onClick={() => handleUpgradePlan('STANDARD')}
              >
                Upgrade
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className='flex h-full w-full max-w-md flex-col justify-between rounded-3xl border border-[#E4E7EE] bg-white p-6 text-black shadow-lg lg:max-w-[360px]  lg:rounded-b-none lg:rounded-t-3xl '>
            <div>
              <div className='flex flex-col justify-between gap-2 text-left'>
                <span className='fds-text-sm mb-6 w-fit rounded-full bg-[#E5EFFE] px-4 py-1 uppercase'>
                  Most Popular
                </span>
                <h3 className='fds-heading text-text-100'>PREMIUM</h3>
                <span className='text-shark-sm text-text-100'>
                  Mid Stage Companies
                </span>
                <span className='fds-text-lead-semibold text-gray-400 line-through decoration-slate-500'>
                  ₹2999
                </span>
                <p className='flex items-baseline text-5xl font-bold text-text-100'>
                  <IndianRupee strokeWidth={3} size={20} />
                  1649
                </p>
              </div>
              <p className='mb-4 mt-2 text-left text-shark-sm text-text-100'>
                upto 2 users per month
              </p>
              <p className='py-2 text-left text-shark-xs text-text-80'>
                Work faster with increased automation and collaboration tools.
              </p>
              <ul className='my-4 text-left'>
                <li className='fds-text-sm pb-2 text-text-100'>
                  All Startup features, plus:
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  Upto Five AI proposal generator
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  Personalized recommendations
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  24×7 email support
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  Unrestricted access to Partner Valve Room
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  Complete Access to meet scheduling tools
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  Unlimited Access to Integration portal tools
                </li>
              </ul>
            </div>

            <div className='flex justify-center'>
              <Button
                variant={'ghost'}
                className={cn(
                  'fds-text-lead-semibold w-fit rounded-xl bg-[#0062F1] px-16 py-2 text-white '
                )}
                onClick={() => handleUpgradePlan('PREMIUM')}
              >
                Upgrade
              </Button>
            </div>
          </div>

          {/* elite plan */}

          <div className='flex h-full max-w-md flex-col justify-between rounded-3xl border border-[#E4E7EE] bg-white p-6 text-black shadow-lg lg:max-w-[340px]  lg:rounded-b-none lg:rounded-tl-none lg:rounded-tr-3xl '>
            <div>
              <div className='flex flex-col justify-between gap-2 text-left'>
                <h3 className='fds-heading text-text-100'>ELITE</h3>
                <span className='text-shark-sm text-text-100'>Enterprices</span>
                <span className='fds-text-lead-semibold text-gray-400 line-through decoration-slate-500'>
                  ₹7999
                </span>
                <p className='flex items-baseline text-5xl font-bold text-text-100'>
                  <IndianRupee strokeWidth={3} size={20} />
                  4599
                </p>
              </div>
              <p className='mb-4 mt-2 text-left text-shark-sm text-text-100'>
                upto 9 users per month
              </p>
              <p className='py-2 text-left text-shark-xs text-text-80'>
                Built for fast-growing teams looking for enhanced customization
                and collaboration tools.
              </p>
              <ul className='my-4 text-left'>
                <li className='fds-text-sm pb-2 text-text-100'>
                  All Professional features, plus:
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  Unlimited AI proposal generator
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  Personalized recommendations
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  24×7 email support
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  Unrestricted access to Partner Valve Room
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  Complete Access to meet scheduling tools
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  Unlimited Access to Integration portal tools
                </li>
                <li className='flex items-start gap-1 pb-2 text-shark-xs'>
                  <CheckCircle2 fill='#1463FF' color='#fff' size={20} />
                  Quaterly Check-ins
                </li>
              </ul>
            </div>

            <div className='flex justify-center'>
              <Button
                variant={'ghost'}
                className={cn(
                  'fds-text-lead-semibold w-fit rounded-xl bg-[#0062F1] px-16 py-2 text-white '
                )}
                onClick={() => handleUpgradePlan('ELITE')}
              >
                Upgrade
              </Button>
            </div>
          </div>
        </div>

        {/* <div className='mt-4 w-full rounded-3xl bg-black px-6 py-10 lg:mt-0 lg:rounded-b-3xl lg:rounded-t-none lg:p-8'>
          <p className='text-left fds-heading text-white'>
            Make partnership process more efficient
          </p>
          <p className='text-left text-sm text-slate-300'>
            Choose the plan that&apos;s right for your business. Prior expertise
            on how the process works needed. Learn more
          </p>
        </div> */}
      </div>
    </section>
  )
}

export default OnboardingPayment
