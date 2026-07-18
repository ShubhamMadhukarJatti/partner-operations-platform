'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCollaborationsData } from '@/http-hooks/collaborations'
import { useCreateEvent } from '@/http-hooks/schedule'
import { RootState } from '@/redux/store'
import { ArrowLeft } from 'iconsax-react'
import { CalendarDays, Clock } from 'lucide-react'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import { OutlinedCalendar } from '@/components/ui/outlined-calendar'
import TimeInput from '@/components/ui/outlined-clock'
import { OutlinedInput } from '@/components/ui/outlined-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/outlined-select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { showCustomToast } from '@/components/custom-toast'

import useTimezoneConverter from './useTimeZoneConverter'

interface ScheduleProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  defaultPartner?: string
  title?: string
}

const ScheduleMeetDialog: React.FC<ScheduleProps> = ({
  open,
  setOpen,
  defaultPartner = '',
  title = ''
}) => {
  const searchParams = useSearchParams()
  const [inviteLoading, setInviteLoading] = useState(false)
  const [meetTitle, setMeetTitle] = useState('')
  const saved = useSelector((state: RootState) => state.currentOrg)
  const mutate = useCreateEvent()
  const [selectedPartner, setSelectedPartner] = useState('')

  const { data, isLoading } = useCollaborationsData('ALL', 0, 100)
  const timezone = useTimezoneConverter()
  // const [open, setOpen] = useState(false)

  const [meetingDate, setMeetingDate] = useState('')
  console.log({ meetingDate })
  const [meetList, setMeetList] = useState([{ name: 'Google Meet', id: 1 }])
  const [selectedDate, setSelectedDate] = useState<any>(new Date())
  const [time, setTime] = useState('10:00 AM')
  const selectedType = searchParams.get('type')

  const [selectedTime, setSelectedTime] = useState<string>('12:00 AM')
  const [selectedTimeTo, setSelectedTimeTo] = useState<string>('12:00 AM')

  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime)
  }

  const handleTimeChangeTo = (newTime: string) => {
    setSelectedTimeTo(newTime)
  }

  const createGoogleMeet = async (payload: any) => {
    setInviteLoading(true)
    mutate.mutate(payload, {
      onSuccess: () => {
        setOpen(false)
      }
    })
    // try {
    //   const response = await fetch('/api/google-meet', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(payload)
    //   })

    //   const data = await response.json()

    //   if (!response.ok) {
    //     console.error(
    //       `❌ Server responded with error (${response.status}):\n`,
    //       JSON.stringify(data, null, 2)
    //     )
    //     return
    //   }

    //   console.log('✅ Google Meet created:', data.meeting)
    //   setOpen(false)
    //   showCustomToast('Success', 'Google Meet created successfully!', 'success', 5000)
    // } catch (error) {
    //   console.error('❌ Network or unexpected error:', error)
    // } finally {
    //   setInviteLoading(false)
    // }
  }

  const dateTimeString = timezone.createUTCTime(selectedTime, meetingDate)
  console.log({ dateTimeString })

  const sendMeetInvite = async () => {
    console.log('meetingDate', meetingDate)
    console.log('selectedTime', selectedTime)

    // const dateTimeString = `${meetingDate} ${selectedTime}`
    const dateTimeString = timezone.createUTCTime(selectedTime, meetingDate)

    const localDate = new Date(dateTimeString)

    const isoStringFrom = localDate.toISOString()

    // const dateTimeStringTo = `${meetingDate} ${selectedTimeTo}`
    const dateTimeStringTo = timezone.createUTCTime(selectedTimeTo, meetingDate)

    const localDateTo = new Date(dateTimeStringTo)

    const isoStringTo = localDateTo.toISOString()

    const payload = {
      title: meetTitle,
      description: '',
      startDateTime: dateTimeString,
      endDateTime: dateTimeStringTo,
      senderOrganizationId: saved.organization.id,
      receiverOrganizationId: Number(selectedPartner)
    }

    console.log({ payload })

    const res = await createGoogleMeet(payload)
    // createGoogleMeet()
  }

  useEffect(() => {
    if (defaultPartner) {
      console.log({ defaultPartner })
      setSelectedPartner(String(defaultPartner))
    }
  }, [defaultPartner, open])

  return (
    <div>
      <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
        {/* <DialogTrigger asChild>
          <Button className='flex items-center gap-2 text-sm font-bold text-white'>
            <CalendarDays size={20} /> Schedule a meeting
          </Button>
        </DialogTrigger> */}
        <DialogContent className='max-w-screen'>
          <ScrollArea className='h-screen'>
            <div className='mx-auto flex max-w-[863px] flex-col gap-6 p-6'>
              <DialogClose className='flex items-center gap-2 text-sm font-bold text-[#3E50F7]'>
                <ArrowLeft size={20} /> Back to My Schedule
              </DialogClose>
              <div className='flex flex-col gap-2'>
                <h1 className='text-xl font-bold '>Schedule a meeting</h1>
                <p className='text-sm font-normal text-[#7688A8]'>
                  Setup a meeting with your partner
                </p>
              </div>
              <div className='pt-3'>
                <div className='space-y-6'>
                  <OutlinedInput
                    defaultValue={title ?? ''}
                    label='Meeting title'
                    placeholder='Discussion on MOU'
                    onBlur={(e) => setMeetTitle(e.target.value)}
                  />

                  <Select onValueChange={(value) => {}} name='companyType'>
                    <SelectTrigger
                      label='Meeting platform'
                      className='w-full rounded-lg'
                    >
                      <SelectValue placeholder='Select Platform' />
                    </SelectTrigger>
                    <SelectContent>
                      {meetList?.map((list: any) => (
                        <SelectItem key={list.id} value={list.name}>
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    defaultValue={defaultPartner}
                    onValueChange={setSelectedPartner}
                  >
                    <SelectTrigger
                      label='Select your partner'
                      className='w-full rounded-md border'
                    >
                      <SelectValue placeholder='Select a partner organization' />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value='loading'>Loading...</SelectItem>
                      ) : (
                        data?.content.map((item: any, id: number) => (
                          <SelectItem
                            key={id}
                            value={item.partnerOrganizationId}
                          >
                            {item.organizationName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  <div className='mx-auto w-full max-w-4xl space-y-6 rounded-xl border border-gray-200 p-6'>
                    {/* Header */}
                    <div className='flex items-center justify-between text-sm font-medium text-gray-700'>
                      <div className='flex items-center gap-2'>
                        <Clock className='h-4 w-4' />
                        <span>Date & Time</span>
                      </div>
                      <select
                        className='rounded-md border px-3 py-1 text-sm text-gray-600'
                        // value={timezone}
                      >
                        <option>Mumbai, India</option>
                      </select>
                    </div>

                    {/* Meeting date & time input */}
                    <div className='space-y-4'>
                      <OutlinedCalendar
                        // onSelect={setMeetingDate}
                        label='Meeting date'
                        placeholder='Discussion on MOU'
                        type='date'
                        onChange={(e) => setMeetingDate(e.target.value)}
                        onBlur={(e) => setMeetingDate(e.target.value)}
                      />
                    </div>

                    <div className='flex w-full gap-2'>
                      <TimeInput
                        label='From'
                        value={selectedTime}
                        onChange={handleTimeChange}
                        className='text-lg'
                      />

                      <TimeInput
                        label='To'
                        value={selectedTimeTo}
                        onChange={handleTimeChangeTo}
                        className='text-lg'
                      />
                    </div>

                    <div>
                      <div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                        <span className='font-semibold text-blue-600'>
                          ⚡ Time suggestions
                        </span>
                        <span className='text-xs text-gray-400'>
                          (as per client preference)
                        </span>
                      </div>

                      <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {[
                          {
                            title: 'Free slot 1',
                            date: '09 May 2025',
                            time: '10:00 PM to 05:30 PM'
                          },
                          {
                            title: 'Free slot 2',
                            date: '10 May 2024',
                            time: '10:00 PM to 01:30 PM'
                          }
                        ].map((slot) => (
                          <div
                            key={slot.title}
                            className='flex flex-col gap-1 rounded-lg border px-4 py-3 text-sm'
                          >
                            <span className='font-medium text-gray-700'>
                              {slot.title}
                            </span>
                            <div className='flex items-center gap-2 text-gray-600'>
                              <CalendarDays className='h-4 w-4' />
                              <span>{slot.date}</span>
                            </div>
                            <div className='flex items-center gap-2 text-green-600'>
                              <Clock className='h-4 w-4' />
                              <span>{slot.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-between gap-4 pt-6'>
                    <Button variant='outline' className='w-full'>
                      Cancel
                    </Button>
                    <Button
                      loading={mutate.isPending}
                      onClick={() => sendMeetInvite()}
                      className='w-full bg-indigo-600 text-white hover:bg-indigo-700'
                    >
                      Send meeting invite
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ScheduleMeetDialog
