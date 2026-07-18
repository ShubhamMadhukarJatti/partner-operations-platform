'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
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
import {
  ArrowRight,
  LayoutDashboard,
  Pause,
  Play,
  ShieldCheck,
  X
} from 'lucide-react'

import { triggerTokenRefresh } from '@/lib/auth/token-refresh'
import {
  getCurrentOrganization,
  getOrganizationMappingsByUserId
} from '@/lib/db/organization'
import { getCurrentUser } from '@/lib/db/user'
import { useAuth } from '@/lib/firebase/auth/context'
import { getServerUser } from '@/lib/server'
import { cn } from '@/lib/utils'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import LoadingIcon from '@/components/ui/loading-icon'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { showCustomToast } from '@/components/custom-toast'
import { FullLogo, NewFullLogo, SharanagatiLogo } from '@/components/icons/logo'
import MobileNav from '@/app/(marketing)/_components/layout/mobile-nav'

import NewNav from './new-nav'

const SecurityPromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isOverlayVisible, setIsOverlayVisible] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const overlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isHoveringRef = useRef(false)

  const clearOverlayTimer = useCallback(() => {
    if (overlayTimeoutRef.current) {
      clearTimeout(overlayTimeoutRef.current)
      overlayTimeoutRef.current = null
    }
  }, [])

  const scheduleOverlayHide = useCallback(() => {
    clearOverlayTimer()
    const videoElement = videoRef.current
    if (!videoElement || videoElement.paused || isHoveringRef.current) {
      return
    }
    overlayTimeoutRef.current = setTimeout(() => {
      setIsOverlayVisible(false)
    }, 2500)
  }, [clearOverlayTimer])

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true
    clearOverlayTimer()
    setIsOverlayVisible(true)
  }, [clearOverlayTimer])

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false
    if (isPlaying) {
      scheduleOverlayHide()
    }
  }, [isPlaying, scheduleOverlayHide])

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handlePlay = () => {
      setIsPlaying(true)
      setIsOverlayVisible(true)
      scheduleOverlayHide()
    }

    const handlePause = () => {
      setIsPlaying(false)
      clearOverlayTimer()
      setIsOverlayVisible(true)
    }

    videoElement.addEventListener('play', handlePlay)
    videoElement.addEventListener('pause', handlePause)

    if (isModalOpen) {
      isHoveringRef.current = false
      clearOverlayTimer()
      setIsOverlayVisible(true)
      videoElement.currentTime = 0
      const playPromise = videoElement.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            scheduleOverlayHide()
          })
          .catch(() => {
            setIsPlaying(false)
            setIsOverlayVisible(true)
          })
      } else if (!videoElement.paused) {
        setIsPlaying(true)
        scheduleOverlayHide()
      }
    } else {
      clearOverlayTimer()
      videoElement.pause()
      setIsPlaying(false)
      setIsOverlayVisible(true)
    }

    return () => {
      clearOverlayTimer()
      videoElement.removeEventListener('play', handlePlay)
      videoElement.removeEventListener('pause', handlePause)
    }
  }, [isModalOpen, clearOverlayTimer, scheduleOverlayHide])

  const togglePlayback = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (videoElement.paused) {
      setIsOverlayVisible(true)
      const playPromise = videoElement.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            scheduleOverlayHide()
          })
          .catch(() => {
            setIsPlaying(false)
            setIsOverlayVisible(true)
          })
      } else {
        setIsPlaying(!videoElement.paused)
        scheduleOverlayHide()
      }
    } else {
      videoElement.pause()
      setIsPlaying(false)
      clearOverlayTimer()
      setIsOverlayVisible(true)
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Announcement bar */}
      <div
        className='relative w-full overflow-hidden px-4 text-white shadow-lg'
        style={{
          background:
            'linear-gradient(90deg, #020617 0%, #1e1b4b 50%, #020617 100%)',
          height: '56px'
        }}
      >
        <div className='mx-auto flex h-full max-w-[1400px] flex-col items-center justify-between gap-3 text-white sm:flex-row'>
          <div className='flex items-center gap-3 text-sm sm:text-base'>
            <span className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur'>
              <ShieldCheck className='h-4 w-4 text-white' aria-hidden='true' />
            </span>
            <p>
              Discover why{' '}
              <span className='font-semibold'>Sharkdom is secure</span> for
              partner sharing
            </p>
          </div>
          <div className='flex items-center gap-2 sm:gap-3'>
            <button
              type='button'
              onClick={() => setIsModalOpen(true)}
              className={cn(
                'group relative z-10 inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#3E5DA1] bg-[#5B76FF] px-4',
                'font-sansGeneral text-sm font-semibold leading-none text-white',
                'shadow-[0px_3px_0px_0px_#3E5DA1]',
                'transition hover:translate-y-px hover:shadow-[0px_2px_0px_0px_#3E5DA1]',
                'active:translate-y-[2px] active:shadow-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617]'
              )}
            >
              <Play className='size-4 shrink-0 text-white' aria-hidden='true' />
              Watch Video
              <ArrowRight
                className='size-3.5 shrink-0 transition-transform group-hover:translate-x-px'
                strokeWidth={2.25}
                aria-hidden='true'
              />
            </button>
            <button
              type='button'
              onClick={() => setIsVisible(false)}
              className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
              aria-label='Dismiss security announcement'
            >
              <X className='h-4 w-4' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div
          className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm'
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsModalOpen(false)
            }
          }}
        >
          <div className='relative w-full max-w-4xl overflow-hidden rounded-3xl bg-black shadow-2xl'>
            <button
              type='button'
              onClick={() => setIsModalOpen(false)}
              className='absolute right-4 top-4 z-[1] flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80'
              aria-label='Close video'
            >
              <X className='h-5 w-5' aria-hidden='true' />
            </button>
            <div
              className='relative'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <video
                ref={videoRef}
                src='https://storage.googleapis.com/sharkdom_resources/Promo%233.mp4'
                className='h-full w-full'
                controls
                playsInline
              />
              <button
                type='button'
                onClick={togglePlayback}
                className={cn(
                  'group absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 p-3 transition-opacity duration-300',
                  isOverlayVisible
                    ? 'opacity-100'
                    : 'pointer-events-none opacity-0'
                )}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                <span className='absolute inset-0 -z-10 rounded-full bg-[rgba(129,140,248,0.7)] blur-lg transition duration-300 group-hover:bg-[rgba(129,140,248,0.9)] group-active:bg-[rgba(99,102,241,0.9)]' />
                <span className='relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-[0_0_35px_rgba(99,102,241,0.65)] transition duration-300 group-hover:bg-white group-active:bg-[#f8f8f8]'>
                  {isPlaying ? (
                    <Pause className='h-8 w-8' aria-hidden='true' />
                  ) : (
                    <Play className='ml-1 h-8 w-8' aria-hidden='true' />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

const NewHeader = () => {
  const router = useRouter()
  const pathname = usePathname()
  const isKifloComparePage = pathname === '/compare/sharkdom-vs-kiflo'
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isHomePage, setIsHomePage] = useState(false)
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false)
  const [userDataCached, setUserDataCached] = useState(false)

  const { scrollY } = useScroll()

  const backgroundColor = useTransform(scrollY, [0, 100], ['#fff', '#ffffff'])
  const color = useTransform(scrollY, [0, 100], ['#676767', '#676767'])

  const [hidden, setHidden] = useState(false)

  const headerRef = useRef<HTMLDivElement | null>(null)
  const navPillRef = useRef<HTMLElement | null>(null)
  const announcementRef = useRef<HTMLDivElement | null>(null)
  const lastScrollY = useRef(0)
  const [hideAnnouncement, setHideAnnouncement] = useState(false) // true -> announcement hidden
  const [navbarTransparent, setNavbarTransparent] = useState(false) // true -> transparent navbar
  /**
   * SSR / first paint fallback: full stack ≈ promo (56) + pill mt (24 md) + pill (~52).
   * Real value is set in useLayoutEffect from promo + absolutely positioned pill.
   */
  const [headerHeight, setHeaderHeight] = useState<number>(140)

  const [country, setCountry] = useState('IN')

  // Background user fetch function
  const fetchUserData = useCallback(async () => {
    if (userDataCached) {
      return user
    }

    try {
      const { user } = await getServerUser()
      setUser(user)
      setUserDataCached(true)
      setIsAuthLoading(false)
      return user
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUser(null)
      setUserDataCached(true)
      setIsAuthLoading(false)
      return null
    }
  }, [user, userDataCached])

  // Handle dashboard navigation with complete routing logic
  const handleDashboardClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      setIsLoadingDashboard(true)

      try {
        // Proactively refresh token before any server call so 401 is avoided when refresh token is still valid
        await triggerTokenRefresh(true)

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
        // if (!currentOrganization && pendingJoin) {
        //   router.push('/onboarding/waiting')
        //   return
        // }

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
        const isAuthError =
          error instanceof Error &&
          (error.message.includes('Token refresh failed') ||
            error.message.includes('Session expired') ||
            error.message.includes('log in again'))
        showCustomToast(
          'Error',
          isAuthError
            ? 'Session expired. Please log in again.'
            : 'Error loading dashboard. Please try again.',
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

    // Fetch user data immediately to prevent UI flicker
    fetchUserData()

    fetchCountry()
  }, [pathname, fetchUserData])

  useLayoutEffect(() => {
    const root = headerRef.current
    if (!root) return

    /**
     * The pill lives in `position: absolute` under `headerRef`, so the root's
     * layout height is only the security promo bar. Spacer must extend to the
     * bottom of the pill or the hero slides under the nav / jumps when measured.
     */
    const measure = () => {
      const rootRect = root.getBoundingClientRect()
      const pillEl = navPillRef.current
      let bottom = rootRect.bottom
      if (pillEl) {
        bottom = Math.max(bottom, pillEl.getBoundingClientRect().bottom)
      }
      const h = Math.max(0, Math.round(bottom - rootRect.top))
      // Set in the same pass as the spacer so marketing heroes never fall back
      // to 140px while the placeholder is taller (white band above the jumbotron).
      document.documentElement.style.setProperty(
        '--marketing-header-height',
        `${h}px`
      )
      setHeaderHeight(h)
    }

    measure()
    requestAnimationFrame(() => {
      measure()
    })

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => measure())
        : null
    ro?.observe(root)
    if (navPillRef.current) {
      ro?.observe(navPillRef.current)
    }

    window.addEventListener('resize', measure, { passive: true })

    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', measure)
      document.documentElement.style.removeProperty('--marketing-header-height')
    }
  }, [])

  // scroll behavior:
  // - hide announcement when scrolling down (after small threshold)
  // - show announcement when near top or user scrolls up
  // - make navbar transparent when user has scrolled down a bit (so content visible behind)
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY || window.pageYOffset
      const diff = currentY - lastScrollY.current
      const tolerance = 8

      // small tolerance to reduce jitter
      if (Math.abs(diff) < tolerance) {
        // don't change state for tiny moves
      } else {
        // if scrolling down and passed 30px, hide announcement
        if (diff > 0 && currentY > 30) {
          setHideAnnouncement(true)
        } else if (diff < 0) {
          // scrolling up -> reveal announcement when close to top
          if (currentY < 80) {
            setHideAnnouncement(false)
          } else {
            // optional: keep announcement hidden while mid-page even if scrolling up
            setHideAnnouncement(true)
          }
        }
      }

      // navbarTransparency: make transparent when scrolled even a little
      setNavbarTransparent(currentY > 10)

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // motion variants for announcement bar
  const announceVariants = {
    visible: {
      height: 'auto',
      opacity: 1,
      y: 0,
      transition: { duration: 0.28 }
    },
    hidden: { height: 0, opacity: 0, y: -10, transition: { duration: 0.28 } }
  }

  return (
    <>
      {/* placeholder to avoid content jump when header is fixed */}
      <div style={{ height: headerHeight }} aria-hidden />

      <div
        ref={headerRef}
        className='fixed left-0 right-0 top-0 z-[999] bg-transparent'
        style={{ pointerEvents: 'auto' }}
      >
        {/* Security Promo Banner */}
        <SecurityPromoBanner />
        {/* Main navbar */}
        <div className='absolute flex w-full justify-center'>
          <MaxWidthWrapper>
            <header
              ref={navPillRef}
              className={cn(
                'mt-4 min-w-0 max-w-full overflow-visible rounded-full border px-4 py-2 transition-all duration-300 ease-in-out md:mt-6 lg:px-6',
                isKifloComparePage
                  ? 'border-[#DDDCFF]/80 bg-white/60 shadow-[0px_1px_2px_rgba(14,17,27,0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/45'
                  : 'border-[#DDDCFF] bg-white'
              )}
            >
              {/*
                xl+: 1fr / auto / 1fr keeps the mega-menu centered in the pill when the
                right CTA cluster changes width after auth resolves (avoids nav drift).
                Below xl: flex + hamburger (tablet / narrow desktop) so items don’t overflow.
              */}
              <div className='relative flex min-w-0 items-center justify-between gap-2 sm:gap-3 xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:items-center xl:justify-items-stretch xl:gap-2 2xl:gap-4'>
                <Link
                  href='/'
                  className='flex min-w-0 shrink-0 items-center text-xl font-semibold xl:justify-self-start'
                >
                  <NewFullLogo className=' h-5 w-full md:h-5' />
                </Link>

                <div className='hidden min-w-0 justify-self-center xl:block'>
                  <NewNav headerPillRef={navPillRef} />
                </div>

                <div className='flex min-w-0 shrink-0 items-center justify-end gap-1.5 sm:gap-2 xl:justify-self-end'>
                  {isAuthLoading ? null : user ? (
                    <>
                      <button
                        type='button'
                        onClick={handleDashboardClick}
                        disabled={isLoadingDashboard}
                        className={cn(
                          'group relative z-10 hidden h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#3E5DA1] bg-[#5B76FF] px-4',
                          'font-sansGeneral text-sm font-semibold leading-none text-white',
                          'shadow-[0px_3px_0px_0px_#3E5DA1]',
                          'transition hover:translate-y-px hover:shadow-[0px_2px_0px_0px_#3E5DA1]',
                          'active:translate-y-[2px] active:shadow-none',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB]/40 focus-visible:ring-offset-2',
                          'disabled:cursor-not-allowed disabled:opacity-70 xl:flex'
                        )}
                      >
                        {isLoadingDashboard ? (
                          <>
                            <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white' />
                            Loading...
                          </>
                        ) : (
                          <>
                            Go to Dashboard
                            <ArrowRight
                              className='size-3.5 shrink-0 stroke-[2.25]'
                              aria-hidden
                            />
                          </>
                        )}
                      </button>
                      <button
                        type='button'
                        aria-label='Go to Dashboard'
                        onClick={handleDashboardClick}
                        disabled={isLoadingDashboard}
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#3E5DA1] bg-[#5B76FF] text-white shadow-[0px_3px_0px_0px_#3E5DA1] transition hover:translate-y-px hover:shadow-[0px_2px_0px_0px_#3E5DA1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB]/40 focus-visible:ring-offset-2 active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70 xl:hidden'
                        )}
                      >
                        {isLoadingDashboard ? (
                          <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white' />
                        ) : (
                          <LayoutDashboard className='size-4' />
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className='hidden items-center gap-2 xl:flex'>
                        <Link
                          href='/login'
                          className={cn(
                            'relative z-10 inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-[#5B76FF] bg-white px-4',
                            'font-sansGeneral text-sm font-semibold leading-none text-[#5B76FF]',
                            'shadow-[0px_3px_0px_0px_#5B76FF]',
                            'transition hover:translate-y-px hover:bg-[#F8F9FF] hover:shadow-[0px_2px_0px_0px_#5B76FF]',
                            'active:translate-y-[2px] active:shadow-none',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B76FF] focus-visible:ring-offset-2'
                          )}
                        >
                          Login
                        </Link>
                        <Link
                          href='/book-demo'
                          className={cn(
                            'relative z-10 inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#3E5DA1] bg-[#5B76FF] px-4',
                            'font-sansGeneral text-sm font-semibold leading-none text-white',
                            'shadow-[0px_3px_0px_0px_#3E5DA1]',
                            'transition hover:translate-y-px hover:shadow-[0px_2px_0px_0px_#3E5DA1]',
                            'active:translate-y-[2px] active:shadow-none',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB]/40 focus-visible:ring-offset-2'
                          )}
                        >
                          Book a Demo
                          <ArrowRight
                            className='size-3.5 shrink-0'
                            strokeWidth={2.25}
                            aria-hidden
                          />
                        </Link>
                      </div>
                    </>
                  )}

                  <MobileNav />
                </div>
              </div>
            </header>
          </MaxWidthWrapper>
        </div>
      </div>
    </>
  )
}

export default NewHeader
