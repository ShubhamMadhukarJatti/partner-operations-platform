import React, { useMemo } from 'react'
import { CheckCircle, Sparkles } from 'lucide-react'

import ContinueLearningSection from '../_components/ContinueLearningSection'
import { CourseCardProps } from '../_components/CourseCard'
import CourseGridSection from '../_components/CourseGridSection'
import { GridCourseProps } from '../_components/GridCourseCard'
import HomeHero from '../_components/HomeHero'

// import MilestonesSection from '../_components/MilestonesSection'

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

interface DashboardStats {
  assignedCourses: number
  completedCourses: number
  certificates: number
  avgReadinessPercentage: number
}

interface HomeTabProps {
  continueCourses: ApiCourse[]
  assignedCourses: ApiCourse[]
  loading?: boolean
  stats?: DashboardStats | null
  statsLoading?: boolean
}

// Helper function to map API course to GridCourseProps
const mapApiCourseToGridCourse = (
  course: ApiCourse,
  index: number
): GridCourseProps => {
  const levelMap: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced'
  }

  // Generate a color based on index for placeholder
  const colors = ['#1e293b', '#fbbf24', '#d8b4fe', '#10b981', '#3b82f6']
  const coverColor = colors[index % colors.length]

  return {
    id: course.courseId.toString(),
    level: levelMap[course.level] || 'Beginner',
    coverColor,
    thumbnailUrl: course.thumbnailUrl,
    title: course.title,
    modulesCount: course.modules,
    duration:
      course.durationInMinutes === 1
        ? '1 Min'
        : `${course.durationInMinutes} Mins`
  }
}

// Helper function to map API course to CourseCardProps
const mapApiCourseToCourseCard = (
  course: ApiCourse,
  index: number
): CourseCardProps => {
  return {
    id: course.courseId.toString(),
    coverImage: course.thumbnailUrl || '',
    title: course.title,
    modulesCount: course.modules,
    completionPercentage: course.progressPercentage || 0,
    timeLabel: course.progressPercentage > 0 ? 'Deadline' : 'Duration',
    timeValue:
      course.durationInMinutes === 1
        ? '1 Min'
        : `${course.durationInMinutes} Mins`,
    dueText: course.progressPercentage > 0 ? undefined : undefined,
    dueColor: course.progressPercentage > 0 ? 'red' : 'gray',
    ctaText: course.progressPercentage > 0 ? 'Continue' : 'Start'
  }
}

const HomeTab = ({
  continueCourses,
  assignedCourses,
  loading = false,
  stats,
  statsLoading = false
}: HomeTabProps) => {
  // Map continue courses for ContinueLearningSection
  const mappedContinueCourses = useMemo(
    () => continueCourses.map(mapApiCourseToCourseCard),
    [continueCourses]
  )

  // Map assigned courses for CourseGridSection
  const mappedAssignedCourses = useMemo(
    () => assignedCourses.map(mapApiCourseToGridCourse),
    [assignedCourses]
  )

  return (
    <>
      <HomeHero stats={stats} statsLoading={statsLoading} />
      <div className='flex gap-6'>
        <div className='min-w-0 flex-1'>
          <ContinueLearningSection
            courses={mappedContinueCourses}
            loading={loading}
          />
          <CourseGridSection
            title='Courses assigned'
            icon={<CheckCircle size={16} />}
            infoTooltip='Courses assigned to you by your organization'
            courses={mappedAssignedCourses}
          />
          {/* AI recommended courses - keeping empty for now as API doesn't provide this */}
          {/* <CourseGridSection
            title='AI recommended courses'
            icon={<Sparkles size={16} />}
            infoTooltip='Courses recommended based on your role and activity'
            courses={[]}
          /> */}
        </div>
        {/* <div className='hidden w-[300px] shrink-0 lg:block'>
          <MilestonesSection />
        </div> */}
      </div>
    </>
  )
}

export default HomeTab
