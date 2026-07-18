'use client'

import React from 'react'

import { Organization } from '@/lib/db/search'
import { Button } from '@/components/ui/button'
import CreateCustomerPersona from '@/app/(app)/(account-settings)/settings/_components/create-customer-persona'

type Props = {
  organization: Organization
  data: any
}

const CustomerPersonaComparison = ({ organization, data }: Props) => {
  const properties = [
    'Company sector',
    'Market Segment',
    'Company Size',
    'Activated partnership'
  ]

  return (
    <div className='flex flex-col gap-4'>
      {/* make this wrapper scrollable on small screens */}
      <div className='overflow-x-auto rounded-lg border'>
        {/* Inner wrapper controls natural width so columns don't squash */}
        <div className='min-w-[700px]'>
          <div className='grid grid-cols-4 border-b bg-neutral-100 p-4'>
            <div className='py-4 text-sm font-medium text-gray-600'>
              Properties
            </div>
            <div className='py-4 text-sm font-medium text-gray-600'>
              {organization.name} customer persona (You)
            </div>
            <div className='py-4 text-sm font-medium text-gray-600'>
              {data?.name} customer persona
            </div>
            <div className='py-4 text-sm font-medium text-gray-600'>
              Match %
            </div>
          </div>

          <div className='grid grid-cols-4'>
            <div className='border-r'>
              {properties.map((property, index) => (
                <div key={index} className='border-b p-4 py-8 last:border-b-0'>
                  <div className='text-sm font-medium'>{property}</div>
                </div>
              ))}
            </div>

            <div className='row-span-4 flex flex-col items-start justify-center border-r p-4'>
              <div className='text-sm text-gray-600'>
                Your customer persona is not created.
              </div>
              <CreateCustomerPersona isOfflinePartners />
            </div>

            <div className='row-span-4 flex flex-col items-start justify-center border-r py-4 md:pl-2'>
              <div className='text-sm text-gray-600'>
                Partner customer persona is not created.
              </div>
              <div className='mt-2 flex flex-col gap-2'>
                <Button
                  variant='primary'
                  disabled
                  className='cursor-not-allowed'
                >
                  Upload customer list
                </Button>
                <Button
                  variant='primary'
                  disabled
                  className='cursor-not-allowed'
                >
                  Use co-pilot
                </Button>
              </div>
            </div>

            <div>
              {['-', '-', '-', '-'].map((value, index) => (
                <div key={index} className='border-b p-4 py-8 last:border-b-0'>
                  <div className='text-sm'>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='rounded-lg bg-gray-100 p-4'>
        <div className='flex items-center justify-between'>
          <div className='text-sm font-medium'>
            See how the comparison table looks
          </div>
          <Button variant='link' className='text-blue-600'>
            View
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CustomerPersonaComparison
