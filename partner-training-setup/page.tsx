'use client'

import React from 'react'
import { BookOpen, Home } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import CoursesTab from './view/CoursesTab'
import HomeTab from './view/HomeTab'

const PartnerTrainingSetupPage = () => {
  return (
    <GradientPageBackground>
      <div className='flex h-full w-full flex-col bg-white dark:bg-transparent'>
        <Tabs defaultValue='home' className='w-full'>
          {/* Tabs Header */}
          <div className='border-b border-gray-200 px-8 dark:border-border'>
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
          <div className='px-8 py-6'>
            <TabsContent
              value='home'
              className='mt-0 space-y-12 focus-visible:ring-0'
            >
              <HomeTab />
            </TabsContent>

            <TabsContent value='courses' className='mt-0 focus-visible:ring-0'>
              <CoursesTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </GradientPageBackground>
  )
}

export default PartnerTrainingSetupPage
