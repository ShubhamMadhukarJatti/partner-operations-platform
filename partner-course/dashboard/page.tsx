'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Bell,
  BookOpen,
  ChevronDown,
  Download,
  GraduationCap,
  Info,
  Play,
  Settings,
  Sparkles,
  Users
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import WelcomeMessage from '@/components/welcome-message/WelcomeMessage'
import PartnersList, {
  Partner
} from '@/app/(app)/(dashboard-pages)/partner-training-setup/view/_components/PartnersList'
import GridCourseCard, {
  GridCourseProps
} from '@/app/(app)/(dashboard-pages)/partner-training/_components/GridCourseCard'
// Reuse components from partner-training
import StatCard from '@/app/(app)/(dashboard-pages)/partner-training/_components/StatCard'

import PartnerCourseCard, {
  PartnerCourseCardProps
} from './_components/PartnerCourseCard'
import PartnerCourseHeader from './_components/PartnerCourseHeader'

interface Certification {
  id: number
  courseId: number
  userId: string
  orgId: number
  certificateUrl: string
  courseName?: string // Will be populated from course data if available
  companyName?: string // Will be populated from org data if available
}

interface DashboardStats {
  assignedCourses: number
  completedCourses: number
  certificates: number
  avgReadinessScore: number
}

interface ApiCourse {
  courseId: number
  title: string
  thumbnailUrl?: string
  modules: number
  durationInMinutes: number
  level: string
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | string
  progressPercentage: number
}

interface CoursesResponse {
  continueCourses: ApiCourse[]
  courses: ApiCourse[]
  totalElements: number
  totalPages: number
  currentPage: number
}

const PartnerCourseDashboard = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'home' | 'courses'>('home')
  const [loading, setLoading] = useState(true)
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [loadingPartners, setLoadingPartners] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState<boolean>(true)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [continueCourses, setContinueCourses] = useState<
    PartnerCourseCardProps[]
  >([])
  const [assignedCourses, setAssignedCourses] = useState<
    PartnerCourseCardProps[]
  >([])
  const [courseLoading, setCourseLoading] = useState<boolean>(true)
  const [courseError, setCourseError] = useState<string | null>(null)
  const [coursesPage, setCoursesPage] = useState<number>(1)
  const [coursesTotalPages, setCoursesTotalPages] = useState<number>(1)
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'
  >('ALL')
  const [userId, setUserId] = useState<string>('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Get preview URL for certificate
  const getPreviewUrl = (url: string): string => {
    if (!url) return url

    // If it's an S3 URL, use Google Docs viewer for PDFs or direct link for images
    if (url.includes('s3.') || url.includes('amazonaws.com')) {
      // Check if it's a PDF
      if (url.toLowerCase().endsWith('.pdf')) {
        return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
      }
      // For images, return direct URL
      if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return url
      }
    }
    return url
  }

  // Handle certificate preview
  const handleViewCertificate = (certificateUrl: string) => {
    const previewUrl = getPreviewUrl(certificateUrl)
    setPreviewUrl(previewUrl)
    setOriginalUrl(certificateUrl) // Store original URL for download
    setIsPreviewOpen(true)
  }

  // Handle certificate download
  const handleDownloadCertificate = (url: string) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = '' // Let browser determine filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const mapCourse = (course: ApiCourse): PartnerCourseCardProps => {
    const safeLevel =
      (course.level as 'Beginner' | 'Intermediate' | 'Advanced') || 'Beginner'

    // Format duration
    const duration =
      course.durationInMinutes === 1
        ? '1 Min'
        : `${course.durationInMinutes} Mins`

    return {
      id: String(course.courseId),
      level: safeLevel,
      coverImageUrl: course.thumbnailUrl,
      coverColor: '#E5E7EB',
      title: course.title,
      modulesCount: course.modules,
      duration: duration,
      durationMinutes: course.durationInMinutes,
      completionPercentage: course.progressPercentage
    }
  }

  // Fetch userId on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUserId(data.user?.uid || '')
        }
      } catch (error) {
        console.error('Error fetching user ID:', error)
      }
    }
    fetchUserId()
  }, [])

  useEffect(() => {
    // Fetch certifications
    const fetchCertifications = async () => {
      if (!userId) return

      try {
        setLoading(true)
        const response = await fetch(`/api/partner/training/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to fetch certifications:', errorData)
          setCertifications([])
          return
        }

        const data = await response.json()

        // Handle different response formats
        let certificatesData = []
        if (data.success && Array.isArray(data.data)) {
          certificatesData = data.data
        } else if (Array.isArray(data)) {
          // If response is directly an array
          certificatesData = data
        } else if (data.data && Array.isArray(data.data)) {
          certificatesData = data.data
        }

        // Map API response to Certification format
        const mappedCertifications: Certification[] = certificatesData
          .filter((cert: any) => cert && cert.id) // Filter out invalid entries
          .map((cert: any) => ({
            id: cert.id,
            courseId: cert.courseId,
            userId: cert.userId,
            orgId: cert.orgId,
            certificateUrl: cert.certificateUrl || '',
            courseName: `Course ${cert.courseId}`, // Default name, can be enhanced with course details
            companyName: 'Partner Organization' // Default name, can be enhanced with org details
          }))
        setCertifications(mappedCertifications)

        console.log('Certificates loaded:', mappedCertifications.length)
      } catch (error) {
        console.error('Error fetching certifications:', error)
        setCertifications([])
      } finally {
        setLoading(false)
      }
    }

    fetchCertifications()
  }, [userId])

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoadingPartners(true)
        const response = await fetch(
          '/api/partner/training/dashboard/associated/partners',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to fetch partners:', errorData)
          setPartners([])
          return
        }

        const data = await response.json()

        if (data.success && data.data) {
          // Map API response to Partner format
          // API returns array of strings (partner organization names)
          const mappedPartners: Partner[] = Array.isArray(data.data)
            ? data.data.map((partnerName: string, index: number) => ({
                id: index,
                name: partnerName
              }))
            : []
          setPartners(mappedPartners)
        } else {
          setPartners([])
        }
      } catch (error) {
        console.error('Error fetching partners:', error)
        setPartners([])
      } finally {
        setLoadingPartners(false)
      }
    }

    fetchPartners()
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true)
        const res = await fetch('/api/partner-course/dashboard/stats')
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.message || 'Failed to fetch stats')
        }

        setStats(data?.data ?? null)
        setStatsError(null)
      } catch (error: any) {
        console.error('Error fetching stats:', error)
        setStatsError(error?.message || 'Failed to fetch stats')
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    // Refetch courses whenever the status filter or active tab changes
    // Reset to page 1 and don't append when filter changes
    setCoursesPage(1)
    setAssignedCourses([]) // Clear existing courses before fetching with new filter
    fetchCourses(1, false)
  }, [statusFilter, activeTab])

  const fetchCourses = async (pageToLoad = 1, append = false) => {
    try {
      setCourseLoading(true)
      // Convert 1-indexed page to 0-indexed for API
      const apiPage = pageToLoad - 1

      // Fetch continue courses (in-progress courses)
      const continuePayloadBody: any = {
        page: apiPage,
        size: 10,
        status: 'IN_PROGRESS'
      }

      // Fetch assigned courses
      // For the courses tab, when statusFilter is 'ALL', don't send status at all
      // For the home tab, use 'ASSIGNED' status
      const assignedPayloadBody: any = {
        page: apiPage,
        size: 10
      }

      // Only include status when it's not 'ALL' (for the courses tab filtering)
      // For home tab, we want ASSIGNED courses
      if (statusFilter !== 'ALL') {
        assignedPayloadBody.status = statusFilter
      } else if (activeTab === 'home') {
        // On home tab, show ASSIGNED courses
        assignedPayloadBody.status = 'ASSIGNED'
      }

      // Fetch both continue courses and assigned courses in parallel
      const [continueRes, assignedRes] = await Promise.all([
        fetch('/api/partner-course/dashboard/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(continuePayloadBody)
        }),
        fetch('/api/partner-course/dashboard/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(assignedPayloadBody)
        })
      ])

      const [continueData, assignedData] = await Promise.all([
        continueRes.json(),
        assignedRes.json()
      ])

      if (!continueRes.ok) {
        throw new Error(
          continueData?.message || 'Failed to fetch continue courses'
        )
      }

      if (!assignedRes.ok) {
        throw new Error(
          assignedData?.message || 'Failed to fetch assigned courses'
        )
      }

      const continuePayload: CoursesResponse = continueData?.data
      const assignedPayload: CoursesResponse = assignedData?.data

      const mappedContinue = (continuePayload?.courses || []).map(mapCourse)
      const mappedCourses = (assignedPayload?.courses || []).map(mapCourse)

      setContinueCourses((prev) =>
        append ? [...prev, ...mappedContinue] : mappedContinue
      )
      setAssignedCourses((prev) =>
        append ? [...prev, ...mappedCourses] : mappedCourses
      )

      // Use assigned courses pagination info
      const frontendCurrentPage =
        assignedPayload?.currentPage !== undefined
          ? assignedPayload.currentPage + 1
          : pageToLoad
      setCoursesTotalPages(assignedPayload?.totalPages || 1)
      setCoursesPage(frontendCurrentPage)
      setCourseError(null)
    } catch (error: any) {
      console.error('Error fetching courses:', error)
      setCourseError(error?.message || 'Failed to fetch courses')
    } finally {
      setCourseLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses(1, false)
  }, [])

  const filteredAssignedCourses = React.useMemo(() => {
    // The API already filters courses by status when statusFilter is not 'ALL'
    // So we should trust the API results and not do additional client-side filtering
    // Just return the courses that the API returned
    return assignedCourses
  }, [assignedCourses])

  const formatNumber = (value?: number) => {
    if (value === null || value === undefined) return '—'
    return value.toLocaleString()
  }

  const formatPercent = (value?: number) => {
    if (value === null || value === undefined) return '—'
    return `${value}%`
  }

  const handleCourseClick = (courseId: string) => {
    router.push(`/partner-course/dashboard/${courseId}`)
  }

  const handleViewAllCourses = () => {
    setActiveTab('courses')
  }

  return (
    <div className='flex min-h-screen w-full flex-col bg-white'>
      {/* Header */}
      <PartnerCourseHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      {activeTab === 'home' && (
        <div className='flex-1'>
          {/* Welcome Hero Section */}
          <div
            className='relative w-full overflow-hidden rounded-t-[40px] px-10 py-12'
            style={{
              background:
                'linear-gradient(359.14deg, #FFFFFF 0.66%, #E7E7FF 98.72%)'
            }}
          >
            {/* Background Pattern */}
            <div className='absolute right-0 top-0 h-full w-1/2'>
              <div className='h-full w-full bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-pink-100/20 opacity-50' />
            </div>

            {/* Content */}
            <WelcomeMessage subtitle='Welcome back' />

            {/* Vertical spacing between hero text and stats */}
            <div className='h-12' />

            {/* Stats Row */}
            <div className='relative z-10 grid grid-cols-1 gap-6 md:grid-cols-4'>
              <StatCard
                label='Assigned Courses'
                value={
                  statsLoading
                    ? '...'
                    : statsError
                      ? '0'
                      : formatNumber(stats?.assignedCourses)
                }
              />
              <StatCard
                label='Courses Completed'
                value={
                  statsLoading
                    ? '...'
                    : statsError
                      ? '0'
                      : formatNumber(stats?.completedCourses)
                }
              />
              <StatCard
                label='Certificates'
                value={
                  statsLoading
                    ? '...'
                    : statsError
                      ? '0'
                      : formatNumber(stats?.certificates)
                }
              />
              <StatCard
                label='Avg Readiness Score'
                value={
                  statsLoading
                    ? '...'
                    : statsError
                      ? '0'
                      : formatPercent(stats?.avgReadinessScore)
                }
              />
            </div>
          </div>

          <div className='flex gap-6 px-10 py-6'>
            {/* Main Content */}
            <div className='min-w-0 flex-1'>
              {/* Continue Learning Section */}
              <div className='mb-12'>
                <div className='flex flex-col gap-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600'>
                        <Play size={14} className='fill-current' />
                      </div>
                      <h2 className='text-lg font-bold text-gray-900'>
                        Continue where you have left
                      </h2>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info
                              size={16}
                              className='text-gray-400 hover:text-gray-600'
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Pick up right where you left off</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {/* <Button
                      variant='ghost'
                      className='group flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900'
                      onClick={handleViewAllCourses}
                    >
                      View All →
                    </Button> */}
                  </div>

                  {/* Horizontal Carousel */}
                  <Carousel
                    opts={{
                      align: 'start',
                      loop: false
                    }}
                    className='w-full'
                  >
                    <div className='absolute -top-12 right-0 flex gap-2'>
                      <CarouselPrevious className='static translate-y-0' />
                      <CarouselNext className='static translate-y-0' />
                    </div>
                    <CarouselContent className='-ml-4'>
                      {continueCourses.map((course) => (
                        <CarouselItem
                          key={course.id}
                          className='pl-4 md:basis-1/2 lg:basis-1/3'
                        >
                          <div onClick={() => handleCourseClick(course.id)}>
                            <PartnerCourseCard {...course} />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                  {courseLoading && continueCourses.length === 0 && (
                    <div className='mt-4 flex gap-4'>
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className='h-40 w-full rounded-xl' />
                      ))}
                    </div>
                  )}
                  {coursesPage < coursesTotalPages && (
                    <div className='mt-4 flex justify-end'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => fetchCourses(coursesPage + 1, true)}
                        disabled={courseLoading}
                      >
                        {courseLoading ? 'Loading...' : 'Load more'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Courses Assigned Section */}
              <div className='mb-12'>
                <div className='flex flex-col gap-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600'>
                        <Play size={14} className='fill-current' />
                      </div>
                      <h2 className='text-lg font-bold text-gray-900'>
                        Courses assigned
                      </h2>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info
                              size={16}
                              className='text-gray-400 hover:text-gray-600'
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Courses assigned to you by your organization</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {/* <Button
                      variant='ghost'
                      className='group flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900'
                      onClick={handleViewAllCourses}
                    >
                      View All →
                    </Button> */}
                  </div>

                  {/* Horizontal Carousel */}
                  <Carousel
                    opts={{
                      align: 'start',
                      loop: false
                    }}
                    className='w-full'
                  >
                    <div className='absolute -top-12 right-0 flex gap-2'>
                      <CarouselPrevious className='static translate-y-0' />
                      <CarouselNext className='static translate-y-0' />
                    </div>
                    <CarouselContent className='-ml-4'>
                      {assignedCourses.map((course) => (
                        <CarouselItem
                          key={course.id}
                          className='pl-4 md:basis-1/2 lg:basis-1/3'
                        >
                          <div onClick={() => handleCourseClick(course.id)}>
                            <PartnerCourseCard {...course} />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className='hidden w-[300px] shrink-0 space-y-6 lg:block'>
              {/* Certifications Earned */}
              <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
                <div className='mb-4 flex items-center gap-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600'>
                    <GraduationCap size={16} />
                  </div>
                  <h3 className='text-lg font-bold text-gray-900'>
                    Certifications Earned
                  </h3>
                </div>
                <div className='space-y-4'>
                  {loading ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className='h-16 w-full' />
                      ))}
                    </>
                  ) : certifications.length > 0 ? (
                    certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className='flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-all hover:border-gray-200 hover:shadow-sm'
                      >
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-medium text-gray-900'>
                            {cert.courseName || `Course ${cert.courseId}`}
                          </p>
                          <p className='truncate text-xs text-gray-500'>
                            {cert.companyName || 'Partner Organization'}
                          </p>
                        </div>
                        <div className='ml-2 flex items-center gap-2'>
                          {cert.certificateUrl ? (
                            <>
                              <Button
                                variant='outline'
                                size='sm'
                                className='h-8 text-xs'
                                onClick={() =>
                                  handleViewCertificate(cert.certificateUrl)
                                }
                              >
                                View
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0'
                                onClick={() =>
                                  handleDownloadCertificate(cert.certificateUrl)
                                }
                                title='Download certificate'
                              >
                                <Download size={14} />
                              </Button>
                            </>
                          ) : (
                            <span className='text-xs text-gray-400'>
                              No certificate
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center'>
                      <GraduationCap size={48} className='mb-3 text-gray-400' />
                      <p className='text-sm font-medium text-gray-600'>
                        You didn&apos;t earn any certificate yet
                      </p>
                      <p className='mt-1 text-xs text-gray-500'>
                        Complete courses to earn certificates
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Partners */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2 font-semibold text-gray-900'>
                  <div className='flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500'>
                    <Play size={10} fill='currentColor' />
                  </div>
                  <h3>Partners</h3>
                  <Info size={16} className='text-gray-400' />
                </div>

                <PartnersList
                  partners={partners}
                  loading={loadingPartners}
                  emptyMessage='No partners associated'
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className='flex-1 px-10 py-6'>
          <div className='flex flex-col gap-10'>
            {/* Continue Learning Carousel */}
            <div className='flex flex-col gap-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600'>
                    <Play size={14} className='fill-current' />
                  </div>
                  <h2 className='text-lg font-bold text-gray-900'>
                    Continue where you have left
                  </h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info
                          size={16}
                          className='text-gray-400 hover:text-gray-600'
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pick up right where you left off</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {/* <Button
                  variant='ghost'
                  className='group flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900'
                >
                  View All →
                </Button> */}
              </div>

              {/* Horizontal Carousel */}
              <Carousel
                opts={{
                  align: 'start',
                  loop: false
                }}
                className='w-full'
              >
                <div className='absolute -top-12 right-0 flex gap-2'>
                  <CarouselPrevious className='static translate-y-0' />
                  <CarouselNext className='static translate-y-0' />
                </div>
                <CarouselContent className='-ml-4'>
                  {continueCourses.map((course) => (
                    <CarouselItem
                      key={course.id}
                      className='pl-4 md:basis-1/2 lg:basis-1/3'
                    >
                      <div onClick={() => handleCourseClick(course.id)}>
                        <PartnerCourseCard {...course} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Courses Grid with Filters */}
            <div className='flex flex-col gap-6'>
              <div className='flex items-center gap-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600'>
                  <BookOpen size={14} className='fill-current' />
                </div>
                <h2 className='text-lg font-bold text-gray-900'>Courses</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info
                        size={16}
                        className='text-gray-400 hover:text-gray-600'
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Browse all available courses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Filter Pills */}
              <div className='flex flex-wrap items-center gap-2'>
                {[
                  { label: 'All', value: 'ALL' },
                  { label: 'Assigned', value: 'ASSIGNED' },
                  { label: 'In Progress', value: 'IN_PROGRESS' },
                  { label: 'Completed', value: 'COMPLETED' }
                ].map((filter) => (
                  <Button
                    key={filter.value}
                    variant='ghost'
                    size='sm'
                    onClick={() =>
                      setStatusFilter(
                        filter.value as
                          | 'ALL'
                          | 'ASSIGNED'
                          | 'IN_PROGRESS'
                          | 'COMPLETED'
                      )
                    }
                    className={`!h-auto rounded-md border border-solid px-2 py-1 text-xs font-medium transition-colors ${
                      statusFilter === filter.value
                        ? 'border-[#BEDBFF] bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
                        : 'border-[#E5E7EB] bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>

              {/* Courses Grid */}
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                {filteredAssignedCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <PartnerCourseCard {...course} />
                  </div>
                ))}
                {courseLoading && assignedCourses.length === 0 && (
                  <>
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className='h-64 w-full rounded-xl' />
                    ))}
                  </>
                )}
              </div>
              {coursesPage < coursesTotalPages && (
                <div className='flex justify-end'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => fetchCourses(coursesPage + 1, true)}
                    disabled={courseLoading}
                  >
                    {courseLoading ? 'Loading...' : 'Load more'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      <Dialog
        open={isPreviewOpen}
        onOpenChange={(open) => {
          setIsPreviewOpen(open)
          if (!open) {
            setPreviewUrl(null)
            setOriginalUrl(null)
          }
        }}
      >
        <DialogContent className='max-w-4xl bg-white p-6'>
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            {previewUrl && (
              <div className='relative h-[600px] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100'>
                {previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={previewUrl}
                    alt='Certificate preview'
                    className='h-full w-full object-contain'
                  />
                ) : (
                  <iframe
                    src={previewUrl}
                    className='h-full w-full'
                    title='Certificate preview'
                    sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
                  />
                )}
              </div>
            )}
          </div>
          <DialogFooter className='mt-4'>
            <Button variant='outline' onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            {originalUrl && (
              <Button
                onClick={() => {
                  handleDownloadCertificate(originalUrl)
                }}
                className='flex items-center gap-2 bg-gray-700 text-white hover:bg-gray-800'
              >
                <Download size={16} />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PartnerCourseDashboard
