import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Clock, FileText, Play } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'

export interface PartnerCourseCardProps {
  id: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  coverImageUrl?: string
  coverColor?: string
  title: string
  modulesCount: number
  duration: string
  durationMinutes: number
  completionPercentage?: number | null
}

const PartnerCourseCard = ({
  id,
  level,
  coverImageUrl,
  coverColor = '#E5E7EB',
  title,
  modulesCount,
  duration,
  durationMinutes,
  completionPercentage
}: PartnerCourseCardProps) => {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)
  const [userId, setUserId] = useState<string>('')

  // Calculate completion progress
  const completedMinutes = completionPercentage
    ? Math.round((completionPercentage / 100) * durationMinutes)
    : 0

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

  const handleStartClick = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent parent onClick from firing

    setIsStarting(true)

    try {
      if (!userId) {
        showCustomToast(
          'Error',
          'User information not available',
          'error',
          3000
        )
        return
      }

      // Update course status to IN_PROGRESS
      const res = await fetch(`/api/partner-course/course/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          courseId: parseInt(id),
          status: 'IN_PROGRESS'
        })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to start course')
      }

      // Navigate to learn page
      router.push(`/partner-course/dashboard/${id}/learn`)
    } catch (error) {
      console.error('Error starting course:', error)
      showCustomToast(
        'Error',
        error instanceof Error ? error.message : 'Failed to start course',
        'error',
        3000
      )
    } finally {
      setIsStarting(false)
    }
  }

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent parent onClick from firing
    router.push(`/partner-course/dashboard/${id}`)
  }

  return (
    <div className='flex h-full flex-col overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white p-4 shadow-sm transition-shadow hover:shadow-md'>
      <div className='flex flex-1 flex-col'>
        {/* Cover Image */}
        <div className='relative h-40 w-full overflow-hidden rounded-xl bg-gray-200'>
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={title}
              className='h-full w-full object-cover'
              onError={(e) => {
                // Fallback to color if image fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.style.backgroundColor = coverColor
                }
              }}
            />
          ) : (
            <div
              className='h-full w-full'
              style={{ backgroundColor: coverColor }}
            />
          )}

          {/* Level Badge */}
          <div className='absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm'>
            ^ {level}
          </div>
        </div>

        {/* Content */}
        <div className='mt-4 flex flex-1 flex-col gap-3'>
          {/* Title */}
          <h3 className='line-clamp-2 text-base font-bold text-gray-900'>
            {title}
          </h3>

          {/* Metadata Grid */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1'>
              <span className='text-[10px] font-medium text-gray-400'>
                Content
              </span>
              <div className='flex items-center gap-1.5 text-xs font-semibold text-gray-700'>
                <FileText size={12} className='text-gray-400' />
                {modulesCount} Modules
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-[10px] font-medium text-gray-400'>
                Duration
              </span>
              <div className='flex items-center gap-1.5 text-xs font-semibold text-gray-700'>
                <Clock size={12} className='text-gray-400' />
                {duration}
              </div>
            </div>
          </div>

          {/* Completion Status */}
          {completionPercentage !== null &&
            completionPercentage !== undefined && (
              <div className='flex flex-col gap-1'>
                <span className='text-[10px] font-medium text-gray-400'>
                  Completion
                </span>
                <div className='flex items-center gap-1.5 text-xs font-semibold text-gray-700'>
                  <CheckCircle2 size={12} className='text-gray-400' />
                  {completedMinutes}/{durationMinutes} mins
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className='mt-6 flex gap-2'>
        <Button
          onClick={handleStartClick}
          className='flex-1 rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700'
          disabled={isStarting}
          loading={isStarting}
          loadingText='Starting...'
        >
          <Play size={14} className='mr-1.5' />
          Start
        </Button>
        <Button
          onClick={handleViewDetailsClick}
          variant='outline'
          className='flex-1 rounded-xl border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-700 hover:bg-gray-100'
        >
          View Details
        </Button>
      </div>
    </div>
  )
}

export default PartnerCourseCard
