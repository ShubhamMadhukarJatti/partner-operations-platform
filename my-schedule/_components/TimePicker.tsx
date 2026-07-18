import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { timeInputType } from '@/app/(app)/(dashboard-pages)/my-schedule/_components/SettingsDialog'

interface TimePickerInputProps {
  type: timeInputType
  value?: string
  onChange: (time: string, type: timeInputType) => void
  onUpdateApi?: (newTime: string) => Promise<void> // CHANGED: now accepts newTime parameter
  className?: string
  label: string
  debounceMs?: number
  disabled?: boolean
}

const TimePickerInput: React.FC<TimePickerInputProps> = ({
  type,
  value = '',
  onChange,
  onUpdateApi,
  className = '',
  label,
  debounceMs = 3000,
  disabled = false
}) => {
  // Parse initial values more safely
  const { initialHour, initialMinute, initialAmpm } = useMemo(() => {
    if (!value || value === '')
      return { initialHour: 12, initialMinute: 0, initialAmpm: 'AM' }

    try {
      const trimmedValue = value.trim()
      const parts = trimmedValue.split(' ')

      if (parts.length < 2)
        return { initialHour: 12, initialMinute: 0, initialAmpm: 'AM' }

      const [timePart, ampmPart] = parts
      const timeParts = timePart.split(':')

      if (timeParts.length < 2)
        return { initialHour: 12, initialMinute: 0, initialAmpm: 'AM' }

      const [hourStr, minuteStr] = timeParts
      const hour = parseInt(hourStr, 10)
      const minute = parseInt(minuteStr, 10)

      return {
        initialHour: !isNaN(hour) && hour >= 1 && hour <= 12 ? hour : 12,
        initialMinute:
          !isNaN(minute) && minute >= 0 && minute <= 59 ? minute : 0,
        initialAmpm: ampmPart?.toUpperCase() === 'PM' ? 'PM' : 'AM'
      }
    } catch (error) {
      console.warn('Error parsing time value:', value, error)
      return { initialHour: 12, initialMinute: 0, initialAmpm: 'AM' }
    }
  }, [value])

  const [hour, setHour] = useState<number>(initialHour)
  const [minute, setMinute] = useState<number>(initialMinute)
  const [ampm, setAmpm] = useState<string>(initialAmpm)
  const [isUpdating, setIsUpdating] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const debounceRef = useRef<NodeJS.Timeout>()
  const pendingTimeRef = useRef<string>('') // ADDED: to track pending time for API call

  // Update local state when value prop changes
  useEffect(() => {
    if (
      hour !== initialHour ||
      minute !== initialMinute ||
      ampm !== initialAmpm
    ) {
      setHour(initialHour)
      setMinute(initialMinute)
      setAmpm(initialAmpm)
    }
  }, [initialHour, initialMinute, initialAmpm])

  // Format time string
  const formatTimeString = useCallback(
    (h: number, m: number, period: string) => {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`
    },
    []
  )

  // MODIFIED: Debounced API call that uses the pending time
  const debouncedApiCall = useCallback(async () => {
    if (!onUpdateApi || !pendingTimeRef.current) return

    setIsUpdating(true)
    setHasError(false)

    try {
      await onUpdateApi(pendingTimeRef.current) // CHANGED: pass the actual time value
    } catch (error) {
      console.error(`Failed to update ${type}:`, error)
      setHasError(true)
    } finally {
      setIsUpdating(false)
    }
  }, [onUpdateApi, type])

  // MODIFIED: Trigger API call with debounce, storing the time value
  const triggerApiUpdate = useCallback(
    (timeString: string) => {
      pendingTimeRef.current = timeString // ADDED: store the time for API call

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        debouncedApiCall()
      }, debounceMs)
    },
    [debouncedApiCall, debounceMs]
  )

  const handleTimeChange = (
    timeType: 'hour' | 'minute' | 'ampm',
    newValue: string | number
  ) => {
    let newHour = hour
    let newMinute = minute
    let newAmpm = ampm

    if (timeType === 'hour') {
      newHour =
        typeof newValue === 'number'
          ? newValue
          : parseInt(newValue.toString(), 10)
      setHour(newHour)
    } else if (timeType === 'minute') {
      newMinute =
        typeof newValue === 'number'
          ? newValue
          : parseInt(newValue.toString(), 10)
      setMinute(newMinute)
    } else if (timeType === 'ampm') {
      newAmpm = newValue.toString()
      setAmpm(newAmpm)
    }

    const timeString = formatTimeString(newHour, newMinute, newAmpm)
    onChange(timeString, type)
    triggerApiUpdate(timeString) // CHANGED: pass the new timeString
  }

  // Generate arrays for picker
  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <div className='relative flex w-fit gap-2'>
      <div>
        <label
          style={{ fontSize: '12px' }}
          className='absolute -top-2 left-2 z-10 bg-white px-1 text-slate-500'
        >
          {label}
        </label>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div
              className={cn(
                `flex cursor-pointer items-center space-x-2 rounded-md border p-2 pb-1 transition-all duration-150 hover:border-blue-300`,
                hasError
                  ? 'border-red-400 bg-red-50'
                  : 'border-[#a8c7cb] bg-white',
                isUpdating ? 'opacity-70' : '',
                disabled ? 'cursor-not-allowed opacity-50' : '',
                className
              )}
              role='button'
              tabIndex={disabled ? -1 : 0}
              aria-label={`${label} Time Picker`}
            >
              <div className='w-16 text-center text-gray-800'>
                {hour.toString().padStart(2, '0')}
              </div>
              <span className='text-xl text-gray-600'>:</span>
              <div className='w-16 text-center text-gray-800'>
                {minute.toString().padStart(2, '0')}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <div className='flex divide-x'>
              <div className='h-48 w-20 overflow-y-auto'>
                <div className='m-2 flex flex-col'>
                  {hours.map((h) => (
                    <Button
                      key={h}
                      size='sm'
                      variant={hour === h ? 'default' : 'ghost'}
                      className='mb-1 shrink-0 justify-center px-3'
                      onClick={() => handleTimeChange('hour', h)}
                    >
                      {h.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
              </div>
              <div className='h-48 w-20 overflow-y-auto'>
                <div className='flex flex-col p-2'>
                  {minutes.map((m) => (
                    <Button
                      key={m}
                      size='sm'
                      variant={minute === m ? 'default' : 'ghost'}
                      className='mb-1 shrink-0 justify-center'
                      onClick={() => handleTimeChange('minute', m)}
                    >
                      {m.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
              </div>
              <div className='flex flex-col p-2'>
                {['AM', 'PM'].map((period) => (
                  <Button
                    key={period}
                    size='sm'
                    variant={ampm === period ? 'default' : 'ghost'}
                    className='mb-1 shrink-0 justify-center'
                    onClick={() => handleTimeChange('ampm', period)}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className='inline-flex h-[70%] overflow-hidden rounded-lg border border-gray-300'>
        <button
          type='button'
          onClick={() => handleTimeChange('ampm', 'AM')}
          disabled={disabled || isUpdating}
          className={`w-14 py-2 text-sm font-semibold transition-all duration-150 hover:shadow-sm disabled:cursor-not-allowed ${
            ampm === 'AM'
              ? 'bg-white text-gray-800 shadow-md'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          } flex items-center justify-center rounded-l-lg border-r border-gray-300`}
        >
          AM
        </button>
        <button
          type='button'
          onClick={() => handleTimeChange('ampm', 'PM')}
          disabled={disabled || isUpdating}
          className={`w-14 py-2 text-sm font-semibold transition-all duration-150 hover:shadow-sm disabled:cursor-not-allowed ${
            ampm === 'PM'
              ? 'bg-white text-gray-800 shadow-md'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          } flex items-center justify-center rounded-r-lg`}
        >
          PM
        </button>
      </div>
    </div>
  )
}

export default TimePickerInput
