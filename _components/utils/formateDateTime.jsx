import { format, parse } from 'date-fns'

export const formatDateTime = (selectedDate, selectedTime) => {
  const [startTime, endTime] = selectedTime.split(' - ')

  // Extract hours and minutes from the time strings
  const [startHour, startMinute] = startTime.split(':')
  const [endHour, endMinute] = endTime.split(':')

  // Create start and end time Date objects
  const startDate = new Date(selectedDate)
  startDate.setHours(parseInt(startHour), parseInt(startMinute), 0, 0)
  console.log(startDate, 'startDate')
  const endDate = new Date(selectedDate)
  endDate.setHours(parseInt(endHour), parseInt(endMinute), 0, 0)

  return { startDate, endDate }
}

export default function formatDateToISOString(dateString) {
  const date = new Date(dateString)

  return date.toISOString()
}
