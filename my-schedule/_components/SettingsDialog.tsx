'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import {
  useGetScheduleSettings,
  useSetEventSettings
} from '@/http-hooks/schedule'
import { ArrowLeft, Edit2Icon, SettingsIcon } from 'lucide-react'
import { weekdays } from 'moment'

import { INTEGRATION_STATUS } from '@/lib/constants/integrations'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import TimeInput from '@/components/ui/outlined-clock'
import { ScrollArea } from '@/components/ui/scroll-area'

import AppCard from './AppCard'
import { formatTime } from './MeetCard'
import TimePickerInput from './TimePicker'
import timezone from './useTimeZoneConverter'

export type timeInputType =
  | 'weekdays-from'
  | 'weekdays-to'
  | 'weekends-from'
  | 'weekends-to'

interface TimeState {
  weekdaysFrom: string
  weekdaysTo: string
  weekendsFrom: string
  weekendsTo: string
}
const requiredAppsForMeet = ['G_CALENDAR', 'CALENDLY']

const SettingsDialog = () => {
  const { data, isLoading } = useGetScheduleSettings() as {
    data: any
    isLoading: boolean
  }
  const api = timezone()
  // const api = timezone().createUTCTime('09:00 AM')
  // const newDate = timezone().convertUTCToLocal(api)
  // console.log({ newDate })

  const { integrations, error: fetchError } = useIntegrationApps()
  const [connectedApps, setConnectedApps] = useState<any>([])
  const mutate = useSetEventSettings()

  const [defaultData, setDefaultData] = useState<any>(null)
  const [timeState, setTimeState] = useState<TimeState>({
    weekdaysFrom: '09:00 AM',
    weekdaysTo: '05:00 PM',
    weekendsFrom: '10:00 AM',
    weekendsTo: '06:00 PM'
  })

  console.log({ connectedApps })

  // Initialize time state from API data
  useEffect(() => {
    if (!isLoading && data) {
      setDefaultData(data)

      // Extract and format times from API data
      const weekdaysFrom = data?.weekDays?.validFrom
        ? `${api.convertUTCToLocal(data.weekDays.validFrom).time12}`
        : '09:00 AM'

      const weekdaysTo = data?.weekDays?.validTo
        ? `${api.convertUTCToLocal(data.weekDays.validTo).time12}`
        : '05:00 PM'

      const weekendsFrom = data?.weekEnd?.validFrom
        ? `${api.convertUTCToLocal(data.weekEnd.validFrom).time12}`
        : '10:00 AM'

      const weekendsTo = data?.weekEnd?.validTo
        ? `${api.convertUTCToLocal(data.weekEnd.validTo).time12}`
        : '06:00 PM'

      setTimeState({
        weekdaysFrom,
        weekdaysTo,
        weekendsFrom,
        weekendsTo
      })
    } else if (!isLoading && !data) {
      // Set default data when no API data is available
      setDefaultData({
        defaultApp: 'G_CALENDAR',
        weekDays: {
          validFrom: '2025-05-24T09:00:00.000Z',
          validTo: '2025-05-24T17:00:00.000Z'
        },
        weekEnd: {
          validFrom: '2025-05-24T10:00:00.000Z',
          validTo: '2025-05-24T18:00:00.000Z'
        }
      })
    }
  }, [data, isLoading])

  useEffect(() => {
    if (integrations) {
      setConnectedApps(
        integrations
          ?.filter(
            (app) =>
              requiredAppsForMeet.includes(app.id) &&
              app.status === INTEGRATION_STATUS.CONNECTED
          )
          .map((app) => app.id)
      )
    }
  }, [integrations])

  // Utility function to convert 12-hour time to 24-hour format
  const convertTo24Hour = useCallback((time: string) => {
    const [hourMin, modifier] = time.split(' ')
    let [hours, minutes] = hourMin.split(':')

    if (hours === '12') {
      hours = modifier.toLowerCase() === 'am' ? '00' : '12'
    } else if (modifier.toLowerCase() === 'pm') {
      hours = (parseInt(hours, 10) + 12).toString()
    }

    return `${hours.padStart(2, '0')}:${minutes}`
  }, [])

  // Create ISO time string from time input
  const createIsoTime = useCallback(
    (timeString: string) => {
      const time24 = convertTo24Hour(timeString)
      const today = new Date().toISOString().split('T')[0]
      return `${today}T${time24}:00.000Z`
    },
    [convertTo24Hour]
  )

  // Get current time value by type
  const getTimeByType = useCallback(
    (type: timeInputType): string => {
      switch (type) {
        case 'weekdays-from':
          return timeState.weekdaysFrom
        case 'weekdays-to':
          return timeState.weekdaysTo
        case 'weekends-from':
          return timeState.weekendsFrom
        case 'weekends-to':
          return timeState.weekendsTo
        default:
          return '12:00 AM'
      }
    },
    [timeState]
  )

  const createApiPayload = useCallback(
    (type: timeInputType, newTime: string, currentTimeState: TimeState) => {
      if (!defaultData) return null

      const isoTime = api.createUTCTime(newTime)

      switch (type) {
        case 'weekdays-from':
          return {
            ...defaultData,
            weekDays: {
              ...defaultData.weekDays,
              validFrom: isoTime
              // validTo: createIsoTime(currentTimeState.weekdaysTo)
            }
          }
        case 'weekdays-to':
          return {
            ...defaultData,
            weekDays: {
              ...defaultData.weekDays,
              // validFrom: createIsoTime(currentTimeState.weekdaysFrom),
              validTo: isoTime
            }
          }
        case 'weekends-from':
          return {
            ...defaultData,
            weekEnd: {
              ...defaultData?.weekEnd,
              validFrom: isoTime
              // validTo: createIsoTime(currentTimeState.weekendsTo)
            }
          }
        case 'weekends-to':
          return {
            ...defaultData,
            weekEnd: {
              ...defaultData?.weekEnd,
              // validFrom: createIsoTime(currentTimeState.weekendsFrom),
              validTo: isoTime
            }
          }
        default:
          return defaultData
      }
    },
    [defaultData, createIsoTime]
  )

  // Handle time change
  const handleTimeChange = useCallback(
    (newTime: string, type: timeInputType) => {
      setTimeState((prev) => {
        switch (type) {
          case 'weekdays-from':
            return { ...prev, weekdaysFrom: newTime }
          case 'weekdays-to':
            return { ...prev, weekdaysTo: newTime }
          case 'weekends-from':
            return { ...prev, weekendsFrom: newTime }
          case 'weekends-to':
            return { ...prev, weekendsTo: newTime }
          default:
            return prev
        }
      })
    },
    []
  )

  const handleUpdateTimeApi = useCallback(
    async (type: timeInputType, newTime: string) => {
      // Create updated time state with the new value
      const updatedTimeState = { ...timeState }
      switch (type) {
        case 'weekdays-from':
          updatedTimeState.weekdaysFrom = newTime
          break
        case 'weekdays-to':
          updatedTimeState.weekdaysTo = newTime
          break
        case 'weekends-from':
          updatedTimeState.weekendsFrom = newTime
          break
        case 'weekends-to':
          updatedTimeState.weekendsTo = newTime
          break
      }

      const payload = createApiPayload(type, newTime, updatedTimeState)
      console.log({ payload })

      if (payload) {
        try {
          await mutate.mutateAsync(payload)
        } catch (error) {
          console.error(`Failed to update ${type}:`, error)
          throw error
        }
      }
    },
    [timeState, createApiPayload, mutate]
  )

  // Handle app setting change
  const onChangeSetting = useCallback(
    (payload: any) => {
      if (payload.defaultApp === '') return
      console.log({
        ...defaultData,
        defaultApp: payload.defaultApp
      })
      mutate.mutate({
        ...defaultData,
        defaultApp: payload.defaultApp
      })
    },
    [mutate]
  )

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SettingsIcon size={20} stroke='#4D5C78' strokeWidth={1.13} />
      </DialogTrigger>
      <DialogContent className='max-w-screen'>
        <ScrollArea className='h-screen'>
          <div className='mx-auto flex max-w-[1000px] flex-col gap-6 p-6'>
            <DialogClose className='flex items-center gap-2 text-sm font-bold text-[#3E50F7]'>
              <ArrowLeft size={20} /> Back to My Schedule
            </DialogClose>
            <div className='flex flex-col gap-2'>
              <h1 className='text-xl font-bold '>Settings</h1>
              <p className='text-sm font-normal text-[#7688A8]'>
                Setup your meeting preferences according to you
              </p>
            </div>
            <div className='flex flex-col gap-4'>
              <div className=''>
                <p className='flex items-center gap-2 text-base font-semibold text-[#2A3241]'>
                  Meeting app <Edit2Icon size={16} />
                </p>
                <p className='text-sm font-normal text-[#7688A8] '>
                  Select one app for default meetings
                </p>
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <AppCard
                  disabled={true}
                  key={'calendly'}
                  value='CALENDLY'
                  onChangeSetting={onChangeSetting}
                  isDefault={defaultData?.defaultApp === 'CALENDLY'}
                  imageUrl={'/assets/calendly.svg'}
                  title='Calendly'
                  description='Build automated meeting with your Partner via AI powered transcript for managing minutes of meetings.'
                  isConnected={connectedApps?.includes('CALENDLY') || false}
                />
                <AppCard
                  key={'google-meet'}
                  value='G_CALENDAR'
                  onChangeSetting={onChangeSetting}
                  isDefault={defaultData?.defaultApp === 'G_CALENDAR'}
                  imageUrl={'/assets/google-meet-gradient.png'}
                  title='Google Meet'
                  description='Build automated meeting with your Partner and track meeting status directly via google meet.'
                  isConnected={connectedApps?.includes('G_CALENDAR') || false}
                />
              </div>

              <div className='max-w-[712px]'>
                <p className='mb-4 flex items-center gap-2 text-base font-semibold text-[#2A3241]'>
                  Meeting time
                  <Edit2Icon size={16} />
                </p>
                <div className='space-y-2 rounded-[14px] border border-[#ADB7CB] p-4'>
                  <p className='text-sm font-semibold text-[#2A3241]'>
                    Weekdays
                  </p>

                  <div className='flex w-full gap-2 pt-4'>
                    <TimePickerInput
                      key='weekdays-from'
                      label='From'
                      type='weekdays-from'
                      value={timeState.weekdaysFrom}
                      onChange={handleTimeChange}
                      onUpdateApi={(newTime) =>
                        handleUpdateTimeApi('weekdays-from', newTime)
                      }
                      className='text-lg'
                    />

                    <TimePickerInput
                      key='weekdays-to'
                      type='weekdays-to'
                      label='To'
                      value={timeState.weekdaysTo}
                      onChange={handleTimeChange}
                      onUpdateApi={(newTime) =>
                        handleUpdateTimeApi('weekdays-to', newTime)
                      }
                      className='text-lg'
                    />
                  </div>

                  <p className='mt-1 text-sm font-semibold text-[#2A3241]'>
                    Weekends
                  </p>

                  <div className='flex w-full gap-2 pt-4'>
                    <TimePickerInput
                      key='weekends-from'
                      type='weekends-from'
                      label='From'
                      value={timeState.weekendsFrom}
                      onChange={handleTimeChange}
                      onUpdateApi={(newTime) =>
                        handleUpdateTimeApi('weekends-from', newTime)
                      }
                      className='text-lg'
                    />

                    <TimePickerInput
                      label='To'
                      key='weekends-to'
                      type='weekends-to'
                      value={timeState.weekendsTo}
                      onChange={handleTimeChange}
                      onUpdateApi={(newTime) =>
                        handleUpdateTimeApi('weekends-to', newTime)
                      }
                      className='text-lg'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsDialog
