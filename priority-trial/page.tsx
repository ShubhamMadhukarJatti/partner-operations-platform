'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { getSubscription } from '@/lib/db/subscription'
import { OpenDealIcon } from '@/components/icons/icons'

import FreeTrialPayment from '../../(auth-pages-new)/free-trial/_components/FreeTrailPayment'
import Loader from '../(dashboard-pages)/explore-2/_components/org-loader'
import EmptyState from '../(dashboard-pages)/partner-match/_components/EmptyState'

const Payment = () => {
  const [subscription, setSubscription] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const getSubscriptionData = async () => {
    setLoading(true)
    try {
      const subscription = await getSubscription()
      setSubscription(subscription)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSubscriptionData()
  }, [])

  if (loading)
    return (
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <Loader loadingtext='loading...' />
      </div>
    )

  return (
    <div>
      {subscription.length > 0 ? (
        <div className='flex min-h-screen w-screen flex-col items-center justify-center'>
          <OpenDealIcon />
          <p className='mt-4 text-shark-sm text-text-90'>
            this account has just added standard trial from your payment link
          </p>
        </div>
      ) : (
        <FreeTrialPayment successUrl='/explore' cancelUrl='/free-trial/plans' />
      )}
    </div>
  )
}

export default Payment
