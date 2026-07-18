'use client'

import React from 'react'

import Hero from '../_components/Hero'
import PermissionContainer from '../_components/PermissionContainer'

const DataSharingPage = () => {
  return (
    <div className='flex flex-col gap-8 p-6'>
      <Hero />
      <PermissionContainer />
    </div>
  )
}

export default DataSharingPage
