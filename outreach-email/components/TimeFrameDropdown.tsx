'use client'

import React, { useEffect, useRef, useState } from 'react'
import { DateRange, DayPicker } from 'react-day-picker'

import 'react-day-picker/dist/style.css'

import { format, startOfToday, subDays } from 'date-fns'
import { ChevronDown } from 'lucide-react'

type Props = {
  value?: DateRange | undefined
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
}

export default function TimeframeDropdown({
  value,
  onChange,
  placeholder = 'All the time'
}: Props) {
  const [open, setOpen] = useState(false)
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    value
  )
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setSelectedRange(value)
  }, [value])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  const apply = () => {
    onChange?.(selectedRange)
    setOpen(false)
  }

  const clear = () => {
    setSelectedRange(undefined)
    onChange?.(undefined)
  }

  const quickSet = (days: number) => {
    const to = startOfToday()
    const from = subDays(to, days - 1)
    const range: DateRange = { from, to }
    setSelectedRange(range)
    onChange?.(range)
    setOpen(false)
  }

  const prettyLabel = () => {
    if (!selectedRange?.from || !selectedRange?.to)
      return `Timeframe: ${placeholder}`
    const f = (d: Date) => format(d, 'MMM d, yyyy')
    return `${f(selectedRange.from)} — ${f(selectedRange.to)}`
  }

  return (
    <div ref={containerRef} className='relative inline-block text-left'>
      <button
        onClick={() => setOpen((s) => !s)}
        className='flex items-center gap-2 rounded-full bg-white p-3 text-base font-medium'
        aria-haspopup='dialog'
        aria-expanded={open}
      >
        <span className='text-gray-800'>{prettyLabel()}</span>
        <ChevronDown className='h-4 w-4 text-gray-400' />
      </button>

      {open && (
        <div
          className='absolute right-0 z-50 mt-2 w-[840px] max-w-[95vw] rounded-lg bg-white p-4'
          role='dialog'
          aria-label='Select timeframe'
        >
          <div className='grid grid-cols-12 gap-4'>
            {/* Calendars (single DayPicker rendering 2 months) */}
            <div className='col-span-9'>
              <div className='w-full overflow-hidden pr-2'>
                <DayPicker
                  mode='range'
                  selected={selectedRange}
                  onSelect={(r) => setSelectedRange(r ?? undefined)}
                  numberOfMonths={2}
                  fixedWeeks={false}
                  showOutsideDays
                  className='two-months-datepicker'
                />
              </div>
            </div>

            {/* Quick options */}
            <div className='col-span-3 border-l pl-3'>
              <div className='mb-2 text-sm font-medium'>Quick options</div>

              <div className='flex flex-col gap-2'>
                <button
                  onClick={() => quickSet(15)}
                  className='rounded-md p-2 text-left text-sm hover:bg-gray-50'
                >
                  Last 15 Days
                </button>

                <button
                  onClick={() => quickSet(30)}
                  className='rounded-md bg-blue-50 px-3 py-2 text-left text-sm text-blue-700 hover:bg-gray-50'
                >
                  Last 30 Days
                </button>

                <button
                  onClick={() => quickSet(60)}
                  className='rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50'
                >
                  Last 60 Days
                </button>
              </div>

              <div className='mt-4 border-t pt-3'>
                <div className='text-xs text-gray-500'>Selected</div>
                <div className='mt-2 text-sm text-gray-700'>
                  {selectedRange?.from && selectedRange?.to ? (
                    <>
                      <div>{format(selectedRange.from, 'MMM d, yyyy')}</div>
                      <div className='text-gray-400'>
                        {format(selectedRange.to, 'MMM d, yyyy')}
                      </div>
                    </>
                  ) : (
                    <div className='text-gray-400'>No range selected</div>
                  )}
                </div>
              </div>

              {/* actions */}
              <div className='mt-4 flex items-center gap-2'>
                <button
                  onClick={() => {
                    clear()
                    setOpen(false)
                  }}
                  className='rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50'
                >
                  Clear
                </button>
                <button
                  onClick={apply}
                  className='ml-auto rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500'
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
