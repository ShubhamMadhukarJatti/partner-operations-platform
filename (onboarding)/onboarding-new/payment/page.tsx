import React from 'react'

// import Link from 'next/link'

// import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
// import { Logo } from '@/components/icons/logo'

// import OnboardingPayment from '../../_components/payment-step'
// import Stepper from '../../_components/stepper'
import FreeTrailPayment from '@/app/(auth-pages-new)/free-trial/_components/FreeTrailPayment'

type Props = {}

const OnboardingPaymentPage = (props: Props) => {
  return (
    // <main className='m-8 h-full bg-background-ghost-white lg:m-0'>
    //   <div className='my-6 flex items-center justify-between'>
    //     <Logo className='w-[150px]' />
    //     <Link
    //       href={'/getting-started'}
    //       className='h-fit rounded-lg border border-text-20 bg-white px-3 py-2 text-shark-sm font-bold text-text-100'
    //     >
    //       Skip
    //     </Link>
    //   </div>
    //   {/* <OnboardingPayment /> */}
    // </main>
    <div>
      <FreeTrailPayment />
    </div>
  )
}

export default OnboardingPaymentPage
