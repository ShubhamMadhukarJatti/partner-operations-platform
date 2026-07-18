'use client'

import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { getEmailCampaigns } from '@/lib/db/email'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const CampaignTable = () => {
  const [campaignData, setCampaignData] = useState<any>(null)
  const [page, setPage] = useState<number>(0)

  const getPagination = (totalPages: number) => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i)

    const range: (number | string)[] = []

    if (page > 2) range.push(0, '...') // Show first page & '...'

    for (
      let i = Math.max(0, page - 2);
      i <= Math.min(totalPages - 1, page + 2);
      i++
    ) {
      range.push(i)
    }

    if (page < totalPages - 3) range.push('...', totalPages - 1) // Show last page & '...'

    return range
  }

  const getEmailCampaignsData = async () => {
    try {
      const response = await getEmailCampaigns(page)
      // if (!response.ok) {
      //     throw new Error('error fetching data')
      // }
      setCampaignData(response)
      console.log({ response })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getEmailCampaignsData()
  }, [page])
  return (
    <div className='mx-auto my-4 max-w-4xl overflow-hidden rounded-lg border bg-white shadow-sm'>
      <div className='flex flex-col'>
        <div className='-m-1.5 overflow-x-auto'>
          <div className='inline-block min-w-full p-1.5 align-middle'>
            <div className='overflow-hidden'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-muted py-2 '>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                    >
                      Template Code
                    </th>

                    <th
                      scope='col'
                      className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                    >
                      sent at
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                    >
                      bounce count
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                    >
                      open count
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                    >
                      click Count
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {campaignData &&
                    campaignData?.content?.map(
                      (emailStats: any, index: number) => (
                        <tr key={index}>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                            {emailStats?.templateCode}
                          </td>

                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                            {emailStats?.sentAt
                              ? format(
                                  new Date(emailStats?.sentAt),
                                  'dd-MM-yyyy'
                                )
                              : 'NA'}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                            {emailStats?.bounceCount}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                            {emailStats?.openCount}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                            {emailStats?.clickCount}
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
            <div className='flex items-center justify-center space-x-2 px-8 py-4'>
              <div className='flex w-full justify-between space-x-2'>
                <Button
                  className='flex items-center gap-1'
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((page) => page - 1)}
                  disabled={campaignData?.first}
                >
                  <ArrowLeft /> Previous
                </Button>

                <div>
                  {getPagination(campaignData?.totalPages).map((p, index) =>
                    typeof p === 'number' ? (
                      <Button
                        variant={'ghost'}
                        key={index}
                        className={cn(
                          'px-4',
                          page === p && 'bg-blue-500 text-white'
                        )}
                        onClick={() => setPage(p)}
                      >
                        {p + 1}
                      </Button>
                    ) : (
                      <span key={index} className='px-2'>
                        {p}
                      </span>
                    )
                  )}
                </div>

                <Button
                  className='flex items-center gap-1'
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((page) => page + 1)}
                  disabled={campaignData?.last}
                >
                  Next
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {campaignData?.content?.length === 0 && (
        <div className='col-span-4 flex h-56  items-center justify-center'>
          <h3 className='text-2xl font-bold  text-secondary-foreground '>
            No Statistics found
          </h3>
        </div>
      )}

      {campaignData === null && (
        <div className='col-span-4 flex h-56  items-center justify-center'>
          <h3 className='text-2xl font-bold  text-secondary-foreground '>
            Loading...
          </h3>
        </div>
      )}
    </div>
  )
}

export default CampaignTable
