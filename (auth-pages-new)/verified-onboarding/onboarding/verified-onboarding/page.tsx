import React from 'react'

import TrialPricingPage from '../../_components/FreeTrailNewPayment'
import FreeTrialPayment from '../../_components/FreeTrailPayment'

type Props = {}

const PaymentPage = (props: Props) => {
  return (
    <div className='p-4'>
      <TrialPricingPage />
    </div>
  )
}

export default PaymentPage
