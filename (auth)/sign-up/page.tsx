import { Metadata } from 'next'

import { Logo } from '@/components/icons/logo'
import DashboardItemWrapper from '@/app/(app)/(dashboard-pages)/dashboard/[id]/_components/dashboard-item-wrapper'
import RegistrationForm from '@/app/(auth)/_components/registration-form'

import AuthScreenSlider from '../_components/auth-screen-slider'

export const metadata: Metadata = {
  title: 'Signup | Sharkdom',
  description:
    'Join the Sharkdom Network to discover Growth Enabling partnerships and build your partner Network without the need of any Partnership team'
}

const Register = ({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const redirect = searchParams?.redirect
  function passRedirectParam(url: string) {
    if (redirect) {
      return `${url}?redirect=${redirect}`
    }

    return url
  }

  return (
    <main className=' flex min-h-screen   '>
      <div className=' hidden flex-1 lg:flex'>
        <AuthScreenSlider isSignUp />
      </div>

      <DashboardItemWrapper className='relative m-10 ml-0 flex  max-w-[561px] flex-1 flex-col   bg-white p-8'>
        <div className=''>
          <Logo className='w-[150px]' />
        </div>
        <div className='mt-12'>
          <h1 className='text-shark-3xl font-bold text-text-100'>
            Create a new account
          </h1>
          <p className='mt-2 font-medium text-text-60'>
            Join Sharkdom as your one stop solution for all you partnership
            needs
          </p>
        </div>
        <RegistrationForm isSignUp={true} />
      </DashboardItemWrapper>
    </main>
  )
}

export default Register
