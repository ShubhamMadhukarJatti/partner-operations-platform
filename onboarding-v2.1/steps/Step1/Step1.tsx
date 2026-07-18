import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import {
  getGoogleProvider,
  getLinkedInProvider,
  getOAuthRedirectResult,
  loginWithProviderRedirect
} from '@/lib/firebase'
import { getFirebaseAuth } from '@/lib/firebase/auth/firebase'
import { showCustomToast } from '@/components/custom-toast'

interface Step1Props {
  firstName: string
  lastName: string
  email: string
  onChange: (field: string, value: string) => void
  onNext?: () => void
  onOAuthSuccess?: (email: string, firstName: string, lastName: string) => void
}

export const Step1: React.FC<Step1Props> = ({
  firstName,
  lastName,
  email,
  onChange,
  onNext,
  onOAuthSuccess
}) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false)

  // On mount: capture the redirect result if we just came back from OAuth
  useEffect(() => {
    const auth = getFirebaseAuth()
    getOAuthRedirectResult(auth)
      .then((user) => {
        if (!user) return
        const userEmail = user.email || ''
        const names = user.displayName?.split(' ') || []
        const userFirstName = names[0] || ''
        const userLastName = names.length > 1 ? names.slice(1).join(' ') : ''
        onOAuthSuccess?.(userEmail, userFirstName, userLastName)
      })
      .catch((error) => {
        console.error('OAuth redirect error:', error)
        // Only show toast for real errors, not empty results
        if (error?.code && error.code !== 'auth/no-current-user') {
          showCustomToast('Error', 'Authentication failed', 'error', 5000)
        }
      })
  }, [])

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true)
      const auth = getFirebaseAuth()
      // Redirects away — page will reload on return
      await loginWithProviderRedirect(auth, getGoogleProvider(auth))
    } catch (error: any) {
      console.error(error)
      showCustomToast('Error', 'Google Authentication failed', 'error', 5000)
      setIsGoogleLoading(false)
    }
  }

  const handleLinkedInLogin = async () => {
    try {
      setIsLinkedInLoading(true)
      const auth = getFirebaseAuth()
      // Redirects away — page will reload on return
      await loginWithProviderRedirect(auth, getLinkedInProvider(auth))
    } catch (error: any) {
      console.error(error)
      showCustomToast('Error', 'LinkedIn Authentication failed', 'error', 5000)
      setIsLinkedInLoading(false)
    }
  }

  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <div className='flex w-[440px] flex-col items-start justify-start gap-8'>
        <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
          <div className='flex flex-col justify-center self-stretch break-words text-[24px] font-semibold text-[#101828]'>
            Welcome to Sharkdom
          </div>
          <div className='flex flex-col justify-center self-stretch break-words text-[24px] font-normal text-[#A7A6CC]'>
            Build your partner ecosystem
          </div>
        </div>

        <div className='flex w-full flex-col items-start justify-start gap-2'>
          <div
            onClick={handleGoogleLogin}
            className={`inline-flex w-[440px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white/60 px-6 py-2.5 outline outline-1 outline-offset-[-1px] transition-colors hover:bg-gray-50 ${isGoogleLoading ? 'pointer-events-none opacity-50' : ''}`}
          >
            <div className='relative flex h-5 w-5 items-center justify-center overflow-hidden'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 48 48'
              >
                <path
                  fill='#FFC107'
                  d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
                />
                <path
                  fill='#FF3D00'
                  d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
                />
                <path
                  fill='#4CAF50'
                  d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
                />
                <path
                  fill='#1976D2'
                  d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
                />
              </svg>
            </div>
            <div className='break-words text-[16px] font-medium leading-normal text-[#4A5565]'>
              {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
            </div>
          </div>
          <div
            onClick={handleLinkedInLogin}
            className={`inline-flex w-[440px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white/60 px-6 py-2.5 outline outline-1 outline-offset-[-1px] transition-colors hover:bg-gray-50 ${isLinkedInLoading ? 'pointer-events-none opacity-50' : ''}`}
          >
            <div className='relative flex h-5 w-5 items-center justify-center overflow-hidden'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
              >
                <path
                  fill='#0A66C2'
                  d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-1.85 0-2.56 1.05-2.9 1.58v-1.32h-2.76v8.3h2.76v-4.57c0-1.21.23-2.39 1.74-2.39c1.48 0 1.5 1.4 1.5 2.47v4.49h2.92M7.34 8.24A1.6 1.6 0 1 0 5.72 6.63a1.6 1.6 0 0 0 1.62 1.61M8.7 18.5V10.2H5.98v8.3h2.72Z'
                />
              </svg>
            </div>
            <div className='break-words text-[16px] font-medium leading-normal text-[#4A5565]'>
              {isLinkedInLoading ? 'Connecting...' : 'Continue with Linkedin'}
            </div>
          </div>
        </div>

        <div className='inline-flex w-[439px] items-center justify-start gap-4'>
          <div className='h-0 flex-1 outline outline-[0.5px] outline-offset-[-0.25px] outline-[#C5D0E4]'></div>
          <div className='flex flex-col justify-center break-words text-center text-[12px] font-normal text-[#99A1AF]'>
            or sign in with email
          </div>
          <div className='h-0 flex-1 outline outline-[0.5px] outline-offset-[-0.25px] outline-[#C5D0E4]'></div>
        </div>

        <div className='flex w-full flex-col gap-4'>
          <div className='flex w-full gap-4'>
            <div className='flex flex-1 flex-col gap-1'>
              <label className='text-[14px] font-medium leading-[20px] text-[#666666]'>
                First name
              </label>
              <div className='flex items-center overflow-hidden rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
                <input
                  type='text'
                  value={firstName}
                  onChange={(e) => onChange('firstName', e.target.value)}
                  placeholder='John'
                  className='w-full px-4 py-2.5 text-[16px] font-normal leading-normal text-[#1A1A1A] outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#6B4FBB]'
                />
              </div>
            </div>
            <div className='flex flex-1 flex-col gap-1'>
              <label className='text-[14px] font-medium leading-[20px] text-[#666666]'>
                Last name
              </label>
              <div className='flex items-center overflow-hidden rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
                <input
                  type='text'
                  value={lastName}
                  onChange={(e) => onChange('lastName', e.target.value)}
                  placeholder='Doe'
                  className='w-full px-4 py-2.5 text-[16px] font-normal leading-normal text-[#1A1A1A] outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#6B4FBB]'
                />
              </div>
            </div>
          </div>
          <div className='flex w-full flex-col gap-1'>
            <label className='text-[14px] font-medium leading-[20px] text-[#666666]'>
              Email
            </label>
            <div className='flex items-center overflow-hidden rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
              <input
                type='email'
                value={email}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder='johndoe@email.com'
                className='w-full px-4 py-2.5 text-[16px] font-normal leading-normal text-[#1A1A1A] outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#6B4FBB]'
              />
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className='w-full rounded-xl bg-[#6863FB] py-3.5 text-base font-semibold text-white transition-all hover:bg-[#5651D9] active:scale-[0.98]'
        >
          Get started
        </button>

        {/* Terms & Privacy */}
        <div className='mt-6 flex w-full items-center justify-center gap-4 text-xs text-[#6A7282]'>
          <span>Terms of service</span>
          <div className='h-1 w-1 rounded-full bg-[#99A1AF]'></div>
          <span>Privacy policy</span>
        </div>
      </div>
    </div>
  )
}
