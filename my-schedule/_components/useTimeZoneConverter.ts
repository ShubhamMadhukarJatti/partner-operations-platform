import { useCallback, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'

const useTimezoneConverter = () => {
  // Get user's timezone
  const userTimezone = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }, [])

  // Convert 12-hour to 24-hour format
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

  // Create UTC ISO time from user's local time input
  const createUTCTime = useCallback(
    (timeString: string, meetingDate?: string) => {
      const time24 = convertTo24Hour(timeString)

      // Use provided meeting date or today's date
      const dateToUse = meetingDate || new Date().toISOString().split('T')[0]

      // Create local datetime string
      const localDateTime = `${dateToUse}T${time24}:00`

      // Convert local time to UTC considering user's timezone
      const utcTime = fromZonedTime(localDateTime, userTimezone)

      return utcTime.toISOString()
    },
    [convertTo24Hour, userTimezone]
  )

  // Convert UTC time to user's local timezone for display
  const convertUTCToLocal = useCallback(
    (utcTimeString: string) => {
      const utcDate = parseISO(utcTimeString)
      const localTime = toZonedTime(utcDate, userTimezone)

      return {
        time12: format(localTime, 'h:mm a'), // "5:00 PM"
        time24: format(localTime, 'HH:mm'), // "17:00"
        date: format(localTime, 'yyyy-MM-dd'),
        timezone: userTimezone,
        timezoneAbbr: formatInTimeZone(utcDate, userTimezone, 'zzz') // "IST", "EST"
      }
    },
    [userTimezone]
  )

  // Convert UTC time to any specific timezone
  const convertUTCToTimezone = useCallback(
    (utcTimeString: string, targetTimezone: string) => {
      const utcDate = parseISO(utcTimeString)
      const targetTime = toZonedTime(utcDate, targetTimezone)

      return {
        time12: format(targetTime, 'h:mm a'),
        time24: format(targetTime, 'HH:mm'),
        date: format(targetTime, 'yyyy-MM-dd'),
        timezone: targetTimezone,
        timezoneAbbr: formatInTimeZone(utcDate, targetTimezone, 'zzz')
      }
    },
    []
  )

  // Format time for API storage
  const formatForAPI = useCallback(
    (timeString: string, meetingDate?: string) => {
      const utcTime = createUTCTime(timeString, meetingDate)

      return {
        utc_time: utcTime,
        original_timezone: userTimezone,
        original_time: timeString,
        timezone_offset: new Date().getTimezoneOffset()
      }
    },
    [createUTCTime, userTimezone]
  )

  // Format time from API for display
  const formatFromAPI = useCallback(
    (apiData: {
      utc_time: string
      original_timezone?: string
      original_time?: string
    }) => {
      const localTime = convertUTCToLocal(apiData.utc_time)

      return {
        ...localTime,
        originalTime: apiData.original_time,
        originalTimezone: apiData.original_timezone,
        displayText: `${localTime.time12} ${localTime.timezoneAbbr}`
      }
    },
    [convertUTCToLocal]
  )

  return {
    userTimezone,
    createUTCTime,
    convertUTCToLocal,
    convertUTCToTimezone,
    formatForAPI,
    formatFromAPI,
    convertTo24Hour
  }
}

export default useTimezoneConverter
