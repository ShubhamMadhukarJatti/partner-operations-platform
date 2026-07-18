'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import MailImg from '@/../public/assets/Mail.svg'
import MailBoxImg from '@/../public/assets/mailbox.svg'
import PanImg from '@/../public/assets/pan.png'
import { currentOrgActions } from '@/redux/slices/organization'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { CheckCircle2 } from 'lucide-react'
import { useDispatch } from 'react-redux'

import { getCurrentOrganization } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'
import { LogoutButton } from '@/components/shared/logout'

import DocumentsUpload from './_components/DocumentsUpload'

// Function to validate the
// PAN Number
const isValidPanCardNo = (panCardNo: string) => {
  // Regex to check valid
  // PAN Number
  let regex = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)

  // if PAN Number
  // is empty return false
  if (panCardNo == null) {
    return false
  }

  // Return true if the PAN NUMBER
  // matched the ReGex
  if (regex.test(panCardNo) == true) {
    return true
  } else {
    return false
  }
}

const Verify: React.FC = ({ className, ...props }: any) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { updateEmailVerified } = currentOrgActions

  // verify pan
  const fromSettingsPage = searchParams.get('settingsPage')
  // verify email
  const code = searchParams.get('code')
  const referralCode = searchParams.get('referralCode')
  const transactionId = searchParams.get('transactionId')

  const dispatch = useDispatch()

  const panFileRef = useRef<any>(null)

  const [isOpenModal, setIsOpenModal] = useState(true)
  const [panValue, setPanValue] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [panVerificationLoading, setPanVerificationLoading] = useState(false)
  const [emailVerificationLoading, setEmailVerificationLoading] =
    useState(false)

  const [sendingMail, setSendingMail] = useState<any>()
  const [isEmailSent, setIsEmailSent] = useState<any>(false)
  const [emailVerifiedLoadingText, setEmailVerifiedLoadingText] =
    useState('verifying...')

  const { data: organization } = useQuery({
    queryKey: ['organization-details'],
    queryFn: () => getCurrentOrganization(),
    enabled: true || !!emailVerifiedLoadingText,
    refetchInterval: 1000
  })
  const orgId = organization?.id ?? null

  useEffect(() => {
    setTimeout(() => {
      ;(async () => {})()
      setIsClient(true)
    }, 500)
  }, [])

  const handleEmailVerification = useCallback(async () => {
    try {
      setEmailVerificationLoading(true)
      const { token } = await getServerUser()
      const { data } = await axios.post('/api/email-verify', {
        code,
        transactionId,
        ...(referralCode && { referralCode })
      })

      if (data?.status === 'VERIFICATION_SUCCESSFUL') {
        showCustomToast('Success', data?.message, 'success', 5000)

        dispatch(updateEmailVerified(true))

        if (token) {
          setEmailVerifiedLoadingText(`navigating to explore...`)
        } else {
          setEmailVerifiedLoadingText(`navigating to login...`)
        }
        // setEmailVerificationLoading(false)
        setTimeout(() => {
          if (token) {
            if (referralCode) {
              router?.push(`/partner-programs/referral-link/${referralCode}`)
              return
            }
            router?.push('/explore')
          } else {
            router?.push('/login')
          }
        }, 5000)
        return
      }
      setEmailVerificationLoading(false)
    } catch (error) {
      setEmailVerificationLoading(false)
      console.log('EMAIL VERIFICATION ERROR::::', { error })
      showCustomToast(
        'Error',
        'Email verification failed, try after some time',
        'error',
        5000
      )
    }
  }, [code, transactionId, router])

  useEffect(() => {
    if (code && transactionId && isClient) {
      handleEmailVerification()
    }
  }, [isClient, code, transactionId, handleEmailVerification])

  useEffect(() => {
    if (!!organization && organization?.primaryEmailVerified === 'true') {
      router.push('/explore')
    }
  }, [organization, router])

  // console.log({ organization })

  return isClient ? (
    <div className='lg:p-2'>
      <Dialog
        defaultOpen
        open={isOpenModal}
        onOpenChange={() => (fromSettingsPage ? router?.back() : {})}
      >
        <DialogContent
          hideCloseBtn={fromSettingsPage ? false : true}
          className='w-full max-w-lg overflow-auto p-0 text-center '
        >
          <div className='flex h-full items-center justify-center rounded-xl bg-white'>
            <Card
              className={cn(
                'max-w-lg',
                // className,
                'gap-y-6 border-none p-8 shadow'
              )}
            >
              {!code && !transactionId && fromSettingsPage ? (
                <>
                  <CardHeader className='flex items-center gap-8'>
                    <CardTitle className='text-2xl font-semibold  text-[#475467]'>
                      Enter your Company’s PAN details
                    </CardTitle>
                    <Image src={PanImg} alt='KYB' className='w-[297px]' />
                  </CardHeader>
                  <CardContent className='grid w-full gap-4'>
                    <div>
                      <ul className='max-w-sm space-y-2 py-1 text-base font-normal text-[#475467]'>
                        {[
                          'None of your details would be saved on Sharkdom’s side, this is just to verify your startup.'
                        ].map((feature, index) => (
                          <li key={index} className='flex items-center'>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Input
                        placeholder='Enter your Pan details'
                        className='mt-3 rounded-full'
                        value={panValue}
                        onChange={(event: any) =>
                          setPanValue(event?.target?.value)
                        }
                      />

                      <DocumentsUpload />
                      {/*  */}
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col gap-2'>
                    <Button
                      loading={panVerificationLoading}
                      loadingText='verification in progress...'
                      onClick={async () => {
                        setPanVerificationLoading(true)
                        const pan = isValidPanCardNo(panValue)
                        if (pan) {
                          try {
                            const { token } = await getServerUser()
                            const { data } = await axios.post(
                              '/api/pan-verify',
                              {
                                pan: panValue,
                                organizationId: orgId
                              },
                              { headers: { Authorization: `Bearer ${token}` } }
                            )
                            if (data?.verified) {
                              router?.push('/settings')
                              showCustomToast(
                                'Success',
                                'PAN verified succesfully',
                                'success',
                                5000
                              )
                              setPanVerificationLoading(false)
                            } else {
                              setPanVerificationLoading(false)
                              showCustomToast(
                                'Error',
                                'PAN Not Found',
                                'error',
                                5000
                              )
                            }
                          } catch (error) {
                            setPanVerificationLoading(false)
                            console.log('CLIENT DG SETU::::', { error })
                            showCustomToast(
                              'Error',
                              'PAN verification failed, try after some time',
                              'error',
                              5000
                            )
                          }
                        } else {
                          setPanVerificationLoading(false)
                          showCustomToast(
                            'Error',
                            'Please enter valid PAN no.',
                            'error',
                            5000
                          )
                        }
                      }}
                      className={cn('', className)}
                      variant='default'
                    >
                      Verify Now
                    </Button>
                  </CardFooter>
                </>
              ) : code && transactionId && !fromSettingsPage ? (
                <>
                  <CardHeader className='flex items-center gap-8'>
                    <CardTitle>Verify your startup</CardTitle>
                    <Image src={MailImg} alt='KYB' className='w-[297px]' />
                  </CardHeader>
                  <CardContent className='grid gap-4'>
                    <div>
                      <h1 className='text-base font-semibold text-[#475467]'>
                        Verified startups get:
                      </h1>
                      <ul className='space-y-2 py-1 text-base font-normal text-[#475467]'>
                        {[
                          '6x more proposals accepted',
                          'Mandatory to sign MOUs',
                          'Access to partner valve room'
                        ].map((feature, index) => (
                          <li key={index} className='flex items-center'>
                            <CheckCircle2 className='mr-2 text-[#039855]' />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col gap-2'>
                    <Button
                      loading={emailVerificationLoading}
                      loadingText={emailVerifiedLoadingText}
                      className={cn('', className)}
                      variant='default'
                    >
                      Please wait
                    </Button>
                  </CardFooter>
                </>
              ) : organization &&
                organization?.primaryEmailVerified === 'false' ? (
                <>
                  <CardHeader className='flex items-center gap-8'>
                    <CardTitle>{`Haven't completed email verification yet?`}</CardTitle>
                    <Image src={MailBoxImg} alt='KYB' className='w-[94px]' />
                  </CardHeader>
                  <CardContent className='grid gap-4'>
                    <div>
                      <ul className='space-y-2 py-1 text-base font-normal text-[#475467]'>
                        {[
                          'Check you inbox and click on the link to start email verification and become a member of Sharkdom community.'
                        ].map((feature, index) => (
                          <li key={index} className='flex items-center'>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col gap-2'>
                    <Button
                      disabled={isEmailSent}
                      loading={sendingMail}
                      loadingText='sending mail...'
                      onClick={async () => {
                        try {
                          setSendingMail(true)
                          const { token } = await getServerUser()
                          const { data } = await axios.post(
                            '/api/resend-email',
                            { organizationId: orgId },
                            { headers: { Authorization: `Bearer ${token}` } }
                          )
                          if (data?.email_sent) {
                            setSendingMail(false)
                            setIsEmailSent(true)
                            showCustomToast(
                              'Success',
                              'Email sent succesfully.',
                              'success',
                              5000
                            )
                          }
                        } catch (error: any) {
                          setSendingMail(false)
                          console.log('EMAIL SENT ERROR:::::', error)
                          showCustomToast(
                            'Success',
                            'something went wrong, Email not sent.',
                            'success',
                            5000
                          )
                        }
                      }}
                      className={cn('', className)}
                      variant='default'
                    >
                      {isEmailSent ? 'Email sent' : 'Resend verification mail'}
                    </Button>
                    <LogoutButton
                      isAdmin={false}
                      className={cn('mt-3 px-6')}
                      size={'default'}
                    />
                    <div className='mt-3'>
                      <span className='text-sm'>
                        Need Help?{' '}
                        <Link href='/helpdesk'>
                          <Button variant={'link'} className='px-0'>
                            Contact Support
                          </Button>
                        </Link>
                      </span>
                    </div>
                  </CardFooter>
                </>
              ) : organization &&
                organization?.primaryEmailVerified === 'true' ? (
                <>
                  <CardHeader className='flex w-full items-center gap-8'>
                    <CardTitle>{`Email already verified`}</CardTitle>
                    <Image src={MailBoxImg} alt='KYB' className='w-[94px]' />
                  </CardHeader>
                  <CardContent className='grid gap-4'>
                    <div>
                      <ul className='space-y-2 py-1 text-base font-normal text-[#475467]'>
                        {['Organization verification already done...'].map(
                          (feature, index) => (
                            <li key={index} className='flex items-center'>
                              {feature}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col gap-2'>
                    <Button
                      variant='default'
                      className={cn('', className)}
                      onClick={async () => router.push('explore')}
                    >
                      Explore
                    </Button>
                  </CardFooter>
                </>
              ) : null}
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ) : null
}

export default Verify
