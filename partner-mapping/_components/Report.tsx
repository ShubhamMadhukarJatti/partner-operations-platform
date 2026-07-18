'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCollaborationsData } from '@/http-hooks/collaborations'
import { useGetPersonPartnerData } from '@/http-hooks/partner-match'
import { RootState } from '@/redux/store'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { useSelector } from 'react-redux'

import { fetcher } from '@/lib/server'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { showCustomToast } from '@/components/custom-toast'

// const matrixData = [
//   [
//     { count: 32, label: 'Overlaps', shared: true },
//     { count: 12, label: 'Overlaps', shared: true },
//     { count: 4, label: 'Overlaps', shared: false }
//   ],
//   [
//     { count: 8, label: 'Overlaps', shared: true },
//     { count: 5, label: 'Overlaps', shared: true },
//     { count: 12, label: 'Overlaps', shared: false }
//   ],
//   [
//     { count: 9, label: 'Overlaps', shared: true },
//     { count: 15, label: 'Overlaps', shared: true },
//     { count: 16, label: 'Overlaps', shared: false }
//   ]
// ]

const singularMap: Record<string, string> = {
  CUSTOMERS: 'CUSTOMER',
  PROSPECTS: 'PROSPECT',
  OPPORTUNITIES: 'OPPORTUNITY'
}

const CountSkeleton = () => (
  <Skeleton className='mx-auto h-[16px] w-[30px] rounded-xl bg-[#E2E2E2]' />
)

const OverlapSkeleton = () => (
  <Skeleton className='mx-auto mt-1.5 h-[12px] w-[80px] rounded-xl bg-[#E2E2E2]' />
)

const categories = ['A_CUSTOMERS', 'A_OPPORTUNITIES', 'A_PROSPECTS']
const partnerCategories = ['B_CUSTOMERS', 'B_OPPORTUNITIES', 'B_PROSPECTS']

const Report = () => {
  const { data, isLoading } = useCollaborationsData('ACTIVE')
  const router = useRouter()
  const saved = useSelector((state: RootState) => state.currentOrg)

  const { loading: orgLoading, organization } = saved
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)
  const { data: partnerData } = useGetPersonPartnerData(selectedPartner) as {
    data: any
  }
  const [buttonText, setButtonText] = useState('Request for Data')
  const [notifyLoader, setNotifyLoader] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const handlePartnerChange = (value: number) => {
    setSelectedPartner(value)
  }

  const matrixData = categories.map((aKey) => {
    return partnerCategories.map((bKey) => {
      const cleanedAKey = aKey.replace('A_', '')
      const cleanedBKey = bKey.replace('B_', '')

      const singularA = singularMap[cleanedAKey]
      const singularB = singularMap[cleanedBKey]

      const overlap = partnerData?.matrix?.[aKey]?.[bKey]?.overlap_count ?? 0
      return {
        count: overlap,
        label: 'Overlaps',
        shared: overlap > 0,
        onClick: () => {
          setSelectedColumn(`${singularA}_${singularB}`)
        },
        isActive: selectedColumn === `${singularA}_${singularB}`
      }
    })
  })

  const handleSendReminder = async () => {
    setNotifyLoader(true)
    try {
      const senderId = organization?.id
      const notifyId = selectedPartner

      const response = await fetcher(
        `/persona/notify?senderId=${senderId}&notifyId=${notifyId}`,
        {
          method: 'POST'
        }
      )

      setButtonText('Notified')
      setTimeout(() => {
        setButtonText('Request for Data')
        setButtonDisabled(false)
      }, 5000)

      setButtonDisabled(true)
      showCustomToast('Success', 'Notification sent', 'success', 5000)
    } catch (error) {
      console.error('Error sending reminder:', error)
      showCustomToast('Error', 'Error sending reminder', 'error', 5000)
      setButtonDisabled(false)
    } finally {
      setNotifyLoader(false)
    }
  }

  const shouldShowLoader = () => {
    return !(
      data && partnerData?.matrix?.A_CUSTOMERS?.B_CUSTOMERS?.records?.length
    )
  }

  return (
    <div className='flex flex-col gap-8 pb-10'>
      <div className='mt-8 flex justify-between'>
        <div>
          <h2 className='text-xl font-bold text-[#2A3241]'>Create report</h2>
          <p className='text-sm font-normal text-[#4D5C78]'>
            Subtext about the create report here in less than 2 lines{' '}
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-6'>
        <div>
          <h3 className='mb-3 text-base font-semibold'>Select a Partner</h3>
          <Select
            onValueChange={(val: string) => handlePartnerChange(Number(val))}
          >
            <SelectTrigger className='w-full rounded-md border'>
              <SelectValue placeholder='Select a partner organization' />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value='loading'>Loading...</SelectItem>
              ) : data?.content?.length > 0 ? (
                data?.content.map((item: any) => (
                  <SelectItem
                    key={item.partnerOrganizationId}
                    value={item.partnerOrganizationId}
                  >
                    {item.organizationName}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value='no data' disabled>
                  No active partners
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <h3 className='mb-3 text-base font-semibold'>Select Comparison</h3>
          <div className=''>
            <div className='rounded-lg border shadow'>
              <div className='flex items-center justify-between p-4'>
                <h2 className='text-lg font-semibold'>
                  Account mapping matrix
                </h2>
              </div>

              <div className='overflow-x-auto'>
                <table className='w-full table-auto border-collapse text-center'>
                  <thead>
                    <tr className='text-left text-[#2A3241] '>
                      <th
                        rowSpan={2}
                        className='w-[193px] border px-4 py-3 font-normal'
                      >
                        <div className='flex items-center gap-2'>
                          <div className='h-4 w-4 rounded-[4px] bg-[#3E50F7]'></div>{' '}
                          {organization?.name}
                        </div>
                      </th>
                      <th colSpan={3} className='border px-4 py-3 font-normal'>
                        <div className='flex items-center gap-2'>
                          <div className='h-4 w-4 rounded-[4px] bg-black'></div>{' '}
                          {partnerData ? partnerData?.partnerName : 'Partner'}
                        </div>
                      </th>
                    </tr>
                    <tr className='text-left'>
                      <th className='w-[193px] border px-4 py-3 font-normal text-[#000000]'>
                        Customers
                      </th>
                      <th className='w-[193px] border px-4 py-3 font-normal text-[#000000]'>
                        Open opportunities
                      </th>
                      <th className='w-[193px] border px-4 py-3 font-normal text-[#000000]'>
                        Prospects
                      </th>
                    </tr>
                  </thead>
                  <tbody className='relative'>
                    {matrixData.map((row, i) => (
                      <tr key={i}>
                        <th className='border px-2 py-1 text-left font-medium'>
                          {i === 0
                            ? 'Customers'
                            : i === 1
                              ? 'Open opportunities'
                              : 'Prospects'}
                        </th>
                        {row.map((cell, j) => (
                          <td key={j} className={`border p-1`}>
                            <button
                              onClick={cell.onClick}
                              className={cn(
                                `w-full rounded-md px-4 py-3 ${cell.shared ? 'bg-[#E5EFFE]' : 'bg-[#FCF3DD]'}`,
                                !shouldShowLoader() ? '' : 'bg-white',
                                cell.isActive ? 'border-2 border-[#3E50F7]' : ''
                              )}
                            >
                              <div className='text-xl font-semibold'>
                                {!shouldShowLoader() ? (
                                  cell.count
                                ) : (
                                  <CountSkeleton />
                                )}
                              </div>
                              <div className='text-xs text-gray-600'>
                                {!shouldShowLoader() ? (
                                  cell.label
                                ) : (
                                  <OverlapSkeleton />
                                )}
                              </div>
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}

                    {partnerData &&
                      !Boolean(
                        partnerData?.matrix?.A_CUSTOMERS?.B_CUSTOMERS?.records
                          ?.length
                      ) && (
                        <div
                          className='absolute bottom-0 right-0 top-0 flex w-[75%] flex-col items-center justify-center gap-[30px] backdrop-blur-[4px]'
                          style={{
                            background: `linear-gradient(180deg, rgba(255, 122, 89, 0.17) 6%, rgba(255, 183, 7, 0.17) 100%)`
                          }}
                        >
                          <div>
                            <h3 className='mb-4 text-xl font-bold text-[#151552]'>
                              Your partner has not connected data
                            </h3>
                            <p>
                              Lorem ipsum dummy text explaining about this
                              featuer
                            </p>
                          </div>
                          <Button
                            variant={buttonDisabled ? 'disable' : 'primary'}
                            disabled={buttonDisabled}
                            loading={notifyLoader}
                            loadingText='Notifying...'
                            onClick={() => handleSendReminder()}
                            className='w-fit disabled:pointer-events-none disabled:cursor-not-allowed'
                          >
                            {buttonText}
                          </Button>
                        </div>
                      )}
                  </tbody>
                </table>
              </div>

              {/* <div className="flex items-center justify-between mt-4">
                                <div className="flex flex-col gap-2">
                                    <Button size="icon" variant="outline">
                                        <ArrowUp size={16} />
                                    </Button>
                                    <Button size="icon" variant="outline">
                                        <ArrowDown size={16} />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button size="icon" variant="outline">&#8592;</Button>
                                    <Button size="icon" variant="outline">&#8594;</Button>
                                </div>
                            </div> */}
            </div>
            <div className='mt-4 flex items-center justify-end gap-4 text-sm'>
              <div className='flex items-center gap-1'>
                <div className='h-4 w-4 rounded-sm bg-[#E5EFFE]' />
                Data Shared
              </div>
              <div className='flex items-center gap-1'>
                <div className='h-4 w-4 rounded-sm bg-[#FCF3DD]' />
                Data not shared
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant='primary'
        disabled={!(Boolean(selectedColumn) && Boolean(selectedPartner))}
        onClick={() =>
          router.push(
            `/partner-mapping/report?type=${selectedColumn}&partner=${selectedPartner}`
          )
        }
        className='w-fit disabled:pointer-events-none disabled:cursor-not-allowed'
      >
        Create Report
      </Button>
    </div>
  )
}

export default Report
