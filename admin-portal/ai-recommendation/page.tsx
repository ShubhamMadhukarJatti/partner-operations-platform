import React from 'react'

import SimpleAiRecommendSection from '@/app/admin-portal/_components/SimpleAiRecommendDialog'

import AdminHeader from '../_components/admin-header'

const AIRecommendationPage = () => {
  return (
    <main className='min-h-screen bg-[#f4f4f4]'>
      <AdminHeader />
      <div className='mx-auto mt-10 max-w-4xl rounded-lg bg-white p-8 shadow-md'>
        <h1 className='mb-4 text-3xl font-bold text-blue-700'>
          AI Recommendation
        </h1>
        <p className='mb-8 text-lg text-gray-600'>
          Get instant AI-powered recommendations for your business goals.
        </p>
        <SimpleAiRecommendSection />
      </div>
    </main>
  )
}

export default AIRecommendationPage
