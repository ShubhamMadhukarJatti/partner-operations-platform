import Image from 'next/image'
import MailVerified from '@/../public/assets/mailverified.png'

import { Card } from '@/components/ui/card'

function EmailVerification() {
  return (
    <div className='relative flex h-full w-full flex-col items-center justify-center'>
      <p className='absolute top-0'>
        {'{Automatically redirect to Partner program page}'}
      </p>
      <Card className='mx-auto w-[480px] p-8 shadow-sm'>
        <div className='flex flex-col items-center gap-6'>
          <h1 className='text-xl font-semibold'>
            Check email for verification
          </h1>
          <Image src={MailVerified} width={93} height={102} alt='' />
          <p className='text-center'>
            Click on the link sent on your email to verify your domain and start
            referral program.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default EmailVerification
