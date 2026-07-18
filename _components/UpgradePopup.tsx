'use client'

import { useState } from 'react'
import { storeOrganizationData } from '@/redux/reducers/organization'
import { OrganizationType } from '@/types'
import { createUserSubscription, verifyPayment } from '@db/payment'
import { IndianRupee, Loader } from 'lucide-react'
import { useDispatch } from 'react-redux'

import { pricing_plans } from '@/config/data'
import { getCurrentOrganization } from '@/lib/db/organization'
import { useUpgradeStore } from '@/lib/stores/useUpgradeModalStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { showCustomToast } from '@/components/custom-toast'

// import { getOrganizationMappingsByUserId } from '@db/organization'

const UpgradePopup = ({
  openUpgradePopup,
  closeUpgradePopup,
  currentOrganization
}: {
  openUpgradePopup: boolean
  closeUpgradePopup: (openUpgradePopup: boolean) => void
  currentOrganization?: OrganizationType | null
}) => {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null)

  const { pricing } = useUpgradeStore()

  const dispatch = useDispatch()
  const subscribePlan = async (planType: string) => {
    try {
      setLoadingIndex(
        pricing_plans.findIndex((plan) => plan.title === planType)
      )

      const result = await createUserSubscription({
        organizationId: currentOrganization?.id,
        planType,
        referralCode: 'string',
        email: 'string',
        contactNumber: 'string'
      })

      console.log(result)

      if (!result?.subscriptionId) {
        showCustomToast('Error', 'Subscription ID not found!', 'error', 5000)
        return
      }

      // if (!razorpayInstance) {
      //   showCustomToast('Error', 'Razorpay is not initialized!', 'error', 5000)
      //   return
      // }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY, // Replace with your actual Razorpay key
        order_id: result.subscriptionId,
        name: 'Sharkdom',
        description: `${planType} Subscription`,
        handler: async function (response: any) {
          const paymentResult = await verifyPayment(response)
          if (paymentResult) {
            showCustomToast('Success', 'Payment successful!', 'success', 5000)
            const currentOrganization = await getCurrentOrganization()
            dispatch(storeOrganizationData({ currentOrganization }))
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
        // notes: {
        //   address: 'Your Company Address'
        // },
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
    } finally {
      setLoadingIndex(null)
    }
  }

  return (
    <Dialog
      open={openUpgradePopup}
      onOpenChange={() => closeUpgradePopup(false)}
    >
      <DialogContent className='max-w-7xl space-y-2'>
        <div className='flex h-max justify-center'>
          <section
            id='pricing'
            className={cn('flex flex-col items-center gap-12 py-10 lg:gap-16')}
          >
            <div className={cn('flex px-2')}>
              <div className='flex flex-col'>
                {/* <div className='flex justify-center'>
                  <p className='text-lg font-semibold'>Monthly</p>
                  <Switch className='mx-3' />
                  <p className='text-lg font-semibold'>Yearly</p>
                  <Badge className='ml-3 h-8 border-primary bg-white text-primary hover:bg-white'>
                    35% off
                  </Badge>
                </div> */}
                <p className='my-5 text-2xl font-bold'>
                  Make partnership process more efficient
                </p>
                <p className='my-2'>
                  Choose the plan that’s right for your business. Prior
                  expertise on how the process works needed
                  <span className='ml-2 text-primary'>Learn more</span>
                </p>
                <div className='mt-20 bg-[#B5E5FF] px-3 pb-20'>
                  <p className='my-5 text-right text-black'>Highlights</p>
                </div>
              </div>

              {pricing_plans.map((plan, index) => {
                const {
                  title,
                  price: oldPrice,

                  extraFeatures,
                  longDescription,
                  highlights
                } = plan
                if (index === 0) return null

                const matchedPricing = pricing.find(
                  (p) => p.key === title.toUpperCase()
                )
                const price = matchedPricing ? matchedPricing.value : oldPrice

                return (
                  <div
                    key={index}
                    className='mx-2 flex flex-col items-center gap-10 rounded-sm border border-[#D4D4D4] bg-[#FFFFFF] px-5 '
                  >
                    <div className='mt-10'>
                      <p className='text-center font-bold capitalize'>
                        {title.toLowerCase()}
                      </p>

                      <p className='my-4 text-center'>
                        <span className='text-3xl font-bold'>
                          <IndianRupee
                            className='inline'
                            size={26}
                            fontWeight={800}
                          />
                          {price}
                          <span className='ml-1 text-base font-medium text-muted-foreground'>
                            /mo
                          </span>
                        </span>
                      </p>

                      <p className='text-center text-sm font-medium'>
                        {longDescription}
                      </p>
                    </div>

                    <Button
                      className='rounded-sm px-7 py-4'
                      disabled={loadingIndex === index}
                      onClick={async () => {
                        closeUpgradePopup(false)
                        setLoadingIndex(index)
                        await subscribePlan(title)
                      }}
                    >
                      {loadingIndex === index ? (
                        <Loader size={14} className='' />
                      ) : (
                        'Get Started'
                      )}
                    </Button>

                    <ul className='mb-6 mt-1 flex flex-col gap-4 text-[#475467]'>
                      {highlights.map((highlight, index) => (
                        <li
                          key={index}
                          className='border-b pb-2 text-center text-xs capitalize'
                        >
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    <ul className='mb-5 flex flex-col gap-4 text-[#475467]'>
                      {extraFeatures.map((features, index) => (
                        <li
                          key={index}
                          className='border-b pb-2 text-center text-xs'
                        >
                          {features}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default UpgradePopup
