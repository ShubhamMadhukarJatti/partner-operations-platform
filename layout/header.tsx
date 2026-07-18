'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Script from 'next/script'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CloseCircle } from 'iconsax-react'
import { LayoutDashboard } from 'lucide-react'

import {
  getCurrentOrganization,
  getOrganizationMappingsByUserId
} from '@/lib/db/organization'
import { getCurrentUser } from '@/lib/db/user'
import { useAuth } from '@/lib/firebase/auth/context'
import { getServerUser } from '@/lib/server'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { showCustomToast } from '@/components/custom-toast'
import { FullLogo, NewFullLogo, SharanagatiLogo } from '@/components/icons/logo'
import MobileNav from '@/app/(marketing)/_components/layout/mobile-nav'

import NewNav from './new-nav'

export const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [isHomePage, setIsHomePage] = useState(false)
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false)
  const [userDataCached, setUserDataCached] = useState(false)

  const { scrollY } = useScroll()

  const backgroundColor = useTransform(scrollY, [0, 100], ['#fff', '#ffffff'])
  const color = useTransform(scrollY, [0, 100], ['#676767', '#676767'])

  const [hidden, setHidden] = useState(false)

  const [country, setCountry] = useState('IN')

  // Background user fetch function
  const fetchUserData = useCallback(async () => {
    if (userDataCached) return user

    try {
      const { user } = await getServerUser()
      setUser(user)
      setUserDataCached(true)
      return user
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }, [user, userDataCached])

  // Handle dashboard navigation with complete routing logic
  const handleDashboardClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      setIsLoadingDashboard(true)

      try {
        // Ensure user data is available
        const userData = await fetchUserData()

        if (!userData) {
          router.push('/login')
          return
        }

        // Get URL parameters for verification flow
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const transactionId = urlParams.get('transactionId')

        // Fetch organization mappings
        const organizationMappings = await getOrganizationMappingsByUserId(
          userData.uid
        )

        if (!organizationMappings) {
          showCustomToast(
            'Error',
            'Error fetching data. Redirecting to login',
            'error',
            5000
          )
          router.push('/login')
          return
        }

        // Fetch user profile
        const userProfile = await getCurrentUser()

        const currentOrganization = organizationMappings.find(
          (org) => org.organizationUserMapping.status === 'ACTIVE'
        )?.organization

        const pendingJoin = organizationMappings.find(
          (org) => org.organizationUserMapping.status === 'UNAPPROVED'
        )?.organization

        const rejectedRequests = organizationMappings
          .filter(
            (org) =>
              org.organizationUserMapping.status === 'REJECTED' ||
              org.organizationUserMapping.status === 'DELETED'
          )
          .map((org) => org.organization)

        // Handle routing based on user state
        // If user profile doesn't exist, redirect to drop-off (onboarding not completed)
        // if (!userProfile?.id) {
        //   router.push('/drop-off')
        //   return
        // }

        // If user has pending organization join, redirect to waiting
        if (!currentOrganization && pendingJoin) {
          router.push('/onboarding/waiting')
          return
        }

        // If user has rejected requests or no organization, redirect to drop-off
        // if (!currentOrganization && rejectedRequests?.length > 0) {
        //   router.push('/drop-off')
        //   return
        // }

        // if (!currentOrganization) {
        //   router.push('/drop-off')
        //   return
        // }

        // If organization exists but email not verified, handle verification
        if (
          currentOrganization &&
          currentOrganization?.primaryEmailVerified === 'false'
        ) {
          if (transactionId && code) {
            router.push(`/verify?transactionId=${transactionId}&code=${code}`)
            return
          }
        }

        // If user is fully authenticated and has active organization, redirect to dashboard
        if (currentOrganization && userProfile?.id) {
          router.push('/offline-partners')
          return
        }
      } catch (error) {
        console.error('Error navigating to dashboard:', error)
        showCustomToast(
          'Error',
          'Error loading dashboard. Please try again.',
          'error',
          5000
        )
        router.push('/login')
      } finally {
        setIsLoadingDashboard(false)
      }
    },
    [fetchUserData, router]
  )

  useEffect(() => {
    // Set home page state based on pathname
    setIsHomePage(pathname === '/')

    const fetchCountry = async () => {
      try {
        const res = await fetch(
          `https://ipinfo.io/json?token=${process.env.NEXT_PUBLIC_IPINFO_TOKEN}`
        )
        const data = await res.json()

        setCountry(data.country)
      } catch (error) {
        console.error('Error fetching IP info:', error)
      }
    }

    // Pre-fetch user data in background after a short delay (non-blocking)
    const timer = setTimeout(() => {
      fetchUserData()
    }, 1000)

    fetchCountry()

    return () => clearTimeout(timer)
  }, [pathname, fetchUserData])

  return (
    <motion.div
      className={cn('sticky top-0 z-[999] ', {})}
      style={{
        backgroundColor,
        color
      }}
      variants={{
        visible: { top: '0px' },
        hidden: { top: '-100px' }
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.4, ease: 'easeIn' }}
    >
      <div
        className={cn(
          'relative flex flex-col items-center justify-center bg-gradient-to-r from-[#bd25eb] to-[#153885] py-2 text-[0.8rem] text-white md:flex-row md:gap-2 md:py-4 md:text-sm'
          // {
          //   hidden: hidden
          // }
        )}
      >
        <p className='text-center'>
          Learn how to build a high-performing partner ecosystem from
          partnership leaders
        </p>
        <a
          href='https://www.sharkdom.com/blog/how-to-build-high-performing-partner-ecosystem-in-2025'
          target='_blank'
          className='ml-3 font-bold text-white underline'
        >
          Check Now
        </a>
        {/* <button onClick={() => setHidden(true)} className=' md:ml-10 text-white'>
          <CloseCircle size={20} variant='Bold' />
        </button> */}
      </div>
      <MaxWidthWrapper className=' '>
        <header className='w-full -translate-y-4 animate-fade-in px-2 py-4  opacity-0 sm:px-8 lg:px-0'>
          <div className='relative flex items-center justify-between'>
            <Link href='/' className='flex items-center text-xl font-semibold'>
              <NewFullLogo className='h-6 w-full sm:h-8' />
            </Link>
            <NewNav />
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <DropdownMenu>
                  <DropdownMenuTrigger className='flex cursor-pointer items-center gap-2 text-sm font-medium'>
                    <div className='inline-flex items-center space-x-2'>
                      {country === 'IN' ? (
                        <>
                          <Image
                            src='/india.svg'
                            alt='India Flag'
                            width={24}
                            height={16}
                          />
                          <span>EN-IN</span>
                        </>
                      ) : (
                        <>
                          <Image
                            src='/usa.svg'
                            alt='US Flag'
                            width={24}
                            height={16}
                          />
                          <span>US-EN</span>
                        </>
                      )}
                    </div>
                    <svg
                      className='ml-1 h-4 w-4'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className='mt-1 w-32 rounded-md border border-gray-300 bg-white shadow-lg'>
                    <DropdownMenuItem className='flex cursor-pointer items-center gap-2 p-2 hover:bg-gray-100'>
                      {country !== 'IN' ? (
                        <>
                          <Image
                            src='/india.svg'
                            alt='India Flag'
                            width={24}
                            height={16}
                          />
                          <span>EN-IN</span>
                        </>
                      ) : (
                        <>
                          <Image
                            src='/usa.svg'
                            alt='US Flag'
                            width={24}
                            height={16}
                          />
                          <span>US-EN</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {user ? (
                <>
                  <div className='ml-8'></div>
                </>
              ) : (
                <Button
                  className=' hidden justify-center sm:block'
                  asChild
                  variant='ghost'
                >
                  <Link href='/login'>Login</Link>
                </Button>
              )}
              {user ? (
                <>
                  <Button
                    className='hidden sm:flex'
                    onClick={handleDashboardClick}
                    disabled={isLoadingDashboard}
                  >
                    {isLoadingDashboard ? (
                      <>
                        <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                        Loading...
                      </>
                    ) : (
                      'Go to Dashboard'
                    )}
                  </Button>
                  <Button
                    className='h-full rounded-full p-2 sm:hidden'
                    aria-label='Go to Dashboard'
                    onClick={handleDashboardClick}
                    disabled={isLoadingDashboard}
                  >
                    {isLoadingDashboard ? (
                      <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                    ) : (
                      <LayoutDashboard className='size-4' />
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {/* <div
                    className='hidden justify-center text-sm sm:flex'
                    // asChild
                  >
                    <Link href='/book-demo'>Book a Demo</Link>
                  </div> */}
                  <button className='flex flex-row items-center gap-1 rounded-3xl py-2 text-sm font-medium text-[#6863FB] hover:bg-[#f7f9fc] hover:text-[#6863FB]'>
                    <Link href='/book-demo'>Book a Demo</Link>
                  </button>
                  {/* <Button
                    className='justify-center bg-primary-light-blue sm:hidden'
                    asChild
                  >
                    <Link href='/register'>Try</Link>
                  </Button> */}
                  <Button
                    className='hidden justify-center rounded-full bg-[#6863FB] px-6 py-2 font-medium text-white sm:flex'
                    asChild
                  >
                    <Link href='/free-trial'>Try For Free</Link>
                  </Button>
                </>
              )}
              <MobileNav />
            </div>
          </div>
        </header>
      </MaxWidthWrapper>
    </motion.div>
  )
}
