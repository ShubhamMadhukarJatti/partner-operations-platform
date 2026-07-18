'use client'

import FreeTrialRegisterForm from '@/app/(auth-pages-new)/free-trial/_components/FreeTrialRegisterForm'

import AuthLeft from '../_components/auth-left-container'
import { AuthNewSlider } from '../_components/auth-new-slider'

const Register = ({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  return (
    <div className='flex max-h-screen min-h-screen'>
      {/* Left side carousel (only visible on lg and up) */}
      <div className='hidden w-1/2 items-center justify-center bg-gray-50 lg:flex'>
        <AuthNewSlider />
      </div>

      {/* Right side form */}
      <div className='flex flex-1 items-center justify-center px-4 py-8 lg:px-12 lg:pt-14'>
        <div className='w-full max-w-md'>
          <FreeTrialRegisterForm />
        </div>
      </div>
    </div>
  )
}

export default Register
