'use client'

import React, { useEffect, useState } from 'react'
import {
  useGetPaymentTrackedData,
  useGetRequestRecievedData
} from '@/http-hooks/deals'
import { Edit2, Trash } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { formatDate } from '../myDeals/MainContent'
import RequestRewardDrawer from './RequestRewardDrawer'
import ViewRequestDrawer from './ViewRequestDrawer'

type Status = 'REQUEST_RECIEVED' | 'ACCEPTED' | 'REJECTED'

export interface PaymentTrackedDataT {
  id: number
  paymentId: string
  organizationId: number
  requestingOrganizationId: number
  status: Status
  amount: number
  timestamp: string
  date: string
  rejectingReason: string
  name: string
  invoiceAzure: string
  partnerId: string
  partnerName: string
}

// const data: any[] = [
//   {
//     date: '20/12/2013',
//     name: "user1",
//     status: "requested",
//     commision: "200",
//     partner: 'sigma global'

//   },
//   {
//     date: '20/12/2013',
//     name: "user1",
//     status: "requested",
//     commision: "200",
//     partner: 'sigma global'

//   },
// ]

type StylingT = Record<Status, { backgroundColor: string; color: string }>

const styling: StylingT = {
  REQUEST_RECIEVED: {
    backgroundColor: '#F9F3C8',
    color: '#B16920'
  },
  ACCEPTED: {
    backgroundColor: '#DDF6DF',
    color: '#59904B'
  },
  REJECTED: {
    backgroundColor: '#FBE7E7',
    color: '#C95C5C'
  }
}

const PaymentTransactiontable = () => {
  const { data } = useGetPaymentTrackedData() as {
    data: PaymentTrackedDataT[] | null
  }
  const { data: request_recieved } = useGetRequestRecievedData() as {
    data: PaymentTrackedDataT[] | null
  }

  const [activeTab, setActiveTab] = useState('recieved')
  const [showingData, setShowingData] = useState<PaymentTrackedDataT[]>([])

  useEffect(() => {
    if (data && request_recieved) {
      if (activeTab === 'recieved') setShowingData(request_recieved)
      if (activeTab === 'captured') setShowingData(data)
    }
  }, [activeTab, data, request_recieved])

  return (
    <div>
      <div className='my-2 flex items-center justify-between'>
        <h3 className='mb-4 text-lg/6 font-bold text-[#101828]'>
          Payment tracked
        </h3>

        <div className='flex items-center justify-between'>
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className='w-full'
          >
            <div className='flex items-center justify-between'>
              <TabsList className=' h-[44px] items-center gap-4 bg-background '>
                <TabsTrigger
                  key={'recieved'}
                  value={'recieved'}
                  className='rounded-lg border border-text-30 p-3 text-shark-base font-medium text-text-100 data-[state=active]:bg-[#10366F] data-[state=active]:text-primary-foreground'
                >
                  Received
                </TabsTrigger>
                <TabsTrigger
                  key={'captured'}
                  value={'captured'}
                  className='rounded-lg border border-text-30 p-3 text-shark-base font-medium text-text-100 data-[state=active]:bg-[#10366F] data-[state=active]:text-primary-foreground'
                >
                  Captured
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>
      <Table className='min-h-[155px] overflow-y-hidden rounded-xl border border-text-30'>
        <TableHeader className='hidden  rounded-t-lg md:table-header-group'>
          <TableRow>
            <TableHead className='py-4 text-shark-xs font-bold text-text-100'>
              Date
            </TableHead>
            <TableHead className='py-4 text-shark-xs font-bold text-text-100'>
              Name
            </TableHead>
            <TableHead className='py-4 text-shark-xs font-bold text-text-100'>
              Status
            </TableHead>
            <TableHead className='py-4 text-shark-xs font-bold text-text-100'>
              commision (₹)
            </TableHead>
            <TableHead className='py-4 text-shark-xs font-bold text-text-100'>
              Partner
            </TableHead>
            <TableHead className='py-4 text-shark-xs font-bold text-text-100'>
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {showingData?.length === 0 ? (
            <div className='absolute flex h-[100px] w-full items-center justify-center'>
              <p className='text-[12px]/[14px] text-[#908B93]'>
                All your transaction hostory will appear here
              </p>
            </div>
          ) : (
            <>
              {showingData?.map((data: any, index: number) => (
                <TableRow
                  key={index}
                  className='block hover:bg-gray-50 md:table-row'
                >
                  <TableCell className='table-cell items-center space-x-2 whitespace-nowrap py-3'>
                    <span className='text-shark-sm font-normal text-text-90'>
                      {formatDate(data.timestamp ?? data.date)}
                    </span>
                  </TableCell>
                  <TableCell className='table-cell items-center space-x-2 whitespace-nowrap py-3 '>
                    <span className='text-shark-sm font-normal text-text-90'>
                      {data.name}
                    </span>
                  </TableCell>
                  <TableCell className='table-cell items-center space-x-2 whitespace-nowrap py-3 capitalize'>
                    <span
                      className='rounded-2xl bg-[#F9F3C8] px-2 py-[2px] text-shark-xs/5 font-normal capitalize text-[#B16920]'
                      style={styling[data.status as Status]}
                    >
                      {data.status}
                    </span>
                  </TableCell>
                  <TableCell className='table-cell items-center space-x-2 whitespace-nowrap py-3 '>
                    <span className='text-shark-sm font-normal text-text-90'>
                      {data.amount}
                    </span>
                  </TableCell>
                  <TableCell className='table-cell items-center space-x-2 whitespace-nowrap py-3 '>
                    <span className='text-shark-sm font-normal text-text-90'>
                      {data.requestingOrganizationName}
                    </span>
                  </TableCell>

                  {/* Mobile-friendly rows with labels */}
                  {/* <TableCell className='py-3 text-shark-xs text-text-80 md:table-cell'>
                    <span className='block font-bold md:hidden'>Name:</span>
                    {data.name}
                  </TableCell> */}

                  {/* <TableCell className='py-3 text-shark-xs text-text-80 md:table-cell'>
                    <span className='block font-bold md:hidden'>Received:</span> */}
                  {/* {moment(user.user.creationTimestamp).format('DD/MM/YYYY')} */}
                  {/* </TableCell> */}

                  <TableCell className='flex space-x-6 py-3 md:table-cell'>
                    {activeTab === 'captured' && (
                      <RequestRewardDrawer
                        drawerData={data}
                        buttonText='Request'
                      />
                    )}
                    {activeTab === 'recieved' && (
                      <ViewRequestDrawer
                        status={data.status}
                        buttonText='View'
                        drawerData={data}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default PaymentTransactiontable
