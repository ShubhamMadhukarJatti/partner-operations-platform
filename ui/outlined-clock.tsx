import React, { useState } from 'react'

interface TimeInputProps {
  value?: string
  onChange: (time: string) => void
  className?: string
  label: string
}

const TimeInput: React.FC<TimeInputProps> = ({
  value = '',
  onChange,
  className = '',
  label
}) => {
  const [hour, setHour] = useState<number>(
    value ? parseInt(value.split(':')[0]) : 12
  )
  const [minute, setMinute] = useState<number>(
    value ? parseInt(value.split(':')[1].split(' ')[0]) : 0
  )
  const [ampm, setAmpm] = useState<string>(value ? value.split(' ')[1] : 'AM')

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHour = Math.min(Math.max(parseInt(e.target.value), 1), 12)
    setHour(newHour)
    onChange(
      `${newHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`
    )
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinute = Math.min(Math.max(parseInt(e.target.value), 0), 59)
    setMinute(newMinute)
    onChange(
      `${hour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')} ${ampm}`
    )
  }

  const toggleAmPm = () => {
    const newAmpm = ampm === 'AM' ? 'PM' : 'AM'
    setAmpm(newAmpm)
    onChange(
      `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${newAmpm}`
    )
  }

  return (
    <div className='relative flex w-fit gap-2'>
      <div>
        <label
          style={{ fontSize: '12px' }}
          className='absolute -top-2 left-2 z-10 bg-white px-1 text-slate-500'
        >
          {label}
        </label>

        <div
          className={`flex items-center space-x-2 rounded-md border border-inputField-border bg-inputField-bg p-2 pb-1 ${className}`}
        >
          <input
            type='number'
            value={hour}
            onChange={handleHourChange}
            min='1'
            max='12'
            className='w-16 border-b-2 border-transparent bg-transparent text-center text-inputField-content focus:border-inputField-ring focus:outline-none focus:ring-0'
            aria-label='Hour'
          />
          <span className='text-xl text-inputField-content'>:</span>
          <input
            type='number'
            value={minute}
            onChange={handleMinuteChange}
            min='0'
            max='59'
            className='w-16 border-b-2 border-transparent bg-transparent text-center text-inputField-content focus:border-inputField-ring focus:outline-none focus:ring-0'
            aria-label='Minute'
          />
        </div>
      </div>

      <div className='inline-flex h-[70%] overflow-hidden rounded-lg border border-gray-300'>
        <button
          type='button'
          onClick={() => {
            toggleAmPm()
            setAmpm('AM')
          }}
          className={`w-14 py-2 text-sm font-semibold transition-colors duration-150
          ${
            ampm === 'AM'
              ? 'bg-white text-gray-800 shadow-md'
              : 'bg-gray-100 text-gray-500'
          }
          flex items-center justify-center rounded-l-lg border-r border-gray-300

        `}
        >
          AM
        </button>
        <button
          type='button'
          onClick={() => {
            setAmpm('PM')
            toggleAmPm()
          }}
          className={`w-14 py-2 text-sm font-semibold transition-colors duration-150
          ${
            ampm === 'PM'
              ? 'bg-white text-gray-800 shadow-md'
              : 'bg-gray-100 text-gray-500'
          }
          flex items-center justify-center rounded-r-lg
        `}
        >
          PM
        </button>
      </div>
    </div>
  )
}

export default TimeInput
