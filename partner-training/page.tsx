'use client'

import React, { useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import { BookOpen, Home } from 'lucide-react'
import { useSelector } from 'react-redux'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { showCustomToast } from '@/components/custom-toast'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import CoursesTab from './view/CoursesTab'
import HomeTab from './view/HomeTab'

interface ApiCourse {
  courseId: number
  title: string
  thumbnailUrl: string | null
  modules: number
  durationInMinutes: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  status: string
  progressPercentage: number
}

interface DashboardCoursesResponse {
  success: boolean
  message: string
  data: {
    continueCourses: ApiCourse[]
    courses: ApiCourse[]
    totalElements: number
    totalPages: number
    currentPage: number
  }
}

interface DashboardStatsResponse {
  success: boolean
  message: string
  data: {
    assignedCourses: number
    completedCourses: number
    certificates: number
    avgReadinessPercentage: number
  }
}

const PartnerTrainingPage = () => {
  const [dashboardData, setDashboardData] = useState<
    DashboardCoursesResponse['data'] | null
  >(null)
  const [statsData, setStatsData] = useState<
    DashboardStatsResponse['data'] | null
  >(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [courseStatusFilter, setCourseStatusFilter] = useState<string | null>(
    'ASSIGNED'
  )

  // Get organization from Redux
  const organization = useSelector(
    (state: RootState) => state.currentOrg.organization
  )

  useEffect(() => {
    const fetchDashboardCourses = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get assignedOrgId from organization or use a default
        const assignedOrgId = organization?.id

        if (!assignedOrgId) {
          setError('Organization ID is required')
          setLoading(false)
          return
        }

        // For "All" filter, we might want to fetch without status filter
        // or fetch multiple statuses. For now, we'll use null to fetch all
        const status = courseStatusFilter || undefined

        const response = await fetch(
          '/api/partner/training/my/partner/assigned/dashboard/courses',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              assignedOrgId: assignedOrgId,
              ...(status && { status: status }),
              page: 0,
              size: 100 // Increased size to get more courses for filtering
            })
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to fetch courses')
        }

        const data: DashboardCoursesResponse = await response.json()

        if (data.success && data.data) {
          setDashboardData(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch courses')
        }
      } catch (err) {
        console.error('Error fetching dashboard courses:', err)
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch courses'
        setError(errorMessage)
        showCustomToast('Error', errorMessage, 'error', 5000)
      } finally {
        setLoading(false)
      }
    }

    if (organization?.id) {
      fetchDashboardCourses()
    } else {
      setLoading(false)
    }
  }, [organization?.id, courseStatusFilter])

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setStatsLoading(true)

        const response = await fetch(
          '/api/partner/training/my/partner/dashboard/stats',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to fetch stats')
        }

        const data: DashboardStatsResponse = await response.json()

        if (data.success && data.data) {
          setStatsData(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch stats')
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
        // Don't show toast for stats errors as they're not critical
      } finally {
        setStatsLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  return (
    <GradientPageBackground>
      <div className='flex min-h-screen w-full flex-col bg-white dark:bg-transparent'>
        <Tabs defaultValue='home' className='w-full'>
          {/* Tabs Header */}
          <div className='border-b border-gray-200 px-10 dark:border-border'>
            <TabsList className='h-auto justify-start gap-8 bg-transparent p-0'>
              <TabsTrigger
                value='home'
                className='flex items-center gap-2 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-3 pt-4 font-medium text-gray-500 shadow-none transition-all hover:text-gray-700 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none dark:text-white dark:text-white'
              >
                <Home size={18} />
                Home
              </TabsTrigger>
              <TabsTrigger
                value='courses'
                className='flex items-center gap-2 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-3 pt-4 font-medium text-gray-500 shadow-none transition-all hover:text-gray-700 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none dark:text-white dark:text-white'
              >
                <BookOpen size={18} />
                Courses
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Main Content */}
          <div className='px-10 py-6'>
            <TabsContent
              value='home'
              className='mt-0 space-y-12 focus-visible:ring-0'
            >
              <HomeTab
                continueCourses={dashboardData?.continueCourses || []}
                assignedCourses={dashboardData?.courses || []}
                loading={loading}
                stats={statsData}
                statsLoading={statsLoading}
              />
            </TabsContent>

            <TabsContent value='courses' className='mt-0 focus-visible:ring-0'>
              <CoursesTab
                continueCourses={dashboardData?.continueCourses || []}
                allCourses={dashboardData?.courses || []}
                loading={loading}
                onFilterChange={setCourseStatusFilter}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </GradientPageBackground>
  )
}

export default PartnerTrainingPage
