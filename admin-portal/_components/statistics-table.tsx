'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  EmailStatisticsPaginatedResponse,
  EmailStatisticsResponse
} from '@/types'
import { format } from 'date-fns'
import { collection, getDocs } from 'firebase/firestore'
import Pagination from 'rc-pagination'
import DatePicker from 'react-datepicker'

import {
  EmailStatsArgs,
  EmailStatsEnv,
  EmailStatsEventType,
  getEmailStatistics
} from '@/lib/db/email'
import { useAuth } from '@/lib/firebase/auth/context'
import { dbFirebase } from '@/lib/firebase/config/client-config'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { showCustomToast } from '@/components/custom-toast'

import EmailPreviewDialog from './view-template'

type Props = {
  token: any
}

const DEFAULT_STATS_PARAMS = {
  eventType: 'Open',
  env: 'DEV',
  page: 0,
  size: 20,
  sentAt: format(new Date(), 'yyyy-MM-dd')
} as EmailStatsArgs

const StatisticsTable = ({ token }: Props) => {
  // const { token } = useAuth()

  console.log('this is tokennn', token)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [emailTemplates, setEmailTemplates] = useState<any>([])

  const [date, setDate] = useState(new Date())
  const [statsParams, setStatsParams] =
    useState<EmailStatsArgs>(DEFAULT_STATS_PARAMS)

  const [emailStats, setEmailStats] = useState<{
    data: EmailStatisticsPaginatedResponse | null
    error: null | string
  } | null>(null)

  const fetchEmailStatistics = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await getEmailStatistics(statsParams, token!)
      console.log('result', result)
      setEmailStats({ data: result, error: null })
    } catch (e) {
      // setSearchQuery('')
      // setStatsParams(DEFAULT_STATS_PARAMS)
      showCustomToast(
        'Error',
        'Error while fetching Email Statistics.',
        'error',
        5000
      )
      setEmailStats({
        data: null,
        error: 'Error while fetching Email Statistics.'
      })
    } finally {
      setIsLoading(false)
    }
  }, [statsParams])

  console.log(emailTemplates, `email tempaltes`)

  useEffect(() => {
    const fetchEmailTemplate = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(dbFirebase, 'EmailTemplates')
        )

        const emailTemplates = querySnapshot.docs.map((doc) => ({
          id: doc.id, // To get the document ID if needed
          ...doc.data() // To get the actual document data
        }))

        setEmailTemplates(emailTemplates)
      } catch (error) {
        console.error('Error fetching email templates: ', error)
        return []
      }
    }
    fetchEmailTemplate()
  }, [])

  useEffect(() => {
    if (token) {
      fetchEmailStatistics()
    }
  }, [fetchEmailStatistics, token, date])

  const updateStatisticsPagination = async (p: number) => {
    setStatsParams({
      ...statsParams,
      page: p - 1
    })
    try {
      const result = await getEmailStatistics(
        {
          ...statsParams,
          page: p - 1
        },
        token!
      )
      setEmailStats({ data: result, error: null })
    } catch (e) {
      // setSearchQuery('')
      // setStatsParams(DEFAULT_STATS_PARAMS)
      setEmailStats({
        data: null,
        error: 'Error while fetching Email Statistics.'
      })
      console.log(`ERROR WHILE FETCHING EMAIL STATS`)
    }
  }

  console.log(emailTemplates)

  return (
    <div className='m-8 flex min-h-screen flex-col'>
      {isLoading ? (
        <> loading.......</>
      ) : (
        <>
          <div className='m-5 flex space-x-4'>
            <div className='flex items-center'>
              <p>
                <strong>Select time of shooting bulk emails:</strong>
              </p>
              <span className='border-2 border-solid border-[#0062F1]'>
                <DatePicker
                  dateFormat='dd-MM-YYYY'
                  selected={date}
                  onChange={(date: any) => {
                    setStatsParams({
                      ...statsParams,
                      sentAt: format(new Date(date), 'yyyy-MM-dd')
                    })
                    setDate(date)
                  }}
                />
              </span>
            </div>
            <div className='flex flex-col items-center gap-4'>
              <Label htmlFor='select-expectations' className=''>
                <strong>Event Type:</strong>
              </Label>
              <Select
                name='eventType'
                value={statsParams?.eventType}
                onValueChange={(event) =>
                  setStatsParams({
                    ...statsParams,
                    eventType: event as EmailStatsEventType
                  })
                }
              >
                <SelectTrigger className='max-w-[120px] bg-secondary'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Open'>Open</SelectItem>
                  <SelectItem value='Click'>Click</SelectItem>
                  <SelectItem value='Bounce'>Bounce</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col items-center gap-4'>
              <Label htmlFor='select-expectations' className=''>
                <strong>Env:</strong>
              </Label>
              <Select
                name='env'
                value={statsParams?.env}
                onValueChange={(env) =>
                  setStatsParams({
                    ...statsParams,
                    env: env as EmailStatsEnv
                  })
                }
              >
                <SelectTrigger className='max-w-[120px] bg-secondary'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='DEV'>Dev</SelectItem>
                  <SelectItem value='PROD'>Prod</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {emailTemplates.length > 0 && (
              <div className='flex flex-col items-center gap-4'>
                <Label htmlFor='select-expectations' className=''>
                  <strong>Email Template :</strong>
                </Label>
                <Select
                  name='emailTemplate'
                  value={statsParams?.templateCode}
                  onValueChange={(event) =>
                    setStatsParams({
                      ...statsParams,
                      templateCode: event
                    })
                  }
                >
                  <SelectTrigger className='max-w-[120px] bg-secondary'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((item: any) => {
                      return (
                        <SelectItem value={item.id} key={item.id}>
                          {item.id}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}

            {emailTemplates.find(
              (template: any) => template.id === statsParams.templateCode
            ) && (
              <EmailPreviewDialog
                template={{
                  subject:
                    emailTemplates.find(
                      (template: any) =>
                        template.id === statsParams.templateCode
                    )?.subject || '',
                  bodyHtml:
                    emailTemplates.find(
                      (template: any) =>
                        template.id === statsParams.templateCode
                    )?.bodyHtml || ''
                }}
              />
            )}
          </div>

          <div className=''>
            <div className='flex flex-col'>
              <div className='-m-1.5 overflow-x-auto'>
                <div className='inline-block min-w-full p-1.5 align-middle'>
                  <div className='overflow-hidden'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead>
                        <tr>
                          <th
                            scope='col'
                            className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                          >
                            created
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                          >
                            clicked at
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                          >
                            opened at
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
                            template_code
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                          >
                            email
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                          >
                            link
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                          >
                            type
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
                          >
                            env
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200'>
                        {emailStats?.data?.content?.map(
                          (emailStats: EmailStatisticsResponse, index) => (
                            <tr key={index}>
                              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                                {emailStats?.creationTimestamp
                                  ? format(
                                      new Date(emailStats?.creationTimestamp),
                                      'dd-MM-yyyy'
                                    )
                                  : 'NA'}
                              </td>
                              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                                {emailStats?.clickedAt
                                  ? format(
                                      new Date(emailStats?.clickedAt),
                                      'dd-MM-yyyy'
                                    )
                                  : 'NA'}
                              </td>
                              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                                {emailStats?.openedAt
                                  ? format(
                                      new Date(emailStats?.openedAt),
                                      'dd-MM-yyyy'
                                    )
                                  : 'NA'}
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
                                {emailStats?.templateCode}
                              </td>
                              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                                {emailStats?.email}
                              </td>
                              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                                {emailStats?.clickedLink}
                              </td>
                              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                                {emailStats?.eventType}
                              </td>
                              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800'>
                                {emailStats?.env}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    current={statsParams?.page + 1}
                    onChange={updateStatisticsPagination}
                    pageSize={statsParams?.size}
                    total={emailStats?.data?.totalElements}
                  />
                </div>
              </div>
            </div>

            {emailStats?.data?.content?.length === 0 && (
              <div className='col-span-4 flex h-56  items-center justify-center'>
                <h3 className='text-2xl font-bold  text-secondary-foreground '>
                  No Statistics found
                </h3>
              </div>
            )}

            {emailStats === null && (
              <div className='col-span-4 flex h-56  items-center justify-center'>
                <h3 className='text-2xl font-bold  text-secondary-foreground '>
                  Loading...
                </h3>
              </div>
            )}

            {emailStats?.error !== null && (
              <div className='col-span-4 flex h-56  items-center justify-center'>
                <h3 className='text-2xl font-bold  text-secondary-foreground '>
                  {emailStats?.error}
                </h3>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default StatisticsTable
