import React from 'react'

import OrganizationCardLoader from '../dashboard-loader/organization-card-loader'
import SidebarLoader from '../dashboard-loader/sidebar-loader'
import TopbarLoader from '../dashboard-loader/topbar-loader'
import { Card, CardContent, CardFooter } from './card'
import { Skeleton } from './skeleton'

const DashboardLoader = () => {
  return (
    <div className='flex h-screen bg-muted'>
      <SidebarLoader />
      <div className='w-full'>
        <TopbarLoader />
        <div className='mx-10 my-7'>
          <div className='rounded-xl bg-white p-6'>
            <div className='flex items-center justify-between'>
              <Skeleton className=' h-6 w-full min-w-[28rem] max-w-md bg-[#E9E9E9]  ' />
              <Skeleton className=' h-6 w-full min-w-24  max-w-24 bg-[#E9E9E9] ' />
            </div>
            <div className='mt-8 grid w-full grid-cols-1 place-items-center gap-4 sm:grid-cols-2  lg:grid-cols-[repeat(auto-fit,_minmax(min(100%,_20rem),_1fr))]   '>
              {[...Array(6)].map((_, i) => (
                <OrganizationCardLoader key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLoader

export const LoadingCard = () => {
  return (
    <Card className='flex h-full w-full flex-col gap-2'>
      <CardContent className='flex flex-1 flex-col gap-2 overflow-hidden'>
        <div className='flex items-center justify-between'>
          <Skeleton className='size-16 rounded-full' />
          <Skeleton className='h-8 w-24 rounded-full' />
        </div>

        <Skeleton className='h-7 w-1/2' />
        <div className='flex flex-col gap-0.5'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-4/5' />
          <Skeleton className='h-4 w-1/2' />
        </div>
      </CardContent>
      <CardFooter className='justify-end'>
        <Skeleton className='h-9 w-24 rounded-lg' />
      </CardFooter>
    </Card>
  )
}
