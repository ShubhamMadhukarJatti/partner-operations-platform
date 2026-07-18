import { format, formatDistanceToNowStrict } from 'date-fns'

export const formatDate = (date: string, formatString: string = 'MMM d, y') => {
  const _date = new Date(date)

  return format(_date, formatString)
}

export const getRelativeTime = (date: Date | string) => {
  if (typeof date === 'string') date = new Date(date)
  return formatDistanceToNowStrict(date, {
    addSuffix: true
  })
}
