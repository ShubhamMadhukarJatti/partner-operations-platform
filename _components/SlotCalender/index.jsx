import { isSameDay } from 'date-fns'
import { Clock, PlusIcon, Video, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Logo } from '@/components/icons/logo'

// import Calendar from '../Calender/Calender'
import { timeSlots } from '../Calender/timeSlot'

const { useState, useEffect } = require('react')

const Index = ({ onSubmit, openCalendar, setOpenCalendar }) => {
  const [time, settime] = useState('')
  const [date, setdate] = useState('')
  const [email, setemail] = useState('')
  const [username, setusername] = useState('')
  const [guestemail, setguestemail] = useState('')
  const [guestname, setguestname] = useState('')
  const [agenda, setAgenda] = useState('')
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  const getCurrentDate = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()

    const daysToAdd = dayOfWeek === 5 ? 3 : dayOfWeek === 6 ? 2 : 0

    today.setDate(today.getDate() + daysToAdd)

    return today
  }

  const [selectedTime, setselectedTime] = useState()
  const [selectedDate, setselectedDate] = useState(date || getCurrentDate())
  const [availableTimeSlots, setTimeSlots] = useState([])
  const currentDate = new Date()
  const [meetingSchedules, setMeetingSchedules] = useState([])

  console.log(meetingSchedules, 'meetingSchedules')

  const busy = [
    {
      start: '2024-03-19T18:30:00.000Z',
      end: '2024-03-19T19:00:00.000Z',
      title: 'Shakdom Test meeting between Nav Deep and Test'
    },
    {
      start: '2024-03-20T03:30:00.000Z',
      end: '2024-03-20T04:00:00.000Z',
      title: 'Shakdom Test meeting between Nav Deep and test'
    },
    {
      start: '2024-03-20T04:00:00.000Z',
      end: '2024-03-20T04:30:00.000Z',
      title: 'Shakdom Test meeting between Nav Deep and test'
    },
    {
      start: '2024-03-19T18:30:00.000Z',
      end: '2024-03-19T19:00:00.000Z'
    },
    {
      start: '2024-03-20T03:30:00.000Z',
      end: '2024-03-20T04:30:00.000Z'
    }
  ]

  function formatTime(date) {
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // Handle midnight (0 hours)
    minutes = minutes < 10 ? '0' + minutes : minutes
    return hours + ':' + minutes + ' ' + ampm
  }

  function compareTimes(time1, time2) {
    // Split time into hour, minute, and AM/PM
    const [hour1, minute1, ampm1] = time1.split(/:| /)
    const [hour2, minute2, ampm2] = time2.split(/:| /)

    // Convert hour to 24-hour format for comparison
    const hour24Format1 =
      ampm1 === 'PM' && hour1 !== '12' ? parseInt(hour1) + 12 : parseInt(hour1)
    const hour24Format2 =
      ampm2 === 'PM' && hour2 !== '12' ? parseInt(hour2) + 12 : parseInt(hour2)

    // Compare hours
    if (hour24Format1 !== hour24Format2) {
      return hour24Format1 - hour24Format2
    }

    // If hours are equal, compare minutes
    return minute1 - minute2
  }

  function removeOccupiedTimeSlots(timeSlots, busy, selectedDate) {
    const date1 = new Date(selectedDate)

    busy.forEach((busySlot) => {
      const busyDate = new Date(busySlot.start)

      if (isSameDay(date1, busyDate)) {
        const busyTime = formatTime(busyDate)

        timeSlots = timeSlots.filter((slot) => slot !== busyTime)
      }
    })

    if (isSameDay(date1, currentDate)) {
      const todayTime = formatTime(currentDate)
      timeSlots = timeSlots.filter((slot) => compareTimes(slot, todayTime) >= 0)
      console.log(timeSlots)
    }

    return timeSlots
  }
  useEffect(() => {
    setselectedTime('')
    setAgenda('')
    setMeetingSchedules([])
  }, [])

  useEffect(() => {
    const updatedTimeSlots = removeOccupiedTimeSlots(
      timeSlots,
      busy,
      selectedDate
    )
    setTimeSlots(updatedTimeSlots)
  }, [selectedDate])

  console.log(meetingSchedules)
  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime())
    previous.setDate(date.getDate() - 1)

    return previous
  }

  return (
    <div className='flex justify-center'>
      {/* <Button className='ml-5 my-5 w-full max-w-[380px]'>Next</Button> */}

      <Dialog
        className='text-center '
        open={openCalendar}
        onOpenChange={setOpenCalendar}
      >
        <DialogTrigger asChild onClick={() => setOpenCalendar(true)}>
          <Button variant={'link'}>
            <PlusIcon className='mr-2 h-6 w-6 font-medium text-primary' />{' '}
            Schedule
          </Button>
        </DialogTrigger>

        <DialogContent className=''>
          <div className='flex flex-col gap-4  py-8 lg:flex-row'>
            <div className=' min-w-72  '>
              <div className='flex flex-col gap-1'>
                <Logo className='h-6 w-6 rounded-full bg-gray-100 ' />
                <p className='font-medium'>Sharkdom</p>
              </div>

              <div className='mt-4  '>
                <h4 className='text-2xl font-semibold'>Startup1 x Startup2</h4>
                <br />
                <bold>Meeting agenda: </bold>
                <Textarea
                  id='link'
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  className='focus-visible:ring-0'
                />
                {/* <p className='mt-1 text-sm text-muted-foreground'>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. In,
                  consectetur fugit.
                </p> */}
              </div>
              <div className='mt-6 flex flex-row  gap-2.5 text-sm text-muted-foreground lg:flex-col'>
                <div className='flex items-center gap-2'>
                  <Clock className='h-5 w-5' /> <span>30 mins</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Video className='h-5 w-5' /> <span>Cal Video</span>
                </div>
              </div>
            </div>
            <div className='h-full lg:border-l'>
              <Calendar
                mode='single'
                fromDate={new Date()}
                fromMonth={new Date()}
                fromYear={new Date()}
                selected={selectedDate}
                onSelect={setselectedDate}
                disabled={[{ from: new Date(0), to: getPreviousDay() }]}
                // onSelect={(e) => console.log(e)}
              />
              <div className='p-2'>
                {meetingSchedules.length > 0 ? (
                  meetingSchedules.map((schedule, index) => (
                    <div
                      key={index}
                      className='mt-4 flex items-center justify-between gap-2.5'
                    >
                      <div className='flex items-center gap-2.5'>
                        <Clock className='h-5 w-5' />{' '}
                        <span>{schedule.time}</span>
                      </div>
                      <div className='flex items-center gap-2.5'>
                        <span>{`${schedule.date.getDate().toString().padStart(2, '0')} ${months[schedule.date.getMonth()]} ${schedule.date.getFullYear()}`}</span>
                      </div>
                      <X
                        size={16}
                        className='cursor-pointer text-red-600'
                        onClick={() => {
                          setMeetingSchedules(
                            meetingSchedules.filter((_, i) => i !== index)
                          )
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p className='text-sm'>
                    Please Select a Date and time to schedule
                  </p>
                )}
              </div>
            </div>

            <div className=' hide-scrollbar flex max-h-96 min-h-96 w-full   flex-col    gap-2.5  self-stretch overflow-y-scroll p-4  lg:border-l'>
              {availableTimeSlots?.map((slot, index) => (
                <>
                  {slot === selectedTime ? (
                    <div
                      key={index}
                      className='flex w-full flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border-2    border-primary bg-gray-300 bg-opacity-5 px-16 py-2.5  transition-all '
                    >
                      <p className="flex-shrink-0 font-['Inter'] text-sm font-medium leading-tight text-slate-800">
                        {slot}
                      </p>
                    </div>
                  ) : (
                    <div
                      onClick={() => setselectedTime(slot)}
                      key={index}
                      className='flex w-full flex-shrink-0 cursor-pointer items-center justify-center rounded-lg  border border-gray-100 bg-gray-100 px-16 py-2.5  transition-all hover:bg-primary/40'
                    >
                      <p className="flex-shrink-0 font-['Inter'] text-sm font-medium leading-tight text-slate-800">
                        {slot}
                      </p>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant={'secondary'}
              onClick={() => {
                console.log(selectedDate)
                console.log(selectedTime)
                if (selectedDate && selectedTime) {
                  setMeetingSchedules([
                    ...meetingSchedules,
                    {
                      date: selectedDate,
                      time: selectedTime
                    }
                  ])
                }
              }}
            >
              Add meeting
            </Button>
            <Button
              disabled={meetingSchedules.length === 0}
              type='submit'
              className={
                'disabled:cursor-not-allowed' +
                (meetingSchedules.length === 0 ? ' hidden' : ' block')
              }
              // onClick={() =>
              //   onSubmit({
              //     selectedTime,
              //     selectedDate,
              //     email,
              //     username,
              //     guestname,
              //     guestemail
              //   })
              // }
              onClick={() => {
                let meetings = [...meetingSchedules]
                onSubmit({
                  meetings,
                  description: agenda
                })
                setAgenda('')
                setselectedDate(new Date())
                setMeetingSchedules([])
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Index
