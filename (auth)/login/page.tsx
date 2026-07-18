import { Metadata } from 'next'

import { Logo } from '@/components/icons/logo'
import OnboardingRight from '@/app/(auth-pages-new)/free-trial/_components/OnboardingRight'
import { LoginForm } from '@/app/(auth)/_components/login-form'

import AuthLeft from '../_components/auth-left-container'
import { AuthNewSlider } from '../_components/auth-new-slider'
import { AuthRightScouting } from '../_components/auth-right-scouting'

export const metadata: Metadata = {
  title: 'Sharkdom Login | Modern day partner ops platform',
  description:
    'Login to discover Growth Enabling partnerships and build your partner Network without the need of any Partnership Team'
}

const Login = ({
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
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[#E6EFFF] via-[#F4EFFF] to-[#E9E4FF] p-4 lg:p-8'>
      <div className='flex w-full max-w-[1280px] flex-col gap-6 lg:flex-row lg:items-stretch'>
        <div className='flex w-full flex-col justify-center rounded-[32px] bg-white p-8 shadow-xl sm:p-10 lg:w-1/2 lg:p-14'>
          <div className='flex justify-center lg:justify-start'>
            <Logo className='w-[120px] lg:w-[150px]' />
          </div>
          <div className='mb-8 mt-10 text-center lg:mt-6 lg:text-left'>
            <h1 className='text-3xl font-bold text-[#0D1421] lg:text-[32px] lg:leading-[1.2]'>
              Welcome back
            </h1>
            <p className='mt-1 text-xl font-normal text-[#A7A6CC] lg:text-[26px]'>
              to your modern day AI Workforce
            </p>
          </div>
          <LoginForm />
        </div>
        <div className='hidden w-full lg:flex lg:w-1/2'>
          <AuthRightScouting />
        </div>
      </div>
    </div>
  )
}

export default Login
