import React from 'react'
import Image from 'next/image'

import { Skeleton } from '@/components/ui/skeleton'
import WelcomeMessage from '@/components/welcome-message/WelcomeMessage'

import StatCard from './StatCard'

interface DashboardStats {
  assignedCourses: number
  completedCourses: number
  certificates: number
  avgReadinessPercentage: number
}

interface HomeHeroProps {
  stats?: DashboardStats | null
  statsLoading?: boolean
}

const HomeHero = ({ stats, statsLoading = false }: HomeHeroProps) => {
  return (
    <div className='relative w-full overflow-hidden rounded-[24px] border border-transparent bg-gradient-to-t from-white to-[#E7E7FF] px-10 py-12 dark:border-border dark:from-muted/40 dark:to-muted/20'>
      {/* Background Pattern */}
      <div className='absolute right-0 top-0 h-full w-1/2'>
        <Image
          src='/assets/partner-training/home-hero-pattern.png'
          alt='Pattern'
          fill
          className='object-contain object-right-top opacity-80 mix-blend-multiply dark:opacity-20 dark:mix-blend-screen'
        />
      </div>

      {/* Content */}
      <WelcomeMessage subtitle='Welcome back' />

      {/* Vertical spacing between hero text and stats */}
      <div className='h-12' />

      {/* Stats Row */}
      <div className='relative z-10 grid grid-cols-1 gap-6 md:grid-cols-4'>
        {statsLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className='h-24 w-full rounded-xl' />
            ))}
          </>
        ) : (
          <>
            <StatCard
              label='Assigned Courses'
              value={stats?.assignedCourses?.toString() || '0'}
            />
            <StatCard
              label='Courses Completed'
              value={stats?.completedCourses?.toString() || '0'}
            />
            <StatCard
              label='Certificates'
              value={stats?.certificates?.toString() || '0'}
            />
            <StatCard
              label='Avg Readiness Score'
              value={
                stats?.avgReadinessPercentage !== undefined
                  ? `${stats.avgReadinessPercentage}%`
                  : '0%'
              }
            />
          </>
        )}
      </div>
    </div>
  )
}

export default HomeHero
