'use client'

import React, { useState } from 'react'
import {
  useCheckConnectedAccounts,
  useGetPayoutSummary
} from '@/http-hooks/deals'
import { useQuery } from '@tanstack/react-query'

import { getCurrentOrganization } from '@/lib/db/organization'
import {
  createStripeCheckout,
  createUserSubscription,
  verifyPayment
} from '@/lib/db/payment'
import { getStripe } from '@/lib/stripe'
import { showCustomToast } from '@/components/custom-toast'
import { EarningIcon, PiggyBank, SendMoneyIcon } from '@/components/icons/icons'

import AccountAddedBanner from './payouts-earning/AccountAddedBanner'
import Card from './payouts-earning/Card'
import ConnectBankCard from './payouts-earning/ConnectBankCard'
import PaymentTransactiontable from './payouts-earning/PaymentTransactiontable'

export interface ConnectedAccounts {
  bankConnected: boolean
  stripeConnected: boolean
  razorPayConnected: boolean
}

export interface payoutSummaryT {
  balance: string
  earning: string
  paid: string
}

const PayoutsContent = () => {
  const { data } = useCheckConnectedAccounts() as {
    data: ConnectedAccounts | null
  }
  const stripePromise = getStripe()

  const { data: payoutSummary } = useGetPayoutSummary() as {
    data: payoutSummaryT | null
  }

  const handleAddMoney = async () => {
    try {
      // if (country !== 'IN') {
      //   await handleStripeUpgrade(planType)
      //   return
      // }

      const currentOrganization = await getCurrentOrganization()
      // const result = await createUserSubscription({
      //   organizationId: currentOrganization?.id,
      //   planType,
      //   referralCode: 'string',
      //   email: 'string',
      //   contactNumber: 'string'
      // })

      // if (!result?.subscriptionId) {
      //   showCustomToast('Error', 'Subscription ID not found!', 'error', 5000)
      //   return
      // }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY,
        // order_id: result.subscriptionId,
        name: 'Sharkdom',
        amount: 2000 * 100,
        // description: `${planType} Subscription`,
        handler: async (response: any) => {
          const paymentResult = await verifyPayment(response)
          if (paymentResult) {
            console.log(paymentResult)
            showCustomToast('Success', 'Payment successful!', 'success', 5000)
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
        theme: { color: '#3399cc' }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      showCustomToast(
        'Error',
        error instanceof Error ? error.message : 'An unknown error occurred',
        'error',
        5000
      )
    }
  }

  // const handleStripeUpgrade = async (planType: string) => {
  //   const stripe = await stripePromise
  //   if (!stripe) throw new Error('Stripe initialization failed.')

  //   const currentOrganization = await getCurrentOrganization()
  //   const session = await createStripeCheckout({
  //     organizationId: currentOrganization?.id,
  //     planType,
  //     currency: 'USD',
  //     amount: 2000
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

  return (
    <div className='flex flex-col gap-4'>
      {data &&
      !(
        data?.bankConnected ||
        data?.razorPayConnected ||
        data?.stripeConnected
      ) ? (
        <ConnectBankCard />
      ) : (
        <></>
      )}
      {/* <AccountAddedBanner /> */}

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <Card
          title='Balance'
          description={'copy'}
          value={payoutSummary?.balance ?? '0'}
          icon={<PiggyBank />}
          iconBgColor='#F1F1F1'
          type='add'
          handleAddMoney={handleAddMoney}
        />
        <Card
          title='Earnings'
          description={'Connect bank to request reward'}
          value={payoutSummary?.earning ?? '0'}
          icon={<EarningIcon />}
          iconBgColor='#DDF6DF'
          buttonText='Request'
        />
        <Card
          title='Paid'
          description={'Connect bank to make payment'}
          value={payoutSummary?.paid ?? '0'}
          icon={<SendMoneyIcon />}
          iconBgColor='#F9F3C8'
          buttonText='Send'
        />
      </div>

      <PaymentTransactiontable />
    </div>
  )
}

export default PayoutsContent
