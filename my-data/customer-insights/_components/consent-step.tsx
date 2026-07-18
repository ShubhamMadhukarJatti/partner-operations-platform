'use client'

import React, { Dispatch, SetStateAction, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { EyeSlash, Share } from 'iconsax-react'
import { ArrowLeft } from 'lucide-react'
import { signIn } from 'next-auth/react'

import { buildHubSpotOAuthUrl } from '@/lib/crm-oauth'
import {
  getCurrentOrganization,
  PatchIntegrationData,
  Postintegrationdata
} from '@/lib/db/organization'
import { cn } from '@/lib/utils'
import { getZohoAccountsBase } from '@/lib/zoho'
import { Button } from '@/components/ui/button'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type ConsentStepProps = {
  setStep: () => void
  sourceIcon: string
  dataSource?: string
  source?: React.ReactNode
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isUploaded: boolean
  onAuthenticated?: () => Promise<boolean> | void // Add callback for when authentication is complete
}

const ConsentStep: React.FC<ConsentStepProps> = ({
  setStep,
  sourceIcon,
  dataSource,
  source,
  setIsOpen,
  isUploaded,
  onAuthenticated
}) => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleAuthentication = async () => {
    setIsConnecting(true)

    try {
      if (dataSource === 'HubSpot') {
        await handleHubSpotAuth()
      } else if (dataSource === 'ZOHO') {
        await handleZohoAuth()
      } else if (dataSource === 'Google Sheets') {
        await handleGoogleSheetsAuth()
      } else {
        // For sources that don't need authentication (like CSV), proceed directly
        setStep()
        setIsConnecting(false)
        return
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setIsConnecting(false)
    }
  }

  const handleHubSpotAuth = async () => {
    const redirectUri = process.env
      .NEXT_PUBLIC_HUBSPOT_REDIRECTION_URL as string
    const authUrl = buildHubSpotOAuthUrl({
      redirectUri,
      source: 'customer-insights-consent-step'
    })

    // Open OAuth window
    const authWindow = window.open(
      authUrl,
      'hubspot-auth',
      'width=600,height=600'
    )

    // Listen for OAuth completion
    const pollTimer = window.setInterval(async () => {
      try {
        if (authWindow?.closed) {
          window.clearInterval(pollTimer)

          if (onAuthenticated) {
            const isConnected = await onAuthenticated()
            if (isConnected) {
              setShowSuccess(true)
              setTimeout(() => {
                setStep()
              }, 2000)
            } else {
              setIsConnecting(false)
            }
          } else {
            // Fallback if no check available
            setShowSuccess(true)
            setTimeout(() => setStep(), 2000)
            setIsConnecting(false)
          }
        }
      } catch (error) {
        // Handle cross-origin issues
      }
    }, 1000)
  }

  const handleZohoAuth = async () => {
    const zohoId =
      (process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID as string)
        ?.trim()
        .replace(/\+/g, '') ?? ''
    const redirectUri = process.env.NEXT_PUBLIC_ZOHO_REDIRECTION_URL as string
    const zohoScopes = process.env.NEXT_PUBLIC_ZOHO_SCOPES as string
    const state = JSON.stringify({
      timestamp: Date.now(),
      source: 'customer-insights-flow'
    })

    const zohoAccountsBase = await getZohoAccountsBase()
    const authUrl =
      `${zohoAccountsBase}/oauth/v2/auth` +
      `?scope=${encodeURIComponent(zohoScopes)}` +
      `&client_id=${zohoId}` +
      `&state=${encodeURIComponent(state)}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&access_type=offline` +
      `&prompt=consent`

    // Open OAuth window
    const authWindow = window.open(authUrl, 'zoho-auth', 'width=600,height=600')

    // Listen for OAuth completion
    const pollTimer = window.setInterval(async () => {
      try {
        if (authWindow?.closed) {
          window.clearInterval(pollTimer)

          if (onAuthenticated) {
            const isConnected = await onAuthenticated()
            if (isConnected) {
              setShowSuccess(true)
              setTimeout(() => {
                setStep()
              }, 2000)
            } else {
              setIsConnecting(false)
            }
          } else {
            // Fallback if no check available
            setShowSuccess(true)
            setTimeout(() => setStep(), 2000)
            setIsConnecting(false)
          }
        }
      } catch (error) {
        // Handle cross-origin issues
      }
    }, 1000)
  }

  const handleGoogleSheetsAuth = async () => {
    // Use NextAuth for Google Sheets
    signIn('google', undefined, {
      scope:
        'openid https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.metadata.readonly'
    })

    setTimeout(() => {
      setShowSuccess(true)
      setTimeout(() => {
        if (onAuthenticated) onAuthenticated()
        setStep()
      }, 2000)
    }, 2000)
    setIsConnecting(false)
  }

  return (
    <>
      {showSuccess ? (
        <div className='flex h-full flex-col items-center justify-center'>
          <Image src={sourceIcon} alt='' width={115} height={64} />
          <div className='mt-20'>
            <div className='h-64 w-64 '>
              <Lottie
                animationData={require('@/lib/lottie-json/verified.json')}
                loop={true}
              />
            </div>
            <span className='mt-1 text-shark-lg text-text-100'>
              {dataSource} Successfully Connected
            </span>
          </div>
        </div>
      ) : (
        <div className='my-8'>
          <Button
            variant={'link'}
            onClick={() => setIsOpen(false)}
            className='fds-text-sm mb-8 flex items-center text-primary-blue '
          >
            <ArrowLeft size={16} className='mr-1' />
            Back to Home
          </Button>

          <div className='mb-6 flex flex-col items-center'>
            <div className='mb-4 flex items-center justify-center'>
              <Image src={sourceIcon} alt='' width={115} height={64} />
            </div>
            <p className='fds-text-lead-semibold text-center text-[#2A3241]'>
              Sharkdom uses{' '}
              <span className='font-medium text-orange-500'>{dataSource}</span>{' '}
              to connect your account
            </p>
          </div>

          <div className='mb-6'>{source}</div>

          <div className='mb-6  bg-[#EDF2FF] p-4'>
            <h3 className='fds-text-semibold mb-2 text-[#10366F]'>
              How to connect {dataSource}
            </h3>
            {/* TAake from props */}
            <ol className='list-decimal pl-5 text-shark-sm text-[#2A3241]'>
              <li className='mb-1'>Provide admin permission in Sharkdom</li>
              <li>Add credentials for the authenticating user in your CRM</li>
            </ol>
          </div>

          <div className='mb-6 bg-[#FDF3E3] p-4'>
            <div className='mb-2 flex items-center justify-between'>
              <h3 className='fds-text text-[#2A3241]'>
                Recommended fields for better results
              </h3>
            </div>
            <div className='space-y-2 text-sm'>
              <div className='flex items-start'>
                <div className='mt-0.5 flex-shrink-0'>
                  <div className='flex h-4 w-4 items-center justify-center rounded-sm bg-green-500'>
                    <svg
                      width='10'
                      height='8'
                      viewBox='0 0 10 8'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M1 4L3.5 6.5L9 1'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                </div>
                <div className='ml-2'>
                  <span className='font-medium'>Mandatory:</span> Name, Website
                </div>
              </div>
              <div className='flex items-start'>
                <div className='mt-0.5 flex-shrink-0'>
                  <div className='flex h-4 w-4 items-center justify-center rounded-sm bg-amber-400'>
                    <svg
                      width='10'
                      height='8'
                      viewBox='0 0 10 8'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M1 4L3.5 6.5L9 1'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                </div>
                <div className='ml-2'>
                  <span className='font-medium'>
                    Nice-to-have (Optional though):
                  </span>{' '}
                  Industry, Contact Number
                </div>
              </div>
            </div>
          </div>

          {/* Benefits section */}
          <div className='mb-6 space-y-4 rounded-lg border border-[#E4E7EE] p-4'>
            <div className='flex'>
              <div className='mr-3 flex-shrink-0'>
                <Share size={24} variant='Bold' />
              </div>
              <div>
                <h4 className='fds-text text-[#2A3241]'>
                  Connect Effortlessly
                </h4>
                <p className='text-shark-sm text-text-80'>
                  Sharkdom lets you securely connect your marketing data in
                  couple of minutes.
                </p>
              </div>
            </div>
            <div className='flex'>
              <div className='mr-3 flex-shrink-0'>
                <EyeSlash size={24} variant='Bold' />
              </div>
              <div>
                <h4 className='fds-text text-[#2A3241]'>
                  Your data belongs to you
                </h4>
                <p className='text-shark-sm text-text-80'>
                  Sharkdom doesn&apos;t sell personal info, and will only use it
                  with your permission.
                </p>
              </div>
            </div>
          </div>

          <p className='mb-12 text-shark-xs text-[#4D5C78]'>
            By selecting Continue you agree to the{' '}
            <a href='#' className='text-primary-blue'>
              Sharkdom End User Privacy Policy
            </a>
            .
          </p>

          <Button
            variant={isConnecting ? 'disable' : 'primary'}
            onClick={handleAuthentication}
            className={cn(
              'fds-text-semibold w-[218px] rounded-md bg-primary-blue py-2 text-white transition-colors hover:bg-primary-blue',
              isConnecting &&
                'disabled:pointer-events-auto disabled:cursor-not-allowed'
            )}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect & Continue'}
          </Button>
        </div>
      )}
    </>
  )
}

export default ConsentStep
